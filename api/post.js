import { extractId, getPost } from '../lib/x.js';

// GET /api/post?id=<post link or ID>
export default async function handler(req, res) {
  const id = extractId(req.query.id || req.query.url);
  if (!id) {
    return res.status(400).json({ error: "That doesn't look like a link to a post. It should contain /status/ followed by numbers." });
  }
  try {
    const r = await getPost(id);
    if (r.notFound) {
      return res.status(404).json({ error: "Couldn't find that post. It may have been deleted, or the account may be private or suspended." });
    }
    if (r.unavailable) {
      return res.status(404).json({ error: "X won't share that post outside its site. It may be age-restricted or from a protected account." });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json(r.post);
  } catch (e) {
    return res.status(502).json({ error: "X didn't answer the lookup. Try again in a moment, or use a screenshot instead." });
  }
}
