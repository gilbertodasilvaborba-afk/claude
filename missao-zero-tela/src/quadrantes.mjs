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
const ES = process.argv[2] === 'es';
const T = ES
  ? { fotos: ['es1.jpg', 'es2.jpg', 'es3.jpg', 'es4.jpg'],
      tags: ['Disfraz de bolsa', 'Cajas de cartón', 'Inventos reciclados', 'Juegos en la cocina'],
      nome: 'Misión<br><span>Cero Pantallas</span>', sub: '<b>100 misiones</b> con lo<br>que tienes en casa', idade: '3 a 8 años',
      saida: 'mision-cero-pantallas-muestra-whatsapp' }
  : { fotos: ['q1.jpg', 'q2.jpg', 'q3.jpg', 'q4.jpg'],
      tags: ['Desenhar e criar', 'Montar e construir', 'Historinha juntos', 'Missões de aventura'],
      nome: 'Missão<br><span>Zero Tela</span>', sub: '<b>100 missões</b> sem tela<br>de 3 a 8 anos', idade: '',
      saida: 'missao-zero-tela-amostra-whatsapp' };
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
.idade{display:inline-block;margin-top:6px;background:${ROXO};color:#fff;padding:2px 12px 0;border-radius:999px}
.sub b{background:${AMARELO};padding:0 6px;border-radius:6px}
</style></head><body>
<div class="grid">
  ${q(T.fotos[0], T.tags[0], AMARELO, 'left:18px;bottom:20px')}
  ${q(T.fotos[1], T.tags[1], '#9EE6B8', 'right:18px;bottom:20px')}
  ${q(T.fotos[2], T.tags[2], '#BFD7FF', 'left:18px;bottom:20px')}
  ${q(T.fotos[3], T.tags[3], ROSA, 'right:18px;bottom:20px')}
</div>
<div class="centro">
  <img src="${b64('logo-icone.png', 'png')}">
  <div class="nome">${T.nome}</div>
  <div class="sub">${T.sub}${T.idade ? `<br><span class="idade">${T.idade}</span>` : ''}</div>
</div>
</body></html>`;


const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await pg.setContent(html, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: join(W, `${T.saida}.png`) });
await pg.screenshot({ path: join(W, `${T.saida}.jpg`), type: 'jpeg', quality: 92 });
await browser.close();
console.log('ok');
