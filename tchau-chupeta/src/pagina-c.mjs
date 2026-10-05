// Gera a variante C da página de vendas em pagina-vendas/c/index.html (publicada em /c).
// Uso: node src/pagina-c.mjs
// Ângulo: página curta e direta para a mãe cansada — "Você não precisa ser mais firme. Precisa de um plano."
// Gatilhos diferentes de A e B: reenquadramento de identidade, conversa no formato de chat,
// honestidade radical (o que NÃO prometemos), comparação hoje × com um plano (slider)
// e facilidade ("comece hoje à noite, pelo celular").

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OFERTA, esc, valor, pixelTag } from './oferta.mjs';
import { C, pacifier, star, sparkle, moon, familyHug } from './illustrations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'pagina-vendas', 'c');

// Cada botão leva no máximo à próxima seção; só o botão da oferta e o final levam ao checkout.
const prox = (texto, alvo, extra = '') =>
  `<a class="btn ${extra}" href="${alvo}">${texto} <span aria-hidden="true">↓</span></a>`;
const ctaCheckout = (texto, extra = '') =>
  `<a class="btn ${extra}" href="${esc(OFERTA.checkout)}" data-checkout>${texto} <span aria-hidden="true">→</span></a>`;

const chat = [
  ['eu', 'Já tentei de tudo. Escondi, joguei fora, falei que o gato levou… e ela sempre volta.'],
  ['tc', 'Não é falta de firmeza sua. Quando a chupeta some de repente, a criança não entende o que aconteceu. Sem um plano para o depois, o choro vence e ela volta.'],
  ['eu', 'E se ele chorar à noite?'],
  ['tc', 'Sentir falta faz parte de qualquer despedida. O guia mostra como preparar seu filho antes e o que fazer nos dias seguintes, para você não precisar voltar atrás no susto.'],
  ['eu', 'Tenho pouco tempo…'],
  ['tc', 'São etapas curtas, que cabem na rotina que você já tem. Você lê no celular e sabe exatamente o que fazer em cada fase.'],
  ['eu', 'E o resto da família? A avó sempre devolve 🙃'],
  ['tc', 'Tem uma parte só para isso: colocar pai, avós e babá no mesmo combinado. A despedida é da família inteira.'],
];

const naoPrometo = [
  ['Que vai ser em 1 dia', 'Cada criança tem seu ritmo. Pressa costuma virar o ciclo “tira, chora, devolve”.'],
  ['Que ninguém vai chorar', 'Sentir falta é normal. O que muda é você saber como acolher, em vez de improvisar.'],
  ['Uma fórmula mágica', 'É um passo a passo. Funciona como um mapa: você ainda faz o caminho, mas sem se perder.'],
];

const momentos = [
  ['☀️', 'De manhã', '“Mãe, cadê a chupeta?” antes mesmo de abrir os olhos.', 'Seu filho já sabe que a chupeta está se despedindo, porque vocês conversaram antes.'],
  ['🛝', 'No passeio', 'Você confere a bolsa três vezes com medo de esquecer a chupeta.', 'Você sabe o que dizer quando ele pedir, e todo mundo da família diz a mesma coisa.'],
  ['🌙', 'Na hora de dormir', 'Procura no escuro, embaixo do berço, às 2 da manhã.', 'Um plano para as primeiras noites e para acolher o que vier, sem voltar atrás.'],
];

const bonusHtml = OFERTA.bonus.length
  ? OFERTA.bonus.map((b) => `<li>🎁 <b>Bônus: ${esc(b.titulo)}</b> — ${esc(b.texto)}</li>`).join('')
  : '';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tchau Chupeta — Você não precisa ser mais firme</title>
