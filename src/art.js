import { C, icon } from './brand.js';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const svg = (body, vb = '0 0 320 200', label = '') => `<svg class="art__svg" viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
const L = (o = 0.35) => `rgba(229,232,227,${o})`;
const T = (x, y, s, txt, fill = C.neblina, w = 500, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" font-family="Cabinet Grotesk, sans-serif">${txt}</text>`;
const M = (x, y, txt, fill = L(0.7), anchor = 'start') => `<text x="${x}" y="${y}" font-size="10" fill="${fill}" text-anchor="${anchor}" font-family="Geist Mono Variable, monospace">${txt}</text>`;

/* ---------- linha da carreira (trajetória) ---------- */
const X = (y) => 22 + ((y - 2015) / 12) * 280;
export function career(active) {
  const segs = [
    { id: 'ifrs', a: 2015, b: 2019, l: 'IFRS', row: 0, up: 1 },
    { id: 'ucs', a: 2019.05, b: 2024, l: 'UCS', row: 0, up: 1 },
    { id: 'vero', a: 2019.25, b: 2020.1, l: 'Vero', row: 1 },
    { id: 'conecta', a: 2020.2, b: 2022.55, l: 'Conecta', row: 1, up: 1 },
    { id: 'compass', a: 2022.6, b: 2024.85, l: 'Compass.uol', row: 1 },
    { id: 'pilar', a: 2024.9, b: 2026.9, l: 'Pilar', row: 1, up: 1 },
  ];
  let b = `<line x1="16" y1="150" x2="304" y2="150" stroke="${L(0.35)}"/>`;
  [2015, 2019, 2022, 2025].forEach((y) => { b += `<line x1="${X(y)}" y1="146" x2="${X(y)}" y2="154" stroke="${L(0.5)}"/>${M(X(y), 170, y, L(0.55), 'middle')}`; });
  b += `${M(X(2026.9), 170, 'hoje', L(0.55), 'end')}${M(16, 30, 'estudo', L(0.4))}${M(16, 84, 'trabalho', L(0.4))}`;
  segs.forEach((s) => {
    const on = s.id === active, y = s.row ? 116 : 64, col = on ? C.sinal : L(0.35);
    b += `<line x1="${X(s.a) + 1.5}" y1="${y}" x2="${X(s.b) - 1.5}" y2="${y}" stroke="${col}" stroke-width="${on ? 9 : 7}"/>`;
    b += T(X(s.a), s.up ? y - 10 : y + 22, 12, s.l, on ? C.neblina : L(0.6), on ? 700 : 500);
  });
  b += `<line x1="${X(2025.7)}" y1="108" x2="${X(2025.7)}" y2="124" stroke="${active === 'pilar' ? C.neblina : L(0.5)}" stroke-width="2"/>${M(306, 92, 'Tech Lead', active === 'pilar' ? C.neblina : L(0.55), 'end')}`;
  return { html: `<div class="art">${svg(b, '0 0 320 180', 'Linha do tempo de estudo e trabalho, de 2015 até hoje')}</div>` };
}

/* ---------- Cidade ---------- */
export function cities() {
  // projeção equiretangular simples; coordenadas públicas das duas capitais
  const P = { sp: [-23.55, -46.63], cwb: [-25.43, -49.27] }, lon0 = -50.5, lat0 = -22.3, k = 44;
  const px = ([la, lo]) => [30 + (lo - lon0) * k * Math.cos((24 * Math.PI) / 180), 20 + (lat0 - la) * k];
  let b = '';
  for (let lo = -50; lo <= -45; lo++) { const x = px([0, lo])[0]; b += `<line x1="${x}" y1="10" x2="${x}" y2="180" stroke="${L(0.08)}"/>${lo % 2 ? '' : M(x + 2, 178, `${-lo}°O`, L(0.35))}`; }
  for (let la = -22; la >= -26; la--) { const y = px([la, 0])[1]; b += `<line x1="10" y1="${y}" x2="310" y2="${y}" stroke="${L(0.08)}"/>${M(12, y < 15 ? y + 11 : y - 3, `${-la}°S`, L(0.35))}`; }
  const [x1, y1] = px(P.sp), [x2, y2] = px(P.cwb);
  const R = 6371, rad = Math.PI / 180, dLa = (P.cwb[0] - P.sp[0]) * rad, dLo = (P.cwb[1] - P.sp[1]) * rad;
  const km = Math.round((2 * R * Math.asin(Math.sqrt(Math.sin(dLa / 2) ** 2 + Math.cos(P.sp[0] * rad) * Math.cos(P.cwb[0] * rad) * Math.sin(dLo / 2) ** 2))) / 10) * 10;
  const city = (x, y, l, c) => `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${L(0.25)}"/><circle cx="${x}" cy="${y}" r="5" fill="${C.sinal}"/>${T(x + (c ? 14 : -14), y - 18, 13, l, C.neblina, 700, c ? 'start' : 'end')}`;
  b += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${C.sinal}" stroke-width="1.5" stroke-dasharray="4 4"/>${M((x1 + x2) / 2 + 8, (y1 + y2) / 2 + 4, `≈ ${km} km`, L(0.7))}${city(x1, y1, 'São Paulo', 1)}${city(x2, y2, 'Curitiba', 0)}`;
  return { html: `<div class="art">${svg(b, '0 0 320 190', `São Paulo e Curitiba no mapa, a cerca de ${km} km em linha reta`)}<p class="art__src">Posições reais das duas capitais, projeção simples.</p></div>` };
}
export function pins() {
  let seed = 5; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280); let b = `<rect width="320" height="190" fill="#1d2220"/>`;
  for (let i = 1; i < 6; i++) b += `<line x1="0" y1="${i * 32}" x2="320" y2="${i * 32 + 6}" stroke="${L(0.06)}"/><line x1="${i * 54}" y1="0" x2="${i * 54 - 8}" y2="190" stroke="${L(0.06)}"/>`;
  for (let i = 0; i < 140; i++) { const c = rnd() < 0.6 ? [110, 90, 40] : [215, 110, 30]; const x = c[0] + (rnd() + rnd() - 1) * c[2] * 1.6, y = c[1] + (rnd() + rnd() - 1) * c[2]; b += `<path d="M${x} ${y}c-5-7-7-10-7-13a7 7 0 0 1 14 0c0 3-2 6-7 13z" fill="${C.basalto}" stroke="${C.neblina}" stroke-width="1"/>`; }
  return { html: `<div class="art">${svg(b, '0 0 320 190', 'Mapa com pinos sobrepostos, difícil de ler')}<p class="art__src">Pontos fictícios.</p></div>` };
}

