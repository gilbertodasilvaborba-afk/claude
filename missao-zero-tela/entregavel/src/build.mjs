// Entregáveis do Missão Zero Tela em PDF (A4 retrato).
// Uso: npm run build  →  gera em entregavel/:
//   missao-zero-tela-simples.pdf      20 missões + mini passaporte
//   missao-zero-tela-completo.pdf     100 missões + índices + 4 bônus
//   missao-zero-tela-completo-pb.pdf  a edição completa em preto e branco (economiza tinta)
// Opcional: node src/build.mjs html  →  só gera os HTML (para revisar no navegador)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import m1 from './missoes-1.mjs';
import m2 from './missoes-2.mjs';
import m3 from './missoes-3.mjs';
import { guiaBirra, desafio30, recompensas } from './bonus.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MISSOES = [...m1, ...m2, ...m3].sort((a, b) => a.n - b.n);
const SIMPLES_IDS = [1, 2, 4, 7, 12, 13, 16, 18, 35, 37, 40, 43, 48, 49, 58, 63, 69, 76, 77, 93];

// ------------------------------------------------------------------ dicionários
const MOMENTOS = {
  chuva: ['🌧️', 'Dia de chuva'], jantar: ['🍳', 'Enquanto faço o jantar'], cinco: ['⏱️', 'Só 5 minutos'],
  dormir: ['🌙', 'Antes de dormir'], espera: ['🍽️', 'Restaurante e espera'], viagem: ['🚗', 'Viagem de carro'],
};
const IDADES = { '3-4': ['3 a 4 anos', 'gold'], '5-6': ['5 a 6 anos', 'lav'], '7-8': ['7 a 8 anos', 'mint'] };
const HAB = {
  fina: ['Coordenação fina', 'fortalece mãos e dedos, a base para escrever, recortar e abotoar.'],
  motora: ['Coordenação motora', 'trabalha equilíbrio, força e a noção do próprio corpo no espaço.'],
  cria: ['Criatividade', 'estimula imaginar, inventar e resolver problemas de jeitos novos.'],
  ling: ['Linguagem', 'amplia o vocabulário e a confiança para contar ideias e sentimentos.'],
  rac: ['Raciocínio', 'exercita comparar, classificar, contar e planejar.'],
  auto: ['Autonomia', 'mostra para a criança que ela é capaz e pode ajudar em casa.'],
  emo: ['Emoções', 'ajuda a reconhecer o que sente e a aprender a se acalmar.'],
  aten: ['Atenção e memória', 'treina o foco, a espera da vez e a memória de sequências.'],
  vinc: ['Vínculo', 'é tempo de qualidade que fortalece a conexão com a família.'],
};
const BAGUNCA = { 1: 'Pouca', 2: 'Média', 3: 'Muita' };
const MODO = { J: ['👨‍👩‍👧', 'Juntos'], S: ['🧒', 'Sozinho'] };

// ------------------------------------------------------------------ utilidades
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (n) => String(n).padStart(2, '0');
const emo = (s, cls = '') => `<span class="emo ${cls}">${s}</span>`;
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

