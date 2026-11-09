// Home: grafo de commits protagonista. main = carreira; formacao = IFRS/UCS; cada case é uma branch com commits e merge.
import { mark, icon } from './brand.js';
import * as Z from './teasers.js';
import * as V from './visuals.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7); };
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function initHome({ SETS, setOf, openSet, EMAIL, VEJA }) {
  const BR = { time: 'time-e-engenharia', alertas: 'radar-imoveis', shorts: 'shorts-hls', mapa: 'mapa-h3', cidade: 'segunda-cidade', pelos: 'pelos-caminhos', formacao: 'formacao' };
  const BYBR = Object.fromEntries(Object.entries(BR).map(([k, v]) => [v, k]));
  const TAGS = Object.fromEntries(SETS.map((s) => [s.id, s.tags]));
  const TEASE = { time: Z.checklist, alertas: Z.alert, shorts: Z.shorts, mapa: Z.hex, cidade: Z.cities, pelos: Z.scan };
  const SUM = {
    time: '1:1 com cada pessoa, tech talks, guia de MR, runbooks e feature flags que saíram do papel.',
    alertas: 'Buscas salvas e avisos numa base só, usada pelo portal e pela rede. Escrevi a RFC sozinho.',
    shorts: 'Vídeo curto no portal, da ideia e dos benchmarks à infraestrutura de entrega em HLS.',
    mapa: 'Na busca avançada, a feature mais complexa do ano, os imóveis viram células H3 no mapa.',
    cidade: 'Liderei a expansão do portal para a segunda cidade. Hoje ele atende São Paulo e Curitiba.',
    pelos: 'TCC: plataforma de adoção com app, API, permissões por perfil e raça pela foto.',
  };
  const ST = (set, i) => { const s = setOf(set).stories[i]; return `${s.k.toLowerCase()}: ${s.t.charAt(0).toLowerCase()}${s.t.slice(1)}`; };
  const commits = (id, idx, lane = 1) => idx.map((i) => ({ kind: 'c', lane, set: id, s: i, br: id, msg: ST(id, i), tags: TAGS[id] }));
  const merge = (id, extra = {}) => ({ kind: 'm', lane: 0, set: id, s: 0, br: id, merge: id, title: setOf(id).titulo, tags: TAGS[id], ...extra });
  const ROWS = [
    { kind: 'year', label: '2025 até hoje', sub: 'Tech Lead' },
    merge('time', { refs: ['HEAD -> main'], head: 1 }), ...commits('time', [4, 3, 1, 0]),
    merge('alertas'), ...commits('alertas', [2, 1, 0]),
    merge('shorts'), ...commits('shorts', [2]),
    { kind: 'tag', lane: 0, set: 'trajetoria', s: 5, br: 'main', title: 'Passei a liderar o time do PilarHomes', refs: ['tag: tech-lead'], date: 'set/2025', y: 2025.67, span: [2025.67, 2026.9], tags: ['Carreira'] },
    { kind: 'blk', id: 'remote' },
    { kind: 'year', label: '2024 a 2025', sub: 'engenheiro sênior' },
    ...commits('shorts', [1, 0]),
    merge('mapa'), ...commits('mapa', [2, 1, 0]),
    merge('cidade'), ...commits('cidade', [2, 1, 0]),
    { kind: 'era', lane: 0, set: 'trajetoria', s: 5, br: 'main', co: 'Pilar', role: 'Engenheiro de software sênior', date: 'nov/2024', span: [2024.83, 2025.67], y: 2024.83, period: 'nov/2024 a set/2025', txt: 'Entrei no lançamento do PilarHomes e trabalhei do front ao back. Virei o ponto focal com produto e design.', stack: ['Nuxt', 'Node', 'Python', 'AWS'], tags: ['Carreira'] },
    { kind: 'blk', id: 'shortlog' },
    { kind: 'year', label: '2019 a 2024', sub: 'trabalho e faculdade em paralelo' },
    { kind: 'm', lane: 0, set: 'trajetoria', s: 2, br: 'formacao', merge: 'formacao', title: 'Bacharel em Ciência da Computação', date: '2023', y: 2023.9, span: [2019, 2023.95], txt: 'Bacharelado na UCS, em Caxias do Sul. A formação entra na main.', tags: ['Formação'], edu: 1 },
    { kind: 'm', lane: 1, set: 'pelos', s: 0, br: 'pelos', merge: 'pelos', into: 'formacao', title: 'Pelos Caminhos', tags: TAGS.pelos, edu: 1, y: 2023.8 },
    ...commits('pelos', [3, 2], 2),
    { kind: 'era', lane: 0, set: 'trajetoria', s: 4, br: 'main', co: 'Compass.uol', role: 'Desenvolvedor front-end pleno', date: 'ago/2022', span: [2022.6, 2024.83], y: 2022.6, period: 'ago/2022 a nov/2024', txt: 'Alocado na Vivo, no portal B2B de empresas, feito em micro frontends. Implantei testes de mutação com Stryker e atuei em SRE.', stack: ['Vue', 'TypeScript', 'Node', 'Stryker', 'Kibana'], vis: 'mfe', tags: ['Carreira'] },
    ...commits('pelos', [1, 0], 2),
    { kind: 'era', lane: 0, set: 'trajetoria', s: 3, br: 'main', co: 'Conecta Softwares', role: 'Full stack', date: 'mar/2020', span: [2020.2, 2022.55], y: 2020.2, period: 'mar/2020 a jul/2022', txt: 'Core de um ERP em .NET, nos módulos fiscais: NF-e, NFC-e, entradas e pedidos.', stack: ['.NET', 'ASP.NET MVC', 'Vue', 'SQL Server'], vis: 'nfe', tags: ['Carreira'] },
    { kind: 'era', lane: 0, set: 'trajetoria', s: 1, br: 'main', co: 'Vero Dellaudo', role: 'Estágio full stack', date: 'abr/2019', span: [2019.25, 2020.1], y: 2019.25, period: 'abr/2019 a fev/2020', txt: 'Sistemas web de gestão interna numa clínica de diagnóstico por imagem.', stack: ['PHP', 'Python', 'MySQL'], refs: ['primeiro commit da main'], tags: ['Carreira'], root: 1 },
    { kind: 'edu', lane: 1, set: 'trajetoria', s: 2, br: 'formacao', title: 'UCS, Ciência da Computação', date: '2019', y: 2019.1, span: [2019, 2023.95], txt: 'Bacharelado em Caxias do Sul, em paralelo com o trabalho.', tags: ['Formação'] },
    { kind: 'year', label: '2015 a 2018', sub: 'onde começou' },
    { kind: 'edu', lane: 1, set: 'trajetoria', s: 0, br: 'formacao', title: 'IFRS, técnico em Informática', date: '2015', y: 2015.1, span: [2015, 2018.95], txt: 'Curso técnico no campus Farroupilha.', tags: ['Formação'], root: 1 },
  ];
  const NOG = (r) => r.kind === 'year' || r.kind === 'blk';
  ROWS.forEach((r, i) => { r.i = i; if (!NOG(r)) r.h = hash(`${r.set}${r.s}${r.title || r.msg || r.co}`); });
  const G = ROWS.filter((r) => !NOG(r));
  const FILTERS = ['Tudo', 'Produto', 'Arquitetura', 'Time', 'Formação', 'Carreira'];

  /* ---------- markup ---------- */
  const refs = (r) => (r.refs || []).map((x) => `<em class="ref${x.startsWith('HEAD') ? ' ref--head' : ''}">${x}</em>`).join('');
  const tagchips = (r) => r.tags.map((t) => `<span class="chip">${t}</span>`).join('');
  const rowHtml = (r) => {
    const a = `data-row="${r.i}" data-br="${r.br}" data-tags="${(r.tags || []).join('|')}"`;
    if (r.kind === 'blk') return BLK[r.id]();
    if (r.kind === 'year') return `<li class="yr" aria-hidden="true"><span class="yr__l">${r.label}</span><span class="yr__s">${r.sub}</span></li>`;
    if (r.kind === 'c') return `<li class="r r--c in-${r.lane}"><button type="button" ${a}><code translate="no">${r.h}</code><span>${r.msg}</span></button></li>`;
    if (r.kind === 'm' && !r.edu) return `<li class="r r--m r--${r.set}"><button type="button" ${a}>
      <span class="m__git"><code translate="no">${r.h}</code> Merge branch '${BR[r.merge]}' ${refs(r)}</span>
      <span class="m__body"><span class="m__vis">${TEASE[r.set]()}</span><span class="m__txt"><span class="m__t">${r.title}</span><span class="m__d">${SUM[r.set]}</span><span class="m__tags">${tagchips(r)}<span class="m__go">Ver a história ${icon('right', { size: 16 })}</span></span></span></span></button></li>`;
    if (r.kind === 'm' && r.set === 'pelos') return `<li class="r r--m r--edu r--pelos"><button type="button" ${a}>
      <span class="m__git"><code translate="no">${r.h}</code> Merge branch 'pelos-caminhos' into formacao</span>
      <span class="m__body"><span class="m__vis">${Z.scan()}</span><span class="m__txt"><span class="m__t">Pelos Caminhos</span><span class="m__d">${SUM.pelos}</span><span class="m__tags">${tagchips(r)}<span class="m__go">Ver a história ${icon('right', { size: 16 })}</span></span></span></span></button></li>`;
    if (r.kind === 'm') return `<li class="r r--grad"><button type="button" ${a}><span class="m__git"><code translate="no">${r.h}</code> Merge branch 'formacao' · ${r.date}</span><span class="g__t">${icon('cap', { size: 22 })}${r.title}</span><span class="g__d">UCS, Caxias do Sul. A formação entra na main.</span><span class="g__vis">${V.parallel()}</span></button></li>`;
    if (r.kind === 'tag') return `<li class="r r--tag"><button type="button" ${a}><span class="t__ref">${refs(r)}<time>${r.date}</time></span><span class="t__t">${r.title}</span><span class="t__d">Lidero o time de engenharia do PilarHomes, nas duas cidades.</span></button></li>`;
    if (r.kind === 'era') return `<li class="r r--era${r.vis ? ' r--era-v' : ''}"><button type="button" ${a}><span class="e__p"><code translate="no">${r.h}</code>${r.period}${refs(r)}</span><span class="e__co">${r.co}</span><span class="e__role">${r.role}</span><span class="e__txt">${r.txt}</span><span class="e__tr">${Z.track(r.span[0], r.span[1], 'tz-ink-f')}</span><span class="e__st">${r.stack.map((s) => `<span>${s}</span>`).join('')}</span>${r.vis ? `<span class="e__vis">${V[r.vis]()}</span>` : ''}</button></li>`;
    return `<li class="r r--eduk"><button type="button" ${a}><span class="m__git"><code translate="no">${r.h}</code> formacao · ${r.date}</span><span class="g__t">${icon('cap', { size: 20 })}${r.title}</span><span class="g__d">${r.txt}</span></button></li>`;
  };
  const BLK = {
    remote: () => `<li class="blk blk--remote"><p class="blk__cmd"><span class="p">$</span> git remote -v</p><div class="blk__body"><div class="blk__vis">${V.remote()}</div><dl class="rm">
      <div><dt>caxias-do-sul</dt><dd>UCS, Vero e Conecta. Hoje trabalho daqui, remoto.</dd></div>
      <div><dt class="rm--edu">farroupilha</dt><dd>IFRS, onde fiz o técnico em Informática.</dd></div>
      <div><dt class="rm--acc">sao-paulo · curitiba</dt><dd>As duas cidades que o PilarHomes atende.</dd></div></dl></div></li>`,
    shortlog: () => `<li class="blk blk--sl"><p class="blk__cmd"><span class="p">$</span> git shortlog -s --since=2019 <span class="blk__h">meses por cargo</span></p>${V.shortlog()}</li>`,
  };
  const SUG = ['git log --tag=arquitetura', 'git show shorts-hls', 'git checkout pelos-caminhos', 'git branch', 'help'];
  const app = $('#app');
  app.innerHTML = `
<header class="top"><a class="brand" href="#" aria-label="Lucas Gehlen, início">${mark({ size: 32 })}<span translate="no">Lucas Gehlen</span></a><nav class="top__r" aria-label="Seções"><a href="#historico">Histórico</a><a href="#contato">Contato</a></nav></header>
<section class="hero">
  <div class="hero__id">
    <p class="hero__head"><span class="pulse"></span><code translate="no">HEAD -> main</code> · hoje</p>
    <h1 translate="no">Lucas Gehlen</h1>
    <p class="role">Tech Lead do PilarHomes</p>
    <p class="line">Trabalho entre produto e engenharia: vejo o que é viável e desenho a arquitetura antes de a tarefa chegar ao time. O time é a minha principal entrega.</p>
    <p class="meta">Caxias do Sul · Vue, Nuxt, Node, Python, AWS</p>
  </div>
  <div class="term" role="region" aria-label="Terminal para navegar no histórico">
    <div class="term__bar"><code translate="no">~/lucas-gehlen</code><code class="term__br">(main)</code></div>
    <div class="term__out" aria-live="polite"><p><span class="p">$</span> git log --oneline --graph</p><p class="o">${G.filter((r) => r.kind === 'm').length} merges, ${G.filter((r) => r.kind === 'era' || r.kind === 'edu' || r.kind === 'tag').length} etapas de carreira e formação. Digite <b>help</b> ou toque numa sugestão.</p></div>
    <form class="term__in" autocomplete="off"><label for="cmd" class="p">$</label><input id="cmd" name="cmd" spellcheck="false" autocapitalize="off" placeholder="git show shorts-hls" aria-label="Comando git"></form>
    <div class="term__sug">${SUG.map((s) => `<button type="button" data-cmd="${s}">${s}</button>`).join('')}</div>
  </div>
</section>
<div class="tagbar" role="group" aria-label="Filtrar commits por tag"><code translate="no">--tag</code>${FILTERS.map((f, i) => `<button type="button" data-f="${f}" aria-pressed="${!i}">${f}</button>`).join('')}</div>
<main class="stage">
  <section class="log" id="historico" aria-label="Histórico de carreira e projetos">
    <svg class="graph" aria-hidden="true"><defs><clipPath id="pen"><rect x="-20" y="-40" width="400" height="0"/></clipPath></defs><g class="g-edges" clip-path="url(#pen)"></g><g class="g-nodes"></g><circle class="penhead" r="5"/></svg>
    <ol class="rows">${ROWS.map(rowHtml).join('')}</ol>
    <div class="blk blk--sm"><p class="blk__cmd"><span class="p">$</span> git log --stat --since=2019 -- stack/ <span class="blk__h">o que usei em cada empresa</span></p>${V.stackmap()}</div>
    <div class="stack"><p class="stack__h"><code translate="no">$ cat stack.txt</code></p><ol>
      <li><span>front e BFF</span>Nuxt, Node</li><li><span>APIs e lambdas</span>Python</li><li><span>dados</span>MongoDB Atlas</li><li><span>infra</span>AWS ECS, Lambda, SQS, CloudFront, ElastiCache, Pulumi</li><li><span>entrega</span>GitLab CI/CD, Docker</li><li><span>observabilidade</span>Datadog, Mixpanel</li></ol></div>
  </section>
  <aside class="peek" aria-live="polite"><div class="peek__in"></div></aside>
</main>
<footer class="foot" id="contato">
  <p class="foot__h">Fale comigo</p>
  <div class="foot__term"><p><span class="p">$</span> git commit --allow-empty -m "<span class="foot__msg">oi, Lucas</span>"</p><p><span class="p">$</span> git push <span class="foot__mail">${EMAIL}</span></p></div>
  <form class="foot__form"><label for="msg">Mensagem do commit</label><input id="msg" name="msg" maxlength="72" value="oi, Lucas" autocomplete="off"><a class="foot__send" href="mailto:${EMAIL}?subject=oi%2C%20Lucas">Enviar por e-mail</a></form>
  <p class="foot__links"><a href="mailto:${EMAIL}">${EMAIL}</a><a href="https://www.linkedin.com/in/lgehlen" target="_blank" rel="noopener">LinkedIn</a><span>Caxias do Sul, RS</span></p>
</footer>
<div class="scrub" aria-label="Linha do tempo" role="group"><span class="scrub__y">hoje</span><div class="scrub__t" role="slider" tabindex="0" aria-label="Ir para um ano" aria-valuemin="2015" aria-valuemax="2026" aria-valuenow="2026"><i class="scrub__th"></i></div></div>
<div class="sheet" hidden><div class="sheet__in" role="dialog" aria-modal="false" aria-label="Prévia do commit"><span class="sheet__grab" aria-hidden="true"></span><button type="button" class="sheet__x" data-sheet-close aria-label="Fechar prévia">${icon('close', { size: 20 })}</button><div class="sheet__c"></div></div></div>
<div class="st" id="st" role="dialog" aria-modal="true" aria-label="Stories" hidden></div>`;

  /* ---------- tema ---------- */

  /* ---------- grafo ---------- */
  const svg = $('.graph'), edges = $('.g-edges'), nodes = $('.g-nodes'), list = $('.rows'), clip = $('#pen rect'), penhead = $('.penhead');
  let ys = [], gTop = 0, H = 0, lit = new Set();
  const lw = () => (innerWidth < 768 ? 15 : 28), X = (l) => 10 + l * lw();
  function layout() {
    // offsetTop ignora o translate da animação de entrada; o nó fica na primeira linha de cada cartão
    const ANC = { c: 'code', m: '.m__git', tag: '.t__ref', era: '.e__p', edu: '.m__git' };
    ys = ROWS.map((r) => { if (NOG(r)) return null; const b = list.querySelector(`[data-row="${r.i}"]`), li = b.parentElement, a = b.querySelector(ANC[r.kind]); const lr = li.getBoundingClientRect(), ar = a.getBoundingClientRect(); return Math.round(li.offsetTop - list.offsetTop + (ar.top - lr.top) + ar.height / 2); });
    H = list.offsetHeight; svg.setAttribute('viewBox', `0 0 ${X(2) + 14} ${H}`); svg.style.width = `${X(2) + 14}px`; svg.style.height = `${H}px`;
    const P = [], S = (a, b) => Math.min(42, (b - a) / 3);
    const main = G.filter((r) => r.lane === 0);
    P.push(['main', `M${X(0)} ${ys[main[0].i] - 60}V${ys[main.at(-1).i]}`]);
    const by = {}; G.forEach((r) => { if (r.kind === 'c') (by[r.br] ||= []).push(r); });
    Object.entries(by).forEach(([b, rs]) => {
      const lane = rs[0].lane, parent = lane === 2 ? 1 : 0, m = G.find((r) => r.merge === b), last = rs.at(-1);
      const f = G.find((r) => r.i > last.i && r.lane === parent); const y0 = ys[m.i], y1 = ys[f.i], s = S(y0, y1), xp = X(parent), xl = X(lane);
      P.push([b, `M${xp} ${y0}C${xp} ${y0 + s * 0.6} ${xl} ${y0 + s * 0.4} ${xl} ${y0 + s}V${y1 - s}C${xl} ${y1 - s * 0.4} ${xp} ${y1 - s * 0.6} ${xp} ${y1}`]);
    });
    const fm = G.find((r) => r.merge === 'formacao'), froot = G.find((r) => r.kind === 'edu' && r.root), y0 = ys[fm.i], s = 42;
    P.push(['formacao', `M${X(0)} ${y0}C${X(0)} ${y0 + s * 0.6} ${X(1)} ${y0 + s * 0.4} ${X(1)} ${y0 + s}V${ys[froot.i]}`]);
    const cls = (b) => (b === 'main' ? 'e-main' : b === 'formacao' || b === 'pelos' ? 'e-edu' : 'e-case');
    edges.innerHTML = P.map(([b, d]) => `<path class="edge ${cls(b)}" data-br="${b}" d="${d}"/>`).join('');
    nodes.innerHTML = G.map((r) => {
      const x = X(r.lane), y = ys[r.i], k = r.kind === 'm' ? (r.edu ? 'n-edum' : 'n-merge') : r.kind === 'c' ? (r.lane === 2 ? 'n-educ' : 'n-commit') : r.kind === 'edu' ? 'n-edu' : 'n-career';
      const rad = { 'n-merge': 9, 'n-edum': 8, 'n-commit': 4.5, 'n-educ': 4.5, 'n-edu': 6, 'n-career': 7 }[k];
      return `<g class="node ${k}" data-row="${r.i}" data-br="${r.br}" transform="translate(${x} ${y})">${r.head ? '<circle class="n-pulse" r="9"/>' : ''}${r.kind === 'm' ? `<circle class="n-ring" r="${rad}"/>` : ''}<circle class="n-dot" r="${rad}"/>${r.kind === 'm' && !r.edu ? '<circle class="n-core" r="3"/>' : ''}</g>`;
    }).join('');
    gTop = list.getBoundingClientRect().top + scrollY; lit = new Set(); onScroll(true);
  }
  /* ---------- scroll: o grafo é escrito commit a commit ---------- */
  let ticking = false, spy = null;
  function onScroll(force) {
    const pen = reduce ? H + 100 : scrollY + innerHeight * 0.8 - gTop;
    clip.setAttribute('height', Math.max(0, pen + 40));
    penhead.setAttribute('cx', X(0)); penhead.setAttribute('cy', Math.min(pen, H)); penhead.classList.toggle('on', pen > 0 && pen < H - 4 && !reduce);
    nodes.querySelectorAll('.node').forEach((n) => { const i = +n.dataset.row, on = ys[i] <= pen; if (on !== lit.has(i) || force === true) { n.classList.toggle('lit', on); on ? lit.add(i) : lit.delete(i); } });
    // scroll-spy: commit mais perto do centro
    const mid = scrollY + innerHeight * 0.45 - gTop; let best = null, bd = 1e9;
    G.forEach((r) => { const d = Math.abs(ys[r.i] - mid); if (d < bd && !hiddenRow(r)) { bd = d; best = r; } });
    if (best && best !== spy) { spy = best; if (!hoverRow && wide()) showPeek(best); updScrub(); }
    $('.scrub').classList.toggle('on', mid > -200 && mid < H + 200);
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => onScroll()); } }, { passive: true });

  /* ---------- cartões entram no scroll e teasers só animam quando visíveis ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { e.target.classList.toggle('in', e.isIntersecting || e.target.classList.contains('in')); e.target.classList.toggle('live', e.isIntersecting); }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.r, .yr, .blk').forEach((li) => io.observe(li));

  /* ---------- prévia (painel no desktop, folha no celular) ---------- */
  const wide = () => innerWidth >= 1200;
  let hoverRow = null;
  function peekHtml(r) {
    const s = setOf(r.set), st = s.stories[r.s];
    const vis = TEASE[r.set] ? TEASE[r.set]() : r.span ? Z.track(r.span[0], r.span[1], r.kind === 'edu' || r.edu ? 'tz-edu-f' : 'tz-acc-f') : '';
    const brn = r.br === 'main' ? 'main' : BR[r.br];
    const extra = r.kind === 'tag' ? `<p class="pk__src">Segundo a VEJA, o portal já responde por uma em cada cinco vendas da Pilar. <a href="${VEJA}" target="_blank" rel="noopener">VEJA, out/2026</a></p>` : '';
    return `<p class="pk__meta"><code translate="no">commit ${r.h}</code><span>${r.date || brn}</span></p>
      <p class="pk__br"><code translate="no">${r.kind === 'm' ? `merge · ${brn}` : r.kind === 'c' ? `${brn} · ${st.k.toLowerCase()}` : brn}</code>${(r.refs || []).map((x) => `<em class="ref">${x}</em>`).join('')}</p>
      <div class="pk__vis">${vis}</div>
      <p class="pk__t">${r.kind === 'c' ? st.t : r.title || `${r.co}, ${r.role.toLowerCase()}`}</p>
      <p class="pk__d">${r.kind === 'm' && SUM[r.set] ? SUM[r.set] : r.txt || st.p.replace(/<a [^>]*>.*?<\/a>/g, '').trim()}</p>${extra}
      <p class="pk__tags">${r.tags.map((t) => `<span class="chip">${t}</span>`).join('')}</p>
      <button type="button" class="pk__open" data-open="${r.set}" data-s="${r.s}">Abrir a história ${icon('right', { size: 16 })}</button>`;
  }
  function showPeek(r) { const el = $('.peek__in'); el.innerHTML = peekHtml(r); el.dataset.row = r.i; el.closest('.peek').classList.add('live'); mark1(r); }
  function mark1(r) { list.querySelectorAll('.r.cur').forEach((x) => x.classList.remove('cur')); nodes.querySelectorAll('.node.cur').forEach((x) => x.classList.remove('cur')); list.querySelector(`[data-row="${r.i}"]`)?.parentElement.classList.add('cur'); nodes.querySelector(`[data-row="${r.i}"]`)?.classList.add('cur'); hi(r.br); }
  const sheet = $('.sheet');
  function openSheet(r) { $('.sheet__c').innerHTML = peekHtml(r); $('.sheet__c').dataset.row = r.i; sheet.hidden = false; requestAnimationFrame(() => sheet.classList.add('on')); mark1(r); }
  function closeSheet() { sheet.classList.remove('on'); setTimeout(() => (sheet.hidden = true), reduce ? 0 : 220); hi(null); }
  $('[data-sheet-close]').addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); if (e.target.closest('[data-open]')) closeSheet(); });
  let sg = null; const sin = $('.sheet__in');
  sin.addEventListener('pointerdown', (e) => { if (e.target.closest('button, a')) return; sg = e.clientY; });
  addEventListener('pointermove', (e) => { if (sg === null) return; const dy = Math.max(0, e.clientY - sg); sin.style.transform = `translateY(${dy}px)`; });
  addEventListener('pointerup', (e) => { if (sg === null) return; const dy = e.clientY - sg; sg = null; sin.style.transform = ''; if (dy > 80) closeSheet(); });
  const rowOf = (el) => ROWS[+el.dataset.row];
  list.addEventListener('click', (e) => { const b = e.target.closest('button[data-row]'); if (!b || b.disabled) return; const r = rowOf(b); if (wide()) openSet(r.set, r.s); else openSheet(r); });
  list.addEventListener('pointerover', (e) => { if (!wide()) return; const b = e.target.closest('button[data-row]'); if (b && !b.disabled) { hoverRow = rowOf(b); showPeek(hoverRow); } });
  list.addEventListener('pointerleave', () => { hoverRow = null; });
  list.addEventListener('focusin', (e) => { const b = e.target.closest('button[data-row]'); if (b && wide()) showPeek(rowOf(b)); });
  function hi(br) { svg.classList.toggle('hl', !!br); svg.querySelectorAll('[data-br]').forEach((el) => el.classList.toggle('on', el.dataset.br === br || (br === 'pelos' && el.dataset.br === 'formacao' && false))); }

  /* ---------- filtro por tag ---------- */
  let tag = 'Tudo';
  const hiddenRow = (r) => tag !== 'Tudo' && !r.tags.includes(tag);
  function setTag(t) {
    tag = FILTERS.find((f) => norm(f) === norm(t)) || 'Tudo';
    document.querySelectorAll('[data-f]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.f === tag));
    G.forEach((r) => { const off = hiddenRow(r), b = list.querySelector(`[data-row="${r.i}"]`); b.disabled = off; b.parentElement.classList.toggle('off', off); nodes.querySelector(`[data-row="${r.i}"]`)?.classList.toggle('off', off); });
    const tagsOf = (b) => (b === 'main' ? ['Carreira'] : b === 'formacao' ? ['Formação'] : TAGS[b]);
    edges.querySelectorAll('path').forEach((p) => p.classList.toggle('off', tag !== 'Tudo' && !tagsOf(p.dataset.br).includes(tag)));
    return G.filter((r) => !hiddenRow(r)).length;
  }
  document.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => setTag(b.dataset.f)));

  /* ---------- linha do tempo (scrub) em escala real ---------- */
  const dated = G.filter((r) => r.y).sort((a, b) => a.y - b.y);
  const tr = $('.scrub__t'), th = $('.scrub__th'), yl = $('.scrub__y');
  tr.insertAdjacentHTML('afterbegin', Array.from({ length: 12 }, (_, i) => `<b style="left:${(i / 11) * 100}%" class="${(2015 + i) % 5 === 0 || i === 11 ? 'big' : ''}"><span>${i === 11 ? 'hoje' : 2015 + i}</span></b>`).join('') + dated.map((r) => `<s style="left:${((r.y - 2015) / 11) * 100}%" class="${r.kind === 'edu' || r.edu ? 'edu' : ''}"></s>`).join(''));
  function yearAt(r) {
    if (r.y) return r.y; const idx = G.indexOf(r); const up = G.slice(0, idx).reverse().find((x) => x.y), dn = G.slice(idx).find((x) => x.y);
    return up && dn ? (up.y + dn.y) / 2 : (up || dn)?.y || 2026;
  }
  function updScrub() { if (!spy) return; const y = Math.min(2026, yearAt(spy) + (spy.head ? 1 : 0)); th.style.left = `${((y - 2015) / 11) * 100}%`; yl.textContent = y >= 2025.9 ? 'hoje' : Math.floor(y); tr.setAttribute('aria-valuenow', Math.floor(y)); }
  function jumpYear(y) {
    let best = G[0], bd = 1e9; G.forEach((r) => { const d = Math.abs(yearAt(r) - y); if (d < bd) { bd = d; best = r; } });
    scrollTo({ top: gTop + ys[best.i] - innerHeight * 0.45, behavior: 'instant' });
  }
  let sd = false; const yFromX = (cx) => { const b = tr.getBoundingClientRect(); return 2015 + Math.max(0, Math.min(1, (cx - b.left) / b.width)) * 11; };
  tr.addEventListener('pointerdown', (e) => { sd = true; tr.setPointerCapture(e.pointerId); jumpYear(yFromX(e.clientX)); });
  tr.addEventListener('pointermove', (e) => { if (sd) jumpYear(yFromX(e.clientX)); });
  tr.addEventListener('pointerup', () => { sd = false; });
  tr.addEventListener('keydown', (e) => { const cur = +tr.getAttribute('aria-valuenow'); if (e.key === 'ArrowLeft') jumpYear(cur - 1); if (e.key === 'ArrowRight') jumpYear(cur + 1); });

  /* ---------- terminal ---------- */
  const out = $('.term__out'), inp = $('#cmd'); const hist = []; let hp = 0;
  const say = (cmd, lines) => { out.insertAdjacentHTML('beforeend', `<p><span class="p">$</span> ${cmd.replace(/</g, '&lt;')}</p>${lines.map((l) => `<p class="o">${l}</p>`).join('')}`); while (out.children.length > 8) out.firstElementChild.remove(); out.scrollTop = out.scrollHeight; };
  const branches = ['main', ...Object.values(BR)];
  const findRow = (arg) => { const a = norm(arg || ''); const b = BYBR[a] || Object.keys(BR).find((k) => k === a); if (b) return G.find((r) => r.merge === b) || G.find((r) => r.br === b); return G.find((r) => r.h.startsWith(a) && a.length >= 4); };
  const goTo = (r) => scrollTo({ top: gTop + ys[r.i] - innerHeight * 0.4, behavior: reduce ? 'instant' : 'smooth' });
  function run(raw) {
    const cmd = raw.trim().replace(/\s+/g, ' '); if (!cmd) return; hist.push(cmd); hp = hist.length;
    const [g, sub, ...rest] = cmd.split(' '); const arg = rest.join(' ');
    if (cmd === 'help') return say(cmd, ['<b>git log</b> mostra tudo · <b>git log --tag=time</b> filtra', '<b>git show shorts-hls</b> abre a prévia · <b>git checkout pelos-caminhos</b> abre a história', '<b>git branch</b> lista as branches · <b>whoami</b> · <b>clear</b>']);
    if (cmd === 'clear') { out.innerHTML = ''; return; }
    if (cmd === 'whoami') return say(cmd, ['Lucas Gehlen, Tech Lead do PilarHomes. Caxias do Sul.']);
    if (g !== 'git') return say(cmd, [`comando não encontrado: ${g.replace(/</g, '&lt;')}. Tente <b>help</b>.`]);
    if (sub === 'log') {
      const m = cmd.match(/--tag[= ]([\wçãéáíóõ-]+)/i);
      if (!m) { const n = setTag('Tudo'); goTo(G[0]); return say(cmd, [`${n} commits. Sem filtro.`]); }
      const t = FILTERS.find((f) => norm(f) === norm(m[1])); if (!t) return say(cmd, [`tag desconhecida. Use: ${FILTERS.slice(1).map((f) => norm(f)).join(', ')}.`]);
      const n = setTag(t); goTo(G.find((r) => !hiddenRow(r))); return say(cmd, [`${n} commits com a tag ${t}.`]);
    }
    if (sub === 'branch') return say(cmd, [branches.map((b) => (b === 'main' ? `<b>* ${b}</b>` : b)).join(' · ')]);
    if (sub === 'show') { const r = findRow(arg); if (!r) return say(cmd, [`não achei "${arg.replace(/</g, '&lt;')}". Tente <b>git branch</b>.`]); setTag('Tudo'); goTo(r); if (wide()) { hoverRow = r; showPeek(r); setTimeout(() => (hoverRow = null), 1600); } else openSheet(r); return say(cmd, [`commit ${r.h} · ${r.title || r.msg || r.co}`]); }
    if (sub === 'checkout' || sub === 'switch') { const r = findRow(arg); if (!r) return say(cmd, [`branch "${arg.replace(/</g, '&lt;')}" não existe. Tente <b>git branch</b>.`]); say(cmd, [`Switched to branch '${BR[r.br] || r.br}'`]); openSet(r.set, r.s); return; }
    if (sub === 'blame') return say(cmd, ['Lucas Gehlen, linha por linha, desde 2015.']);
    say(cmd, ['esse comando não roda aqui. Tente <b>help</b>.']);
  }
  $('.term__in').addEventListener('submit', (e) => { e.preventDefault(); run(inp.value); inp.value = ''; });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { hp = Math.max(0, hp - 1); inp.value = hist[hp] || ''; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hp = Math.min(hist.length, hp + 1); inp.value = hist[hp] || ''; e.preventDefault(); }
    if (e.key === 'Tab') { const v = inp.value, w = v.split(' ').pop(); const m = [...branches, 'arquitetura', 'produto', 'formacao', 'carreira'].find((b) => w && b.startsWith(w)); if (m) { inp.value = v.slice(0, v.length - w.length) + m; e.preventDefault(); } }
  });
  document.querySelectorAll('[data-cmd]').forEach((b) => b.addEventListener('click', () => { const c = b.dataset.cmd; if (reduce) return run(c); let i = 0; inp.value = ''; const t = setInterval(() => { inp.value = c.slice(0, ++i); if (i >= c.length) { clearInterval(t); setTimeout(() => { run(c); inp.value = ''; }, 140); } }, 22); }));

  /* ---------- rodapé ---------- */
  const msg = $('#msg');
  msg.addEventListener('input', () => { const v = msg.value || 'oi, Lucas'; $('.foot__msg').textContent = v; $('.foot__send').href = `mailto:${EMAIL}?subject=${encodeURIComponent(v)}`; });

  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden && $('#st').hidden) closeSheet(); });
  let lastW = innerWidth; addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; layout(); } });
  const align = () => { const ANC = { c: 'code', m: '.m__git', tag: '.t__ref', era: '.e__p', edu: '.m__git' }; let worst = 0, at = null; G.forEach((r) => { const n = nodes.querySelector(`[data-row="${r.i}"] .n-dot`).getBoundingClientRect(), a = list.querySelector(`[data-row="${r.i}"] ${ANC[r.kind]}`).getBoundingClientRect(); const d = Math.abs((n.top + n.height / 2) - (a.top + a.height / 2)); if (d > worst) { worst = d; at = r.i; } }); return { worst: Math.round(worst * 10) / 10, at }; };
  window.__home = { run, layout, setTag, align, rowY: (i) => gTop + ys[i], rows: ROWS };
  return { start() { layout(); document.body.classList.add('ready'); if (wide()) showPeek(G[0]); } };
}