/* ---------- Mapa H3 ---------- */
export function hexmap() {
  const html = `<div class="art art--ui hx" data-ui>
    <canvas class="hx__cv" aria-hidden="true"></canvas>
    <div class="ql__row"><span>Zoom</span><strong class="hx__v">cidade</strong></div>
    <label class="sr" for="hz">Zoom do mapa</label>
    <input id="hz" type="range" min="0" max="2" step="1" value="0" aria-valuetext="cidade">
    <div class="ql__ticks" aria-hidden="true"><span>cidade</span><span>bairro</span><span>rua</span></div>
    <p class="art__src">Simulação com pontos fictícios. H3 é um índice geoespacial aberto.</p></div>`;
  return { html, init(root, api) {
    const cv = root.querySelector('.hx__cv'), r = root.querySelector('#hz'), dpr = Math.min(devicePixelRatio || 1, 2);
    const bb = cv.getBoundingClientRect(); const W = Math.max(10, bb.width), H = Math.max(10, bb.height); cv.width = W * dpr; cv.height = H * dpr;
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let seed = 11; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
    const pts = []; [[0.3, 0.4, 0.16, 180], [0.66, 0.55, 0.12, 140], [0.55, 0.22, 0.09, 70], [0.5, 0.5, 0.45, 60]].forEach(([x, y, s, n]) => { for (let i = 0; i < n; i++) pts.push([(x + gauss() * s) * W, (y + gauss() * s) * H]); });
    const names = ['cidade', 'bairro', 'rua'];
    const draw = (lv) => {
      c.fillStyle = '#1d2220'; c.fillRect(0, 0, W, H);
      c.strokeStyle = 'rgba(157,181,169,.35)'; c.lineWidth = 6; c.beginPath(); c.moveTo(-10, H * 0.8); c.bezierCurveTo(W * 0.3, H * 0.6, W * 0.6, H * 0.95, W + 10, H * 0.7); c.stroke();
      c.strokeStyle = 'rgba(229,232,227,.08)'; c.lineWidth = 1; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (H * i) / 6); c.lineTo(W, (H * i) / 6 + 8); c.stroke(); c.beginPath(); c.moveTo((W * i) / 6, 0); c.lineTo((W * i) / 6 - 10, H); c.stroke(); }
      const s = [0.13, 0.065, 0.032][lv] * W, s3 = Math.sqrt(3), cnt = new Map();
      pts.forEach(([x, y]) => { if (x < 0 || y < 0 || x > W || y > H) return; let q = (s3 / 3 * x - y / 3) / s, rr = (2 / 3 * y) / s, cz = -q - rr;
        let rq = Math.round(q), rr2 = Math.round(rr), rz = Math.round(cz); const dq = Math.abs(rq - q), dr = Math.abs(rr2 - rr), dz = Math.abs(rz - cz);
        if (dq > dr && dq > dz) rq = -rr2 - rz; else if (dr > dz) rr2 = -rq - rz;
        const k = rq + ',' + rr2; cnt.set(k, (cnt.get(k) || 0) + 1); });
      const max = Math.max(...cnt.values());
      cnt.forEach((n, k) => { const [q, rr] = k.split(',').map(Number); const cx = s * s3 * (q + rr / 2), cy = s * 1.5 * rr;
        c.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); c.lineTo(cx + (s - 1.2) * Math.cos(a), cy + (s - 1.2) * Math.sin(a)); } c.closePath();
        c.fillStyle = `rgba(201,174,124,${0.18 + (n / max) * 0.72})`; c.fill();
        if (lv < 2 && s > 11) { c.fillStyle = n / max > 0.5 ? '#191D1B' : '#E5E8E3'; c.font = `700 ${lv ? 10 : 13}px "Cabinet Grotesk"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(n, cx, cy + 1); } });
      if (lv === 2) { c.fillStyle = '#E5E8E3'; pts.forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 1.4, 0, Math.PI * 2); c.fill(); }); }
      root.querySelector('.hx__v').textContent = names[lv]; r.setAttribute('aria-valuetext', names[lv]); r.style.setProperty('--fill', `${lv * 50}%`);
    };
    draw(0); let touched = false;
    r.addEventListener('input', () => { touched = true; api.touch(); draw(+r.value); });
    if (!reduce) { let i = 0; const id = setInterval(() => { if (touched || !document.contains(r) || i >= 1) return clearInterval(id); i++; r.value = i; draw(i); }, 1600); }
  } };
}

/* ---------- Time ---------- */
export function rituals() {
  const days = ['seg', 'ter', 'qua', 'qui', 'sex'];
  let b = ''; days.forEach((d, i) => { const x = 22 + i * 58; b += `${M(x + 22, 22, d, L(0.55), 'middle')}<line x1="${x}" y1="30" x2="${x + 46}" y2="30" stroke="${L(0.25)}"/>`; });
  const blk = (i, y, h, l, on) => `<rect x="${22 + i * 58}" y="${y}" width="46" height="${h}" rx="6" fill="${on ? C.sinal : 'none'}" stroke="${on ? 'none' : L(0.55)}"/>${M(45 + i * 58, y + h / 2 + 3.5, l, on ? C.basalto : L(0.8), 'middle')}`;
  b += blk(0, 40, 26, '1:1') + blk(1, 40, 26, '1:1') + blk(3, 40, 26, '1:1') + blk(2, 76, 40, 'talk', true) + blk(4, 76, 26, '1:1') + blk(1, 76, 26, 'review') + blk(3, 76, 26, 'review');
  b += `<rect x="40" y="140" width="96" height="40" rx="6" fill="none" stroke="${C.neblina}" stroke-width="1.5"/>${M(88, 164, 'doc de decisão', C.neblina, 'middle')}<path d="M136 160h44" stroke="${C.sinal}" stroke-width="2"/><path d="M174 155l6 5-6 5" fill="none" stroke="${C.sinal}" stroke-width="2"/>${M(190, 164, 'o time revisa', L(0.8))}`;
  return { html: `<div class="art">${svg(b, '0 0 320 190', 'Semana com 1:1, code review, tech talk e documento de decisão')}<p class="art__src">Semana ilustrativa.</p></div>` };
}
export function flags() {
  const stages = [['Time interno', 2], ['Parte do público', 6], ['Todos', 15]];
  const html = `<div class="art art--ui fl" data-ui>
    <div class="seg" role="group" aria-label="Fase da entrega">${stages.map(([l], i) => `<button type="button" aria-pressed="${!i}" data-st="${i}">${l}</button>`).join('')}</div>
    <svg class="art__svg" viewBox="0 0 320 110" aria-hidden="true">${Array.from({ length: 15 }, (_, i) => { const x = 28 + (i % 8) * 38, y = 30 + Math.floor(i / 8) * 46; return `<g class="fl__p" data-i="${i}"><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${L(0.6)}" stroke-width="1.5"/><path d="M${x - 11} ${y + 22}c3-9 19-9 22 0" fill="none" stroke="${L(0.6)}" stroke-width="1.5"/></g>`; }).join('')}</svg>
    <p class="art__src">Ilustração. A mesma versão no ar, com a feature ligada para quem está na fase.</p></div>`;
  return { html, init(root, api) {
    const set = (k) => { root.querySelectorAll('[data-st]').forEach((x) => x.setAttribute('aria-pressed', +x.dataset.st === k)); root.querySelectorAll('.fl__p').forEach((g) => g.querySelectorAll('circle,path').forEach((e) => e.setAttribute('stroke', +g.dataset.i < stages[k][1] ? C.sinal : L(0.4)))); };
    root.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', () => { api.touch(); set(+b.dataset.st); }));
    set(0);
  } };
}

/* ---------- Shorts ---------- */
const room = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2a302c"/><rect x="${x + w * 0.1}" y="${y + h * 0.1}" width="${w * 0.36}" height="${h * 0.42}" fill="${C.sinal}"/><rect x="${x + w * 0.12}" y="${y + h * 0.13}" width="${w * 0.15}" height="${h * 0.36}" fill="#EFE6D3"/><rect x="${x + w * 0.29}" y="${y + h * 0.13}" width="${w * 0.15}" height="${h * 0.36}" fill="#EFE6D3"/><rect x="${x + w * 0.12}" y="${y + h * 0.66}" width="${w * 0.7}" height="${h * 0.12}" fill="${C.musgo}"/><circle cx="${x + w * 0.74}" cy="${y + h * 0.3}" r="${h * 0.09}" fill="${C.neblina}"/><rect x="${x + w * 0.72}" y="${y + h * 0.38}" width="${w * 0.03}" height="${h * 0.26}" fill="${C.neblina}"/>`;
export function hlsTimeline() {
  // modelo ilustrativo: o player pede o manifesto, baixa o 1º segmento no degrau mais leve, mostra o 1º quadro e sobe de degrau
  const NET = {
    fraca: { man: 0.5, segs: [['240p', 1.3], ['360p', 1.5], ['360p', 1.4], ['480p', 1.7]] },
    boa: { man: 0.15, segs: [['240p', 0.2], ['720p', 0.5], ['1080p', 0.7], ['1080p', 0.7]] },
  };
  const T = 7, X0 = 70, XW = 236, sx = (t) => X0 + (t / T) * XW;
  const html = `<div class="art art--ui hl" data-ui>
    <div class="seg" role="group" aria-label="Rede"><button type="button" aria-pressed="true" data-net="fraca">Rede fraca</button><button type="button" aria-pressed="false" data-net="boa">Wi-Fi</button><button type="button" class="replay" data-replay aria-label="Repetir">${icon('play', { size: 16 })}</button></div>
    <svg class="art__svg" viewBox="0 0 320 196" role="img" aria-label="Linha do tempo de carregamento do vídeo: manifesto, segmentos e primeiro quadro">
      <g class="hl__grid"></g><g class="hl__bars"></g>
      <line class="hl__ff" x1="0" x2="0" y1="18" y2="168" stroke="${C.sinal}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0"/>
      <text class="hl__ffl" x="0" y="12" font-size="10" fill="${C.sinal}" font-family="Geist Mono Variable, monospace" opacity="0">primeiro quadro</text>
      <line class="hl__head" x1="${X0}" x2="${X0}" y1="18" y2="176" stroke="${C.neblina}" stroke-width="1"/>
    </svg>
    <div class="ql__row"><span>Player</span><strong class="hl__st">pedindo o manifesto</strong></div>
    <p class="art__src">Tempos ilustrativos. Segmentos de 2 s, um degrau por segmento.</p></div>`;
  return { html, init(root, api) {
    const g = root.querySelector('.hl__grid'), bars = root.querySelector('.hl__bars'), ff = root.querySelector('.hl__ff'), ffl = root.querySelector('.hl__ffl'), head = root.querySelector('.hl__head'), stt = root.querySelector('.hl__st');
    const rows = ['manifesto', 'segmento 1', 'segmento 2', 'segmento 3', 'segmento 4'];
    g.innerHTML = rows.map((r, i) => `<text x="0" y="${38 + i * 28}" font-size="10" fill="${L(0.6)}" font-family="Geist Mono Variable, monospace">${r}</text><line x1="${X0}" x2="${X0 + XW}" y1="${42 + i * 28}" y2="${42 + i * 28}" stroke="${L(0.08)}"/>`).join('')
      + [0, 2, 4, 6].map((t) => `<line x1="${sx(t)}" x2="${sx(t)}" y1="172" y2="176" stroke="${L(0.4)}"/><text x="${sx(t)}" y="188" font-size="9" fill="${L(0.5)}" text-anchor="middle" font-family="Geist Mono Variable, monospace">${t}s</text>`).join('');
    let raf = 0, net = 'fraca';
    const run = () => {
      cancelAnimationFrame(raf); const n = NET[net]; let t0 = n.man; const plan = [['manifesto', 0, n.man, '']];
      n.segs.forEach(([q, d]) => { plan.push([q, t0, t0 + d, q]); t0 += d; });
      const first = plan[1][2];
      bars.innerHTML = plan.map(([q, a, b2], i) => `<rect class="hl__b" data-i="${i}" x="${sx(a)}" y="${28 + i * 28}" width="0" height="12" rx="2" fill="${i === 0 ? L(0.5) : i === 1 ? C.sinal : L(0.75)}"/><text class="hl__q" data-i="${i}" x="${sx(b2) + 4}" y="${38 + i * 28}" font-size="10" fill="${C.neblina}" font-family="Geist Mono Variable, monospace" opacity="0">${i ? q : ''}</text>`).join('');
      ff.setAttribute('opacity', 0); ffl.setAttribute('opacity', 0);
      const rects = bars.querySelectorAll('.hl__b'), labels = bars.querySelectorAll('.hl__q'); const start = performance.now(); const speed = net === 'fraca' ? 1 : 1;
      const step = (now) => {
        const t = reduce ? T : Math.min(T, ((now - start) / 1000) * speed);
        plan.forEach(([, a, b2], i) => { const w = Math.max(0, Math.min(t, b2) - a); rects[i].setAttribute('width', (w / T) * XW); labels[i].setAttribute('opacity', t >= b2 ? 1 : 0); });
        head.setAttribute('x1', sx(t)); head.setAttribute('x2', sx(t));
        if (t >= first) { ff.setAttribute('x1', sx(first)); ff.setAttribute('x2', sx(first)); ffl.setAttribute('x', Math.min(sx(first) + 4, 230)); ff.setAttribute('opacity', 1); ffl.setAttribute('opacity', 1); }
        const cur = plan.filter(([, a]) => t >= a && a > 0).at(-1);
        stt.textContent = t < n.man ? 'pedindo o manifesto' : t < first ? 'baixando o primeiro segmento' : `tocando, ${cur ? cur[3] : ''}`;
        if (t < T) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    root.querySelectorAll('[data-net]').forEach((b) => b.addEventListener('click', () => { api.touch(); net = b.dataset.net; root.querySelectorAll('[data-net]').forEach((x) => x.setAttribute('aria-pressed', x === b)); run(); }));
    root.querySelector('[data-replay]').addEventListener('click', () => { api.touch(); run(); });
    run();
  } };
}
const RUNGS = ['144p', '240p', '360p', '480p', '720p', '1080p'];
export function quality() {
  const html = `<div class="art art--ui ql" data-ui>
    <canvas class="qcv" aria-hidden="true"></canvas>
    <div class="ql__row"><span>Degrau</span><strong class="qv">144p</strong></div>
    <label class="sr" for="qr">Qualidade do vídeo</label>
    <input id="qr" type="range" min="0" max="5" step="1" value="0" aria-valuetext="144p">
    <div class="ql__ticks" aria-hidden="true">${RUNGS.map((r) => `<span>${r.replace('p', '')}</span>`).join('')}</div>
    <div class="ql__row"><span>Dados por segmento</span><span class="qd">menos</span></div>
    <div class="ql__bar" aria-hidden="true"><i class="qb"></i></div><p class="art__src">Quadro de teste: texto e listras finas só ficam nítidos nos degraus altos.</p></div>`;
  return { html, init(root, api) {
    const q = root.querySelector('.qcv'), r = root.querySelector('#qr'); const b = q.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2); q.width = Math.max(10, b.width * dpr); q.height = Math.max(10, b.height * dpr);
    const off = document.createElement('canvas'); off.width = q.width; off.height = q.height;
    const img = new Image(); const wedge = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI; return `<path d="M120 50L${120 + Math.cos(a) * 34} ${50 - Math.sin(a) * 34}L${120 + Math.cos(a + Math.PI / 48) * 34} ${50 - Math.sin(a + Math.PI / 48) * 34}z" fill="#E5E8E3"/>`; }).join('');
    const bars = [1, 1.5, 2, 3, 4].map((w, i) => Array.from({ length: 4 }, (_, j) => `<rect x="${10 + i * 14 + j * w * 2}" y="62" width="${w}" height="26" fill="#E5E8E3"/>`).join('')).join('');
    const svgTxt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><rect width="160" height="100" fill="#191D1B"/>${wedge}<text x="10" y="22" font-family="sans-serif" font-weight="700" font-size="12" fill="#E5E8E3">Apartamento</text><text x="10" y="36" font-family="sans-serif" font-size="8" fill="#C9AE7C">3 quartos · vista livre</text><text x="10" y="50" font-family="monospace" font-size="5" fill="#9DB5A9">legenda pequena do vídeo</text>${bars}</svg>`;
    const tiny = document.createElement('canvas'); const qc = q.getContext('2d');
    const draw = (i) => {
      const rows = [9, 15, 22, 32, 48, 0][i];
      if (!rows) { qc.imageSmoothingEnabled = true; qc.drawImage(off, 0, 0); }
      else { tiny.height = rows; tiny.width = Math.round(rows * q.width / q.height); const tc = tiny.getContext('2d'); tc.drawImage(off, 0, 0, tiny.width, tiny.height); qc.imageSmoothingEnabled = false; qc.drawImage(tiny, 0, 0, q.width, q.height); }
      root.querySelector('.qv').textContent = RUNGS[i]; r.setAttribute('aria-valuetext', RUNGS[i]); r.style.setProperty('--fill', `${(i / 5) * 100}%`);
      root.querySelector('.qb').style.width = `${12 + i * 17.6}%`; root.querySelector('.qd').textContent = i < 2 ? 'menos' : i < 4 ? 'médio' : 'mais';
    };
    img.onload = () => { off.getContext('2d').drawImage(img, 0, 0, off.width, off.height); draw(+r.value); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgTxt);
    let touched = false;
    r.addEventListener('input', () => { touched = true; api.touch(); draw(+r.value); });
    if (!reduce) { let i = 0; const id = setInterval(() => { if (touched || !document.contains(r) || i >= 3) return clearInterval(id); i++; r.value = i; draw(i); }, 700); }
  } };
}
export function results(src) {
  const bar = (y, label, a, b, la, lb, max) => `${T(14, y, 12, label, C.neblina, 600)}
    <line x1="14" y1="${y + 14}" x2="${14 + (a / max) * 250}" y2="${y + 14}" stroke="${L(0.4)}" stroke-width="10" class="grow"/>${M(20 + (a / max) * 250, y + 17, la)}
    <line x1="14" y1="${y + 30}" x2="${14 + (b / max) * 250}" y2="${y + 30}" stroke="${C.sinal}" stroke-width="10" class="grow"/>${M(20 + (b / max) * 250, y + 33, lb, C.neblina)}`;
  const body = bar(22, 'Conversão', 0.48, 2.3, '0,48% sem Shorts', '2,3% com Shorts', 3.2)
    + bar(84, 'Tempo médio no portal', 2.1, 7.9, '2,1 min', '7,9 min', 9.4)
    + bar(146, 'Imóveis vistos por sessão', 2.35, 12.55, '2,35', '12,55', 15);
  return { html: `<div class="art">${svg(body, '0 0 320 200', 'Gráfico: conversão de 0,48% para 2,3%, tempo médio de 2,1 para 7,9 minutos, imóveis vistos de 2,35 para 12,55')}<p class="art__src">Testes divulgados pela Pilar. ${src}</p></div>` };
}
export function post(title, kind) {
  let g = '';
  if (kind === 'hls') { for (let i = 0; i < 7; i++) { const x = 14 + i * 42, w = i === 0 ? 30 : 38; g += `<rect x="${x}" y="40" width="${w}" height="34" fill="${i === 0 ? C.sinal : 'none'}" stroke="${i === 0 ? 'none' : L(0.45)}"/><line x1="${x}" y1="30" x2="${x}" y2="84" stroke="${L(0.6)}" stroke-width="1.5"/>`; } g += M(14, 104, 'quadro-chave e segmento alinhados', L(0.6)); }
  if (kind === 'alert') { g += `<circle cx="70" cy="58" r="30" fill="none" stroke="${L(0.4)}"/><circle cx="70" cy="58" r="16" fill="none" stroke="${L(0.4)}"/><circle cx="82" cy="46" r="5" fill="${C.sinal}"/><path d="M110 58h70" stroke="${L(0.4)}" stroke-dasharray="3 5"/><rect x="186" y="38" width="120" height="40" rx="10" fill="none" stroke="${L(0.6)}"/>${M(198, 62, 'aviso agrupado', L(0.8))}`; }
  if (kind === 'h3') { for (let i = 0; i < 5; i++) { const cx = 40 + i * 58, cy = 60, r = 24; let d = ''; for (let j = 0; j < 6; j++) { const a = Math.PI / 180 * (60 * j - 30); d += (j ? 'L' : 'M') + (cx + r * Math.cos(a)) + ' ' + (cy + r * Math.sin(a)); } g += `<path d="${d}z" fill="${i === 2 ? C.sinal : 'none'}" stroke="${L(0.5)}"/>`; } g += M(14, 108, 'células do mesmo tamanho em qualquer ponto', L(0.6)); }
  if (kind === 'doc') { g += `<rect x="20" y="20" width="70" height="88" fill="none" stroke="${L(0.5)}"/><path d="M32 42h46M32 56h46M32 70h30" stroke="${L(0.5)}"/><path d="M100 64h40" stroke="${C.sinal}" stroke-width="2"/><rect x="150" y="38" width="64" height="52" rx="8" fill="none" stroke="${L(0.6)}"/>${M(182, 68, 'pessoa', L(0.8), 'middle')}<rect x="230" y="38" width="76" height="52" rx="8" fill="none" stroke="${L(0.6)}"/>${M(268, 68, 'LLM', L(0.8), 'middle')}`; }
  return { html: `<div class="art art--post">${svg(g, '0 0 320 120')}<p class="post__em">Em escrita</p><h4>${title}</h4><p class="post__d">Notas técnicas</p></div>` };
}

/* ---------- Alertas ---------- */
export function searchLoop() {
  let b = '';
  [0, 1, 2].forEach((i) => { const y = 28 + i * 46, o = 0.75 - i * 0.2; b += `<rect x="40" y="${y}" width="200" height="32" rx="16" fill="none" stroke="${L(o)}"/><circle cx="62" cy="${y + 16}" r="7" fill="none" stroke="${L(o)}" stroke-width="2"/><line x1="67" y1="${y + 21}" x2="72" y2="${y + 26}" stroke="${L(o)}" stroke-width="2"/>${M(84, y + 20, ['segunda', 'quarta', 'sábado'][i], L(o))}`; });
  b += `<path d="M262 40c34 18 34 74 0 92" fill="none" stroke="${C.sinal}" stroke-width="2.5"/><path d="M256 128l8 6 2-10" fill="none" stroke="${C.sinal}" stroke-width="2.5"/>${M(250, 190, 'a mesma busca, de novo', L(0.6), 'middle')}`;
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'A mesma busca repetida em dias diferentes')}</div>` };
}
export function sharedBase() {
  const b = `<rect x="14" y="30" width="96" height="44" rx="10" fill="none" stroke="${L(0.6)}"/>${T(62, 57, 13, 'Portal', C.neblina, 600, 'middle')}
    <rect x="14" y="126" width="96" height="44" rx="10" fill="none" stroke="${L(0.6)}"/>${T(62, 153, 13, 'Rede', C.neblina, 600, 'middle')}
    <path d="M110 52c40 0 40 48 72 48M110 148c40 0 40-48 72-48" fill="none" stroke="${L(0.5)}" stroke-width="1.5"/>
    <circle cx="214" cy="100" r="34" fill="none" stroke="${C.sinal}" stroke-width="2.5"/><circle cx="214" cy="100" r="18" fill="none" stroke="${L(0.4)}"/><circle cx="226" cy="88" r="4.5" fill="${C.sinal}"/>
    ${M(214, 152, 'uma base', L(0.7), 'middle')}${M(214, 165, 'de buscas salvas', L(0.7), 'middle')}
    <path d="M250 100h30" stroke="${L(0.5)}" stroke-width="1.5"/><g transform="translate(282 88)">${icon('bell', { size: 24, color: C.neblina }).replace(/<\/?svg[^>]*>/g, '')}</g>`;
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'Portal e rede usando uma base única de buscas salvas e avisos')}</div>` };
}
export function builder() {
  const grp = (k, opts) => `<div class="bld__g"><span>${k}</span>${opts.map((o, i) => `<button type="button" aria-pressed="${!i}" data-k="${k}">${o}</button>`).join('')}</div>`;
  const html = `<div class="art art--ui bld" data-ui>
    ${grp('Cidade', ['São Paulo', 'Curitiba'])}${grp('Tipo', ['Apartamento', 'Casa'])}${grp('Quartos', ['2+', '3+', '4+'])}
    <button type="button" class="bld__save" data-save>Salvar busca</button>
    <div class="bld__msg" aria-live="polite"></div>
    <p class="art__src">Simulação para mostrar o fluxo. Não usa dados reais.</p></div>`;
  return { html, init(root, api) {
    root.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { api.touch(); root.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
    const save = root.querySelector('[data-save]'), msg = root.querySelector('.bld__msg');
    save.addEventListener('click', () => {
      api.touch(); const sel = [...root.querySelectorAll('[aria-pressed=true]')].map((x) => x.textContent);
      save.textContent = 'Busca salva'; save.disabled = true; msg.className = 'bld__msg'; msg.innerHTML = '';
      setTimeout(() => { msg.classList.add('on'); msg.innerHTML = `<b>${icon('bell', { size: 16 })} Radar</b>Entrou um imóvel novo que combina com a sua busca: ${sel[1].toLowerCase()}, ${sel[2]} quartos, ${sel[0]}.`; save.disabled = false; save.textContent = 'Salvar outra busca'; }, reduce ? 0 : 1400);
    });
  } };
}

/* ---------- Documentação ---------- */
export function scattered() {
  let b = `<circle cx="160" cy="104" r="22" fill="none" stroke="${C.sinal}" stroke-width="2.5"/>${M(160, 146, 'quem já sabia', L(0.7), 'middle')}`;
  [[50, 50], [270, 46], [44, 160], [276, 158], [160, 22]].forEach(([x, y], i) => { b += `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${L(0.55)}"/><path d="M${x} ${y}L${160 + (x - 160) * 0.25} ${104 + (y - 104) * 0.25}" stroke="${L(0.25)}" stroke-dasharray="3 4"/>${T(x, y + 5, 13, '?', C.neblina, 700, 'middle')}`; });
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'Várias pessoas perguntando a uma só')}</div>` };
}
export function checklist() {
  const items = ['Hooks de Git rodaram', 'Diff sem segredo', 'Descrição com o porquê e como testar', 'Preview validado', 'Revisão pelos critérios de aceite'];
  const html = `<div class="art art--ui chk" data-ui><div class="chk__head"><svg viewBox="0 0 40 40" class="chk__ring" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="${L(0.2)}" stroke-width="4"/><circle cx="20" cy="20" r="16" fill="none" stroke="${C.sinal}" stroke-width="4" stroke-dasharray="100.5" stroke-dashoffset="100.5" transform="rotate(-90 20 20)" class="chk__arc"/></svg><span class="chk__n">0 de ${items.length}</span></div>
    <ul>${items.map((t, i) => `<li><label><input type="checkbox" data-i="${i}"><span>${t}</span></label></li>`).join('')}</ul>
    <p class="art__src">Exemplo de checklist do merge request, igual para quem abre e quem revisa.</p></div>`;
  return { html, init(root, api) {
    const boxes = root.querySelectorAll('input'); const upd = () => { const n = [...boxes].filter((b) => b.checked).length; root.querySelector('.chk__n').textContent = `${n} de ${boxes.length}`; root.querySelector('.chk__arc').style.strokeDashoffset = 100.5 * (1 - n / boxes.length); };
    boxes.forEach((b) => b.addEventListener('change', () => { api.touch(); upd(); }));
  } };
}
export function humanLlm() {
  const b = `<rect x="124" y="20" width="72" height="92" fill="none" stroke="${C.neblina}" stroke-width="1.5"/><path d="M136 42h48M136 56h48M136 70h48M136 84h30" stroke="${L(0.5)}"/>${M(160, 128, 'guia do clone ao merge', L(0.7), 'middle')}
    <path d="M124 66C90 66 80 120 64 140M196 66c34 0 44 54 60 74" fill="none" stroke="${C.sinal}" stroke-width="2"/>
    <circle cx="58" cy="158" r="18" fill="none" stroke="${L(0.7)}" stroke-width="1.5"/><circle cx="58" cy="152" r="5" fill="none" stroke="${L(0.7)}" stroke-width="1.5"/><path d="M48 168c4-6 16-6 20 0" fill="none" stroke="${L(0.7)}" stroke-width="1.5"/>${M(58, 192, 'quem revisa', L(0.7), 'middle')}
    <rect x="236" y="140" width="44" height="36" rx="6" fill="none" stroke="${L(0.7)}" stroke-width="1.5"/>${M(258, 162, '{ }', C.neblina, 'middle')}${M(258, 192, 'assistente', L(0.7), 'middle')}`;
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'O mesmo guia lido por uma pessoa e por um assistente de código')}</div>` };
}

