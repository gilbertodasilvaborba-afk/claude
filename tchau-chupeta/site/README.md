# Página de vendas — tchauchupeta.vercel.app

Site estático: `index.html` + `fonts/`. Não tem build.

## Publicar na Vercel

```bash
cd tchau-chupeta/site
npx vercel --prod      # escolha o projeto "tchauchupeta" já existente
```

Ou, no painel da Vercel, conecte este repositório ao projeto e defina
**Root Directory** = `tchau-chupeta/site`.

## Notas de desempenho

- As duas fontes são pré-carregadas e usam `font-display: optional`: o texto
  nunca troca de fonte depois de aparecer, então o topo não "pula" (CLS 0,42 → 0).
- O favicon é um SVG embutido, o que evita a requisição com erro 404 para `/favicon.ico`.
- Pixel do Meta: PageView + ViewContent ao carregar, InitiateCheckout no clique.
  As UTMs e o `fbclid` da URL são repassados ao link da Kiwify.
