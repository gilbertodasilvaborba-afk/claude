// Criativo no "modelo foto": foto real da criança à direita, título grande com destaque,
// lista com ícones, faixa de pincel com o nome, mockup do produto e barra de entregáveis.
// Uso: node src/modelo.mjs [caminho/da/foto.jpg] [id-da-peça] [degradê: longo|curto] [formato: 2x3|4x5|9x16]
// Sem foto, sai um espaço cinza marcado "FOTO AQUI" para conferir o layout.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, missionCard, art, heroKid, star } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Formatos: 2x3 igual ao modelo; 4x5 para o feed (sem o bloco de apoio e sem a barra de baixo);
// 9x16 para stories (tudo desce para fora da área do perfil no topo; sem a barra de baixo, onde o Instagram põe o botão)
const FORMATO = process.argv[5] || '2x3';
const F = {
  '2x3': { h: 1620, top: 0, dBase: 0, apoio: true, barra: true },
  '4x5': { h: 1350, top: 0, dBase: -200, apoio: false, barra: false },
  '9x16': { h: 1920, top: 200, dBase: 0, apoio: true, barra: false },
  '9x16-completo': { h: 1920, top: 170, dBase: 0, apoio: true, barra: true }, // igual ao 2:3, com a barra de baixo
}[FORMATO];
const SIZE = { w: 1080, h: F.h };
const FOTO_H = 1180 + F.dBase; // a foto termina atrás da faixa de pincel
const ID = process.argv[3] || 'modelo-01-so-quer-saber-de-tela';
// degradê curto: a foto aparece mais, para quando o rosto fica perto do texto
const FADE = process.argv[4] === 'curto' ? '#FBF7F0 0%,rgba(251,247,240,.92) 30%,rgba(251,247,240,0) 50%' : '#FBF7F0 0%,rgba(251,247,240,.85) 22%,rgba(251,247,240,0) 55%';

const foto = process.argv[2] || join(ROOT, 'fotos', 'modelo-01.jpg');
const fotoCss = existsSync(foto)
  ? `background:url(data:image/${extname(foto).slice(1).replace('jpg', 'jpeg')};base64,${readFileSync(foto).toString('base64')}) center/cover`
  : `background:repeating-linear-gradient(45deg,#E9EEF6 0 30px,#DDE4EF 30px 60px)`;

const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

// Ícone redondo da lista
const ico = (bg, svg) => `<div style="flex:none;width:84px;height:84px;border-radius:50%;background:${bg};display:grid;place-items:center">${svg}</div>`;
const sv = (d) => `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const icons = {
  doc: sv('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>'),
  star: sv('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
  home: sv('<path d="M3 11l9-7 9 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>'),
  gift: sv('<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18M12 9v11M12 9C10 5 7 5 7 7s5 2 5 2 5 0 5-2-3-2-5 2"/>'),
};
const item = (bg, svg, t, d) => `<div class="row" style="gap:24px">${ico(bg, svg)}
  <div><div class="h" style="font-size:34px;line-height:1.05">${t}</div><div style="font-size:28px;font-weight:600;line-height:1.2;color:${C.inkSoft}">${d}</div></div></div>`;

// Mockup: capa do PDF em pé, celular com uma missão e o passaporte impresso
const capa = `<div style="position:absolute;left:420px;top:1185px;width:250px;height:310px;transform:rotate(-4deg);border-radius:8px 16px 16px 8px;background:linear-gradient(160deg,#FFF6D6,${C.sun});border:4px solid ${C.ink};box-shadow:-14px 0 0 -4px #E8B92A, 10px 14px 0 rgba(30,42,74,.35);overflow:hidden;z-index:3">
  <div style="position:absolute;left:0;top:0;bottom:0;width:18px;background:rgba(30,42,74,.12)"></div>
  <div class="h" style="position:absolute;left:30px;right:16px;top:18px;font-size:44px;line-height:.92;text-align:center">Missão<br><span style="color:${C.crayon}">Zero Tela</span></div>
  <div style="position:absolute;left:70px;top:106px">${heroKid({ size: 112 })}</div>
  <div style="position:absolute;left:30px;right:16px;bottom:12px;text-align:center;font-weight:900;font-size:15px;line-height:1.15">100 historinhas-missão<br>para trocar a tela</div>