/* ---------- Pelos Caminhos ---------- */
export function roles() {
  let b = `<g transform="translate(142 82) scale(1.5)">${icon('paw', { size: 24, color: C.sinal, sw: 1.8 }).replace(/<\/?svg[^>]*>/g, '')}</g><circle cx="160" cy="100" r="34" fill="none" stroke="${L(0.35)}"/>`;
  [['Adotante', 54, 46], ['ONG', 270, 60], ['Voluntário', 160, 182]].forEach(([l, x, y]) => { b += `<path d="M160 100L${x} ${y}" stroke="${L(0.3)}" stroke-dasharray="3 4"/><circle cx="${x}" cy="${y}" r="6" fill="${C.musgo}"/>${T(x, y - 12, 13, l, C.neblina, 600, 'middle')}`; });
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'Adotantes, ONGs e voluntários ligados à plataforma')}</div>` };
}
export function arch() {
  const blocks = { app: ['App', 'Vue 3, Nuxt, Capacitor, Tailwind'], api: ['API', 'Node, Express, Sequelize, PostgreSQL'], raca: ['Raça', 'Flask num container Docker'] };
  const html = `<div class="art art--ui arch" data-ui>
    <div class="arch__row">${Object.entries(blocks).map(([k, [l]], i) => `<button type="button" data-b="${k}" aria-pressed="${!i}">${l}</button>${i < 2 ? '<i aria-hidden="true"></i>' : ''}`).join('')}</div>
    <p class="arch__out" aria-live="polite">${blocks.app[1]}</p>
    <div class="arch__tags"><span>Permissões por perfil</span><span>QR code por animal</span></div></div>`;
  return { html, init(root, api) { root.querySelectorAll('[data-b]').forEach((b) => b.addEventListener('click', () => { api.touch(); root.querySelectorAll('[data-b]').forEach((x) => x.setAttribute('aria-pressed', x === b)); root.querySelector('.arch__out').textContent = blocks[b.dataset.b][1]; })); } };
}
export function scan() {
  const dog = 'M96 150c-6-20 0-44 14-56l-6-30 18 18c14-6 34-6 48 0l18-18-6 30c14 12 20 36 14 56-10 22-90 22-100 0z';
  const b = `<path d="${dog}" fill="none" stroke="${C.neblina}" stroke-width="2"/><circle cx="132" cy="112" r="3.5" fill="${C.neblina}"/><circle cx="168" cy="112" r="3.5" fill="${C.neblina}"/><path d="M150 126l-6 6h12z" fill="${C.neblina}"/>
    <path d="M70 40V24h16M214 24h16v16M230 160v16h-16M86 176H70v-16" fill="none" stroke="${C.sinal}" stroke-width="2.5"/>
    <line x1="72" x2="228" y1="40" y2="40" stroke="${C.sinal}" stroke-width="1.5" opacity=".8">${reduce ? '' : '<animate attributeName="y1" values="30;170;30" dur="2.6s" repeatCount="indefinite"/><animate attributeName="y2" values="30;170;30" dur="2.6s" repeatCount="indefinite"/>'}</line>
    ${M(252, 96, 'foto', L(0.7))}${M(252, 110, '→ raça', C.neblina)}`;
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'Foto de um cachorro sendo analisada para reconhecer a raça')}</div>` };
}
export function qr() {
  let b = ''; let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) { const fin = (x < 4 && y < 4) || (x > 10 && y < 4) || (x < 4 && y > 10); if (!fin && rnd() > 0.5) b += `<rect x="${20 + x * 9}" y="${30 + y * 9}" width="8" height="8" fill="${C.neblina}"/>`; }
  [[20, 30], [119, 30], [20, 129]].forEach(([x, y]) => { b += `<rect x="${x + 2}" y="${y + 2}" width="30" height="30" fill="none" stroke="${C.neblina}" stroke-width="4"/><rect x="${x + 10}" y="${y + 10}" width="14" height="14" fill="${C.sinal}"/>`; });
  b += `${T(180, 70, 22, 'TCC', C.neblina, 800)}${M(180, 90, 'Ciência da Computação', L(0.75))}${M(180, 106, 'UCS, 2019–2023', L(0.75))}`;
  return { html: `<div class="art">${svg(b, '0 0 320 200', 'Ilustração de QR code ao lado da indicação do TCC')}<p class="art__src">QR code ilustrativo.</p></div>` };
}
