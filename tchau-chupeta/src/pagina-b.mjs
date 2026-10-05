// Gera a variante B da página de vendas em pagina-vendas/b/index.html (publicada em /b).
// Uso: node src/pagina-b.mjs
// Ângulo: a própria chupeta (Chupi) pede uma despedida. Gatilhos diferentes da página A:
// narrativa em 1ª pessoa, contador interativo, diagnóstico personalizado, mitos × verdades,
// compromisso com a data do tchau, ancoragem "por dia" e fechamento com P.S.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OFERTA, esc, valor, pixelTag } from './oferta.mjs';
import { C, pacifier, star, sparkle } from './illustrations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'pagina-vendas', 'b');

// Cada botão leva no máximo à próxima seção; só os botões da oferta e do P.S. levam ao checkout.
const prox = (texto, alvo, extra = '') =>
  `<a class="btn ${extra}" href="${alvo}">${texto} <span aria-hidden="true">↓</span></a>`;
const ctaCheckout = (texto, extra = '') =>
  `<a class="btn ${extra}" href="${esc(OFERTA.checkout)}" data-checkout>${texto} <span aria-hidden="true">→</span></a>`;

const selos = `<ul class="selos">
  <li>🔒 Compra segura</li><li>⚡ Acesso imediato</li><li>🛡️ ${OFERTA.garantiaDias} dias de garantia</li>
</ul>`;

const porDia = valor / 30;
const ancora = porDia < 1
  ? 'menos de <b>R$ 1 por dia</b> durante um mês'
  : `cerca de <b>R$ ${porDia.toFixed(2).replace('.', ',')} por dia</b> durante um mês`;

const quiz = [
  { q: 'Quando seu filho usa a chupeta?', o: ['Só para dormir', 'Em vários momentos do dia', 'Praticamente o tempo todo'] },
  { q: 'Vocês já tentaram tirar?', o: ['Ainda não', 'Uma vez', 'Várias vezes, e ela voltou'] },
  { q: 'Os adultos da casa concordam sobre como fazer?', o: ['Sim, estamos alinhados', 'Mais ou menos', 'Não, cada um faz de um jeito'] },
];

const mitos = [
  { m: '“É só esconder e dizer que sumiu.”', v: 'Para a criança, sumir sem explicação parece perda. Quando ela entende o que está acontecendo, a mudança deixa de ser uma surpresa.' },
  { m: '“Se chorar, é porque não está pronto.”', v: 'Sentir falta faz parte de qualquer despedida. O que ajuda é ter um plano para acolher esses momentos, em vez de voltar atrás no susto.' },
  { m: '“Quanto mais rápido, melhor.”', v: 'Pressa sem preparo costuma virar o ciclo “tira, chora, devolve”. Cada criança tem seu ritmo, e preparar antes faz parte do caminho.' },
  { m: '“Isso é assunto só da mãe.”', v: 'Quando pai, avós e babá seguem o mesmo combinado, a criança recebe a mesma mensagem de todo mundo. A despedida é da família.' },
];

const fases = [
  { quando: 'Antes', cor: C.peach, itens: ['<b>Preparar:</b> como avisar seu filho com antecedência e leveza.', '<b>Contar a história:</b> a narrativa que dá sentido ao tchau.'] },
  { quando: 'Durante', cor: C.sun, itens: ['<b>Envolver seu filho:</b> ele participa das escolhas.', '<b>O dia do tchau:</b> o roteiro do grande dia, do começo ao fim.'] },
  { quando: 'Depois', cor: C.mint, itens: ['<b>Acolher os dias seguintes:</b> o que dizer quando ele pedir a chupeta e como manter o combinado.'] },
];

const bonusHtml = OFERTA.bonus.length
  ? OFERTA.bonus.map((b) => `<li><span class="ic">🎁</span><div><b>Bônus: ${esc(b.titulo)}</b><br>${esc(b.texto)}</div></li>`).join('')
  : '';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tchau Chupeta — Um recado da chupeta do seu filho</title>