// ------------------------------------------------------------------ estilos
const CSS = `
@font-face{font-family:"Baloo 2";src:${font('Baloo2-latin.woff2')};font-weight:400 800}
@font-face{font-family:"Nunito";src:${font('Nunito-latin.woff2')};font-weight:200 1000}
@font-face{font-family:"Gochi Hand";src:${font('GochiHand-latin.woff2')}}
@page{size:A4;margin:0}
:root{
  --navy:#1E2B6F;--navy-soft:#4A5385;--purple:#6B3FB8;--yellow:#FFE45C;--cream:#FFFAF3;--lilac:#F3EEFC;--white:#fff;
  --gold:#FFC94A;--lav:#B9A2EE;--mint:#74CDB2;--coral:#FF7C8A;
  --gold-bg:#FFF4CF;--lav-bg:#EEE7FB;--mint-bg:#E2F6EF;--coral-bg:#FFE6E9;--line:#E4DCF6;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:"Nunito",sans-serif;color:var(--navy);font-size:11pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.emo{font-family:"Noto Color Emoji",sans-serif;font-weight:400;line-height:1}
h1,h2,h3,h4{font-family:"Baloo 2",sans-serif;line-height:1.12;font-weight:800}
.hand{font-family:"Gochi Hand",cursive;font-weight:400}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;background:var(--white);padding:14mm 14mm 16mm}
.foot{position:absolute;left:14mm;right:14mm;bottom:7mm;display:flex;justify-content:space-between;font-size:8pt;color:#8E93B5}
.pill{display:inline-flex;align-items:center;gap:1.5mm;border-radius:99px;padding:.8mm 3.2mm;font-weight:800;font-size:9pt;line-height:1.4}
.gold{background:var(--gold-bg)}.lav{background:var(--lav-bg)}.mint{background:var(--mint-bg)}.coral{background:var(--coral-bg)}
.gold-s{background:var(--gold)}.lav-s{background:var(--lav)}.mint-s{background:var(--mint)}.coral-s{background:var(--coral)}

/* capa */
.cover{background:radial-gradient(120% 80% at 80% 10%,#fff 0%,var(--cream) 45%,var(--lilac) 100%);padding:18mm 16mm;display:flex;flex-direction:column}
.logo{display:flex;align-items:center;gap:3mm;font-family:"Baloo 2";font-weight:800;font-size:15pt}
.zero{width:11mm;height:11mm;border-radius:50%;background:var(--purple);color:var(--yellow);display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:15pt;line-height:1;position:relative}
.zero:after{content:"";position:absolute;width:13mm;height:1.3mm;background:var(--coral);transform:rotate(-40deg);border-radius:1mm}
.cover .kick{font-size:20pt;margin-top:14mm;transform:rotate(-2deg);display:inline-block}
.cover h1{font-size:58pt;line-height:1;margin-top:2mm}
.cover h1 .l1{position:relative;display:inline-block;z-index:0}
.cover h1 .l1:before{content:"";position:absolute;left:-2mm;right:-3mm;top:40%;bottom:6%;background:var(--yellow);z-index:-1;border-radius:2mm;transform:rotate(-1.2deg)}
.cover h1 .l2{display:block;color:var(--purple)}
.cover .sub{font-size:15pt;font-weight:700;margin-top:5mm;max-width:150mm}
.badge{position:absolute;right:16mm;top:20mm;width:38mm;height:38mm;border-radius:50%;background:var(--coral);color:#fff;display:grid;place-items:center;text-align:center;font-family:"Baloo 2";font-weight:800;line-height:1;transform:rotate(10deg);border:1mm solid var(--navy)}
.badge b{font-size:26pt;display:block}.badge small{font-size:10pt}
.collage{display:grid;grid-template-columns:repeat(6,1fr);gap:4mm;margin-top:12mm}
.collage div{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-size:30pt}
.cover .agent{margin-top:auto;background:var(--white);border:.8mm solid var(--navy);border-radius:6mm;padding:6mm 8mm;display:flex;flex-direction:column;gap:5mm;box-shadow:2.5mm 3mm 0 var(--lav)}
.cover .agent .hand{font-size:20pt}
.cover .agent .ln{border-bottom:.5mm dashed var(--navy-soft);height:9mm;display:flex;align-items:flex-end;font-weight:800;font-size:11pt;gap:3mm}
.edition{align-self:flex-start;display:inline-block;margin-top:6mm;background:var(--navy);color:var(--yellow);font-family:"Baloo 2";font-weight:800;font-size:14pt;padding:2mm 7mm;border-radius:99px}

/* páginas de texto */
.ttl{font-size:26pt;margin-bottom:2mm}
.eyebrow{font-family:"Gochi Hand";font-size:17pt;color:var(--purple);display:block;transform:rotate(-1.5deg);transform-origin:left}
.lead{font-size:12pt;color:var(--navy-soft);max-width:170mm}
.steps3{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-top:8mm}
.steps3 div{background:var(--lilac);border-radius:5mm;padding:9mm 5mm 5mm;position:relative}
.steps3 b.n{position:absolute;top:-4mm;left:5mm;width:10mm;height:10mm;border-radius:50%;background:var(--yellow);border:.6mm solid var(--navy);display:grid;place-items:center;font-family:"Baloo 2";font-size:13pt}
.steps3 h3{font-size:14pt;margin-bottom:1.5mm}
.legend{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:8mm}
.legend div{display:flex;gap:3mm;align-items:flex-start;border:.4mm solid var(--line);border-radius:4mm;padding:3.5mm}
.legend .emo{font-size:16pt}
.legend p{font-size:10pt}
.box{border-radius:5mm;padding:5mm 6mm;margin-top:6mm}
.box h3{font-size:14pt;margin-bottom:1.5mm}
.box ul{padding-left:5mm;display:flex;flex-direction:column;gap:1mm;font-size:10.5pt}

/* índice */
.idx{columns:2;column-gap:8mm;margin-top:6mm}
.idx h3{font-size:13pt;break-after:avoid;margin:3mm 0 1.5mm;display:flex;gap:2mm;align-items:center}
.idx h3:first-child{margin-top:0}
.row{display:flex;gap:2mm;align-items:center;font-size:9.6pt;line-height:1.5;break-inside:avoid;padding:.4mm 0;border-bottom:.2mm dotted #C9CCE0}
.row .n{font-family:"Baloo 2";font-weight:800;width:7mm}
.row .t{flex:1}
.row .a{font-size:8pt;font-weight:800;border-radius:99px;padding:0 2mm}
.idx.big .row{font-size:12pt;line-height:2}.idx.big h3{font-size:15pt;margin-top:5mm}
.idx3{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-top:6mm}
.idx3 h3{font-size:13pt;border-radius:3mm;padding:1.5mm 3mm;margin-bottom:2mm}

/* missão */
.m-top{display:flex;align-items:center;gap:2.5mm;flex-wrap:wrap}
.m-num{background:var(--navy);color:#fff;font-family:"Baloo 2";font-weight:800;font-size:12pt;border-radius:99px;padding:.6mm 5mm}
.m-head{display:flex;justify-content:space-between;align-items:center;margin-top:3mm;gap:6mm}
.m-head h2{font-size:30pt}
.m-head .big{flex:none;width:30mm;height:30mm;border-radius:50%;display:grid;place-items:center;font-size:44pt;border:.8mm solid var(--navy)}
.info{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-top:4mm}
.info div{background:var(--lilac);border-radius:3.5mm;padding:2.5mm 3mm;font-weight:800;font-size:10.5pt;line-height:1.25}
.info small{display:block;font-size:7.5pt;letter-spacing:.06em;text-transform:uppercase;color:var(--navy-soft);font-weight:800;margin-bottom:.6mm}
.dots{letter-spacing:.5mm;color:var(--purple)}
.hq-t{display:flex;justify-content:space-between;align-items:baseline;margin-top:6mm}
.hq-t h3{font-size:14pt}
.hq-t span{font-size:9pt;color:var(--navy-soft);font-weight:700}
.hq{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:2mm}
.q{border:.7mm solid var(--navy);border-radius:4mm;height:43mm;padding:3mm 4mm;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.q .qn{position:absolute;top:2mm;left:3mm;font-family:"Baloo 2";font-weight:800;font-size:9pt;width:6mm;height:6mm;border-radius:50%;background:var(--white);border:.4mm solid var(--navy);display:grid;place-items:center}
.q .sc{font-size:30pt;text-align:center;margin-top:2mm;letter-spacing:2mm}
.q .cap{font-family:"Gochi Hand";font-size:14pt;line-height:1.15;text-align:center;background:var(--white);border-radius:3mm;padding:1.5mm 2mm}
.q:nth-child(1){background:var(--gold-bg)}.q:nth-child(2){background:var(--lav-bg)}.q:nth-child(3){background:var(--mint-bg)}.q:nth-child(4){background:var(--coral-bg)}
.invite{margin-top:4mm;background:#FFF4CF;border-left:2mm solid var(--gold);border-radius:3mm;padding:3mm 5mm}
.invite small{font-weight:800;font-size:8pt;letter-spacing:.08em;text-transform:uppercase;color:var(--navy-soft)}
.invite p{font-family:"Gochi Hand";font-size:16pt;line-height:1.2}
.cols{display:grid;grid-template-columns:.9fr 1.3fr;gap:5mm;margin-top:4mm}
.cols h3{font-size:12.5pt;margin-bottom:1.5mm}
.mat{list-style:none;display:flex;flex-direction:column;gap:1.2mm;font-size:10.2pt}
.mat li{display:flex;gap:2mm}.mat li:before{content:"";flex:none;width:3.6mm;height:3.6mm;border:.5mm solid var(--navy);border-radius:1mm;margin-top:.9mm}
.how{list-style:none;counter-reset:s;display:flex;flex-direction:column;gap:1.6mm;font-size:10.2pt}
.how li{display:flex;gap:2.5mm;counter-increment:s}
.how li:before{content:counter(s);flex:none;width:5.5mm;height:5.5mm;border-radius:50%;background:var(--purple);color:#fff;font-weight:900;font-size:8.5pt;display:grid;place-items:center;margin-top:.3mm}
.bottom{position:absolute;left:14mm;right:14mm;bottom:14mm;display:grid;grid-template-columns:1fr 34mm;gap:5mm;align-items:end}
.extra{background:var(--lilac);border-radius:4mm;padding:3mm 4.5mm;font-size:10pt}
.extra b{font-family:"Baloo 2";font-size:11pt}
.pais{font-size:9pt;color:var(--navy-soft);margin-top:2mm;padding:0 1mm}
.stamp{width:34mm;height:34mm;border-radius:50%;border:.7mm dashed var(--navy);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:"Baloo 2";font-weight:800;font-size:9.5pt;line-height:1.1;gap:1mm}
.stamp small{font-family:"Nunito";font-weight:700;font-size:7pt;color:var(--navy-soft)}

/* divisória de seção */
.divider{background:var(--navy);color:#fff;display:flex;flex-direction:column;justify-content:center;padding:24mm}
.divider .eyebrow{color:var(--yellow);font-size:24pt}
.divider h1{font-size:44pt;margin-top:3mm}
.divider p{font-size:14pt;color:#C8CEEB;margin-top:5mm;max-width:140mm}
.divider .big{font-size:70pt;margin-bottom:8mm}

/* pote de missões */
.cards{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:64mm;margin-top:2mm}
.card{border:.35mm dashed #9AA0C3;padding:4mm;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center}
.card .cn{font-family:"Baloo 2";font-weight:800;font-size:10pt;background:var(--navy);color:#fff;border-radius:99px;padding:0 3mm}
.card .ce{font-size:30pt}
.card h4{font-size:13pt;line-height:1.1}
.card .ct{display:flex;gap:1.5mm;flex-wrap:wrap;justify-content:center}
.card .ct span{font-size:7.5pt;font-weight:800;border-radius:99px;padding:.3mm 2mm}
.label-pote{border:.8mm solid var(--navy);border-radius:8mm;padding:10mm;text-align:center;margin-top:8mm;background:var(--cream)}
.label-pote h2{font-size:34pt}
.label-pote .hand{font-size:18pt}
.cut{font-size:9pt;color:var(--navy-soft);margin-top:2mm}

/* passaporte */
.stamps{display:grid;grid-template-columns:repeat(5,1fr);gap:9mm 3mm;margin-top:8mm}
.st{display:flex;flex-direction:column;align-items:center;text-align:center;gap:1mm}
.st .c{width:30mm;height:30mm;border-radius:50%;border:.6mm dashed var(--navy-soft);display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:15pt;color:#B4B8D3}
.st small{font-size:7.6pt;line-height:1.15;font-weight:700;height:6mm;overflow:hidden}
.pass-cover{border:1mm solid var(--navy);border-radius:8mm;padding:12mm;margin-top:6mm;display:grid;grid-template-columns:45mm 1fr;gap:8mm;background:var(--cream)}
.photo{height:55mm;border:.6mm dashed var(--navy);border-radius:4mm;display:grid;place-items:center;text-align:center;font-size:9pt;color:var(--navy-soft)}
.fields{display:flex;flex-direction:column;gap:6mm}
.fields div{border-bottom:.5mm dashed var(--navy-soft);padding-bottom:1mm;font-weight:800;font-size:10pt}
.levels{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:8mm}
.levels div{border-radius:5mm;padding:4mm;text-align:center}
.levels .emo{font-size:22pt;display:block;margin-bottom:1mm}
.levels b{font-family:"Baloo 2";font-size:12pt;display:block}

/* certificado */
.cert{border:3mm double var(--navy);border-radius:8mm;height:100%;padding:16mm 14mm;text-align:center;display:flex;flex-direction:column;align-items:center;background:var(--cream)}
.cert h1{font-size:40pt;margin-top:4mm}
.cert .seal{width:52mm;height:52mm;border-radius:50%;background:var(--yellow);border:1mm dashed var(--navy);display:grid;place-items:center;font-size:48pt;margin-top:12mm}
.cert .nm{width:150mm;border-bottom:.6mm solid var(--navy);height:16mm;margin:10mm auto 2mm}
.cert .sig{display:grid;grid-template-columns:1fr 1fr;gap:20mm;width:150mm;margin-top:auto}
.cert .sig div{border-top:.5mm solid var(--navy);padding-top:2mm;font-size:10pt;font-weight:700}

/* guia */
.g-steps{display:flex;flex-direction:column;gap:5mm;margin-top:7mm}
.g-step{display:grid;grid-template-columns:16mm 1fr;gap:5mm;align-items:start;background:var(--lilac);border-radius:5mm;padding:6mm 6mm}
.g-step .L{width:16mm;height:16mm;border-radius:50%;display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:20pt;color:var(--navy);border:.7mm solid var(--navy)}
.g-step h3{font-size:14pt}
.g-step p{font-size:10.5pt}
.g-step .ex{font-family:"Gochi Hand";font-size:13.5pt;color:var(--purple);margin-top:1mm}
.phr{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin-top:5mm}
.phr div{border-radius:5mm;padding:4mm 5mm}
.phr h3{font-size:12.5pt;margin-bottom:1.5mm}
.phr ul{list-style:none;display:flex;flex-direction:column;gap:2.4mm}
.phr li{font-family:"Gochi Hand";font-size:14pt;line-height:1.2}
.phr li:before{content:"“";color:var(--purple);font-weight:800}
.deal{border:.8mm solid var(--navy);border-radius:6mm;padding:7mm;margin-top:6mm}
.deal .r{display:flex;gap:3mm;align-items:flex-start;padding:2.4mm 0;border-bottom:.3mm dashed #B4B8D3;font-size:11pt}
.deal .r:last-child{border-bottom:0}
.deal .r b{min-width:48mm}
.deal .r span.fill{flex:1;border-bottom:.4mm solid var(--navy-soft);height:6mm}

/* desafio 30 dias */
.cal{display:grid;grid-template-columns:repeat(5,1fr);gap:2.5mm;margin-top:5mm}
.day{border:.5mm solid var(--navy);border-radius:3.5mm;height:33mm;padding:2mm;display:flex;flex-direction:column;justify-content:space-between;text-align:center}
.day .d{font-family:"Baloo 2";font-weight:800;font-size:10pt;align-self:flex-start;background:var(--navy);color:#fff;border-radius:99px;padding:0 2.5mm}
.day .de{font-size:19pt}
.day .dt{font-size:8pt;font-weight:800;line-height:1.1}
.day .dn{font-size:7pt;color:var(--navy-soft);font-weight:700}
.day .ok{width:6mm;height:6mm;border:.5mm solid var(--navy);border-radius:50%;align-self:center}
.day.free{background:var(--gold-bg)}
.stars{display:grid;grid-template-columns:repeat(10,1fr);gap:2.5mm;margin-top:5mm}
.stars div{aspect-ratio:1;border:.5mm dashed var(--navy-soft);border-radius:50%;display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:10pt;color:#9AA0C3}
.rewards{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-top:6mm}
.rewards div{border-radius:5mm;padding:5mm;text-align:center}
.rewards .emo{font-size:24pt;display:block;margin-bottom:2mm}
.rewards b{font-family:"Baloo 2";font-size:13pt;display:block}

/* ---------- versão preto e branco: fundos brancos, contornos e emojis em tons de cinza */
body.pb .emo{filter:grayscale(1) contrast(.9) brightness(1.15)}
body.pb .gold,body.pb .lav,body.pb .mint,body.pb .coral,body.pb .q,body.pb .info div,body.pb .extra,body.pb .steps3 div,
body.pb .g-step,body.pb .day.free,body.pb .invite,body.pb .levels div,body.pb .rewards div,body.pb .phr div,body.pb .box{background:#fff!important;border:.35mm solid #777}
body.pb .gold-s,body.pb .lav-s,body.pb .mint-s,body.pb .coral-s{background:#fff!important;border:.5mm solid #555}
body.pb .cover,body.pb .label-pote,body.pb .pass-cover,body.pb .cert{background:#fff!important}
body.pb .divider{background:#fff;color:#111;border:1.2mm solid #111}
body.pb .divider .eyebrow{color:#111}body.pb .divider p{color:#333}
body.pb .m-num,body.pb .card .cn,body.pb .day .d{background:#fff;color:#111;border:.4mm solid #111}
body.pb .how li:before{background:#fff;color:#111;border:.4mm solid #111}
body.pb .badge{background:#fff;color:#111}
body.pb .cover h1 .l1:before{background:#ddd}
body.pb .cover h1 .l2,body.pb .eyebrow{color:#333}
body.pb .zero{background:#fff;color:#111;border:.4mm solid #111}
body.pb .edition{background:#fff;color:#111;border:.5mm solid #111}
body.pb .cert .seal,body.pb .steps3 b.n{background:#fff}
body.pb .invite{border-left:2mm solid #999}
`;

