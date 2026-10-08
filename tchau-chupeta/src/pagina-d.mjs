// Gera a página principal (/) e a cópia em /d a partir da variante D.
// Saídas: pagina-vendas/index.html (página principal) e pagina-vendas/d/index.html.
// Uso: node src/pagina-d.mjs
// Modelada na arte de referência enviada pelo cliente: foto real da criança, título com
// marca-texto amarelo, benefícios com ícones redondos, faixa "Chegou o método"
// e botões em pílula amarela. O texto vende o mecanismo único (Despedida Participativa) e a
// promessa, sem detalhar os formatos do que é entregue.
// A foto (pagina-vendas/d/crianca.jpg) foi recortada da arte de referência; troque pelo
// arquivo original em alta resolução quando tiver.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OFERTA, esc, valor, pixelTag } from './oferta.mjs';
import { C, pacifier, star } from './illustrations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'pagina-vendas', 'd');

const K = {
  navy: '#1F2A6B', navyDeep: '#151D52', purple: '#7B3FBF', purpleSoft: '#EFE6FB',
  yellow: '#FFD84D', yellowSoft: '#FFF4C7', pink: '#F7738A', mint: '#6CC7A8', lilac: '#B79BEA',
  cream: '#FFFBF4', ink: '#1F2A6B', inkSoft: '#56608F',
};

// Cada botão leva no máximo à próxima seção; só os botões da oferta e do final levam ao checkout.
// "Veja por dentro": fotos ilustrativas (Unsplash License) + duas cenas com páginas do entregável
// em baixa resolução (dá para ver títulos e ilustrações, não para usar o material).
// Fotos (Unsplash License): Vitaly Gariev (história, unsplash.com/photos/fQ-Hp3waO1A), Lucas Alexander
// (colorir, sJuDgtkUyYs), Erika Fletcher (desenhar, YfNWGrQI3a4), Vivek Kumar (abraço, a-_1PPjnbUg).
const semMetodo = [
  ['19h', 'A chupeta “sumiu”. Ninguém avisou. “Mãe, cadê minha chupeta?”'],
  ['20h', 'Ela procura no berço, no sofá, na sua bolsa… e começa a chorar.'],
  ['22h', 'O choro não passa. Ela não entende por que perdeu o que dava segurança.'],
  ['00h', 'A casa inteira acordada. Você exausta, com o coração apertado.'],
  ['2h', 'Você devolve a chupeta. Ela aprende que o choro traz a chupeta de volta, e a próxima tentativa fica ainda mais difícil.'],
];
const comMetodo = [
  ['Semanas antes', 'Vocês leem as historinhas da Chupi, da Fada Pipoca e do ursinho Bento. A ideia do tchau fica conhecida e gostosa.'],
  ['Alguns dias antes', 'Ele mesmo escolhe o dia do tchau e vai pintando o calendário.'],
  ['A noite do tchau', 'Faz a cartinha, o desenho e dá tchau para a chupeta, do jeito dele.'],
  ['Na hora de dormir', 'Abraça o ursinho, lembra da história e sabe o que aconteceu.'],
  ['Na manhã seguinte', 'Acorda com o bilhete mágico e o certificado: “Eu já sou grande!”'],
];
const riscos = [
  ['🦷', 'Dentes e mordida', 'O uso prolongado pode deixar a mordida aberta e desalinhar os dentes.'],
  ['🗣️', 'Fala', 'Com a chupeta na boca por muito tempo, alguns sons podem ficar mais difíceis de pronunciar.'],
  ['👂', 'Ouvidos', 'O uso frequente é associado a mais episódios de otite.'],
  ['😢', 'Dependência', 'Quanto mais o tempo passa, mais apego, e mais difícil fica dar tchau sem choro.'],
];
const momentos = [
  ['foto-historia', 'Hora da historinha', 'Mãe lendo uma história para a criança, as duas rindo'],
  ['foto-colorir', 'Colorir e pintar', 'Mãos de criança colorindo um desenho com giz de cera'],
  ['foto-desenhar', 'Desenhar o tchau', 'Criança pequena desenhando numa folha'],
  ['foto-abraco', 'Mais abraço, menos briga', 'Mãe e filha abraçadas e sorrindo'],
];
// Cenas ilustradas do bloco "Chegou o método": criança sem o método (noite, choro) e com o método (manhã, orgulho).
const corpoCrianca = (bracos) => `
    <path d="M78 196 C74 150 92 128 120 126 C148 128 166 150 162 196Z" fill="${C.mint}"/>
    ${bracos}
    <circle cx="120" cy="88" r="38" fill="${C.skin}"/>
    <path d="M82 82 C78 44 160 38 160 80 C150 66 132 60 120 68 C110 58 90 60 82 82Z" fill="${C.hair}"/>`;
