// Gera os criativos estáticos do Missão Zero Tela: escreve um HTML por peça em ../html
// e renderiza cada um em PNG (../png) com o Chromium do Playwright.
// Uso: node src/build.mjs            (gera tudo)
//      node src/build.mjs feed-03    (gera só as peças cujo id contém o filtro)
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, logo, art, missionCard, sticker, stamp, tablet, heroKid, star, scribble } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };

// Fontes (Google Fonts, licença OFL) embutidas para que o HTML funcione offline.
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;
const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
@font-face{font-family:'Caveat';font-weight:700;src:${font('Caveat-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:'Nunito',sans-serif;color:${C.ink};background:${C.sun};position:relative;-webkit-font-smoothing:antialiased}
.h{font-family:'Baloo 2',sans-serif;font-weight:800;line-height:1.02;letter-spacing:-1px}
.hand{font-family:'Caveat',cursive;font-weight:700}
.abs{position:absolute}
.pad{position:absolute;inset:0;padding:80px;display:flex;flex-direction:column}
.row{display:flex;align-items:center}
.between{justify-content:space-between}
.speech{display:inline-block;align-self:flex-start;background:#fff;border:5px solid ${C.ink};border-radius:34px;padding:14px 34px;font-family:'Caveat';font-weight:700;font-size:64px;line-height:1.05;position:relative;transform:rotate(-2deg)}
.speech::after{content:"";position:absolute;left:46px;bottom:-22px;width:34px;height:34px;background:#fff;border-right:5px solid ${C.ink};border-bottom:5px solid ${C.ink};transform:rotate(45deg) skew(12deg,12deg)}
.mark{color:${C.crayon}}
.mark-sun{background:linear-gradient(transparent 60%, ${C.sun} 60%, ${C.sun} 92%, transparent 92%);padding:0 6px}
.red{color:${C.crayon}}
.body{font-size:38px;line-height:1.35;font-weight:700;color:${C.inkSoft}}
.body b{color:${C.ink};font-weight:900}
.cta{display:inline-flex;align-items:center;gap:14px;background:${C.leaf};color:#fff;font-family:'Baloo 2';font-weight:800;font-size:40px;border-radius:999px;padding:20px 46px;border:4px solid ${C.ink};box-shadow:0 10px 0 ${C.leafDark}}
.cta.ink{background:${C.ink};box-shadow:0 10px 0 #0F1730}
.cta.light{background:#fff;color:${C.ink};box-shadow:0 10px 0 rgba(255,255,255,.35)}
.chip{display:inline-flex;align-items:center;gap:10px;background:#fff;border:4px solid ${C.ink};border-radius:999px;padding:10px 24px;font-weight:900;font-size:30px}
.card{background:#fff;border:4px solid ${C.ink};border-radius:30px;box-shadow:8px 10px 0 rgba(30,42,74,.18)}
.notebook{background-color:#fff;background-image:repeating-linear-gradient(180deg, transparent 0 58px, ${C.line} 58px 61px)}
.notebook::before{content:"";position:absolute;left:62px;top:0;bottom:0;width:4px;background:${C.crayonSoft}}
.small{font-size:26px;font-weight:800;color:${C.inkSoft}}
.slide-n{position:absolute;top:60px;right:80px;font-weight:900;font-size:26px;background:#fff;border:3px solid ${C.ink};border-radius:999px;padding:6px 20px}
.swipe{position:absolute;bottom:64px;right:80px;font-weight:900;font-size:30px;display:flex;gap:10px;align-items:center}
`;

const page = (size, inner, extraCss = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>:root{--w:${size.w}px;--h:${size.h}px}${CSS}${extraCss}</style></head><body>${inner}</body></html>`;

const scatter = (items) => items.map(([x, y, svg, rot = 0]) => `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)">${svg}</div>`).join('');

// As três cartas da página, prontas para empilhar
const cards = {
  cabana: (o) => missionCard({ num: 42, emoji: '🌧️', title: 'Cabana do Explorador', tags: ['3–5 anos', '30 min'], artSvg: art.cabana(o.w * 0.34), bg: C.leafSoft, ...o }),
  detetive: (o) => missionCard({ num: 15, emoji: '🍽️', title: 'Detetive de Cores', tags: ['Sozinho', '10 min'], artSvg: art.detetive(o.w * 0.34), bg: C.sunSoft, ...o }),
  cidade: (o) => missionCard({ num: '07', emoji: '✂️', title: 'Cidade de Papel', tags: ['5–8 anos', '20 min', 'Juntos'], artSvg: art.cidade(o.w * 0.46), bg: C.sky, ...o }),
  foguete: (o) => missionCard({ num: 63, emoji: '🚀', title: 'Foguete de Caixa', tags: ['5–8 anos', '25 min'], artSvg: art.foguete(o.w * 0.34), bg: C.crayonSoft, ...o }),
  lua: (o) => missionCard({ num: 88, emoji: '🌙', title: 'Caça às Estrelas', tags: ['3–8 anos', 'Calma'], artSvg: art.lua(o.w * 0.34), bg: '#E9E5FF', ...o }),
};

const creatives = [];
const add = (id, dir, size, html) => creatives.push({ id, dir, size, html });

// ---------------------------------------------------------------------------
// FEED 4:5 (1080x1350) — um criativo estático por ângulo
// ---------------------------------------------------------------------------

// Ângulo 1 — "Só mais um vídeo" (a fala do filho, igual ao herói da página)
add('feed-01-so-mais-um-video', 'feed', FEED, page(FEED, `
<div class="pad">
  ${logo({ size: 0.9 })}
  <div class="speech" style="margin-top:44px">"Mãe, só mais um vídeo?"</div>
  <div class="h" style="font-size:94px;margin-top:50px;width:600px">Troque o <span class="mark">“só mais um vídeo”</span> por uma missão.</div>
  <div class="body" style="width:540px;margin-top:26px;color:${C.ink}">Historinhas-missão prontas para imprimir. Seu filho vira o herói e <b>brinca de verdade</b>.</div>
  <div class="row" style="flex-wrap:wrap;gap:12px;margin-top:34px;width:560px">
    <span class="chip" style="font-size:26px">3 a 8 anos</span><span class="chip" style="font-size:26px">Só material de casa</span><span class="chip" style="font-size:26px">Garantia de 7 dias</span>
  </div>
  <div class="row between" style="margin-top:auto"><div class="cta">Quero as missões →</div></div>
</div>
${cards.cabana({ w: 320, x: 660, y: 330, rot: -7, z: 1 })}
${cards.cidade({ w: 370, x: 640, y: 720, rot: 5, z: 2 })}
<div class="abs" style="left:880px;top:250px;z-index:3">${sticker({ size: 160 })}</div>
`));

// Ângulo 2 — "O problema não é a tela" (a crença errada)
add('feed-02-o-problema-nao-e-a-tela', 'feed', FEED, page(FEED, `
${scatter([[930, 90, star(44)], [990, 170, star(24)]])}
<div class="pad">
  <div class="hand" style="font-size:56px;color:${C.sun}">A virada</div>
  <div class="h" style="font-size:100px;margin-top:10px">O problema não é a tela.</div>
  <div class="h" style="font-size:100px;color:${C.sun}">É o vazio de ideias quando você desliga ela.</div>
  <div class="row" style="gap:28px;margin-top:56px;align-items:stretch">
    <div style="flex:1;border:4px dashed rgba(255,255,255,.45);border-radius:30px;padding:30px 30px">
      <div class="h" style="font-size:40px;opacity:.8">Sem um plano</div>
      <div class="hand" style="font-size:50px;margin-top:12px;opacity:.85">“Vai brincar com seus brinquedos”</div>
      <div style="font-size:32px;font-weight:800;margin-top:16px;opacity:.75">→ birra e a tela volta</div>
    </div>
    <div style="flex:1;background:#fff;color:${C.ink};border:4px solid #fff;border-radius:30px;padding:30px 30px">
      <div class="h" style="font-size:40px;color:${C.leaf}">Com uma missão</div>
      <div class="hand" style="font-size:50px;margin-top:12px">“Tem uma missão secreta para você!”</div>
      <div style="font-size:32px;font-weight:800;margin-top:16px;color:${C.inkSoft}">→ ele aceita e brinca</div>
    </div>
  </div>
  <div class="row between" style="margin-top:auto"><div class="cta">Ver as missões →</div>${logo({ size: 0.8, light: true })}</div>
</div>`, `body{background:${C.ink};color:#fff}`));

// Ângulo 3 — "A cena da birra" (o ciclo de tirar a tela)
const cycleNode = (x, y, emoji, text, bg) => `<div class="abs card" style="left:${x}px;top:${y}px;width:290px;padding:24px 18px;text-align:center;background:${bg}">
  <div style="font-size:62px">${emoji}</div><div class="h" style="font-size:42px;margin-top:6px">${text}</div></div>`;
add('feed-03-tirou-o-celular', 'feed', FEED, page(FEED, `
<div class="pad">
  <div class="h" style="font-size:90px">Tirou o celular…<br><span class="red">e veio a birra?</span></div>
  <div class="h" style="font-size:48px;color:${C.inkSoft};margin-top:14px">Acontece aí também?</div>
</div>
<svg class="abs" style="left:0;top:0" width="1080" height="1350">
  <defs><marker id="a" viewBox="0 0 10 10" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${C.ink}"/></marker></defs>
  <path d="M420 540 Q540 490 650 540" stroke="${C.ink}" stroke-width="7" fill="none" stroke-dasharray="4 16" stroke-linecap="round" marker-end="url(#a)"/>
  <path d="M840 720 Q830 810 700 850" stroke="${C.ink}" stroke-width="7" fill="none" stroke-dasharray="4 16" stroke-linecap="round" marker-end="url(#a)"/>
  <path d="M380 850 Q250 810 240 720" stroke="${C.ink}" stroke-width="7" fill="none" stroke-dasharray="4 16" stroke-linecap="round" marker-end="url(#a)"/>
</svg>
${cycleNode(90, 450, '📵', 'Você tira', '#fff')}
${cycleNode(700, 450, '😭', 'Vem a birra', C.crayonSoft)}
${cycleNode(395, 790, '📱', 'A tela volta', C.sky)}
<div class="abs" style="left:80px;right:80px;top:1060px">
  <div class="body" style="font-size:36px;color:${C.ink}">Não é falta de pulso. <b>Falta o que oferecer no lugar.</b> O Missão Zero Tela te dá a missão pronta.</div>
  <div class="row between" style="margin-top:30px"><div class="cta">Quebre esse ciclo →</div>${logo({ size: 0.75 })}</div>
</div>`, `body{background:#fff}`));

// Ângulo 4 — "Só mais um vídeo" o dia inteiro (formato nativo de conversa)
const bubble = (t, time, rot = 0) => `<div style="align-self:flex-start;transform:rotate(${rot}deg);background:#fff;border:4px solid ${C.ink};border-radius:34px 34px 34px 8px;padding:16px 28px;display:flex;align-items:baseline;gap:18px">
  <span style="font-size:36px;font-weight:800">${t}</span><span class="small" style="font-size:22px">${time}</span></div>`;
add('feed-04-o-dia-inteiro', 'feed', FEED, page(FEED, `
<div class="pad notebook" style="padding-left:110px">
  <div class="h" style="font-size:74px">Se você ouve <span class="mark-sun">“só mais um vídeo”</span> o dia inteiro, veja isso.</div>
  <div style="display:flex;flex-direction:column;gap:18px;margin-top:40px">
    ${bubble('mãe, só mais um vídeo 🥺', '07:40', -1)}
    ${bubble('deixa eu ver o tablet?', '12:15', 1)}
    ${bubble('tô entediadooo 😩', '15:30', -0.5)}
    ${bubble('só mais um, prometo!', '18:50', 1)}
    ${bubble('cadê o celular, mãe?', '20:30', -1)}
  </div>
  <div class="body" style="margin-top:44px;font-size:38px;width:560px">E se na próxima vez você tivesse <b>uma missão pronta</b> para oferecer no lugar?</div>
  <div class="row between" style="margin-top:auto"><div class="cta">Ver as missões →</div>${logo({ size: 0.75 })}</div>
</div>
<div class="abs" style="right:80px;top:880px">${tablet({ size: 190, off: true })}</div>
<div class="abs hand" style="left:560px;top:1050px;font-size:44px;color:${C.crayon};transform:rotate(-3deg)">e se tivesse uma missão? →</div>
`, `body{background:#fff}`));

// Ângulo 5 — "Por dentro de uma missão" (como funciona)
const note = (x, y, n, t, w = 330) => `<div class="abs row" style="left:${x}px;top:${y}px;width:${w}px;gap:14px;align-items:flex-start">
  <div class="h" style="flex:none;width:58px;height:58px;border-radius:50%;background:${C.sun};border:4px solid ${C.ink};display:grid;place-items:center;font-size:32px;padding-top:4px">${n}</div>
  <div style="font-size:31px;font-weight:800;line-height:1.2">${t}</div></div>`;
add('feed-05-por-dentro-da-missao', 'feed', FEED, page(FEED, `
<div class="pad">
  <div class="hand" style="font-size:52px;color:${C.crayon}">Por dentro de uma missão</div>
  <div class="h" style="font-size:80px;margin-top:4px">Tudo pensado para você não precisar pensar.</div>
</div>
${cards.cidade({ w: 420, x: 80, y: 430, rot: -3 })}
${note(560, 440, 1, 'Historinha em quadrinhos: seu filho vira o herói')}
${note(560, 590, 2, 'Idade, tempo e bagunça na carta')}
${note(560, 720, 3, 'Só material de casa: papel e giz')}
${note(560, 850, 4, 'Frase-convite pronta para ler em voz alta')}
<div class="abs" style="left:110px;top:1010px">${stamp({ size: 0.9 })}</div>
<div class="abs row between" style="left:80px;right:80px;bottom:80px"><div class="cta">Ver as 100 missões →</div>${logo({ size: 0.75 })}</div>
`, `body{background:${C.sky}}`));

// Ângulo 6 — "Só com o que tem em casa" (facilidade e tempo)
const item = (e, t) => `<div class="chip" style="font-size:34px;padding:12px 26px"><span style="font-size:40px">${e}</span>${t}</div>`;
add('feed-06-material-de-casa', 'feed', FEED, page(FEED, `
<div class="pad">
  <div class="h" style="font-size:88px">Sem kit, sem EVA, sem tinta especial.</div>
  <div class="body" style="margin-top:22px;color:${C.ink}">Cada missão usa <b>só o que você já tem em casa</b> e leva <b>5 minutos</b> para começar.</div>
  <div class="row" style="flex-wrap:wrap;gap:16px;margin-top:44px;width:620px">
    ${item('📄', 'papel')}${item('🖍️', 'giz')}${item('📦', 'caixa')}${item('🥄', 'colher')}${item('🛏️', 'lençol')}${item('🫙', 'pote')}
  </div>
  <div class="row between" style="margin-top:auto"><div class="cta">Quero começar hoje →</div>${logo({ size: 0.75 })}</div>
</div>
<div class="abs" style="right:60px;top:440px">${heroKid({ size: 330 })}</div>
${cards.foguete({ w: 300, x: 120, y: 820, rot: -6 })}
${cards.cabana({ w: 300, x: 420, y: 800, rot: 5 })}
`));

// Ângulo 7 — Oferta (o que vem, preço e garantia)
const check = (t) => `<div class="row" style="gap:16px;font-size:34px;font-weight:800"><span style="flex:none;width:44px;height:44px;border-radius:12px;background:${C.leaf};color:#fff;display:grid;place-items:center;border:3px solid ${C.ink};font-size:28px">✓</span>${t}</div>`;
add('feed-07-oferta', 'feed', FEED, page(FEED, `
<div class="pad">
  ${logo({ size: 0.9 })}
  <div class="h" style="font-size:86px;margin-top:36px">100 historinhas-missão + 4 bônus</div>
  <div class="card" style="margin-top:36px;padding:36px 40px;display:flex;flex-direction:column;gap:18px">
    ${check('Separadas por idade: 3–4, 5–6 e 7–8 anos')}
    ${check('Por momento: chuva, jantar, viagem, dormir')}
    ${check('Pote de Missões e Passaporte do Explorador')}
    ${check('Guia “Desligar sem birra”')}
    ${check('Desafio 30 Dias Zero Tela')}
  </div>
  <div class="row between" style="margin-top:34px;align-items:flex-end">
    <div><div class="small" style="color:${C.ink}">Plano completo por</div>
      <div class="h" style="font-size:120px;line-height:.9">R$ 27,90</div>
      <div class="small" style="color:${C.ink};margin-top:8px">PDF · acesso imediato · garantia de 7 dias</div></div>
  </div>
  <div style="margin-top:auto"><div class="cta">Quero o plano completo →</div></div>
</div>
<div class="abs" style="right:70px;top:960px">${sticker({ size: 190, top: '7', bottom: 'dias de garantia', bg: C.leaf })}</div>
`));

// ---------------------------------------------------------------------------
// STORIES / REELS 9:16 (1080x1920) — respeita as áreas seguras (topo 250px, base 340px)
// ---------------------------------------------------------------------------
add('stories-01-so-mais-um-video', 'stories', STORY, page(STORY, `
<div class="abs" style="left:80px;right:80px;top:270px;display:flex;flex-direction:column">
  <div class="speech" style="font-size:76px">"Mãe, só mais um vídeo?"</div>
  <div class="h" style="font-size:98px;margin-top:64px">E se você tivesse uma <span class="mark">missão pronta</span> para oferecer no lugar?</div>
  <div style="font-size:44px;font-weight:800;margin-top:34px;line-height:1.3">100 historinhas-missão para imprimir. Só com material de casa.</div>
</div>
${cards.cabana({ w: 300, x: 130, y: 1110, rot: -8, z: 1 })}
${cards.cidade({ w: 320, x: 560, y: 1090, rot: 6, z: 2 })}
<div class="abs" style="left:870px;top:1030px;z-index:3">${sticker({ size: 140 })}</div>
<div class="abs row between" style="left:80px;right:80px;bottom:350px;z-index:4"><div class="cta">Ver as missões ↑</div>${logo({ size: 0.75 })}</div>
`));

const moment = (e, t, d) => `<div class="card row" style="padding:22px 30px;gap:24px"><span style="font-size:60px">${e}</span>
  <div><div class="h" style="font-size:46px">${t}</div><div style="font-size:30px;font-weight:700;color:${C.inkSoft}">${d}</div></div></div>`;
add('stories-02-uma-missao-para-cada-momento', 'stories', STORY, page(STORY, `
<div class="abs" style="left:80px;right:80px;top:270px">
  <div class="hand" style="font-size:60px;color:${C.crayon}">Na hora H, nada de cabeça em branco</div>
  <div class="h" style="font-size:100px;margin-top:6px">Uma missão para cada momento</div>
</div>
<div class="abs" style="left:80px;right:80px;top:640px;display:flex;flex-direction:column;gap:20px">
  ${moment('🌧️', 'Dia de chuva', 'Aventuras para gastar energia')}
  ${moment('🍳', 'Enquanto faço o jantar', 'Missões para fazer sozinho')}
  ${moment('🚗', 'Viagem de carro', 'Jogos de olhar e adivinhar')}
  ${moment('🌙', 'Antes de dormir', 'Missões calmas para desacelerar')}
  ${moment('⏱️', 'Só 5 minutos', 'Para quando ele pede o celular')}
</div>
<div class="abs row between" style="left:80px;right:80px;bottom:350px"><div class="cta">Conhecer as missões ↑</div>${logo({ size: 0.75 })}</div>
`, `body{background:${C.sky}}`));

// ---------------------------------------------------------------------------
// CARROSSEL 4:5 (6 slides) — uma trilha de giz atravessa os slides
// ---------------------------------------------------------------------------
const trail = (i) => `<svg class="abs" style="left:0;bottom:170px" width="1080" height="200"><path d="M0 ${i % 2 ? 60 : 140} C 360 ${i % 2 ? 180 : 20}, 720 ${i % 2 ? 180 : 20}, 1080 ${i % 2 ? 140 : 60}" stroke="${C.ink}" stroke-opacity=".25" stroke-width="8" fill="none" stroke-dasharray="2 22" stroke-linecap="round"/></svg>`;
const carousel = [
  { bg: C.sun, body: `
    <div class="speech" style="margin-top:60px">"Mãe, só mais um vídeo?"</div>
    <div class="h" style="font-size:118px;margin-top:60px;width:820px">Seu filho só quer saber de tela?</div>
    <div class="abs" style="right:90px;bottom:250px">${tablet({ size: 280 })}</div>` },
  { bg: '#fff', body: `
    <div class="h" style="font-size:96px;margin-top:80px">Você desliga, ele chora, e <span class="red">a tela volta</span> em 10 minutos.</div>
    <div class="body" style="margin-top:36px;width:720px">E quando você pensa no que oferecer no lugar, a cabeça dá branco.</div>
    <div class="abs" style="right:90px;bottom:260px">${tablet({ size: 230, off: true })}</div>` },
  { bg: 'ink', body: `
    <div class="h" style="font-size:100px;margin-top:80px">O problema não é a tela.</div>
    <div class="h" style="font-size:100px;color:${C.sun}">É o vazio de ideias.</div>
    <div style="font-size:42px;font-weight:700;margin-top:36px;line-height:1.3;width:760px;opacity:.9">A criança não troca o desenho por “vai brincar”. Ela troca por um <b style="color:${C.sun}">convite irresistível</b>.</div>
    ${cards.lua({ w: 290, x: 420, y: 720, rot: -6 })}${cards.foguete({ w: 290, x: 700, y: 690, rot: 6 })}` },
  { bg: C.sky, body: `
    <div class="h" style="font-size:96px;margin-top:70px">Por isso criamos o</div>
    <div style="margin-top:24px">${logo({ size: 2.1 })}</div>
    <div class="body" style="margin-top:36px;width:560px">100 historinhas-missão em que <b>seu filho é o herói</b> e aceita o desafio.</div>
    <div class="abs" style="right:80px;bottom:200px">${heroKid({ size: 300 })}</div>` },
  { bg: C.leafSoft, body: `
    <div class="h" style="font-size:90px;margin-top:70px">Como funciona na sua casa</div>
    <div style="display:flex;flex-direction:column;gap:18px;margin-top:40px">
      ${[['🫙', 'Ele sorteia uma missão no pote'], ['📖', 'Vocês leem a historinha'], ['🖍️', 'Brincam com o que tem em casa'], ['🏅', 'Carimbam o Passaporte']].map(([e, t]) => `<div class="card row" style="padding:22px 30px;gap:20px;font-size:40px;font-weight:900"><span style="font-size:50px">${e}</span>${t}</div>`).join('')}
    </div>` },
  { bg: C.sun, body: `
    <div class="h" style="font-size:96px;margin-top:80px">100 missões + 4 bônus por <span class="mark">R$ 27,90</span></div>
    <div style="font-size:40px;font-weight:800;margin-top:30px;line-height:1.35">Para crianças de 3 a 8 anos. PDF para imprimir ou usar no celular. Garantia de 7 dias.</div>
    <div class="abs" style="left:80px;bottom:200px"><div class="cta">Toque em “Saiba mais” →</div></div>
    ${cards.cidade({ w: 330, x: 110, y: 610, rot: -5 })}
    <div class="abs" style="left:560px;top:760px">${stamp({ size: 0.9, rot: -8 })}</div>
    <div class="abs" style="right:90px;top:560px">${sticker({ size: 170 })}</div>` },
];
carousel.forEach((s, i) => {
  const isInk = s.bg === 'ink';
  add(`carrossel-0${i + 1}`, 'carrossel', FEED, page(FEED, `
  ${trail(i)}
  <div class="slide-n" style="${isInk ? 'background:transparent;color:#fff;border-color:#fff' : ''}">${i + 1}/6</div>
  <div class="pad">${s.body}</div>
  <div class="abs" style="left:80px;bottom:64px">${logo({ size: 0.7, light: isInk })}</div>
  ${i < 5 ? `<div class="swipe" style="${isInk ? 'color:#fff' : ''}">arraste →</div>` : ''}`,
  isInk ? `body{background:${C.ink};color:#fff}` : `body{background:${s.bg}}`));
});

// ---------------------------------------------------------------------------
const filter = process.argv[2];
const todo = creatives.filter((c) => !filter || c.id.includes(filter));
const browser = await chromium.launch();
for (const c of todo) {
  const htmlPath = join(ROOT, 'html', `${c.id}.html`);
  const pngPath = join(ROOT, 'png', c.dir, `${c.id}.png`);
  mkdirSync(dirname(htmlPath), { recursive: true });
  mkdirSync(dirname(pngPath), { recursive: true });
  writeFileSync(htmlPath, c.html);
  const pg = await browser.newPage({ viewport: { width: c.size.w, height: c.size.h } });
  await pg.setContent(c.html, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: pngPath });
  await pg.close();
  console.log('ok', c.id);
}
await browser.close();
