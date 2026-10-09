// Gera ../pagina-de-vendas.html (arquivo único, ilustrações em SVG inline).
// Antes de publicar: troque CHECKOUT pelo link da oferta na Kiwify (ou outra plataforma).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg, tint, mermaid, crown, shell, starfish, fish, pearl, sparkle, bubble, chest, castle, seahorse, turtle } from './art.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'pagina-de-vendas.html');
const CHECKOUT = '#COLE-AQUI-O-LINK-DO-CHECKOUT';
const PAL = ['#FFD6E8', '#BDEBFF', '#E3D4FF', '#FFF0A8', '#C8F2DF', '#FFC9B8'];
const art = (inner, vb) => tint(svg(inner, vb), PAL);
const PRECO = 'R$ 9,90';

const hero = art(mermaid(150, 150, 0.6, 'long') + mermaid(300, 140, 0.66, 'bun') + mermaid(450, 150, 0.6, 'braid') + crown(300, 22, 0.5) +
  castle(80, 400, 0.5) + shell(520, 390, 0.45) + starfish(300, 410, 0.5) + fish(500, 260, 0.35, 0, true) + sparkle(40, 60, 1) + sparkle(560, 60, 1) + bubble(40, 300, 16), '0 0 600 500');
const sereia = (h, extra = '') => art(mermaid(300, 180, 1.0, h) + extra, '190 -30 220 500');
const princesas = [
  ['Marina', 'long', 'A exploradora. Adora conchas, curiosidades e fazer perguntas sobre tudo o que existe no fundo do mar.'],
  ['Pérola', 'bun', 'A sonhadora. Vive inventando histórias e canções para os peixinhos dormirem.'],
  ['Corália', 'braid', 'A artista. Pinta o oceano de todas as cores e acredita que toda ideia vira um desenho.'],
  ['Estrela', 'curly', 'A brincalhona. Faz todo mundo rir, até as ondas começam a dançar.'],
];
const cta = (t) => `<a class="btn" href="${CHECKOUT}">👑 ${t}<small>${PRECO} · pagamento único · acesso imediato</small></a>`;

