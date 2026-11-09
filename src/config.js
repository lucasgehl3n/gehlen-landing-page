// Dados de contato e chaves de conteúdo. Troque aqui e o site inteiro acompanha.
export const EMAIL = 'contato.lucasgehlen@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/lgehlen';
const WHATSAPP = '5554993503203';
const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
// Botão "Agendar conversa". Hoje abre o WhatsApp; para usar um calendário, troque estes dois links.
export const AGENDAR = {
  geral: wa('Oi Lucas, vim pelo seu site e quero conversar'),
  ia: wa('Oi Lucas, vim pelo seu site e quero conversar sobre IA na minha empresa'),
};

// Depoimentos: só entram com autorização de quem escreveu (nome, cargo e link do LinkedIn).
// Enquanto a lista estiver vazia ou a chave desligada, a seção não aparece.
export const MOSTRAR_DEPOIMENTOS = false;
export const DEPOIMENTOS = [
  // { nome: '', cargo: '', empresa: '', linkedin: 'https://www.linkedin.com/in/...', texto: '' },
];