</div>`;
const celular = `<div style="position:absolute;left:670px;top:1165px;width:180px;height:340px;border-radius:30px;background:${C.ink};border:4px solid ${C.ink};padding:12px;transform:rotate(3deg);box-shadow:10px 14px 0 rgba(30,42,74,.35);z-index:4">
  <div style="width:100%;height:100%;border-radius:20px;background:${C.sky};overflow:hidden;display:flex;flex-direction:column;align-items:center;padding-top:22px">
    ${missionCard({ num: 42, emoji: '🌧️', title: 'Cabana do Explorador', tags: ['3–5 anos'], artSvg: art.cabana(50), bg: C.leafSoft, w: 150 })}
    <div style="margin-top:14px;background:${C.leaf};color:#fff;font-weight:900;font-size:13px;white-space:nowrap;border-radius:999px;padding:6px 12px">Aceitar missão ▶</div>
  </div></div>`;
const carimbo = (x, y, c) => `<div style="position:absolute;left:${x}px;top:${y}px;width:46px;height:46px;border-radius:50%;border:4px solid ${c};color:${c};display:grid;place-items:center;font-weight:900;font-size:22px;transform:rotate(-12deg)">✓</div>`;
const passaporte = `<div style="position:absolute;left:830px;top:1195px;width:210px;height:290px;background:#fff;border:4px solid ${C.ink};border-radius:10px;transform:rotate(6deg);box-shadow:8px 12px 0 rgba(30,42,74,.3);padding:18px 16px;z-index:2">
  <div class="hand" style="font-size:30px;line-height:1">Passaporte do Explorador</div>
  <div style="height:3px;background:${C.line};margin:10px 0 12px"></div>
  ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => (r * 3 + c < 7 ? carimbo(14 + c * 60, 96 + r * 60, [C.leaf, C.crayon, C.blue][(r + c) % 3]) : '')).join('')).join('')}
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
.hl{background:linear-gradient(transparent 55%, ${C.sun} 55%, ${C.sun} 90%, transparent 90%);padding:0 8px}
</style></head><body>
<div class="abs" style="left:0;top:${F.top}px;width:1080px;height:1620px">
<!-- foto à direita, com degradê para o fundo claro do texto -->
<div class="abs" style="right:0;top:${-F.top}px;width:680px;height:${FOTO_H + F.top}px;${fotoCss}"></div>
${existsSync(foto) ? '' : `<div class="abs h" style="right:120px;top:520px;font-size:54px;color:#9AA6BD;transform:rotate(-8deg)">FOTO AQUI</div>`}
<div class="abs" style="right:0;top:${-F.top}px;width:680px;height:${FOTO_H + F.top}px;background:linear-gradient(90deg,${FADE})"></div>
<div class="abs" style="left:0;right:0;top:${FOTO_H - 220}px;height:220px;background:linear-gradient(180deg,rgba(251,247,240,0),#FBF7F0)"></div>

<!-- título -->
<div class="abs" style="left:64px;top:56px;width:640px;transform:rotate(-3deg)">
  <div class="h" style="font-size:66px;line-height:1">Seu filho(a) só</div>
  <div class="h" style="font-size:104px;line-height:.98"><span class="hl">quer saber</span></div>
  <div class="h" style="font-size:140px;line-height:.92;color:${C.crayon}">de tela?</div>
</div>
<div class="abs" style="left:540px;top:250px;width:140px;height:140px;border-radius:50%;border:12px solid ${C.crayon};background:rgba(255,255,255,.75);display:grid;place-items:center;transform:rotate(12deg)">
  <svg width="70" height="100" viewBox="0 0 70 100"><rect x="6" y="4" width="58" height="92" rx="12" fill="${C.ink}"/><rect x="13" y="14" width="44" height="66" rx="4" fill="${C.blue}"/><path d="M29 36 L45 47 L29 58Z" fill="#fff"/></svg>
  <div class="abs" style="width:140px;height:12px;background:${C.crayon};transform:rotate(-45deg);border-radius:6px"></div>
</div>