// ------------------------------------------------------------------ componentes
let PAGE = 0;
const page = (inner, cls = '', foot = true) => {
  PAGE++;
  return `<section class="page ${cls}">${inner}${foot ? `<div class="foot"><span>Missão Zero Tela</span><span>${PAGE}</span></div>` : ''}</section>`;
};

const collage = ['🏴‍☠️', '🎨', '🏕️', '🚀', '🧑‍🍳', '🌈', '🔦', '🐉', '🎳', '🌋', '🎭', '🧩'];
const cover = (ed) => page(`
  <div class="logo"><span class="zero">0</span> Missão Zero Tela</div>
  <div class="badge"><div><b>${ed.qtd}</b><small>missões</small></div></div>
  <span class="kick hand">Para a hora do "só mais um vídeo"</span>
  <h1><span class="l1">Missão</span><span class="l2">Zero Tela</span></h1>
  <p class="sub">${ed.sub}</p>
  <span class="edition">${ed.nome}</span>
  <div class="collage">${collage.map((e, i) => `<div class="${['gold', 'lav', 'mint', 'coral'][i % 4]}">${emo(e)}</div>`).join('')}</div>
  <div class="agent">
    <span class="hand">Este kit pertence ao Agente:</span>
    <div class="ln">Nome:</div>
    <div class="ln">Idade:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Começou a primeira missão em: ____ / ____ / ________</div>
  </div>`, 'cover', false);

