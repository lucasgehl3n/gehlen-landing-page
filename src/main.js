import './style.css';
import { C, mark, icon } from './brand.js';
import * as A from './art.js';
import { initHome } from './home.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const VEJA = 'https://veja.abril.com.br/economia/uma-em-cada-cinco-vendas-da-pilar-ja-vem-de-marketplace-imobiliario/';
const FOLHA = 'https://www1.folha.uol.com.br/colunas/painelsa/2026/05/proptech-lanca-projeto-de-tiktok-imobiliario-com-corretores-como-produtores-de-conteudo.shtml';
const EMAIL = '[preencher e-mail]';
const src = (u, n) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`;

/* ---------- Conjuntos de stories ---------- */
const NOTE = { k: 'Notas técnicas', t: 'Os detalhes ficam no blog', p: 'O texto técnico serve para qualquer time e não cita empresa nem produto.' };
const SETS = [
  { id: 'shorts', titulo: 'Shorts no PilarHomes', tipo: 'Projeto', icon: 'play2', tags: ['Produto', 'Arquitetura'], stories: [
    { k: 'Desafio', t: 'Vídeo curto num portal de imóveis', p: 'Levei o Shorts da ideia à entrega. Comecei com estudo de mercado e benchmarks. O vídeo precisava começar rápido em qualquer rede, inclusive na fraca. Troque a rede e veja os segmentos chegando.', art: A.hlsTimeline },
    { k: 'O que eu fiz', t: 'A infraestrutura de vídeo em HLS', p: 'Desenhei a entrega dos vídeos em HLS e escrevi a proposta de reprocessar o catálogo, que foi aprovada. O vídeo começa na qualidade mais leve e sobe quando a conexão deixa. Arraste para trocar o degrau.', art: A.quality },
    { k: 'O que mudou', t: 'Mais tempo no portal', p: `Segundo a VEJA, os vídeos curtos já entram na jornada de 40% dos potenciais clientes do portal. Nos testes que a Pilar divulgou, quem viu Shorts converteu mais. ${src(VEJA, 'VEJA, out/2026')}`, art: () => A.results(src(FOLHA, 'Folha, mai/2026')) },
    { ...NOTE, art: () => A.post('Reduzir o tempo até o primeiro quadro em vídeo curto (HLS) sem multiplicar o custo de encoding', 'hls') },
  ] },
  { id: 'cidade', titulo: 'Segunda cidade', tipo: 'Projeto', icon: 'city', tags: ['Produto'], stories: [
    { k: 'Desafio', t: 'O mesmo portal em outra cidade', p: 'O PilarHomes nasceu atendendo uma cidade e precisava chegar a uma segunda.', art: A.cities },
    { k: 'O que eu fiz', t: 'Liderei a expansão', p: 'Liderei a expansão pela engenharia. No meu papel, isso quer dizer avaliar a viabilidade e desenhar a arquitetura antes de o trabalho chegar ao time.', art: () => A.career('pilar') },
    { k: 'Resultado', t: 'São Paulo e Curitiba', p: `Hoje o portal atende as duas cidades. Segundo a VEJA, tem mais de 30 mil imóveis e chegou a 1,7 milhão de usuários em 2026. ${src(VEJA, 'VEJA, out/2026')}`, art: A.cities },
  ] },
  { id: 'mapa', titulo: 'Mapa da busca avançada', tipo: 'Projeto', icon: 'hex', tags: ['Arquitetura', 'Produto'], stories: [
    { k: 'Desafio', t: 'Milhares de imóveis num mapa', p: 'Fiquei na linha de frente da busca avançada, a feature mais complexa do ano no portal. Uma parte era mostrar muitos imóveis no mapa sem virar um amontoado de pinos.', art: A.pins },
    { k: 'O que eu fiz', t: 'Agrupar por hexágonos', p: 'Agrupei os imóveis em células H3, o índice hexagonal aberto da Uber, calculado no backend. Arraste o zoom.', art: A.hexmap },
    { k: 'O que muda', t: 'O mapa mostra onde há imóvel', p: 'Em vez de pinos sobrepostos, o mapa mostra quantos imóveis há em cada região, em qualquer zoom.', art: () => A.post('Agrupar milhares de pontos num mapa com células H3', 'h3') },
  ] },
  { id: 'alertas', titulo: 'Radar de imóveis novos', tipo: 'Projeto', icon: 'bell', tags: ['Arquitetura'], stories: [
    { k: 'Desafio', t: 'Refazer a busca para ver novidade', p: 'Quem procurava imóvel no portal precisava voltar e repetir a busca. Na rede, os corretores pediam alertas parecidos.', art: A.searchLoop },
    { k: 'O que eu fiz', t: 'Uma base de alertas para dois produtos', p: 'Propus um domínio único de buscas salvas e avisos, usado pelo portal e pela rede. Fui o único autor da RFC, e ela foi aprovada.', art: A.sharedBase },
    { k: 'O que muda', t: 'Salvar uma vez e acompanhar', p: 'A pessoa salva a busca e recebe aviso quando entra um imóvel compatível. Os dois produtos usam a mesma base. Monte uma busca e salve.', art: A.builder },
    { ...NOTE, art: () => A.post('Um serviço de buscas salvas e alertas compartilhado entre dois produtos', 'alert') },
  ] },
  { id: 'time', titulo: 'Time e engenharia', tipo: 'Liderança', icon: 'team', tags: ['Time'], stories: [
    { k: 'Desafio', t: 'Conhecimento na cabeça de poucos', p: 'O processo vivia na cabeça de quem já estava no time. Onboarding e revisão de código dependiam de improviso.', art: A.scattered },
    { k: 'O que eu faço', t: '1:1, tech talks e decisões por escrito', p: 'Faço 1:1 com cada pessoa e organizo tech talks sobre qualidade, arquitetura e IA no desenvolvimento. Decisão de porte vira documento revisado pelo time. Já escrevi propostas que o time decidiu não seguir, e fiquei com a decisão do grupo.', art: A.rituals },
    { k: 'O que eu fiz', t: 'Guia de MR e runbooks', p: 'Formalizei o fluxo de desenvolvimento num guia com checklist de merge request e mantenho os runbooks de infra e de produto. Marque os itens.', art: A.checklist },
    { k: 'O que eu fiz', t: 'Feature flags saíram do papel', p: 'O assunto nunca saía da lista. Pesquisei, testei e implementei. Hoje as entregas do time saem em fases, atrás de flags. Escolha a fase.', art: A.flags },
    { k: 'O que muda', t: 'Onboarding mais curto', p: 'Quem chega encontra o caminho escrito. O guia do clone ao merge também funciona como skill para assistente de código, então pessoa e LLM seguem o mesmo padrão.', art: A.humanLlm },
    { ...NOTE, art: () => A.post('Do clone ao merge: um guia de contribuição que serve para humano e para LLM', 'doc') },
  ] },
  { id: 'pelos', titulo: 'Pelos Caminhos', tipo: 'TCC', icon: 'paw', tags: ['Produto', 'Formação'], stories: [
    { k: 'Desafio', t: 'Adoção com três lados', p: 'Meu TCC em Ciência da Computação na UCS foi uma plataforma de adoção de animais para quem quer adotar, para as ONGs e para os voluntários.', art: A.roles },
    { k: 'O que eu fiz', t: 'App, API e permissões por perfil', p: 'Fiz o app em Vue 3 e Nuxt, com Capacitor para rodar no celular, e a API em Node com PostgreSQL. Cada perfil tem permissões próprias e cada animal ganha um QR code. Toque nos blocos.', art: A.arch },
    { k: 'O que eu fiz', t: 'A raça pela foto', p: 'Um serviço em Flask, rodando num container Docker, reconhece a raça do animal a partir da foto.', art: A.scan },
    { k: 'Resultado', t: 'O trabalho de conclusão do curso', p: 'Foi o projeto que fechou meu bacharelado em Ciência da Computação na UCS, em 2023.', art: A.qr },
  ] },
  { id: 'trajetoria', titulo: 'Trajetória', tipo: 'Trajetória', icon: 'case', tags: ['Formação', 'Carreira'], stories: [
    { id: 'ifrs', icon: 'cap', k: '2015 a 2018', t: 'Técnico em Informática no IFRS', p: 'Fiz o curso técnico em Informática no IFRS, campus Farroupilha.', art: () => A.career('ifrs') },
    { id: 'vero', icon: 'code', k: 'abr/2019 a fev/2020', t: 'Estágio na Vero Dellaudo', p: 'Primeiro estágio, numa clínica de diagnóstico por imagem em Caxias do Sul. Fiz sistemas web de gestão interna com PHP, Python e MySQL.', art: () => A.career('vero') },
    { id: 'ucs', icon: 'cap', k: '2019 a 2023', t: 'Ciência da Computação na UCS', p: 'Bacharelado na Universidade de Caxias do Sul, em paralelo com o trabalho. O TCC foi o Pelos Caminhos.', art: () => A.career('ucs'), link: ['pelos', 'Abrir o Pelos Caminhos'] },
    { id: 'conecta', icon: 'code', k: 'mar/2020 a jul/2022', t: 'Full stack na Conecta Softwares', p: 'Em Caxias do Sul, trabalhei no core de um ERP em .NET, nos módulos fiscais: NF-e, NFC-e, entradas e pedidos. No front, Vue.', art: () => A.career('conecta') },
    { id: 'compass', icon: 'code', k: 'ago/2022 a nov/2024', t: 'Front-end na Compass.uol', p: 'Alocado na Vivo, no portal B2B de empresas, feito em micro frontends com Vue e TypeScript. Implantei testes de mutação com Stryker e atuei em SRE com Kibana.', art: () => A.career('compass') },
    { id: 'pilar', icon: 'tower', k: 'nov/2024 até hoje', t: 'Pilar: de sênior a Tech Lead', p: `Entrei como engenheiro sênior no lançamento do PilarHomes e virei o ponto focal com produto e design. Desde setembro de 2025 lidero o time. Segundo a VEJA, o portal já responde por uma em cada cinco vendas da Pilar. ${src(VEJA, 'VEJA, out/2026')}`, art: () => A.career('pilar') },
  ] },
];
const setOf = (id) => SETS.find((s) => s.id === id);

/* ---------- Home ---------- */
document.head.insertAdjacentHTML('beforeend', `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(mark({ size: 48 }).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'))}">`);
const home = initHome({ SETS, setOf, openSet: (id, s) => openSet(id, s), EMAIL, VEJA });
const fps = []; let lastT = performance.now();
const fl = (t) => { fps.push(t - lastT); lastT = t; if (fps.length > 240) fps.shift(); requestAnimationFrame(fl); };
window.__fps = () => Math.round(1000 / (fps.reduce((a, b) => a + b, 0) / fps.length));

/* ---------- Stories ---------- */
const st = $('#st'); let si = 0, cur = null, prog = 0, paused = false, touched = false, lastFocus = null, stT = performance.now();
const DUR = 10000;
const api = { touch: () => { touched = true; } };
document.addEventListener('click', (e) => { const o = e.target.closest('[data-open]'); if (o && !o.closest('.st__card')) { lastFocus = o; openSet(o.dataset.open, +(o.dataset.s || 0)); } });
function openSet(id, s = 0) { cur = setOf(id); si = s; prog = 0; touched = false; paused = false; st.hidden = false; document.documentElement.style.overflow = 'hidden'; render(); st.querySelector('[data-close]').focus({ preventScroll: true }); history.replaceState({}, '', `#${id}`); }
function closeSet() { st.hidden = true; st.innerHTML = ''; document.documentElement.style.overflow = ''; history.replaceState({}, '', location.pathname); if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); }
function render() {
  const s = cur.stories[si]; const art = s.art ? s.art() : null;
  st.innerHTML = `
  <button class="side l" type="button" data-nav="pc" aria-label="Conjunto anterior">${icon('left')}</button>
  <div class="st__card" id="card">
    <div class="st__bars" aria-hidden="true">${cur.stories.map((_, i) => `<i><b style="transform:scaleX(${i < si ? 1 : 0})"></b></i>`).join('')}</div>
    <div class="st__head">${mark({ size: 26, ink: C.neblina, ping: C.sinal })}<span class="state"><b>${cur.titulo}</b><span>${cur.tipo}</span></span><span class="ctrl">
      <button type="button" data-pause aria-label="${paused ? 'Continuar' : 'Pausar'}">${icon(paused ? 'play' : 'pause', { size: 20 })}</button>
      <button type="button" data-close aria-label="Fechar e voltar ao log">${icon('close', { size: 20 })}</button></span></div>
    <button class="zone prev" type="button" data-nav="ps" aria-label="Story anterior"></button>
    <button class="zone next" type="button" data-nav="ns" aria-label="Próximo story"></button>
    <div class="st__body" aria-live="polite">
      <p class="st__k">${s.k}<span>${si + 1} de ${cur.stories.length}</span></p>
      <h2 class="st__t">${s.t}</h2>
      <p class="st__p">${s.p}</p>
      ${art ? art.html : ''}
      ${s.link ? `<button type="button" class="st__link" data-jump="${s.link[0]}">${s.link[1]}</button>` : ''}
    </div>
  </div>
  <button class="side r" type="button" data-nav="nc" aria-label="Próximo conjunto">${icon('right')}</button>`;
  st.classList.toggle('paused', paused);
  if (art && art.init) art.init(st.querySelector('.st__body'), api);
}
function bar() { const b = st.querySelectorAll('.st__bars b')[si]; if (b) b.style.transform = `scaleX(${prog})`; }
function go(d) { if (d > 0) { if (si < cur.stories.length - 1) si++; else return nextSet(1); } else { if (si > 0) si--; else return; } prog = 0; touched = false; render(); }
function nextSet(d) {
  const i = SETS.indexOf(cur) + d; if (i < 0 || i >= SETS.length) { if (d > 0) closeSet(); return; }
  const card = $('#card'); if (card && !reduce) { card.style.transform = `translateX(${-d * 40}px)`; card.style.opacity = '0'; }
  setTimeout(() => { cur = SETS[i]; si = 0; prog = 0; touched = false; render(); history.replaceState({}, '', `#${cur.id}`); }, reduce ? 0 : 160);
}
function tick(t) { const dt = Math.min(64, t - stT); stT = t; if (!st.hidden && !paused && !touched && !reduce) { prog += dt / DUR; if (prog >= 1) { prog = 0; go(1); } else bar(); } requestAnimationFrame(tick); }
st.addEventListener('click', (e) => {
  const n = e.target.closest('[data-nav]'); if (n) { ({ ps: () => go(-1), ns: () => go(1), pc: () => nextSet(-1), nc: () => nextSet(1) })[n.dataset.nav](); return; }
  const j = e.target.closest('[data-jump]'); if (j) { cur = setOf(j.dataset.jump); si = 0; prog = 0; touched = false; render(); return; }
  if (e.target.closest('[data-close]')) return closeSet();
  if (e.target.closest('[data-pause]')) { paused = !paused; render(); bar(); st.querySelector('[data-pause]').focus(); }
  if (e.target === st) closeSet();
});
let g = null, suppress = false;
st.addEventListener('pointerdown', (e) => {
  if (e.target.closest('input, label, a, .st__head button, .side, [data-ui] button')) return;
  g = { x: e.clientX, y: e.clientY, held: false }; g.timer = setTimeout(() => { if (g) { g.held = true; paused = true; st.classList.add('paused'); } }, 220);
});
st.addEventListener('pointermove', (e) => { if (!g) return; const dx = e.clientX - g.x, dy = e.clientY - g.y; if (Math.hypot(dx, dy) > 10) clearTimeout(g.timer); const card = $('#card'); if (card && !reduce) card.style.transform = Math.abs(dy) > Math.abs(dx) && dy > 0 ? `translateY(${dy * 0.6}px)` : `translateX(${dx * 0.4}px)`; });
const endG = (e) => {
  if (!g) return; clearTimeout(g.timer); const dx = e.clientX - g.x, dy = e.clientY - g.y, card = $('#card'), held = g.held; g = null;
  if (held) { paused = false; st.classList.remove('paused'); if (card) card.style.transform = ''; suppress = true; return; }
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { suppress = true; return nextSet(dx < 0 ? 1 : -1); }
  if (dy > 90 && dy > Math.abs(dx)) { suppress = true; return closeSet(); }
  if (card) card.style.transform = '';
};
st.addEventListener('pointerup', endG); st.addEventListener('pointercancel', endG);
st.addEventListener('click', (e) => { if (suppress) { e.stopImmediatePropagation(); suppress = false; } }, true);
addEventListener('keydown', (e) => {
  if (st.hidden) return; const inField = e.target.matches('input');
  if (e.key === 'Escape') closeSet();
  else if (e.key === 'ArrowRight' && !inField) go(1);
  else if (e.key === 'ArrowLeft' && !inField) go(-1);
  else if (e.key === 'PageDown' || e.key === ']') nextSet(1);
  else if (e.key === 'PageUp' || e.key === '[') nextSet(-1);
  else if (e.key === ' ' && !e.target.matches('button, input')) { e.preventDefault(); paused = !paused; render(); }
});

document.fonts.ready.then(() => { home.start(); requestAnimationFrame(fl); requestAnimationFrame(tick); const id = location.hash.slice(1); if (setOf(id)) openSet(id, 0); });
