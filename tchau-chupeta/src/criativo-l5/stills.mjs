// Renderiza as imagens paradas usadas no criativo L5 (cenas de mãe e filho em alta resolução
// e o texto da tela final com fundo transparente).
// Uso: node src/criativo-l5/stills.mjs → videos/criativos/L5/_trab/stills/*.png
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier } from '../illustrations.mjs';
import { SC } from '../cenas-reais.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'videos', 'criativos', 'L5', '_trab', 'stills');
mkdirSync(OUT, { recursive: true });
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

const browser = await chromium.launch();
for (const id of ['noite', 'gaveta', 'ritual', 'leitura', 'escova']) {
  const pg = await browser.newPage({ viewport: { width: 2000, height: 1400 } });
  await pg.setContent(`<!doctype html><html><head><style>@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}</style></head><body style="margin:0">${SC[id](2000)}</body></html>`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: join(OUT, `${id}.png`) });
  await pg.close();
  console.log('ok', id);
}

// Texto da tela final (no estilo da referência: nome grande + chamada)
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.setContent(`<!doctype html><html><head><style>
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
html,body{margin:0;background:transparent}
.w{position:absolute;left:0;right:0;top:640px;text-align:center;font-family:'Baloo 2';font-weight:800;color:#fff;
   text-shadow:0 0 0 #000,-5px -5px 0 #000,5px -5px 0 #000,-5px 5px 0 #000,5px 5px 0 #000,0 6px 0 #000,0 -6px 0 #000,6px 0 0 #000,-6px 0 0 #000}
</style></head><body><div class="w">
  <div style="display:flex;justify-content:center;margin-bottom:20px">${pacifier({ size: 200, wave: true })}</div>
  <div style="font-size:150px;line-height:.9">TCHAU<br><span style="color:${C.sun}">CHUPETA</span></div>
  <div style="font-size:70px;margin-top:30px;color:${C.sun}">VEJA COMO FUNCIONA</div>
</div></body></html>`);
await pg.screenshot({ path: join(OUT, 'cta.png'), omitBackground: true });
await browser.close();
console.log('ok cta');
