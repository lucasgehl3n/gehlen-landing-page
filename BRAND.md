# Identidade visual: Lucas Gehlen

Folha de identidade (tema, marca, tipo, ícones, grafismos, ilustrações): `brand.html` (o `npm test` gera o print em `shots/brand-sheet.png`). Código-fonte da marca: `src/brand.js`.

## Ideia
A home é um grafo de commits no estilo `git log --graph`, e o grafo é a peça principal da página. A `main` é a carreira: Vero (abr/2019), Conecta (mar/2020), Compass (ago/2022), Pilar sênior (nov/2024) e `tag: tech-lead` (set/2025). A branch `formacao` sai do IFRS (2015), passa pela UCS, recebe o merge do TCC Pelos Caminhos e entra na main em 2023. Cada case é uma branch que nasce na main, ganha commits (desafio, o que eu fiz, o que mudou) e volta com um merge. O HEAD pulsa no merge mais recente.

### Como a home prende sem precisar abrir um story
- **Escrito no scroll.** As arestas ficam atrás de um clipPath que desce com a rolagem. Uma "caneta" na main marca o ponto e os nós acendem quando ela passa.
- **Prévia rica.** No desktop, um painel fixo à direita mostra o commit sob o mouse ou, sem mouse, o commit mais perto do centro da tela. O painel traz hash curto, branch, data, tags, um mini visual e o botão para abrir a história. No celular, o toque abre uma folha de baixo com o mesmo conteúdo; arrastar para baixo fecha.
- **Terminal digitável.** `git log --tag=time`, `git show shorts-hls`, `git checkout pelos-caminhos`, `git branch`, `whoami`, `help`. Tem Tab para completar, seta para cima para o histórico e sugestões clicáveis que se digitam sozinhas.
- **Linha do tempo em escala real.** Uma barra fixa embaixo, de 2015 a hoje, com um ponto em cada etapa datada. Arrastar ou tocar leva ao commit daquele ano, e o ano atual acompanha a rolagem.
- **Elementos diferentes entre os commits:**
  - Cada merge de case tem um cartão com forma própria e um teaser vivo: waterfall HLS, malha H3, mapa SP–Curitiba, notificação de alerta, checklist de MR, leitura de raça.
  - As épocas (Vero, Conecta, Compass, Pilar) são blocos tipográficos com trilho de duração em escala real e a stack da época.
  - O tech lead aparece como tag entre réguas.
  - A formação usa bronze.
  - O log fecha com `cat stack.txt` e um rodapé em que a pessoa escreve a mensagem do `git commit`, que vira o assunto do e-mail.
- **Divisores de época** ("2025 até hoje", "2024 a 2025"...). Cases sem data pública ficam dentro do período certo, sem data própria.
- **Um tema só:** escuro, basalto + champanhe, da home aos stories. Sem troca de tema. Contraste AA conferido por teste automático em todo texto visível.

### Benchmark (aberto em 09/11/2026) e o que eu peguei
| Referência | O que vi | O que peguei |
|---|---|---|
| GitKraken Desktop (guia da interface) | Cada linha é um commit e cada coluna uma branch. Passar o mouse numa branch destaca os commits dela e apaga os outros. Clicar abre o Commit Panel ao lado. | Destaque de branch no hover com o resto a 22%, e o painel de prévia fixo à direita (o "Commit Panel" do portfólio). |
| GitHub network graph (docs) | Uma linha do tempo dos commits que você arrasta para ver o passado, com atalhos de teclado. | O scrub de anos arrastável, que também responde às setas do teclado. |
| Gitgraph.js (README) | Biblioteca para desenhar git graphs bonitos em artigos. Foi arquivada, e o autor recomenda Mermaid. | Escrevi o grafo do zero em SVG em vez de usar biblioteca, com curvas em S suaves entre colunas. |
| git-sim (README) | Visualiza comandos git e anima cada operação, com cores por tipo. HEAD e refs aparecem como rótulos. | Refs como pílulas (`HEAD -> main`, `tag: tech-lead`), o terminal que "simula" `git show` e `git checkout` na página, e cor por tipo de branch (main, case, formação). |
| rauno.me | Página mínima com uma régua de ticks no topo que serve de scrubber para o carrossel. A tipografia carrega tudo. | A régua de ticks fina da linha do tempo e o cuidado com microcopy. |
| brittanychiang.com | Experiência por período com stack em chips e um painel fixo à esquerda. Escaneável em 10 s. | Blocos de época com período, cargo, uma frase e chips de stack. |
| Bruno Simon (bruno-simon.com) | O print local ficou vazio porque o WebGL carrega depois da captura. O que conheço do site: o portfólio é um mundo que se explora e premia curiosidade com pequenas descobertas. | Momentos de descoberta sem 3D: o grafo que se escreve, o terminal com comandos escondidos (`git blame`) e a mensagem de commit no rodapé. |

## Marca (monograma LG)
- Grade de 48. A haste do L é a `main`; o arco do G é uma branch que sai e volta, e o pé do L é o merge que fecha o G.
- O ponto é um commit, sempre na cor de acento da superfície.
- Traço 3,4 com ponta reta. Abaixo de 20 px o traço sobe para 4 a 4,4.
- Versões: neblina sobre basalto com ping champanhe (a do site), basalto sobre champanhe, monocromática.
- Usos: header, favicon (SVG), cabeçalho dos stories.