const comoUsar = (ed) => page(`
  <span class="eyebrow">Antes de começar</span>
  <h2 class="ttl">Como usar o Missão Zero Tela</h2>
  <p class="lead">Cada missão começa com uma historinha em 4 quadrinhos. Você lê em voz alta, a criança aceita a missão e vocês brincam. Simples assim. Ninguém precisa comprar nada: tudo usa o que existe em casa.</p>
  <div class="steps3">
    <div><b class="n">1</b><h3>Escolha a missão</h3><p>Pelo momento do dia${ed.completo ? ' (veja o índice), pela idade ou sorteando uma carta do Pote de Missões' : ' ou deixando a criança escolher pelo desenho'}.</p></div>
    <div><b class="n">2</b><h3>Leia a historinha</h3><p>Leia os quadrinhos com voz de aventura e termine com a frase-convite. É ela que faz a criança largar a tela com vontade.</p></div>
    <div><b class="n">3</b><h3>Brinquem e carimbem</h3><p>Siga o passo a passo. No fim, a criança pinta o carimbo "Missão cumprida" ${ed.completo ? 'e marca no Passaporte do Explorador' : 'e marca no passaporte do fim do livro'}.</p></div>
  </div>
  <div class="legend">
    <div>${emo('⏱️')}<p><b>Tempo:</b> quanto dura a brincadeira, em média. Muitas crianças vão querer repetir!</p></div>
    <div>${emo('🧺')}<p><b>Bagunça:</b> pouca, média ou muita. Ajuda a decidir se dá para fazer agora.</p></div>
    <div>${emo('👨‍👩‍👧')}<p><b>Juntos:</b> missões para brincar com um adulto. <b>Sozinho:</b> a criança brinca perto de você enquanto você faz outra coisa.</p></div>
    <div>${emo('🧠')}<p><b>Desenvolve:</b> a habilidade que a missão trabalha, explicada em "Para os pais".</p></div>
  </div>
  <div class="box gold">
    <h3>${emo('💛')} Dicas para dar certo</h3>
    <ul>
      <li>Apresente a missão como um convite especial, nunca como castigo por tirar a tela.</li>
      <li>Avise antes de desligar: "Quando acabar este episódio, tem uma missão secreta esperando você".</li>
      <li>As idades são uma sugestão. Uma missão de 7 anos pode ser feita por uma criança menor com mais ajuda.</li>
      <li>Repetir é ótimo: crianças adoram rever as missões preferidas.</li>
    </ul>
  </div>
  <div class="box coral">
    <h3>${emo('🛟')} Segurança em primeiro lugar</h3>
    <ul>
      <li>Toda missão é para ser feita com um adulto por perto, inclusive as do modo "Sozinho".</li>
      <li>Tesoura sem ponta para as crianças. Fogão, forno e faca de corte são só do adulto.</li>
      <li>Para menores de 4 anos, cuidado com objetos pequenos que cabem na boca (grãos, moedas, tampinhas).</li>
    </ul>
  </div>`);

