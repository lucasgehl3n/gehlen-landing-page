// Visuais da home que não são cases: onde, quanto tempo e com o quê. Datas e stacks vêm do meu LinkedIn.
const NOW = new Date(); const NOWY = NOW.getFullYear() + NOW.getMonth() / 12;
const ym = (s) => { const [y, m] = s.split('-').map(Number); return { y, m }; };
const months = (a, b) => { const A = ym(a), B = b ? ym(b) : { y: NOW.getFullYear(), m: NOW.getMonth() + 1 }; return (B.y - A.y) * 12 + (B.m - A.m) + 1; };
const dur = (n) => { const y = Math.floor(n / 12), m = n % 12; return [y && `${y} ${y > 1 ? 'anos' : 'ano'}`, m && `${m} ${m > 1 ? 'meses' : 'mês'}`].filter(Boolean).join(' e '); };
const sv = (vb, body, label, cls = '') => `<svg class="vz ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;
const t = (x, y, s, cls = 'vz-m', a = 'start') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;

/* git remote -v: recorte Sul e Sudeste do Brasil, em projeção simples (lon x 14,4; lat x 16) */
const BRASIL = 'M5.4 195.5L24.6 173.6L40.9 158.1L50.5 151.6L62.7 142.8L63.0 130.0L55.7 120.8L48.6 123.8L51.4 114.6L53.4 105.1L53.4 96.3L48.2 93.4L42.8 96.0L37.4 95.3L35.7 89.2L34.4 74.5L31.7 69.7L22.0 65.4L16.1 68.5L0.9 65.4L1.9 43.7L-2.4 34.8L2.1 31.5L0.7 22.4L4.7 15.4L7.2 2.8L3.8 -7.2L-4.0 -11.7L-5.6 -18.0L-3.5 -27.2L-31.1 -27.9L-36.6 -46.5L-32.4 -46.8L-32.6 -53.7L-35.4 -58.3L-36.0 -67.6L-44.4 -72.3L-53.5 -72.2L-59.4 -76.8L-69.2 -80.0L-74.8 -86.0L-91.0 -88.6L-106.6 -102.9L-105.4 -113.7L-107.2 -119.8L-105.7 -131.8L-124.5 -129.1L-132.1 -123.1L-144.7 -116.6L-147.9 -111.8L-155.3 -111.4L-166.0 -112.8L-174.2 -110.0L-180.7 -111.9L-179.7 -136.2L-191.6 -126.7L-204.3 -127.1L-209.7 -135.7L-219.3 -136.6L-216.2 -143.5L-224.2 -153.2L-230.2 -167.6L-226.4 -170.5L-226.4 -177.3L-217.7 -181.9L-219.2 -190.6L-215.5 -196.1L-214.4 -203.6L-198.0 -214.5L-186.2 -217.6L-184.2 -220.0L-171.3 -219.2L-164.8 -263.1L-164.5 -270.0L-166.7 -279.2L-173.1 -285.0L-173.0 -296.7L-164.9 -299.3L-162.0 -297.6L-161.5 -303.8L-170.0 -305.4L-170.2 -315.4L-142.1 -315.1L-137.3 -320.6L-133.3 -315.5L-130.5 -306.1L-127.8 -308.1L-119.9 -299.6L-108.7 -300.6L-105.9 -305.5L-95.2 -309.3L-89.3 -311.9L-87.6 -318.7L-77.3 -323.2L-78.1 -326.6L-90.3 -328.0L-92.3 -338.0L-91.7 -348.8L-98.2 -352.9L-95.5 -354.4L-84.8 -352.3L-73.3 -348.3L-69.2 -352.1L-58.8 -354.6L-42.7 -360.6L-37.5 -366.7L-39.4 -371.2L-31.9 -371.9L-28.5 -368.2L-30.4 -361.2L-25.5 -358.8L-22.1 -351.3L-26.1 -345.7L-28.4 -332.1L-24.7 -324.0L-23.7 -316.6L-14.8 -309.1L-7.8 -308.3L-6.2 -311.4L-1.6 -312.1L4.9 -314.9L9.6 -319.2L17.5 -317.8L21.0 -318.4L28.9 -317.1L30.2 -320.4L27.7 -323.5L29.2 -328.2L35.0 -326.7L41.8 -328.4L50.0 -325.0L56.3 -321.7L60.8 -326.0L64.0 -325.4L66.0 -320.9L72.9 -322.0L78.4 -328.1L82.8 -339.9L91.3 -354.5L96.2 -355.3L99.8 -346.4L107.9 -318.4L115.6 -315.8L116.0 -304.7L105.1 -291.6L109.6 -286.7L135.1 -284.2L135.6 -268.2L146.5 -278.7L164.6 -272.9L188.6 -263.2L195.6 -253.8L193.2 -244.9L210.0 -249.9L238.0 -241.4L259.5 -242.0L280.8 -228.8L299.2 -210.9L310.3 -206.2L322.6 -205.6L327.8 -200.6L332.7 -180.2L335.1 -170.5L329.4 -144.1L322.0 -133.6L301.7 -111.3L292.6 -93.3L281.9 -79.4L278.3 -79.1L274.3 -67.3L275.3 -37.3L271.3 -12.7L269.8 -2.1L265.2 4.2L262.6 25.6L248.0 46.5L245.6 63.0L233.9 69.9L230.6 79.5L214.9 79.5L192.3 85.6L182.1 92.7L166.0 97.4L149.1 110.2L136.9 126.0L134.8 138.0L137.2 146.8L134.5 163.0L131.2 170.8L121.1 179.6L105.2 207.8L92.5 220.4L82.7 227.9L76.1 243.1L66.6 252.3L62.6 243.2L69.0 235.6L60.7 224.8L49.4 215.9L34.5 205.7L29.2 206.1L14.7 193.8L5.4 195.5Z';
export function remote() {
  const P = (lo, la) => [+((lo + 58) * 14.4).toFixed(1), +((-18 - la) * 16).toFixed(1)];
  const [sx, sy] = P(-46.63, -23.55), [cx, cy] = P(-49.27, -25.43), [hx, hy] = P(-51.18, -29.17);
  const arc = (x, y, k) => `M${hx} ${hy}Q${(hx + x) / 2 + k} ${(hy + y) / 2 - 18} ${x} ${y}`;
  // lente: Caxias do Sul e Farroupilha ficam a uns 20 km, então ampliei 19 vezes
  const L = [236, 118], Q = (lo, la) => [+(L[0] + (lo + 51.26) * 280).toFixed(1), +(L[1] + (-29.2 - la) * 280).toFixed(1)];
  const [ax, ay] = Q(-51.179, -29.168), [fx, fy] = Q(-51.347, -29.225);
  const b = `<path class="vz-land" d="${BRASIL}"/>
    <path class="vz-arc" d="${arc(sx, sy, 10)}"/><path class="vz-arc" style="animation-delay:.6s" d="${arc(cx, cy, -6)}"/>
    <circle class="vz-ring" cx="${sx}" cy="${sy}" r="8"/><circle class="vz-acc" cx="${sx}" cy="${sy}" r="4"/>
    <circle class="vz-ring" style="animation-delay:1.2s" cx="${cx}" cy="${cy}" r="8"/><circle class="vz-acc" cx="${cx}" cy="${cy}" r="4"/>
    ${t(sx - 12, sy - 8, 'São Paulo', 'vz-l', 'end')}${t(cx - 10, cy + 4, 'Curitiba', 'vz-l', 'end')}
    <path class="vz-lead" d="M${hx} ${hy}L${L[0] - 22} ${L[1] + 21}"/><circle class="vz-ink" cx="${hx}" cy="${hy}" r="3"/>
    <circle class="vz-lens" cx="${L[0]}" cy="${L[1]}" r="30"/>
    <circle class="vz-ink" cx="${ax}" cy="${ay}" r="4"/><circle class="vz-edu" cx="${fx}" cy="${fy}" r="4"/>
    ${t(L[0], L[1] + 48, 'Caxias do Sul', 'vz-l', 'middle')}${t(L[0], L[1] + 64, 'Farroupilha', 'vz-l vz-edu-t', 'middle')}
    ${t(hx - 4, hy - 20, 'remoto', 'vz-l vz-acc-t', 'end')}`;
  return sv('0 0 290 210', b, 'Mapa do Sul e Sudeste do Brasil: Caxias do Sul e Farroupilha, na Serra gaúcha, e linhas de trabalho remoto até São Paulo e Curitiba', 'vz-map');
}

/* git shortlog: tempo em cada cargo, com meses contados das datas reais */
export const ROLES = [
  { co: 'Pilar', role: 'Tech Lead', a: '2025-09', now: 1 },
  { co: 'Pilar', role: 'Engenheiro sênior', a: '2024-11', b: '2025-09' },
  { co: 'Compass.uol', role: 'Front-end pleno, na Vivo', a: '2022-08', b: '2024-11' },
  { co: 'Conecta Softwares', role: 'Full stack', a: '2020-03', b: '2022-07' },
  { co: 'Vero Dellaudo', role: 'Estágio full stack', a: '2019-04', b: '2020-02' },
];
export function shortlog() {
  const rs = ROLES.map((r) => ({ ...r, n: months(r.a, r.b) })); const max = Math.max(...rs.map((r) => r.n));
  const total = months('2019-04');
  return `<div class="sl">
    ${rs.map((r, i) => `<div class="sl__r${r.now ? ' sl__r--now' : ''}" style="--i:${i}"><span class="sl__n">${r.n}</span><span class="sl__who"><b>${r.co}</b> ${r.role}</span><span class="sl__bar"><i style="width:${(r.n / max) * 100}%"></i></span><span class="sl__d">${dur(r.n)}${r.now ? ' até hoje' : ''}</span></div>`).join('')}
    <p class="sl__tot">${total} meses de trabalho desde abril de 2019, em 4 empresas. Antes disso, 4 anos de curso técnico.</p></div>`;
}

/* stack ao longo do tempo, por empresa */
const CO = [['Vero', 2019.25, 2020.17], ['Conecta', 2020.17, 2022.58], ['Compass', 2022.58, 2024.84], ['Pilar', 2024.84, NOWY]];
const STK = [
  ['Vue e Nuxt', [[1, 'Vue'], [2, 'Vue, Vuex'], [3, 'Nuxt']]],
  ['TypeScript', [[2, 'TypeScript']]],
  ['Node', [[2, 'Express'], [3, 'BFF']]],
  ['Python', [[0, 'Python'], [3, 'APIs, lambdas']]],
  ['PHP', [[0, 'CodeIgniter']]],
  ['.NET', [[1, 'ASP.NET MVC, EF']]],
  ['SQL', [[0, 'MySQL'], [1, 'SQL Server']]],
  ['MongoDB', [[3, 'Atlas']]],
  ['AWS', [[3, 'ECS, Lambda, SQS']]],
  ['Testes', [[2, 'Jest, Stryker'], [3, 'E2E']]],
  ['CI/CD', [[1, 'Azure DevOps'], [2, 'Jenkins'], [3, 'GitLab']]],
  ['Observabilidade', [[2, 'Kibana'], [3, 'Datadog']]],
];
export function stackmap() {
  const A = 2019.2, X = (y) => ((y - A) / (NOWY - A)) * 100;
  const band = CO.map(([n, a, b]) => `<span class="sm__co" style="left:${X(a)}%;width:${X(b) - X(a)}%"><b>${n}</b></span>`).join('');
  const yrs = [2020, 2021, 2022, 2023, 2024, 2025].map((y) => `<span class="${y % 2 ? 'odd' : ''}" style="left:${X(y)}%">${y}</span>`).join('') + `<span class="end" style="left:100%">hoje</span>`;
  return `<div class="sm" role="table" aria-label="Tecnologias que usei em cada empresa, de 2019 até hoje">
    <div class="sm__h" role="row"><span class="sm__l" role="columnheader">tecnologia</span><span class="sm__tk" role="columnheader">${band}</span></div>
    ${STK.map(([l, segs], i) => `<div class="sm__r" role="row" style="--i:${i}"><span class="sm__l" role="rowheader">${l}</span><span class="sm__tk" role="cell">${segs.map(([c, w]) => `<i style="left:${X(CO[c][1])}%;width:calc(${X(CO[c][2]) - X(CO[c][1])}% - 2px)" title="${CO[c][0]}: ${w}" class="${c === 3 ? 'now' : ''}"><em>${w}</em></i>`).join('')}</span></div>`).join('')}
    <div class="sm__y" aria-hidden="true"><span class="sm__l"></span><span class="sm__tk">${yrs}</span></div></div>`;
}

/* Compass: micro frontends num portal B2B e testes de mutação (ilustração da técnica) */
export function mfe() {
  const tile = (x, y, w, h, l, d) => `<rect class="vz-tile" style="--d:${d}s" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>${t(x + 8, y + 17, l, 'vz-m vz-t')}${t(x + 8, y + h - 9, 'deploy próprio', 'vz-m')}`;
  const a = sv('0 0 200 132', `<rect class="vz-frame" x="1" y="1" width="198" height="130" rx="8"/><line class="vz-grid" x1="1" x2="199" y1="20" y2="20"/>
    <circle class="vz-dot" cx="11" cy="11" r="2.5"/><circle class="vz-dot" cx="19" cy="11" r="2.5"/>${t(30, 14, 'portal B2B', 'vz-m')}
    ${tile(9, 29, 88, 44, 'micro front 1', 0)}${tile(103, 29, 88, 44, 'micro front 2', 0.4)}${tile(9, 79, 182, 44, 'micro front 3', 0.8)}`, 'Ilustração: portal montado com três micro frontends, cada um com deploy próprio');
  const b = sv('0 0 150 132', `<rect class="vz-frame" x="1" y="1" width="148" height="130" rx="8"/>
    ${t(12, 22, 'teste de mutação', 'vz-m vz-acc-t')}
    <text class="vz-code" x="12" y="50">total <tspan class="vz-gt">&gt;</tspan> limite</text>
    <text class="vz-code vz-mutant" x="12" y="72">total <tspan class="vz-acc-t">&gt;=</tspan> limite</text>
    ${t(12, 100, 'o teste falhou,', 'vz-m')}${t(12, 114, 'o mutante morreu', 'vz-m vz-acc-t')}`, 'Ilustração: o Stryker troca maior por maior ou igual e o teste pega a mudança');
  return `<span class="vz-pair">${a}${b}</span>`;
}

/* Conecta: core do ERP e os módulos fiscais */
export function nfe() {
  const mod = (x, y, l, d) => `<g class="vz-mod" style="--d:${d}s"><rect x="${x}" y="${y}" width="68" height="30" rx="4"/>${t(x + 34, y + 19, l, 'vz-s vz-t', 'middle')}</g>`;
  const b = `<rect class="vz-core" x="88" y="44" width="64" height="40" rx="6"/>${t(120, 61, 'core', 'vz-s vz-t', 'middle')}${t(120, 76, '.NET', 'vz-s vz-mut', 'middle')}
    <path class="vz-flow" d="M70 23H104V44M70 105H104V84M170 23H136V44M170 105H136V84"/>
    ${mod(2, 8, 'pedidos', 0)}${mod(2, 90, 'entradas', 0.3)}${mod(170, 8, 'NF-e', 0.6)}${mod(170, 90, 'NFC-e', 0.9)}`;
  return sv('0 0 240 128', b, 'Ilustração: o core do ERP ligado aos módulos de pedidos, entradas, NF-e e NFC-e');
}

/* formação e trabalho em paralelo, em escala real */
export function parallel() {
  const X = (y) => 4 + ((y - 2015) / (NOWY - 2015)) * 252;
  const bar = (a, b, y, l, cls, up = 1) => `<rect class="${cls}" x="${X(a)}" y="${y}" width="${X(b) - X(a) - 2}" height="9" rx="2"/>${t(X(a), up ? y - 5 : y + 22, l, 'vz-s vz-t')}`;
  const b = `<rect class="vz-par" x="${X(2019.25)}" y="18" width="${X(2023.95) - X(2019.25)}" height="94" rx="3"/>
    ${t(4, 12, 'estudo', 'vz-s vz-mut')}${bar(2015, 2019, 31, 'IFRS', 'vz-edu-f')}${bar(2019, 2023.95, 31, 'UCS', 'vz-edu-f')}
    ${t(4, 62, 'trabalho', 'vz-s vz-mut')}${bar(2019.25, 2020.17, 81, 'Vero', 'vz-ink-f')}${bar(2020.17, 2022.58, 81, 'Conecta', 'vz-ink-f', 0)}${bar(2022.58, 2024.84, 81, 'Compass', 'vz-ink-f')}${bar(2024.84, NOWY, 81, 'Pilar', 'vz-acc-f', 0)}
    <line class="vz-grid" x1="4" x2="256" y1="118" y2="118"/>${[2015, 2019, 2023].map((y) => t(X(y), 134, y, 'vz-s vz-mut')).join('')}${t(256, 134, 'hoje', 'vz-s vz-mut', 'end')}`;
  return `${sv('0 0 260 138', b, 'Linha do tempo: IFRS de 2015 a 2018 e UCS de 2019 a 2023, ao mesmo tempo que Vero, Conecta e Compass')}<span class="vz-cap">A faixa marca os anos em que estudei e trabalhei ao mesmo tempo.</span>`;
}