const cenaSem = `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Criança chorando à noite procurando a chupeta que sumiu">
  <rect width="240" height="200" rx="18" fill="#3B3470"/>
  <circle cx="200" cy="38" r="18" fill="${C.sun}"/><circle cx="208" cy="32" r="16" fill="#3B3470"/>
  <g fill="#fff" opacity=".7"><circle cx="34" cy="30" r="2"/><circle cx="70" cy="18" r="1.5"/><circle cx="160" cy="22" r="1.5"/><circle cx="226" cy="76" r="1.5"/></g>
  <rect x="0" y="168" width="240" height="32" rx="0" fill="#6B5FA8"/><rect x="0" y="182" width="240" height="18" rx="18" fill="#6B5FA8"/>
  <g transform="translate(12 62)" opacity=".85">
    <path d="M10 30 C10 12 24 8 36 14 C48 8 62 12 62 30 C62 46 48 50 36 46 C24 50 10 46 10 30Z" fill="none" stroke="#C9B8F2" stroke-width="3" stroke-dasharray="5 5"/>
    <circle cx="36" cy="66" r="11" fill="none" stroke="#C9B8F2" stroke-width="3" stroke-dasharray="4 4"/>
    <text x="20" y="2" font-family="Baloo 2,system-ui,sans-serif" font-weight="800" font-size="28" fill="${C.sun}">?</text>
  </g>
  ${corpoCrianca(`<path d="M86 150 Q90 118 104 104" stroke="${C.mint}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M154 150 Q150 118 136 104" stroke="${C.mint}" stroke-width="14" fill="none" stroke-linecap="round"/>`)}
  <path d="M98 76 L110 82 M142 76 L130 82" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M102 90 Q108 86 114 90 M126 90 Q132 86 138 90" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="120" cy="108" rx="9" ry="8" fill="${C.ink}"/><ellipse cx="120" cy="111" rx="5" ry="3" fill="#F28E78"/>
  <path d="M104 94 q-4 10 0 14 q4 -4 0 -14Z M136 94 q-4 10 0 14 q4 -4 0 -14Z" fill="#7CC4F2"/>
  <path d="M100 116 q-3 8 0 11 q3 -3 0 -11Z" fill="#7CC4F2" opacity=".8"/>
  <circle cx="104" cy="100" r="5" fill="${C.peachDeep}" opacity=".35"/><circle cx="136" cy="100" r="5" fill="${C.peachDeep}" opacity=".35"/>
</svg>`;
const cenaCom = `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Criança sorrindo, acenando tchau para a chupeta e segurando o certificado">
  <rect width="240" height="200" rx="18" fill="#FFF1E4"/>
  <circle cx="206" cy="36" r="16" fill="${C.sun}" opacity=".9"/>
  <path d="M206 12v-6M206 66v-6M182 36h-6M236 36h-6M189 19l-4-4M227 57l-4-4M189 53l-4 4M227 15l-4 4" stroke="${C.sun}" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(22 30)">
    <path d="M30 14 v16" stroke="${C.lavenderDeep}" stroke-width="6"/>
    <circle cx="30" cy="42" r="11" fill="none" stroke="${C.lavenderDeep}" stroke-width="5"/>
    <path d="M4 12 C4 0 16 -2 30 3 C44 -2 56 0 56 12 C56 24 44 26 30 22 C16 26 4 24 4 12Z" fill="${C.peach}"/>
    <path d="M20 12 q3 -4 6 0 M34 12 q3 -4 6 0 M24 17 q6 5 12 0" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56 8 Q66 2 66 -10" stroke="${C.peach}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M70 -18 q4 -4 8 0 M72 -6 q5 0 7 4" stroke="${C.sun}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <text x="0" y="74" font-family="Baloo 2,system-ui,sans-serif" font-weight="800" font-size="15" fill="${C.lavenderDeep}">tchau!</text>
  </g>
  <path d="M74 28 q4 -6 8 0 q4 -6 8 0 q0 6 -8 12 q-8 -6 -8 -12Z" fill="${C.peachDeep}" opacity=".7"/>
  <rect x="0" y="182" width="240" height="18" rx="18" fill="#FFD9C7"/>
  ${corpoCrianca(`<path d="M154 146 Q182 128 186 92" stroke="${C.mint}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <circle cx="187" cy="86" r="10" fill="${C.skin}"/>
    <path d="M196 70 q7 -5 12 2 M199 90 q8 0 10 7" stroke="${C.sun}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M88 150 Q86 168 98 170" stroke="${C.mint}" stroke-width="14" fill="none" stroke-linecap="round"/>`)}
  <g transform="translate(92 150) rotate(-6)">
    <rect width="46" height="34" rx="4" fill="#fff" stroke="${C.lavenderDeep}" stroke-width="3"/>
    <path d="M23 8 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1Z" fill="${C.sun}"/>
    <path d="M10 28h26" stroke="${C.lavenderDeep}" stroke-width="2" stroke-linecap="round"/>
  </g>
  <circle cx="104" cy="98" r="6" fill="${C.peachDeep}" opacity=".4"/><circle cx="136" cy="98" r="6" fill="${C.peachDeep}" opacity=".4"/>
  <path d="M102 88 Q108 80 114 88 M126 88 Q132 80 138 88" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M106 102 Q120 116 134 102" stroke="${C.ink}" stroke-width="3.5" fill="${C.ink}" stroke-linecap="round"/>
</svg>`;
// Bônus (entregavel/bonus/*.pdf, gerados por src/bonus.mjs).
const caixa = (x, y, w, h, cor, fita) => `<g transform="translate(${x} ${y})">
    <ellipse cx="${w / 2}" cy="${h + 4}" rx="${w * .55}" ry="6" fill="#000" opacity=".08"/>
    <rect y="${h * .28}" width="${w}" height="${h * .72}" rx="5" fill="${cor}"/>
    <rect x="-4" y="${h * .16}" width="${w + 8}" height="${h * .18}" rx="4" fill="${cor}" style="filter:brightness(1.12)"/>
    <rect x="${w / 2 - 5}" y="${h * .16}" width="10" height="${h * .84}" fill="${fita}"/>
    <path d="M${w / 2} ${h * .16} C${w / 2 - 26} ${h * .16 - 22} ${w / 2 - 30} ${h * .16 + 4} ${w / 2} ${h * .16}Z M${w / 2} ${h * .16} C${w / 2 + 26} ${h * .16 - 22} ${w / 2 + 30} ${h * .16 + 4} ${w / 2} ${h * .16}Z" fill="${fita}"/>
  </g>`;
const presentes = `<svg viewBox="0 0 360 170" role="img" aria-label="Quatro presentes">
  ${caixa(40, 52, 92, 96, '#1F2A6B', '#E9B23A')}
  ${caixa(130, 22, 100, 126, '#F7738A', '#FFD84D')}
  ${caixa(232, 70, 66, 78, '#B79BEA', '#E9B23A')}
  ${caixa(286, 96, 56, 56, '#6CC7A8', '#FFD84D')}
  <path d="M20 40 l3 7 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1Z" fill="#FFD84D"/>
  <path d="M330 30 l2 5 5 .7 -3.6 3.4 .9 4.9 -4.3 -2.3 -4.3 2.3 .9 -4.9 -3.6 -3.4 5 -.7Z" fill="#FFD84D"/>
</svg>`;
const bonus = [
  ['bonus-1', 'Jogo da memória da Chupi', '12 pares de cartas ilustradas para imprimir e brincar juntos, conversando sobre a despedida.'],
  ['bonus-2', 'Livro de colorir Tchau Chupeta', '8 desenhos para pintar enquanto o dia do tchau se aproxima.'],
  ['bonus-3', 'Kit festa do tchau', 'Bandeirinhas “TCHAU CHUPETA”, coroa “Eu já sou grande!” e medalhas de coragem.'],
  ['bonus-4', 'O que dizer nos dias seguintes', 'Frases prontas para acolher seu filho quando ele pedir a chupeta, sem voltar atrás.'],
];
// Valores reais de cada item (os bônus estão à venda separadamente na Kiwify por R$ 29,90 cada).
const valores = [
  ['Tchau Chupeta: historinhas + passo a passo', '29,90'],
  ['Bônus 1: Jogo da memória da Chupi', '29,90'],
  ['Bônus 2: Livro de colorir', '29,90'],
  ['Bônus 3: Kit festa do tchau', '29,90'],
  ['Bônus 4: O que dizer nos dias seguintes', '29,90'],
];
const valorTotal = valores.reduce((t, [, v]) => t + Number(v.replace(',', '.')), 0).toFixed(2).replace('.', ',');
const prox = (texto, alvo, extra = '') =>
  `<a class="btn ${extra}" href="${alvo}"><span class="cur" aria-hidden="true">👆</span>${texto}</a>`;