const missaoPage = (m, num) => {
  const [mo1, mo2] = MOMENTOS[m.mo];
  const [idTxt, idCls] = IDADES[m.a];
  const [hab, habTxt] = HAB[m.h];
  const [modoE, modoT] = MODO[m.m];
  return page(`
  <div class="m-top">
    <span class="m-num">MISSÃO ${pad(num)}</span>
    <span class="pill ${idCls}">${emo('🎂')} ${idTxt}</span>
    <span class="pill lav">${emo(mo1)} ${mo2}</span>
  </div>
  <div class="m-head"><h2>${esc(m.t)}</h2><div class="big ${idCls}">${emo(m.e)}</div></div>
  <div class="info">
    <div><small>${emo('⏱️')} Tempo</small>${m.min} minutos</div>
    <div><small>${emo('🧺')} Bagunça</small><span class="dots">${'●'.repeat(m.b)}${'○'.repeat(3 - m.b)}</span> ${BAGUNCA[m.b]}</div>
    <div><small>${emo(modoE)} Modo</small>${modoT}</div>
    <div><small>${emo('🧠')} Desenvolve</small>${hab}</div>
  </div>
  <div class="hq-t"><h3>A historinha da missão</h3><span>Leia em voz alta, um quadrinho de cada vez</span></div>
  <div class="hq">${m.hq.map((q, i) => { const [sc, cap] = q.split('|'); return `<div class="q"><span class="qn">${i + 1}</span><div class="sc">${emo(sc)}</div><div class="cap">${esc(cap)}</div></div>`; }).join('')}</div>
  <div class="invite"><small>Frase-convite</small><p>"${esc(m.c)}"</p></div>
  <div class="cols">
    <div><h3>${emo('🧺')} Materiais</h3><ul class="mat">${m.mat.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><h3>${emo('🗺️')} Como fazer</h3><ol class="how">${m.p.map((x) => `<li><span>${esc(x)}</span></li>`).join('')}</ol></div>
  </div>
  <div class="bottom">
    <div>
      <div class="extra"><b>${emo('⭐')} Desafio extra:</b> ${esc(m.x)}</div>
      <p class="pais"><b>Para os pais:</b> esta missão trabalha <b>${hab.toLowerCase()}</b>: ${habTxt}</p>
    </div>
    <div class="stamp">${emo('🏅')}Missão<br>cumprida!<small>Data: ___/___</small></div>
  </div>`);
};

const idxRow = (m, num) => `<div class="row"><span class="n">${pad(num)}</span>${emo(m.e)}<span class="t">${esc(m.t)}</span><span class="a ${IDADES[m.a][1]}">${m.a}</span>${emo(MODO[m.m][0])}</div>`;

