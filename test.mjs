import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs';
const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, ''); const D = process.env.OUT || ROOT + '/shots'; fs.mkdirSync(D, { recursive: true }); const port = 4340;
const srv = spawn('python3', ['-m', 'http.server', String(port), '-d', `${ROOT}/dist`], { stdio: 'ignore' });
for (let i = 0; i < 40; i++) {
  try { await fetch(`http://127.0.0.1:${port}/`); break; } catch { await new Promise((r) => setTimeout(r, 150)); if (i === 39) throw new Error('http.server não subiu'); }
}
const url = `http://127.0.0.1:${port}/`; const b = await chromium.launch(); const rep = {};
// Lucas: 'simulação' não pode aparecer em lugar nenhum do site (tag, legenda, alt, build).
{
  const hits = [];
  for (const f of fs.readdirSync(`${ROOT}/dist`, { recursive: true })) {
    const p = `${ROOT}/dist/${f}`;
    if (!fs.statSync(p).isFile()) continue;
    if (!/\.(html|js|css|svg|json|txt|xml)$/i.test(f)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    if (/simula[cç][aã]o/i.test(raw)) hits.push(f);
  }
  if (hits.length) { console.error('FAIL: simulação no build →', hits); process.exit(1); }
  console.log('ok: nenhuma ocorrência de simulação no dist/');
}
const ALL = { mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, tablet: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true }, desktop: { viewport: { width: 1440, height: 900 } }, wide: { viewport: { width: 1920, height: 1080 } } };
const vps = Object.fromEntries(Object.entries(ALL).filter(([k]) => !process.env.VPS || process.env.VPS.split(',').includes(k)));
async function drag(p, x1, y1, x2, y2, steps = 12) { await p.mouse.move(x1, y1); await p.mouse.down(); for (let i = 1; i <= steps; i++) { await p.mouse.move(x1 + (x2 - x1) * i / steps, y1 + (y2 - y1) * i / steps); await p.waitForTimeout(16); } await p.mouse.up(); }
const open = (p) => p.evaluate(() => !document.querySelector('#st').hidden);
const head = (p) => p.textContent('.st__head .state'); const k = (p) => p.textContent('.st__k');
const rowSel = (set, kind) => `.r--${kind} button[data-row]`;
const rowIdx = (p, pred) => p.evaluate((pred) => window.__home.rows.findIndex(new Function('r', `return ${pred}`)), pred);
const toRow = (p, i, f = 0.45) => p.evaluate(([i, f]) => scrollTo({ top: window.__home.rowY(i) - innerHeight * f, behavior: 'instant' }), [i, f]);
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
  const cut = await p.evaluate(() => { const out = [];
    for (const s of document.querySelectorAll('main svg[viewBox]:not(.graph)')) { const vb = s.viewBox.baseVal; const ts = [...s.querySelectorAll('text')], bx = ts.map((x) => x.getBBox());
      ts.forEach((x, i) => { const q = bx[i]; if (q.width && (q.x < vb.x - .5 || q.y < vb.y - .5 || q.x + q.width > vb.x + vb.width + .5 || q.y + q.height > vb.y + vb.height + .5)) out.push('fora do svg: ' + x.textContent); });
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = bx[i], c = bx[j]; if (a.width && c.width && a.x < c.x + c.width - .5 && c.x < a.x + a.width - .5 && a.y < c.y + c.height - .5 && c.y < a.y + a.height - .5) out.push('sobreposto: ' + ts[i].textContent + ' x ' + ts[j].textContent); } }
    for (const e of document.querySelectorAll('main *')) { if (e.children.length || !e.textContent.trim() || e.classList.contains('sr')) continue; const cs = getComputedStyle(e); if (cs.display !== 'none' && (cs.overflow.includes('hidden') || cs.textOverflow === 'ellipsis') && e.clientWidth && e.scrollWidth > e.clientWidth + 1) out.push('cortado: ' + e.textContent.slice(0, 40)); }
    return out; });
  rep[vn + 'Cortes'] = cut; ok.push([`nenhum rótulo cortado ou sobreposto (${cut.length})`, cut.length === 0]);
  await shotEl('v1-remote', '.blk--remote'); await shotEl('v2-shortlog', '.blk--sl'); await shotEl('v3-compass', '.r--era-v');
  await shotEl('v4-conecta', '.r--era-v:nth-of-type(n) ~ .r--era-v'); await shotEl('v5-formacao', '.r--grad'); await shotEl('v6-stack', '.blk--sm');
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(500);
  ok.push(['grafo com branches e nós, sem ponto pulsando', await p.evaluate(() => document.querySelectorAll('.graph .node').length > 30 && document.querySelectorAll('.graph .edge').length >= 8 && !document.querySelector('.n-pulse, .pulse, .penhead, .run__live'))]);
  ok.push(['nenhuma animação em loop na home', await p.evaluate(() => ![...document.querySelectorAll('*')].some((e) => getComputedStyle(e).animationIterationCount.includes('infinite')))]);
  ok.push(['sem terminal tipável, hash, simulação ou pontos pulsando', await p.evaluate(() => { const t = document.body.innerText; return !/HEAD ->|simulação|na fila/i.test(t) && !/\b[0-9a-f]{7}\b/.test(t) && !document.querySelector('.term, #cmd, [data-cmd], .foot__term, .pulse, .n-pulse, .penhead, .run__live'); })]);
  ok.push(['histórico com Merge branch, tags e títulos em comando', await p.evaluate(() => /Merge branch/.test(document.body.innerText) && document.body.innerText.includes('tag: tech-lead') && document.body.innerText.includes('primeiro commit da main') && document.body.innerText.includes('$ git remote -v') && document.body.innerText.includes('$ git shortlog') && document.body.innerText.includes('$ git log --stat') && document.body.innerText.includes('$ cat stack.txt') && !!document.querySelector('.m__git, .ref, .blk__cmd'))]);
  ok.push(['hero: pipeline da task com 7 passos, 4 de IA, sem status ao vivo', await p.evaluate(() => document.querySelectorAll('.run__i').length === 7 && document.querySelectorAll('.run__i--ia').length === 4 && document.querySelectorAll('.run__who--ia').length === 4 && !document.querySelector('.run__live, .pulse, .run__s, .run__sum, .run__bar') && !/simulação|na fila|rodando/i.test(document.querySelector('.run').innerText) && document.querySelectorAll('.run__t')[2].textContent.includes('Algumas tasks vão direto para um agente de IA') && !!document.querySelector('.run__node'))]);
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
  // filtros e atalhos
  await p.evaluate(() => document.querySelector('[data-f="Formação"]').click()); await p.waitForTimeout(500);
  ok.push(['filtro Formação apaga o resto do histórico', await p.evaluate(() => document.querySelectorAll('.r.off').length > 15 && document.querySelector('[data-f="Formação"]').getAttribute('aria-pressed') === 'true')]);
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(300);
  await p.mouse.move(2, 2); await p.evaluate(() => window.__home.show('pelos')); await p.waitForTimeout(1000);
  ok.push(['prévia do Pelos Caminhos abre no painel ou na folha', W ? (await p.textContent('.peek__in')).includes('Pelos Caminhos') : await p.evaluate(() => !document.querySelector('.sheet').hidden && document.querySelector('.sheet__c').textContent.includes('Pelos Caminhos'))]);
  if (!W) { await p.click('[data-sheet-close]'); await p.waitForTimeout(300); }
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(200);
  await p.evaluate(() => window.__home.open('shorts')); await p.waitForTimeout(700);
  ok.push(['abrir Shorts mostra os stories certos', (await open(p)) && (await head(p)).includes('Shorts')]);
  await p.waitForTimeout(900); const stAA = []; for (let s = 0; s < 4; s++) { stAA.push(...await p.evaluate(AA)); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(900); }
  rep[vn + 'StoriesAA'] = [...new Set(stAA)]; ok.push([`contraste AA nos stories (${rep[vn + 'StoriesAA'].length} falhas)`, rep[vn + 'StoriesAA'].length === 0]);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('[data-f="Tudo"]').click()); await p.waitForTimeout(300);
  // scrub
  await p.evaluate(() => scrollTo({ top: window.__home.rowY(5), behavior: 'instant' })); await p.waitForTimeout(500);
  const t = await p.locator('.scrub__t').boundingBox(); await p.mouse.click(t.x + t.width * ((2020.3 - 2015) / 11), t.y + 10); await p.waitForTimeout(600);
  ok.push(['clicar em 2020 na linha do tempo leva à Conecta', /2020|2021/.test(await p.textContent('.scrub__y'))]);
  // rodapé
  await p.evaluate(() => document.querySelector('#contato').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(400);
  ok.push(['rodapé com agendar no WhatsApp e e-mail', await p.evaluate(() => !!document.querySelector('.foot [data-agendar]') && document.querySelector('.foot__send').href.includes('subject='))]);
  ok.push(['café: botão, contador e aviso de que é grátis', await p.evaluate(() => {
    const s = document.querySelector('#cafe');
    if (!s) return false;
    const btn = s.querySelector('[data-cafe-offer]');
    const note = (s.querySelector('.cafe__note')?.textContent || '');
    return !!btn && /Me ofereça um café/i.test(btn.textContent) && /não custa nada/i.test(note) && !!s.querySelector('[data-cafe-count]');
  })]);
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
// seções novas: hero com agendar, como eu trabalho, cases, depoimentos e serviços
const WA = 'https://wa.me/5554993503203?text=';
const MSG = { geral: 'Oi Lucas, vim pelo seu site e quero conversar', ia: 'Oi Lucas, vim pelo seu site e quero conversar sobre IA na minha empresa' };
const PROIBIDO = /vitrina|trilha|github|\[preencher/i;
const FAKE = [
  { nome: 'EXEMPLO Nome Sobrenome', cargo: 'EXEMPLO Cargo', empresa: 'EXEMPLO Empresa', linkedin: 'https://www.linkedin.com/in/exemplo', texto: 'EXEMPLO. Texto fictício só para mostrar o layout. Nenhum depoimento real foi autorizado ainda.' },
  { nome: 'EXEMPLO Outra Pessoa', cargo: 'EXEMPLO Cargo', empresa: 'EXEMPLO Empresa', linkedin: 'https://www.linkedin.com/in/exemplo', texto: 'EXEMPLO. Segundo texto fictício, um pouco mais longo, para ver como dois cartões de alturas diferentes ficam lado a lado na grade.' },
  { nome: 'EXEMPLO Terceira Pessoa', cargo: 'EXEMPLO Cargo', empresa: '', linkedin: 'https://www.linkedin.com/in/exemplo', texto: 'EXEMPLO. Terceiro texto fictício.' },
];
const CUT = () => { const out = [];
  for (const e of document.querySelectorAll('body *')) { if (e.children.length || !e.textContent.trim() || e.classList.contains('sr') || e.closest('[hidden]')) continue; const cs = getComputedStyle(e); if (cs.display !== 'none' && (cs.overflow.includes('hidden') || cs.textOverflow === 'ellipsis') && e.clientWidth && e.scrollWidth > e.clientWidth + 1) out.push('cortado: ' + e.textContent.slice(0, 40)); }
  // rótulos e textos que se cruzam dentro das seções novas
  const els = [...document.querySelectorAll('.flow b,.flow em,.flow figcaption,.how h2,.how h3,.how p,.how code,.cgi__k,.cgi__v,.dp blockquote,.dp__n,.dp__r,.dp__in,.sv h1,.sv h2,.sv h3,.sv p,.sv li,.cta')].filter((e) => e.getClientRects().length);
  const bx = els.map((e) => e.getBoundingClientRect());
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) { if (els[i].contains(els[j]) || els[j].contains(els[i])) continue; const a = bx[i], c = bx[j]; if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) out.push('sobreposto: ' + els[i].textContent.slice(0, 24) + ' x ' + els[j].textContent.slice(0, 24)); }
  return out; };
