// Prints para revisão: node shots.mjs <pasta>. Serve o dist/ local.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs';
const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, ''); const D = `${ROOT}/${process.argv[2] || 'shots/git-volta'}`; fs.mkdirSync(D, { recursive: true });
const port = 4351; const srv = spawn('python3', ['-m', 'http.server', String(port), '-d', `${ROOT}/dist`], { stdio: 'ignore' }); await new Promise((r) => setTimeout(r, 700));
const url = `http://127.0.0.1:${port}/`; const b = await chromium.launch();
const M = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, W = { viewport: { width: 1440, height: 900 } };
async function histShot(p, path) {
  await p.evaluate(() => { const e = document.querySelector('.hist'); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }); });
  await p.waitForTimeout(900);
  // mostra o título Histórico + primeiros merges com Merge branch / tag
  const r = await p.evaluate(() => {
    const head = document.querySelector('.hist').getBoundingClientRect();
    const tag = document.querySelector('.r--tag')?.getBoundingClientRect();
    const top = head.top + scrollY - 16;
    const bottom = (tag ? tag.bottom : head.bottom) + scrollY + 24;
    return { y: Math.max(0, top), h: Math.min(bottom - top, 2200), w: document.documentElement.clientWidth };
  });
  await p.screenshot({ path, fullPage: true, clip: { x: 0, y: r.y, width: r.w, height: r.h } });
}
for (const [n, o] of [['390', M], ['1440', W]]) {
  const c = await b.newContext({ ...o, reducedMotion: 'reduce' }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.screenshot({ path: `${D}/home-${n}-hero.png` });
  await histShot(p, `${D}/home-${n}-historico.png`);
  await c.close();
}
await b.close(); srv.kill();