## Cor
Tons da Serra Gaúcha: neblina, basalto, musgo. O acento é raro e quer dizer "olhe aqui".

| Nome | Hex | Uso |
|---|---|---|
| Basalto | #191D1B | fundo do site inteiro |
| Basalto 2 | #232825 | cartões, folha de prévia, ilustrações |
| Neblina | #E5E8E3 | texto principal |
| Cinza | #9AA39E | texto de apoio (6,9:1 sobre basalto) |
| Champanhe | #C9AE7C | acento: merges, HEAD, branch em destaque, foco, botões |
| Musgo | #9DB5A9 | branch da formação |
| Bronze | #6B5226 | rótulo da notificação, sobre neblina |

Um tema só, escuro, decidido pelo Lucas. O tema claro (neblina + petróleo) e o toggle saíram do código. O laranja (#FF5A1F) da primeira versão também foi descartado a pedido dele.

## Tipo
- **Cabinet Grotesk** (Fontshare, licença ITF Free Font License, uso comercial liberado), arquivos em `public/fonts/`. Títulos 800 com tracking negativo; texto 500/400.
- **Geist Mono** (@fontsource, OFL) para anos, rótulos, fontes e dados.
- Sem serifa em nenhum lugar.

## Ícones e grafismos
- Ícones próprios em grade 24, traço 1,75, pontas e junções redondas, só traço (play, pause, fechar, setas, pata, capelo, código, prédio, sino, documento, vídeo, hexágono, cidades, flag, time, maleta).
- Grafismos do grafo: linha da main (3,5 px; 4,5 no desktop, neblina), branches (2 px, 35%), merge (nó cheio champanhe com contorno), commit de case (nó vazado), commit de carreira (nó cheio neblina), HEAD (anel petróleo). Refs como `HEAD -> main` e `tag: tech-lead` em pílulas mono.
- Branch em destaque vira champanhe 3 px; o resto baixa para 18%.

## Ilustrações dos stories
Regra: cada visual demonstra algo verdadeiro do case, com acabamento de produto. Nenhum enfeite. Tudo é SVG ou canvas desenhado no código (`src/art.js`), traço claro sobre Basalto 2, um acento champanhe, rótulos em mono. Simulações dizem que são simulação; dado real só com fonte pública e link.

| Case / story | Visual | O que demonstra | Benchmark que inspirou |
|---|---|---|---|
| Shorts, desafio | Waterfall de rede em tempo real: manifesto, 4 segmentos HLS chegando, linha do "primeiro quadro", degrau por segmento; alterna rede fraca e Wi-Fi | Como o vídeo começa no degrau leve e sobe; por que rede fraca atrasa o primeiro quadro | Rauno (ferramenta de interface como objeto de craft) e o painel de rede do DevTools |
| Shorts, o que eu fiz | Escada de qualidade 144p a 1080p sobre um quadro de teste (texto e listras finas) pixelado no canvas | O que cada degrau entrega: texto pequeno e detalhe fino só aparecem nos degraus altos | Josh W. Comeau (explicação interativa que ensina mexendo) |
| Shorts, resultado | Barras comparativas com a fonte embaixo | Números públicos dos testes (Folha, VEJA), sem bloco de número gigante | Paco (dado seco, tipografia primeiro) |
| Segunda cidade | Cartografia mínima: graticule em graus, São Paulo e Curitiba nas coordenadas reais, distância em linha reta calculada | Onde o portal opera hoje | Clément Grellier (precisão, motion com propósito) |
| Mapa H3, desafio | Mapa com 140 pinos sobrepostos | O problema: muitos imóveis viram um borrão | Bruno Simon (mostrar o problema antes da solução, com humor seco) |
| Mapa H3, o que eu fiz | Malha hexagonal interativa que reagrupa pontos fictícios em cidade, bairro e rua | Como células H3 agregam pontos e mudam de resolução com o zoom | Lusion / Wodniack (interação direta sobre o material) |
| Alertas | Busca repetida em dias diferentes; base única para portal e rede; montador de busca que gera aviso simulado | O antes, a decisão de ter uma base, e o efeito para quem usa | Rauno (microinteração com resultado imediato) |
| Time e engenharia | Semana ilustrativa (1:1, review, tech talk, doc de decisão); checklist de merge request; fases de feature flag; o mesmo guia lido por pessoa e por assistente | O fluxo do time sem nomes internos | Paco / Brittany Chiang (lista clara, sem efeito) |
| Pelos Caminhos | Três perfis em volta da pata; blocos App/API/Raça clicáveis; leitura de raça com mira; QR ilustrativo | Quem usa, como foi construído, a parte de visão computacional | Bruno Simon (stack transparente) |
| Trajetória | Linha do tempo estudo × trabalho com datas reais | Onde cada etapa cabe na carreira | Brittany Chiang (experiência escaneável) |

## Movimento
- Ao carregar, as branches se desenham em 1,6 s e os nós aparecem em sequência. Depois, nada se mexe sozinho na home.
- Stories avançam sozinhos a cada 10 s, param quando a pessoa toca numa ilustração.
- `prefers-reduced-motion`: grafo já desenhado, sem avanço automático, sem animação de barra.

## Voz
Primeira pessoa, frases curtas, verbo concreto ("propus", "liderei", "implementei"). Sem slogan, sem travessão, sem "não é X, é Y", sem número inventado. Fato da Pilar sempre com "segundo a VEJA" e link. Detalhe técnico vai para as Notas técnicas, sem nome de empresa.
