// Gera a página de vendas do Tchau Chupeta em pagina-vendas/index.html.
// Uso: node src/pagina.mjs
// Edite o bloco OFERTA abaixo antes de publicar (preço, checkout, garantia).

import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, cloud, familyHug, childWaving } from './illustrations.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'pagina-vendas');

// ─── PREENCHA ANTES DE PUBLICAR ────────────────────────────────────────────
const OFERTA = {
  checkout: 'https://pay.kiwify.com.br/pZIVc6a', // link da Hotmart/Kiwify/Eduzz etc.
  precoDe: '',                // preço "de" riscado (deixe vazio se não houver)
  preco: '29,90',             // preço à vista, sem "R$"
  parcelas: '',               // ex.: '5x de R$ 9,90' (vazio esconde a linha)
  garantiaDias: 7,            // 7 é o mínimo legal (CDC, art. 49)
  formato: 'Guia digital',    // confirme o formato real (PDF, área de membros...)
  bonus: [
    // { titulo: 'Nome do bônus', texto: 'O que ele entrega.' },
  ],
  pixelMeta: '1137389055898462',            // ID do Pixel da Meta (vazio = não carrega)
};
// ───────────────────────────────────────────────────────────────────────────

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Cada botão leva no máximo à próxima etapa da página; só os botões depois do preço levam ao checkout.
const cta = (texto = 'Quero começar a despedida', extra = '', alvo = '#preco') =>
  `<a class="btn ${extra}" href="${alvo}">${texto} <span aria-hidden="true">→</span></a>`;
const ctaCheckout = (texto, extra = '') =>
  `<a class="btn ${extra}" href="${esc(OFERTA.checkout)}" data-checkout>${texto} <span aria-hidden="true">→</span></a>`;

const selos = `<ul class="selos">
  <li>🔒 Compra segura</li><li>⚡ Acesso imediato</li><li>🛡️ Garantia de ${OFERTA.garantiaDias} dias</li>
</ul>`;

const dores = [
  'Você tira a chupeta, ele chora… e no fim você acaba devolvendo.',
  'Ouve <b>“mãe, me dá a chupeta”</b> tantas vezes que já perdeu a conta.',
  'Já escondeu, jogou fora ou “deu pro bebê que precisava”… e voltou atrás.',
  'Tem medo de mexer na chupeta e bagunçar o sono da casa inteira.',
  'Cada adulto da família fala uma coisa, e ninguém segue o mesmo combinado.',
  'Sabe que chegou a hora, mas não faz ideia de <b>por onde começar</b>.',
];

const etapas = [
  { n: 1, cor: C.peach, titulo: 'Preparar', texto: 'Como começar a conversa semanas antes, para a mudança não chegar de surpresa. Seu filho vai sendo avisado com leveza, no tempo dele.' },
  { n: 2, cor: C.lavender, titulo: 'Contar a história', texto: 'Como criar a narrativa da despedida: uma história simples, com começo, meio e fim, que dá sentido ao “tchau” para a cabecinha da criança.' },
  { n: 3, cor: C.mint, titulo: 'Envolver seu filho', texto: 'Como fazer a criança participar das escolhas e se sentir parte do momento, em vez de alguém de quem “tiraram” alguma coisa.' },
  { n: 4, cor: C.sun, titulo: 'O dia do tchau', texto: 'O roteiro do grande dia: o que fazer, o que dizer e como transformar a despedida em um marco de crescimento para lembrar com carinho.' },
  { n: 5, cor: C.peachDeep, titulo: 'Acolher os dias seguintes', texto: 'O que fazer quando ele pedir a chupeta de novo, como manter a família no mesmo combinado e como acolher as noites de adaptação.' },
];

const erros = [
  { t: 'Sumir com a chupeta sem avisar', d: 'Para a criança, algo que dava segurança desaparece sem explicação. A reação costuma ser de perda e não de entendimento.' },
  { t: 'Voltar atrás no meio do caminho', d: 'Quando a chupeta volta depois de muito choro, a criança aprende que o choro traz a chupeta de volta. É assim que nasce o ciclo.' },
  { t: 'Cada adulto fazer de um jeito', d: 'Se a mãe tira, a avó devolve e o pai não sabe o que dizer, a criança fica confusa. Combinado da família vem antes do dia do tchau.' },
];

