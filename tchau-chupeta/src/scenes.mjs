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
@keyframes push{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes drain{from{transform:scaleY(1)}to{transform:scaleY(.25)}}
@keyframes fill{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@keyframes flow{to{stroke-dashoffset:-64}}
.paci-push{animation:push 1.4s ease-in-out infinite;transform-box:fill-box}
.sand-top{transform-origin:100px 146px;animation:drain 6s linear forwards}
.sand-bot{transform-origin:100px 262px;animation:fill 6s linear forwards}
.sand-fall{animation:flow .6s linear infinite}
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


// Dentinho personagem (cartoon, nada assustador). mood: 'sad' | 'happy'
const tooth = (size = 300, mood = 'sad') => `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 200 220">
  <path d="M40 40 C40 10 90 10 100 30 C110 10 160 10 160 40 C168 90 150 120 146 170 C143 200 122 205 118 175 C115 150 108 140 100 140 C92 140 85 150 82 175 C78 205 57 200 54 170 C50 120 32 90 40 40 Z" fill="#fff" stroke="${C.lavender}" stroke-width="6"/>
  <ellipse cx="70" cy="44" rx="12" ry="8" fill="${C.lavender}" opacity=".35"/>
  ${mood === 'sad'
    ? `<circle cx="80" cy="78" r="6" fill="${C.ink}"/><circle cx="120" cy="78" r="6" fill="${C.ink}"/>
       <path d="M68 66 L84 60 M132 66 L116 60" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
       <path d="M86 104 Q100 94 114 104" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <path d="M140 62 q6 10 0 16 q-6 -6 0 -16z" fill="#9FD3F2"/>`
    : `<path d="M72 80 Q80 70 88 80 M112 80 Q120 70 128 80" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
       <path d="M84 98 Q100 114 116 98" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`}
  <circle cx="66" cy="96" r="8" fill="${C.peachDeep}" opacity=".35"/><circle cx="134" cy="96" r="8" fill="${C.peachDeep}" opacity=".35"/>
</svg>`;

// Boca estilizada: a chupeta entre os dentes da frente, que ficam inclinados (mordida aberta, em desenho)
const mouth = (w = 760) => `<svg width="${w}" height="${w * 0.66}" viewBox="0 0 600 400">
  <rect x="20" y="20" width="560" height="360" rx="180" fill="#F7A8B8"/>
  <rect x="70" y="70" width="460" height="260" rx="130" fill="#7A3550"/>
  ${[100, 160, 220, 380, 440].map((x) => `<rect x="${x - 26}" y="70" width="52" height="64" rx="16" fill="#fff"/>`).join('')}
  <rect x="249" y="68" width="46" height="78" rx="16" fill="#fff" transform="rotate(-14 272 70)"/>
  <rect x="305" y="68" width="46" height="78" rx="16" fill="#fff" transform="rotate(14 328 70)"/>
  ${[100, 160, 220, 380, 440, 500].map((x) => `<rect x="${x - 26}" y="266" width="52" height="64" rx="16" fill="#fff"/>`).join('')}
  <rect x="249" y="252" width="46" height="70" rx="16" fill="#fff" transform="rotate(10 272 330)"/>
  <rect x="305" y="252" width="46" height="70" rx="16" fill="#fff" transform="rotate(-10 328 330)"/>
  <g class="paci-push"><ellipse cx="300" cy="200" rx="46" ry="40" fill="${C.peach}"/><ellipse cx="286" cy="188" rx="12" ry="8" fill="#fff" opacity=".5"/></g>
</svg>`;

// Ampulheta com areia caindo
const hourglass = (h = 520) => `<svg width="${h * 0.66}" height="${h}" viewBox="0 0 200 300">
  <rect x="20" y="10" width="160" height="22" rx="10" fill="${C.lavenderDeep}"/><rect x="20" y="268" width="160" height="22" rx="10" fill="${C.lavenderDeep}"/>
  <path d="M40 32 L160 32 L160 50 C160 100 108 130 108 150 C108 170 160 200 160 250 L160 268 L40 268 L40 250 C40 200 92 170 92 150 C92 130 40 100 40 50 Z" fill="#fff" fill-opacity=".85" stroke="${C.lavender}" stroke-width="6"/>
  <path class="sand-top" d="M52 56 L148 56 C146 96 104 122 100 146 C96 122 54 96 52 56 Z" fill="${C.sun}"/>
  <path class="sand-bot" d="M50 262 L150 262 C150 226 122 214 100 206 C78 214 50 226 50 262 Z" fill="${C.sun}"/>
  <line class="sand-fall" x1="100" y1="146" x2="100" y2="250" stroke="${C.sun}" stroke-width="6" stroke-dasharray="6 10"/>
</svg>`;

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

  
  // Dentinho preocupado com a chupeta por perto
  'dente-preocupado': `<body style="background:#EAF4FF"><div class="dots"></div>
    <div class="a" style="left:300px;top:1250px;${anim('shake', 1.8)}">${tooth(420, 'sad')}</div>
    <div class="a" style="left:120px;top:1300px;${anim('bob', 2.6)}">${pacifier({ size: 170, mood: 'sad' })}</div>
    ${stars(6, 31, [60, 200, 1000, 600], C.lavender)}</body>`,

  // A chupeta entre os dentes da frente (ilustração da mordida aberta)
  'mordida': `<body style="background:#FFEDE4"><div class="dots"></div>
    <div class="a" style="left:160px;top:1330px">${mouth(760)}</div>
    ${stars(6, 37, [60, 220, 1000, 600], C.peachDeep)}</body>`,

  // Ampulheta: o tempo conta
  'ampulheta': `<body style="background:linear-gradient(180deg,#EEE8FF,${C.cream})">
    <div class="a" style="left:368px;top:1230px">${hourglass(520)}</div>
    <div class="a" style="left:120px;top:1500px;${anim('bob', 2.4)}">${pacifier({ size: 150 })}</div>
    ${stars(8, 41, [60, 200, 1000, 600])}</body>`,

  // Dentinho feliz dando tchau para a chupeta que vai embora
  'dente-feliz': `<body style="background:#E6F6EF"><div class="dots"></div>
    <div class="a" style="left:180px;top:1260px;${anim('bob', 2)}">${tooth(400, 'happy')}</div>
    <div class="a" style="left:640px;top:1500px;animation:flyToMoon ${SEG}s ease-in-out forwards">${pacifier({ size: 200, wave: true })}</div>
    ${stars(10, 43, [60, 200, 1000, 600])}</body>`,
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
