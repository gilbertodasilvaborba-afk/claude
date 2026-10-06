// O criativo do "modelo foto" em 1,91:1 (1200x628), para anúncio de link no feed.
// Texto à esquerda, foto à direita, mockup do produto no canto de baixo.
// Uso: node src/modelo-horizontal.mjs [caminho/da/foto.jpg] [id-da-peça]
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, missionCard, art, heroKid } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SIZE = { w: 1200, h: 628 };
const foto = process.argv[2] || join(ROOT, 'fotos', 'modelo-02.jpg');
const ID = process.argv[3] || 'modelo-02-menino-celular-1.91x1';
const fotoCss = existsSync(foto)
  ? `background:url(data:image/${extname(foto).slice(1).replace('jpg', 'jpeg')};base64,${readFileSync(foto).toString('base64')}) center 30%/cover`
  : `background:repeating-linear-gradient(45deg,#E9EEF6 0 30px,#DDE4EF 30px 60px)`;
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

const sv = (d) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icons = {
  doc: sv('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>'),
  star: sv('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  home: sv('<path d="M3 11l9-7 9 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>'),
  gift: sv('<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9C10 5 7 5 7 7s5 2 5 2 5 0 5-2-3-2-5 2"/>'),
};
const item = (bg, svg, t, d) => `<div class="row" style="gap:12px">
  <div style="flex:none;width:52px;height:52px;border-radius:50%;background:${bg};display:grid;place-items:center">${svg}</div>
  <div><div class="h" style="font-size:22px;line-height:1.05">${t}</div><div style="font-size:16px;font-weight:600;line-height:1.2;color:${C.inkSoft}">${d}</div></div></div>`;

// mockup pequeno: capa, celular com a missão e passaporte
const capa = `<div class="abs" style="left:800px;top:418px;width:150px;height:186px;transform:rotate(-4deg);border-radius:6px 12px 12px 6px;background:linear-gradient(160deg,#FFF6D6,${C.sun});border:3px solid ${C.ink};box-shadow:-9px 0 0 -3px #E8B92A, 7px 9px 0 rgba(30,42,74,.35);overflow:hidden;z-index:3">
  <div class="h" style="position:absolute;left:14px;right:8px;top:10px;font-size:27px;line-height:.92;text-align:center">Missão<br><span style="color:${C.crayon}">Zero Tela</span></div>
  <div style="position:absolute;left:42px;top:66px">${heroKid({ size: 66 })}</div>
  <div style="position:absolute;left:12px;right:8px;bottom:7px;text-align:center;font-weight:900;font-size:10px;line-height:1.15">100 historinhas-missão<br>para trocar a tela</div>
</div>`;
const celular = `<div class="abs" style="left:946px;top:404px;width:110px;height:208px;border-radius:20px;background:${C.ink};border:3px solid ${C.ink};padding:8px;transform:rotate(3deg);box-shadow:7px 9px 0 rgba(30,42,74,.35);z-index:4">
  <div style="width:100%;height:100%;border-radius:13px;background:${C.sky};overflow:hidden;display:flex;flex-direction:column;align-items:center;padding-top:12px">
    ${missionCard({ num: 42, emoji: '🌧️', title: 'Cabana do Explorador', tags: ['3–5 anos'], artSvg: art.cabana(30), bg: C.leafSoft, w: 90 })}
    <div style="margin-top:8px;background:${C.leaf};color:#fff;font-weight:900;font-size:8px;white-space:nowrap;border-radius:999px;padding:4px 8px">Aceitar missão ▶</div>
  </div></div>`;
const carimbo = (x, y, c) => `<div style="position:absolute;left:${x}px;top:${y}px;width:28px;height:28px;border-radius:50%;border:3px solid ${c};color:${c};display:grid;place-items:center;font-weight:900;font-size:14px;transform:rotate(-12deg)">✓</div>`;
const passaporte = `<div class="abs" style="left:1046px;top:428px;width:128px;height:170px;background:#fff;border:3px solid ${C.ink};border-radius:8px;transform:rotate(6deg);box-shadow:6px 8px 0 rgba(30,42,74,.3);padding:10px;z-index:2">
  <div class="hand" style="font-size:19px;line-height:1">Passaporte do Explorador</div>
  <div style="height:2px;background:${C.line};margin:6px 0"></div>
  ${[0, 1].map((r) => [0, 1, 2].map((c) => carimbo(8 + c * 37, 62 + r * 38, [C.leaf, C.crayon, C.blue][(r + c) % 3])).join('')).join('')}
</div>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
@font-face{font-family:'Caveat';font-weight:700;src:${font('Caveat-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${SIZE.w}px;height:${SIZE.h}px;overflow:hidden}
body{font-family:'Nunito',sans-serif;color:${C.ink};background:#FBF7F0;position:relative;-webkit-font-smoothing:antialiased}
.h{font-family:'Baloo 2',sans-serif;font-weight:800;letter-spacing:-.5px}
.hand{font-family:'Caveat',cursive;font-weight:700}
.row{display:flex;align-items:center}
.abs{position:absolute}
.hl{background:linear-gradient(transparent 55%, ${C.sun} 55%, ${C.sun} 90%, transparent 90%);padding:0 6px}
</style></head><body>
<!-- foto à direita -->
<div class="abs" style="right:0;top:0;width:540px;height:628px;${fotoCss}"></div>
<div class="abs" style="right:0;top:0;width:540px;height:628px;background:linear-gradient(90deg,#FBF7F0 0%,rgba(251,247,240,.9) 16%,rgba(251,247,240,0) 42%)"></div>

<!-- título -->
<div class="abs" style="left:40px;top:26px;width:560px;transform:rotate(-2deg)">
  <div class="h" style="font-size:36px;line-height:1">Seu filho(a) só</div>
  <div class="h" style="font-size:62px;line-height:.98"><span class="hl">quer saber</span></div>
  <div class="h" style="font-size:86px;line-height:.92;color:${C.crayon}">de tela?</div>
</div>
<div class="abs" style="left:372px;top:132px;width:88px;height:88px;border-radius:50%;border:8px solid ${C.crayon};background:rgba(255,255,255,.75);display:grid;place-items:center;transform:rotate(12deg)">
  <svg width="42" height="60" viewBox="0 0 70 100"><rect x="6" y="4" width="58" height="92" rx="12" fill="${C.ink}"/><rect x="13" y="14" width="44" height="66" rx="4" fill="${C.blue}"/><path d="M29 36 L45 47 L29 58Z" fill="#fff"/></svg>
  <div class="abs" style="width:88px;height:8px;background:${C.crayon};transform:rotate(-45deg);border-radius:4px"></div>
</div>

<!-- apoio curto -->
<div class="abs h" style="left:40px;top:242px;font-size:24px;transform:rotate(-1deg)">Na hora de desligar, a cabeça dá branco? <span class="hl">Agora tem resposta pronta!</span></div>

<!-- lista 2x2 -->
<div class="abs" style="left:40px;top:296px;width:600px;display:grid;grid-template-columns:1fr 1fr;gap:14px 18px">
  ${item(C.sun, icons.doc, '100 missões prontas', 'para imprimir ou no celular')}
  ${item(C.blue, icons.star, 'Seu filho vira o herói', 'de cada historinha')}
  ${item(C.leaf, icons.home, 'Só material de casa', 'papel, giz, caixa e lençol')}
  ${item(C.crayon, icons.gift, 'Com 4 bônus', 'para virar hábito em casa')}
</div>

<!-- faixa de pincel + CTA -->
<div class="abs" style="left:24px;top:446px;width:470px;height:96px;background:${C.ink};transform:rotate(-2deg);clip-path:polygon(0 18%,6% 6%,40% 12%,70% 0,100% 10%,97% 52%,100% 90%,62% 100%,30% 92%,3% 100%,1% 60%)"></div>
<div class="abs h" style="left:56px;top:458px;transform:rotate(-2deg);color:#fff;font-size:21px;line-height:1">Chegou o</div>
<div class="abs h" style="left:50px;top:478px;transform:rotate(-2deg);color:${C.sun};font-size:44px;line-height:1">Missão Zero Tela!</div>
<div class="abs row" style="left:40px;top:560px;gap:16px">
  <div class="row" style="gap:8px;background:${C.sun};border:3px solid ${C.ink};border-radius:999px;padding:8px 20px;font-family:'Baloo 2';font-weight:800;font-size:20px;box-shadow:0 5px 0 #C99E14">QUERO SABER MAIS ➜</div>
  <div style="font-weight:800;font-size:17px">De 3 a 8 anos · PDF · <span style="color:${C.crayon}">garantia de 7 dias</span></div>
</div>

<!-- bilhete -->
<div class="abs hand" style="right:26px;top:22px;width:180px;padding:14px 12px;background:${C.sun};transform:rotate(-6deg);font-size:28px;line-height:1;text-align:center;box-shadow:5px 6px 0 rgba(30,42,74,.15);clip-path:polygon(2% 4%,98% 0,100% 96%,0 100%)">Menos tela, mais brincadeira de verdade! ♡</div>

<div class="abs" style="left:0;top:0;width:1200px;height:628px;transform:scale(.8);transform-origin:1192px 618px">${passaporte}${capa}${celular}</div>
</body></html>`;

mkdirSync(join(ROOT, 'html'), { recursive: true });
mkdirSync(join(ROOT, 'png', 'modelo'), { recursive: true });
writeFileSync(join(ROOT, 'html', `${ID}.html`), html);
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: SIZE.w, height: SIZE.h } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: join(ROOT, 'png', 'modelo', `${ID}.png`) });
await browser.close();
console.log('ok', ID);