const indiceMomentos = (lista, grupos, titulo) => page(`
  <span class="eyebrow">Índice por momento</span>
  <h2 class="ttl">${titulo}</h2>
  <p class="lead">Ache rápido a missão certa para a situação que você está vivendo agora. ${emo('👨‍👩‍👧')} = juntos · ${emo('🧒')} = a criança faz sozinha, perto de você.</p>
  <div class="idx">${grupos.map((g) => `<h3>${emo(MOMENTOS[g][0])} ${MOMENTOS[g][1]}</h3>${lista.filter(([m]) => m.mo === g).map(([m, n]) => idxRow(m, n)).join('')}`).join('')}</div>`);

const indiceIdades = (lista) => page(`
  <span class="eyebrow">Índice por idade</span>
  <h2 class="ttl">Missões para cada fase</h2>
  <p class="lead">As faixas são sugestões. Crianças mais velhas também se divertem com as missões dos menores, e os menores podem fazer as dos maiores com ajuda.</p>
  <div class="idx3">${Object.entries(IDADES).map(([k, [t, c]]) => `<div><h3 class="${c}">${t}</h3>${lista.filter(([m]) => m.a === k).map(([m, n]) => `<div class="row"><span class="n">${pad(n)}</span><span class="t">${esc(m.t)}</span></div>`).join('')}</div>`).join('')}</div>`);

const divider = (big, eyebrow, title, text) => page(`<div class="big">${emo(big)}</div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${text}</p>`, 'divider', false);

// ---------- Bônus 1: Pote de Missões
const pote = (lista) => {
  let out = page(`
    <span class="eyebrow">Bônus 1</span>
    <h2 class="ttl">Pote de Missões</h2>
    <p class="lead">Transforme a escolha da missão num sorteio. Quando a criança tira a carta do pote, ela sente que a decisão é dela, e isso diminui muito a resistência para largar a tela.</p>
    <div class="steps3">
      <div><b class="n">1</b><h3>Imprima e recorte</h3><p>Imprima as páginas de cartas e recorte nas linhas tracejadas. Se puder, imprima em papel mais grosso.</p></div>
      <div><b class="n">2</b><h3>Monte o pote</h3><p>Use um pote de vidro ou plástico, uma lata ou caixa. Recorte o rótulo abaixo e cole na frente.</p></div>
      <div><b class="n">3</b><h3>Sorteie</h3><p>Dobre as cartas ao meio e coloque no pote. Separe por idade, se quiser, ou deixe tudo junto.</p></div>
    </div>
    <div class="label-pote"><span class="hand">Pote de</span><h2>Missões Secretas</h2><p class="hand">do Agente _______________________</p><p style="margin-top:4mm;font-size:22pt">${emo('🏴‍☠️ 🚀 🎨 🏕️ 🔦')}</p></div>
    <p class="cut">${emo('✂️')} Recorte nas linhas tracejadas.</p>
    <div class="box lav"><h3>${emo('💡')} Ideias para usar o pote</h3><ul>
      <li>Sorteio do dia: a criança tira uma carta logo depois do almoço ou quando chega da escola.</li>
      <li>Pote por idade: se tiver filhos de idades diferentes, use cores de papel ou potes separados.</li>
      <li>Missão cumprida volta para o pote? Vocês decidem. Muitas famílias criam um segundo pote: "as que já fizemos".</li>
      <li>Carta coringa: escreva "Missão inventada" num papel em branco. Quem tirar inventa uma missão nova.</li>
    </ul></div>`);
  for (let i = 0; i < lista.length; i += 12) {
    out += page(`<div class="cards">${lista.slice(i, i + 12).map(([m, n]) => `<div class="card"><span class="cn">Missão ${pad(n)}</span><span class="emo ce">${m.e}</span><h4>${esc(m.t)}</h4><div class="ct"><span class="${IDADES[m.a][1]}">${m.a} anos</span><span class="lav">${m.min} min</span><span class="gold">${MODO[m.m][1]}</span></div></div>`).join('')}</div>`);
  }
  return out;
};

// ---------- Bônus 2: Passaporte + certificado
const passaporte = (lista, completo) => {
  const niveis = completo
    ? [['🥉', 'Explorador Bronze', '10 missões', 'gold'], ['🥈', 'Explorador Prata', '30 missões', 'lav'], ['🥇', 'Explorador Ouro', '60 missões', 'mint'], ['🏆', 'Agente Lendário', '100 missões', 'coral']]
    : [['🥉', 'Bronze', '5 missões', 'gold'], ['🥈', 'Prata', '10 missões', 'lav'], ['🥇', 'Ouro', '15 missões', 'mint'], ['🏆', 'Lendário', '20 missões', 'coral']];
  let out = page(`
    <span class="eyebrow">${completo ? 'Bônus 2' : 'Seu passaporte'}</span>
    <h2 class="ttl">Passaporte do Explorador</h2>
    <p class="lead">A cada missão cumprida, a criança pinta, desenha ou cola um adesivo no carimbo com o número da missão. Ver o passaporte enchendo dá orgulho e vontade de continuar.</p>
    <div class="pass-cover">
      <div class="photo">Cole aqui uma foto ou desenhe o seu rosto</div>
      <div class="fields"><span class="hand" style="font-size:20pt">Passaporte Oficial de Agente</span><div>Nome:</div><div>Idade:</div><div>Codinome secreto:</div><div>Missão preferida:</div></div>
    </div>
    <h3 style="font-size:15pt;margin-top:8mm">Níveis de explorador</h3>
    <div class="levels">${niveis.map(([e, t, q, c]) => `<div class="${c}">${emo(e)}<b>${t}</b>${q}</div>`).join('')}</div>
    <div class="box gold"><h3>${emo('📜')} Regras do passaporte</h3><ul>
      <li>Cada missão cumprida vale um carimbo: pinte, desenhe uma carinha ou cole um adesivo no círculo.</li>
      <li>Repetiu uma missão? Faça um risquinho ao lado do carimbo. Vale contar as favoritas!</li>
      <li>Ao chegar a cada nível, comemorem juntos e anotem a data dentro do quadro do nível.</li>
      <li>No último nível, preencha e entregue o Certificado de Agente (última página do passaporte).</li>
    </ul></div>`);
  const porPag = 25;
  for (let i = 0; i < lista.length; i += porPag) {
    out += page(`<h2 class="ttl" style="font-size:20pt">Carimbos ${pad(i + 1)} a ${pad(Math.min(i + porPag, lista.length))}</h2>
      <div class="stamps">${lista.slice(i, i + porPag).map(([m, n]) => `<div class="st"><div class="c">${pad(n)}</div><small>${esc(m.t)}</small></div>`).join('')}</div>`);
  }
  out += page(`<div class="cert">
      <div class="logo"><span class="zero">0</span> Missão Zero Tela</div>
      <h1>Certificado de Agente</h1>
      <p class="hand" style="font-size:20pt;margin-top:2mm">Certificamos que</p>
      <div class="nm"></div>
      <p style="font-size:13pt;max-width:150mm">cumpriu <b>______</b> missões, trocou a tela por brincadeiras de verdade e mostrou coragem, criatividade e alegria em cada aventura.</p>
      <div class="seal">${emo('🏆')}</div>
      <p class="hand" style="font-size:18pt;margin-top:8mm">Nível alcançado: ______________________</p>
      <div class="sig"><div>Assinatura da Central (família)</div><div>Data</div></div>
    </div>`, '', false);
  return out;
};