const faq = [
  { p: 'Meu filho é muito apegado. Vai funcionar para ele?', r: 'O Tchau Chupeta começa justamente pela preparação, porque crianças apegadas são as que mais sofrem quando a chupeta some de repente. O processo respeita o ritmo de cada criança. Não prometemos prazos mágicos: cada filho tem seu tempo, e o guia mostra como conduzir esse tempo com segurança.' },
  { p: 'Não é só tirar? Por que eu precisaria de um guia?', r: 'Tirar de repente é exatamente o que costuma gerar o ciclo “tira, chora, devolve”. O guia existe para você saber o que fazer antes, durante e depois do tchau, sem precisar improvisar às 2 da manhã.' },
  { p: 'Tenho pouco tempo. Consigo aplicar?', r: 'Sim. O conteúdo é organizado em etapas curtas e práticas. Você lê a etapa, aplica na rotina que já existe e segue para a próxima. Não é um curso longo: é um caminho claro para seguir.' },
  { p: 'Qual a idade certa para tirar a chupeta?', r: 'Não existe uma data igual para todas as crianças. Se você tiver dúvidas sobre a saúde bucal ou o desenvolvimento do seu filho, converse com o pediatra ou odontopediatra. O Tchau Chupeta ajuda no <i>como</i> conduzir a despedida quando a família decidir que é a hora.' },
  { p: 'Como eu recebo o material?', r: `É um ${esc(OFERTA.formato.toLowerCase())}. Assim que o pagamento é aprovado, você recebe o acesso no seu e-mail e pode ler no celular, no tablet ou no computador.` },
  { p: 'E se eu não gostar?', r: `Você tem ${OFERTA.garantiaDias} dias de garantia. Se achar que o Tchau Chupeta não é para a sua família, basta pedir o reembolso dentro do prazo e você recebe 100% do valor de volta, sem perguntas.` },
  { p: 'Serve para o pai, os avós e a babá também?', r: 'Serve e é recomendado. Uma das etapas é justamente colocar todos os adultos da casa no mesmo combinado, para a criança receber a mesma mensagem de todo mundo.' },
];

const bonusHtml = OFERTA.bonus.length
  ? OFERTA.bonus.map((b) => `<li><span class="ic">🎁</span><div><b>Bônus: ${esc(b.titulo)}</b><br>${esc(b.texto)}</div></li>`).join('')
  : '';

// Valor numérico para os eventos do Pixel (ex.: '29,90' → 29.9)
const valor = Number(OFERTA.preco.replace(/\./g, '').replace(',', '.')) || 0;

const pixel = OFERTA.pixelMeta
  ? `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${esc(OFERTA.pixelMeta)}');fbq('track','PageView');fbq('track','ViewContent',{content_name:'Tchau Chupeta',value:${valor},currency:'BRL'});</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${esc(OFERTA.pixelMeta)}&ev=PageView&noscript=1"></noscript>`
  : '';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tchau Chupeta — Não é só tirar. É se despedir.</title>
<meta name="description" content="O passo a passo lúdico e acolhedor para transformar a retirada da chupeta em uma despedida da qual seu filho participa.">
<meta property="og:title" content="Tchau Chupeta — Não é só tirar. É se despedir.">
<meta property="og:description" content="O passo a passo para conduzir a despedida da chupeta com preparação, participação e acolhimento.">
<meta name="theme-color" content="${C.night}">
<link rel="preload" href="fonts/Baloo2-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:'Baloo 2';font-weight:400 800;font-display:swap;src:url(fonts/Baloo2-latin.woff2) format('woff2')}
@font-face{font-family:'Nunito';font-weight:200 1000;font-display:swap;src:url(fonts/Nunito-latin.woff2) format('woff2')}
:root{
  --cream:${C.cream};--peach:${C.peach};--peach-deep:${C.peachDeep};--lav:${C.lavender};--lav-deep:${C.lavenderDeep};
  --mint:${C.mint};--mint-deep:${C.mintDeep};--sun:${C.sun};--night:${C.night};--night-deep:${C.nightDeep};
  --ink:${C.ink};--ink-soft:${C.inkSoft};--r:22px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito',system-ui,sans-serif;font-size:18px;line-height:1.6;color:var(--ink);background:var(--cream);-webkit-font-smoothing:antialiased;overflow-x:hidden}
svg{max-width:100%;height:auto;display:block}
h1,h2,h3{font-family:'Baloo 2',system-ui,sans-serif;line-height:1.12;font-weight:800;letter-spacing:-.01em}
h1{font-size:clamp(34px,6.2vw,58px)}
h2{font-size:clamp(28px,4.6vw,42px);margin-bottom:18px}
h3{font-size:22px}
p+p{margin-top:14px}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.narrow{max-width:720px;margin:0 auto;padding:0 20px}
section{padding:80px 0}
.center{text-align:center}
.kicker{display:inline-block;font-weight:800;font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--lav-deep);margin-bottom:12px}
.hl{background:linear-gradient(transparent 58%,var(--sun) 58%);padding:0 4px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:21px;
  color:#fff;background:var(--peach-deep);padding:18px 34px;border-radius:999px;text-decoration:none;box-shadow:0 8px 0 #C96E5A,0 14px 30px rgba(242,142,120,.35);
  transition:transform .15s,box-shadow .15s;text-align:center}
