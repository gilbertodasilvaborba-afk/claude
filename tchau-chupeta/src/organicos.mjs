// Criativos com cara de conteúdo orgânico (formatos nativos): nota do celular,
// caixinha de perguntas, busca, grupo de mães (dramatização), meme e post de texto.
// Uso: node src/organicos.mjs [filtro] → png/organicos/*.png
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier } from './illustrations.mjs';
import { SC } from './cenas-reais.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'png', 'organicos');
const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

const CSS = `
@font-face{font-family:'Inter';font-weight:100 900;src:${font('Inter-latin.woff2')}}
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:'Inter',sans-serif;color:#1c1c1e;position:relative;-webkit-font-smoothing:antialiased}
.a{position:absolute}
.status{height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;font-weight:600;font-size:30px}
.status .r{display:flex;gap:14px;align-items:center}
.bat{width:52px;height:26px;border:3px solid currentColor;border-radius:8px;position:relative;opacity:.9}
.bat:after{content:'';position:absolute;inset:3px;right:12px;background:currentColor;border-radius:3px}
.tiny{font-size:20px;color:#8e8e93;font-weight:500}
`;
const page = (size, inner, extra = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>:root{--w:${size.w}px;--h:${size.h}px}${CSS}${extra}</style></head><body>${inner}</body></html>`;
const status = (time = '23:41', color = '#1c1c1e') => `<div class="status" style="color:${color}"><span>${time}</span><span class="r">
  <svg width="36" height="24" viewBox="0 0 36 24"><rect x="0" y="16" width="6" height="8" rx="2" fill="currentColor"/><rect x="10" y="11" width="6" height="13" rx="2" fill="currentColor"/><rect x="20" y="6" width="6" height="18" rx="2" fill="currentColor"/><rect x="30" y="0" width="6" height="24" rx="2" fill="currentColor"/></svg>
  <svg width="34" height="24" viewBox="0 0 34 24"><path d="M17 22 l5 -6 a8 8 0 0 0 -10 0z M4 9 a19 19 0 0 1 26 0 l-4 4 a13 13 0 0 0 -18 0z" fill="currentColor"/></svg>
  <span class="bat"></span></span></div>`;

const items = [];
const add = (id, size, html) => items.push({ id, size, html });

// O1 — Nota do celular
add('O1-nota-celular', FEED, page(FEED, `
  ${status('23:41')}
  <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 46px 0;color:#D4A017;font-size:34px;font-weight:500">
    <span>‹ Notas</span><span style="display:flex;gap:34px"><span>⇪</span><span>⋯</span></span></div>
  <div style="padding:30px 64px 0">
    <div class="tiny" style="text-align:center;font-size:22px">hoje às 23:41</div>
    <div style="font-size:56px;font-weight:800;line-height:1.15;margin-top:30px;letter-spacing:-.5px">coisas que ninguém te conta sobre tirar a chupeta 🧸</div>
    <ol style="margin-top:36px;padding-left:48px;font-size:37px;line-height:1.45;font-weight:450">
      <li style="margin-bottom:24px">esconder <b>não é</b> despedida. ele procura, chora e a chupeta volta na 2ª noite</li>
      <li style="margin-bottom:24px">chupeta usada por muito tempo <b>pode mexer na mordida</b> (mordida aberta, dentes da frente pra frente)</li>
      <li style="margin-bottom:24px">odontopediatras recomendam começar a retirada <b>por volta dos 3 anos</b></li>
      <li style="margin-bottom:24px">o choro vem. o que muda é se ele vem com briga ou com acolhimento</li>
      <li style="margin-bottom:24px">criança aceita melhor o que <b>ela ajuda a decidir</b></li>
      <li>o segredo: transformar a retirada numa <span style="background:#FFF1A8;padding:0 6px">despedida</span>. historinha, dia escolhido junto, ritual de tchau 🌙</li>
    </ol>
  </div>
  <div class="a tiny" style="bottom:34px;left:0;right:0;text-align:center">@tchauchupeta</div>`, `body{background:#FBFAF6}`));

// O2 — Caixinha de perguntas (stories)
const hl = (t, bg = '#fff', color = '#1c1c1e') => `<span style="background:${bg};color:${color};padding:6px 16px;border-radius:10px;box-decoration-break:clone;-webkit-box-decoration-break:clone;line-height:1.75">${t}</span>`;
add('O2-caixinha-pergunta', STORY, page(STORY, `
  <div class="a" style="inset:0;filter:blur(18px) brightness(.75);transform:scale(1.15)">${SC.leitura(1300)}</div>
  <div class="a" style="left:0;right:0;top:44px">${status('21:08', '#fff')}</div>
  <div class="a" style="left:60px;right:60px;top:150px;display:flex;align-items:center;gap:18px;color:#fff;font-weight:700;font-size:30px">
    <div style="width:70px;height:70px;border-radius:50%;background:${C.cream};display:flex;align-items:center;justify-content:center">${pacifier({ size: 50 })}</div>tchauchupeta <span style="opacity:.7;font-weight:500">2 h</span></div>
  <div class="a" style="left:110px;right:110px;top:330px;border-radius:40px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.25)">
    <div style="background:linear-gradient(90deg,#F58529,#DD2A7B,#8134AF);color:#fff;text-align:center;font-weight:700;font-size:32px;padding:26px">Faça uma pergunta</div>
    <div style="background:#fff;text-align:center;font-weight:600;font-size:44px;line-height:1.25;padding:40px 44px">como tiro a chupeta sem ele chorar a noite toda? 😭</div>
  </div>
  <div class="a" style="left:80px;right:80px;top:900px;text-align:center;font-weight:700;font-size:46px">
    ${hl('a real: não existe mágica 💛')}<br>${hl('mas existe um jeito com menos briga:')}<br><br>
    ${hl('✨ prepara com historinha', '#FFD66B')}<br>${hl('✨ deixa ele escolher o dia', '#FFD66B')}<br>${hl('✨ faz um ritual de tchau', '#FFD66B')}<br><br>
    ${hl('ele não perde a chupeta.', C.night, '#fff')}<br>${hl('ele se despede dela 🌙', C.night, '#fff')}
  </div>`, `body{background:#2a2556}`));

// O3 — Busca
const sug = (t, strong = false) => `<div style="display:flex;align-items:center;gap:30px;padding:26px 0;border-bottom:2px solid #eee;font-size:38px;${strong ? 'font-weight:700' : 'color:#3c4043'}">
  <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke="#9aa0a6" stroke-width="2.5" fill="none"/><path d="M15 15 L21 21" stroke="#9aa0a6" stroke-width="2.5" stroke-linecap="round"/></svg><span>${t}</span></div>`;
add('O3-busca', FEED, page(FEED, `
  ${status('07:12')}
  <div style="padding:30px 56px 0">
    <div style="display:flex;align-items:center;gap:24px;border:3px solid #dfe1e5;border-radius:999px;padding:24px 36px;font-size:40px;box-shadow:0 4px 14px rgba(0,0,0,.08)">
      <svg width="36" height="36" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke="#5f6368" stroke-width="2.5" fill="none"/><path d="M15 15 L21 21" stroke="#5f6368" stroke-width="2.5" stroke-linecap="round"/></svg>
      <span>como tirar a chupeta<span style="border-left:3px solid #1a73e8;margin-left:4px"></span></span></div>
    <div style="padding:10px 20px">
      ${sug('como tirar a chupeta <b>sem chorar</b>')}
      ${sug('como tirar a chupeta <b>à noite</b>')}
      <div style="background:#FFF1A8;border-radius:16px;margin:0 -16px;padding:0 16px">${sug('chupeta <b>pode entortar os dentes?</b>', true)}</div>
      ${sug('<b>com quantos anos</b> tirar a chupeta')}
      ${sug('como tirar a chupeta <b>de criança apegada</b>')}
    </div>
  </div>
  <div class="a" style="left:56px;right:56px;bottom:60px;background:${C.night};color:#fff;border-radius:36px;padding:36px 40px">
    <div style="font-family:'Baloo 2';font-weight:800;font-size:44px;line-height:1.1">Se você já pesquisou isso, leia: 👇</div>
    <div style="font-size:31px;line-height:1.42;margin-top:14px;font-weight:500">O uso prolongado <b style="color:${C.sun}">pode</b> afetar a mordida, e odontopediatras recomendam começar a retirada por volta dos 3 anos. O jeito com menos briga: <b style="color:${C.sun}">a criança se despede da chupeta</b>, em vez de ter ela arrancada.</div>
    <div style="display:flex;align-items:center;gap:14px;margin-top:20px;font-weight:700;font-size:26px;color:${C.lavender}">${pacifier({ size: 44 })} Tchau Chupeta · o Ritual da Despedida</div>
  </div>`, `body{background:#fff}`));

// O4 — Grupo de mães (dramatização)
const msg = (name, color, text, time, first = true) => `<div style="align-self:flex-start;max-width:820px;background:#fff;border-radius:${first ? '6px' : '26px'} 26px 26px 26px;padding:14px 22px 10px;margin-top:${first ? 18 : 6}px;box-shadow:0 2px 2px rgba(0,0,0,.06)">
  ${first ? `<div style="color:${color};font-weight:700;font-size:26px">${name}</div>` : ''}
  <div style="font-size:33px;line-height:1.35">${text} <span style="font-size:20px;color:#8e8e93;margin-left:10px">${time}</span></div></div>`;
add('O4-grupo-maes', FEED, page(FEED, `
  ${status('22:17', '#fff')}
  <div style="background:#5B4F9C;color:#fff;display:flex;align-items:center;gap:22px;padding:14px 40px 24px;margin-top:-70px;padding-top:90px">
    <span style="font-size:40px">‹</span>
    <div style="width:76px;height:76px;border-radius:50%;background:${C.peach};display:flex;align-items:center;justify-content:center;font-size:40px">👶</div>
    <div><div style="font-weight:700;font-size:34px">Mães da turminha 💛</div><div style="font-size:24px;opacity:.8">Ju, Carol, Bia, Fê, você</div></div></div>
  <div style="display:flex;flex-direction:column;padding:10px 34px">
    ${msg('Ju', '#D9534F', 'gente, alguém conseguiu tirar a chupeta?? 😩', '22:03')}
    ${msg('Carol', '#2E86C1', 'escondi ontem. pior noite da minha vida kkkk', '22:05')}
    ${msg('Carol', '#2E86C1', 'devolvi às 3h 🫠', '22:05', false)}
    ${msg('Bia', '#27AE60', 'a dentista falou que já tá na hora por causa da mordida 😬', '22:09')}
    ${msg('Fê', '#AF7AC5', 'aqui ele pede o dia inteiro e eu nem sei por onde começar', '22:12')}
    ${msg('Ju', '#D9534F', 'socorro, somos todas nós 😂', '22:13')}
  </div>
  <div class="a" style="left:40px;right:40px;bottom:46px;background:#fff;border-radius:34px;padding:30px 36px;box-shadow:0 10px 30px rgba(0,0,0,.18);font-family:'Inter'">
    <div style="font-family:'Baloo 2';font-weight:800;font-size:42px;line-height:1.1;color:${C.ink}">Se você se viu nessa conversa…</div>
    <div style="font-size:30px;line-height:1.4;margin-top:10px;color:#3c3c43">existe um jeito mais leve: <b>a criança se despede da chupeta</b>, com historinha, dia escolhido junto e um ritual de tchau.</div>
    <div class="tiny" style="margin-top:10px">conversa ilustrativa</div>
  </div>`, `body{background:#ECE5DD;background-image:radial-gradient(#d9cfc4 1.5px, transparent 2px);background-size:36px 36px}`));

// O5 — Meme
const memePanel = (scene, vb) => `<div style="border-radius:20px;overflow:hidden;height:420px">${SC[scene](1000).replace('viewBox="0 0 1000 700"', `viewBox="${vb}"`).replace('style="display:block"', 'style="display:block;width:1000px;height:420px" preserveAspectRatio="xMidYMid slice"')}</div>`;
add('O5-meme', FEED, page(FEED, `
  <div style="padding:46px 40px 0">
    <div style="font-weight:700;font-size:40px;line-height:1.25">eu escondendo a chupeta achando que resolvi 😌</div>
    <div style="margin-top:20px">${memePanel('gaveta', '60 50 940 367')}</div>
    <div style="font-weight:700;font-size:40px;line-height:1.25;margin-top:30px">ele, às 3 da manhã:</div>
    <div style="margin-top:20px">${memePanel('noite', '330 170 700 273')}</div>
    <div style="margin-top:28px;font-size:30px;color:#555;font-weight:500">a gente aprende: <b style="color:#111">não é sobre esconder, é sobre ele se despedir</b> 🌙</div>
  </div>
  <div class="a tiny" style="bottom:22px;right:40px;font-size:22px">@tchauchupeta</div>`, `body{background:#fff}`));

// O6 — Post de texto da marca
add('O6-post-texto', FEED, page(FEED, `
  <div style="position:absolute;left:70px;right:70px;top:50%;transform:translateY(-50%);background:#fff;border-radius:40px;padding:56px 56px 50px;box-shadow:0 20px 60px rgba(42,37,86,.18)">
    <div style="display:flex;align-items:center;gap:22px">
      <div style="width:96px;height:96px;border-radius:50%;background:${C.cream};display:flex;align-items:center;justify-content:center;border:3px solid #eee">${pacifier({ size: 66 })}</div>
      <div><div style="font-weight:800;font-size:34px">Tchau Chupeta</div><div style="font-size:28px;color:#8e8e93">@tchauchupeta</div></div></div>
    <div style="font-size:42px;line-height:1.38;margin-top:34px;font-weight:500;letter-spacing:-.3px">
      ninguém te conta isso, mas tirar a chupeta de uma vez costuma dar ruim.<br><br>
      a criança não entende, chora, e a chupeta volta.<br><br>
      o que muda o jogo é ela <b>se despedir</b>: historinha antes, dia escolhido junto, ritual de tchau.<br><br>
      e quanto antes, melhor pros dentinhos 🦷</div>
  </div>`, `body{background:linear-gradient(160deg,#EEE8FF,#FFEDE4)}`));

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