// ---------- Bônus 3: Guia "Desligar sem birra"
const guia = () => {
  const g = guiaBirra;
  let out = page(`
    <span class="eyebrow">Bônus 3</span>
    <h2 class="ttl">Desligar sem birra</h2>
    <p class="lead">${g.intro}</p>
    <div class="box lav"><h3>${emo('🧠')} Por que é tão difícil parar?</h3><ul>${g.porque.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="box mint"><h3>${emo('📏')} Quanto tempo de tela é recomendado?</h3><ul>${g.tempo.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="box gold"><h3>${emo('💡')} A ideia central</h3><p style="font-size:11pt">${g.ideia}</p></div>`);
  out += page(`
    <span class="eyebrow">O método em 5 passos</span>
    <h2 class="ttl">A.V.I.S.E. antes de desligar</h2>
    <div class="g-steps">${g.passos.map(([L, t, p, ex]) => `<div class="g-step"><span class="L">${L}</span><div><h3>${t}</h3><p>${p}</p><p class="ex">${ex}</p></div></div>`).join('')}</div>
    <div class="box gold"><h3>${emo('⭐')} Dica de ouro</h3><p style="font-size:10.5pt">${g.dica}</p></div>`);
  out += page(`
    <span class="eyebrow">Frases prontas</span>
    <h2 class="ttl">O que dizer na hora H</h2>
    <p class="lead">Recorte, cole na geladeira ou deixe esta página aberta no celular. Na hora do estresse, ninguém precisa improvisar.</p>
    <div class="phr">${g.frases.map(([t, c, l]) => `<div class="${c}"><h3>${t}</h3><ul>${l.map((x) => `<li>${x}”</li>`).join('')}</ul></div>`).join('')}</div>
    <div class="box" style="border:.5mm solid var(--coral)"><h3>${emo('🚫')} O que evitar</h3><ul>${g.evitar.map((x) => `<li>${x}</li>`).join('')}</ul></div>`);
  out += page(`
    <span class="eyebrow">E se a birra vier mesmo assim?</span>
    <h2 class="ttl">Calma: faz parte</h2>
    <p class="lead">Birra não é sinal de que você errou. É uma criança aprendendo a lidar com uma frustração. O que ajuda:</p>
    <div class="g-steps">${g.birra.map(([e, t, p]) => `<div class="g-step"><span class="L emo" style="font-size:18pt">${e}</span><div><h3>${t}</h3><p>${p}</p></div></div>`).join('')}</div>
    <div class="box coral"><h3>${emo('🩺')} Quando conversar com um profissional</h3><p style="font-size:10.5pt">${g.profissional}</p></div>`);
  out += page(`
    <span class="eyebrow">Para imprimir e assinar</span>
    <h2 class="ttl">Combinados da nossa família</h2>
    <p class="lead">Combinado feito junto com a criança é cumprido com mais facilidade. Preencham juntos e colem num lugar visível.</p>
    <div class="deal">${g.combinados.map((x) => `<div class="r"><b>${x}</b><span class="fill"></span></div>`).join('')}</div>
    <div class="box lav"><h3>${emo('✍️')} Nós combinamos e assinamos</h3><p style="margin-top:8mm;display:flex;gap:10mm;font-size:10pt"><span style="flex:1;border-top:.4mm solid #4A5385;padding-top:1mm">Criança</span><span style="flex:1;border-top:.4mm solid #4A5385;padding-top:1mm">Adulto</span><span style="flex:1;border-top:.4mm solid #4A5385;padding-top:1mm">Adulto</span></p></div>`);
  return out;
};

