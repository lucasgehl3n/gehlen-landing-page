import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs';
const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, ''); const D = process.env.OUT || ROOT + '/shots'; fs.mkdirSync(D, { recursive: true }); const port = 4340;
const srv = spawn('python3', ['-m', 'http.server', String(port), '-d', `${ROOT}/dist`], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const url = `http://127.0.0.1:${port}/`; const b = await chromium.launch(); const rep = {};
const ALL = { mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, tablet: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true }, desktop: { viewport: { width: 1440, height: 900 } }, wide: { viewport: { width: 1920, height: 1080 } } };
const vps = Object.fromEntries(Object.entries(ALL).filter(([k]) => !process.env.VPS || process.env.VPS.split(',').includes(k)));
async function drag(p, x1, y1, x2, y2, steps = 12) { await p.mouse.move(x1, y1); await p.mouse.down(); for (let i = 1; i <= steps; i++) { await p.mouse.move(x1 + (x2 - x1) * i / steps, y1 + (y2 - y1) * i / steps); await p.waitForTimeout(16); } await p.mouse.up(); }
const open = (p) => p.evaluate(() => !document.querySelector('#st').hidden);
const head = (p) => p.textContent('.st__head .state'); const k = (p) => p.textContent('.st__k');
const rowSel = (set, kind) => `.r--${kind} button[data-row]`;
const rowIdx = (p, pred) => p.evaluate((pred) => window.__home.rows.findIndex(new Function('r', `return ${pred}`)), pred);
const toRow = (p, i, f = 0.45) => p.evaluate(([i, f]) => scrollTo({ top: window.__home.rowY(i) - innerHeight * f, behavior: 'instant' }), [i, f]);
async function typeCmd(p, c) { await p.click('#cmd'); await p.keyboard.type(c, { delay: 25 }); await p.keyboard.press('Enter'); await p.waitForTimeout(700); }
const AA = () => {
  const rgb = (s) => { const m = s.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
  const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const mix = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const bgOf = (el) => { const st = [], w = el.getBoundingClientRect().width; for (let e = el; e; e = e.parentElement) { if (e !== el && e.getBoundingClientRect().width < w) continue; const c = rgb(getComputedStyle(e).backgroundColor); if (c.a > 0) st.push(c); if (c.a >= 1) break; } let b = { r: 25, g: 29, b: 27, a: 1 }; for (const c of st.reverse()) b = mix(c, b); return b; };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') || el.closest('[hidden]') || el.closest('[aria-hidden=true]')) continue;
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!txt) continue;
    const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || r.width === 0) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.98) continue; // em transição
    const bg = bgOf(el), fg = mix({ ...rgb(cs.color), a: rgb(cs.color).a }, bg);
    const L1 = lum(fg), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), big = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700);
    if (ratio < (big ? 3 : 4.5)) out.push(`${ratio.toFixed(2)} ${px}px "${txt.slice(0, 30)}" .${el.className}`);
  }
  return out;
};
for (const [vn, opt] of Object.entries(vps)) {
  const ctx = await b.newContext(opt); const p = await ctx.newPage(); const errs = []; const ok = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
  const W = opt.viewport.width >= 1200;
  const shot = (n) => p.screenshot({ path: `${D}/lucas-gehlen-cv-${vn}-home-${n}.png` });
  const shotEl = async (n, s) => { await p.evaluate((s) => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - Math.max(120, (innerHeight - e.offsetHeight) / 2), behavior: 'instant' }); }, s); await p.waitForTimeout(1100); await shot(n); };
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await shot('1-topo');
  // grid e alinhamento: percorre a página para acender tudo e mede nó x âncora do cartão
  for (let y = 0; y < 14000; y += 700) { await p.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(60); }
  await p.waitForTimeout(700);
  const al = await p.evaluate(() => window.__home.align()); rep[vn + 'Align'] = al;
  ok.push([`nós alinhados com a linha do cartão (pior caso ${al.worst}px)`, al.worst <= 2]);
  ok.push(['sem rolagem horizontal', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)]);
  ok.push(['visuais novos: mapa, shortlog, stack no tempo, Compass, Conecta, formação', await p.evaluate(() => !!document.querySelector('.blk--remote .vz-map') && document.querySelectorAll('.sl__r').length === 5 && document.querySelectorAll('.sm__r').length === 12 && document.querySelectorAll('.r--era-v .e__vis svg').length >= 3 && !!document.querySelector('.g__vis svg'))]);
  await shotEl('v1-remote', '.blk--remote'); await shotEl('v2-shortlog', '.blk--sl'); await shotEl('v3-compass', '.r--era-v');
  await shotEl('v4-conecta', '.r--era-v:nth-of-type(n) ~ .r--era-v'); await shotEl('v5-formacao', '.r--grad'); await shotEl('v6-stack', '.blk--sm');
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(500);
  ok.push(['grafo com branches, nós e HEAD pulsando', await p.evaluate(() => document.querySelectorAll('.graph .node').length > 30 && document.querySelectorAll('.graph .edge').length >= 8 && !!document.querySelector('.n-pulse'))]);
  // grafo escrito no scroll
  const clip0 = await p.evaluate(() => +document.querySelector('#pen rect').getAttribute('height'));
  const mapa = await rowIdx(p, "r.merge==='mapa'"); await toRow(p, mapa); await p.waitForTimeout(900);
  const clip1 = await p.evaluate(() => +document.querySelector('#pen rect').getAttribute('height'));
  ok.push(['scroll escreve o grafo (clip cresce e nós acendem)', clip1 > clip0 + 300 && (await p.evaluate(() => document.querySelectorAll('.node.lit').length)) > 10]);
  ok.push(['linha do tempo aparece e marca o ano', await p.evaluate(() => document.querySelector('.scrub').classList.contains('on') && /20\d\d|hoje/.test(document.querySelector('.scrub__y').textContent))]);
  await shot('2-meio');
  // prévia
  const sh = await rowIdx(p, "r.kind==='c'&&r.set==='shorts'&&r.s===1"); await toRow(p, sh, 0.5); await p.waitForTimeout(500);
  const btn = p.locator(`button[data-row="${sh}"]`);
  if (W) { await btn.hover(); await p.waitForTimeout(500); ok.push(['hover no commit mostra prévia rica no painel', (await p.textContent('.peek__in')).includes('infraestrutura') && (await p.locator('.peek__in .tz').count()) > 0]); }
  else { await btn.tap(); await p.waitForTimeout(500); ok.push(['toque no commit abre folha de prévia', await p.evaluate(() => !document.querySelector('.sheet').hidden && document.querySelector('.sheet__c').textContent.includes('infraestrutura'))]); }
  await shot('3-preview');
  await p.click(W ? '.peek__in .pk__open' : '.sheet__c .pk__open'); await p.waitForTimeout(600);
  ok.push(['botão da prévia abre os stories no story certo', (await open(p)) && (await k(p)).includes('2 de 4')]);
  // stories: gestos
  const box = await p.locator('#card').boundingBox();
  await p.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.25); await p.mouse.down(); await p.waitForTimeout(450);
  ok.push(['segurar pausa o story', await p.evaluate(() => document.querySelector('#st').classList.contains('paused'))]); await p.mouse.up(); await p.waitForTimeout(200);
  const r = await p.locator('#qr').boundingBox(); await drag(p, r.x + 13, r.y + r.height / 2, r.x + r.width - 4, r.y + r.height / 2, 14); await p.waitForTimeout(300);
  ok.push(['seletor de qualidade vai a 1080p', (await p.textContent('.qv')) === '1080p']);
  await p.mouse.click(box.x + box.width * 0.85, box.y + box.height * 0.2); await p.waitForTimeout(500);
  ok.push(['tap à direita avança', (await k(p)).includes('3 de 4')]);
  await drag(p, box.x + box.width * 0.8, box.y + box.height * 0.3, box.x + box.width * 0.15, box.y + box.height * 0.32); await p.waitForTimeout(600);
  ok.push(['swipe troca de projeto', !(await head(p)).includes('Shorts')]);
  await drag(p, box.x + box.width * 0.5, box.y + box.height * 0.2, box.x + box.width * 0.52, box.y + box.height * 0.7); await p.waitForTimeout(600);
  ok.push(['swipe para baixo fecha', !(await open(p))]);
  if (!W) { await p.evaluate(() => document.querySelector('[data-sheet-close]')?.click()); await p.waitForTimeout(300); }
  // terminal
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(300);
  await typeCmd(p, 'git log --tag=formacao');
  ok.push(['git log --tag=formacao filtra o grafo', await p.evaluate(() => document.querySelectorAll('.r.off').length > 15 && document.querySelector('[data-f="Formação"]').getAttribute('aria-pressed') === 'true')]);
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(300);
  await typeCmd(p, 'git show pelos-caminhos'); await p.waitForTimeout(500);
  ok.push(['git show pelos-caminhos abre a prévia', W ? (await p.textContent('.peek__in')).includes('Pelos Caminhos') : await p.evaluate(() => !document.querySelector('.sheet').hidden && document.querySelector('.sheet__c').textContent.includes('Pelos Caminhos'))]);
  if (!W) { await p.click('[data-sheet-close]'); await p.waitForTimeout(300); }
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(200);
  await p.click('[data-cmd="git branch"]'); await p.waitForTimeout(1200);
  ok.push(['sugestão clicável roda o comando', (await p.textContent('.term__out')).includes('segunda-cidade')]);
  await shot('4-terminal');
  await typeCmd(p, 'git checkout shorts-hls');
  ok.push(['git checkout shorts-hls abre os stories', (await open(p)) && (await head(p)).includes('Shorts')]);
  await p.waitForTimeout(900); const stAA = []; for (let s = 0; s < 4; s++) { stAA.push(...await p.evaluate(AA)); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(900); }
  rep[vn + 'StoriesAA'] = [...new Set(stAA)]; ok.push([`contraste AA nos stories (${rep[vn + 'StoriesAA'].length} falhas)`, rep[vn + 'StoriesAA'].length === 0]);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await typeCmd(p, 'git log');
  // scrub
  await p.evaluate(() => scrollTo({ top: window.__home.rowY(5), behavior: 'instant' })); await p.waitForTimeout(500);
  const t = await p.locator('.scrub__t').boundingBox(); await p.mouse.click(t.x + t.width * ((2020.3 - 2015) / 11), t.y + 10); await p.waitForTimeout(600);
  ok.push(['clicar em 2020 na linha do tempo leva à Conecta', /2020|2021/.test(await p.textContent('.scrub__y'))]);
  // rodapé
  await p.evaluate(() => document.querySelector('#contato').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(400);
  await p.fill('#msg', 'oi, Lucas. Vamos conversar?'); await p.waitForTimeout(200);
  ok.push(['mensagem do commit atualiza o rodapé e o mailto', (await p.textContent('.foot__msg')).includes('conversar') && (await p.getAttribute('.foot__send', 'href')).includes('conversar')]);
  await p.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(300);
  await shot('5-rodape');
  // tema único escuro + contraste AA
  ok.push(['tema único escuro, sem toggle', await p.evaluate(() => getComputedStyle(document.documentElement).backgroundColor === 'rgb(25, 29, 27)' && !document.querySelector('[data-theme-toggle]'))]);
  const fails = [];
  for (const y of [0, 0.25, 0.5, 0.75, 1]) {
    await p.evaluate((y) => scrollTo({ top: (document.body.scrollHeight - innerHeight) * y, behavior: 'instant' }), y); await p.waitForTimeout(900);
    fails.push(...await p.evaluate(AA));
  }
  rep[vn + 'AA'] = [...new Set(fails)];
  ok.push([`contraste AA no texto visível (${rep[vn + 'AA'].length} falhas)`, rep[vn + 'AA'].length === 0]);
  await toRow(p, mapa); await p.waitForTimeout(900); await shot('6-mapa');
  const fps = await p.evaluate(() => window.__fps());
  await ctx.close();
  rep[vn] = { fps, errors: errs, checks: ok.map(([n, v]) => `${v ? 'OK ' : 'FALHOU '}${n}`) };
}
// movimento reduzido
const c3 = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const p3 = await c3.newPage(); const e3 = [];
p3.on('pageerror', (e) => e3.push(e.message)); p3.on('console', (m) => m.type() === 'error' && e3.push(m.text()));
await p3.goto(url, { waitUntil: 'networkidle' }); await p3.waitForTimeout(800);
const full = await p3.evaluate(() => +document.querySelector('#pen rect').getAttribute('height') >= document.querySelector('.rows').offsetHeight);
await p3.evaluate(() => window.__home.run('git checkout shorts-hls')); await p3.waitForTimeout(2500);
rep.reducedMotion = { errors: e3, grafoCompletoSemAnimacao: full, autoAdvanceOff: (await p3.textContent('.st__k')).includes('1 de 4') };
await c3.close();
// vídeos curtos: grafo escrito no scroll + interação
for (const [vn, opt] of Object.entries(vps)) {
  const ctx = await b.newContext({ ...opt, recordVideo: { dir: `/tmp/rsv-${vn}`, size: opt.viewport } }); const p = await ctx.newPage();
  const W = opt.viewport.width >= 1200;
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  await p.click('[data-cmd="git show shorts-hls"]'); await p.waitForTimeout(1600);
  if (!W) { await p.click('[data-sheet-close]'); await p.waitForTimeout(300); }
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(300);
  for (let i = 0; i < 70; i++) { await p.mouse.wheel(0, 130); await p.waitForTimeout(60); }
  const i = await p.evaluate(() => window.__home.rows.findIndex((r) => r.merge === 'pelos'));
  await p.evaluate((i) => scrollTo({ top: window.__home.rowY(i) - innerHeight * 0.45, behavior: 'smooth' }), i); await p.waitForTimeout(1200);
  const bt = p.locator(`button[data-row="${i}"]`);
  if (W) { await bt.hover(); await p.waitForTimeout(1200); await bt.click(); } else { await bt.tap(); await p.waitForTimeout(1300); await p.click('.sheet__c .pk__open'); }
  await p.waitForTimeout(1800); await p.click('[data-b="raca"]'); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  const t = await p.locator('.scrub__t').boundingBox(); await drag(p, t.x + t.width * 0.95, t.y + 10, t.x + t.width * 0.15, t.y + 10, 30); await p.waitForTimeout(900);
  const vid = await p.video().path(); await ctx.close(); fs.copyFileSync(vid, `${D}/lucas-gehlen-cv-${vn}-home.webm`);
}
const c4 = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 }); const p4 = await c4.newPage(); const e4 = [];
p4.on('pageerror', (e) => e4.push(e.message)); p4.on('console', (m) => m.type() === 'error' && e4.push(m.text()));
await p4.goto(url + 'brand.html', { waitUntil: 'networkidle' }); await p4.waitForTimeout(600);
await p4.screenshot({ path: `${D}/brand-sheet.png`, fullPage: true }); await p4.setViewportSize({ width: 1440, height: await p4.evaluate(() => document.body.scrollHeight) }); await p4.waitForTimeout(300); rep.brand = { errors: e4, AA: await p4.evaluate(AA) };
await b.close(); srv.kill(); console.log(JSON.stringify(rep, null, 1)); fs.writeFileSync(`${ROOT}/test-report.json`, JSON.stringify(rep, null, 1));