// Botão de compra no meio da página: leva ao quadro do preço (o checkout fica só no preço).
const irPreco = (texto, extra = '') => `<a class="btn compra ${extra}" href="#preco">${texto} <span aria-hidden="true">→</span></a>`;
const ctaCheckout = (texto, extra = '') =>
  `<a class="btn compra ${extra}" href="${esc(OFERTA.checkout)}" data-checkout>${texto} <span aria-hidden="true">→</span></a>`;

const ic = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20s-7-4.4-9-8.8C1.6 8 3.6 4.8 6.8 4.8c2 0 3.6 1.2 5.2 3 1.6-1.8 3.2-3 5.2-3 3.2 0 5.2 3.2 3.8 6.4C19 15.6 12 20 12 20z"/></svg>',
  smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.4 2.4 2 4 2s3-.6 4-2"/><circle cx="9" cy="9.5" r=".6" fill="currentColor"/><circle cx="15" cy="9.5" r=".6" fill="currentColor"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/></svg>',
};

const beneficios = [
  [ic.heart, K.yellow, 'Sem improviso', 'você sabe o que fazer e o que dizer em cada momento.'],
  [ic.smile, K.lilac, 'Seu filho participa', 'e lida com a mudança com mais segurança.'],
  [ic.house, K.mint, 'Família no mesmo combinado', 'todo mundo falando a mesma língua com a criança.'],
  [ic.star, K.pink, 'No tempo dele', 'um processo leve, que respeita o ritmo de cada criança.'],
];

// O mecanismo único: Despedida Participativa
const pilares = [
  [ic.heart, '1. Preparar', 'A mudança deixa de ser surpresa. Seu filho entende, aos poucos, que a chupeta vai se despedir.'],
  [ic.smile, '2. Participar', 'Em vez de perder a chupeta, ele participa do tchau e se sente grande por isso.'],
  [ic.house, '3. Acolher', 'Os dias seguintes já têm um plano, para você acolher sem precisar voltar atrás.'],
];

// Mini ilustrações (SVG 64x64) para cada frase da promessa.
const iluImagine = {
  orgulho: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="#FFF4C7"/>
    <path d="M14 64 C14 48 22 42 32 42 C42 42 50 48 50 64Z" fill="${C.mint}"/>
    <circle cx="32" cy="30" r="13" fill="${C.skin}"/>
    <path d="M19 28 C18 14 46 12 46 27 C42 22 36 20 32 23 C28 19 22 20 19 28Z" fill="${C.hair}"/>
    <path d="M26 30 q2 -3 4 0 M34 30 q2 -3 4 0 M27 35 q5 5 10 0" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M48 6 l2.5 5 5.5 .8 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.8Z" fill="${C.sun}"/>
    <path d="M10 14 l1.5 3 3 .5 -2.2 2 .5 3 -2.8 -1.5 -2.8 1.5 .5 -3 -2.2 -2 3 -.5Z" fill="${C.sun}"/>
  </svg>`,
  plano: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="#EFE6FB"/>
    <rect x="17" y="12" width="30" height="40" rx="5" fill="#fff" stroke="${C.lavenderDeep}" stroke-width="2.5"/>
    <rect x="25" y="8" width="14" height="8" rx="3" fill="${C.lavenderDeep}"/>
    <path d="M22 24 l3 3 5 -6 M22 34 l3 3 5 -6 M22 44 l3 3 5 -6" stroke="#5DB896" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M33 25h9 M33 35h9 M33 45h7" stroke="${C.lavender}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  familia: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="#E6F6EF"/>
    <path d="M18 8 h28 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-12 l-5 5 v-5 h-11 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6Z" fill="#fff" stroke="${C.mint}" stroke-width="2"/>
    <path d="M23 17 h18" stroke="${C.lavenderDeep}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="42" r="7" fill="${C.skin}"/><path d="M9 41 C9 33 23 33 23 41 C20 38 12 38 9 41Z" fill="${C.hair2}"/><path d="M6 60 C6 51 26 51 26 60Z" fill="${C.lavenderDeep}"/>
    <circle cx="32" cy="44" r="7" fill="${C.skin}"/><path d="M25 43 C25 35 39 35 39 43 C36 39 28 39 25 43Z" fill="#D9D9E3"/><path d="M22 62 C22 53 42 53 42 62Z" fill="${C.peachDeep}"/>
    <circle cx="48" cy="42" r="7" fill="${C.skin2}"/><path d="M41 41 C41 33 55 33 55 41 C52 37 44 37 41 41Z" fill="${C.hair}"/><path d="M38 60 C38 51 58 51 58 60Z" fill="${C.mint}"/>
  </svg>`,
  lembranca: `<svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="#FFEDE4"/>
    <rect x="13" y="14" width="38" height="34" rx="4" fill="#fff" stroke="${C.peachDeep}" stroke-width="2.5" transform="rotate(-6 32 31)"/>
    <g transform="rotate(-6 32 31)">
      <path d="M22 30 C22 25 26 24 30 26 C34 24 38 25 38 30 C38 35 34 36 30 34 C26 36 22 35 22 30Z" fill="${C.peach}"/>
      <circle cx="30" cy="40" r="4" fill="none" stroke="${C.lavenderDeep}" stroke-width="2"/>
      <path d="M38 27 q4 -3 4 -8" stroke="${C.peach}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M44 48 C44 44 47 43 50 45 C53 43 56 44 56 48 C56 52 50 56 50 56 C50 56 44 52 44 48Z" fill="${C.peachDeep}"/>
  </svg>`,
};
const imagine = [
  ['orgulho', 'Seu filho contando, todo orgulhoso, que deu tchau para a chupeta.'],
  ['plano', 'Você sabendo exatamente o que fazer, sem depender de conselhos que se contradizem.'],
  ['familia', 'Pai, avós e babá falando a mesma coisa, sem ninguém “devolver escondido”.'],
  ['lembranca', 'Uma despedida que vira lembrança bonita, e não uma briga.'],
];

const faq = [
  ['Meu filho é muito apegado. Serve para ele?', 'Sim. A Despedida Participativa começa preparando a criança, justamente porque os mais apegados são os que mais sentem quando a chupeta some de repente. Tudo respeita o tempo de cada criança.'],
  ['Como recebo o acesso?', 'Assim que o pagamento é aprovado, você recebe o acesso no seu e-mail e pode começar no mesmo dia, pelo celular ou computador.'],
  ['Qual a idade certa para tirar a chupeta?', 'Não existe uma data igual para todas as crianças. Em caso de dúvida sobre saúde bucal ou desenvolvimento, converse com o pediatra ou odontopediatra. O Tchau Chupeta ajuda no <i>como</i> fazer quando a família decidir.'],
  ['E se eu não gostar?', `Você tem ${OFERTA.garantiaDias} dias de garantia. Se não for para a sua família, peça o reembolso e receba 100% do valor de volta, sem perguntas.`],
];

