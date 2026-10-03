// Dados da oferta compartilhados pelas páginas de vendas (A e B).
// Altere aqui e rode `node src/pagina.mjs && node src/pagina-b.mjs`.

export const OFERTA = {
  checkout: 'https://pay.kiwify.com.br/pZIVc6a', // link da Hotmart/Kiwify/Eduzz etc.
  precoDe: '',                // preço "de" riscado (deixe vazio se não houver)
  preco: '29,90',             // preço à vista, sem "R$"
  parcelas: '',               // ex.: '5x de R$ 9,90' (vazio esconde a linha)
  garantiaDias: 7,            // 7 é o mínimo legal (CDC, art. 49)
  formato: 'Guia digital',    // confirme o formato real (PDF, área de membros...)
  bonus: [
    // { titulo: 'Nome do bônus', texto: 'O que ele entrega.' },
  ],
  pixelMeta: '1137389055898462', // ID do Pixel da Meta (vazio = não carrega)
};

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Valor numérico para os eventos do Pixel (ex.: '29,90' → 29.9)
export const valor = Number(OFERTA.preco.replace(/\./g, '').replace(',', '.')) || 0;

// Snippet do Pixel. `variante` vai em content_category para separar as páginas no Gerenciador de Eventos.
export const pixelTag = (variante) =>
  OFERTA.pixelMeta
    ? `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${esc(OFERTA.pixelMeta)}');fbq('track','PageView');fbq('track','ViewContent',{content_name:'Tchau Chupeta',content_category:'${variante}',value:${valor},currency:'BRL'});</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${esc(OFERTA.pixelMeta)}&ev=PageView&noscript=1"></noscript>`
    : '';
