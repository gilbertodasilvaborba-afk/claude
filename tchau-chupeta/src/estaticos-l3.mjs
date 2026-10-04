// Estáticos da leva L3 (ângulo dos dentes + Ritual da Despedida).
// Uso: node src/estaticos-l3.mjs [filtro] → png/l3/*.png
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, childWaving, tooth, mouth, hourglass, logo } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'png', 'l3');
const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:'Nunito',sans-serif;color:${C.ink};background:${C.cream};position:relative}
.h{font-family:'Baloo 2',sans-serif;font-weight:800;line-height:1.02;letter-spacing:-1px}
.a{position:absolute}
.pad{position:absolute;inset:0;padding:70px 80px;display:flex;flex-direction:column}
.tag{display:inline-flex;align-self:flex-start;align-items:center;gap:10px;border-radius:999px;padding:12px 26px;font-weight:900;font-size:28px;background:#fff;box-shadow:0 6px 0 rgba(58,53,99,.08)}
.alert{background:#FFE1D6;color:#C9553F}
.hl{background:linear-gradient(transparent 58%, ${C.sun} 58%, ${C.sun} 92%, transparent 92%);padding:0 6px}
.hl-red{background:linear-gradient(transparent 58%, #FFB4A2 58%, #FFB4A2 92%, transparent 92%);padding:0 6px}
.body{font-size:36px;line-height:1.35;font-weight:600;color:${C.inkSoft}}
.body b{color:${C.ink};font-weight:900}
.card{background:#fff;border-radius:36px;box-shadow:0 12px 0 rgba(58,53,99,.07)}
.risk{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:800;margin-top:14px}
.risk i{flex:none;width:46px;height:46px;border-radius:50%;background:#FFE1D6;color:#C9553F;font-style:normal;display:flex;align-items:center;justify-content:center;font-weight:900}
.mech{background:${C.night};color:#fff;border-radius:36px;padding:28px 34px}
.mech .k{font-weight:900;font-size:24px;letter-spacing:2px;text-transform:uppercase;color:${C.sun}}
.mech .t{font-size:32px;font-weight:700;line-height:1.3;margin-top:8px}
.mech .t b{color:${C.sun};font-weight:900}
.cta{display:inline-flex;align-items:center;gap:14px;background:${C.peachDeep};color:#fff;font-weight:900;font-size:36px;border-radius:999px;padding:24px 44px;box-shadow:0 10px 0 #C96A56}
.row{display:flex;align-items:center}
.between{justify-content:space-between}
.logo{display:flex;align-items:center;gap:calc(10px*var(--s))}
.logo-icon{display:flex}
.logo-text{font-family:'Baloo 2';font-weight:700;font-size:calc(30px*var(--s));line-height:.9;text-transform:uppercase;letter-spacing:1px}
.logo-text b{font-weight:800;font-size:calc(38px*var(--s))}
.dots{position:absolute;inset:0;background-image:radial-gradient(${C.lavender} 2.2px, transparent 2.6px);background-size:44px 44px;opacity:.35}
.small{font-size:20px;font-weight:700;color:${C.inkSoft}}
`;
const page = (size, inner, extra = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>:root{--w:${size.w}px;--h:${size.h}px}${CSS}${extra}</style></head><body>${inner}</body></html>`;

const mechBox = (txt = 'A criança não perde a chupeta: <b>ela se despede dela.</b> Historinhas, um dia escolhido junto e um ritual que ela vive.') =>
  `<div class="mech"><div class="k">✨ O Ritual da Despedida</div><div class="t">${txt}</div></div>`;
const footer = (cta = 'Conheça o método →') => `<div class="row between" style="margin-top:26px"><div class="cta">${cta}</div>${logo({ size: 0.85 })}</div>`;
const fine = `<div class="small" style="margin-top:14px">Informação geral. Em caso de dúvidas, converse com o odontopediatra do seu filho.</div>`;

const items = [];
const add = (id, size, html) => items.push({ id, size, html });

// L3I1 — A consequência (dentes)
add('L3I1-mordida', FEED, page(FEED, `<div class="dots"></div>
<div class="pad">
  <div class="tag alert">⚠️ Alerta para pais</div>
  <div class="h" style="font-size:86px;margin-top:30px">A chupeta usada por muito tempo pode <span class="hl-red">mexer nos dentes.</span></div>
  <div class="row" style="gap:30px;margin-top:26px;align-items:center">
    <div style="flex:none">${mouth(400)}</div>
    <div>
      <div class="risk"><i>!</i>Mordida aberta</div>
      <div class="risk"><i>!</i>Dentes da frente empurrados</div>
      <div class="risk"><i>!</i>Pode atrapalhar a fala</div>
    </div>
  </div>
  <div class="body" style="margin-top:24px;font-size:32px">Odontopediatras recomendam começar a retirada <b>por volta dos 3 anos</b>.</div>
  ${fine}
  <div style="margin-top:auto">${mechBox()}</div>
  ${footer()}
</div>`));

// L3I2 — O tempo
add('L3I2-cada-mes', FEED, page(FEED, `
<div class="pad">
  <div class="h" style="font-size:118px;line-height:.95">Cada mês<br>a mais <span class="hl-red">conta.</span></div>
  <div class="body" style="margin-top:30px;width:540px;font-size:38px">Quanto mais tempo com a chupeta, mais forte o hábito e <b>mais tempo os dentinhos ficam sob pressão.</b></div>
  <div class="a" style="right:100px;top:330px">${hourglass(400)}</div>
  <div class="card" style="margin-top:110px;width:560px;padding:28px 34px;border-left:14px solid ${C.mint}">
    <div class="body" style="color:${C.ink};font-size:33px"><b>A boa notícia:</b> quanto antes o hábito acaba, maiores as chances de a boca se ajustar.</div>
  </div>
  <div style="margin-top:auto">${mechBox()}</div>
  ${footer('Comece a despedida →')}
</div>`, `body{background:linear-gradient(180deg,#EEE8FF,${C.cream})}`));

// L3I3 — Mito x verdade
add('L3I3-mito', FEED, page(FEED, `<div class="dots"></div>
<div class="pad">
  <div class="h" style="font-size:96px">“Depois ele larga sozinho.”</div>
  <div class="row" style="gap:16px;margin-top:22px">
    <div class="tag alert" style="font-size:34px">✕ MITO</div>
    <div class="body" style="font-size:32px">Os dentes não esperam.</div>
  </div>
  <div class="card" style="margin-top:34px;padding:34px 38px">
    <div class="row" style="gap:28px">
      <div style="flex:none">${tooth(230, 'sad')}</div>
      <div class="body" style="font-size:36px"><b>Verdade:</b> o uso prolongado pode afetar a mordida. E arrancar de uma vez costuma virar <b>choro, briga e chupeta de volta.</b></div>
    </div>
  </div>
  <div class="h" style="font-size:54px;margin-top:40px;color:${C.lavenderDeep}">Quanto antes, melhor para os dentinhos.</div>
  <div style="margin-top:auto">${mechBox('Existe um caminho entre esperar e arrancar: <b>preparar a criança para se despedir.</b>')}</div>
  ${footer()}
</div>`));

// L3I4 — Arrancar x Ritual (comparativo do mecanismo)
const col = (title, color, items2, mark, bg) => `<div class="card" style="flex:1;padding:30px 28px;background:${bg}">
  <div class="h" style="font-size:46px;color:${color}">${title}</div>
  ${items2.map((t) => `<div class="risk" style="font-size:34px;align-items:flex-start;margin-top:30px"><i style="background:${color};color:#fff">${mark}</i><span>${t}</span></div>`).join('')}</div>`;
add('L3I4-arrancar-x-ritual', FEED, page(FEED, `
<div class="pad">
  <div class="h" style="font-size:82px">Arrancar a chupeta ou <span class="hl">fazer a despedida?</span></div>
  <div class="row" style="gap:24px;margin-top:40px;align-items:stretch">
    ${col('Arrancar de uma vez', '#C9553F', ['Pega a criança de surpresa', 'Choro e noite em claro', 'Muitas vezes a chupeta volta'], '✕', '#FFF1EC')}
    ${col('Ritual da Despedida', C.mintDeep, ['A criança é preparada com historinhas', 'Escolhe o dia e participa', 'Entende que a chupeta foi embora'], '✓', '#ECF8F2')}
  </div>
  <div class="body" style="margin-top:44px;font-size:40px">E quanto antes acontecer, <b>melhor para os dentinhos.</b></div>
  <div class="a" style="right:80px;top:1010px">${pacifier({ size: 120, wave: true })}</div>
  <div style="margin-top:auto"></div>
  ${footer('Veja como funciona →')}
</div>`));

// L3I5 — O que você recebe
const bookCover = `<div style="width:300px;height:420px;border-radius:14px 26px 26px 14px;background:linear-gradient(180deg,${C.nightDeep},${C.night} 70%,#5B4F9C);box-shadow:16px 16px 0 rgba(58,53,99,.15), inset 10px 0 0 rgba(255,255,255,.12);position:relative;overflow:hidden;color:#fff;text-align:center;padding-top:40px">
  <div style="font-weight:900;font-size:13px;letter-spacing:2px;color:${C.lavender}">HISTORINHAS PARA DAR</div>
  <div class="h" style="font-size:56px;line-height:.9;margin-top:8px">TCHAU<br><span style="color:${C.sun}">CHUPETA</span></div>
  <div class="a" style="left:20px;bottom:16px">${childWaving({ size: 110 })}</div>
  <div class="a" style="right:24px;bottom:70px">${pacifier({ size: 80, wave: true })}</div>
  <div class="a" style="right:30px;top:150px">${star(20)}</div></div>`;
add('L3I5-o-que-recebe', FEED, page(FEED, `<div class="dots"></div>
<div class="pad">
  <div class="h" style="font-size:80px">Tudo pronto para fazer a <span class="hl">despedida da chupeta</span> nesta semana.</div>
  <div class="row" style="gap:40px;margin-top:40px;align-items:flex-start">
    <div style="flex:none;transform:rotate(-4deg)">${bookCover}</div>
    <div style="display:flex;flex-direction:column;gap:16px;padding-top:10px">
      ${['📖 5 historinhas ilustradas', '🗓️ Calendário de 7 dias', '✉️ Bilhetes mágicos', '🏅 Certificado de despedida', '💛 Dicas para os pais'].map((t) => `<div class="card" style="padding:18px 24px;font-size:30px;font-weight:800">${t}</div>`).join('')}
    </div>
  </div>
  <div style="margin-top:auto">${mechBox('O <b>Ritual da Despedida</b>: a criança vive o tchau junto, em vez de ter a chupeta arrancada.')}</div>
  ${footer('Quero o Tchau Chupeta →')}
</div>`));

// L3S1 — Stories (9:16) do ângulo dos dentes
add('L3S1-mordida-stories', STORY, page(STORY, `<div class="dots"></div>
<div class="a" style="left:80px;right:80px;top:250px">
  <div class="tag alert">⚠️ Alerta para pais</div>
  <div class="h" style="font-size:104px;margin-top:30px">A chupeta usada por muito tempo pode <span class="hl-red">mexer nos dentes.</span></div>
</div>
<div class="a" style="left:200px;top:790px">${mouth(680)}</div>
<div class="a" style="left:80px;right:80px;top:1250px">${mechBox('Quanto antes, melhor. E dá para fazer sem guerra: <b>com o Ritual da Despedida.</b>')}</div>
<div class="a row between" style="left:80px;right:80px;bottom:350px"><div class="cta">Veja como funciona ↑</div>${logo({ size: 0.8 })}</div>`));

mkdirSync(OUT, { recursive: true });
const filter = process.argv[2];
const browser = await chromium.launch();
for (const it of items) {
  if (filter && !it.id.includes(filter)) continue;
  writeFileSync(join(ROOT, 'html', `${it.id}.html`), it.html);
  const pg = await browser.newPage({ viewport: { width: it.size.w, height: it.size.h } });
  await pg.setContent(it.html);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: join(OUT, `${it.id}.png`) });
  await pg.close();
  console.log('ok', it.id);
}
await browser.close();