const bonusHtml = OFERTA.bonus.length
  ? OFERTA.bonus.map((b) => `<li>🎁 <b>Bônus: ${esc(b.titulo)}</b> — ${esc(b.texto)}</li>`).join('')
  : '';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tchau Chupeta — Seu filho ainda chupa chupeta?</title>
<meta name="description" content="Você não está sozinha. Conheça a Despedida Participativa do método Tchau Chupeta: a chupeta não some, ela se despede, no tempo do seu filho.">
<meta property="og:title" content="Seu filho(a) ainda chupa chupeta?">
<meta property="og:description" content="Chegou o método Tchau Chupeta: a chupeta não some, ela se despede. No tempo do seu filho.">
<meta property="og:image" content="https://tchauchupeta.vercel.app/d/crianca.jpg">
<meta name="theme-color" content="${K.navy}">
<link rel="preload" href="../fonts/Baloo2-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="../fonts/Nunito-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="crianca.avif" as="image" type="image/avif" fetchpriority="high">
<style>
@font-face{font-family:'Baloo 2',system-ui,sans-serif;font-weight:400 800;font-display:optional;src:url(../fonts/Baloo2-latin.woff2) format('woff2')}
@font-face{font-family:'Nunito';font-weight:200 1000;font-display:optional;src:url(../fonts/Nunito-latin.woff2) format('woff2')}
:root{--navy:${K.navy};--navy-deep:${K.navyDeep};--purple:${K.purple};--purple-soft:${K.purpleSoft};--yellow:${K.yellow};--yellow-soft:${K.yellowSoft};
  --pink:${K.pink};--mint:${K.mint};--lilac:${K.lilac};--cream:${K.cream};--ink:${K.ink};--ink-soft:${K.inkSoft};--r:24px}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',system-ui,sans-serif;font-size:18px;line-height:1.55;color:var(--ink);background:var(--cream);-webkit-font-smoothing:antialiased;overflow-x:hidden}
