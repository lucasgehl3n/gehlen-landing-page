// Peças comuns às duas páginas: cabeçalho com abas, botão de agendar e depoimentos.
import { mark, icon } from './brand.js';
import { AGENDAR } from './config.js';

export const topbar = (active, home) => `<header class="top"><a class="brand" href="${home}" aria-label="Lucas Gehlen, início">${mark({ size: 32 })}<span translate="no">Lucas Gehlen</span></a>
<nav class="top__r" aria-label="Páginas"><a href="${home}"${active === 'cv' ? ' aria-current="page"' : ''}>Currículo</a><a href="${home}servicos/"${active === 'servicos' ? ' aria-current="page"' : ''}>Serviços</a><a href="#contato">Contato</a></nav></header>`;

export const agendar = (tipo = 'geral', cls = '') => `<a class="cta ${cls}" href="${AGENDAR[tipo]}" target="_blank" rel="noopener" data-agendar>Agendar conversa</a>`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Cartões de depoimento: texto, nome, cargo e link para o LinkedIn de quem escreveu.
export function depoimentos(lista) {
  if (!lista || !lista.length) return '';
  return `<section class="dp" id="depoimentos" aria-labelledby="dp-h">
  <div class="dp__head"><h2 class="sec__h" id="dp-h">Quem trabalhou comigo</h2></div>
  <div class="dp__list">${lista.map((d) => `<figure class="dp__c"><blockquote><p>${esc(d.texto)}</p></blockquote>
    <figcaption><span class="dp__n">${esc(d.nome)}</span><span class="dp__r">${esc(d.cargo)}${d.empresa ? `, ${esc(d.empresa)}` : ''}</span>${d.linkedin ? `<a class="dp__in" href="${esc(d.linkedin)}" target="_blank" rel="noopener">LinkedIn de ${esc(d.nome.split(' ')[0])}</a>` : ''}</figcaption></figure>`).join('')}</div></section>`;
}
export { icon };