const faq = [
  ['O produto é físico ou digital?', 'É digital. Você recebe o livro em PDF logo após a confirmação do pagamento e imprime em casa quantas vezes quiser. Nada é enviado pelos Correios.'],
  ['Para qual idade é indicado?', 'Foi pensado para meninas de cerca de 4 a 8 anos. As atividades são simples e as maiores têm desafios um pouco mais elaborados, então cada uma aproveita no seu ritmo.'],
  ['Preciso de impressora?', 'Para colorir no papel, sim. Se não tiver uma em casa, você pode levar o PDF a uma papelaria ou gráfica rápida e imprimir só as páginas que quiser. Funciona em folha A4, colorida ou preto e branco.'],
  ['Quantas páginas tem?', 'São 30 páginas: 15 para colorir, 5 atividades, 5 desafios e 5 páginas especiais. Além delas, o bônus Caça ao Tesouro Encantado.'],
  ['O que é a Caça ao Tesouro Encantado?', 'É um bônus em 5 páginas: pistas, enigmas e um mapa para transformar a casa em um reino. Você esconde as pistas e a criança segue as quatro etapas até encontrar o tesouro.'],
  ['Por quanto tempo tenho acesso?', 'O arquivo é seu: baixe, salve no computador ou no celular e use quando quiser, sem prazo para expirar.'],
  ['É só para o Dia das Crianças?', 'Não! Serve para o dia a dia, dias de chuva, viagens, aniversários e também como presente para uma menina especial.'],
];

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mundo das Sereias Encantadas</title>
<meta name="description" content="Livro digital de colorir e atividades com 30 páginas e bônus Caça ao Tesouro, para meninas de 4 a 8 anos.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap">
<style>
:root{color-scheme:light;--ink:#2B2552;--soft:#5B567F;--teal:#1FB5B0;--teal-d:#128A86;--aqua:#DDF7F5;--lilac:#EFE7FF;--pink:#FF7FB0;--pink-d:#E0558C;--gold:#FFD54A;--cream:#FFFBF5;--r:22px}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font-family:"Nunito",system-ui,sans-serif;font-size:17px;line-height:1.55}
h1,h2,h3{font-family:"Baloo 2",system-ui,sans-serif;line-height:1.08;margin:0;text-wrap:balance}
h2{font-size:clamp(28px,6.6vw,40px);font-weight:800}
h3{font-size:22px;font-weight:800}
p{margin:0}
.wrap{max-width:760px;margin:0 auto;padding-inline:18px}
section{padding-block:52px}
.aqua{background:var(--aqua)}.lilac{background:var(--lilac)}.cream{background:var(--cream)}
.center{text-align:center}.stack>*+*{margin-top:16px}
.lead{font-size:19px;color:var(--soft)}
.top{background:var(--ink);color:#fff;text-align:center;font-weight:800;font-size:14px;padding:9px 14px}.top b{color:var(--gold)}
.hero{background:linear-gradient(170deg,#B8F0EB 0%,#D9CCFF 60%,#FFD0E4 100%);padding-block:34px 48px;text-align:center}
.eyebrow{display:inline-block;background:#fff;border:2px solid var(--ink);border-radius:99px;padding:5px 16px;font-weight:800;font-size:14px}
.hero h1{font-size:clamp(34px,8.4vw,56px);font-weight:800;margin-top:16px}
.hero h1 em{font-style:normal;color:#fff;-webkit-text-stroke:1.5px var(--ink);text-shadow:0 3px 0 var(--ink)}
.hero .lead{color:var(--ink);margin-top:14px}
.hero-art{max-width:520px;margin:20px auto 0}.hero-art svg{width:100%;height:auto;display:block}
.pill{display:inline-block;background:var(--gold);border:2px solid var(--ink);border-radius:14px;padding:8px 16px;font-family:"Baloo 2";font-weight:800;font-size:19px;margin-top:6px}
.price{font-family:"Baloo 2";font-weight:800;font-size:44px;line-height:1;margin-top:14px}.price small{font-size:16px;font-weight:700;color:var(--soft);display:block}
.btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;max-width:460px;margin:18px auto 0;font-family:"Baloo 2";font-weight:800;font-size:21px;color:#fff;background:var(--pink-d);border-radius:999px;padding:16px 26px;text-decoration:none;box-shadow:0 6px 0 #A83A66;transition:transform .12s,box-shadow .12s;animation:pulse 2.4s ease-in-out infinite}
.btn:hover{transform:translateY(2px);box-shadow:0 4px 0 #A83A66}
.btn small{font-family:"Nunito";font-size:13px;font-weight:700;opacity:.95}
@keyframes pulse{50%{transform:scale(1.03)}}
@media (prefers-reduced-motion:reduce){.btn{animation:none}}
.btn:focus-visible,summary:focus-visible{outline:3px solid var(--ink);outline-offset:3px}
ul.dots{list-style:none;padding:0;margin:0}ul.dots li{padding:10px 0 10px 40px;position:relative;border-bottom:2px dotted #CBBFEF}
ul.dots li::before{content:"✨";position:absolute;left:4px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:18px}
.stat{background:#fff;border:3px solid var(--ink);border-radius:var(--r);padding:16px 10px;text-align:center}
.stat b{display:block;font-family:"Baloo 2";font-size:40px;line-height:1;color:var(--teal-d)}
.chars{display:grid;grid-template-columns:1fr;gap:14px;margin-top:20px}
.char{display:flex;gap:14px;align-items:center;background:#fff;border:3px solid var(--ink);border-radius:var(--r);padding:12px 16px}
.char .im{width:84px;flex:none}.char .im svg{width:100%;height:auto;display:block}
.steps{counter-reset:s;list-style:none;padding:0;margin:20px 0 0}
.steps li{counter-increment:s;background:#fff;border:3px solid var(--ink);border-radius:var(--r);padding:14px 16px 14px 64px;position:relative;margin-top:12px}
.steps li::before{content:counter(s);position:absolute;left:14px;top:12px;width:36px;height:36px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;font-family:"Baloo 2";font-weight:800;font-size:20px}
.bonus{background:#fff;border:3px dashed var(--ink);border-radius:var(--r);padding:20px}
.bonus .art{max-width:200px;margin:0 auto 8px}.bonus .art svg{width:100%;height:auto;display:block}
.quote{font-family:"Baloo 2";font-size:21px;font-weight:700;color:var(--ink);padding:14px 18px;border-left:6px solid var(--pink);background:#fff;border-radius:0 16px 16px 0}
.offer{background:#fff;border:4px solid var(--ink);border-radius:28px;padding:26px 20px;text-align:center;box-shadow:8px 10px 0 rgba(43,37,82,.18)}
.offer ul{list-style:none;padding:0;margin:14px 0;text-align:left}.offer li{padding:6px 0 6px 32px;position:relative}.offer li::before{content:"✔";position:absolute;left:4px;color:var(--teal-d);font-weight:800}
.old{text-decoration:line-through;color:var(--soft);font-weight:700}
.guar{display:flex;gap:16px;align-items:center;background:#fff;border:3px solid var(--ink);border-radius:var(--r);padding:18px}
.guar .seal{flex:none;width:84px;height:84px;border-radius:50%;background:var(--gold);border:3px solid var(--ink);display:grid;place-items:center;text-align:center;font-family:"Baloo 2";font-weight:800;line-height:1}.guar .seal b{font-size:30px;display:block}
details{background:#fff;border:3px solid var(--ink);border-radius:18px;padding:0;margin-top:10px}
summary{cursor:pointer;font-weight:800;padding:14px 18px;list-style:none;display:flex;justify-content:space-between;gap:12px}
summary::after{content:"+";font-family:"Baloo 2";font-size:24px;line-height:1}details[open] summary::after{content:"–"}
summary::-webkit-details-marker{display:none}
details p{padding:0 18px 16px;color:var(--soft)}
footer{background:var(--ink);color:#C9C4E8;text-align:center;font-size:13px;padding:30px 18px}
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:10;background:#fff;border-top:3px solid var(--ink);padding:8px 14px;display:flex;align-items:center;justify-content:center;gap:12px;transform:translateY(110%);transition:transform .25s}
.sticky.show{transform:none}.sticky b{font-family:"Baloo 2";font-size:22px}
.sticky a{background:var(--pink-d);color:#fff;font-family:"Baloo 2";font-weight:800;border-radius:99px;padding:8px 20px;text-decoration:none}
</style></head><body>

<div class="top">🌊 Oferta de lançamento: <b>${PRECO}</b> por tempo limitado</div>

<header class="hero"><div class="wrap">
  <span class="eyebrow">✨ Um mundo de imaginação esperando por ela</span>
  <h1>Descubra um mundo onde toda menina pode ser uma <em>sereia encantada!</em> 🧜‍♀️</h1>
  <p class="lead">Um livro digital para imprimir, com páginas de colorir, atividades e desafios que fazem a imaginação dela mergulhar no fundo do mar.</p>
  <div class="pill">30 páginas + 🎁 Caça ao Tesouro Encantado</div>
  <div class="price">${PRECO}<small>pagamento único</small></div>
  ${cta('QUERO O LIVRO MÁGICO')}
  <div class="hero-art">${hero}</div>
</div></header>

<section class="cream"><div class="wrap stack">
  <h2 class="center">As telas ocupam espaço demais na infância</h2>
  <p class="lead">Desenhos, vídeos e jogos prendem a atenção da criança por horas, e sobra pouco tempo para o que mais faz bem nessa fase: criar, inventar e brincar com as mãos.</p>
  <p class="lead">A ideia aqui não é proibir a tecnologia. É oferecer uma <mark style="background:linear-gradient(transparent 55%,var(--gold) 55%)">pausa mágica</mark>, um convite tão gostoso que ela mesma escolhe largar a tela.</p>
</div></section>

<section class="lilac"><div class="wrap">
  <h2 class="center">Com este livro, ela vai:</h2>
  <ul class="dots" style="margin-top:18px">
    <li>Inventar histórias de reinos e criaturas do mar</li><li>Colorir cenas lindas, do jeito dela</li><li>Imaginar castelos e jardins submersos</li>
    <li>Brincar de sereia e de rainha do oceano</li><li>Descobrir coisas novas a cada página</li><li>Viver pequenas aventuras sem precisar de tela</li>
  </ul>
</div></section>

<section class="aqua"><div class="wrap center">
  <h2>Conheça o Mundo das Sereias Encantadas</h2>
  <p class="lead" style="margin-top:12px">Um livro completo, para imprimir e usar quantas vezes quiser:</p>
  <div class="grid"><div class="stat"><b>15</b>páginas para colorir</div><div class="stat"><b>5</b>atividades</div><div class="stat"><b>5</b>desafios</div><div class="stat"><b>5</b>páginas especiais</div></div>
  ${cta('QUERO O MEU LIVRO MÁGICO')}
</div></section>

<section class="cream"><div class="wrap">
  <h2 class="center">As quatro sereias do reino</h2>
  <div class="chars">${princesas.map(([n, h, t]) => `<div class="char"><div class="im">${sereia(h)}</div><div><h3>${n}</h3><p style="font-size:15.5px;color:var(--soft)">${t}</p></div></div>`).join('')}</div>
</div></section>

<section class="lilac"><div class="wrap">
  <div class="bonus center">
    <div class="art">${art(chest(300, 260, 1.6) + sparkle(90, 70, 1.2) + sparkle(510, 90, 1.4) + pearl(300, 80, 22), '0 0 600 400')}</div>
    <span class="eyebrow" style="background:var(--gold)">🎁 BÔNUS INCLUÍDO</span>
    <h2 style="margin-top:12px">Caça ao Tesouro Encantado</h2>
    <p class="lead" style="margin-top:10px">A rainha do mar escondeu um tesouro. Para chegar até ele, é só seguir as pistas, uma etapa de cada vez:</p>
    <ol class="steps" style="text-align:left"><li><b>Procure</b> a primeira pista escondida pela casa.</li><li><b>Descubra</b> a resposta de cada enigma das sereias.</li><li><b>Avance</b> pelo mapa, com desafios divertidos pelo caminho.</li><li><b>Encontre o tesouro</b> e abra o baú da surpresa!</li></ol>
    <p style="margin-top:14px;font-weight:800">Ótima também para dar de presente. 🎀</p>
  </div>
</div></section>

<section class="cream"><div class="wrap stack">
  <h2 class="center">Pequenos momentos que ficam na memória</h2>
  <p class="quote">“Mamãe, olha o castelo que eu pintei!”</p>
  <p class="quote">“Agora eu sou a rainha do mar, e você é o golfinho.”</p>
  <p class="quote">“Vamos fazer mais uma página juntas?”</p>
</div></section>

<section class="aqua" id="oferta"><div class="wrap">
  <div class="offer">
    <span class="eyebrow">👑 Tudo isso por um preço de lanche</span>
    <h2 style="margin-top:12px">Mundo das Sereias Encantadas</h2>
    <ul><li>15 páginas para colorir</li><li>5 atividades (labirinto, caça-palavras e mais)</li><li>5 desafios criativos</li><li>5 páginas especiais (certificado, diário, mapa, cartão e moldura)</li><li><b>Bônus:</b> Caça ao Tesouro Encantado</li><li>PDF para imprimir quantas vezes quiser, colorido ou preto e branco</li></ul>
    <div class="price">${PRECO}<small>pagamento único · acesso imediato</small></div>
    ${cta('QUERO O MUNDO DAS SEREIAS ENCANTADAS')}
  </div>
</div></section>

<section class="cream"><div class="wrap">
  <div class="guar"><div class="seal"><span><b>7</b>dias</span></div>
    <div><h3>Garantia incondicional de 7 dias</h3><p style="color:var(--soft);margin-top:4px">Se por qualquer motivo você não gostar, é só pedir o reembolso dentro de 7 dias, sem complicação. O risco é todo nosso, a aventura é toda dela.</p></div></div>
</div></section>

<section class="lilac"><div class="wrap">
  <h2 class="center">Perguntas frequentes</h2>
  <div style="margin-top:16px">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
</div></section>

<section class="aqua"><div class="wrap center">
  <h2>Dê a ela um mundo para imaginar 👑</h2>
  <p class="lead" style="margin-top:10px">Menos tela, mais brincadeira. Comece hoje.</p>
  <div class="price">${PRECO}<small>pagamento único</small></div>
  ${cta('QUERO O LIVRO MÁGICO')}
</div></section>

<footer>© <span id="y">2026</span> Mundo das Sereias Encantadas · Todos os direitos reservados.<br>Material digital para uso pessoal e exclusivo. É proibida a revenda ou a distribuição do arquivo.</footer>

<div class="sticky" id="sticky"><b>${PRECO}</b><a href="${CHECKOUT}">Quero o livro</a></div>
<script>
document.getElementById('y').textContent=new Date().getFullYear();
var s=document.getElementById('sticky'),o=document.getElementById('oferta');
function f(){var r=o.getBoundingClientRect();s.classList.toggle('show',window.scrollY>500&&!(r.top<innerHeight&&r.bottom>0))}
addEventListener('scroll',f,{passive:true});f();
</script>
</body></html>`;
writeFileSync(OUT, html);
console.log('gerado', OUT);
