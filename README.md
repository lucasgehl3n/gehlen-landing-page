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

O teste gera o build e roda o Playwright em 390x844, 768x1024, 1440x900 e 1920x1080: alinhamento dos nós com os cartões, sem rolagem horizontal, grafo desenhado no scroll, prévia, terminal, linha do tempo, stories (toque, swipe, segurar para pausar), rodapé, contraste AA de todo texto visível, movimento reduzido, fps e erros de console. Os prints e vídeos vão para `shots/`, que fica fora do git.

## Onde está cada coisa

- `src/home.js`: a home (grafo, terminal, filtros por tag, linha do tempo, prévia).
- `src/main.js`: o conteúdo dos stories e o player.
- `src/teasers.js` e `src/art.js`: as ilustrações de cada projeto.
- `src/brand.js`: marca, cores e ícones. `brand.html` mostra a identidade.
- `BRAND.md`: decisões de identidade e as referências que usei.

## Contato e conteúdo

`src/config.js` concentra e-mail, LinkedIn, o link do botão "Agendar conversa" (hoje WhatsApp) e os depoimentos. A seção de depoimentos só aparece com `MOSTRAR_DEPOIMENTOS = true` e a lista preenchida, com nome, cargo e LinkedIn de quem autorizou.

## Páginas

- `/`: currículo (grafo, Como eu trabalho, cases com contexto, gargalo e impacto).
- `/servicos/`: consultoria de implantação de IA em times.

## Pendências

- Depoimentos autorizados.
- Foto (ainda não entrou no site).

## Fontes

Cabinet Grotesk vem da Fontshare (Indian Type Foundry, licença ITF Free Font). Geist e Geist Mono vêm do pacote oficial da Vercel (`geist` 1.9.2 no npm), sob a SIL Open Font License 1.1; a licença está em `public/fonts/Geist-OFL.txt`.

O contorno do mapa vem do Natural Earth 1:50m (domínio público), pelo repositório nvkelso/natural-earth-vector.
