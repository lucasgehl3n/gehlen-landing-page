// Identidade: marca, paleta, ícones e grafismos (tudo em SVG desenhado à mão aqui).
export const C = { neblina: '#E5E8E3', papel: '#F6F7F4', basalto: '#191D1B', basalto2: '#232825', grafite: '#59615C', sinal: '#C9AE7C', petroleo: '#14555B', araucaria: '#2C5E50', musgo: '#9DB5A9' };

// Monograma LG: a main (L) com um branch que volta num merge (G); o ponto é o commit atual.
export const mark = ({ size = 40, ink = C.neblina, ping = C.sinal, sw = 3.4, title = 'Lucas Gehlen' } = {}) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 48 48" role="img" aria-label="${title}"><g fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="square"><path d="M38.55 11.79A19 19 0 1 0 43 24"/><path d="M24 8.5V24H43"/></g><circle cx="35.3" cy="17.6" r="2.7" fill="${ping}"/></svg>`;

const P = {
  play: 'M8 5.5v13l10.5-6.5z', pause: 'M8.5 5v14M15.5 5v14', close: 'M6 6l12 12M18 6L6 18', left: 'M15 18l-6-6 6-6', right: 'M9 18l6-6-6-6',
  paw: 'M12 20c-3 0-5-1.6-5-3.6 0-2.3 2.4-4.4 5-4.4s5 2.1 5 4.4c0 2-2 3.6-5 3.6zM6 11.5a1.8 2.3 0 1 0 0-.01M18 11.5a1.8 2.3 0 1 0 0-.01M9.2 7.5a1.8 2.4 0 1 0 0-.01M14.8 7.5a1.8 2.4 0 1 0 0-.01',
  cap: 'M2.5 9.5L12 5l9.5 4.5L12 14zM6.5 11.5v4.2c1.6 1.4 3.4 2 5.5 2s3.9-.6 5.5-2v-4.2M21.5 9.5v5',
  code: 'M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15',
  tower: 'M5 21V4h9v17M14 9h5v12M3 21h18M8 7.5h3M8 11h3M8 14.5h3',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  doc: 'M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h6M9 9h2',
  play2: 'M4 5h16v14H4zM10 9.5v5l4-2.5z',
  radar: 'M12 3a9 9 0 1 0 9 9M12 7.5a4.5 4.5 0 1 0 4.5 4.5M12 12l6.5-6.5',
  hex: 'M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9zM12 8.5l3 1.75v3.5L12 15.5l-3-1.75v-3.5z',
  city: 'M8 20.5s-5-5-5-8.8a5 5 0 0 1 10 0c0 3.8-5 8.8-5 8.8zM17.5 20.5s-3.5-3.4-3.5-6a3.5 3.5 0 0 1 7 0c0 2.6-3.5 6-3.5 6z',
  flag: 'M5.5 21V3.5M5.5 4.5h12l-2.5 4 2.5 4h-12',
  team: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.7 3 2.6 3 5.2',
  case: 'M3.5 7.5h17v12h-17zM9 7.5V5h6v2.5M3.5 12.5h17',
};
export const icon = (n, { size = 22, sw = 1.75, color = 'currentColor' } = {}) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
export const ICONS = Object.keys(P);

// Grafismos: anel com marcações, colchetes de mira e ping
export const ring = (s = 120, color = C.grafite) => {
  let t = ''; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2, l = i % 4 ? 3 : 7, r = s * 0.46; t += `<line x1="${s / 2 + Math.cos(a) * r}" y1="${s / 2 + Math.sin(a) * r}" x2="${s / 2 + Math.cos(a) * (r - l)}" y2="${s / 2 + Math.sin(a) * (r - l)}"/>`; }
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" fill="none" stroke="${color}" stroke-width="1.2" aria-hidden="true"><circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.46}"/><circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.28}"/>${t}</svg>`;
};
export const brackets = (s = 60, color = C.basalto) => `<svg width="${s}" height="${s}" viewBox="0 0 60 60" fill="none" stroke="${color}" stroke-width="2.5" aria-hidden="true"><path d="M8 20V8h12M40 8h12v12M52 40v12H40M20 52H8V40"/><circle cx="30" cy="30" r="5" fill="${C.petroleo}" stroke="none"/></svg>`;
