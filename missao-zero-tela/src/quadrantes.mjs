// Imagem quadrada para o WhatsApp do atendimento: 4 fotos de criança brincando + a marca no centro.
// Fotos: Mixkit (licença livre). Uso: node src/quadrantes.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = join(ROOT, 'whatsapp');
const b64 = (f, t = 'jpeg') => `data:image/${t};base64,${readFileSync(join(W, 'fotos', f)).toString('base64')}`;
const font = (f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', f)).toString('base64')}) format('woff2')`;
const ROXO = '#6A40B7', AMARELO = '#FFE15A', ROSA = '#FF7A8A', TINTA = '#1E2A4A';

const q = (img, txt, cor, pos) => `<div class="q" style="background-image:url(${b64(img)})">
  <div class="tag" style="background:${cor};${pos}">${txt}</div></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;background:#FFF8E8;font-family:'Baloo 2',sans-serif;position:relative;overflow:hidden}
.grid{position:absolute;inset:22px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:18px}
.q{border-radius:34px;background-size:cover;background-position:center;position:relative;box-shadow:0 6px 0 rgba(30,42,74,.12)}
.tag{position:absolute;color:${TINTA};font-weight:800;font-size:34px;line-height:1;padding:12px 22px 9px;border-radius:999px;
  border:4px solid ${TINTA};box-shadow:0 5px 0 ${TINTA};white-space:nowrap}
.centro{position:absolute;left:50%;top:50%;width:330px;height:330px;transform:translate(-50%,-50%);border-radius:50%;
  background:#fff;border:10px solid #FFF8E8;box-shadow:0 0 0 6px ${ROXO};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.centro img{width:132px;height:132px;margin-bottom:2px}
.nome{font-size:44px;font-weight:800;line-height:.95;color:${TINTA}}
.nome span{color:${ROXO}}
.sub{font-family:'Nunito',sans-serif;font-weight:900;font-size:21px;color:${TINTA};margin-top:8px;line-height:1.15}
.sub b{background:${AMARELO};padding:0 6px;border-radius:6px}
</style></head><body>
<div class="grid">
  ${q('q1.jpg', 'Desenhar e criar', AMARELO, 'left:18px;bottom:20px')}
  ${q('q2.jpg', 'Montar e construir', '#9EE6B8', 'right:18px;bottom:20px')}
  ${q('q3.jpg', 'Historinha juntos', '#BFD7FF', 'left:18px;bottom:20px')}
  ${q('q4.jpg', 'Missões de aventura', ROSA, 'right:18px;bottom:20px')}
</div>
<div class="centro">
  <img src="${b64('logo-icone.png', 'png')}">
  <div class="nome">Missão<br><span>Zero Tela</span></div>
  <div class="sub"><b>100 missões</b> sem tela<br>de 3 a 8 anos</div>
</div>
</body></html>`;


const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: join(W, 'missao-zero-tela-amostra-whatsapp.png') });
await pg.screenshot({ path: join(W, 'missao-zero-tela-amostra-whatsapp.jpg'), type: 'jpeg', quality: 92 });
await browser.close();
console.log('ok');
