import { IMAGE_HOSTS } from '../lib/x.js';

const MAX_BYTES = 8 * 1024 * 1024;

// GET /api/img?u=<image URL on X's image servers>
// Serves avatars and attached images from this site's own address so the game can draw and slice them.
export default async function handler(req, res) {
  let u;
  try {
    u = new URL(String(req.query.u || ''));
  } catch {
    return res.status(400).json({ error: 'Bad image address.' });
  }
  if (u.protocol !== 'https:' || !IMAGE_HOSTS.includes(u.hostname)) {
    return res.status(400).json({ error: 'Only images from X can be loaded.' });
  }
  try {
    const r = await fetch(u);
    if (!r.ok) return res.status(r.status).end();
    const ct = r.headers.get('content-type') || '';
    if (!ct.startsWith('image/')) return res.status(415).end();
    const len = Number(r.headers.get('content-length') || 0);
    if (len > MAX_BYTES) return res.status(413).end();
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAX_BYTES) return res.status(413).end();
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    return res.status(200).send(buf);
  } catch {
    return res.status(502).end();
  }
}