<meta name="description" content="A chupeta não precisa sumir. Ela pode se despedir. Conheça o passo a passo para uma despedida da qual seu filho participa.">
<meta property="og:title" content="Um recado da chupeta do seu filho">
<meta property="og:description" content="A chupeta não precisa sumir. Ela pode se despedir.">
<meta name="theme-color" content="${C.cream}">
<link rel="preload" href="../fonts/Baloo2-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Baloo 2';font-weight:400 800;font-display:swap;src:url(../fonts/Baloo2-latin.woff2) format('woff2')}
@font-face{font-family:'Nunito';font-weight:200 1000;font-display:swap;src:url(../fonts/Nunito-latin.woff2) format('woff2')}
:root{
  --cream:${C.cream};--peach:${C.peach};--peach-deep:${C.peachDeep};--lav:${C.lavender};--lav-deep:${C.lavenderDeep};
  --mint:${C.mint};--mint-deep:${C.mintDeep};--sun:${C.sun};--night:${C.night};--night-deep:${C.nightDeep};
  --ink:${C.ink};--ink-soft:${C.inkSoft};--paper:#FFFDF8;--r:22px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',system-ui,sans-serif;font-size:18px;line-height:1.6;color:var(--ink);background:var(--cream);-webkit-font-smoothing:antialiased;overflow-x:hidden}
svg{max-width:100%;height:auto;display:block}
h1,h2,h3{font-family:'Baloo 2',system-ui,sans-serif;line-height:1.12;font-weight:800;letter-spacing:-.01em}
h1{font-size:clamp(34px,6vw,56px)}
h2{font-size:clamp(28px,4.4vw,40px);margin-bottom:16px}
h3{font-size:21px}
p+p{margin-top:14px}
.narrow{max-width:720px;margin:0 auto;padding:0 20px}
.wrap{max-width:1040px;margin:0 auto;padding:0 20px}
section{padding:76px 0}
.center{text-align:center}
.kicker{display:inline-block;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--lav-deep);margin-bottom:10px}
.hl{background:linear-gradient(transparent 58%,var(--sun) 58%);padding:0 4px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;
  color:#fff;background:var(--lav-deep);padding:17px 32px;border-radius:999px;text-decoration:none;box-shadow:0 7px 0 #6A55B3,0 14px 30px rgba(140,116,214,.3);
  transition:transform .15s,box-shadow .15s;text-align:center}
