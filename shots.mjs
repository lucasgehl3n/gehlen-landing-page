// Prints para revisão: node shots.mjs <pasta>. Serve o dist/ local.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs';
const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, ''); const D = `${ROOT}/${process.argv[2] || 'shots/humanize/depois'}`; fs.mkdirSync(D, { recursive: true });
const port = 4351; const srv = spawn('python3', ['-m', 'http.server', String(port), '-d', `${ROOT}/dist`], { stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 700));
const url = `http://127.0.0.1:${port}/`; const b = await chromium.launch();
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, W = { viewport: { width: 1440, height: 900 } };
for (const [n, o] of [['390', M], ['1440', W]]) {
  const c = await b.newContext({ ...o, reducedMotion: 'reduce' }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${D}/home-${n}-hero.png` });
  await p.screenshot({ path: `${D}/home-${n}-full.png`, fullPage: true });
  if (n === '390') { await p.goto(url + 'servicos/', { waitUntil: 'networkidle' }); await p.waitForTimeout(900); await p.screenshot({ path: `${D}/servicos-390-full.png`, fullPage: true }); await p.screenshot({ path: `${D}/servicos-390-topo.png` }); }
  await c.close();
}
await b.close(); srv.kill();
