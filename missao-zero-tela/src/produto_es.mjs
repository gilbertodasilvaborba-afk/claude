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
const FE = process.argv[3] === 'fe';
const S = `stroke="${C.ink}" stroke-linejoin="round" stroke-linecap="round"`;
const arte = {
  arca: (w = 190) => `<svg width="${w}" height="${w * 0.75}" viewBox="0 0 160 120"><path d="M20 40 Q80 -10 140 40" fill="none" stroke="${C.crayon}" stroke-width="7"/><path d="M28 44 Q80 4 132 44" fill="none" stroke="${C.sun}" stroke-width="7"/><path d="M36 48 Q80 16 124 48" fill="none" stroke="${C.blue}" stroke-width="7"/><path d="M14 74 H146 L130 102 H30 Z" fill="#C98A4B" ${S} stroke-width="4"/><rect x="52" y="54" width="56" height="20" fill="#E7B77B" ${S} stroke-width="4"/><path d="M48 54 L80 40 L112 54" fill="#C98A4B" ${S} stroke-width="4"/><circle cx="66" cy="64" r="3" fill="${C.ink}"/><circle cx="94" cy="64" r="3" fill="${C.ink}"/></svg>`,
  ballena: (w = 190) => `<svg width="${w}" height="${w * 0.75}" viewBox="0 0 160 120"><path d="M14 70 Q20 30 80 30 Q140 30 136 72 Q132 98 80 98 Q30 98 14 70Z" fill="${C.blue}" ${S} stroke-width="4"/><path d="M136 66 L152 48 L150 84 Z" fill="${C.blue}" ${S} stroke-width="4"/><circle cx="46" cy="58" r="5" fill="#fff" ${S} stroke-width="2"/><path d="M28 78 Q60 90 92 80" fill="none" stroke="#fff" stroke-width="4"/><path d="M70 28 Q66 12 58 8 M70 28 Q74 12 84 8" fill="none" stroke="${C.blue}" stroke-width="4"/></svg>`,
  honda: (w = 190) => `<svg width="${w}" height="${w * 0.75}" viewBox="0 0 160 120"><path d="M80 112 V64 M80 64 L52 22 M80 64 L108 22" fill="none" stroke="#8B5A2B" stroke-width="10" ${S}/><path d="M52 22 Q80 50 108 22" fill="none" stroke="${C.crayon}" stroke-width="5"/><circle cx="80" cy="38" r="9" fill="#9AA3B5" ${S} stroke-width="3"/><path d="M128 20 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="${C.sun}" ${S} stroke-width="2"/></svg>`,
};
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:${C.sky};font-family:'Nunito',sans-serif;position:relative;overflow:hidden}
.t{position:absolute;left:0;right:0;text-align:center;font-family:'Baloo 2';font-weight:800;color:${C.ink}}
</style></head><body>
<img src="${logo}" style="position:absolute;left:445px;top:260px;width:200px">
<div class="t" style="top:490px;font-size:118px;line-height:.95">Misión<br><span style="color:#6A40B7">Cero Pantallas</span></div>
<div class="t" style="top:765px;font-family:Nunito;font-weight:900;font-size:44px;color:${C.inkSoft}">${FE ? 'Juegos, fe y valores con historias de la Biblia' : '100 misiones con lo que tienes en casa'}</div>
${FE ? `
${card({ num: 3, emoji: '🐋', title: 'Jonás y la Ballena', tags: ['3–5 años', 'Sábana'], artSvg: arte.ballena(), bg: C.sky, rot: -9, x: 30, y: 1330, z: 1 })}
${card({ num: 1, emoji: '🌈', title: 'El Arca de Noé', tags: ['3–8 años', 'Caja de cartón'], artSvg: arte.arca(), bg: C.sunSoft, rot: 0, x: 340, y: 1260, z: 3 })}
${card({ num: 2, emoji: '⭐', title: 'La Valentía de David', tags: ['5–8 años', 'Papel'], artSvg: arte.honda(), bg: C.leafSoft, rot: 9, x: 650, y: 1330, z: 2 })}` : `
${card({ num: 18, emoji: '🏕️', title: 'La Cabaña del Explorador', tags: ['3–5 años', 'Sábana'], artSvg: art.cabana(170), bg: C.leafSoft, rot: -9, x: 30, y: 1330, z: 1 })}
${card({ num: 45, emoji: '🚀', title: 'El Cohete de Cartón', tags: ['5–6 años', 'Rollo de papel'], artSvg: art.foguete(170), bg: C.crayonSoft, rot: 0, x: 340, y: 1260, z: 3 })}
${card({ num: 12, emoji: '🏘️', title: 'La Ciudad de Papel', tags: ['5–6 años', 'Caja'], artSvg: art.cidade(220), bg: C.sunSoft, rot: 9, x: 650, y: 1330, z: 2 })}`}
</body></html>`;
const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: process.argv[2] });
await browser.close();
console.log('ok');