.btn:hover{transform:translateY(-2px)}
.btn:active{transform:translateY(5px);box-shadow:0 2px 0 #6A55B3}
.btn[data-checkout]{background:var(--peach-deep);box-shadow:0 8px 0 #C96E5A,0 14px 30px rgba(242,142,120,.35)}
.btn[data-checkout]:active{box-shadow:0 3px 0 #C96E5A}
.btn.full{width:100%}
.btn.pulse{animation:pulse 2.6s infinite}
@keyframes pulse{0%,100%{box-shadow:0 8px 0 #C96E5A,0 0 0 0 rgba(242,142,120,.55)}50%{box-shadow:0 8px 0 #C96E5A,0 0 0 16px rgba(242,142,120,0)}}
.btn:not([data-checkout]).pulse{animation-name:pulseLav}
@keyframes pulseLav{0%,100%{box-shadow:0 7px 0 #6A55B3,0 0 0 0 rgba(140,116,214,.5)}50%{box-shadow:0 7px 0 #6A55B3,0 0 0 16px rgba(140,116,214,0)}}
.acao{margin-top:34px;text-align:center}
.selos{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:center;margin-top:16px;font-size:14px;font-weight:700;opacity:.85}

/* hero */
.hero{background:radial-gradient(ellipse at 20% 0%,#FFE3D6 0%,var(--cream) 60%);padding:46px 0 70px;position:relative;overflow:hidden}
.hero .grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:36px;align-items:center}
.hero .chupi{position:relative;max-width:300px;margin:0 auto;animation:float 5s ease-in-out infinite}
.balao{position:relative;background:#fff;border-radius:28px;padding:30px 30px 26px;box-shadow:0 16px 50px rgba(59,52,112,.12)}
.balao::before{content:'';position:absolute;left:-18px;top:60px;border:12px solid transparent;border-right:18px solid #fff;border-left:0}
.balao .quem{font-weight:800;color:var(--peach-deep);font-size:15px;margin-bottom:8px}
.hero h1 b{color:var(--lav-deep)}
.hero .sub{font-size:19px;margin-top:16px;color:var(--ink-soft)}
.star{position:absolute;animation:twinkle 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(3deg)}}
@keyframes twinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}

/* carta */
.carta-sec{background:var(--lav)}
.carta{background:var(--paper);border-radius:8px;padding:44px 40px;box-shadow:0 24px 60px rgba(42,37,86,.18);position:relative;
  background-image:repeating-linear-gradient(transparent,transparent 33px,rgba(140,116,214,.13) 33px,rgba(140,116,214,.13) 34px);line-height:34px;font-size:19px;transform:rotate(-.6deg)}
.carta::before{content:'';position:absolute;top:-14px;left:50%;transform:translateX(-50%) rotate(-3deg);width:120px;height:30px;background:rgba(255,214,107,.75);border-radius:3px}
.carta p+p{margin-top:34px}
.carta .ass{display:flex;align-items:center;gap:12px;margin-top:22px;font-family:'Baloo 2';font-weight:800;font-size:24px;color:var(--peach-deep)}
.carta .ass svg{width:54px}

/* contador */
.contador{background:#fff;border-radius:var(--r);padding:32px;box-shadow:0 10px 40px rgba(59,52,112,.08);text-align:center}
.contador label{font-weight:800;display:block;margin-bottom:6px}
.contador .n{font-family:'Baloo 2';font-weight:800;font-size:64px;line-height:1;color:var(--lav-deep)}
input[type=range]{width:100%;margin:18px 0 8px;accent-color:var(--lav-deep);height:28px}
.contas{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}
.contas div{background:var(--cream);border-radius:16px;padding:16px}
.contas b{display:block;font-family:'Baloo 2';font-size:34px;line-height:1.1;color:var(--peach-deep)}
.contador .msg{margin-top:18px;font-weight:700}

/* quiz */
.quiz-sec{background:linear-gradient(180deg,var(--cream),#FDEEE3)}
.pergunta{background:#fff;border-radius:var(--r);padding:24px;margin-top:16px;box-shadow:0 6px 24px rgba(59,52,112,.06)}
.pergunta h3{margin-bottom:12px}
.ops{display:grid;gap:10px}
.ops button{font:inherit;font-weight:700;text-align:left;padding:14px 18px;border-radius:14px;border:2px solid var(--lav);background:#fff;color:var(--ink);cursor:pointer;transition:.15s}
.ops button:hover{background:#F6F2FF}
.ops button[aria-pressed=true]{background:var(--lav-deep);border-color:var(--lav-deep);color:#fff}
.resultado{display:none;margin-top:22px;background:var(--night);color:#fff;border-radius:var(--r);padding:28px}
.resultado.on{display:block;animation:in .4s ease}
.resultado .tag{display:inline-block;background:var(--sun);color:var(--night-deep);font-weight:800;font-size:13px;border-radius:999px;padding:4px 12px;margin-bottom:10px}
.resultado h3{font-size:24px;margin-bottom:8px}
@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* mitos */
.mitos{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:28px}
.mito{background:#fff;border-radius:var(--r);overflow:hidden;box-shadow:0 6px 24px rgba(59,52,112,.06)}
.mito .m{background:#F1ECE6;padding:18px 22px;font-weight:800;color:#7A7488}
.mito .m span,.mito .v span{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
.mito .m span{color:#B9AEA4}
.mito .v{padding:18px 22px}
.mito .v span{color:var(--mint-deep);font-weight:800}

/* caminho */
.caminho-sec{background:var(--night);color:#fff}
.caminho-sec .kicker{color:var(--sun)}
.fases{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:30px}
.fase{background:rgba(255,255,255,.07);border-radius:var(--r);padding:24px;border-top:6px solid}
.fase h3{font-size:26px;margin-bottom:10px}
.fase ul{list-style:none}
.fase li{padding:6px 0;opacity:.92}

/* data */
.data-box{background:#fff;border-radius:var(--r);padding:32px;box-shadow:0 10px 40px rgba(59,52,112,.08);text-align:center}
.data-box input{font:inherit;font-weight:800;font-size:22px;padding:12px 18px;border-radius:14px;border:2px solid var(--lav);color:var(--ink);margin-top:10px;max-width:100%}
.data-msg{display:none;margin-top:20px;background:#EFF9F4;border-radius:16px;padding:18px 20px;font-weight:700}
.data-msg.on{display:block;animation:in .4s ease}
.data-msg b{font-family:'Baloo 2';font-size:30px;color:var(--mint-deep);display:block;line-height:1.1}

/* oferta */
.oferta{background:radial-gradient(ellipse at 50% 0%,#4C4390,var(--night-deep));color:#fff;position:relative;overflow:hidden}
.oferta .kicker{color:var(--sun)}
.box{background:#fff;color:var(--ink);border-radius:28px;max-width:540px;margin:30px auto 0;padding:34px 28px;box-shadow:0 30px 80px rgba(0,0,0,.35);position:relative}
.box .tag{position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:var(--sun);color:var(--night-deep);font-weight:800;font-size:14px;padding:6px 18px;border-radius:999px;white-space:nowrap}
.box .itens{list-style:none;margin:6px 0 20px}
.box .itens li{display:flex;gap:14px;padding:11px 0;border-bottom:1px dashed rgba(58,53,99,.15)}
.box .ic{font-size:22px;line-height:1.3}
.meudia{display:none;background:#EFF9F4;border-radius:14px;padding:10px 14px;font-weight:800;text-align:center;margin-bottom:16px}
.meudia.on{display:block}
.preco{text-align:center;margin-bottom:20px}
.preco .de{text-decoration:line-through;opacity:.55;font-weight:700}
.preco .por{font-family:'Baloo 2';font-weight:800;font-size:60px;line-height:1;color:var(--night)}
.preco .por small{font-size:26px}
.preco .parc{font-weight:700;color:var(--ink-soft)}
.preco .dia{margin-top:6px;color:var(--ink-soft)}
.box .selos{color:var(--ink)}

/* garantia */
.garantia{display:flex;gap:26px;align-items:center;background:#fff;border-radius:28px;padding:30px;box-shadow:0 10px 40px rgba(59,52,112,.08)}
.selo{flex:0 0 130px;height:130px;border-radius:50%;background:var(--mint);display:grid;place-content:center;text-align:center;font-family:'Baloo 2';font-weight:800;color:var(--night-deep);line-height:1;box-shadow:0 0 0 8px #E3F5EE}
.selo .d{font-size:50px}
.selo small{font-size:14px}

/* ps */
.ps{background:var(--paper)}
.ps .linha{border-left:5px solid var(--peach);padding-left:20px}
.ps .linha+.linha{margin-top:20px}
.ps b.t{font-family:'Baloo 2';font-size:22px;color:var(--peach-deep)}

footer{background:var(--night-deep);color:rgba(255,255,255,.6);font-size:13px;text-align:center;padding:30px 20px 110px}
footer p+p{margin-top:8px}

.sticky{position:fixed;left:0;right:0;bottom:0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:rgba(255,247,238,.96);backdrop-filter:blur(8px);box-shadow:0 -6px 24px rgba(42,37,86,.15);z-index:50;transform:translateY(110%);transition:transform .3s}
.sticky.on{transform:none}
.sticky .btn{width:100%;font-size:18px;padding:14px 20px}
@media(min-width:861px){.sticky{display:none}footer{padding-bottom:30px}}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.vis{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}

@media(max-width:860px){
  body{font-size:17px}
  section{padding:58px 0}
  .hero{padding:24px 0 54px}
  .hero .grid{grid-template-columns:1fr;gap:6px}
  .hero .chupi{max-width:150px}
  .balao::before{left:50%;top:-18px;transform:translateX(-50%);border:12px solid transparent;border-bottom:18px solid #fff;border-top:0}
  .balao{padding:24px 22px}
  .carta{padding:34px 22px;font-size:17px}
  .mitos,.fases,.contas{grid-template-columns:1fr}
  .garantia{flex-direction:column;text-align:center}
  .btn{font-size:18px;padding:16px 22px;width:100%}
}
</style>
${pixelTag('pagina-b')}
</head>
<body>

<!-- 1. HERO: a chupeta fala (curiosidade + quebra de padrão) -->
<header class="hero" id="topo">
  <span class="star" style="top:12%;left:6%">${star(16, C.lavender)}</span>
  <span class="star" style="top:18%;right:8%;animation-delay:1s">${sparkle(18, C.peach)}</span>
  <div class="wrap grid">
    <div class="chupi" aria-hidden="true">${pacifier({ size: 300, wave: true })}</div>
    <div class="balao">
      <p class="quem">A chupeta do seu filho diz:</p>
      <h1>“Eu não quero sumir. <b>Eu quero me despedir.</b>”</h1>
      <p class="sub">Ela tem um recado para você. E ele pode mudar o jeito como a sua família vai viver o tchau da chupeta.</p>
      <div class="acao" style="text-align:left">${prox('Ler o recado da chupeta', '#carta', 'pulse')}</div>
    </div>
  </div>
</header>

<!-- 2. A CARTA (storytelling + empatia) -->
<section class="carta-sec" id="carta">
  <div class="narrow">
    <div class="carta reveal">
      <p>Oi, mãe. Oi, pai.</p>
      <p>Eu sei que vocês estão cansados de me procurar embaixo do sofá às 2 da manhã. Eu sei que já tentaram me esconder, me jogar fora, dizer que eu fui morar com outro bebê… e no fim eu sempre voltei.</p>
      <p>Não foi culpa de vocês. É que, para o seu filho, eu sou <b>conforto</b>. Quando eu desapareço de repente, ele não entende para onde eu fui. Ele só sente que perdeu alguma coisa importante.</p>
      <p>Então eu queria pedir uma coisa: <b>não me façam sumir. Me deixem ir embora do jeito certo.</b> Avisem ele antes. Contem uma história sobre mim. Deixem ele me dar tchau.</p>
      <p>Prometo que vou embora mais tranquila assim. E ele vai lembrar desse dia com orgulho.</p>
      <div class="ass"><span aria-hidden="true">${pacifier({ size: 54 })}</span>Com carinho, a Chupeta</div>
    </div>
    <div class="acao reveal">${prox('Continuar', '#contador')}</div>
  </div>
</section>

<!-- 3. CONTADOR (especificidade + custo de continuar como está) -->
<section id="contador">
  <div class="narrow">
    <div class="center reveal">
      <span class="kicker">Faça a conta</span>
      <h2>Quantas vezes por dia você ouve “me dá a chupeta”?</h2>
    </div>
    <div class="contador reveal">
      <label for="vezes">Arraste até o número mais perto da sua realidade</label>
      <div class="n"><span id="vezesN">15</span>x</div>
      <input type="range" id="vezes" min="1" max="40" value="15" aria-describedby="contaMsg">
      <div class="contas">
        <div><b id="semana">105</b>pedidos por semana</div>
        <div><b id="mes">450</b>pedidos por mês</div>
      </div>
      <p class="msg" id="contaMsg">Cada pedido é uma pequena negociação. Não é falta de paciência sua: é que ninguém te mostrou como encerrar esse ciclo com carinho.</p>
    </div>
    <div class="acao reveal">${prox('Descobrir por onde começar', '#quiz')}</div>
  </div>
</section>

<!-- 4. DIAGNÓSTICO (personalização + microcompromisso) -->
<section class="quiz-sec" id="quiz">
  <div class="narrow">
    <div class="center reveal">
      <span class="kicker">Diagnóstico rápido · 3 perguntas</span>
      <h2>Por onde a despedida do seu filho deve começar?</h2>
    </div>
    ${quiz.map((p, i) => `<div class="pergunta reveal" data-q="${i}">
      <h3>${i + 1}. ${p.q}</h3>
      <div class="ops">${p.o.map((o, j) => `<button type="button" data-v="${j}" aria-pressed="false">${o}</button>`).join('')}</div>
    </div>`).join('\n    ')}
    <div class="resultado" id="resultado" aria-live="polite">
      <span class="tag">Seu ponto de partida</span>
      <h3 id="resTitulo"></h3>
      <p id="resTexto"></p>
    </div>
    <div class="acao reveal">${prox('Ver o que é mito e o que é verdade', '#mitos')}</div>
  </div>
</section>

<!-- 5. MITOS × VERDADES (quebra de objeções) -->
<section id="mitos">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kicker">Mitos × verdades</span>
      <h2>O que todo mundo fala sobre tirar a chupeta (e o que realmente ajuda)</h2>
    </div>
    <div class="mitos">
      ${mitos.map((x) => `<div class="mito reveal"><div class="m"><span>Mito</span>${x.m}</div><div class="v"><span>Na prática</span>${x.v}</div></div>`).join('\n      ')}
    </div>
    <div class="acao reveal">${prox('Conhecer o caminho completo', '#caminho')}</div>
  </div>
</section>

<!-- 6. O CAMINHO (mecanismo: antes, durante e depois) -->
<section class="caminho-sec" id="caminho">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kicker">O Tchau Chupeta</span>
      <h2>Um passo a passo para o antes, o durante e o depois do tchau</h2>
      <p style="opacity:.9">Um ${esc(OFERTA.formato.toLowerCase())} que transforma a retirada da chupeta em uma despedida da qual seu filho participa. Lúdico, acolhedor e no ritmo da sua criança.</p>
    </div>
    <div class="fases">
      ${fases.map((f) => `<div class="fase reveal" style="border-color:${f.cor}"><h3 style="color:${f.cor}">${f.quando}</h3><ul>${f.itens.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
    <div class="acao reveal">${prox('Escolher o dia do tchau', '#data')}</div>
  </div>
</section>

<!-- 7. A DATA (compromisso + futuro concreto) -->
<section id="data">
  <div class="narrow">
    <div class="center reveal">
      <span class="kicker">Seu compromisso</span>
      <h2>Se você pudesse escolher hoje, qual seria o dia do tchau?</h2>
      <p>Uma despedida com data marcada deixa de ser “algum dia” e vira um plano. Escolha uma data possível para a sua família.</p>
    </div>
    <div class="data-box reveal">
      <label for="dia"><b>O dia do tchau da chupeta vai ser:</b></label><br>
      <input type="date" id="dia">
      <div class="data-msg" id="dataMsg" aria-live="polite"></div>
    </div>
    <div class="acao reveal">${prox('Ver como começar hoje', '#oferta')}</div>
  </div>
</section>

<!-- 8. OFERTA (ancoragem por dia) -->
<section class="oferta" id="oferta">
  <span class="star" style="top:10%;left:8%">${star(16)}</span>
  <span class="star" style="top:20%;right:10%;animation-delay:1s">${sparkle(18)}</span>
  <div class="narrow center reveal">
    <span class="kicker">Comece a preparação hoje</span>
    <h2>Tudo para a despedida da chupeta por ${ancora}</h2>
  </div>
  <div class="wrap">
    <div class="box reveal">
      <span class="tag">⚡ Acesso imediato no seu e-mail</span>
      <div class="meudia" id="meuDia"></div>
      <ul class="itens">
        <li><span class="ic">🌱</span><div><b>Antes:</b> como preparar seu filho e contar a história da despedida</div></li>
        <li><span class="ic">🌙</span><div><b>Durante:</b> como envolver a criança e o roteiro do dia do tchau</div></li>
        <li><span class="ic">💛</span><div><b>Depois:</b> o que dizer quando ele pedir a chupeta e como manter o combinado</div></li>
        <li><span class="ic">👨‍👩‍👧</span><div><b>Para a família toda:</b> pai, avós e babá no mesmo caminho</div></li>
        ${bonusHtml}
      </ul>
      <div class="preco" id="preco">
        ${OFERTA.precoDe ? `<div class="de">De R$ ${esc(OFERTA.precoDe)}</div>` : ''}
        <div class="por"><small>R$</small> ${esc(OFERTA.preco)}</div>
        ${OFERTA.parcelas ? `<div class="parc">ou ${esc(OFERTA.parcelas)}</div>` : ''}
        <div class="dia">Pagamento único · ${ancora}</div>
      </div>
      ${ctaCheckout('Quero o Tchau Chupeta', 'full pulse')}
      ${selos}
    </div>
  </div>
</section>

<!-- 9. GARANTIA (reversão de risco) -->
<section id="garantia">
  <div class="narrow">
    <div class="garantia reveal">
      <div class="selo"><span class="d">${OFERTA.garantiaDias}</span><small>dias para<br>testar</small></div>
      <div>
        <h2 style="font-size:28px;margin-bottom:8px">Leia, teste e decida com calma</h2>
        <p>Você tem ${OFERTA.garantiaDias} dias para conhecer o Tchau Chupeta. Se sentir que não é para a sua família, é só pedir o reembolso dentro do prazo e você recebe <b>100% do valor</b> de volta. Sem perguntas.</p>
      </div>
    </div>
  </div>
</section>

<!-- 10. P.S. (fechamento em formato de carta) -->
<section class="ps" id="ps">
  <div class="narrow">
    <div class="linha reveal"><b class="t">P.S.</b> Seu filho vai largar a chupeta um dia, isso é certo. O que ainda dá para escolher é <b>como</b> essa história vai ser contada: como um dia em que a chupeta sumiu, ou como o dia em que ele se despediu dela.</div>
    <div class="linha reveal"><b class="t">P.P.S.</b> Você não precisa de mais força de vontade. Precisa de um caminho. Por ${ancora}, ele está a um clique.</div>
    <div class="acao reveal">${ctaCheckout('Quero dar esse tchau do jeito certo', 'pulse')}${selos}</div>
  </div>
</section>

<footer>
  <p><b>Tchau Chupeta</b> © ${new Date().getFullYear()}. Todos os direitos reservados.</p>
  <p>Este material é educativo e não substitui a orientação de pediatras, odontopediatras ou outros profissionais de saúde. Cada criança tem seu próprio ritmo, e os resultados podem variar de família para família.</p>
</footer>

<div class="sticky" id="sticky">${prox('Continuar', '#carta')}</div>

<script>
function track(ev, data){ if (window.fbq) fbq('trackCustom', ev, Object.assign({ content_category: 'pagina-b' }, data || {})); }

// Contador de pedidos
(function(){
  var r = document.getElementById('vezes'), n = document.getElementById('vezesN'),
      s = document.getElementById('semana'), m = document.getElementById('mes');
  function upd(){ var v = +r.value; n.textContent = v; s.textContent = (v * 7).toLocaleString('pt-BR'); m.textContent = (v * 30).toLocaleString('pt-BR'); }
  r.addEventListener('input', upd); upd();
})();

// Diagnóstico
(function(){
  var resp = {}, res = document.getElementById('resultado'), done = false;
  document.querySelectorAll('.pergunta').forEach(function(box){
    box.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        box.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        resp[box.dataset.q] = +b.dataset.v;
        if (Object.keys(resp).length === 3) mostrar();
      });
    });
  });
  function mostrar(){
    var t, x;
    if (resp[2] > 0) { t = 'Comece pelo combinado da família'; x = 'Quando cada adulto faz de um jeito, a criança recebe mensagens diferentes. Antes do dia do tchau, vale alinhar todo mundo. O Tchau Chupeta mostra como colocar a família inteira no mesmo caminho.'; }
    else if (resp[1] === 2) { t = 'Comece quebrando o ciclo do “tira e devolve”'; x = 'Se a chupeta já voltou algumas vezes, o ponto-chave é ter um plano para o antes e para os dias seguintes, para não precisar voltar atrás no susto. É exatamente o que o passo a passo organiza.'; }
    else if (resp[0] === 2) { t = 'Comece pela preparação, com calma'; x = 'Quando a chupeta está presente o dia todo, avisar com antecedência e contar a história da despedida fazem ainda mais diferença. O Tchau Chupeta começa justamente por aí.'; }
    else { t = 'Você está num ótimo ponto de partida'; x = 'Família alinhada e uma rotina favorável: agora é preparar seu filho, contar a história e planejar o dia do tchau. O passo a passo te guia em cada etapa.'; }
    document.getElementById('resTitulo').textContent = t;
    document.getElementById('resTexto').textContent = x;
    res.classList.add('on');
    if (!done) { done = true; track('QuizConcluido', { resultado: t }); }
  }
})();

// Data do tchau
(function(){
  var inp = document.getElementById('dia'), msg = document.getElementById('dataMsg'), meu = document.getElementById('meuDia');
  var hoje = new Date(); hoje.setHours(0,0,0,0);
  var iso = function(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
  inp.min = iso(hoje);
  var tracked = false;
  inp.addEventListener('change', function(){
    if (!inp.value) return;
    var p = inp.value.split('-'), d = new Date(+p[0], +p[1]-1, +p[2]);
    var dias = Math.round((d - hoje) / 864e5);
    if (dias < 0) { msg.className = 'data-msg on'; msg.innerHTML = 'Escolha uma data a partir de hoje 🙂'; return; }
    var nome = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    var txt = dias === 0 ? 'É hoje!' : (dias === 1 ? 'Falta 1 dia' : 'Faltam ' + dias + ' dias');
    var extra = dias < 7
      ? 'Se puder, deixe um pouco mais de tempo: preparar seu filho antes é a primeira etapa da despedida.'
      : 'Tempo para preparar seu filho, contar a história e viver esse dia com calma.';
    msg.innerHTML = '<b>' + txt + '</b>' + extra;
    msg.className = 'data-msg on';
    meu.textContent = '📅 Seu dia do tchau: ' + nome;
    meu.className = 'meudia on';
    if (!tracked) { tracked = true; track('DataEscolhida', { dias: dias }); }
  });
})();

// Checkout: repassa UTMs e dispara InitiateCheckout
(function(){
  var q = location.search.slice(1);
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    if (q && a.href.indexOf('http') === 0) a.href += (a.href.indexOf('?') < 0 ? '?' : '&') + q;
    a.addEventListener('click', function(){ if (window.fbq) fbq('track', 'InitiateCheckout', { content_category: 'pagina-b', value: ${valor}, currency: 'BRL' }); });
  });
})();

// Barra fixa: leva à próxima seção abaixo da tela atual
(function(){
  var btn = document.querySelector('#sticky .btn');
  btn.addEventListener('click', function(ev){
    var secs = document.querySelectorAll('header.hero, section'), alvo = null;
    for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top > 80) { alvo = secs[i]; break; } }
    if (!alvo) return;
    ev.preventDefault();
    alvo.scrollIntoView({ behavior: 'smooth' });
  });
  var sticky = document.getElementById('sticky'), hero = document.querySelector('.hero'), oferta = document.getElementById('oferta');
  var pastHero = false, onOffer = false;
  function set(){ sticky.classList.toggle('on', pastHero && !onOffer); }
  new IntersectionObserver(function(e){ pastHero = !e[0].isIntersecting; set(); }).observe(hero);
  new IntersectionObserver(function(e){ onOffer = e[0].isIntersecting; set(); }, { threshold: .2 }).observe(oferta);
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
console.log('ok → pagina-vendas/b/index.html');
