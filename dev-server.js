// Runs the site on your own computer for testing: `npm run dev`, then open http://localhost:3000
// Vercel does all of this for you once deployed; this file is only for local use.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import postHandler from './api/post.js';
import imgHandler from './api/img.js';

const PORT = Number(process.env.PORT) || 3000;
const page = new URL('./index.html', import.meta.url);

function addHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return res; };
  res.send = (body) => { res.end(body); return res; };
  return res;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(url.searchParams);
  addHelpers(res);
  try {
    if (url.pathname === '/api/post') return await postHandler(req, res);
    if (url.pathname === '/api/img') return await imgHandler(req, res);
    if (url.pathname === '/' || url.pathname === '/index.html' || /^\/[^/]+\/status\/\d+/.test(url.pathname)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(await readFile(page));
    }
    res.status(404).send('Not found');
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).send('Server error');
  }
}).listen(PORT, () => console.log(`Post Wreckers running at http://localhost:${PORT}`));
