// Zero-dependency dev server. Serves the project folder and converts .ts files to JavaScript on the fly
// using Node's built-in TypeScript type stripping (Node.js 22.13+ / 23.2+; recommended 24 LTS or newer).
//
//   node tools/dev-server.mjs [port]     ->  http://localhost:5173

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 5173);
const HOST = process.env.HOST ?? '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.ts': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
};

// Silence the one-time "stripTypeScriptTypes is experimental" warning.
const emitWarning = process.emitWarning;
process.emitWarning = (w, ...rest) => (String(w).includes('stripTypeScriptTypes') ? undefined : emitWarning.call(process, w, ...rest));

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = normalize(join(ROOT, rel));
    if (!file.startsWith(ROOT + sep) && file !== ROOT) {
      res.writeHead(403).end('forbidden');
      return;
    }
    const info = await stat(file).catch(() => null);
    if (!info || !info.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end(`not found: ${rel}`);
      return;
    }
    const ext = extname(file).toLowerCase();
    let body = await readFile(file);
    if (ext === '.ts') {
      try {
        body = Buffer.from(stripTypeScriptTypes(body.toString('utf8'), { mode: 'strip' }));
      } catch (err) {
        const msg = `TypeScript error in ${rel}: ${err.message}`;
        console.error(msg);
        body = Buffer.from(`throw new Error(${JSON.stringify(msg)});`);
      }
    }
    res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`dev server: http://${HOST === '127.0.0.1' ? 'localhost' : HOST}:${PORT}/  (root ${ROOT})`);
});
