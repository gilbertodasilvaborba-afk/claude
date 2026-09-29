// Capa da página do Facebook (1640x624, o dobro de 820x312 para ficar nítida).
// Área segura: o celular corta as laterais e mostra só o centro (~1100px de largura);
// no computador a foto de perfil cobre o canto inferior esquerdo.
// Uso: node src/capa.mjs   → png/capa-facebook.png (+ png/capa-facebook-guia.png com as áreas marcadas)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, cloud, childWaving } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1640, H = 624;
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

const at = (x, y, svg, extra = '') => `<div class="a" style="left:${x}px;top:${y}px;${extra}">${svg}</div>`;

const html = (guia) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;font-family:'Nunito',sans-serif;color:#fff;
  background:radial-gradient(ellipse at 50% 120%, #6A5DB0 0%, transparent 60%),linear-gradient(180deg, ${C.nightDeep} 0%, ${C.night} 60%, #54489A 100%)}
.a{position:absolute}
.title{font-family:'Baloo 2';font-weight:800;text-transform:uppercase;line-height:.86;letter-spacing:1px;text-align:center}
</style></head><body>
  ${[[70, 60, star(30)], [230, 150, sparkle(22)], [380, 50, sparkle(18)], [520, 110, star(20)], [1100, 60, sparkle(20)], [1230, 140, star(24)],
     [1420, 330, sparkle(22)], [1560, 250, star(26)], [460, 470, sparkle(18)], [1180, 480, sparkle(20)], [300, 300, star(18)], [1350, 70, sparkle(16)]]
    .map(([x, y, s]) => at(x, y, s)).join('')}
  ${at(120, 70, moon(170))}
  ${at(150, 250, pacifier({ size: 130, wave: true }), 'transform:rotate(-12deg)')}
  <div class="a" style="left:40px;top:215px;width:150px;height:110px;border-top:4px dashed rgba(255,255,255,.35);border-radius:50%;transform:rotate(28deg)"></div>
  ${at(-40, 470, cloud(360, '#fff', .1))}
  ${at(1250, 520, cloud(420, '#fff', .1))}
  ${at(1330, 250, childWaving({ size: 250 }))}
  ${at(1285, 205, heart(40))}

  <div class="a" style="left:0;right:0;top:110px;display:flex;flex-direction:column;align-items:center">
    <div style="font-weight:800;font-size:26px;letter-spacing:3px;text-transform:uppercase;color:${C.lavender}">Guia para pais e mães</div>
    <div class="title" style="font-size:120px;margin-top:12px">Tchau <span style="color:${C.sun}">Chupeta</span></div>
    <div style="font-size:36px;font-weight:700;margin-top:22px;text-align:center;line-height:1.3">
      Não é só tirar a chupeta.<br><b style="font-weight:900;color:${C.sun}">É ensinar a criança a se despedir dela.</b> 💛
    </div>
  </div>
  ${guia ? `
  <div class="a" style="left:${(W - 1110) / 2}px;top:0;width:1110px;height:${H}px;border:4px dashed #3f3;"></div>
  <div class="a" style="left:40px;top:${H - 180}px;width:340px;height:180px;background:rgba(255,0,0,.35);color:#fff;font-size:22px;font-weight:800;padding:12px">área da foto de perfil (desktop)</div>
  <div class="a" style="left:${(W - 1110) / 2 + 10}px;top:8px;color:#3f3;font-weight:800;font-size:22px">área visível no celular</div>` : ''}
</body></html>`;

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: W, height: H } });
for (const [guia, nome] of [[false, 'capa-facebook'], [true, 'capa-facebook-guia']]) {
  const h = html(guia);
  if (!guia) writeFileSync(join(ROOT, 'html', `${nome}.html`), h);
  await pg.setContent(h);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: join(ROOT, 'png', `${nome}.png`) });
  console.log('ok', nome);
}
await browser.close();
