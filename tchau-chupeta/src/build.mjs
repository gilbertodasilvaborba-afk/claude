// Gera os criativos do Tchau Chupeta: escreve um HTML por peça em ../html
// e renderiza cada um em PNG (../png) com o Chromium do Playwright.
// Uso: node src/build.mjs            (gera tudo)
//      node src/build.mjs feed-03    (gera só as peças cujo id contém o filtro)
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, familyHug, childWaving, logo } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };

// Fontes (Google Fonts, licença OFL) embutidas para que o HTML funcione offline.
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;
const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:'Nunito',sans-serif;color:${C.ink};background:${C.cream};position:relative;-webkit-font-smoothing:antialiased}
.h{font-family:'Baloo 2',sans-serif;font-weight:800;line-height:1.02;letter-spacing:-1px}
.abs{position:absolute}
.pad{position:absolute;inset:0;padding:80px 80px;display:flex;flex-direction:column}
.tag{display:inline-flex;align-self:flex-start;align-items:center;gap:10px;background:#fff;border-radius:999px;padding:12px 26px;font-weight:800;font-size:28px;color:${C.lavenderDeep};box-shadow:0 6px 0 rgba(58,53,99,.08)}
.hl{background:linear-gradient(transparent 58%, ${C.sun} 58%, ${C.sun} 92%, transparent 92%);padding:0 6px}
.hl-peach{background:linear-gradient(transparent 58%, ${C.peach} 58%, ${C.peach} 92%, transparent 92%);padding:0 6px}
.body{font-size:38px;line-height:1.35;font-weight:600;color:${C.inkSoft}}
.body b{color:${C.ink};font-weight:800}
.cta{display:inline-flex;align-items:center;gap:14px;background:${C.ink};color:#fff;font-weight:900;font-size:36px;border-radius:999px;padding:26px 46px;box-shadow:0 10px 0 ${C.lavenderDeep}}
.cta.peach{background:${C.peachDeep};box-shadow:0 10px 0 #C96A56}
.cta.light{background:#fff;color:${C.ink};box-shadow:0 10px 0 ${C.lavender}}
.row{display:flex;align-items:center}
.between{justify-content:space-between}
.logo{display:flex;align-items:center;gap:calc(10px*var(--s))}
.logo-icon{display:flex}
.logo-text{font-family:'Baloo 2';font-weight:700;font-size:calc(30px*var(--s));line-height:.9;text-transform:uppercase;letter-spacing:1px}
.logo-text b{font-weight:800;font-size:calc(38px*var(--s))}
.card{background:#fff;border-radius:40px;box-shadow:0 14px 0 rgba(58,53,99,.07)}
.product{display:flex;align-items:center;gap:26px;background:#fff;border-radius:36px;padding:26px 34px;box-shadow:0 12px 0 rgba(58,53,99,.07)}
.product .t{font-family:'Baloo 2';font-weight:800;font-size:40px;line-height:1;text-transform:uppercase;letter-spacing:.5px}
.product .d{font-size:28px;font-weight:700;color:${C.inkSoft};line-height:1.25;margin-top:6px}
.dots{position:absolute;inset:0;background-image:radial-gradient(${C.lavender} 2.2px, transparent 2.6px);background-size:44px 44px;opacity:.35}
.night{background:linear-gradient(180deg, ${C.nightDeep} 0%, ${C.night} 55%, #5B4F9C 100%);color:#fff}
.small{font-size:24px;font-weight:700;color:${C.inkSoft}}
.slide-n{position:absolute;top:70px;right:80px;font-weight:900;font-size:26px;color:${C.inkSoft};background:#fff;border-radius:999px;padding:8px 22px}
.swipe{position:absolute;bottom:70px;right:80px;font-weight:900;font-size:30px;color:${C.lavenderDeep};display:flex;gap:10px;align-items:center}
`;

const page = (size, inner, extraCss = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>:root{--w:${size.w}px;--h:${size.h}px}${CSS}${extraCss}</style></head><body>${inner}</body></html>`;

const productBox = (desc = 'O passo a passo para conduzir a despedida da chupeta.') => `
<div class="product">${pacifier({ size: 92, mood: 'happy', wave: true })}
  <div><div class="t">Tchau Chupeta</div><div class="d">${desc}</div></div></div>`;

const scatter = (items) => items.map(([x, y, svg, rot = 0]) => `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${rot}deg)">${svg}</div>`).join('');

// ---------------------------------------------------------------------------
// FEED 4:5 (1080x1350) — um criativo estático por ângulo
// ---------------------------------------------------------------------------
const creatives = [];
const add = (id, dir, size, html) => creatives.push({ id, dir, size, html });

// Ângulo 1 — "Não é só tirar"
add('feed-01-nao-e-so-tirar', 'feed', FEED, page(FEED, `
<div class="dots"></div>
${scatter([[930, 90, star(46)], [870, 170, sparkle(28)], [960, 560, sparkle(26, C.lavender)]])}
<div class="pad">
  <div class="tag">⚠️ Antes de tirar a chupeta, leia isto</div>
  <div class="h" style="font-size:92px;margin-top:40px">O erro pode estar em tirar a chupeta <span class="hl">de uma hora para outra.</span></div>
  <div class="row" style="gap:40px;margin-top:40px">
    <div style="flex:none">${pacifier({ size: 230, mood: 'sad' })}</div>
    <div class="body">Para muitas crianças, a chupeta é <b>conforto e segurança</b>. Por isso, a retirada pode precisar de <b>preparação</b> — e não só de coragem.</div>
  </div>
  <div class="row" style="gap:14px;margin-top:34px;flex-wrap:wrap">
    ${['esconder', 'jogar fora', 'proibir de repente'].map((t) => `<div style="background:#fff;border-radius:999px;padding:12px 24px;font-size:30px;font-weight:800;color:${C.inkSoft};text-decoration:line-through;text-decoration-color:${C.peachDeep};text-decoration-thickness:4px">${t}</div>`).join('')}
    <div style="font-size:34px;font-weight:900">→</div>
    <div style="background:${C.sun};border-radius:999px;padding:12px 24px;font-size:30px;font-weight:900">preparar a despedida ✨</div>
  </div>
  <div style="margin-top:auto">${productBox('Um guia estruturado para conduzir essa despedida com mais leveza.')}</div>
  <div class="row between" style="margin-top:36px">
    <div class="cta">Veja como funciona →</div>${logo({ size: 0.9 })}
  </div>
</div>`));

// Ângulo 2 — "A despedida" (Big Idea)
add('feed-02-a-despedida', 'feed', FEED, page(FEED, `
${scatter([[90, 150, star(34)], [300, 90, sparkle(26)], [980, 250, star(28)], [700, 60, sparkle(22)], [140, 520, sparkle(20)], [950, 600, star(22)], [60, 760, sparkle(24)]])}
<div class="abs" style="right:70px;top:90px">${moon(170)}</div>
<div class="pad">
  <div class="tag" style="color:${C.night}">🌙 Uma nova forma de dizer tchau</div>
  <div class="h" style="font-size:96px;margin-top:44px">Não é só tirar a chupeta.</div>
  <div class="h" style="font-size:96px;color:${C.sun}">É ensinar seu filho a se despedir dela.</div>
  <div class="abs" style="left:560px;top:690px;transform:rotate(-14deg)">${pacifier({ size: 170, wave: true })}</div>
  <div class="abs" style="left:120px;top:760px">${childWaving({ size: 280 })}</div>
  <div class="abs" style="left:420px;top:760px;width:180px;height:120px;border-top:5px dashed rgba(255,255,255,.5);border-radius:50%;transform:rotate(-18deg)"></div>
  <div style="margin-top:auto" class="row between">
    <div class="cta light">Conheça o Tchau Chupeta</div>${logo({ light: true, size: 0.9 })}
  </div>
</div>`, `body{background:linear-gradient(180deg, ${C.nightDeep} 0%, ${C.night} 60%, #5B4F9C 100%);color:#fff}`));

// Ângulo 3 — "Tentativa frustrada" (o ciclo)
const cycleNode = (x, y, emoji, text, bg) => `<div class="abs card" style="left:${x}px;top:${y}px;width:300px;padding:26px 20px;text-align:center;background:${bg}">
  <div style="font-size:64px">${emoji}</div><div class="h" style="font-size:44px;margin-top:6px">${text}</div></div>`;
add('feed-03-o-ciclo', 'feed', FEED, page(FEED, `
<div class="dots"></div>
<div class="pad">
  <div class="h" style="font-size:88px">Você tira. Ele chora.<br><span class="hl-peach">Você devolve.</span></div>
  <div class="h" style="font-size:52px;color:${C.lavenderDeep};margin-top:14px">Acontece na sua casa?</div>
</div>
<svg class="abs" style="left:0;top:0" width="1080" height="1350">
  <defs><marker id="a" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${C.lavenderDeep}"/></marker></defs>
  <path d="M430 520 Q540 470 650 520" stroke="${C.lavenderDeep}" stroke-width="7" fill="none" stroke-dasharray="4 14" stroke-linecap="round" marker-end="url(#a)"/>
  <path d="M830 700 Q820 790 700 830" stroke="${C.lavenderDeep}" stroke-width="7" fill="none" stroke-dasharray="4 14" stroke-linecap="round" marker-end="url(#a)"/>
  <path d="M380 830 Q260 790 250 700" stroke="${C.lavenderDeep}" stroke-width="7" fill="none" stroke-dasharray="4 14" stroke-linecap="round" marker-end="url(#a)"/>
</svg>
${cycleNode(90, 450, '✋', 'Você tira', '#fff')}
${cycleNode(690, 450, '😭', 'Ele chora', '#FFE7DF')}
${cycleNode(390, 780, '🔁', 'A chupeta volta', '#EEE8FF')}
<div class="abs" style="left:80px;right:80px;top:1060px">
  <div class="body" style="font-size:36px">Não é falta de vontade. <b>Talvez falte uma estratégia de transição.</b> O Tchau Chupeta organiza esse processo em etapas.</div>
  <div class="row between" style="margin-top:34px"><div class="cta peach">Quebre esse ciclo →</div>${logo({ size: 0.85 })}</div>
</div>`));

// Ângulo 4 — "Para mães cansadas" (formato nativo: conversa)
const bubble = (t, time, rot = 0) => `<div style="align-self:flex-start;transform:rotate(${rot}deg);background:#fff;border-radius:34px 34px 34px 8px;padding:20px 30px;box-shadow:0 8px 0 rgba(58,53,99,.06);display:flex;align-items:baseline;gap:18px">
  <span style="font-size:36px;font-weight:800">${t}</span><span class="small" style="font-size:22px">${time}</span></div>`;
add('feed-04-maes-cansadas', 'feed', FEED, page(FEED, `
<div class="pad" style="gap:0">
  <div class="h" style="font-size:76px">Se você está cansada de ouvir <span class="hl-peach">“me dá a chupeta”</span> o dia inteiro, veja isso.</div>
  <div style="display:flex;flex-direction:column;gap:18px;margin-top:40px;padding-left:10px">
    ${bubble('mãe, me dá a chupeta 🥺', '07:12', -1)}
    ${bubble('cadê minha chupeta?', '10:40', 1)}
    ${bubble('eu quero a chupetaaa 😭', '14:03', -0.5)}
    ${bubble('só um pouquinho, mãe…', '19:55', 1)}
    ${bubble('chupeta! 😴', '23:47', -1)}
  </div>
  <div class="body" style="margin-top:40px;font-size:36px">Você não precisa descobrir sozinha. Existe uma forma <b>mais estruturada e acolhedora</b> de conduzir essa despedida.</div>
  <div class="row between" style="margin-top:auto"><div class="cta">Conheça o método →</div>${logo({ size: 0.85 })}</div>
</div>
<div class="abs" style="right:70px;top:520px">${pacifier({ size: 220, mood: 'happy', wave: true })}</div>
`, `body{background:linear-gradient(180deg, #FFEDE4 0%, ${C.cream} 100%)}`));

// Ângulo 5 — "A criança participa"
const chip = (e, t) => `<div style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:16px 28px;font-weight:800;font-size:31px;box-shadow:0 6px 0 rgba(58,53,99,.06)"><span style="font-size:34px">${e}</span>${t}</div>`;
add('feed-05-a-crianca-participa', 'feed', FEED, page(FEED, `
<div class="abs" style="left:-120px;top:520px;width:1320px;height:900px;border-radius:50%;background:${C.mint};opacity:.35"></div>
${scatter([[110, 560, heart(44)], [940, 520, star(40)], [880, 640, sparkle(28)]])}
<div class="pad">
  <div class="tag" style="color:${C.mintDeep}">💚 O diferencial do método</div>
  <div class="h" style="font-size:90px;margin-top:40px">Seu filho pode <span class="hl">participar</span> da própria despedida da chupeta.</div>
  <div class="abs" style="left:430px;top:500px">${familyHug({ size: 560 })}</div>
  <div style="margin-top:110px;display:flex;flex-direction:column;align-items:flex-start;gap:16px;position:relative">
    ${chip('🧠', 'Entende a mudança')}${chip('🙌', 'Participa do processo')}${chip('👋', 'Se despede com carinho')}
  </div>
  <div class="row between" style="margin-top:auto"><div class="cta">Veja como funciona →</div>${logo({ size: 0.85 })}</div>
</div>`));

// Ângulo 6 — "Passo a passo"
const steps = [
  ['Preparar', 'a criança para a mudança'],
  ['Contar', 'a história da despedida'],
  ['Envolver', 'a criança em cada etapa'],
  ['Viver', 'o dia do tchau'],
  ['Acolher', 'os dias seguintes'],
];
const stepColors = [C.peach, C.sun, C.mint, C.lavender, C.peach];
add('feed-06-passo-a-passo', 'feed', FEED, page(FEED, `
<div class="dots"></div>
<div class="pad">
  <div class="h" style="font-size:84px">Você não precisa descobrir <span class="hl">sozinha</span> como tirar a chupeta.</div>
  <div class="card" style="margin-top:50px;padding:50px 44px;position:relative">
    <div style="position:absolute;left:83px;top:70px;bottom:70px;border-left:6px dotted ${C.lavender}"></div>
    ${steps.map(([a, b], i) => `<div class="row" style="gap:28px;${i ? 'margin-top:34px' : ''};position:relative">
      <div class="h" style="flex:none;width:80px;height:80px;border-radius:50%;background:${stepColors[i]};display:flex;align-items:center;justify-content:center;font-size:44px;padding-top:6px">${i + 1}</div>
      <div style="font-size:40px;font-weight:600"><b style="font-weight:900">${a}</b> ${b}</div></div>`).join('')}
  </div>
  <div class="small" style="margin-top:34px;font-size:30px;text-align:center">Cada criança tem seu próprio ritmo — o guia ajuda você a conduzir cada fase.</div>
  <div class="row between" style="margin-top:auto"><div class="cta">Comece a despedida →</div>${logo({ size: 0.85 })}</div>
</div>
<div class="abs" style="right:90px;top:215px">${pacifier({ size: 120, wave: true })}</div>
`));

// Criativo estático "clássico" (hook + problema + nova perspectiva + produto + CTA) com família
add('feed-07-estrutura-completa', 'feed', FEED, page(FEED, `
<div class="abs" style="right:-160px;top:180px;width:760px;height:760px;border-radius:50%;background:${C.lavender};opacity:.45"></div>
${scatter([[640, 230, star(38)], [980, 200, sparkle(28)], [600, 700, heart(38)]])}
<div class="pad">
  <div class="h" style="font-size:100px;width:620px">Seu filho não larga a chupeta?</div>
  <div class="body" style="width:520px;margin-top:26px">Você tenta tirar, ele chora… <b>e a chupeta volta.</b></div>
  <div class="abs" style="right:40px;top:250px">${familyHug({ size: 530 })}</div>
  <div class="card" style="margin-top:auto;padding:34px 40px;border-left:14px solid ${C.sun}">
    <div class="h" style="font-size:50px;line-height:1.1">Talvez não falte vontade. <span style="color:${C.lavenderDeep}">Talvez falte uma estratégia de transição.</span></div>
  </div>
  <div style="margin-top:26px">${productBox('Um guia para conduzir a criança em uma despedida mais leve da chupeta.')}</div>
  <div class="row between" style="margin-top:30px"><div class="cta peach">Conheça o método →</div><div class="small">Cada criança tem seu ritmo 💛</div></div>
</div>`));

// ---------------------------------------------------------------------------
// STORIES / REELS 9:16 (1080x1920) — respeita as áreas seguras (topo 250px, base 340px)
// ---------------------------------------------------------------------------
add('stories-01-a-despedida', 'stories', STORY, page(STORY, `
${scatter([[90, 200, star(40)], [320, 150, sparkle(30)], [980, 520, star(30)], [960, 1180, sparkle(24)], [880, 1320, star(26)], [70, 1100, sparkle(28)], [620, 210, sparkle(22)]])}
<div class="abs" style="right:80px;top:250px">${moon(200)}</div>
<div class="abs" style="left:80px;right:80px;top:300px">
  <div class="h" style="font-size:112px;width:760px">E se o segredo não fosse simplesmente <span style="color:${C.sun}">tirar</span>?</div>
  <div style="font-size:44px;font-weight:700;margin-top:34px;opacity:.9;line-height:1.3">Com o Tchau Chupeta, a retirada vira uma <b style="color:${C.sun}">despedida</b> — e a criança participa desse momento.</div>
</div>
<div class="abs" style="left:590px;top:1010px;transform:rotate(-14deg)">${pacifier({ size: 190, wave: true })}</div>
<div class="abs" style="left:430px;top:1110px;width:180px;height:120px;border-top:5px dashed rgba(255,255,255,.5);border-radius:50%;transform:rotate(-18deg)"></div>
<div class="abs" style="left:110px;top:1040px">${childWaving({ size: 320 })}</div>
<div class="abs row between" style="left:80px;right:80px;bottom:360px"><div class="cta light">Conheça o Tchau Chupeta ↑</div>${logo({ light: true, size: 0.8 })}</div>`, `body{background:linear-gradient(180deg, ${C.nightDeep} 0%, ${C.night} 55%, #5B4F9C 100%);color:#fff}`));

add('stories-02-o-ciclo', 'stories', STORY, page(STORY, `
<div class="dots"></div>
<div class="abs" style="left:80px;right:80px;top:260px">
  <div class="h" style="font-size:104px">Você tira.<br>Ele chora.<br><span class="hl-peach">Você devolve.</span></div>
  <div class="h" style="font-size:60px;color:${C.lavenderDeep};margin-top:20px">Acontece na sua casa?</div>
</div>
<div class="abs" style="left:80px;right:80px;top:760px;display:flex;flex-direction:column;gap:22px">
  ${['✋ Esconde a chupeta', '😭 Vem o choro (e a noite difícil)', '🔁 A chupeta volta… e recomeça'].map((t, i) => `<div class="card" style="padding:28px 36px;font-size:42px;font-weight:800;margin-left:${i * 50}px">${t}</div>`).join('')}
</div>
<div class="abs card" style="left:80px;right:80px;top:1180px;padding:32px 38px;border-left:14px solid ${C.sun}">
  <div class="h" style="font-size:52px;line-height:1.1">Não é falta de vontade. <span style="color:${C.lavenderDeep}">Talvez falte um processo de transição.</span></div>
</div>
<div class="abs row between" style="left:80px;right:80px;bottom:350px"><div class="cta peach">Veja como funciona ↑</div>${logo({ size: 0.8 })}</div>
`));

// ---------------------------------------------------------------------------
// CARROSSEL 4:5 (6 slides) — com uma trilha pontilhada que atravessa os slides
// ---------------------------------------------------------------------------
const trail = (i) => `<svg class="abs" style="left:0;bottom:190px" width="1080" height="200"><path d="M0 ${i % 2 ? 60 : 140} C 360 ${i % 2 ? 180 : 20}, 720 ${i % 2 ? 180 : 20}, 1080 ${i % 2 ? 140 : 60}" stroke="${C.lavender}" stroke-width="8" fill="none" stroke-dasharray="2 22" stroke-linecap="round"/></svg>`;
const carousel = [
  { bg: C.cream, body: `
    <div class="tag">Para pais e mães 💛</div>
    <div class="h" style="font-size:130px;margin-top:60px">Seu filho não larga a chupeta?</div>
    <div class="abs" style="right:90px;bottom:230px">${pacifier({ size: 300, mood: 'happy' })}</div>` },
  { bg: '#FFEDE4', body: `
    <div class="h" style="font-size:100px;margin-top:80px">Talvez simplesmente <span class="hl-peach">tirar</span> não seja a melhor forma de começar.</div>
    <div class="body" style="margin-top:40px;width:700px">Esconder, jogar fora ou proibir de repente pode trazer choro, birra e noites difíceis.</div>
    <div class="abs" style="right:90px;bottom:250px">${pacifier({ size: 220, mood: 'sad' })}</div>` },
  { bg: '#EEE8FF', body: `
    <div class="h" style="font-size:96px;margin-top:80px">A criança pode precisar <span class="hl">entender</span> que está acontecendo uma mudança.</div>
    <div class="body" style="margin-top:40px;width:620px">Para muitas crianças, a chupeta é conforto. Uma despedida preparada ajuda nessa adaptação.</div>
    <div class="abs" style="right:70px;bottom:240px">${childWaving({ size: 240 })}</div>` },
  { bg: C.cream, body: `
    <div class="h" style="font-size:104px;margin-top:80px">Por isso criamos o</div>
    <div class="row" style="gap:30px;margin-top:30px">${pacifier({ size: 200, wave: true })}
      <div class="h" style="font-size:130px;line-height:.9;text-transform:uppercase;color:${C.peachDeep}">Tchau<br><span style="color:${C.ink}">Chupeta</span></div></div>
    <div class="body" style="margin-top:40px">Não é só tirar a chupeta. <b>É ensinar a criança a se despedir dela.</b></div>
    <div class="abs" style="right:70px;bottom:170px">${familyHug({ size: 440 })}</div>` },
  { bg: '#E6F6EF', body: `
    <div class="h" style="font-size:88px;margin-top:70px">Um método estruturado para conduzir essa despedida.</div>
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:40px">
      ${['📖 Prepara a criança para a mudança', '🌙 Cria uma narrativa de despedida', '🙌 A criança participa ativamente', '🧭 Você sabe o que fazer em cada etapa'].map((t) => `<div class="card" style="padding:22px 30px;font-size:38px;font-weight:800">${t}</div>`).join('')}
    </div>` },
  { bg: 'night', body: `
    ${scatter([[120, 180, star(36)], [900, 150, sparkle(28)], [820, 420, star(26)], [80, 620, sparkle(24)]])}
    <div class="h" style="font-size:112px;margin-top:120px">Conheça o <span style="color:${C.sun}">Tchau Chupeta</span>.</div>
    <div style="font-size:42px;font-weight:700;margin-top:30px;opacity:.9;line-height:1.3">O passo a passo para transformar a retirada da chupeta em uma despedida mais leve. Cada criança no seu ritmo. 💛</div>
    <div class="abs" style="left:80px;bottom:240px"><div class="cta light">Toque em “Saiba mais” →</div></div>
    <div class="abs" style="right:90px;bottom:330px">${pacifier({ size: 190, wave: true })}</div>` },
];
carousel.forEach((s, i) => {
  const isNight = s.bg === 'night';
  add(`carrossel-0${i + 1}`, 'carrossel', FEED, page(FEED, `
  ${trail(i)}
  <div class="slide-n" style="${isNight ? 'background:rgba(255,255,255,.15);color:#fff' : ''}">${i + 1}/6</div>
  <div class="pad">${s.body}</div>
  <div class="abs" style="left:80px;bottom:70px">${logo({ size: 0.75, light: isNight })}</div>
  ${i < 5 ? `<div class="swipe">arraste →</div>` : ''}`,
  isNight ? `body{background:linear-gradient(180deg, ${C.nightDeep}, ${C.night} 60%, #5B4F9C);color:#fff}` : `body{background:${s.bg}}`));
});

// ---------------------------------------------------------------------------
const filter = process.argv[2];
const todo = creatives.filter((c) => !filter || c.id.includes(filter));
const browser = await chromium.launch();
for (const c of todo) {
  const htmlPath = join(ROOT, 'html', `${c.id}.html`);
  const pngPath = join(ROOT, 'png', c.dir, `${c.id}.png`);
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