<meta name="description" content="Você não precisa ser mais firme para tirar a chupeta. Precisa de um plano. Conheça o Tchau Chupeta.">
<meta property="og:title" content="Você não precisa ser mais firme. Precisa de um plano.">
<meta property="og:description" content="O passo a passo para a despedida da chupeta, no ritmo do seu filho.">
<meta name="theme-color" content="${C.mint}">
<link rel="preload" href="../fonts/Baloo2-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Baloo 2';font-weight:400 800;font-display:swap;src:url(../fonts/Baloo2-latin.woff2) format('woff2')}
@font-face{font-family:'Nunito';font-weight:200 1000;font-display:swap;src:url(../fonts/Nunito-latin.woff2) format('woff2')}
:root{
  --cream:${C.cream};--peach:${C.peach};--peach-deep:${C.peachDeep};--lav:${C.lavender};--lav-deep:${C.lavenderDeep};
  --mint:${C.mint};--mint-deep:${C.mintDeep};--mint-soft:#E6F6EF;--sun:${C.sun};--night:${C.night};--night-deep:${C.nightDeep};
  --ink:${C.ink};--ink-soft:${C.inkSoft};--r:22px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',system-ui,sans-serif;font-size:18px;line-height:1.6;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden}
svg{max-width:100%;height:auto;display:block}
h1,h2,h3{font-family:'Baloo 2',system-ui,sans-serif;line-height:1.1;font-weight:800;letter-spacing:-.01em}
h1{font-size:clamp(36px,6.4vw,62px)}
h2{font-size:clamp(28px,4.4vw,40px);margin-bottom:14px}
h3{font-size:21px}
.narrow{max-width:700px;margin:0 auto;padding:0 20px}
.wrap{max-width:1040px;margin:0 auto;padding:0 20px}
section{padding:72px 0}
.center{text-align:center}
.kicker{display:inline-block;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--mint-deep);margin-bottom:10px}
.risca{position:relative;white-space:nowrap}
.risca::after{content:'';position:absolute;left:-4px;right:-4px;top:54%;height:6px;background:var(--peach-deep);border-radius:4px;transform:rotate(-4deg)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;
  color:#fff;background:var(--mint-deep);padding:17px 32px;border-radius:999px;text-decoration:none;box-shadow:0 7px 0 #3F9A78,0 14px 30px rgba(93,184,150,.3);
  transition:transform .15s,box-shadow .15s;text-align:center}
