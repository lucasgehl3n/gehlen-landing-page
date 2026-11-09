import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const D = `${ROOT}/shots/cafe`;
fs.mkdirSync(D, { recursive: true });
const port = 4355;

async function startServer() {
  try { spawn('fuser', ['-k', `${port}/tcp`], { stdio: 'ignore' }); } catch {}
  await new Promise((r) => setTimeout(r, 300));
  const srv = spawn('node', [`${ROOT}/cafe-server.mjs`, String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server timeout')), 8000);
    srv.stdout.on('data', (b) => { if (String(b).includes('cafe-server')) { clearTimeout(t); resolve(); } });
    srv.stderr.on('data', (b) => process.stderr.write(b));
  });
  return srv;
}

const url = `http://127.0.0.1:${port}/`;
const b = await chromium.launch();
const views = [
  ['390', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ['1440', { viewport: { width: 1440, height: 900 } }],
];

async function shotCafe(p, path) {
  const el = p.locator('#cafe');
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await el.screenshot({ path });
}

for (const [n, o] of views) {
  const srv = await startServer();
  const c = await b.newContext({ ...o, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForSelector('[data-cafe-offer]:not([disabled])');
  await p.waitForTimeout(500);
  await shotCafe(p, `${D}/antes-${n}.png`);
  await p.click('[data-cafe-offer]');
  await p.waitForFunction(() => {
    const btn = document.querySelector('[data-cafe-offer]');
    return btn?.disabled && /anotado/i.test(btn.textContent || '');
  });
  await p.waitForTimeout(300);
  await shotCafe(p, `${D}/depois-${n}.png`);
  await c.close();
  srv.kill();
  await new Promise((r) => setTimeout(r, 200));
}

await b.close();
console.log('shots in', D);
for (const f of fs.readdirSync(D).sort()) console.log(' ', f, fs.statSync(`${D}/${f}`).size);
