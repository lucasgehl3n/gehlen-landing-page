import './style.css';
import { mark } from './brand.js';
import { topbar, agendar } from './shell.js';
import { EMAIL, LINKEDIN, AGENDAR } from './config.js';

document.head.insertAdjacentHTML('beforeend', `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(mark({ size: 48 }).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'))}">`);

// Passos na ordem em que acontecem. Cada um sai do que eu já faço como Tech Lead.
const PASSOS = [
  ['Escuta', 'Começo com conversas individuais com quem está no dia a dia. Hoje faço 1:1 com cada pessoa do time, e é ali que aparece o que não chega à reunião.'],
  ['Diagnóstico', 'Mapeio o fluxo do ticket ao deploy: onde o trabalho espera, o que está escrito e o que só existe na cabeça de alguém. Só depois falo de ferramenta.'],
  ['Alinhamento', 'Escrevo a proposta com contexto, alternativas, custo e como validar. O time revisa e decide comigo. Se o grupo escolher outro caminho, sigo a decisão.'],
  ['Implantação gradual', 'Começo por um fluxo pequeno, com quem quer testar. Quando dá, a mudança entra atrás de feature flag, como faço no meu time hoje, e só cresce o que funcionou.'],
  ['Documentação', 'O que deu certo vira guia e runbook no repositório. Escrevo para que a pessoa e o assistente de código leiam o mesmo texto.'],
  ['Autonomia do time', 'Meu trabalho termina quando o time segue sem mim: sabe onde está cada guia, como atualizar e quando largar uma ferramenta que não ajudou.'],
];
const BASE = [
  ['Pilar', 'Tech Lead', 'set/2025 até hoje', 'Lidero o time de engenharia do PilarHomes. Faço 1:1 com cada pessoa, organizo tech talks sobre qualidade, arquitetura e IA no desenvolvimento, e decisão de porte vira documento revisado pelo time. Mantenho os runbooks e o guia de merge request, que também funciona como skill para assistente de código.'],
  ['Compass.uol', 'Front-end pleno', 'ago/2022 a nov/2024', 'Alocado na Vivo, num portal B2B feito em micro frontends. Implantei testes de mutação com Stryker sobre a suíte em Jest do time e atuei em SRE com Kibana.'],
];
const FICA = [
  'Um retrato escrito de como o time trabalha hoje.',
  'A proposta que o time revisou, com alternativas e custo.',
  'Guias e runbooks no repositório, legíveis por gente e por assistente de código.',
  'Um plano em fases para expandir o que funcionou.',
];
const COMBINADOS = [
  'Ganho de produtividade só entra na conversa depois de medido com o seu time.',
  'A mudança entra por partes, um fluxo de cada vez.',
  'Toda ferramenta que eu configurar fica documentada para o time operar sem mim.',
];

document.getElementById('app').innerHTML = `
${topbar('servicos', '../')}
<main class="sv">
  <section class="sv-hero">
    <p class="hero__head"><code translate="no">git checkout servicos</code></p>
    <h1 class="sv-h1">Ajudo times de produto e engenharia a colocar IA no trabalho, uma etapa de cada vez.</h1>
    <p class="sv-lead">Faço isso hoje como Tech Lead. Organizo tech talks sobre IA no desenvolvimento e escrevi um guia de contribuição que serve tanto para quem entra no time quanto para o assistente de código. Agora ofereço esse trabalho para outras empresas.</p>
    <div class="hero__cta">${agendar('ia')}<a class="cta cta--ghost" href="mailto:${EMAIL}?subject=${encodeURIComponent('IA no meu time')}">Escrever por e-mail</a></div>
    <p class="cta__note">Agendar abre uma conversa comigo no WhatsApp.</p>
  </section>

  <section class="sv-sec sv-steps" id="conduzo" aria-labelledby="conduzo-h">
    <div class="sv-side"><h2 class="sec__h" id="conduzo-h">Como eu conduzo</h2><p class="sec__p">A mudança anda como uma branch: sai da rotina do time, ganha um commit por etapa e volta num merge.</p></div>
    <div class="br">
      <p class="br__cmd"><span class="p">$</span> git checkout -b ia-no-time</p>
      <ol class="br__list">${PASSOS.map(([t, p], i) => `<li class="br__i"><span class="br__n" aria-hidden="true">${i + 1}</span><h3 class="br__t">${t}</h3><p class="br__p">${p}</p></li>`).join('')}</ol>
      <p class="br__cmd br__cmd--end"><span class="p">$</span> git merge ia-no-time <span class="br__h">volta para a rotina do time</span></p>
    </div>
  </section>

  <section class="sv-sec" aria-labelledby="base-h">
    <div class="sv-side"><h2 class="sec__h" id="base-h">De onde vem esse jeito de trabalhar</h2><p class="sec__p">Do que faço como Tech Lead e de quando levei uma prática nova para um time que já existia.</p></div>
    <div class="base">${BASE.map(([co, role, per, txt]) => `<article class="base__i"><p class="base__p"><code>${per}</code></p><h3 class="base__co">${co}</h3><p class="base__role">${role}</p><p class="base__txt">${txt}</p></article>`).join('')}
      <a class="base__more" href="../#historico">Ver o currículo completo</a></div>
  </section>

  <section class="sv-sec sv-two" aria-label="Entregas e combinados">
    <div><h2 class="sec__h">O que fica com o time</h2><ul class="lst">${FICA.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div><h2 class="sec__h">Combinados desde o início</h2><ul class="lst lst--b">${COMBINADOS.map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </section>
</main>
<footer class="foot sv-foot" id="contato">
  <h2 class="foot__h">Conte como o seu time trabalha hoje</h2>
  <p class="sv-foot__p">Na primeira conversa eu escuto. Escopo e formato saem dela.</p>
  <div class="hero__cta">${agendar('ia')}<a class="cta cta--ghost" href="mailto:${EMAIL}?subject=${encodeURIComponent('IA no meu time')}">Escrever por e-mail</a></div>
  <p class="foot__links"><a href="mailto:${EMAIL}">${EMAIL}</a><a href="${AGENDAR.ia}" target="_blank" rel="noopener">WhatsApp</a><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a><span>Caxias do Sul, RS</span></p>
</footer>`;
document.body.classList.add('ready');
