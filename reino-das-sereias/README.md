# Mundo das Sereias Encantadas

Produto modelado a partir da página "Mundo das Princesas Encantadas": livro digital em PDF para imprimir
(15 páginas de colorir, 5 atividades, 5 desafios, 5 páginas especiais) + bônus Caça ao Tesouro Encantado, R$ 9,90.

```
pagina-de-vendas.html      página de vendas (arquivo único, mobile-first)
entregavel/
  reino-das-sereias.pdf       livro completo (37 págs: capa, boas-vindas, 30 do conteúdo, 5 do bônus)
  reino-das-sereias-pb.pdf    mesma edição com capa em preto e branco
  src/art.mjs, scenes.mjs     ilustrações em SVG (autorais, geradas por código)
  src/build.mjs               gera os PDFs      → npm install && npm run build
  src/build-pagina.mjs        gera a página     → node src/build-pagina.mjs
```

Antes de publicar: troque `CHECKOUT` em `src/build-pagina.mjs` pelo link da oferta e regere a página.
Mudanças em relação à página-modelo: tema sereias (personagens Marina, Pérola, Corália e Estrela), identidade visual própria,
FAQ com todas as respostas, acesso sem contradição (arquivo seu, sem prazo) e sem depoimentos inventados.
