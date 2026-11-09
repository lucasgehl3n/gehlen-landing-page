// Home: linha do tempo da carreira. A linha principal é a carreira, a da formação é IFRS/UCS, e cada projeto sai da linha e volta quando foi entregue.
import { mark, icon } from './brand.js';
import * as Z from './teasers.js';
import * as V from './visuals.js';
import { topbar, agendar, depoimentos } from './shell.js';
import { AGENDAR, LINKEDIN, MOSTRAR_DEPOIMENTOS, DEPOIMENTOS } from './config.js';
import { cafeHtml, initCafe } from './cafe.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function initHome({ SETS, setOf, openSet, EMAIL, VEJA }) {
  const BR = { time: 'time-e-engenharia', alertas: 'radar-imoveis', shorts: 'shorts-hls', mapa: 'mapa-h3', cidade: 'segunda-cidade', pelos: 'pelos-caminhos', formacao: 'formacao' };
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
  // cada case no cartão: contexto, gargalo e impacto
  const CGI = {
    time: ['Passei a liderar o time do PilarHomes em setembro de 2025.', 'O processo vivia na cabeça de quem já estava no time. Onboarding e revisão de código dependiam de improviso.', 'Escrevi o guia do clone ao merge, mantenho os runbooks e coloquei feature flags em uso. Quem chega encontra o caminho escrito, e as entregas saem em fases.'],
    alertas: ['Quem procurava imóvel no portal tinha de repetir a busca para ver novidade. Na rede, os corretores pediam alertas parecidos.', 'Cada produto ia acabar com o seu próprio sistema de alertas.', 'Escrevi sozinho a RFC de uma base única de buscas salvas e avisos, e ela foi aprovada. Portal e rede usam a mesma base.'],
    shorts: ['Propus o Shorts no PilarHomes e levei a feature do estudo de mercado à entrega.', 'Com o uso crescendo, o vídeo demorava a começar, sobretudo em rede fraca.', 'Desenhei a entrega em HLS e escrevi a proposta de reprocessar o catálogo, que foi aprovada. Segundo a VEJA, os vídeos curtos já entram na jornada de 40% dos potenciais clientes do portal.'],
    mapa: ['Fiquei na linha de frente da busca avançada, a feature mais complexa do ano no portal.', 'Com milhares de imóveis, o mapa virava um amontoado de pinos.', 'Comparei formas de agregação espacial e agrupei os imóveis em células H3 no backend. O mapa mostra quantos imóveis há em cada região, em qualquer zoom.'],
    cidade: ['O PilarHomes nasceu atendendo uma cidade e precisava chegar a uma segunda.', 'A expansão precisava de viabilidade avaliada e arquitetura desenhada antes de chegar ao time.', 'Liderei essa parte pela engenharia. Hoje o portal atende São Paulo e Curitiba.'],
    pelos: ['Meu TCC em Ciência da Computação na UCS: uma plataforma de adoção de animais.', 'Três públicos com permissões diferentes: quem adota, as ONGs e os voluntários.', 'Entreguei app, API e reconhecimento de raça pela foto. O projeto fechou meu bacharelado em 2023.'],
  };
  const cgi = (id) => `<span class="cgi">${['contexto', 'gargalo', 'impacto'].map((k, i) => `<span class="cgi__r cgi__r--${k}"><span class="cgi__k">${k}</span><span class="cgi__v">${CGI[id][i]}</span></span>`).join('')}</span>`;
  const commits = (id, idx, lane = 1) => idx.map((i) => ({ kind: 'c', lane, set: id, s: i, br: id, tags: TAGS[id] }));
  const merge = (id, extra = {}) => ({ kind: 'm', lane: 0, set: id, s: 0, br: id, merge: id, title: setOf(id).titulo, tags: TAGS[id], ...extra });
  const ROWS = [
    { kind: 'year', label: '2025 até hoje', sub: 'Tech Lead' },
    merge('time', { head: 1 }), ...commits('time', [4, 3, 1, 0]),
    merge('alertas'), ...commits('alertas', [2, 1, 0]),
    merge('shorts'), ...commits('shorts', [2]),
    { kind: 'tag', lane: 0, set: 'trajetoria', s: 5, br: 'main', title: 'Passei a liderar o time do PilarHomes', refs: ['tag: tech-lead'], date: 'set/2025', y: 2025.67, span: [2025.67, 2026.9], tags: ['Carreira'] },
    { kind: 'blk', id: 'remote' },
    { kind: 'year', label: '2024 a 2025', sub: 'engenheiro sênior' },
    ...commits('shorts', [1, 0]),
    merge('mapa'), ...commits('mapa', [2, 1, 0]),
    merge('cidade'), ...commits('cidade', [2, 1, 0]),
    { kind: 'era', lane: 0, set: 'trajetoria', s: 5, br: 'main', co: 'Pilar', role: 'Engenheiro de software sênior', date: 'nov/2024', span: [2024.83, 2025.67], y: 2024.83, period: 'nov/2024 a set/2025', txt: 'Entrei no lançamento do PilarHomes e trabalhei do front ao back. Participei das decisões de produto e de negócio com o time, além da arquitetura.', stack: ['Nuxt', 'Node', 'Python', 'AWS'], tags: ['Carreira'] },
    { kind: 'blk', id: 'shortlog' },
    { kind: 'year', label: '2019 a 2024', sub: 'trabalho e faculdade em paralelo' },
    { kind: 'm', lane: 0, set: 'trajetoria', s: 2, br: 'formacao', merge: 'formacao', title: 'Bacharel em Ciência da Computação', date: '2023', y: 2023.9, span: [2019, 2023.95], txt: 'Bacharelado na UCS, em Caxias do Sul, em paralelo com o trabalho.', tags: ['Formação'], edu: 1 },
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
  ROWS.forEach((r, i) => { r.i = i; });
  const G = ROWS.filter((r) => !NOG(r));
  const FILTERS = ['Tudo', 'Produto', 'Arquitetura', 'Time', 'Formação', 'Carreira'];

  /* ---------- markup ---------- */
  const refs = (r) => (r.refs || []).map((x) => `<em class="ref${x.startsWith('HEAD') ? ' ref--head' : ''}">${x}</em>`).join('');
  const tagchips = (r) => r.tags.map((t) => `<span class="chip">${t}</span>`).join('');
  const rowHtml = (r) => {
    const a = `data-row="${r.i}" data-br="${r.br}" data-tags="${(r.tags || []).join('|')}"`;
    if (r.kind === 'blk') return BLK[r.id]();
    if (r.kind === 'year') return `<li class="yr" aria-hidden="true"><span class="yr__l">${r.label}</span><span class="yr__s">${r.sub}</span></li>`;
    if (r.kind === 'c') { const st = setOf(r.set).stories[r.s]; return `<li class="r r--c in-${r.lane}"><button type="button" ${a}><span class="c__k">${st.k}</span><span class="c__t">${st.t}</span></button></li>`; }
    if (r.kind === 'm' && !r.edu) return `<li class="r r--m r--${r.set}"><button type="button" ${a}>
      <span class="m__git">Merge branch '${BR[r.merge]}' ${refs(r)}</span>
      <span class="m__body"><span class="m__vis">${TEASE[r.set]()}</span><span class="m__txt"><span class="m__t">${r.title}</span>${cgi(r.set)}<span class="m__tags">${tagchips(r)}<span class="m__go">Ver a história ${icon('right', { size: 16 })}</span></span></span></span></button></li>`;
    if (r.kind === 'm' && r.set === 'pelos') return `<li class="r r--m r--edu r--pelos"><button type="button" ${a}>
      <span class="m__git">Merge branch 'pelos-caminhos' into formacao</span>
      <span class="m__body"><span class="m__vis">${Z.scan()}</span><span class="m__txt"><span class="m__t">Pelos Caminhos</span>${cgi('pelos')}<span class="m__tags">${tagchips(r)}<span class="m__go">Ver a história ${icon('right', { size: 16 })}</span></span></span></span></button></li>`;
    if (r.kind === 'm') return `<li class="r r--grad"><button type="button" ${a}><span class="m__git">Merge branch 'formacao' · ${r.date}</span><span class="g__t">${icon('cap', { size: 22 })}${r.title}</span><span class="g__d">UCS, Caxias do Sul. Quatro anos de faculdade em paralelo com o trabalho.</span><span class="g__vis">${V.parallel()}</span></button></li>`;
    if (r.kind === 'tag') return `<li class="r r--tag"><button type="button" ${a}><span class="t__ref">${refs(r)}<time>${r.date}</time></span><span class="t__t">${r.title}</span><span class="t__d">Lidero o time de engenharia do PilarHomes, nas duas cidades.</span></button></li>`;
    if (r.kind === 'era') return `<li class="r r--era${r.vis ? ' r--era-v' : ''}"><button type="button" ${a}><span class="e__p">${r.period}${refs(r)}</span><span class="e__co">${r.co}</span><span class="e__role">${r.role}</span><span class="e__txt">${r.txt}</span><span class="e__tr">${Z.track(r.span[0], r.span[1], 'tz-ink-f')}</span><span class="e__st">${r.stack.map((s) => `<span>${s}</span>`).join('')}</span>${r.vis ? `<span class="e__vis">${V[r.vis]()}</span>` : ''}</button></li>`;
    return `<li class="r r--eduk"><button type="button" ${a}><span class="m__k">Formação, ${r.date}</span><span class="g__t">${icon('cap', { size: 20 })}${r.title}</span><span class="g__d">${r.txt}</span></button></li>`;
  };
  const BLK = {
    remote: () => `<li class="blk blk--remote"><p class="blk__cmd"><span class="p">$</span> git remote -v</p><div class="blk__body"><div class="blk__vis">${V.remote()}</div><dl class="rm">
      <div><dt>Caxias do Sul</dt><dd>UCS, Vero e Conecta. Hoje trabalho daqui, remoto.</dd></div>
      <div><dt class="rm--edu">Farroupilha</dt><dd>IFRS, onde fiz o técnico em Informática.</dd></div>
      <div><dt class="rm--acc">São Paulo e Curitiba</dt><dd>As duas cidades que o PilarHomes atende.</dd></div></dl></div></li>`,
    shortlog: () => `<li class="blk blk--sl"><p class="blk__cmd"><span class="p">$</span> git shortlog -s --since=2019 <span class="blk__h">meses por cargo</span></p>${V.shortlog()}</li>`,
  };
  const HOW = [
    ['Entro na decisão antes de virar tarefa', 'Sento com produto e design enquanto a ideia ainda está no quadro. Peso o que muda para quem usa, o custo e a prioridade frente ao resto do roadmap, e a tarefa chega ao time com a arquitetura desenhada.', 'custo, impacto e prioridade'],
    ['Testo a ideia pequena, depois proponho', 'Quando o caminho não está claro, faço uma prova de conceito com a parte mais arriscada. O que ela mostra entra numa proposta escrita, com alternativas e custo. Se vejo risco, defendo o lado contrário na conversa e sigo o que o time decidir.', 'PoC, proposta escrita, decisão do time'],
    ['Organizo a entrega quando o prazo aperta', 'Quebro o trabalho em partes que cabem no prazo, divido as tarefas e fico perto de quem travou. O time pedia feature flags havia tempo; pesquisei, testei e implementei, e hoje cada parte liga primeiro para poucos.', 'flag: time interno, parte do público, todos'],
    ['Acompanho quem chega e sigo estudando', 'Fico perto de quem acabou de entrar e marco conversas de retorno para cada pessoa crescer. Mantenho runbooks e o guia de merge request, e o que estudo vira tech talk para o time.', 'runbooks, guia de MR e tech talks'],
  ];
  // Uma task no time que lidero hoje. ia: o passo é feito por um agente de IA.
  const RUN = [
    ['Alguém do time abre a task no Jira.', 0],
    ['Um agente escreve a história a partir do Figma, e o time revisa.', 1],
    ['Quem pegou a task escreve o código. Algumas tasks vão direto para um agente de IA, e alguém do time revisa.', 0],
    ['O code review abre sozinho quando o código sobe.', 1],
    ['Sobe um ambiente de teste, e a IA testa antes de ele chegar ao time.', 1],
    ['Os fluxos e2e percorrem o caminho de quem usa o produto.', 1],
    ['O ambiente fica disponível, e o time valida e decide o que entra.', 0],
  ];
  const IA = [
    ['Tasks automatizadas', 'Automatizei tasks com Jira, Slack e agentes de IA, para o time gastar menos tempo com rotina de ferramenta.'],
    ['Histórias escritas a partir do Figma', 'Coordeno a escrita autônoma das histórias a partir das tasks do Figma. O time revisa e ajusta em vez de começar da página em branco.'],
    ['Review aberto automaticamente', 'Quando o código sobe, o code review já abre. Ninguém precisa lembrar de pedir.'],
    ['Ambientes testados pela IA', 'Cada ambiente de teste sobe, passa pelos testes que a IA roda e fica disponível para o time conferir.'],
    ['Fluxos de ponta a ponta', 'Os testes e2e percorrem o caminho de quem usa o produto em cada ambiente de teste.'],
    ['A sprint roda em conjunto', 'Coordeno o trabalho de pessoas e agentes na mesma sprint: quem pega o quê, o que a IA adianta e o que precisa de alguém.'],
  ];
  const app = $('#app');
  app.innerHTML = `
${topbar('cv', './')}
<section class="hero" aria-labelledby="hero-h">
  <div class="hero__id">
    <p class="hero__head">Tech Lead e consultor de IA, em Caxias do Sul</p>
    <h1 id="hero-h" translate="no">Lucas Gehlen</h1>
    <p class="job">Lidero engenharia de produto com visão de negócio e coloco IA para trabalhar junto com o time, da task ao teste e2e.</p>
    <p class="line">Sou de tech-prod: entro nas decisões de produto e de negócio, peso custo e prioridade e desenho a arquitetura. No time que lidero, coloquei agentes de IA para escrever histórias, abrir code review e testar cada ambiente.</p>
    <div class="hero__cta">${agendar('geral')}<a class="cta cta--ghost" href="servicos/"><span class="w-l">IA no seu time</span><span class="w-s">Serviços</span>${icon('right', { size: 18 })}</a></div>
    <p class="cta__note">Agendar abre o WhatsApp. Ou <a href="mailto:${EMAIL}">${EMAIL}</a></p>
  </div>
  <figure class="run" aria-labelledby="run-h">
    <h2 class="run__h" id="run-h">Como uma task anda no meu time hoje</h2>
    <ol class="run__list">${RUN.map(([t, ia], i) => `<li class="run__i${ia ? ' run__i--ia' : ''}"><span class="run__n">${i + 1}</span><span class="run__t">${t}</span></li>`).join('')}</ol>
    <figcaption class="run__cap">Os números em destaque são os passos que um agente de IA faz. Ele cuida do repetitivo; o que entra no produto continua sendo decisão do time.</figcaption>
  </figure>
</section>
<section class="ia" id="ia" aria-labelledby="ia-h">
  <div class="ia__head"><h2 class="sec__h" id="ia-h">IA no dia a dia do time</h2><p class="sec__p">Tudo isso já roda no time que lidero. Montei cada peça para tirar trabalho repetitivo de alguém, e a decisão continua com as pessoas.</p></div>
  <ul class="ia__list">${IA.map(([t, p]) => `<li class="ia__i"><h3 class="ia__t">${t}</h3><p class="ia__p">${p}</p></li>`).join('')}</ul>
  <div class="ia__cta"><a class="cta" href="${AGENDAR.ia}" target="_blank" rel="noopener">Quero isso no meu time</a><a class="ia__more" href="servicos/">Como funciona a consultoria ${icon('right', { size: 16 })}</a></div>
</section>
<section class="how" id="como-trabalho" aria-labelledby="how-h">
  <div class="how__head"><h2 class="sec__h" id="how-h">Como eu trabalho</h2><p class="sec__p">Quatro passos que repito em todo time que lidero.</p></div>
  <ol class="how__list">${HOW.map(([t, p, a], i) => `<li class="how__i"><span class="how__n" aria-hidden="true">${i + 1}</span><h3 class="how__t">${t}</h3><p class="how__p">${p}</p><p class="how__a">${a.charAt(0).toUpperCase()}${a.slice(1)}</p></li>`).join('')}</ol>
</section>
<section class="hist" aria-labelledby="hist-h">
  <div class="hist__head"><h2 class="sec__h" id="hist-h">Histórico</h2><p class="sec__p">Minha carreira como um <code translate="no">git log</code>. Cada projeto é uma branch que volta num merge. Toque num projeto para ver a história completa.</p></div>
</section>
<div class="tagbar" role="group" aria-label="Filtrar o histórico"><span class="tagbar__l">Filtrar</span>${FILTERS.map((f, i) => `<button type="button" data-f="${f}" aria-pressed="${!i}">${f}</button>`).join('')}</div>
<main class="stage">
  <section class="log" id="historico" aria-label="Histórico de carreira e projetos">
    <svg class="graph" aria-hidden="true"><defs><clipPath id="pen"><rect x="-20" y="-40" width="400" height="0"/></clipPath></defs><g class="g-edges" clip-path="url(#pen)"></g><g class="g-nodes"></g></svg>
    <ol class="rows">${ROWS.map(rowHtml).join('')}</ol>
    <div class="blk blk--sm"><p class="blk__cmd"><span class="p">$</span> git log --stat --since=2019 -- stack/ <span class="blk__h">o que usei em cada empresa</span></p>${V.stackmap()}</div>
    <div class="stack"><p class="stack__h"><code translate="no">$ cat stack.txt</code></p><ol>
      <li><span>Front e BFF</span>Nuxt, Node</li><li><span>APIs e lambdas</span>Python</li><li><span>Dados</span>MongoDB Atlas</li><li><span>Infra</span>AWS ECS, Lambda, SQS, CloudFront, ElastiCache, Pulumi</li><li><span>Entrega</span>GitLab CI/CD, Docker</li><li><span>Observabilidade</span>Datadog, Mixpanel</li></ol></div>
  </section>
  <aside class="peek" aria-live="polite"><div class="peek__in"></div></aside>
</main>
<div class="dp-slot">${MOSTRAR_DEPOIMENTOS ? depoimentos(DEPOIMENTOS) : ''}</div>
${cafeHtml()}
<footer class="foot" id="contato">
  <h2 class="foot__h">Fale comigo</h2>
  <p class="foot__p">Se você quer IA trabalhando junto com o seu time, ou procura um Tech Lead que entre nas decisões de produto, me chama. A primeira conversa é para eu entender o seu contexto.</p>
  <div class="hero__cta">${agendar('geral')}<a class="cta cta--ghost foot__send" href="mailto:${EMAIL}?subject=${encodeURIComponent('Oi, Lucas')}">Escrever por e-mail</a></div>
  <p class="foot__links"><a href="mailto:${EMAIL}">${EMAIL}</a><a href="${AGENDAR.geral}" target="_blank" rel="noopener">WhatsApp</a><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a><span>Caxias do Sul, RS</span></p>
</footer>
<div class="scrub" aria-label="Linha do tempo" role="group"><span class="scrub__y">hoje</span><div class="scrub__t" role="slider" tabindex="0" aria-label="Ir para um ano" aria-valuemin="2015" aria-valuemax="2026" aria-valuenow="2026"><i class="scrub__th"></i></div></div>
<div class="sheet" hidden><div class="sheet__in" role="dialog" aria-modal="false" aria-label="Prévia do projeto"><span class="sheet__grab" aria-hidden="true"></span><button type="button" class="sheet__x" data-sheet-close aria-label="Fechar prévia">${icon('close', { size: 20 })}</button><div class="sheet__c"></div></div></div>
<div class="st" id="st" role="dialog" aria-modal="true" aria-label="Stories" hidden></div>`;

  /* ---------- grafo ---------- */
  const svg = $('.graph'), edges = $('.g-edges'), nodes = $('.g-nodes'), list = $('.rows'), clip = $('#pen rect');
  let ys = [], gTop = 0, H = 0, lit = new Set();
  const lw = () => (innerWidth < 768 ? 15 : 28), X = (l) => 10 + l * lw();
  function layout() {
    // offsetTop ignora o translate da animação de entrada; o nó fica na primeira linha de cada cartão
    const ANC = { c: '.c__k', m: '.m__git', tag: '.t__ref', era: '.e__p', edu: '.m__k' };
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
      return `<g class="node ${k}" data-row="${r.i}" data-br="${r.br}" transform="translate(${x} ${y})"><circle class="n-dot" r="${rad}"/>${r.kind === 'm' && !r.edu ? '<circle class="n-core" r="3"/>' : ''}</g>`;
    }).join('');
    gTop = list.getBoundingClientRect().top + scrollY; lit = new Set(); onScroll(true);
  }
  /* ---------- scroll: o grafo é escrito commit a commit ---------- */
  let ticking = false, spy = null;
  function onScroll(force) {
    const pen = reduce ? H + 100 : scrollY + innerHeight * 0.8 - gTop;
    clip.setAttribute('height', Math.max(0, pen + 40));
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
    const useP = !(r.kind === 'm' && SUM[r.set]) && !r.txt;
    const links = useP ? st.p.match(/<a [^>]*>.*?<\/a>/g) || [] : [];
    const extra = links.length ? `<p class="pk__src">Fonte: ${links.join(', ')}</p>` : '';
    const kk = r.kind === 'c' ? `${s.titulo}, ${st.k.toLowerCase()}` : r.kind === 'm' ? s.titulo === r.title ? s.tipo : 'Formação' : r.kind === 'edu' ? 'Formação' : 'Carreira';
    return `<p class="pk__meta"><span>${kk}</span>${r.date ? `<span>${r.date}</span>` : ''}</p>
      <div class="pk__vis">${vis}</div>
      <p class="pk__t">${r.kind === 'c' ? st.t : r.title || `${r.co}, ${r.role.toLowerCase()}`}</p>
      <p class="pk__d">${useP ? st.p.replace(/<a [^>]*>.*?<\/a>/g, '').trim() : r.kind === 'm' && SUM[r.set] ? SUM[r.set] : r.txt}</p>${extra}
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

  /* ---------- atalhos para os testes: mostrar a prévia ou abrir a história de um projeto ---------- */
  const goTo = (r) => scrollTo({ top: gTop + ys[r.i] - innerHeight * 0.4, behavior: reduce ? 'instant' : 'smooth' });
  const rowOfSet = (id) => G.find((r) => r.merge === id) || G.find((r) => r.set === id);
  const show = (id) => { const r = rowOfSet(id); if (!r) return; setTag('Tudo'); goTo(r); if (wide()) { hoverRow = r; showPeek(r); setTimeout(() => (hoverRow = null), 1600); } else openSheet(r); };

  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden && $('#st').hidden) closeSheet(); });
  let lastW = innerWidth; addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; layout(); } });
  const align = () => { const ANC = { c: '.c__k', m: '.m__git', tag: '.t__ref', era: '.e__p', edu: '.m__k' }; let worst = 0, at = null; G.forEach((r) => { const n = nodes.querySelector(`[data-row="${r.i}"] .n-dot`).getBoundingClientRect(), a = list.querySelector(`[data-row="${r.i}"] ${ANC[r.kind]}`).getBoundingClientRect(); const d = Math.abs((n.top + n.height / 2) - (a.top + a.height / 2)); if (d > worst) { worst = d; at = r.i; } }); return { worst: Math.round(worst * 10) / 10, at }; };
  window.__depoimentos = (lista) => { $('.dp-slot').innerHTML = depoimentos(lista); layout(); };
  window.__home = { show, open: (id) => openSet(id, 0), layout, setTag, align, rowY: (i) => gTop + ys[i], rows: ROWS };
  return { start() { layout(); initCafe(); document.body.classList.add('ready'); if (wide()) showPeek(G[0]); } };
}
