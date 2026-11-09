# lucas-gehlen-cv

Meu currículo em forma de site. A home é um `git log --graph` da minha carreira: a main é a trajetória, cada projeto é uma branch que volta num merge, e cada merge abre em stories.

Tudo é HTML, CSS e JavaScript sem framework, com Vite para o build. Os desenhos são SVG feitos no código, sem imagens.

## Rodar

Precisa de Node 20 ou mais novo.

```sh
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera dist/
npm run preview   # serve o dist/ para conferir o build
```

## Testes

```sh
npx playwright install chromium   # só na primeira vez
npm test
```

O teste gera o build e roda o Playwright em 390x844 e 1440x900: grafo desenhado no scroll, prévia, terminal, linha do tempo, stories (toque, swipe, segurar para pausar), rodapé, contraste AA de todo texto visível, movimento reduzido, fps e erros de console. Os prints e vídeos vão para `shots/`, que fica fora do git.

## Onde está cada coisa

- `src/home.js`: a home (grafo, terminal, filtros por tag, linha do tempo, prévia).
- `src/main.js`: o conteúdo dos stories e o player.
- `src/teasers.js` e `src/art.js`: as ilustrações de cada projeto.
- `src/brand.js`: marca, cores e ícones. `brand.html` mostra a identidade.
- `BRAND.md`: decisões de identidade e as referências que usei.

## Pendências

- `[preencher e-mail]` no rodapé.
- Foto (ainda não entrou no site).

## Fontes

Cabinet Grotesk vem da Fontshare (Indian Type Foundry, licença ITF Free Font). Geist Mono vem do pacote @fontsource.