.btn:hover{transform:translateY(-2px)}
.btn:active{transform:translateY(5px);box-shadow:0 3px 0 #C96E5A}
.btn.full{width:100%}
.btn.pulse{animation:pulse 2.6s infinite}
@keyframes pulse{0%,100%{box-shadow:0 8px 0 #C96E5A,0 0 0 0 rgba(242,142,120,.55)}50%{box-shadow:0 8px 0 #C96E5A,0 0 0 16px rgba(242,142,120,0)}}
.selos{list-style:none;display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;margin-top:18px;font-size:14px;font-weight:700;opacity:.85}

/* topo */
.topbar{background:var(--night-deep);color:#fff;text-align:center;font-size:14px;font-weight:700;padding:9px 16px}
.topbar b{color:var(--sun)}

/* hero */
.hero{background:radial-gradient(ellipse at 70% 0%,#4C4390 0%,var(--night) 55%,var(--night-deep) 100%);color:#fff;padding:56px 0 0;position:relative;overflow:hidden}
.hero .grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
.hero .pre{font-weight:800;color:var(--sun);font-size:16px;margin-bottom:16px}
.hero h1 .soft{color:var(--peach)}
.hero .sub{font-size:20px;margin:20px 0 30px;opacity:.92;max-width:560px}
.hero .sub b{color:#fff}
.hero .selos{justify-content:flex-start;color:#fff}
.hero .art{position:relative;min-height:420px}
.hero .art .moon{position:absolute;top:0;right:10px;width:120px}
.hero .art .chupi{position:absolute;top:20px;left:0;width:140px;animation:float 5s ease-in-out infinite}
.hero .art .fam{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:440px}
.star{position:absolute;animation:twinkle 3s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-14px) rotate(4deg)}}
@keyframes twinkle{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
.hill{display:block;width:100%;height:70px;margin-top:-1px}

/* checklist */
.check{background:#fff;border-radius:var(--r);padding:10px;box-shadow:0 10px 40px rgba(59,52,112,.08)}
.check label{display:flex;gap:14px;align-items:flex-start;padding:16px 16px;border-radius:14px;cursor:pointer;transition:background .2s}
.check label:hover{background:#FFF3EA}
.check input{appearance:none;flex:0 0 28px;height:28px;border:3px solid var(--lav);border-radius:9px;margin-top:1px;display:grid;place-content:center;cursor:pointer;transition:.2s}
.check input:checked{background:var(--mint-deep);border-color:var(--mint-deep)}
.check input:checked::after{content:'';width:8px;height:14px;border:solid #fff;border-width:0 3px 3px 0;transform:rotate(45deg) translate(-1px,-2px)}
.check input:focus-visible{outline:3px solid var(--lav-deep);outline-offset:2px}
.check label:has(input:checked){background:#EFF9F4}
.resp{margin-top:22px;padding:22px 24px;border-radius:var(--r);background:var(--lav);color:var(--night-deep);font-weight:700;display:none}
.resp.on{display:block;animation:in .4s ease}
@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* ciclo */
.dark{background:var(--night);color:#fff}
.ciclo{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:36px 0 10px}
.ciclo .pill{background:rgba(255,255,255,.1);border:2px solid rgba(255,255,255,.2);border-radius:999px;padding:12px 22px;font-family:'Baloo 2';font-weight:800;font-size:22px}
.ciclo .arr{font-size:26px;color:var(--peach)}
.ciclo .loop{color:var(--sun);font-size:30px}
.dark p{opacity:.9}
.dark .quote{margin-top:30px;background:rgba(255,255,255,.08);border-left:5px solid var(--sun);border-radius:12px;padding:20px 24px;font-size:20px}

/* virada */
.vs{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:36px}
.vs .col{border-radius:var(--r);padding:28px}
.vs .a{background:#F1ECE6}
.vs .b{background:#fff;box-shadow:0 0 0 3px var(--mint-deep),0 16px 40px rgba(93,184,150,.18)}
.vs h3{margin-bottom:14px}
.vs ul{list-style:none}
.vs li{padding:9px 0 9px 34px;position:relative;border-top:1px dashed rgba(58,53,99,.15)}
.vs li:first-child{border-top:0}
.vs .a li::before{content:'✕';position:absolute;left:4px;color:#B9AEA4;font-weight:900}
.vs .b li::before{content:'✓';position:absolute;left:2px;color:var(--mint-deep);font-weight:900;font-size:20px;line-height:1.4}
.vs .a{color:#7A7488}

/* produto */
.produto{background:linear-gradient(180deg,var(--cream),#FDEEE3)}
.produto .grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:center}
.mock{position:relative;margin:0 auto;width:280px;aspect-ratio:9/17;background:var(--night-deep);border-radius:40px;padding:12px;box-shadow:0 30px 60px rgba(42,37,86,.35);transform:rotate(-4deg)}
.mock .tela{height:100%;border-radius:30px;background:linear-gradient(180deg,var(--night),#5A4FA6);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#fff;text-align:center;padding:24px;position:relative;overflow:hidden}
.mock .tela .t{font-family:'Baloo 2';font-weight:800;font-size:34px;line-height:1}
.mock .tela .t b{color:var(--peach);display:block}
.mock .tela small{opacity:.8;font-weight:700}
.mock .chupi{width:120px;animation:float 5s ease-in-out infinite}
.mock .notch{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:90px;height:22px;background:var(--night-deep);border-radius:0 0 14px 14px;z-index:2}

/* etapas */
.trilha{position:relative;margin-top:40px}
.trilha::before{content:'';position:absolute;left:31px;top:30px;bottom:30px;border-left:4px dashed var(--lav)}
.etapa{display:flex;gap:22px;align-items:flex-start;position:relative;padding:14px 0}
.etapa .num{flex:0 0 66px;height:66px;border-radius:50%;display:grid;place-content:center;font-family:'Baloo 2';font-weight:800;font-size:30px;color:var(--night-deep);border:5px solid var(--cream);z-index:1}
.etapa .card{background:#fff;border-radius:var(--r);padding:22px 24px;box-shadow:0 8px 30px rgba(59,52,112,.07);flex:1}
.etapa h3{margin-bottom:6px}

/* imagine */
.imagine{background:var(--mint);position:relative;overflow:hidden}
.imagine .grid{display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center}
.imagine ul{list-style:none;margin-top:18px}
.imagine li{padding:10px 0 10px 40px;position:relative;font-size:19px}
.imagine li::before{content:'💛';position:absolute;left:4px;top:10px}
.imagine .art{background:var(--cream);border-radius:50%;aspect-ratio:1;display:grid;place-content:center;padding:30px;max-width:340px;margin:0 auto;box-shadow:0 0 0 14px rgba(255,255,255,.35)}

/* pra quem */
.quem{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:30px}
.quem .col{background:#fff;border-radius:var(--r);padding:28px}
.quem ul{list-style:none}
.quem li{padding:8px 0 8px 32px;position:relative}
.quem .sim li::before{content:'💛';position:absolute;left:0}
.quem .nao li::before{content:'🚫';position:absolute;left:0}

/* presente */
.presente{background:#fff}
.erros{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px}
.erro{background:var(--cream);border-radius:var(--r);padding:26px;border-top:6px solid var(--peach)}
.erro .x{font-family:'Baloo 2';font-weight:800;font-size:40px;color:var(--peach-deep);line-height:1}
.erro h3{margin:6px 0 8px;font-size:20px}

/* oferta */
.oferta{background:radial-gradient(ellipse at 50% 0%,#4C4390,var(--night-deep));color:#fff;position:relative;overflow:hidden}
.box{background:#fff;color:var(--ink);border-radius:28px;max-width:560px;margin:34px auto 0;padding:36px 30px;box-shadow:0 30px 80px rgba(0,0,0,.35);position:relative}
.box .tag{position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:var(--sun);color:var(--night-deep);font-weight:800;font-size:14px;padding:6px 18px;border-radius:999px;white-space:nowrap}
.box ul{list-style:none;margin:10px 0 24px}
.box li{display:flex;gap:14px;padding:12px 0;border-bottom:1px dashed rgba(58,53,99,.15);text-align:left}
.box .selos{margin:18px 0 0}.box .selos li{border:0;padding:0;display:block}
.box .ic{font-size:22px;line-height:1.3}
.preco{text-align:center;margin-bottom:22px;scroll-margin-top:30vh}
.preco .de{text-decoration:line-through;opacity:.55;font-weight:700}
.preco .por{font-family:'Baloo 2';font-weight:800;font-size:60px;line-height:1;color:var(--night)}
.preco .por small{font-size:26px}
.preco .parc{font-weight:700;color:var(--ink-soft)}

/* garantia */
.garantia{display:grid;grid-template-columns:auto 1fr;gap:30px;align-items:center;background:#fff;border-radius:28px;padding:34px;box-shadow:0 10px 40px rgba(59,52,112,.08)}
.selo{width:150px;height:150px;border-radius:50%;background:var(--sun);display:grid;place-content:center;text-align:center;font-family:'Baloo 2';font-weight:800;color:var(--night-deep);box-shadow:0 0 0 8px #FFF1C7,0 0 0 10px var(--sun);line-height:1}
.selo .d{font-size:56px}
.selo small{font-size:15px;display:block;margin-top:2px}

/* faq */
details{background:#fff;border-radius:18px;margin-top:12px;box-shadow:0 4px 18px rgba(59,52,112,.06)}
summary{list-style:none;cursor:pointer;padding:20px 56px 20px 24px;font-weight:800;font-size:18px;position:relative}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';position:absolute;right:22px;top:50%;transform:translateY(-50%);font-size:28px;color:var(--lav-deep);font-family:'Baloo 2';transition:transform .2s}
details[open] summary::after{transform:translateY(-50%) rotate(45deg)}
details .r{padding:0 24px 22px;color:var(--ink-soft)}

/* final */
.final{background:var(--night);color:#fff;text-align:center;position:relative;overflow:hidden}
.final .dois{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:34px 0;text-align:left}
.final .dois div{border-radius:var(--r);padding:24px}
.final .c1{background:rgba(255,255,255,.07);color:rgba(255,255,255,.8)}
.final .c2{background:var(--peach);color:var(--night-deep)}
.final .c2 b{display:block;font-family:'Baloo 2';font-size:22px}
.final .c1 b{display:block;font-family:'Baloo 2';font-size:22px;color:#fff}
footer{background:var(--night-deep);color:rgba(255,255,255,.6);font-size:13px;text-align:center;padding:30px 20px 110px}
footer p+p{margin-top:8px}

/* barra fixa mobile */
.sticky{position:fixed;left:0;right:0;bottom:0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:rgba(255,247,238,.96);backdrop-filter:blur(8px);box-shadow:0 -6px 24px rgba(42,37,86,.15);z-index:50;transform:translateY(110%);transition:transform .3s}
.sticky.on{transform:none}
.sticky .btn{width:100%;font-size:19px;padding:15px 20px}
@media(min-width:861px){.sticky{display:none}footer{padding-bottom:30px}}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.vis{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}

@media(max-width:860px){
  body{font-size:17px}
  section{padding:60px 0}
  .hero{padding-top:20px}
  .hero .grid{gap:18px}
  .hero .grid,.produto .grid,.imagine .grid{grid-template-columns:1fr}
  .hero .art{min-height:210px;order:-1;max-width:300px;margin:0 auto;width:100%}
  .hero .art .fam{max-width:230px}
  .hero .art .chupi{width:70px}
  .hero .art .moon{width:60px}
  .hero .sub{font-size:18px}
  .hero .selos{justify-content:center}
  .hero .txt{text-align:center}
  .hero .txt .sub{margin-left:auto;margin-right:auto}
  .vs,.quem,.erros,.final .dois{grid-template-columns:1fr}
  .garantia{grid-template-columns:1fr;text-align:center;justify-items:center}
  .imagine .art{max-width:240px;margin:0 auto}
  .btn{font-size:19px;padding:17px 26px;width:100%}
  .mock{width:230px}
  .hide-m{display:none}
}
</style>
${pixel}
</head>
<body>

<div class="topbar">💛 Para mães e pais que querem tirar a chupeta <b>sem transformar isso em uma guerra</b></div>

<!-- 1. HERO: promessa + mecanismo -->
<header class="hero">
  <span class="star" style="top:8%;left:6%">${star(18)}</span>
  <span class="star hide-m" style="top:30%;left:46%;animation-delay:.8s">${sparkle(16)}</span>
  <span class="star" style="top:14%;left:62%;animation-delay:1.6s">${star(14)}</span>
  <span class="star" style="top:70%;left:3%;animation-delay:.4s">${sparkle(20)}</span>
  <div class="wrap grid">
    <div class="txt">
      <p class="pre">Você tira, ele chora e a chupeta volta?</p>
      <h1>Não é só tirar a chupeta. <span class="soft">É ensinar seu filho a se despedir dela.</span></h1>
      <p class="sub">O <b>Tchau Chupeta</b> é o passo a passo lúdico e acolhedor que mostra como preparar seu filho, contar a história da despedida e viver o dia do tchau <b>junto com ele</b>, no ritmo da sua criança.</p>
      ${cta('Quero começar a despedida', 'pulse', '#identificacao')}
      ${selos}
    </div>
    <div class="art" aria-hidden="true">
      <div class="moon">${moon(120)}</div>
      <div class="chupi">${pacifier({ size: 140, wave: true })}</div>
      <div class="fam">${familyHug({ size: 440 })}</div>
    </div>
  </div>
  <svg class="hill" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 70 C360 0 1080 0 1440 70Z" fill="${C.cream}"/></svg>
</header>

<!-- 2. IDENTIFICAÇÃO + microcompromisso -->
<section id="identificacao">
  <div class="narrow">
    <div class="center reveal">
      <span class="kicker">Seja sincera</span>
      <h2>Marque o que acontece aí na sua casa:</h2>
    </div>
    <div class="check reveal" role="group" aria-label="Situações da sua casa">
      ${dores.map((d) => `<label><input type="checkbox"><span>${d}</span></label>`).join('\n      ')}
    </div>
    <div class="resp" id="resp" aria-live="polite"></div>
  </div>
</section>

<!-- 3. O INIMIGO: o ciclo (tira a culpa da mãe) -->
<section class="dark">
  <div class="narrow center">
    <div class="reveal">
      <span class="kicker" style="color:var(--sun)">Não é falta de vontade sua</span>
      <h2>O problema não é você. É o jeito que todo mundo manda tirar.</h2>
    </div>
    <div class="ciclo reveal" aria-label="O ciclo: tira, chora, devolve">
      <span class="pill">Tira 🙅</span><span class="arr">→</span>
      <span class="pill">Chora 😭</span><span class="arr">→</span>
      <span class="pill">Devolve 😮‍💨</span><span class="loop">🔁</span>
    </div>
    <div class="reveal" style="text-align:left;margin-top:28px">
      <p>“Esconde.” “Joga fora.” “Corta o bico.” “Diz que o gato levou.” Você já ouviu (e talvez já tentou) tudo isso.</p>
      <p>Só que, para muitas crianças, a chupeta é <b>conforto e segurança</b>. Quando ela some de uma hora para outra, a criança não entende o que aconteceu. Ela só sente que perdeu algo importante.</p>
      <p>Aí vem o choro, a noite longa, o coração apertado… e a chupeta volta. Não porque você é fraca, mas porque ninguém te deu um plano para o que fazer <b>antes, durante e depois</b>.</p>
      <p class="quote">Talvez não tenha faltado vontade. <b>Talvez tenha faltado uma estratégia de transição.</b></p>
    </div>
  </div>
</section>

<!-- 4. A VIRADA: tirar × despedir -->
<section>
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kicker">A virada de chave</span>
      <h2>Existe uma diferença enorme entre <span class="hl">tirar</span> a chupeta e <span class="hl">se despedir</span> dela</h2>
      <p>Quando a criança é preparada e participa, a retirada deixa de ser algo que os adultos fizeram <i>com</i> ela e passa a ser um momento vivido <i>junto</i>.</p>
    </div>
    <div class="vs">
      <div class="col a reveal">
        <h3>😣 Tirar de repente</h3>
        <ul>
          <li>A chupeta some sem aviso</li>
          <li>A criança é pega de surpresa</li>
          <li>Os adultos decidem tudo sozinhos</li>
          <li>Parece castigo</li>
          <li>Cada adulto faz de um jeito</li>
          <li>Vira uma lembrança de briga</li>
        </ul>
      </div>
      <div class="col b reveal">
        <h3>🌙 Se despedir com o Tchau Chupeta</h3>
        <ul>
          <li>A mudança é anunciada com carinho</li>
          <li>A criança entende o que vai acontecer</li>
          <li>Ela participa do momento do tchau</li>
          <li>Vira um marco de crescimento</li>
          <li>A família inteira segue o mesmo combinado</li>
          <li>Vira uma história para lembrar com orgulho</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- 5. APRESENTAÇÃO DO PRODUTO -->
<section class="produto">
  <div class="wrap grid">
    <div class="reveal">
      <div class="mock" aria-hidden="true">
        <span class="notch"></span>
        <div class="tela">
          <div class="chupi">${pacifier({ size: 120, wave: true })}</div>
          <div class="t">Tchau<b>Chupeta</b></div>
          <small>O passo a passo da despedida</small>
        </div>
      </div>
    </div>
    <div class="reveal">
      <span class="kicker">Apresentando</span>
      <h2>Tchau Chupeta: o caminho claro que você estava procurando</h2>
      <p>Um ${esc(OFERTA.formato.toLowerCase())} feito para mães e pais que querem conduzir a retirada da chupeta de um jeito <b>lúdico, acolhedor e estruturado</b>.</p>
      <p>Nada de fórmula mágica nem de força. Você recebe um passo a passo organizado em etapas, para saber exatamente o que fazer em cada fase, sem improvisar e sem ficar refém dos conselhos que cada um dá.</p>
      <p style="margin-top:26px">${cta('Quero o Tchau Chupeta', '', '#etapas')}</p>
    </div>
  </div>
</section>

<!-- 6. AS ETAPAS (especificidade) -->
<section id="etapas">
  <div class="narrow">
    <div class="center reveal">
      <span class="kicker">Como funciona</span>
      <h2>5 etapas para transformar a retirada em uma despedida</h2>
      <p>Cada etapa prepara a próxima. Você segue a trilha no ritmo do seu filho.</p>
    </div>
    <div class="trilha">
      ${etapas.map((e) => `<div class="etapa reveal">
        <div class="num" style="background:${e.cor}">${e.n}</div>
        <div class="card"><h3>${e.titulo}</h3><p>${e.texto}</p></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- 7. FUTURO DESEJADO -->
<section class="imagine">
  <div class="wrap grid">
    <div class="reveal">
      <span class="kicker" style="color:var(--night)">Agora imagine</span>
      <h2>Seu filho contando, todo orgulhoso, que deu tchau para a chupeta</h2>
      <ul>
        <li>Você sabendo exatamente o que fazer hoje, amanhã e na semana que vem.</li>
        <li>A família inteira falando a mesma coisa, sem ninguém “sabotar” o combinado.</li>
        <li>O “me dá a chupeta” dando lugar a “eu já sou grande, lembra?”.</li>
        <li>E você tranquila, sabendo que conduziu esse momento com carinho, e não com briga.</li>
      </ul>
    </div>
    <div class="art reveal" aria-hidden="true">${childWaving({ size: 220 })}</div>
  </div>
</section>

<!-- 8. RECIPROCIDADE: um presente antes da decisão -->
<section class="presente">
  <div class="wrap">
    <div class="narrow center reveal">
      <span class="kicker">Um presente antes de você decidir</span>
      <h2>3 erros que mantêm o ciclo do “tira e devolve”</h2>
      <p>Mesmo que você não leve o guia hoje, evitar esses três já pode deixar a próxima tentativa mais leve:</p>
    </div>
    <div class="erros">
      ${erros.map((e, i) => `<div class="erro reveal"><div class="x">0${i + 1}</div><h3>${e.t}</h3><p>${e.d}</p></div>`).join('\n      ')}
    </div>
    <div class="center reveal" style="margin-top:36px">
      <p style="margin-bottom:20px"><b>Saber o que não fazer é o começo. O Tchau Chupeta te mostra o que fazer no lugar.</b></p>
      ${cta('Quero o passo a passo completo', '', '#para-quem')}
    </div>
  </div>
</section>

<!-- 9. PARA QUEM É -->
<section id="para-quem">
  <div class="wrap">
    <div class="narrow center reveal"><h2>O Tchau Chupeta é para você?</h2></div>
    <div class="quem">
      <div class="col sim reveal">
        <h3 style="margin-bottom:12px">É para você se…</h3>
        <ul>
          <li>Seu filho ainda usa chupeta e você sente que chegou a hora</li>
          <li>Você já tentou tirar e acabou devolvendo</li>
          <li>Quer um processo respeitoso, sem susto e sem castigo</li>
          <li>Quer saber o que fazer em cada fase, sem improvisar</li>
          <li>Quer a família inteira no mesmo combinado</li>
        </ul>
      </div>
      <div class="col nao reveal">
        <h3 style="margin-bottom:12px">Não é para você se…</h3>
        <ul>
          <li>Procura uma fórmula mágica para resolver em uma noite</li>
          <li>Prefere sumir com a chupeta e “deixar chorar”</li>
          <li>Não está disposta a dedicar alguns minutos por dia ao processo</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!--
  PROVA SOCIAL — descomente quando tiver depoimentos REAIS e AUTORIZADOS.
  Não use atores apresentados como clientes nem prometa resultados.
<section class="presente">
  <div class="wrap">
    <div class="narrow center"><span class="kicker">Quem já se despediu</span><h2>O que as famílias estão dizendo</h2></div>
    <div class="erros">
      <div class="erro"><p>“Depoimento real aqui.”</p><h3>Nome, mãe do Fulano (3 anos)</h3></div>
    </div>
  </div>
</section>
-->

<!-- 10. OFERTA -->
<section class="oferta" id="oferta">
  <span class="star" style="top:10%;left:8%">${star(18)}</span>
  <span class="star" style="top:22%;right:10%;animation-delay:1s">${sparkle(18)}</span>
  <span class="star" style="bottom:14%;left:14%;animation-delay:2s">${star(14)}</span>
  <div class="narrow center reveal">
    <span class="kicker" style="color:var(--sun)">Comece hoje</span>
    <h2>Tudo o que você precisa para conduzir a despedida da chupeta</h2>
  </div>
  <div class="wrap">
    <div class="box reveal">
      <span class="tag">⚡ Acesso imediato</span>
      <ul>
        <li><span class="ic">📘</span><div><b>Tchau Chupeta: o passo a passo completo</b><br>As 5 etapas, da preparação ao acolhimento dos dias seguintes.</div></li>
        <li><span class="ic">🌙</span><div><b>O roteiro do dia do tchau</b><br>O que fazer e o que dizer no grande dia.</div></li>
        <li><span class="ic">👨‍👩‍👧</span><div><b>O combinado da família</b><br>Para pai, avós e babá seguirem o mesmo caminho.</div></li>
        <li><span class="ic">💬</span><div><b>O que responder quando ele pedir a chupeta</b><br>Para os dias seguintes, sem voltar à estaca zero.</div></li>
        ${bonusHtml}
      </ul>
      <div class="preco" id="preco">
        ${OFERTA.precoDe ? `<div class="de">De R$ ${esc(OFERTA.precoDe)}</div>` : ''}
        <div class="por"><small>R$</small> ${esc(OFERTA.preco)}</div>
        ${OFERTA.parcelas ? `<div class="parc">ou ${esc(OFERTA.parcelas)}</div>` : ''}
      </div>
      ${ctaCheckout('Quero começar a despedida', 'full pulse')}
      ${selos}
    </div>
    <p class="center reveal" style="margin-top:28px;opacity:.85;max-width:620px;margin-left:auto;margin-right:auto">Cada noite de “me dá a chupeta” é mais uma volta no mesmo ciclo. A preparação pode começar hoje, com calma e no ritmo do seu filho.</p>
  </div>
</section>

<!-- 11. GARANTIA (reversão de risco) -->
<section>
  <div class="narrow">
    <div class="garantia reveal">
      <div class="selo"><span class="d">${OFERTA.garantiaDias}</span><small>dias de<br>garantia</small></div>
      <div>
        <h2 style="font-size:30px;margin-bottom:10px">O risco é todo nosso</h2>
        <p>Leia, conheça as etapas e veja se o Tchau Chupeta faz sentido para a sua família. Se nos próximos ${OFERTA.garantiaDias} dias você sentir que não é para você, é só pedir o reembolso e devolvemos <b>100% do valor</b>. Sem perguntas e sem burocracia.</p>
      </div>
    </div>
  </div>
</section>

<!-- 12. FAQ (objeções) -->
<section style="padding-top:0">
  <div class="narrow">
    <div class="center reveal"><span class="kicker">Dúvidas frequentes</span><h2>Ainda com alguma dúvida?</h2></div>
    ${faq.map((f) => `<details class="reveal"><summary>${f.p}</summary><div class="r"><p>${f.r}</p></div></details>`).join('\n    ')}
  </div>
</section>

<!-- 13. FECHAMENTO: escolha -->
<section class="final">
  <span class="star" style="top:12%;left:10%">${star(16)}</span>
  <span class="star" style="top:20%;right:12%;animation-delay:1.2s">${sparkle(18)}</span>
  <div class="narrow">
    <div class="reveal" style="width:130px;margin:0 auto 18px">${pacifier({ size: 130, wave: true })}</div>
    <h2 class="reveal">Um dia seu filho vai largar a chupeta. A pergunta é: como essa história vai ser lembrada?</h2>
    <div class="dois reveal">
      <div class="c1"><b>Caminho 1</b>Continuar tentando do jeito de sempre: esconder, ceder, recomeçar… e torcer para que dessa vez dê certo.</div>
      <div class="c2"><b>Caminho 2</b>Seguir um passo a passo pensado para preparar seu filho e transformar o tchau em um momento de carinho e crescimento.</div>
    </div>
    <div class="reveal">${ctaCheckout('Escolho o caminho 2', 'pulse')}${selos}</div>
  </div>
</section>

<footer>
  <p><b>Tchau Chupeta</b> © ${new Date().getFullYear()}. Todos os direitos reservados.</p>
  <p>Este material é educativo e não substitui a orientação de pediatras, odontopediatras ou outros profissionais de saúde. Cada criança tem seu próprio ritmo, e os resultados podem variar de família para família.</p>
</footer>

<div class="sticky" id="sticky">${cta('Quero começar a despedida', '', '#identificacao')}</div>

<script>
// Checklist: resposta conforme o número de itens marcados
(function(){
  var boxes = document.querySelectorAll('.check input'), resp = document.getElementById('resp');
  function upd(){
    var n = 0; boxes.forEach(function(b){ if (b.checked) n++; });
    if (!n) { resp.className = 'resp'; return; }
    resp.innerHTML = n >= 3
      ? 'Você marcou ' + n + ' de ' + boxes.length + '. Respira: você não está sozinha, e isso não é falta de vontade. É falta de um plano. Continue lendo 👇'
      : 'Você marcou ' + n + '. Então você já sentiu na pele como tirar a chupeta pode ser difícil. Veja o porquê 👇';
    resp.className = 'resp on';
  }
  boxes.forEach(function(b){ b.addEventListener('change', upd); });
})();

// Repassa UTMs e parâmetros do anúncio para o checkout
(function(){
  var q = location.search.slice(1);
  document.querySelectorAll('[data-checkout]').forEach(function(a){
    if (q && a.href.indexOf('http') === 0) a.href += (a.href.indexOf('?') < 0 ? '?' : '&') + q;
    a.addEventListener('click', function(){ if (window.fbq) fbq('track', 'InitiateCheckout', { value: ${valor}, currency: 'BRL' }); });
  });
})();

// Barra fixa: leva à próxima seção abaixo da tela atual (nunca pula direto para o preço)
(function(){
  var btn = document.querySelector('#sticky .btn');
  btn.addEventListener('click', function(ev){
    var secs = document.querySelectorAll('header.hero, section'), alvo = null;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].getBoundingClientRect().top > 80) { alvo = secs[i]; break; }
    }
    if (!alvo) return;
    ev.preventDefault();
    alvo.scrollIntoView({ behavior: 'smooth' });
  });
})();

// Barra fixa no mobile depois do hero; esconde na seção de oferta
(function(){
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

mkdirSync(join(out, 'fonts'), { recursive: true });
for (const f of ['Baloo2-latin.woff2', 'Nunito-latin.woff2']) copyFileSync(join(root, 'fonts', f), join(out, 'fonts', f));
writeFileSync(join(out, 'index.html'), html);
console.log('ok → pagina-vendas/index.html');
