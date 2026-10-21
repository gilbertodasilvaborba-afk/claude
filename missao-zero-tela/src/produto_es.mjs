// Tela do produto em espanhol (9:16), só com texto em espanhol, para os criativos ES.
// Uso: node src/produto_es.mjs saida.png
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, missionCard, art } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', f)).toString('base64')}) format('woff2')`;
const logo = `data:image/png;base64,${readFileSync(join(ROOT, 'whatsapp', 'fotos', 'logo-icone.png')).toString('base64')}`;
const card = (o) => missionCard({ label: 'Misión', w: 400, ...o });
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:${C.sky};font-family:'Nunito',sans-serif;position:relative;overflow:hidden}
.t{position:absolute;left:0;right:0;text-align:center;font-family:'Baloo 2';font-weight:800;color:${C.ink}}
</style></head><body>
<img src="${logo}" style="position:absolute;left:445px;top:260px;width:200px">
<div class="t" style="top:490px;font-size:118px;line-height:.95">Misión<br><span style="color:#6A40B7">Cero Pantallas</span></div>
<div class="t" style="top:765px;font-family:Nunito;font-weight:900;font-size:44px;color:${C.inkSoft}">100 misiones con lo que tienes en casa</div>
${card({ num: 18, emoji: '🏕️', title: 'La Cabaña del Explorador', tags: ['3–5 años', 'Sábana'], artSvg: art.cabana(170), bg: C.leafSoft, rot: -9, x: 30, y: 1330, z: 1 })}
${card({ num: 45, emoji: '🚀', title: 'El Cohete de Cartón', tags: ['5–6 años', 'Rollo de papel'], artSvg: art.foguete(170), bg: C.crayonSoft, rot: 0, x: 340, y: 1260, z: 3 })}
${card({ num: 12, emoji: '🏘️', title: 'La Ciudad de Papel', tags: ['5–6 años', 'Caja'], artSvg: art.cidade(220), bg: C.sunSoft, rot: 9, x: 650, y: 1330, z: 2 })}
</body></html>`;
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: process.argv[2] });
await browser.close();
console.log('ok');
