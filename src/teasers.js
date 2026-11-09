// Teasers vivos da home: versões pequenas dos visuais dos stories. Cores vêm das variáveis do tema (currentColor / classes).
const sv = (vb, body, label) => `<svg class="tz" viewBox="${vb}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
const mono = (x, y, t, cls = 'tz-m', a = 'start') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;

export function shorts() {
  const rows = [['manifesto', 18, 10, 0], ['seg 1 · 240p', 28, 26, 1], ['seg 2 · 720p', 54, 40, 2], ['seg 3 · 1080p', 94, 52, 3], ['seg 4 · 1080p', 146, 46, 4]];
  let b = rows.map(([l, x, w, i]) => `${mono(0, 17 + i * 19, l)}<rect class="tz-bar${i === 1 ? ' tz-acc-f' : i ? ' tz-ink-f' : ' tz-mut-f'}" style="--i:${i}" x="${70 + x * 0.62}" y="${9 + i * 19}" width="${w * 0.62}" height="9" rx="2"/>`).join('');
  b += `<line class="tz-acc-s" x1="${70 + 54 * 0.62}" x2="${70 + 54 * 0.62}" y1="2" y2="104" stroke-dasharray="2 3"/>${mono(70 + 54 * 0.62 + 3, 104, '1º quadro', 'tz-m tz-acc-t')}`;
  return sv('0 0 200 108', b, 'Segmentos de vídeo HLS chegando e o primeiro quadro');
}
export function hex() {
  let s = 3, b = ''; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let y = 0; y < 6; y++) for (let x = 0; x < 9; x++) {
    const cx = 14 + x * 22 + (y % 2) * 11, cy = 14 + y * 19, d = Math.max(0, 1 - Math.hypot((cx - 80) / 70, (cy - 52) / 50)) * 0.9 + r() * 0.1;
    let p = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 180 * (60 * k - 30); p += `${k ? 'L' : 'M'}${(cx + 11.5 * Math.cos(a)).toFixed(1)} ${(cy + 11.5 * Math.sin(a)).toFixed(1)}`; }
    b += `<path class="tz-hex" style="--o:${(0.08 + d * 0.85).toFixed(2)};--d:${(x + y) * 90}ms" d="${p}z"/>`;
  }
  return sv('0 0 210 118', b, 'Malha hexagonal agrupando imóveis');
}
export function cities() {
  const lon0 = -50.5, lat0 = -22.3, k = 30, px = (la, lo) => [20 + (lo - lon0) * k * 0.914, 12 + (lat0 - la) * k];
  let b = '';
  for (let lo = -50; lo <= -45; lo++) b += `<line class="tz-grid" x1="${px(0, lo)[0]}" x2="${px(0, lo)[0]}" y1="0" y2="130"/>`;
  for (let la = -22; la >= -26; la--) b += `<line class="tz-grid" x1="0" x2="200" y1="${px(la, 0)[1]}" y2="${px(la, 0)[1]}"/>`;
  const [x1, y1] = px(-23.55, -46.63), [x2, y2] = px(-25.43, -49.27);
  b += `<path class="tz-route tz-acc-s" d="M${x1} ${y1}L${x2} ${y2}"/><circle class="tz-acc-f" cx="${x1}" cy="${y1}" r="4"/><circle class="tz-acc-f" cx="${x2}" cy="${y2}" r="4"/><circle class="tz-ring tz-acc-s" cx="${x1}" cy="${y1}" r="10"/><circle class="tz-ring tz-acc-s" style="animation-delay:1s" cx="${x2}" cy="${y2}" r="10"/>${mono(x1 + 8, y1 - 8, 'São Paulo', 'tz-m tz-ink-t')}${mono(x2 + 14, y2 + 4, 'Curitiba', 'tz-m tz-ink-t')}`;
  return sv('0 0 200 120', b, 'São Paulo e Curitiba no mapa');
}
export function alert() {
  return `<div class="tz tz-alert" aria-hidden="true"><span class="tz-q">São Paulo · Apartamento · 3+ quartos</span><span class="tz-note"><b><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/></svg> Radar</b>Entrou um imóvel que combina com a sua busca.</span><span class="tz-cap">simulação</span></div>`;
}
export function checklist() {
  const it = ['Hooks rodaram', 'Diff sem segredo', 'Descrição com o porquê', 'Preview validado'];
  return `<ul class="tz tz-chk" aria-hidden="true">${it.map((t, i) => `<li style="--i:${i}"><i></i>${t}</li>`).join('')}</ul>`;
}
export function scan() {
  const dog = 'M60 98c-4-13 0-29 9-37l-4-20 12 12c9-4 22-4 31 0l12-12-4 20c9 8 13 24 9 37-6 14-59 14-65 0z';
  return sv('0 0 190 110', `<path class="tz-edu-s" d="${dog}" fill="none" stroke-width="2"/><path class="tz-edu-s" d="M40 22V12h10M140 12h10v10M150 96v10h-10M50 106H40V96" fill="none" stroke-width="2"/><line class="tz-scan tz-edu-s" x1="42" x2="148" y1="20" y2="20" stroke-width="1.5"/>${mono(156, 60, 'foto', 'tz-m')}${mono(156, 72, '→ raça', 'tz-m tz-edu-t')}`, 'Foto de cachorro sendo analisada');
}
// trilho de tempo em escala real (2015 a 2026)
export function track(a, b, cls = 'tz-acc-f') {
  const X = (y) => 4 + ((y - 2015) / 12) * 192;
  return sv('0 0 200 28', `<line class="tz-grid" x1="4" x2="196" y1="9" y2="9"/>${[2015, 2019, 2022, 2025].map((y) => `<line class="tz-grid" x1="${X(y)}" x2="${X(y)}" y1="5" y2="13"/>${mono(y === 2015 ? 1 : X(y), 24, y, 'tz-m', y === 2015 ? 'start' : 'middle')}`).join('')}<rect class="${cls}" x="${X(a)}" y="5" width="${Math.max(3, X(b) - X(a))}" height="8" rx="2"/>`);
}