<!-- apoio -->
${F.apoio ? '' : '<!--'}<div class="abs" style="left:64px;top:430px;width:600px;transform:rotate(-2deg)">
  <div class="h" style="font-size:42px;line-height:1.05">Você não está sozinha!</div>
  <div style="font-size:31px;font-weight:700;line-height:1.25;margin-top:6px">Na hora de desligar, a cabeça dá branco: <i>o que eu ofereço no lugar?</i></div>
  <div class="h" style="font-size:38px;margin-top:10px;white-space:nowrap"><span class="hl">Agora tem resposta pronta!</span></div>
</div>${F.apoio ? '' : '-->'}

<!-- lista -->
<div class="abs" style="left:64px;top:${F.apoio ? 640 : 430}px;width:620px;display:flex;flex-direction:column;gap:18px">
  ${item(C.sun, icons.doc, '100 missões prontas', 'para imprimir ou usar no celular.')}
  ${item(C.blue, icons.star, 'Seu filho vira o herói', 'de cada historinha.')}
  ${item(C.leaf, icons.home, 'Só material de casa', 'papel, giz, caixa e lençol.')}
  ${item(C.crayon, icons.gift, 'Com 4 bônus', 'para virar hábito em casa.')}
</div>

<!-- bilhete -->
<div class="abs hand" style="right:${process.argv[4] === 'curto' ? '40px;top:40px;width:270px' : '46px;top:720px;width:300px'};padding:26px 24px;background:${C.sun};transform:rotate(-6deg);font-size:50px;line-height:1;text-align:center;box-shadow:6px 8px 0 rgba(30,42,74,.15);clip-path:polygon(2% 4%,98% 0,100% 96%,0 100%)">Menos tela, mais brincadeira de verdade! ♡</div>

<!-- da faixa para baixo: um bloco que sobe no 4x5 -->
<div class="abs" style="left:0;top:${F.dBase}px;width:1080px;height:1620px">
<!-- faixa de pincel -->
<div class="abs" style="left:30px;top:1030px;width:680px;height:150px;background:${C.ink};transform:rotate(-3deg);clip-path:polygon(0 18%,6% 6%,40% 12%,70% 0,100% 10%,97% 52%,100% 90%,62% 100%,30% 92%,3% 100%,1% 60%)"></div>
<div class="abs h" style="left:84px;top:1056px;transform:rotate(-3deg);color:#fff;font-size:34px;line-height:1">Chegou o</div>
<div class="abs h" style="left:74px;top:1086px;transform:rotate(-3deg);color:${C.sun};font-size:70px;line-height:1">Missão Zero Tela!</div>

<!-- base azul com mockup -->
<div class="abs" style="left:0;right:0;top:1350px;height:${270 + 400}px;background:${C.ink};border-radius:60% 40% 0 0 / 40px 70px 0 0"></div>
<div class="abs" style="left:64px;top:1200px;width:330px;font-size:26px;font-weight:700;line-height:1.25;z-index:5">Historinhas-missão para trocar o “só mais um vídeo” por brincadeira de verdade. <b style="color:${C.crayon}">De 3 a 8 anos.</b></div>
${passaporte}${capa}${celular}


<!-- CTA -->
<div class="abs row" style="left:50px;top:1395px;gap:12px;background:${C.sun};border:4px solid ${C.ink};border-radius:999px;padding:14px 28px;font-family:'Baloo 2';font-weight:800;font-size:28px;box-shadow:0 8px 0 #C99E14;z-index:6">QUERO SABER MAIS ➜</div>

<!-- barra de entregáveis -->
${F.barra ? '' : '<!--'}<div class="abs row" style="left:40px;right:40px;bottom:22px;justify-content:space-between;color:#fff;z-index:6">
  ${[['📖', 'Missões em PDF', 'imprimir ou celular'], ['🫙', 'Pote de Missões', 'para sortear'], ['🏅', 'Passaporte', '+ certificado']].map(([e, t, d]) => `<div class="row" style="gap:12px"><div style="width:56px;height:56px;border-radius:50%;border:3px solid #fff;display:grid;place-items:center;font-size:28px">${e}</div><div><div style="font-weight:900;font-size:22px">${t}</div><div style="font-size:19px;opacity:.85">${d}</div></div></div>`).join('')}
</div>${F.barra ? '' : '-->'}
</div></div>
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
console.log('ok', ID, existsSync(foto) ? `(foto: ${foto})` : '(sem foto: espaço reservado)');
