// Serve dist/ + /api/cafe com store em memória (sem Blob). Uso: node cafe-server.mjs [porta]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.argv[2] || 4355);

process.env.BLOB_READ_WRITE_TOKEN = ''; // força memória
process.env.CAFE_IP_SALT = process.env.CAFE_IP_SALT || 'local-dev-salt';

const { default: cafe } = await import(pathToFileURL(path.join(ROOT, 'api/cafe.js')).href);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendFile(res, file) {
  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

const srv = http.createServer(async (req, res) => {
  const u = new URL(req.url || '/', `http://127.0.0.1:${PORT}`);
  if (u.pathname === '/api/cafe' || u.pathname === '/api/cafe/') {
    return cafe(req, res);
  }
  let rel = decodeURIComponent(u.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(DIST, rel));
  if (!file.startsWith(DIST)) {
    res.writeHead(403); return res.end('forbidden');
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return sendFile(res, file);
  res.writeHead(404); res.end('not found');
});

srv.listen(PORT, '127.0.0.1', () => {
  console.log(`cafe-server http://127.0.0.1:${PORT}/`);
});