svg{max-width:100%;height:auto;display:block}
img{max-width:100%;display:block}
h1,h2,h3{font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;line-height:1.05;letter-spacing:-.01em}
h2{font-size:clamp(30px,4.6vw,44px);margin-bottom:14px}
h3{font-size:21px;line-height:1.2}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.narrow{max-width:720px;margin:0 auto;padding:0 20px}
section{padding:72px 0}
.center{text-align:center}
.mt{background:linear-gradient(transparent 52%,var(--yellow) 52%,var(--yellow) 90%,transparent 90%);padding:0 6px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.acao{margin-top:34px;text-align:center}
.hero .cta-topo{margin-top:22px;text-align:left}
@media(max-width:860px){.hero .cta-topo{text-align:center}}

/* botões em pílula amarela, como na referência */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:21px;letter-spacing:.01em;
  color:var(--navy);background:var(--yellow);padding:16px 34px;border-radius:999px;text-decoration:none;text-transform:uppercase;
  box-shadow:0 6px 0 #E0B21E,0 14px 30px rgba(31,42,107,.18);transition:transform .15s,box-shadow .15s;text-align:center}
.btn:hover{transform:translateY(-2px)}
.btn:active{transform:translateY(4px);box-shadow:0 2px 0 #E0B21E}
.btn .cur{font-size:20px}
.btn.compra{background:var(--pink);color:#fff;box-shadow:0 6px 0 #D2556C,0 14px 30px rgba(247,115,138,.35)}
.btn.compra:active{box-shadow:0 2px 0 #D2556C}
.btn.full{width:100%}
.btn.pulse{animation:pulse 2.4s infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
.selos{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:center;margin-top:16px;font-size:14px;font-weight:700;opacity:.8}

/* pincelada azul, como a faixa "Chegou o método" */
.pincel{position:relative;display:inline-block;color:#fff;padding:14px 34px 18px;transform:rotate(-3deg)}
.pincel::before{content:'';position:absolute;inset:0;background:var(--navy);z-index:-1;
  clip-path:polygon(2% 14%,10% 4%,30% 9%,52% 2%,74% 8%,94% 3%,99% 22%,97% 48%,100% 76%,92% 96%,70% 90%,48% 98%,26% 91%,6% 97%,0% 74%,3% 46%)}
.pincel b{color:var(--yellow)}
.risquinhos{display:inline-block;color:var(--yellow);font-weight:900;font-size:.8em;transform:translateY(-.1em)}

/* hero */
.hero{position:relative;background:linear-gradient(180deg,#FFF6E9 0%,#FDEFF6 100%);overflow:hidden}
.hero .grid{display:grid;grid-template-columns:1fr;align-items:center;min-height:620px}
.hero .txt{max-width:56%}
.hero .txt{padding:56px 0 56px;position:relative;z-index:2}
.hero h1{font-size:clamp(40px,6.4vw,78px);transform:rotate(-3deg);transform-origin:left;margin-bottom:22px}
.hero h1 .l1{display:block;font-size:.55em;color:var(--navy)}
.hero h1 .l2{display:inline-block;color:var(--navy);background:linear-gradient(transparent 40%,var(--yellow) 40%,var(--yellow) 88%,transparent 88%);padding:0 8px}
.hero h1 .l3{display:block;color:var(--purple)}
.hero .sozinha{font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:26px;line-height:1.15;transform:rotate(-2deg);transform-origin:left}
.hero .sozinha span{display:block;font-family:'Nunito';font-weight:600;font-size:19px;color:var(--ink-soft);margin-top:6px;line-height:1.45}
.hero .sozinha mark{background:linear-gradient(transparent 45%,var(--yellow) 45%);color:var(--navy);font-weight:800;padding:0 4px}
.hero .foto{position:absolute;top:0;right:0;bottom:0;width:46%}
.hero .foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%;background:#E9DCCB url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAD7wP8AAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb//gAQTGF2YzYwLjMxLjEwMgD/2wBDAAgUFBcUFxsbGxsbGyAeICEhISAgICAhISEkJCQqKiokJCQhISQkKCgqKi4vLisrKisvLzIyMjw8OTlGRkhWVmf/xABxAAEAAwEBAQEAAAAAAAAAAAAGBwUEAwIACAEBAQEAAAAAAAAAAAAAAAAAAwUEEAACAgECAgoDAQEAAAAAAAACAQADESEEEiIVYXGxUUFS0TEFM6HBkRMRAAMBAQEBAQAAAAAAAAAAAAABEQJBMSFh/8AAEQgAJgAYAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8AeCiEiP05kdbrfb8T4hNpdmkfXWYaEk+fVLDxjrme4AxzSXWiyspgkPu7WOLhTx5qdumQ9D/2A9yh4iS0xD+ka0FqH6jtLjbLGcQpZWdvMyJY8HEdrIU+F4yvh+TlBQNpJi9Nfn2guc9KCk/CL/sAQEify9HjvhTNfXJov+trtLnMn2St6Ho9R/r2iLwx6+sY7g2pwtVwnWNZoRxr4ufbn+rvm+z8g9kDI2+GOw8FxY1Uy/8AZz1b5ysiBn//2Q==) 50% 30%/cover no-repeat;
  -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 28%);mask-image:linear-gradient(90deg,transparent 0%,#000 28%)}
.sticker{position:absolute;right:24px;bottom:34px;background:var(--yellow);color:var(--navy);font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:24px;line-height:1.05;
  padding:16px 20px;transform:rotate(-6deg);box-shadow:0 10px 26px rgba(31,42,107,.18);text-align:center;
  clip-path:polygon(3% 6%,96% 0,100% 90%,6% 100%)}
.nope{position:absolute;top:30px;right:30px;width:84px;height:84px;border-radius:50%;border:7px solid var(--pink);background:rgba(255,255,255,.85);display:grid;place-content:center;z-index:2}
.nope::after{content:'';position:absolute;left:50%;top:50%;width:84%;height:7px;background:var(--pink);transform:translate(-50%,-50%) rotate(-45deg);border-radius:4px}
.nope svg{width:50px}

/* benefícios */
.bens{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 30px;margin-top:30px}
.ben{display:flex;gap:18px;align-items:center;background:#fff;border-radius:var(--r);padding:20px 22px;box-shadow:0 8px 30px rgba(31,42,107,.06)}
.ben .bola{flex:0 0 66px;height:66px;border-radius:50%;display:grid;place-content:center;color:#fff}
.ben .bola svg{width:34px}
.ben h3{color:var(--navy)}
.ben p{color:var(--ink-soft);font-size:17px}

/* chegou o método */
.metodo{background:radial-gradient(ellipse at 50% 0%,#FFF6E9,var(--cream))}
.metodo h2{font-size:clamp(34px,5.4vw,56px)}
.metodo .sub{font-size:20px;max-width:620px;margin:22px auto 0}

/* some × se despede */
.vs{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:860px;margin:34px auto 0}
.vs div{border-radius:var(--r);padding:24px 24px 22px;text-align:left}
.vs span{display:block;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:21px;margin-bottom:6px}
.vs .ruim{background:#F3EEF2;color:#7A7393}
.vs .bom{background:#fff;box-shadow:0 0 0 3px var(--mint),0 16px 40px rgba(108,199,168,.22)}
.vs .bom span{color:var(--navy)}
.vs .cena svg{display:block;width:100%;height:auto;border-radius:16px;margin-bottom:14px}

/* imagine */
.imagine{list-style:none;max-width:640px;margin:26px auto 0}
.imagine li{position:relative;display:flex;align-items:center;gap:16px;background:#fff;border-radius:18px;padding:14px 20px 14px 14px;margin-top:12px;box-shadow:0 6px 22px rgba(31,42,107,.06);font-weight:600}
.imagine .mini{flex:0 0 64px;width:64px;height:64px}
.imagine .mini svg{display:block;width:100%;height:100%}

/* emblema da oferta */
.emblema{display:flex;align-items:center;gap:16px;justify-content:center;margin:18px 0 8px}
.emblema .ch{width:84px;flex:0 0 84px}
.emblema b{display:block;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:30px;line-height:.95;color:var(--navy)}
.emblema b em{font-style:normal;color:var(--purple)}
.emblema small{display:block;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);margin-top:4px}

/* o que você recebe (faixa azul com ícones, como o rodapé da referência) */
.recebe{background:var(--navy);color:#fff;position:relative;overflow:hidden}
.bonus{background:#FFF7EE}
.bonus .presentes{max-width:380px;margin:10px auto 0}
.bonus .presentes svg{display:block;width:100%;height:auto}
.bonus .bgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:900px;margin:22px auto 0}
.bonus .bcard{display:flex;gap:16px;align-items:center;background:#fff;border-radius:var(--r);padding:16px;box-shadow:0 10px 26px rgba(31,42,107,.08);text-align:left}
.bonus .bcard img{flex:0 0 96px;width:96px;height:auto;border-radius:8px;box-shadow:0 6px 14px rgba(31,42,107,.18)}
.bonus .tag{display:inline-block;background:var(--navy);color:#fff;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:3px 12px;border-radius:6px}
.bonus h3{font-size:20px;color:var(--navy);margin:6px 0 4px}
.bonus .bcard p{font-size:15px;color:var(--ink-soft);line-height:1.4}
@media(max-width:860px){.bonus .bgrid{grid-template-columns:1fr}}
.noite{background:linear-gradient(180deg,#F3EEF8,#FFFBF4)}
.noite .lados{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:960px;margin:32px auto 0}
.noite .lado{border-radius:var(--r);padding:24px 22px;text-align:left}
.noite .sem{background:#2A2556;color:#D9D4F0}
.noite .com{background:#fff;box-shadow:0 0 0 3px var(--mint),0 16px 40px rgba(108,199,168,.22)}
.noite .topo{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.noite .topo svg{display:block}
.noite .sem h3{color:#fff;font-size:24px}
.noite .com h3{color:var(--navy);font-size:24px}
.noite .linha{list-style:none;padding:0;margin:0;position:relative}
.noite .linha::before{content:'';position:absolute;left:8px;top:6px;bottom:6px;width:2px;background:currentColor;opacity:.25}
.noite .linha li{position:relative;padding:0 0 14px 30px;line-height:1.45}
.noite .linha li::before{content:'';position:absolute;left:3px;top:6px;width:12px;height:12px;border-radius:50%}
.noite .sem li::before{background:#F7738A}
.noite .com li::before{background:var(--mint)}
.noite .linha b{display:block;font-family:'Baloo 2',system-ui,sans-serif;font-size:18px}
.noite .sem b{color:#FFB3C0}
.noite .com b{color:var(--purple)}
.noite .com li{color:var(--ink-soft)}
.noite .fecho{max-width:640px;margin:26px auto 0;text-align:center;font-size:19px}
@media(max-width:860px){.noite .lados{grid-template-columns:1fr}}
.riscos{background:#FFF7EE}
.riscos .rgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px}
.riscos .rcard{background:#fff;border-radius:var(--r);padding:22px 20px;box-shadow:0 10px 26px rgba(31,42,107,.08);text-align:left}
.riscos .ico{font-size:34px;display:block;margin-bottom:6px}
.riscos h3{color:var(--navy);margin-bottom:4px}
.riscos .rcard p{color:var(--ink-soft);font-size:16px}
.riscos .fonte{max-width:680px;margin:22px auto 0;text-align:center;font-size:14px;color:var(--ink-soft)}
.dentro .mock{width:100%;max-width:760px;height:auto;margin:0 auto;display:block;border-radius:24px}
.dentro .kitlista{list-style:none;padding:0;max-width:760px;margin:18px auto 0;display:grid;gap:12px}
.dentro .kitlista li{background:#fff;border-radius:16px;padding:14px 18px;box-shadow:0 6px 18px rgba(31,42,107,.07);color:var(--ink-soft)}
.dentro .kitlista b{display:block;color:var(--navy);font-size:18px;margin-bottom:2px}
.boxoferta{width:100%;height:auto;border-radius:18px;margin-bottom:10px}
@media(max-width:860px){.riscos .rgrid{grid-template-columns:1fr 1fr}}
.dentro{background:linear-gradient(180deg,var(--cream),#FFF4E4)}
.dentro .momentos{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:32px}
.dentro .momentos figure{margin:0}
.dentro .momentos img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:18px;box-shadow:0 10px 24px rgba(31,42,107,.14)}
.dentro .momentos figcaption{font-weight:800;color:var(--navy);margin-top:8px;text-align:center;font-size:16px}
.dentro .ilustr{font-size:12px;color:var(--ink-soft);opacity:.7;text-align:right;margin-top:6px}
.dentro .formato{margin:30px auto 0;max-width:640px;text-align:center;font-weight:700;background:#fff;border-radius:16px;padding:14px 18px;box-shadow:0 6px 18px rgba(31,42,107,.08)}
@media(max-width:860px){.dentro .momentos{grid-template-columns:1fr 1fr}}
.recebe .kick{color:var(--yellow)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:30px}
.card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:var(--r);padding:26px 22px}
.card .ico{width:64px;height:64px;border-radius:50%;border:2px solid rgba(255,255,255,.6);display:grid;place-content:center;margin-bottom:14px}
.card .ico svg{width:32px}
.card h3{margin-bottom:6px}
.card p{opacity:.85;font-size:17px}
.kick{display:inline-block;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--purple);margin-bottom:10px}

/* oferta */
.oferta{background:linear-gradient(180deg,#FDEFF6,#FFF6E9)}
.box{background:#fff;border-radius:30px;max-width:560px;margin:10px auto 0;padding:10px 26px 30px;box-shadow:0 30px 70px rgba(31,42,107,.18);border:3px solid var(--yellow)}
.box ul{list-style:none;margin:4px 0 20px}
.box li{padding:9px 0 9px 32px;position:relative;border-bottom:1px dashed rgba(31,42,107,.14)}
.box li::before{content:'✓';position:absolute;left:4px;top:8px;width:20px;height:20px;border-radius:50%;background:var(--mint);color:#fff;font-size:12px;font-weight:900;display:grid;place-content:center}
.preco{scroll-margin-top:28vh;text-align:center;margin-bottom:18px}
.preco .de{text-decoration:line-through;opacity:.55;font-weight:700}
.preco .valores{list-style:none;padding:0;margin:4px 0 10px;text-align:left;font-size:15px}
.preco .valores li{display:flex;justify-content:space-between;gap:10px;padding:7px 2px !important;border-bottom:1px dashed rgba(31,42,107,.14);color:var(--ink-soft)}
.preco .valores li::before{content:none !important}
.preco .valores b{white-space:nowrap;color:var(--ink-soft);text-decoration:line-through;opacity:.8}
.preco .total{font-size:18px;font-weight:800;color:var(--navy);margin-top:6px}
.preco .total .de{font-size:20px}
.preco .ancora{font-size:19px;color:var(--ink-soft);margin-bottom:4px}
.preco .por{font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:66px;line-height:1;color:var(--purple)}
.preco .por small{font-size:28px;color:var(--navy)}
.preco .parc{font-weight:700;color:var(--ink-soft)}
.box ul.selos{margin:14px 0 0}
.box .selos li{padding:0;border:0}
.box .selos li::before{display:none}
.gar{display:flex;gap:14px;align-items:center;margin-top:20px;background:var(--yellow-soft);border-radius:16px;padding:14px 16px;font-size:15px}
.gar .s{flex:0 0 56px;height:56px;border-radius:50%;background:var(--yellow);display:grid;place-content:center;font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:24px;color:var(--navy)}

/* faq */
details{background:#fff;border-radius:18px;margin-top:12px;box-shadow:0 4px 18px rgba(31,42,107,.06)}
summary{list-style:none;cursor:pointer;padding:18px 54px 18px 22px;font-weight:800;position:relative}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';position:absolute;right:20px;top:50%;transform:translateY(-50%);font-family:'Baloo 2',system-ui,sans-serif;font-size:28px;color:var(--purple);transition:transform .2s}
details[open] summary::after{transform:translateY(-50%) rotate(45deg)}
details p{padding:0 22px 20px;color:var(--ink-soft)}

/* final */
.final{background:var(--navy);color:#fff;text-align:center;position:relative;overflow:hidden}
.final h2{max-width:680px;margin:0 auto}
.final h2 b{color:var(--yellow)}
.final .selos{color:#fff}
footer{background:var(--navy-deep);color:rgba(255,255,255,.6);font-size:13px;text-align:center;padding:30px 20px 30px}
footer p+p{margin-top:8px}
.star{position:absolute;opacity:.9}


.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.vis{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}

@media(max-width:860px){
  body{font-size:17px}
  section{padding:56px 0}
  .hero{display:flex;flex-direction:column}
  .hero .grid{grid-template-columns:1fr;min-height:0;width:100%}
  .hero .foto{position:relative;order:-1;width:100%;height:380px}
  .hero .foto img{object-position:50% 55%;background-position:50% 55%;-webkit-mask-image:linear-gradient(180deg,#000 78%,transparent 100%);mask-image:linear-gradient(180deg,#000 78%,transparent 100%)}
  .hero .txt{max-width:none;padding:4px 0 46px}
  .sticker{font-size:17px;right:14px;bottom:auto;top:18px;left:auto;padding:10px 12px}
  .nope{right:auto;left:16px}
  .nope{width:62px;height:62px;border-width:5px;top:16px;right:16px}
  .nope svg{width:36px}
  .bens,.cards,.vs{grid-template-columns:1fr}
  .btn{font-size:18px;padding:15px 22px;width:100%}
}
</style>
${pixelTag('pagina-d')}
</head>
<body>

<!-- 1. HERO: foto real + pergunta direta + "você não está sozinha" -->
<header class="hero" id="topo">
  <div class="wrap grid">
    <div class="txt">
      <h1><span class="l1">Seu filho(a) ainda</span><span class="l2">chupa</span><span class="l3">Chupeta?</span></h1>
      <p class="sozinha">Você não está sozinha!
        <span>Muitas mães passam por isso e se sentem frustradas, mas <mark>existe um caminho carinhoso!</mark></span></p>
      <div class="acao cta-topo">${irPreco('Quero o Tchau Chupeta', 'pulse')}</div>
    </div>
  </div>
  <div class="foto">
    <picture><source srcset="crianca.avif" type="image/avif"><source srcset="crianca.webp" type="image/webp"><img src="crianca.jpg" alt="Criança pequena com chupeta abraçada a um ursinho de pelúcia" width="424" height="680" fetchpriority="high"></picture>
    <span class="nope" aria-hidden="true">${pacifier({ size: 50 })}</span>
    <span class="sticker">Mais sorrisos,<br>menos briga<br>pela chupeta! 💛</span>
  </div>
</header>

<!-- 2. BENEFÍCIOS com ícones redondos -->
<section id="beneficios">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">O que o Tchau Chupeta faz por vocês</span>
      <h2>Uma despedida <span class="mt">carinhosa</span>, no tempo do seu filho</h2>
    </div>
    <div class="bens">
      ${beneficios.map(([i, cor, t, d]) => `<div class="ben reveal"><span class="bola" style="background:${cor}">${i}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- 2b. POR QUE NÃO ADIAR: o que o uso prolongado pode causar (sem alarmismo) -->
<section class="riscos" id="riscos">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">Por que não adiar</span>
      <h2>O que a chupeta por <span class="mt">tempo demais</span> pode causar</h2>
      <p>Não é para assustar. É para mostrar por que vale a pena começar agora, com carinho e do jeito certo.</p>
    </div>
    <div class="rgrid">
      ${riscos.map(([i, t, d]) => `<div class="rcard reveal"><span class="ico" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n      ')}
    </div>
    <p class="fonte reveal">Pediatras e odontopediatras costumam recomendar deixar a chupeta por volta dos 2 a 3 anos. Em caso de dúvida, converse com o pediatra do seu filho.</p>
  </div>
</section>

<!-- 2c. A NOITE DO TCHAU: sem método × com o Tchau Chupeta -->
<section class="noite" id="noite">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">Duas noites bem diferentes</span>
      <h2>Como é a noite do tchau <span class="mt">sem um método</span>… e com o Tchau Chupeta</h2>
    </div>
    <div class="lados">
      <div class="lado sem reveal">
        <div class="topo"><span class="ilu" aria-hidden="true">${pacifier({ size: 70, mood: 'sad' })}</span><h3>Sem um método</h3></div>
        <ol class="linha">
          ${semMetodo.map(([h, t]) => `<li><b>${h}</b>${t}</li>`).join('\n          ')}
        </ol>
      </div>
      <div class="lado com reveal">
        <div class="topo"><span class="ilu" aria-hidden="true">${pacifier({ size: 70, wave: true })}</span><h3>Com o Tchau Chupeta</h3></div>
        <ol class="linha">
          ${comMetodo.map(([h, t]) => `<li><b>${h}</b>${t}</li>`).join('\n          ')}
        </ol>
      </div>
    </div>
    <p class="fecho reveal">A diferença não está na força de vontade. Está em <b>preparar a criança antes</b> e deixar ela participar.</p>
    <div class="acao reveal">${irPreco('Quero preparar meu filho')}</div>
  </div>
</section>

<!-- 3. CHEGOU O MÉTODO (grande ideia: a chupeta não some, ela se despede) -->
<section class="metodo" id="metodo">
  <div class="narrow center">
    <h2 class="reveal"><span class="pincel">Chegou o método <b>Tchau Chupeta!</b></span></h2>
    <p class="sub reveal">A diferença está em um detalhe que quase ninguém percebe: <b>a chupeta não precisa sumir. Ela pode se despedir.</b></p>
  </div>
  <div class="wrap">
    <div class="vs">
      <div class="ruim reveal"><div class="cena">${cenaSem}</div><span>❌ Quando a chupeta some</span>A criança não entende o que aconteceu, sente a perda… e começa o ciclo “tira, chora, devolve”.</div>
      <div class="bom reveal"><div class="cena">${cenaCom}</div><span>✅ Quando a criança se despede</span>Ela entende o que está acontecendo, participa do tchau e se sente grande por isso.</div>
    </div>
  </div>
</section>

<!-- 4. O MECANISMO ÚNICO: Despedida Participativa -->
<section class="recebe" id="mecanismo">
  <span class="star" style="top:12%;left:6%">${star(22, K.yellow)}</span>
  <span class="star" style="bottom:14%;right:7%">${star(18, K.yellow)}</span>
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">O segredo do método</span>
      <h2>A Despedida Participativa</h2>
      <p style="opacity:.9">Em vez de tirar a chupeta da criança, você conduz seu filho para que <b>ele mesmo</b> se despeça dela, em 3 movimentos:</p>
    </div>
    <div class="cards">
      ${pilares.map(([i, t, d]) => `<div class="card reveal"><span class="ico">${i}</span><h3>${t}</h3><p>${d}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- 4b. VEJA POR DENTRO: um gostinho do entregável -->
<section class="dentro" id="por-dentro">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">Veja por dentro</span>
      <h2>Um gostinho do que você <span class="mt">recebe</span></h2>
      <p>Histórias e brincadeiras para fazer junto com seu filho. Ele pinta, desenha, escuta e participa, e o tchau vira um momento gostoso para vocês dois.</p>
    </div>
    <div class="momentos reveal">
      ${momentos.map(([arq, leg, alt]) => `<figure><img src="dentro/${arq}.webp" alt="${alt}" width="640" height="427" loading="lazy" decoding="async"><figcaption>${leg}</figcaption></figure>`).join('\n      ')}
    </div>
    <p class="ilustr">Fotos ilustrativas.</p>
    <div class="kit reveal">
      <img class="mock" src="dentro/box.webp" alt="Livro de historinhas Tchau Chupeta com as folhas de atividades e o guia no tablet" width="1000" height="860" loading="lazy" decoding="async">
      <ul class="kitlista">
        <li><b>📖 5 historinhas ilustradas + 1 para personalizar</b> A Chupi que vai morar na Lua, a Fada Pipoca, o ursinho Bento e outras histórias que preparam seu filho para o tchau.</li>
        <li><b>✂️ Brincadeiras para imprimir</b> Calendário do tchau para pintar, bilhetes mágicos, cartinha para a chupeta, desenho da despedida e certificado.</li>
        <li><b>📲 Guia para os pais</b> Como usar cada história e o que fazer em cada fase, do primeiro aviso ao dia do tchau.</li>
      </ul>
    </div>
    <p class="formato reveal">📲 Material digital ilustrado. Você recebe no e-mail, lê no celular e imprime as brincadeiras em casa.</p>
    <div class="acao reveal">${irPreco('Quero o Tchau Chupeta')}</div>
  </div>
</section>

<!-- 5. A PROMESSA (futuro desejado) -->
<section id="promessa">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">A promessa</span>
      <h2>Imagine daqui a algumas semanas…</h2>
    </div>
    <ul class="imagine">
      ${imagine.map(([k, t]) => `<li class="reveal"><span class="mini">${iluImagine[k]}</span><span>${t}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<!-- 5b. BÔNUS -->
<section class="bonus" id="bonus">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kick">E tem mais</span>
      <h2>Você também vai receber <span class="mt">4 bônus</span></h2>
      <div class="presentes">${presentes}</div>
    </div>
    <div class="bgrid">
      ${bonus.map(([img, t, d], i) => `<div class="bcard reveal"><img src="dentro/${img}.webp" alt="Capa do bônus ${t}" width="496" height="702" loading="lazy" decoding="async"><div><span class="tag">Bônus ${i + 1}</span><h3>${t}</h3><p>${d}</p></div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- 6. OFERTA -->
<section class="oferta" id="oferta">
  <div class="narrow center reveal">
    <span class="kick">Oferta especial</span>
    <h2>Comece hoje a <span class="mt">despedida da chupeta</span></h2>
  </div>
  <div class="wrap">
    <div class="box reveal">
      <img class="boxoferta" src="dentro/box.webp" alt="Tchau Chupeta: livro de historinhas e atividades" width="1000" height="860" loading="lazy" decoding="async">
      <ul>
        <li><b>5 historinhas ilustradas</b> para preparar seu filho para o tchau</li>
        <li><b>Brincadeiras para imprimir</b>: calendário do tchau, bilhetes mágicos, cartinha, desenho e certificado</li>
        <li><b>1 história para personalizar</b> com o nome e o desenho do seu filho</li>
        <li>O passo a passo da <b>Despedida Participativa</b>: o que fazer e o que dizer em cada momento</li>
        <li>A família inteira <b>no mesmo combinado</b></li>
        <li><b>+ 4 bônus</b>: jogo da memória, livro de colorir, kit festa do tchau e guia “o que dizer nos dias seguintes”</li>
        <li><b>Acesso imediato</b>, para começar hoje mesmo</li>
        ${bonusHtml}
      </ul>
      <div class="preco" id="preco">
        <ul class="valores">
          ${valores.map(([t, v]) => `<li><span>${t}</span><b>R$ ${v}</b></li>`).join('\n          ')}
        </ul>
        <div class="total">Valor total: <span class="de">R$ ${valorTotal}</span></div>
        <div class="ancora">Hoje, tudo isso por apenas</div>
        <div class="por"><small>R$</small> ${esc(OFERTA.preco)}</div>
        ${OFERTA.parcelas ? `<div class="parc">ou ${esc(OFERTA.parcelas)}</div>` : ''}
        <div class="parc">pagamento único</div>
      </div>
      ${ctaCheckout('Quero o Tchau Chupeta', 'full pulse')}
      <div class="gar"><span class="s">${OFERTA.garantiaDias}</span><div><b>${OFERTA.garantiaDias} dias de garantia.</b> Se não for para a sua família, você pede o reembolso e recebe 100% de volta.</div></div>
      <ul class="selos"><li>🔒 Compra segura</li><li>⚡ Acesso imediato</li></ul>
    </div>
  </div>
</section>

<!-- 7. DÚVIDAS -->
<section id="duvidas" style="padding-top:20px">
  <div class="narrow">
    <div class="center reveal"><span class="kick">Dúvidas frequentes</span><h2>Ficou alguma dúvida?</h2></div>
    ${faq.map(([p, r]) => `<details class="reveal"><summary>${p}</summary><p>${r}</p></details>`).join('\n    ')}
  </div>
</section>

<!-- 8. FECHAMENTO -->
<section class="final" id="final">
  <span class="star" style="top:14%;left:8%">${star(20, K.yellow)}</span>
  <span class="star" style="top:24%;right:10%">${star(14, K.yellow)}</span>
  <div class="narrow">
    <h2 class="reveal">Transforme a despedida da chupeta em <b>uma lembrança carinhosa</b> para vocês dois.</h2>
    <div class="acao reveal">
      <ul class="selos"><li>🔒 Compra segura</li><li>⚡ Acesso imediato</li><li>🛡️ Garantia de ${OFERTA.garantiaDias} dias</li></ul>
    </div>
  </div>
</section>

<footer>
  <p><b>Tchau Chupeta</b> © ${new Date().getFullYear()}. Todos os direitos reservados.</p>
  <p>Este material é educativo e não substitui a orientação de pediatras, odontopediatras ou outros profissionais de saúde. Cada criança tem seu próprio ritmo, e os resultados podem variar de família para família.</p>
</footer>


<script>
// Checkout: repassa UTMs e dispara InitiateCheckout
(function(){
  var q = location.search.slice(1);
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    if (q && a.href.indexOf('http') === 0) a.href += (a.href.indexOf('?') < 0 ? '?' : '&') + q;
    a.addEventListener('click', function(){ if (window.fbq) fbq('track', 'InitiateCheckout', { content_category: 'pagina-d', value: ${valor}, currency: 'BRL' }); });
  });
})();


// Revela as seções ao rolar
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function(e){ e.classList.add('vis'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function(e){ io.observe(e); });
})();
</script>
</body>
</html>
`;

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);

// Página principal: mesmo HTML com os caminhos ajustados para a raiz do site.
const principal = html
  .replaceAll('../fonts/', 'fonts/')
  .replaceAll('"crianca.jpg"', '"d/crianca.jpg"')
  .replaceAll('"crianca.avif"', '"d/crianca.avif"')
  .replaceAll('"crianca.webp"', '"d/crianca.webp"')
  .replaceAll('src="dentro/', 'src="d/dentro/');
writeFileSync(join(root, 'pagina-vendas', 'index.html'), principal);
console.log('ok → pagina-vendas/index.html (principal) e pagina-vendas/d/index.html');