// ---------- Bônus 4: Desafio 30 dias
const desafio = (porNum) => {
  let out = page(`
    <span class="eyebrow">Bônus 4</span>
    <h2 class="ttl">Desafio 30 Dias Zero Tela</h2>
    <p class="lead" style="max-width:none">Uma missão por dia durante um mês. Não é para zerar a tela: é para criar o hábito de trocar pelo menos um momento de tela por brincadeira. Os dias amarelos são livres: a criança sorteia uma missão do pote.</p>
    <div class="cal">${desafio30.map((n, i) => {
      if (!n) return `<div class="day free"><span class="d">Dia ${i + 1}</span><span class="emo de">🎲</span><span class="dt">Dia livre</span><span class="dn">Sorteie do pote</span><span class="ok"></span></div>`;
      const m = porNum[n];
      return `<div class="day"><span class="d">Dia ${i + 1}</span><span class="emo de">${m.e}</span><span class="dt">${esc(m.t)}</span><span class="dn">Missão ${pad(n)}</span><span class="ok"></span></div>`;
    }).join('')}</div>`);
  out += page(`
    <span class="eyebrow">Cole na geladeira</span>
    <h2 class="ttl">Quadro de conquistas</h2>
    <p class="lead">Pinte uma estrela a cada dia cumprido. Ao chegar nas metas, a família comemora com uma recompensa de experiência (não de presente).</p>
    <div class="stars">${Array.from({ length: 30 }, (_, i) => `<div>${i + 1}</div>`).join('')}</div>
    <div class="rewards">${recompensas.map(([e, t, d, c]) => `<div class="${c}">${emo(e)}<b>${t}</b><p style="font-size:10pt;margin-top:1mm">${d}</p></div>`).join('')}</div>
    <div class="box lav"><h3>${emo('📝')} Como foi o desafio?</h3><p style="font-size:10.5pt">Missão preferida: ____________________________ &nbsp;&nbsp; A mais engraçada: ____________________________</p><p style="font-size:10.5pt;margin-top:4mm">O que mudou na nossa casa: ________________________________________________________________</p></div>`);
  return out;
};

const fimSimples = () => page(`
  <span class="eyebrow">Missão cumprida!</span>
  <h2 class="ttl">Parabéns, Agente!</h2>
  <p class="lead">Se vocês chegaram até aqui, já trocaram muitas horas de tela por brincadeira de verdade. Agora é só repetir as preferidas: criança adora rever o que deu certo.</p>
  <div class="box gold"><h3>${emo('🔁')} Ideias para continuar</h3><ul>
    <li>Peça para a criança escolher as 3 missões preferidas e repita uma por semana.</li>
    <li>Use os desafios extras de cada missão: cada um vira uma brincadeira nova.</li>
    <li>Deixe a criança inventar a próxima missão e escrever a historinha com você.</li>
  </ul></div>
  <div class="box lav"><h3>${emo('🚀')} Quer mais missões?</h3><p style="font-size:11pt">A Edição Completa tem 100 missões separadas por idade e por momento do dia, o Pote de Missões para recortar, o Passaporte com 100 carimbos, o guia "Desligar sem birra" e o Desafio 30 Dias Zero Tela.</p></div>`);

// ------------------------------------------------------------------ montagem
const doc = (body, pb = false) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Missão Zero Tela</title><style>${CSS}</style></head><body class="${pb ? 'pb' : ''}">${body}</body></html>`;

function edicaoCompleta(pb) {
  PAGE = 0;
  const lista = MISSOES.map((m) => [m, m.n]);
  const porNum = Object.fromEntries(MISSOES.map((m) => [m.n, m]));
  let b = cover({ qtd: 100, nome: 'Edição Completa' + (pb ? ' · Preto e branco' : ''), sub: '100 historinhas-missão para crianças de 3 a 8 anos trocarem a tela por brincadeira de verdade, com o que você já tem em casa.' });
  b += comoUsar({ completo: true });
  b += indiceMomentos(lista, ['chuva', 'jantar'], 'Para dias de chuva e para a hora do jantar');
  b += indiceMomentos(lista, ['cinco', 'dormir', 'espera', 'viagem'], 'Para 5 minutos, antes de dormir, esperas e viagens');
  b += indiceIdades(lista);
  b += divider('🗺️', 'Parte 1', '100 Missões', 'Cada página é uma aventura completa: historinha, frase-convite, materiais, passo a passo, desafio extra e o carimbo de missão cumprida.');
  b += lista.map(([m, n]) => missaoPage(m, n)).join('');
  b += divider('🎁', 'Parte 2', 'Bônus', 'Pote de Missões, Passaporte do Explorador com certificado, o guia "Desligar sem birra" e o Desafio 30 Dias Zero Tela.');
  b += pote(lista);
  b += passaporte(lista, true);
  b += guia();
  b += desafio(porNum);
  return doc(b, pb);
}

function edicaoSimples() {
  PAGE = 0;
  const lista = SIMPLES_IDS.map((id, i) => [MISSOES.find((m) => m.n === id), i + 1]);
  let b = cover({ qtd: 20, nome: 'Edição Simples', sub: '20 historinhas-missão para crianças de 3 a 8 anos trocarem a tela por brincadeira de verdade, com o que você já tem em casa.' });
  b += comoUsar({ completo: false });
  b += page(`<span class="eyebrow">Índice</span><h2 class="ttl">Suas 20 missões</h2>
    <p class="lead">${emo('👨‍👩‍👧')} = juntos · ${emo('🧒')} = a criança faz sozinha, perto de você.</p>
    <div class="idx big">${Object.keys(MOMENTOS).map((g) => { const r = lista.filter(([m]) => m.mo === g); return r.length ? `<h3>${emo(MOMENTOS[g][0])} ${MOMENTOS[g][1]}</h3>${r.map(([m, n]) => idxRow(m, n)).join('')}` : ''; }).join('')}</div>`);
  b += lista.map(([m, n]) => missaoPage(m, n)).join('');
  b += passaporte(lista, false);
  b += fimSimples();
  return doc(b);
}

// ------------------------------------------------------------------ saída
const OUT = ROOT;
mkdirSync(join(ROOT, 'html'), { recursive: true });
const jobs = [
  ['missao-zero-tela-simples', edicaoSimples()],
  ['missao-zero-tela-completo', edicaoCompleta(false)],
  ['missao-zero-tela-completo-pb', edicaoCompleta(true)],
];
for (const [name, html] of jobs) writeFileSync(join(ROOT, 'html', name + '.html'), html);
if (process.argv[2] !== 'html') {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  for (const [name] of jobs) {
    const pg = await browser.newPage();
    await pg.goto('file://' + join(ROOT, 'html', name + '.html'), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.pdf({ path: join(OUT, name + '.pdf'), preferCSSPageSize: true, printBackground: true });
    await pg.close();
    console.log('ok', name);
  }
  await browser.close();
}
