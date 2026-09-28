// Gera cenas animadas 9:16 (sem texto) com as ilustrações da marca, para usar
// como fundo dos vídeos narrados. Cada quadro é capturado com o tempo das
// animações CSS controlado, e o ffmpeg junta os quadros em MP4.
// Uso: node src/scenes.mjs [filtro]   → saída em cenas-animadas/*.mp4
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, cloud, familyHug, childWaving } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'cenas-animadas');
const W = 1080, H = 1920, FPS = 30, SEG = 6;

const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;
const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{position:relative;background:${C.cream}}
.a{position:absolute}
.night{background:linear-gradient(180deg, ${C.nightDeep} 0%, ${C.night} 55%, #5B4F9C 100%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(${C.lavender} 3px, transparent 3.5px);background-size:60px 60px;opacity:.35}
@keyframes twinkle{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
@keyframes sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes shake{0%,100%{transform:rotate(0)}20%{transform:rotate(-6deg)}40%{transform:rotate(6deg)}60%{transform:rotate(-4deg)}80%{transform:rotate(4deg)}}
@keyframes rise{from{transform:translateY(0);opacity:0}15%{opacity:1}to{transform:translateY(-900px);opacity:0}}
@keyframes flyToMoon{from{transform:translate(0,0) rotate(-10deg) scale(1)}to{transform:translate(360px,-760px) rotate(14deg) scale(.55)}}
@keyframes drift{from{transform:translateX(-300px)}to{transform:translateX(300px)}}
@keyframes driftBack{from{transform:translateX(250px)}to{transform:translateX(-250px)}}
@keyframes zoom{from{transform:scale(1)}to{transform:scale(1.08)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes unspin{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@keyframes glow{0%,100%{opacity:.35}50%{opacity:.8}}
@keyframes lightUp{0%,15%{background:#fff;transform:scale(1)}25%,100%{transform:scale(1.08)}}
@keyframes walk{from{transform:translate(0,0)}to{transform:translate(0,-1050px)}}
@keyframes fall{from{transform:translateY(-200px) rotate(0)}to{transform:translateY(2100px) rotate(540deg)}}
`;

const anim = (name, dur, extra = '') => `animation:${name} ${dur}s ease-in-out infinite ${extra}`;
const stars = (n, seed = 1, area = [0, 0, W, H], color = C.sun) => {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, (_, i) => {
    const x = area[0] + r() * (area[2] - area[0]), y = area[1] + r() * (area[3] - area[1]);
    const sz = 18 + r() * 34, d = (1.4 + r() * 2).toFixed(2), dl = (-r() * 3).toFixed(2);
    const svg = i % 3 ? sparkle(sz, color) : star(sz, color);
    return `<div class="a" style="left:${x}px;top:${y}px;${anim('twinkle', d, `;animation-delay:${dl}s`)}">${svg}</div>`;
  }).join('');
};
const floating = (svgFn, n, seed, x0, x1, y) => {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => {
    const x = x0 + r() * (x1 - x0), d = (4 + r() * 3).toFixed(2), dl = (-r() * 6).toFixed(2);
    return `<div class="a" style="left:${x}px;top:${y}px;animation:rise ${d}s linear infinite;animation-delay:${dl}s">${svgFn(34 + r() * 30)}</div>`;
  }).join('');
};

const scenes = {
  // Céu noturno, Chupi acenando e flutuando perto da lua
  'noite-chupi': `<body class="night">${stars(26, 3)}
    <div class="a" style="right:110px;top:260px;${anim('glow', 4)}">${moon(260)}</div>
    <div class="a" style="left:0;top:1350px;animation:drift 12s linear infinite alternate">${cloud(520, '#fff', .12)}</div>
    <div class="a" style="left:350px;top:1330px;${anim('bob', 3)}"><div style="${anim('sway', 2)}">${pacifier({ size: 380, wave: true })}</div></div></body>`,

  // Criança acena e a chupeta voa para a lua
  'crianca-despedida': `<body class="night">${stars(22, 7)}
    <div class="a" style="right:90px;top:220px">${moon(230)}</div>
    <div class="a" style="left:560px;top:1380px;animation:flyToMoon ${SEG}s ease-in-out forwards">${pacifier({ size: 260, wave: true })}</div>
    <div class="a" style="left:110px;top:1380px;${anim('bob', 2.4)}">${childWaving({ size: 360 })}</div></body>`,

  // Mãe e criança abraçadas, corações subindo
  'abraco-coracoes': `<body style="background:linear-gradient(180deg,#FFEDE4,${C.cream})">
    <div class="a" style="left:-200px;top:900px;width:1480px;height:1400px;border-radius:50%;background:${C.mint};opacity:.35"></div>
    ${floating((s) => heart(s), 10, 5, 120, 960, 1500)}
    <div class="a" style="left:160px;top:1100px;animation:zoom ${SEG}s ease-in-out forwards">${familyHug({ size: 760 })}</div></body>`,

  // Chupi preocupada, balançando (a dor / resistência)
  'chupi-preocupada': `<body style="background:${C.cream}"><div class="dots"></div>
    <div class="a" style="left:310px;top:1290px;${anim('shake', 1.6)}">${pacifier({ size: 460, mood: 'sad' })}</div>
    <div class="a" style="left:160px;top:1250px;${anim('twinkle', 1.8)}">${sparkle(60, C.lavender)}</div>
    <div class="a" style="left:860px;top:1330px;${anim('twinkle', 2.2)}">${sparkle(46, C.peachDeep)}</div></body>`,

  // O ciclo tira → chora → devolve girando
  'ciclo': `<body style="background:#FFEDE4"><div class="dots"></div>
    <div class="a" style="left:90px;top:1150px;width:900px;height:900px;transform-origin:450px 450px;scale:.74;animation:spin 8s linear infinite">
      <svg class="a" width="900" height="900"><circle cx="450" cy="450" r="330" fill="none" stroke="${C.lavenderDeep}" stroke-width="12" stroke-dasharray="6 30" stroke-linecap="round"/></svg>
      ${['✋', '😭', '🔁'].map((e, i) => {
        const ang = (i * 120 - 90) * Math.PI / 180, x = 450 + 330 * Math.cos(ang) - 110, y = 450 + 330 * Math.sin(ang) - 110;
        return `<div class="a" style="left:${x}px;top:${y}px;width:220px;height:220px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:110px;box-shadow:0 14px 0 rgba(58,53,99,.08);animation:unspin 8s linear infinite">${e}</div>`;
      }).join('')}
    </div>
    <div class="a" style="left:430px;top:1480px;${anim('pulse', 1.4)}">${pacifier({ size: 220, mood: 'sad' })}</div></body>`,

  // Trilha do passo a passo, Chupi subindo pelas etapas
  'trilha-passos': `<body style="background:#E6F6EF"><div class="dots"></div>
    <svg class="a" width="${W}" height="${H}"><path d="M540 1750 C 200 1550, 880 1350, 540 1150 S 200 750, 540 450" stroke="${C.lavender}" stroke-width="16" fill="none" stroke-dasharray="4 36" stroke-linecap="round"/></svg>
    ${[[540, 1750], [330, 1450], [720, 1250], [360, 850], [540, 450]].map(([x, y], i) =>
      `<div class="a" style="left:${x - 75}px;top:${y - 75}px;width:150px;height:150px;border-radius:50%;background:${[C.peach, C.sun, C.mint, C.lavender, C.peach][i]};border:10px solid #fff;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2';font-weight:800;font-size:76px;color:${C.ink};padding-top:10px;box-shadow:0 12px 0 rgba(58,53,99,.08);animation:pulse 1.2s ease-in-out infinite;animation-delay:${(i * 1.2).toFixed(1)}s">${i + 1}</div>`).join('')}
    <div class="a" style="left:780px;top:1500px;animation:walk ${SEG}s ease-in-out forwards">${pacifier({ size: 200, wave: true })}</div></body>`,

  // Quarto infantil à noite: janela com lua, caminha, luz suave
  'quarto-noite': `<body style="background:linear-gradient(180deg,#4A4285,#6B5FA8)">
    <div class="a" style="left:230px;top:330px;width:620px;height:700px;border-radius:300px 300px 30px 30px;background:${C.nightDeep};border:22px solid #F4E9DA;overflow:hidden">
      ${stars(10, 11, [20, 20, 560, 620])}<div class="a" style="left:300px;top:90px">${moon(200)}</div></div>
    <div class="a" style="left:0;top:1180px;width:${W}px;height:740px;background:#5A4E96"></div>
    <div class="a" style="left:150px;top:1250px;width:780px;height:300px;border-radius:60px;background:${C.lavender}"></div>
    <div class="a" style="left:190px;top:1180px;width:280px;height:140px;border-radius:70px;background:#fff"></div>
    <div class="a" style="left:130px;top:1440px;width:820px;height:230px;border-radius:40px;background:${C.peach}"></div>
    <div class="a" style="left:640px;top:1290px;${anim('bob', 3)}">${pacifier({ size: 200, wave: true })}</div>
    <div class="a" style="inset:0;background:radial-gradient(circle at 540px 700px, rgba(255,214,107,.35), transparent 60%);${anim('glow', 4)}"></div></body>`,

  // Chupi feliz pulando com estrelas caindo (celebração leve)
  'chupi-festa': `<body style="background:linear-gradient(180deg,#EEE8FF,${C.cream})">
    ${Array.from({ length: 16 }, (_, i) => `<div class="a" style="left:${(i * 67) % 1000 + 20}px;top:0;animation:fall ${4 + (i % 4)}s linear infinite;animation-delay:${-(i * 0.7).toFixed(1)}s">${i % 2 ? star(46, [C.sun, C.peach, C.mint, C.lavenderDeep][i % 4]) : sparkle(40, C.sun)}</div>`).join('')}
    <div class="a" style="left:300px;top:1260px;${anim('bob', 1.1)}">${pacifier({ size: 460, wave: true })}</div></body>`,

  // Chupi dormindo numa nuvem, nuvens passando
  'chupi-nuvem': `<body class="night">${stars(20, 17)}
    <div class="a" style="left:0;top:420px;animation:driftBack 10s linear infinite alternate">${cloud(420, '#fff', .15)}</div>
    <div class="a" style="left:500px;top:1500px;animation:drift 9s linear infinite alternate">${cloud(460, '#fff', .12)}</div>
    <div class="a" style="left:150px;top:1480px;${anim('bob', 4)}">${cloud(780, '#fff', .95)}
      <div class="a" style="left:250px;top:-190px"><div style="${anim('sway', 4)}">${pacifier({ size: 280 })}</div></div></div>
    <div class="a" style="right:100px;top:260px">${moon(200)}</div></body>`,

  // Criança e Chupi lado a lado dentro de um coração que pulsa
  'coracao-amigos': `<body style="background:${C.cream}"><div class="dots"></div>
    <div class="a" style="left:90px;top:1000px;${anim('pulse', 2)}">${heart(900, '#FFD9CD')}</div>
    <div class="a" style="left:210px;top:1320px">${childWaving({ size: 320 })}</div>
    <div class="a" style="left:600px;top:1320px;${anim('sway', 1.6)}">${pacifier({ size: 240, wave: true })}</div>
    ${stars(8, 23, [60, 300, 1000, 600])}</body>`,

  };

mkdirSync(OUT, { recursive: true });
const filter = process.argv[2];
const browser = await chromium.launch();
for (const [id, body] of Object.entries(scenes)) {
  if (filter && !id.includes(filter)) continue;
  const pg = await browser.newPage({ viewport: { width: W, height: H } });
  await pg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>${body}</html>`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', join(OUT, `${id}.mp4`)]);
  const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error(`ffmpeg ${c}`)) : res())));
  for (let f = 0; f < FPS * SEG; f++) {
    const t = (f / FPS) * 1000;
    await pg.evaluate((t) => document.getAnimations().forEach((a) => { a.currentTime = t; }), t);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await pg.close();
  console.log('ok', id);
}
await browser.close();
