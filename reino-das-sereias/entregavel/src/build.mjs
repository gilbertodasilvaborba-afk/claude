// Entregável "Reino das Sereias Encantadas" em PDF (A4 retrato).
// Uso: npm run build → gera reino-das-sereias.pdf (e reino-das-sereias-pb.pdf, versão que economiza tinta)
//      node src/build.mjs html → só gera html/livro.html para revisar no navegador
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg, tint, mermaid, crown, shell, starfish, fish, pearl, sparkle, bubble, chest, castle, seahorse, key, INK, S } from './art.mjs';
import { colorir, labirinto, cacaPalavras, contar, ligarPontos, simetria, mapa } from './scenes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', f)).toString('base64')}) format('woff2')`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PALETA = ['#FFD6E8', '#BDEBFF', '#E3D4FF', '#FFF0A8', '#C8F2DF', '#FFC9B8'];

const CSS = `
@font-face{font-family:"Baloo 2";src:${font('Baloo2-latin.woff2')};font-weight:400 800}
@font-face{font-family:"Nunito";src:${font('Nunito-latin.woff2')};font-weight:200 1000}
@font-face{font-family:"Gochi Hand";src:${font('GochiHand-latin.woff2')}}
@page{size:A4;margin:0}
:root{--ink:#2B2552;--teal:#1FB5B0;--aqua:#CFF3F1;--lilac:#ECE3FF;--pink:#FF7FB0;--gold:#FFC94A;--cream:#FFFBF5}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Nunito",sans-serif;color:var(--ink);font-size:11.5pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3{font-family:"Baloo 2",sans-serif;line-height:1.08;font-weight:800}
.hand{font-family:"Gochi Hand",cursive}
.emo{font-family:"Noto Color Emoji",sans-serif}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;background:#fff;padding:14mm}
.foot{position:absolute;left:14mm;right:14mm;bottom:7mm;display:flex;justify-content:space-between;font-size:8pt;color:#8E8BB0}
.tag{display:inline-block;border-radius:99px;padding:.6mm 3.4mm;font-weight:800;font-size:9pt;background:var(--lilac)}
.head{display:flex;align-items:center;gap:4mm;margin-bottom:4mm}
.head .num{width:11mm;height:11mm;border-radius:50%;background:var(--teal);color:#fff;font-family:"Baloo 2";font-weight:800;font-size:14pt;display:grid;place-items:center;flex:none}
.head h2{font-size:21pt}
.art{width:100%;height:232mm;display:block}
.art svg{width:100%;height:100%}
.frame{border:1.6mm solid var(--ink);border-radius:8mm;padding:3mm;height:240mm}
.frame svg{width:100%;height:100%;display:block}

/* capa */
.cover{background:linear-gradient(170deg,#7FE3DC 0%,#B9A6F5 55%,#FFB6D5 100%);display:flex;flex-direction:column;align-items:center;text-align:center;padding:18mm 14mm}
.cover .kick{font-family:"Gochi Hand";font-size:22pt;color:#fff;text-shadow:0 1mm 0 rgba(43,37,82,.25);margin-top:4mm}
.cover h1{font-size:52pt;color:#fff;text-shadow:0 1.6mm 0 var(--ink);-webkit-text-stroke:.5mm var(--ink);margin-top:2mm}
.cover .sub{font-weight:800;font-size:15pt;margin-top:4mm;background:#fff;border-radius:99px;padding:2mm 8mm;border:.8mm solid var(--ink)}
.cover .hero{width:178mm;height:150mm;margin-top:6mm}
.cover .hero svg{width:100%;height:100%}
.cover .badges{display:flex;gap:5mm;margin-top:3mm}
.cover .badges span{background:var(--gold);border:.8mm solid var(--ink);border-radius:5mm;padding:2mm 5mm;font-family:"Baloo 2";font-weight:800;font-size:13pt}

/* texto */
.card{border:.8mm solid var(--ink);border-radius:6mm;padding:5mm 6mm;background:var(--cream)}
.card + .card{margin-top:4mm}
.lines div{border-bottom:.5mm solid #C9C3E4;height:10mm}
.box{display:inline-block;width:6mm;height:6mm;border:.7mm solid var(--ink);border-radius:1.5mm;vertical-align:-1mm;margin-right:2mm}
ul.chk{list-style:none}ul.chk li{margin:3mm 0}
.clue{border:.8mm dashed var(--ink);border-radius:5mm;padding:4mm 5mm;margin-top:5mm;background:#fff;position:relative}
.clue .n{position:absolute;right:4mm;top:-4mm;background:var(--gold);border:.7mm solid var(--ink);border-radius:99px;padding:0 3mm;font-family:"Baloo 2";font-weight:800}
.clue .hide{font-size:9.5pt;color:#6b6791;margin-top:2mm}
.sheet-bw .cover{background:#fff}
`;

let pageNo = 0;
const foot = (label = 'Reino das Sereias Encantadas') => `<div class="foot"><span>${label}</span><span>${++pageNo}</span></div>`;
const page = (inner, cls = '') => `<section class="page ${cls}">${inner}</section>`;

// ---------------------------------------------------------------- páginas
const capa = () => {
  const hero = tint(svg(
    mermaid(150, 140, 0.58, 'long') + mermaid(295, 130, 0.62, 'bun') + mermaid(440, 140, 0.58, 'braid') + crown(295, 18, 0.5) +
    castle(90, 395, 0.5) + shell(520, 380, 0.45) + starfish(300, 400, 0.5) + fish(480, 240, 0.35, 0, true) + sparkle(40, 60, 1) + sparkle(560, 60, 1) + bubble(40, 300, 16) + bubble(570, 160, 14)
    , '0 0 600 500'), PALETA);
  pageNo++;
  return page(`<div class="kick">Livro de colorir e atividades</div><h1>Mundo das<br>Sereias Encantadas</h1>
    <div class="sub">Para meninas de 4 a 8 anos</div><div class="hero">${hero}</div>
    <div class="badges"><span>30 páginas</span><span>🎁 Caça ao Tesouro</span></div>`, 'cover');
};

const boasVindas = () => page(`
  <h2 style="font-size:28pt">Bem-vinda ao Reino! 🧜‍♀️</h2>
  <p style="margin:4mm 0 6mm;font-size:13pt">Este livro é um convite para desligar a tela por um tempinho e ligar a imaginação. Aqui moram quatro sereias amigas, e cada página é uma aventura nova.</p>
  <div class="card"><h3>Como usar</h3><ul class="chk">
    <li><span class="box"></span>Imprima em folha A4, colorida ou preto e branco.</li>
    <li><span class="box"></span>Separe lápis de cor, giz de cera ou canetinhas.</li>
    <li><span class="box"></span>Escolha uma página por vez. Não existe ordem certa!</li>
    <li><span class="box"></span>Quando quiser, convide alguém da família para brincar junto.</li></ul></div>
  <div class="card"><h3>O que tem aqui dentro</h3>
    <p><b>15 páginas para colorir</b> · <b>5 atividades</b> · <b>5 desafios</b> · <b>5 páginas especiais</b></p>
    <p style="margin-top:2mm">E no final, o bônus: <b>Caça ao Tesouro Encantado</b>, para a casa toda virar um reino.</p></div>
  <h3 style="margin:6mm 0 3mm">Conheça as sereias</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4mm">
   ${[['Marina', 'long', 'A exploradora. Adora conchas, curiosidades e fazer perguntas.'], ['Pérola', 'bun', 'A sonhadora. Vive inventando histórias e canções.'], ['Corália', 'braid', 'A artista. Pinta o mar de todas as cores que existem.'], ['Estrela', 'curly', 'A brincalhona. Faz todo mundo rir até as ondas dançarem.']]
     .map(([n, h, t]) => `<div class="card" style="display:flex;gap:3mm;align-items:center;margin:0"><div style="width:20mm;flex:none">${svg(mermaid(300, 170, 1.0, h), '200 -30 200 500')}</div><div><h3>${n}</h3><p style="font-size:10pt">${t}</p></div></div>`).join('')}
  </div>${foot()}`);

const paginaColorir = ([titulo, cena], i) => page(`
  <div class="head"><div class="num">${i + 1}</div><h2>${esc(titulo)}</h2></div>
  <div class="art">${svg(cena())}</div>${foot('Para colorir')}`);

const atividades = () => {
  const cp = cacaPalavras();
  return [
    page(`<div class="head"><div class="num">1</div><h2>Labirinto da sereia</h2></div><p>Ajude a Marina a chegar até o baú do tesouro sem passar por cima das paredes.</p><div class="frame" style="height:225mm;margin-top:4mm">${labirinto()}</div>${foot('Atividade')}`),
    page(`<div class="head"><div class="num">2</div><h2>Caça-palavras do mar</h2></div><p>Encontre as palavras na horizontal (→) e na vertical (↓).</p>
      <div class="frame" style="height:175mm;margin-top:4mm">${cp.svg}</div>
      <div style="display:flex;flex-wrap:wrap;gap:3mm;margin-top:5mm">${cp.palavras.map((w) => `<span class="tag" style="font-size:13pt">${w}</span>`).join('')}</div>${foot('Atividade')}`),
    page(`<div class="head"><div class="num">3</div><h2>Conte e escreva</h2></div><p>Conte quantos tem em cada quadro e escreva o número na linha. Depois, pinte tudo!</p><div class="frame" style="height:215mm;margin-top:4mm">${contar()}</div>${foot('Atividade')}`),
    page(`<div class="head"><div class="num">4</div><h2>Ligue os pontos</h2></div><p>Ligue os pontos na ordem dos números e descubra o que a Pérola perdeu.</p><div class="frame" style="margin-top:4mm">${ligarPontos()}</div>${foot('Atividade')}`),
    page(`<div class="head"><div class="num">5</div><h2>Complete o desenho</h2></div><p>Este desenho tem só a metade. Copie o outro lado, quadradinho por quadradinho, e depois pinte.</p><div class="frame" style="margin-top:4mm">${simetria()}</div>${foot('Atividade')}`),
  ];
};

const linhas = (n) => `<div class="lines">${'<div></div>'.repeat(n)}</div>`;
const desafios = () => [
  page(`<div class="head"><div class="num">1</div><h2>Desafio das 3 cores</h2></div>
    <p style="font-size:13pt">Pinte a concha usando <b>só 3 cores</b>. Escolha com carinho, porque ela vai ser a concha mais especial do reino!</p>
    <div style="display:flex;gap:6mm;margin:6mm 0">${['1ª cor', '2ª cor', '3ª cor'].map((t) => `<div style="text-align:center"><div style="width:22mm;height:22mm;border-radius:50%;border:.8mm solid var(--ink)"></div><b>${t}</b></div>`).join('')}</div>
    <div class="frame" style="height:165mm">${svg(shell(300, 300, 3.2, 0), '0 0 600 600')}</div>${foot('Desafio')}`),
  page(`<div class="head"><div class="num">2</div><h2>Desafio da história</h2></div>
    <p style="font-size:13pt">Invente uma história usando estas três palavras: <b>pérola</b>, <b>tempestade</b> e <b>golfinho amigo</b>. Escreva ou conte em voz alta para alguém!</p>
    <div class="card" style="margin:6mm 0"><span class="hand" style="font-size:20pt">Era uma vez, no fundo do mar...</span></div>${linhas(13)}
    <p style="margin-top:6mm"><span class="box"></span>Contei a minha história para alguém.</p>${foot('Desafio')}`),
  page(`<div class="head"><div class="num">3</div><h2>Desafio da memória</h2></div>
    <p style="font-size:13pt">Olhe a cena abaixo por <b>30 segundos</b>. Depois cubra com uma folha e desenhe, na moldura de baixo, tudo o que você lembrar.</p>
    <div class="frame" style="height:85mm;margin:5mm 0">${svg(chest(130, 400, 0.9) + seahorse(380, 300, 0.7) + starfish(480, 480, 0.5) + fish(250, 160, 0.5) + shell(70, 140, 0.4) + bubble(520, 110, 20), '0 0 600 560')}</div>
    <div class="frame" style="height:100mm;border-style:dashed"></div>
    <p style="margin-top:4mm">Quantas coisas você lembrou? <span class="box"></span><span class="box"></span><span class="box"></span><span class="box"></span><span class="box"></span><span class="box"></span></p>${foot('Desafio')}`),
  page(`<div class="head"><div class="num">4</div><h2>Desafio da dança das ondas</h2></div>
    <p style="font-size:13pt">Ponha uma música de que você gosta e faça cada passo. Marque quando conseguir!</p>
    <ul class="chk" style="font-size:14pt;margin-top:4mm">
      <li><span class="box"></span><b>Onda pequena:</b> balance os braços devagarzinho.</li>
      <li><span class="box"></span><b>Onda grande:</b> levante os braços e gire.</li>
      <li><span class="box"></span><b>Cauda de sereia:</b> junte as pernas e pule como uma sereia.</li>
      <li><span class="box"></span><b>Mergulho:</b> agache bem baixinho, em silêncio.</li>
      <li><span class="box"></span><b>Estrela-do-mar:</b> abra os braços e as pernas e fique parada.</li>
      <li><span class="box"></span><b>Final:</b> uma reverência de rainha do mar!</li></ul>
    <div style="width:70mm;margin:8mm auto 0">${svg(mermaid(300, 170, 1.0, 'curly') + sparkle(60, 60, 1) + sparkle(540, 90, 1), '0 0 600 500')}</div>${foot('Desafio')}`),
  page(`<div class="head"><div class="num">5</div><h2>Desafio da gentileza</h2></div>
    <p style="font-size:13pt">As sereias do reino adoram ajudar. Faça um gesto de gentileza por dia durante uma semana e pinte uma pérola para cada um.</p>
    <div style="margin-top:6mm">${['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'].map((d) => `<div class="card" style="display:flex;align-items:center;gap:5mm;padding:3mm 5mm;margin-top:3mm"><div style="width:14mm">${svg(pearl(50, 50, 40), '0 0 100 100')}</div><b style="width:18mm">${d}</b><div style="flex:1;border-bottom:.5mm solid #C9C3E4;height:7mm"></div></div>`).join('')}</div>
    <p style="margin-top:5mm;font-size:10pt;color:#6b6791">Ideias: dar um abraço, guardar os brinquedos, elogiar alguém, ajudar a pôr a mesa, dividir um lanche, fazer um desenho de presente.</p>${foot('Desafio')}`),
];

const especiais = () => [
  page(`<div style="border:2mm double var(--ink);border-radius:8mm;height:100%;padding:12mm;text-align:center;display:flex;flex-direction:column;align-items:center">
    <div style="width:60mm">${svg(crown(300, 120, 1.6) + sparkle(100, 80, 1.3) + sparkle(500, 80, 1.3), '0 0 600 220')}</div>
    <h1 style="font-size:34pt;margin-top:4mm">Certificado de Sereia Encantada</h1>
    <p style="font-size:14pt;margin-top:6mm">O Reino das Sereias Encantadas declara que</p>
    <div style="width:130mm;border-bottom:.8mm solid var(--ink);height:16mm;margin:4mm 0"></div>
    <p style="font-size:14pt">completou suas aventuras com muita coragem, criatividade e imaginação, e agora é oficialmente uma</p>
    <h2 style="font-size:26pt;margin-top:4mm;color:var(--teal)">Sereia Encantada!</h2>
    <div style="width:70mm;margin:6mm 0">${svg(mermaid(300, 170, 1.0, 'long') + shell(80, 420, 0.6) + starfish(520, 430, 0.5), '0 0 600 520')}</div>
    <p>Data: ____ / ____ / ________ &nbsp;&nbsp;&nbsp; Assinatura da Rainha: ______________</p></div>${foot('Especial · pinte o certificado')}`),
  page(`<div class="head"><div class="num">2</div><h2>Meu diário do reino</h2></div>
    <div class="card"><b>Hoje eu me sinto:</b> 😀 😊 😐 😢 😴 (circule) &nbsp;&nbsp; <b>Data:</b> ___/___/_____</div>
    <h3 style="margin:5mm 0 1mm">A melhor coisa do meu dia foi...</h3>${linhas(4)}
    <h3 style="margin:5mm 0 1mm">Se eu fosse uma sereia, meu nome seria...</h3>${linhas(2)}
    <h3 style="margin:5mm 0 3mm">Desenhe como seria o seu reino:</h3><div class="frame" style="height:78mm;border-style:dashed"></div>${foot('Especial')}`),
  page(`<div class="head"><div class="num">3</div><h2>O mapa do reino</h2></div><p>Pinte o mapa e trace o caminho até o tesouro. Cada ilha tem um segredo!</p><div class="frame" style="margin-top:4mm;height:222mm">${mapa()}</div>${foot('Especial')}`),
  page(`<div class="head"><div class="num">4</div><h2>Cartão para presentear</h2></div><p>Pinte, recorte e dobre ao meio. Entregue para alguém que você ama.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:.8mm dashed var(--ink);margin-top:6mm;height:200mm">
      <div style="border-right:.8mm dashed var(--ink);padding:6mm;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center">${svg(mermaid(300, 190, 1.0, 'bun') + crown(300, 8, 0.5) + sparkle(70, 80, 1.2) + sparkle(530, 120, 1), '0 0 600 560')}<h2 style="font-size:18pt">Para você, com carinho!</h2></div>
      <div style="padding:8mm;display:flex;flex-direction:column;justify-content:center"><h3>Para: ________________</h3><div style="margin:10mm 0"><span class="hand" style="font-size:18pt">Você é muito especial, como uma pérola no fundo do mar.</span></div><h3>De: ________________</h3></div>
    </div>${foot('Especial')}`),
  page(`<div class="head"><div class="num">5</div><h2>Minha família sereia</h2></div><p>Desenhe sua família como sereias e tritões dentro da moldura mágica.</p>
    <div class="frame" style="height:215mm;position:relative;margin-top:4mm">${svg(
      shell(70, 70, 0.5) + shell(530, 70, 0.5) + starfish(70, 540, 0.45) + starfish(530, 540, 0.45) + sparkle(300, 50, 1.2) + bubble(150, 60, 14) + bubble(450, 66, 18) + bubble(60, 300, 12) + bubble(545, 320, 16) +
      `<rect x="110" y="110" width="380" height="380" rx="26" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>`, '0 0 600 600')}</div>${foot('Especial')}`),
];

const bonus = () => {
  const cartao = (n, txt, onde) => `<div class="clue"><span class="n">Pista ${n}</span><div class="hand" style="font-size:17pt;line-height:1.2">${txt}</div><div class="hide">Pai ou mãe: esconda a próxima pista ${onde}.</div></div>`;
  return [
    page(`<div style="text-align:center"><div style="width:60mm;margin:0 auto">${svg(chest(300, 260, 1.6) + sparkle(90, 70, 1.2) + sparkle(510, 90, 1.4) + pearl(300, 80, 22), '0 0 600 400')}</div>
      <h1 style="font-size:30pt;color:var(--teal)">Bônus: Caça ao Tesouro Encantado</h1></div>
      <p style="margin:5mm 0;font-size:13pt">A rainha do mar escondeu um tesouro em algum lugar da casa. Para chegar até ele, é preciso seguir as pistas das quatro sereias, uma etapa por vez.</p>
      <div class="card"><h3>Como preparar (5 minutos)</h3><ul class="chk">
        <li><span class="box"></span>Imprima as páginas do bônus e recorte os cartões de pista.</li>
        <li><span class="box"></span>Esconda a primeira pista e deixe as outras para esconder no caminho.</li>
        <li><span class="box"></span>Separe uma caixa ou saquinho: ela será o baú do tesouro.</li>
        <li><span class="box"></span>Coloque dentro uma surpresa simples (veja ideias na última etapa).</li></ul></div>
      <div class="card"><h3>As quatro etapas</h3>
        <p><b>1. Procure</b> a primeira pista &nbsp; <b>2. Descubra</b> o que o enigma esconde<br><b>3. Avance</b> pela casa com a ajuda do mapa &nbsp; <b>4. Encontre</b> o tesouro!</p></div>${foot('Bônus')}`),
    page(`<div class="head"><div class="num">1</div><h2>Etapa 1 · Procure</h2></div><p>Marina precisa da sua ajuda! Recorte os cartões e esconda cada um no lugar indicado.</p>
      ${cartao(1, 'Sou fria por dentro e guardo o que é gostoso. Procure onde o leite fica gelado.', 'na geladeira ou na cozinha')}
      ${cartao(2, 'Você deita em mim para sonhar. Procure debaixo do meu travesseiro.', 'na cama de algum morador')}
      ${cartao(3, 'Eu protejo seus pezinhos. Olhe dentro de um par de sapatos.', 'perto da porta da casa')}
      <div style="width:44mm;margin:7mm auto 0">${svg(mermaid(300, 170, 1.0, 'long'), '0 0 600 520')}</div>${foot('Bônus')}`),
    page(`<div class="head"><div class="num">2</div><h2>Etapa 2 · Descubra</h2></div><p>Pérola criou enigmas. Descubra a resposta e vá até o lugar certo!</p>
      ${cartao(4, 'Tenho espuma e água, mas não sou o mar. Onde você toma banho?', 'no banheiro')}
      ${cartao(5, 'Guardo histórias sem falar nada. Procure entre as páginas de um livro.', 'na estante ou no quarto')}
      ${cartao(6, 'Tenho folhas, mas não sou livro, e sou verdinha. A resposta mora no jardim ou no vaso.', 'em uma planta ou no quintal')}
      <div style="width:44mm;margin:7mm auto 0">${svg(mermaid(300, 170, 1.0, 'bun'), '0 0 600 520')}</div>${foot('Bônus')}`),
    page(`<div class="head"><div class="num">3</div><h2>Etapa 3 · Avance</h2></div><p>Corália desenhou um mapa. Pinte e depois siga o caminho: cada passo é uma tarefa para avançar!</p>
      <ul class="chk" style="font-size:13pt;margin-top:3mm">
        <li><span class="box"></span>Dê 10 pulinhos como um peixe.</li>
        <li><span class="box"></span>Engatinhe como uma tartaruga até a sala.</li>
        <li><span class="box"></span>Nade no ar (sem sair do lugar) contando até 15.</li>
        <li><span class="box"></span>Faça sua melhor pose de sereia por 5 segundos.</li></ul>
      <div class="frame" style="height:135mm;margin-top:4mm">${mapa()}</div>${foot('Bônus')}`),
    page(`<div class="head"><div class="num">4</div><h2>Etapa 4 · Encontre o tesouro!</h2></div>
      <div style="width:90mm;margin:2mm auto">${svg(chest(300, 270, 1.9) + key(90, 90, 1.1, -20) + sparkle(520, 80, 1.4) + pearl(500, 400, 24), '0 0 600 420')}</div>
      <div class="card"><h3>Parabéns, exploradora!</h3><p>Você seguiu todas as pistas e encontrou o tesouro da rainha do mar. Abra o baú e escolha a sua surpresa.</p></div>
      <div class="card"><h3>Ideias para o baú</h3><ul class="chk"><li><span class="box"></span>Uma fruta ou um lanche especial</li><li><span class="box"></span>Adesivos, uma fita de cabelo ou um colar de contas</li><li><span class="box"></span>Um vale "escolher a história de hoje"</li><li><span class="box"></span>Uma sessão de brincadeira com a família</li></ul></div>
      <p style="margin-top:5mm" class="hand"><span style="font-size:18pt">Guarde este livro: toda sereia quer voltar ao reino para uma nova aventura.</span></p>${foot('Bônus')}`),
  ];
};

const livro = () => {
  pageNo = 0;
  const partes = [capa(), boasVindas(), ...colorir.map(paginaColorir), ...atividades(), ...desafios(), ...especiais(), ...bonus()];
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Mundo das Sereias Encantadas</title><style>${CSS}</style></head><body>${partes.join('\n')}</body></html>`;
};

const bw = (html) => html.replace('</style>', '.cover{background:#fff!important}.cover h1{color:var(--ink)!important;text-shadow:none!important}.head .num{background:#fff!important;color:var(--ink)!important;border:.6mm solid var(--ink)}.card{background:#fff!important}</style>');

mkdirSync(join(ROOT, 'html'), { recursive: true });
const html = livro();
writeFileSync(join(ROOT, 'html', 'livro.html'), html);
if (process.argv[2] !== 'html') {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const ctx = await browser.newContext();
  for (const [nome, h] of [['reino-das-sereias.pdf', html], ['reino-das-sereias-pb.pdf', bw(html)]]) {
    const p = await ctx.newPage();
    await p.setContent(h, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: join(ROOT, nome), format: 'A4', printBackground: true, preferCSSPageSize: true });
    await p.close();
    console.log('gerado', nome);
  }
  await browser.close();
}
