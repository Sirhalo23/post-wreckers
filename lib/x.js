// Looks up a post on X through the public data feed that X's own embedded posts use.
// This feed is unofficial: X can change or block it at any time.

const FEED = 'https://cdn.syndication.twimg.com/tweet-result';
export const IMAGE_HOSTS = ['pbs.twimg.com', 'abs.twimg.com'];

// Accepts a full link (x.com, twitter.com, mobile, fxtwitter, vxtwitter, ...) or a bare post ID.
export function extractId(input) {
  const s = String(input || '').trim();
  if (/^\d{1,25}$/.test(s)) return s;
  const m = s.match(/\/status(?:es)?\/(\d{1,25})/i);
  return m ? m[1] : null;
}

function token(id) {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function cleanText(t) {
  const chars = [...(t.text || '')];
  const [a, b] = Array.isArray(t.display_text_range) ? t.display_text_range : [0, chars.length];
  let text = chars.slice(a, b).join('');
  // Swap shortened t.co links for the readable version people see on X.
  for (const u of (t.entities && t.entities.urls) || []) {
    if (u.url && u.display_url) text = text.split(u.url).join(u.display_url);
  }
  // Media links sometimes sit inside the visible range; drop them.
  for (const m of (t.entities && t.entities.media) || []) {
    if (m.url) text = text.split(m.url).join('');
  }
  text = decodeEntities(text).trim();
  if (t.note_tweet) text += '…';
  return text;
}

export async function getPost(id) {
  const url = new URL(FEED);
  url.searchParams.set('id', id);
  url.searchParams.set('lang', 'en');
  url.searchParams.set('token', token(id));

  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; PostWreckers/1.0)' } });
  if (r.status === 404) return { notFound: true };
  if (!r.ok) throw new Error('Feed answered ' + r.status);
  const ct = r.headers.get('content-type') || '';
  if (!ct.includes('json')) throw new Error('Feed sent something other than JSON');
  const t = await r.json();
  if (!t || Object.keys(t).length === 0) return { notFound: true };
  if (t.__typename === 'TweetTombstone') return { unavailable: true };
  if (!t.user) return { notFound: true };

  const media = (t.mediaDetails || []).find((m) => m.media_url_https);
  return {
    post: {
      id: t.id_str || id,
      name: t.user.name || '',
      handle: '@' + (t.user.screen_name || ''),
      avatar: t.user.profile_image_url_https
        ? t.user.profile_image_url_https.replace('_normal.', '_200x200.')
        : null,
      text: cleanText(t),
      media: media
        ? {
            url: media.media_url_https + (media.media_url_https.includes('?') ? '' : '?name=small'),
            width: (media.original_info && media.original_info.width) || null,
            height: (media.original_info && media.original_info.height) || null,
            kind: media.type,
          }
        : null,
      createdAt: t.created_at || null,
      replies: typeof t.conversation_count === 'number' ? t.conversation_count : null,
      likes: typeof t.favorite_count === 'number' ? t.favorite_count : null,
      url: 'https://x.com/' + (t.user.screen_name || 'i') + '/status/' + (t.id_str || id),
    },
  };
}