const NEWVPS = { mobile: 'mobile', desktop: 'desktop' };
async function secShot(p, sel, path) {
  await p.evaluate((s) => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 140, behavior: 'instant' }); }, sel); await p.waitForTimeout(900);
  const st = await p.addStyleTag({ content: '.top,.tagbar,.scrub,.skip,.peek{visibility:hidden!important}' });
  const r = await p.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { y: Math.max(0, b.top + scrollY - 24), h: b.height + 48, w: document.documentElement.clientWidth }; }, sel);
  await p.screenshot({ path, fullPage: true, clip: { x: 0, y: r.y, width: r.w, height: r.h } });
  await st.evaluate((e) => e.remove());
}
for (const [vn, opt] of Object.entries(vps)) {
  const ctx = await b.newContext(opt); const p = await ctx.newPage(); const errs = []; const ok = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); }); p.on('pageerror', (e) => errs.push(e.message));
  const pr = NEWVPS[vn]; const S = (n) => `${D}/lucas-gehlen-cv-${pr}-${n}.png`;
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
  const cta = await p.evaluate(() => { const a = document.querySelector('.hero [data-agendar]'); return a && { href: a.href, t: a.target, rel: a.rel, txt: a.textContent.trim() }; });
  ok.push(['hero: frase do trabalho e botão Agendar conversa no WhatsApp', !!(await p.$('.hero .job')) && cta && cta.txt === 'Agendar conversa' && cta.href === WA + encodeURIComponent(MSG.geral) && cta.t === '_blank' && cta.rel.includes('noopener')]);
  ok.push(['rodapé com e-mail real no mailto', await p.evaluate(() => document.querySelector('.foot__send').href.startsWith('mailto:contato.lucasgehlen@gmail.com'))]);
  ok.push(['nav com abas Currículo e Serviços', await p.evaluate(() => document.querySelector('.top__r [aria-current=page]').textContent === 'Currículo' && !!document.querySelector('.top__r a[href$="servicos/"]'))]);
  ok.push(['sem Pilar no head, no hero e em Como eu trabalho', await p.evaluate(() => !/pilar/i.test(document.head.innerHTML + document.querySelector('.hero').innerText + document.querySelector('#como-trabalho').innerText))]);
  ok.push(['Como eu trabalho com 4 passos', await p.evaluate(() => document.querySelectorAll('#como-trabalho .how__i').length === 4)]);
  ok.push(['cases com contexto, gargalo e impacto', await p.evaluate(() => { const ms = [...document.querySelectorAll('.r--m')]; return ms.length === 6 && ms.every((m) => [...m.querySelectorAll('.cgi__k')].map((k) => k.textContent).join() === 'contexto,gargalo,impacto'); })]);
  ok.push(['depoimentos escondidos (lista vazia e chave desligada)', await p.evaluate(() => !document.querySelector('.dp') && document.querySelector('.dp-slot').innerHTML.trim() === '')]);
  ok.push(['nada de Vitrina, Trilha, GitHub ou placeholder', await p.evaluate((re) => !new RegExp(re, 'i').test(document.body.innerText), PROIBIDO.source)]);
  const cuts = await p.evaluate(CUT); rep[vn + 'NovasCortes'] = cuts; ok.push([`seções novas sem corte nem sobreposição (${cuts.length})`, cuts.length === 0]);
  const aa = []; for (const sel of ['.hero', '#como-trabalho', '.r--shorts', '.r--time', '.r--pelos']) { await p.evaluate((s) => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' }); }, sel); await p.waitForTimeout(800); aa.push(...await p.evaluate(AA)); }
  if (pr) {
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(400);
    await p.screenshot({ path: S('hero') });
    await secShot(p, '.hero', S('hero-secao'));
    await secShot(p, '#como-trabalho', S('como-trabalho'));
    for (const [n, sel] of [['cases', '.r--shorts'], ['cases-time', '.r--time'], ['cases-alertas', '.r--alertas']]) await secShot(p, sel, S(n));
  }
  // exemplo de depoimentos, injetado só no teste (nunca vai para o build)
  await p.evaluate((f) => window.__depoimentos(f), FAKE); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('.dp').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(400);
  ok.push(['componente de depoimento: nome, cargo e LinkedIn', await p.evaluate(() => document.querySelectorAll('.dp__c').length === 3 && [...document.querySelectorAll('.dp__in')].every((a) => a.target === '_blank' && a.href.includes('linkedin.com')))]);
  aa.push(...await p.evaluate(AA)); const dcut = await p.evaluate(CUT); ok.push([`depoimentos sem corte (${dcut.length})`, dcut.length === 0]);
  if (pr) await secShot(p, '.dp', S('depoimentos-exemplo'));
  // serviços
  await p.goto(url + 'servicos/', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  ok.push(['Serviços: 6 etapas, agendar com mensagem de IA, sem preço', await p.evaluate(([wa, m]) => document.querySelectorAll('.br__i').length === 6 && document.querySelectorAll('.flow__i').length === 3 && [...document.querySelectorAll('[data-agendar]')].every((a) => a.href === wa + encodeURIComponent(m) && a.target === '_blank' && a.rel.includes('noopener')) && !/R\$|\bpreço\b/i.test(document.body.innerText), [WA, MSG.ia])]);
  ok.push(['Serviços: Pilar só no bloco de experiência', await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelector('.base').remove(); return !/pilar/i.test(document.head.innerHTML + c.innerText); })]);
  ok.push(['Serviços: aba ativa e volta para o currículo', await p.evaluate(() => document.querySelector('.top__r [aria-current=page]').textContent === 'Serviços' && !!document.querySelector('.top__r a[href="../"]'))]);
  ok.push(['Serviços: sem rolagem horizontal', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth)]);
  ok.push(['Serviços: nada de Vitrina, Trilha, GitHub', await p.evaluate((re) => !new RegExp(re, 'i').test(document.body.innerText), PROIBIDO.source)]);
  const scut = await p.evaluate(CUT); rep[vn + 'ServicosCortes'] = scut; ok.push([`Serviços sem corte nem sobreposição (${scut.length})`, scut.length === 0]);
  const fontes = await p.evaluate(async () => { await document.fonts.ready; return ['800 16px "Cabinet Grotesk"', '16px "Geist"'].every((f) => document.fonts.check(f)) && ![...document.querySelectorAll('body *')].some((e) => /serif/.test(getComputedStyle(e).fontFamily.replace(/sans-serif/g, ''))); });
  ok.push(['fontes Cabinet + Geist carregadas, nenhuma serifa nem itálico', fontes && await p.evaluate(() => ![...document.querySelectorAll('body *')].some((e) => getComputedStyle(e).fontStyle === 'italic' && e.textContent.trim()))]);
  if (pr) { await p.screenshot({ path: S('servicos-topo') }); await p.screenshot({ path: S('servicos'), fullPage: true }); await secShot(p, '#conduzo', S('servicos-conduzo')); }
  for (const y of [0, 0.25, 0.5, 0.75, 1]) { await p.evaluate((y) => scrollTo({ top: (document.body.scrollHeight - innerHeight) * y, behavior: 'instant' }), y); await p.waitForTimeout(300); aa.push(...await p.evaluate(AA)); }
  rep[vn + 'NovasAA'] = [...new Set(aa)]; ok.push([`contraste AA nas seções novas e em Serviços (${rep[vn + 'NovasAA'].length} falhas)`, rep[vn + 'NovasAA'].length === 0]);
  await ctx.close();
  rep[vn + 'Novas'] = { errors: errs, checks: ok.map(([n, v]) => `${v ? 'OK ' : 'FALHOU '}${n}`) };
}
// página inteira da home (movimento reduzido: tudo desenhado)
for (const [pr, vw] of [['mobile', ALL.mobile], ['desktop', ALL.desktop]]) {
  const c = await b.newContext({ ...vw, reducedMotion: 'reduce' }); const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  await p.screenshot({ path: `${D}/lucas-gehlen-cv-${pr}-home-completa.png`, fullPage: true }); await c.close();
}
// movimento reduzido
const c3 = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const p3 = await c3.newPage(); const e3 = [];
p3.on('pageerror', (e) => e3.push(e.message)); p3.on('console', (m) => m.type() === 'error' && e3.push(m.text()));
await p3.goto(url, { waitUntil: 'networkidle' }); await p3.waitForTimeout(800);
const full = await p3.evaluate(() => +document.querySelector('#pen rect').getAttribute('height') >= document.querySelector('.rows').offsetHeight);
await p3.evaluate(() => window.__home.open('shorts')); await p3.waitForTimeout(2500);
const autoOff = (await p3.textContent('.st__k')).includes('1 de 4');
await p3.goto(url + 'servicos/', { waitUntil: 'networkidle' }); await p3.waitForTimeout(400);
const pulseOff = await p3.evaluate(() => [...document.querySelectorAll('*')].every((e) => getComputedStyle(e).animationName === 'none' || parseFloat(getComputedStyle(e).animationDuration) === 0));
rep.reducedMotion = { errors: e3, servicosSemAnimacao: pulseOff, grafoCompletoSemAnimacao: full, autoAdvanceOff: autoOff };
await c3.close();
// vídeos curtos: grafo escrito no scroll + interação
for (const [vn, opt] of Object.entries(vps)) {
  const ctx = await b.newContext({ ...opt, recordVideo: { dir: `/tmp/rsv-${vn}`, size: opt.viewport } }); const p = await ctx.newPage();
  const W = opt.viewport.width >= 1200;
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  await p.evaluate(() => window.__home.show('shorts')); await p.waitForTimeout(1600);
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