.btn:hover{transform:translateY(-2px)}
.btn:active{transform:translateY(5px);box-shadow:0 2px 0 #3F9A78}
.btn[data-checkout]{background:var(--peach-deep);box-shadow:0 8px 0 #C96E5A,0 14px 30px rgba(242,142,120,.35)}
.btn[data-checkout]:active{box-shadow:0 3px 0 #C96E5A}
.btn.full{width:100%}
.btn.pulse{animation:pulse 2.6s infinite}
@keyframes pulse{0%,100%{filter:none;transform:scale(1)}50%{transform:scale(1.03)}}
.acao{margin-top:32px;text-align:center}
.selos{list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;justify-content:center;margin-top:16px;font-size:14px;font-weight:700;opacity:.8}

/* hero */
.hero{background:var(--mint);padding:52px 0 0;position:relative;overflow:hidden}
.hero .grid{display:grid;grid-template-columns:1.15fr .85fr;gap:30px;align-items:end}
.hero .txt{padding-bottom:64px}
.hero .pre{display:inline-block;background:#fff;border-radius:999px;padding:6px 16px;font-weight:800;font-size:14px;margin-bottom:18px}
.hero h1 .ok{color:var(--night);background:linear-gradient(transparent 60%,rgba(255,255,255,.85) 60%);padding:0 4px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.hero .sub{font-size:20px;margin:18px 0 28px;max-width:520px}
.hero .art{position:relative;align-self:end}
.hero .art .fam{max-width:400px;margin:0 auto}
.hero .art .moon{position:absolute;top:0;right:4%;width:90px;opacity:.9}
.star{position:absolute;animation:twinkle 3s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}

/* chat */
.chat-sec{background:#F4F1EC}
.fone{max-width:440px;margin:28px auto 0;background:#fff;border-radius:34px;box-shadow:0 24px 60px rgba(42,37,86,.14);overflow:hidden;border:8px solid var(--night-deep)}
.fone .topo{display:flex;align-items:center;gap:10px;background:var(--night);color:#fff;padding:12px 16px}
.fone .topo .av{width:40px;height:40px;border-radius:50%;background:var(--cream);display:grid;place-content:center}
.fone .topo .av svg{width:30px}
.fone .topo b{display:block;font-size:16px;line-height:1.2}
.fone .topo small{opacity:.75;font-size:12px}
.msgs{padding:18px 14px 22px;display:flex;flex-direction:column;gap:10px;background:#ECE7FB;min-height:200px}
.msg{max-width:84%;padding:10px 14px;border-radius:18px;font-size:16px;line-height:1.45;box-shadow:0 1px 2px rgba(0,0,0,.06)}
.msg.eu{align-self:flex-end;background:#DFF6E8;border-bottom-right-radius:6px}
.msg.tc{align-self:flex-start;background:#fff;border-bottom-left-radius:6px}
.js .msg{opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s}
.js .msg.on{opacity:1;transform:none}
.digitando{align-self:flex-start;background:#fff;border-radius:18px;padding:12px 16px;display:none;gap:4px}
.digitando.on{display:flex}
.digitando i{width:7px;height:7px;border-radius:50%;background:var(--ink-soft);animation:dot 1s infinite}
.digitando i:nth-child(2){animation-delay:.15s}.digitando i:nth-child(3){animation-delay:.3s}
@keyframes dot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
.aviso{font-size:13px;color:var(--ink-soft);text-align:center;margin-top:12px}

/* nao prometo */
.np{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:28px}
.np .card{border:2px dashed #E4DED6;border-radius:var(--r);padding:24px}
.np .x{font-family:'Baloo 2';font-weight:800;font-size:15px;color:var(--peach-deep);letter-spacing:.04em;text-transform:uppercase}
.np h3{margin:4px 0 8px;text-decoration:line-through;text-decoration-color:var(--peach-deep);text-decoration-thickness:3px}
.promessa{margin-top:22px;background:var(--mint-soft);border-radius:var(--r);padding:24px 26px;font-size:19px}
.promessa b{color:var(--mint-deep)}

/* hoje x plano */
.comp-sec{background:var(--night);color:#fff}
.comp-sec .kicker{color:var(--sun)}
.troca{display:flex;max-width:420px;margin:28px auto 0;background:rgba(255,255,255,.1);border-radius:999px;padding:6px}
.troca button{flex:1;font:inherit;font-family:'Baloo 2';font-weight:800;font-size:18px;border:0;border-radius:999px;padding:10px 12px;background:transparent;color:#fff;cursor:pointer;transition:.2s}
.troca button[aria-selected=true]{background:#fff;color:var(--night)}
.troca button.pl[aria-selected=true]{background:var(--mint);color:var(--night-deep)}
.comp{max-width:760px;margin:18px auto 0}
.lado{border-radius:var(--r);padding:26px 24px}
.lado[hidden]{display:none}
.lado.vis2{animation:in .35s ease}
@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.lado h3{font-size:22px;margin-bottom:6px}
.lado ul{list-style:none}
.lado li{display:flex;gap:12px;padding:12px 0;border-top:1px solid rgba(255,255,255,.12)}
.lado li:first-child{border-top:0}
.lado .e{font-size:24px;line-height:1.3}
.lado small{display:block;font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.hoje{background:#4A4380}
.plano{background:var(--mint);color:var(--night-deep)}
.plano li{border-top-color:rgba(42,37,86,.12)}
.dica{text-align:center;font-size:14px;opacity:.75;margin-top:12px}

/* oferta */
.oferta{background:var(--cream)}
.box{background:#fff;border-radius:28px;max-width:520px;margin:26px auto 0;padding:32px 26px;box-shadow:0 24px 60px rgba(42,37,86,.12);border:3px solid var(--mint)}
.box ul{list-style:none;margin-bottom:20px}
.box li{padding:9px 0 9px 30px;position:relative;border-bottom:1px dashed rgba(58,53,99,.14)}
.box li::before{content:'✓';position:absolute;left:4px;color:var(--mint-deep);font-weight:900}
.facil{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 22px;text-align:center}
.facil div{background:var(--mint-soft);border-radius:14px;padding:12px 6px;font-size:13px;font-weight:800;line-height:1.3}
.facil b{display:block;font-family:'Baloo 2';font-size:22px;color:var(--mint-deep)}
.preco{text-align:center;margin-bottom:20px}
.preco .de{text-decoration:line-through;opacity:.55;font-weight:700}
.preco .por{font-family:'Baloo 2';font-weight:800;font-size:60px;line-height:1;color:var(--night)}
.preco .por small{font-size:26px}
.preco .parc{font-weight:700;color:var(--ink-soft)}
.garantia{display:flex;gap:16px;align-items:center;margin-top:22px;background:#FFF6DD;border-radius:16px;padding:16px 18px;font-size:15px}
.garantia .s{flex:0 0 58px;height:58px;border-radius:50%;background:var(--sun);display:grid;place-content:center;font-family:'Baloo 2';font-weight:800;font-size:24px;color:var(--night-deep)}

/* final */
.final{background:var(--mint);text-align:center}
.final h2{max-width:640px;margin:0 auto 10px}
footer{background:var(--night-deep);color:rgba(255,255,255,.6);font-size:13px;text-align:center;padding:30px 20px 110px}
footer p+p{margin-top:8px}

.sticky{position:fixed;left:0;right:0;bottom:0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);backdrop-filter:blur(8px);box-shadow:0 -6px 24px rgba(42,37,86,.15);z-index:50;transform:translateY(110%);transition:transform .3s}
.sticky.on{transform:none}
.sticky .btn{width:100%;font-size:18px;padding:14px 20px}
@media(min-width:861px){.sticky{display:none}footer{padding-bottom:30px}}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.vis{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}.js .msg{opacity:1;transform:none}}

@media(max-width:860px){
  body{font-size:17px}
  section{padding:56px 0}
  .hero{padding-top:28px}
  .hero .grid{grid-template-columns:1fr;gap:0}
  .hero .txt{padding-bottom:20px;text-align:center}
  .hero .sub{margin-left:auto;margin-right:auto;font-size:18px}
  .hero .art .fam{max-width:250px}
  .hero .art .moon{width:56px}
  .np,.facil{grid-template-columns:1fr}
  .facil{grid-template-columns:repeat(3,1fr)}
  .lado{padding:20px 16px}
  .lado li{font-size:15px}
  .btn{font-size:18px;padding:16px 22px;width:100%}
}
</style>
${pixelTag('pagina-c')}
</head>
<body>
<script>document.documentElement.classList.add('js')</script>

<!-- 1. HERO: reenquadramento (não é falta de firmeza) -->
<header class="hero" id="topo">
  <span class="star" style="top:10%;left:5%">${star(16, '#fff')}</span>
  <span class="star" style="top:26%;left:52%;animation-delay:1.2s">${sparkle(16, '#fff')}</span>
  <div class="wrap grid">
    <div class="txt">
      <span class="pre">Para mães e pais cansados de tentar 💛</span>
      <h1>Você não precisa ser <span class="risca">mais firme</span>. <span class="ok">Precisa de um plano.</span></h1>
      <p class="sub">O <b>Tchau Chupeta</b> é o passo a passo para transformar a retirada da chupeta em uma despedida: preparada, combinada com a família e no ritmo do seu filho.</p>
      ${prox('Ver como funciona', '#conversa', 'pulse')}
    </div>
    <div class="art" aria-hidden="true">
      <div class="moon">${moon(90, '#fff')}</div>
      <div class="fam">${familyHug({ size: 400 })}</div>
    </div>
  </div>
</header>

<!-- 2. CONVERSA (formato nativo de chat, responde objeções) -->
<section class="chat-sec" id="conversa">
  <div class="narrow center">
    <span class="kicker">As perguntas que toda mãe faz</span>
    <h2>Uma conversa sincera sobre tirar a chupeta</h2>
  </div>
  <div class="narrow">
    <div class="fone" aria-label="Conversa">
      <div class="topo"><span class="av">${pacifier({ size: 30 })}</span><div><b>Tchau Chupeta</b><small>respondendo suas dúvidas</small></div></div>
      <div class="msgs" id="msgs">
        ${chat.map(([q, t]) => `<div class="msg ${q}">${t}</div>`).join('\n        ')}
        <div class="digitando" id="digitando" aria-hidden="true"><i></i><i></i><i></i></div>
      </div>
    </div>
    <p class="aviso">Conversa ilustrativa com as dúvidas mais comuns.</p>
    <div class="acao">${prox('Continuar', '#sinceridade')}</div>
  </div>
</section>

<!-- 3. HONESTIDADE RADICAL (o que NÃO prometemos) -->
<section id="sinceridade">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kicker">Sem letras miúdas</span>
      <h2>3 coisas que o Tchau Chupeta não promete</h2>
      <p>Você já ouviu promessas demais. Então vamos ser diretos.</p>
    </div>
    <div class="np">
      ${naoPrometo.map(([t, d]) => `<div class="card reveal"><span class="x">Não prometemos</span><h3>${t}</h3><p>${d}</p></div>`).join('\n      ')}
    </div>
    <div class="narrow">
      <p class="promessa reveal">O que ele entrega: <b>um caminho claro</b> para preparar seu filho, viver o dia do tchau e acolher os dias seguintes, sem precisar improvisar a cada pedido de “me dá a chupeta”.</p>
      <div class="acao reveal">${prox('Comparar hoje com um plano', '#comparar')}</div>
    </div>
  </div>
</section>

<!-- 4. HOJE × COM UM PLANO (comparação interativa) -->
<section class="comp-sec" id="comparar">
  <div class="narrow center reveal">
    <span class="kicker">Toque e compare</span>
    <h2>O seu dia hoje × o seu dia com um plano</h2>
  </div>
  <div class="wrap">
    <div class="troca reveal" role="tablist" aria-label="Comparar">
      <button type="button" role="tab" id="tabHoje" aria-selected="true" aria-controls="hoje">😮‍💨 Hoje</button>
      <button type="button" role="tab" id="tabPlano" class="pl" aria-selected="false" aria-controls="plano">🌙 Com um plano</button>
    </div>
    <div class="comp reveal">
      <div class="lado hoje" id="hoje" role="tabpanel" aria-labelledby="tabHoje">
        <ul>${momentos.map(([e, q, h]) => `<li><span class="e">${e}</span><div><small>${q}</small>${h}</div></li>`).join('')}</ul>
      </div>
      <div class="lado plano" id="plano" role="tabpanel" aria-labelledby="tabPlano" hidden>
        <ul>${momentos.map(([e, q, , p]) => `<li><span class="e">${e}</span><div><small>${q}</small>${p}</div></li>`).join('')}</ul>
      </div>
    </div>
    <p class="dica">Toque em “Com um plano” para ver a diferença</p>
    <div class="acao reveal">${prox('Ver o que você recebe', '#oferta')}</div>
  </div>
</section>

<!-- 5. OFERTA (facilidade + ancoragem leve) -->
<section class="oferta" id="oferta">
  <div class="narrow center reveal">
    <span class="kicker">Comece hoje à noite</span>
    <h2>Tudo o que você precisa, no seu celular, em 2 minutos</h2>
  </div>
  <div class="wrap">
    <div class="box reveal">
      <div class="facil">
        <div><b>2 min</b>para comprar</div>
        <div><b>📱</b>lê no celular</div>
        <div><b>⚡</b>acesso na hora</div>
      </div>
      <ul>
        <li>Como preparar seu filho antes do tchau</li>
        <li>A história da despedida, para ele entender a mudança</li>
        <li>Como envolver a criança e o roteiro do dia do tchau</li>
        <li>O que dizer quando ele pedir a chupeta nos dias seguintes</li>
        <li>O combinado da família: pai, avós e babá no mesmo caminho</li>
        ${bonusHtml}
      </ul>
      <div class="preco" id="preco">
        ${OFERTA.precoDe ? `<div class="de">De R$ ${esc(OFERTA.precoDe)}</div>` : ''}
        <div class="por"><small>R$</small> ${esc(OFERTA.preco)}</div>
        ${OFERTA.parcelas ? `<div class="parc">ou ${esc(OFERTA.parcelas)}</div>` : ''}
        <div class="parc">pagamento único</div>
      </div>
      ${ctaCheckout('Quero meu plano agora', 'full pulse')}
      <div class="garantia"><span class="s">${OFERTA.garantiaDias}</span><div><b>${OFERTA.garantiaDias} dias de garantia.</b> Se não for para a sua família, você pede o reembolso e recebe 100% de volta, sem perguntas.</div></div>
    </div>
  </div>
</section>

<!-- 6. FECHAMENTO CURTO -->
<section class="final" id="final">
  <div class="narrow">
    <div class="reveal" style="width:110px;margin:0 auto 14px">${pacifier({ size: 110, wave: true })}</div>
    <h2 class="reveal">Hoje à noite pode ser a primeira noite do plano, e não mais uma tentativa.</h2>
    <div class="acao reveal">${ctaCheckout('Começar a despedida hoje')}
      <ul class="selos"><li>🔒 Compra segura</li><li>⚡ Acesso imediato</li><li>🛡️ Garantia de ${OFERTA.garantiaDias} dias</li></ul>
    </div>
  </div>
</section>

<footer>
  <p><b>Tchau Chupeta</b> © ${new Date().getFullYear()}. Todos os direitos reservados.</p>
  <p>Este material é educativo e não substitui a orientação de pediatras, odontopediatras ou outros profissionais de saúde. Cada criança tem seu próprio ritmo, e os resultados podem variar de família para família.</p>
</footer>

<div class="sticky" id="sticky">${prox('Continuar', '#conversa')}</div>

<script>
// Conversa: as mensagens aparecem uma a uma quando a seção entra na tela
(function(){
  var box = document.getElementById('msgs'), msgs = box.querySelectorAll('.msg'), dig = document.getElementById('digitando');
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mostrarTudo(){ msgs.forEach(function(m){ m.classList.add('on'); }); }
  if (reduz || !('IntersectionObserver' in window)) { mostrarTudo(); return; }
  var i = 0, iniciou = false;
  function prox(){
    if (i >= msgs.length) { dig.classList.remove('on'); return; }
    var m = msgs[i];
    if (m.classList.contains('tc')) {
      dig.classList.add('on'); box.appendChild(dig);
      setTimeout(function(){ dig.classList.remove('on'); m.classList.add('on'); i++; setTimeout(prox, 500); }, 900);
    } else { m.classList.add('on'); i++; setTimeout(prox, 650); }
  }
  new IntersectionObserver(function(e, o){
    if (e[0].isIntersecting && !iniciou) { iniciou = true; o.disconnect(); prox(); }
  }, { threshold: .35 }).observe(box);
})();

// Comparação hoje × plano (abas)
(function(){
  var tH = document.getElementById('tabHoje'), tP = document.getElementById('tabPlano'),
      pH = document.getElementById('hoje'), pP = document.getElementById('plano'), usado = false;
  function sel(plano){
    tH.setAttribute('aria-selected', !plano); tP.setAttribute('aria-selected', plano);
    pH.hidden = plano; pP.hidden = !plano;
    (plano ? pP : pH).classList.remove('vis2'); void (plano ? pP : pH).offsetWidth; (plano ? pP : pH).classList.add('vis2');
    if (plano && !usado && window.fbq) { usado = true; fbq('trackCustom', 'ComparacaoUsada', { content_category: 'pagina-c' }); }
  }
  tH.addEventListener('click', function(){ sel(false); });
  tP.addEventListener('click', function(){ sel(true); });
})();

// Checkout: repassa UTMs e dispara InitiateCheckout
(function(){
  var q = location.search.slice(1);
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    if (q && a.href.indexOf('http') === 0) a.href += (a.href.indexOf('?') < 0 ? '?' : '&') + q;
    a.addEventListener('click', function(){ if (window.fbq) fbq('track', 'InitiateCheckout', { content_category: 'pagina-c', value: ${valor}, currency: 'BRL' }); });
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
  var sticky = document.getElementById('sticky'), hero = document.querySelector('.hero'), oferta = document.getElementById('oferta'), fim = document.getElementById('final');
  var pastHero = false, onOffer = false, onFim = false;
  function set(){ sticky.classList.toggle('on', pastHero && !onOffer && !onFim); }
  new IntersectionObserver(function(e){ pastHero = !e[0].isIntersecting; set(); }).observe(hero);
  new IntersectionObserver(function(e){ onOffer = e[0].isIntersecting; set(); }, { threshold: .2 }).observe(oferta);
  new IntersectionObserver(function(e){ onFim = e[0].isIntersecting; set(); }, { threshold: .2 }).observe(fim);
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
console.log('ok → pagina-vendas/c/index.html');
