// Logo e banners de checkout do Missão Zero Tela.
// Uso: node src/build.mjs html && node src/marca.mjs
// Saída: ../logo/*.png e ../checkout/*.jpg
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOGO = join(ROOT, '..', 'logo');
const CHECK = join(ROOT, '..', 'checkout');
mkdirSync(LOGO, { recursive: true });
mkdirSync(CHECK, { recursive: true });
const font = (f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', f)).toString('base64')}) format('woff2')`;

const C = { navy: '#1E2B6F', navyDeep: '#161F55', purple: '#6B3FB8', yellow: '#FFE45C', gold: '#FFC94A', coral: '#FF7C8A', lav: '#B9A2EE', mint: '#74CDB2', cream: '#FFFAF3', lilac: '#F3EEFC', green: '#22B357', greenDark: '#178A41' };

// ------------------------------------------------------------- símbolo (o "0" é uma tela riscada)
const simbolo = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="58" fill="${C.purple}"/>
  <rect x="38" y="22" width="44" height="76" rx="18" fill="none" stroke="${C.yellow}" stroke-width="11"/>
  <circle cx="60" cy="86" r="3.2" fill="${C.yellow}"/>
  <path d="M28 96 L92 24" stroke="${C.coral}" stroke-width="10" stroke-linecap="round"/>
  <path d="M100 18 l2.6 6.4 6.4 2.6 -6.4 2.6 -2.6 6.4 -2.6 -6.4 -6.4 -2.6 6.4 -2.6z" fill="${C.yellow}"/>
  <path d="M16 74 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8 -4.4 -4.4 -1.8 4.4 -1.8z" fill="${C.yellow}"/>
</svg>`;

const BASE_CSS = `
@font-face{font-family:"Baloo 2";src:${font('Baloo2-latin.woff2')};font-weight:400 800}
@font-face{font-family:"Nunito";src:${font('Nunito-latin.woff2')};font-weight:200 1000}
@font-face{font-family:"Gochi Hand";src:${font('GochiHand-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Nunito",sans-serif;color:${C.navy}}
.emo{font-family:"Noto Color Emoji";font-weight:400}
.wm{font-family:"Baloo 2";font-weight:800;line-height:1;letter-spacing:-.01em}
`;

// wordmark: "Missão" com marca-texto + "Zero Tela" roxo (fundo claro) ou branco/amarelo (fundo escuro)
const wordmark = (size, dark = false) => `
  <span class="wm" style="font-size:${size}px;display:inline-flex;align-items:baseline;gap:${size * 0.22}px;white-space:nowrap">
    <span style="position:relative;color:${dark ? '#fff' : C.navy};z-index:0">${dark ? '' : `<span style="position:absolute;left:-${size * 0.06}px;right:-${size * 0.06}px;top:46%;bottom:6%;background:${C.yellow};border-radius:${size * 0.08}px;transform:rotate(-1.4deg);z-index:-1"></span>`}Missão</span>
    <span style="color:${dark ? C.yellow : C.purple}">Zero Tela</span>
  </span>`;

// ------------------------------------------------------------- miniaturas das páginas do PDF
async function capturar(browser) {
  const pg = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
  const shot = async (file, n) => {
    await pg.goto('file://' + join(ROOT, 'html', file), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const el = (await pg.$$('.page'))[n - 1];
    return 'data:image/jpeg;base64,' + (await el.screenshot({ type: 'jpeg', quality: 88 })).toString('base64');
  };
  const C1 = 'missao-zero-tela-completo.html', S1 = 'missao-zero-tela-simples.html';
  const t = {
    capa: await shot(C1, 1), capaS: await shot(S1, 1), m12: await shot(C1, 18), m1: await shot(C1, 7), m35: await shot(C1, 41),
    idx: await shot(C1, 3), cartas: await shot(C1, 109), carimbos: await shot(C1, 119), guia: await shot(C1, 125),
    desafio: await shot(C1, 129), cert: await shot(C1, 123), frases: await shot(C1, 126), mS: await shot(S1, 8), passS: await shot(S1, 25),
  };
  await pg.close();
  return t;
}

// ------------------------------------------------------------- peças
const seloGarantia = (s) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE79A,#E9B022 60%,#C98F12);padding:${s * 0.07}px;box-shadow:0 ${s * 0.06}px ${s * 0.14}px rgba(30,43,111,.25)">
  <div style="width:100%;height:100%;border-radius:50%;background:${C.navy};border:${s * 0.02}px dashed rgba(255,228,92,.6);display:flex;flex-direction:column;align-items:center;justify-content:center;color:${C.yellow};font-family:'Baloo 2';font-weight:800;line-height:.9">
    <span style="font-size:${s * 0.12}px;letter-spacing:.06em">GARANTIA</span><span style="font-size:${s * 0.42}px;color:#fff">7</span><span style="font-size:${s * 0.12}px;letter-spacing:.06em">DIAS</span></div></div>`;

const check = (s) => `<span style="flex:none;width:${s}px;height:${s}px;border-radius:50%;background:${C.gold};display:grid;place-items:center"><svg width="${s * 0.5}" height="${s * 0.5}" viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-8.5" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;

// leque de páginas + capa em destaque + tablet
const mockup = (t, w, simples = false) => {
  const pw = w * 0.2;
  const fan = simples ? [t.idx, t.m1, t.m35, t.passS] : [t.cartas, t.guia, t.m1, t.desafio, t.carimbos];
  const rot = simples ? [-22, -8, 8, 22] : [-26, -13, 0, 13, 26];
  return `<div style="position:relative;width:${w}px;height:${w * 0.78}px">
    <div style="position:absolute;inset:0;background:radial-gradient(closest-side,rgba(185,162,238,.35),transparent);"></div>
    ${fan.map((img, i) => `<img src="${img}" style="position:absolute;left:${w / 2 - pw / 2}px;top:${w * 0.06}px;width:${pw}px;transform-origin:50% 160%;transform:rotate(${rot[i]}deg);border-radius:${w * 0.006}px;box-shadow:0 ${w * 0.01}px ${w * 0.03}px rgba(30,43,111,.18)">`).join('')}
    <div style="position:absolute;left:${w * 0.36}px;top:${w * 0.2}px;width:${w * 0.34}px;transform:perspective(${w * 2}px) rotateY(-14deg) rotate(1deg);box-shadow:${w * 0.02}px ${w * 0.03}px ${w * 0.05}px rgba(30,43,111,.32);border-radius:${w * 0.008}px;overflow:hidden;border-left:${w * 0.014}px solid ${C.purple}">
      <img src="${simples ? t.capaS : t.capa}" style="width:100%;display:block"></div>
    <div style="position:absolute;left:${w * 0.03}px;top:${w * 0.36}px;width:${w * 0.29}px;background:#1b1d2a;border-radius:${w * 0.03}px;padding:${w * 0.013}px;transform:rotate(-6deg);box-shadow:0 ${w * 0.02}px ${w * 0.05}px rgba(30,43,111,.3)">
      <img src="${simples ? t.mS : t.m12}" style="width:100%;display:block;border-radius:${w * 0.016}px"></div>
    <div style="position:absolute;left:${w * 0.03}px;top:${w * 0.05}px;width:${w * 0.17}px;height:${w * 0.17}px;border-radius:50%;background:${C.coral};border:${w * 0.006}px solid ${C.navy};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Baloo 2';font-weight:800;line-height:.95;transform:rotate(-10deg)">
      <span style="font-size:${w * 0.065}px">${simples ? '20' : '100'}</span><span style="font-size:${w * 0.024}px">missões</span></div>
    <span class="emo" style="position:absolute;right:${w * 0.1}px;top:${w * 0.06}px;font-size:${w * 0.04}px">⭐</span>
    <span class="emo" style="position:absolute;right:${w * 0.02}px;top:${w * 0.5}px;font-size:${w * 0.04}px">✨</span>
    <span class="emo" style="position:absolute;left:${w * 0.42}px;bottom:${w * 0.01}px;font-size:${w * 0.05}px;transform:rotate(-30deg)">🖍️</span>
  </div>`;
};

const OFERTAS = {
  completo: {
    itens: ['<b>100 historinhas-missão</b> ilustradas, de 3 a 8 anos', 'Separadas por <b>idade</b> e por <b>momento do dia</b>', `<span style="color:${C.purple}">+ 4 bônus</span>: pote de missões, passaporte, guia "Desligar sem birra" e desafio 30 dias`],
    linha: 'Menos de R$ 0,28 por missão', preco: 'R$ 27,90',
  },
  simples: {
    itens: ['<b>20 historinhas-missão</b> ilustradas, de 3 a 8 anos', 'Só com o que você <b>já tem em casa</b>', 'Passaporte com 20 carimbos + <b>certificado</b>'],
    linha: 'Acesso imediato no seu e-mail', preco: 'R$ 11,00',
  },
};

const fundo = `background:radial-gradient(90% 90% at 75% 55%,#FFFFFF 0%,${C.cream} 50%,${C.lilac} 100%)`;
const botao = (txt, fs) => `<div style="background:${C.green};color:#fff;font-family:'Baloo 2';font-weight:800;font-size:${fs}px;border-radius:${fs * 0.35}px;padding:${fs * 0.42}px ${fs * 0.9}px;box-shadow:0 ${fs * 0.16}px 0 ${C.greenDark};text-align:center;white-space:nowrap">${txt}</div>`;
const lista = (itens, fs) => `<div style="display:flex;flex-direction:column;gap:${fs * 0.75}px">${itens.map((x) => `<div style="display:flex;gap:${fs * 0.6}px;align-items:center;font-weight:800;font-size:${fs}px;line-height:1.22">${check(fs * 1.9)}<span>${x}</span></div>`).join('')}</div>`;
const faixa = (h, fs) => `<div style="height:${h}px;background:${C.navy};display:flex;align-items:center;justify-content:center;gap:${fs * 0.35}px">${simbolo(fs * 1.25)}${wordmark(fs, true)}</div>`;

const bannerDesktop = (t, k) => { const o = OFERTAS[k]; return `<div style="width:1320px;height:790px;${fundo};position:relative;overflow:hidden">
  <div style="margin:22px 72px 0">${faixa(116, 78)}</div>
  <div style="display:grid;grid-template-columns:600px 1fr;padding:44px 0 0 80px;gap:10px">
    <div>${lista(o.itens, 31)}
      <p style="margin-top:34px;font-weight:800;font-size:22px;color:#4A5385">${o.linha}</p>
      <div style="margin-top:12px;display:inline-block">${botao('Por apenas ' + o.preco, 44)}</div></div>
    <div style="position:relative;margin-top:-30px">${mockup(t, 660, k === 'simples')}</div>
  </div>
  <div style="position:absolute;left:600px;top:470px">${seloGarantia(150)}</div></div>`; };

const bannerQuadrado = (t, k) => { const o = OFERTAS[k]; return `<div style="width:1080px;height:1080px;${fundo};position:relative;overflow:hidden">
  ${faixa(140, 82)}
  <div style="display:flex;justify-content:center;margin-top:6px">${mockup(t, 640, k === 'simples')}</div>
  <div style="padding:0 70px;margin-top:-6px">${lista(o.itens, 27)}</div>
  <div style="display:flex;justify-content:center;margin-top:30px">${botao('Por apenas ' + o.preco, 46)}</div>
  <div style="position:absolute;right:30px;top:160px">${seloGarantia(160)}</div></div>`; };

const bannerVertical = (t, k) => { const o = OFERTAS[k]; return `<div style="width:1080px;height:1350px;${fundo};position:relative;overflow:hidden">
  ${faixa(160, 90)}
  <div style="display:flex;justify-content:center;margin-top:10px">${mockup(t, 800, k === 'simples')}</div>
  <div style="padding:0 80px;margin-top:4px">${lista(o.itens, 32)}</div>
  <p style="text-align:center;margin-top:44px;font-weight:800;font-size:28px;color:#4A5385">${o.linha}</p>
  <div style="display:flex;justify-content:center;margin-top:14px">${botao('Por apenas ' + o.preco, 54)}</div>
  <div style="position:absolute;right:34px;top:180px">${seloGarantia(180)}</div></div>`; };

const BONUS = [
  ['🫙', 'Pote de Missões', '100 cartas para recortar e sortear', C.gold],
  ['📘', 'Passaporte do Explorador', '100 carimbos + certificado', C.lav],
  ['🤫', 'Guia "Desligar sem birra"', 'Método A.V.I.S.E. e frases prontas', C.mint],
  ['🏆', 'Desafio 30 Dias', 'Calendário + quadro de conquistas', C.coral],
];
const capaBonus = (b, i, w) => `<div style="width:${w}px;height:${w * 297 / 210}px;overflow:hidden;flex:none;border-radius:${w * 0.06}px;background:linear-gradient(180deg,${C.navy} 0%,${C.navy} 62%,${C.purple} 100%);color:#fff;display:flex;flex-direction:column;align-items:center;padding:${w * 0.1}px ${w * 0.08}px;text-align:center;box-shadow:0 ${w * 0.05}px ${w * 0.12}px rgba(30,43,111,.3)">
  <span style="font-size:${w * 0.07}px;font-weight:800;letter-spacing:.12em;color:${C.yellow}">BÔNUS ${i + 1}</span>
  <span class="wm" style="font-size:${w * 0.115}px;line-height:1.08;margin-top:${w * 0.05}px">${b[1]}</span>
  <span style="width:${w * 0.42}px;height:${w * 0.42}px;border-radius:50%;background:${b[3]};display:grid;place-items:center;margin-top:${w * 0.1}px"><span class="emo" style="font-size:${w * 0.22}px">${b[0]}</span></span>
  <span style="font-size:${w * 0.065}px;margin-top:auto;opacity:.85">Missão Zero Tela</span></div>`;

const presentes = (s) => `<svg width="${s * 1.9}" height="${s}" viewBox="0 0 190 100">
  <rect x="10" y="40" width="50" height="50" rx="5" fill="${C.navy}"/><rect x="31" y="40" width="8" height="50" fill="${C.gold}"/><rect x="6" y="32" width="58" height="12" rx="4" fill="${C.navy}"/><rect x="31" y="32" width="8" height="12" fill="${C.gold}"/>
  <rect x="62" y="22" width="62" height="68" rx="6" fill="${C.coral}"/><rect x="88" y="22" width="10" height="68" fill="${C.yellow}"/><rect x="58" y="12" width="70" height="14" rx="4" fill="${C.coral}"/><path d="M93 12 C80 -6 66 4 78 12Z M93 12 C106 -6 120 4 108 12Z" fill="${C.yellow}"/>
  <rect x="126" y="48" width="38" height="42" rx="5" fill="${C.lav}"/><rect x="141" y="48" width="8" height="42" fill="${C.gold}"/>
  <rect x="150" y="62" width="30" height="28" rx="4" fill="${C.mint}"/><rect x="161" y="62" width="7" height="28" fill="${C.yellow}"/>
</svg>`;

const bannerBonus = () => `<div style="width:1226px;height:800px;${fundo};text-align:center;padding-top:34px">
  <div class="wm" style="font-size:62px">Você também vai receber</div>
  <div style="display:inline-block;position:relative;margin-top:4px"><span style="position:absolute;left:-30px;right:-30px;top:52%;bottom:2%;background:${C.yellow}"></span><span class="wm" style="position:relative;font-size:104px">4 BÔNUS</span></div>
  <div style="margin-top:14px">${presentes(100)}</div>
  <div style="display:flex;justify-content:center;gap:44px;margin-top:22px">${BONUS.map((b, i) => `<div style="display:flex;flex-direction:column;align-items:center;width:230px">
    ${capaBonus(b, i, 170)}<div class="wm" style="font-size:26px;margin-top:14px;height:58px;display:flex;align-items:center">${b[1]}</div>
    <div style="font-size:16px;font-weight:700;color:#4A5385">${b[2]}</div>
    <div style="font-size:18px;font-weight:900;color:${C.green};margin-top:4px">INCLUSO</div></div>`).join('')}</div></div>`;

const bannerBonusVertical = () => `<div style="width:1080px;height:1350px;${fundo};text-align:center;padding-top:50px">
  <div class="wm" style="font-size:66px">Você também vai receber</div>
  <div style="display:inline-block;position:relative;margin-top:4px"><span style="position:absolute;left:-30px;right:-30px;top:52%;bottom:2%;background:${C.yellow}"></span><span class="wm" style="position:relative;font-size:112px">4 BÔNUS</span></div>
  <div style="margin-top:10px">${presentes(80)}</div>
  <div style="display:grid;grid-template-columns:repeat(2,420px);justify-content:center;gap:36px 60px;margin-top:26px">${BONUS.map((b, i) => `<div style="display:flex;flex-direction:column;align-items:center">
    ${capaBonus(b, i, 196)}<div class="wm" style="font-size:30px;margin-top:14px">${b[1]}</div>
    <div style="font-size:19px;font-weight:700;color:#4A5385;margin-top:4px">${b[2]}</div>
    <div style="font-size:21px;font-weight:900;color:${C.green};margin-top:4px">INCLUSO</div></div>`).join('')}</div></div>`;

const seloGrande = (s) => `<div style="width:${s}px;height:${s}px;position:relative">
  <svg width="${s}" height="${s}" viewBox="0 0 200 200" style="position:absolute;inset:0"><defs><radialGradient id="g" cx=".35" cy=".3"><stop offset="0" stop-color="#FFE79A"/><stop offset=".6" stop-color="#E9B022"/><stop offset="1" stop-color="#C98F12"/></radialGradient></defs>
  <path d="${Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2; const r = i % 2 ? 92 : 100; return `${i ? 'L' : 'M'}${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`; }).join(' ')}Z" fill="url(#g)"/>
  <circle cx="100" cy="100" r="74" fill="${C.navy}"/><circle cx="100" cy="100" r="64" fill="none" stroke="${C.yellow}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path id="t" d="M100 100 m-56 0 a56 56 0 1 1 112 0" fill="none"/><text font-family="Baloo 2" font-weight="800" font-size="20" fill="${C.yellow}" letter-spacing="4"><textPath href="#t" startOffset="50%" text-anchor="middle">GARANTIA</textPath></text>
  <text x="100" y="128" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="72" fill="#fff">7</text>
  <text x="100" y="152" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="20" fill="${C.yellow}" letter-spacing="3">DIAS</text></svg></div>`;

const bannerGarantia = () => `<div style="width:1226px;height:544px;position:relative;background:linear-gradient(${C.yellow} 0 300px,${C.navyDeep} 300px)">
  <div style="position:absolute;left:40px;top:24px">${seloGrande(360)}</div>
  <div class="wm" style="position:absolute;left:440px;top:60px;font-size:60px;line-height:1.08;color:${C.navy}">100% de satisfação<br>garantida em 7 dias ou<br><span style="color:${C.purple}">o seu dinheiro de volta!</span></div>
  <div style="position:absolute;left:0;right:0;top:400px;text-align:center;color:#C8CEEB;font-size:20px;line-height:1.6"><b style="color:${C.yellow};font-family:'Baloo 2';font-size:22px">Missão Zero Tela</b><br>Copyright 2026©<br>Todos os direitos reservados</div></div>`;

const bannerGarantiaVertical = () => `<div style="width:1080px;height:1350px;position:relative;background:linear-gradient(${C.yellow} 0 900px,${C.navyDeep} 900px);text-align:center">
  <div style="display:flex;justify-content:center;padding-top:70px">${seloGrande(440)}</div>
  <div class="wm" style="font-size:70px;line-height:1.1;color:${C.navy};margin-top:30px">100% de satisfação<br>garantida em 7 dias ou<br><span style="color:${C.purple}">o seu dinheiro de volta!</span></div>
  <div style="position:absolute;left:0;right:0;top:1040px;color:#C8CEEB;font-size:26px;line-height:1.6"><b style="color:${C.yellow};font-family:'Baloo 2';font-size:30px">Missão Zero Tela</b><br>Copyright 2026©<br>Todos os direitos reservados</div></div>`;

// ------------------------------------------------------------- logos
const logos = [
  ['logo-horizontal', 1400, 360, `<div style="display:flex;align-items:center;gap:34px;padding:40px">${simbolo(260)}<div>${wordmark(150)}<div style="font-family:'Gochi Hand';font-size:44px;color:#4A5385;margin-top:14px">brincadeiras que vencem a tela</div></div></div>`, true],
  ['logo-horizontal-fundo-escuro', 1400, 360, `<div style="display:flex;align-items:center;gap:34px;padding:40px;background:${C.navy};height:100%">${simbolo(260)}<div>${wordmark(150, true)}<div style="font-family:'Gochi Hand';font-size:44px;color:#C8CEEB;margin-top:14px">brincadeiras que vencem a tela</div></div></div>`, false],
  ['logo-empilhado', 1000, 1000, `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:30px">${simbolo(420)}${wordmark(112)}</div>`, true],
  ['logo-icone', 512, 512, `<div style="display:grid;place-items:center;height:100%">${simbolo(500)}</div>`, true],
  ['logo-checkout-quadrado', 600, 600, `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:18px;${fundo}">${simbolo(300)}${wordmark(78)}</div>`, false],
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const render = async (name, w, h, inner, { png = false, transparent = false, dir = CHECK } = {}) => {
  const pg = await browser.newPage({ viewport: { width: w, height: h } });
  await pg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${transparent ? 'transparent' : '#fff'}}</style></head><body>${inner}</body></html>`, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  const path = join(dir, name + (png ? '.png' : '.jpg'));
  await pg.screenshot(png ? { path, omitBackground: transparent } : { path, type: 'jpeg', quality: 90 });
  await pg.close();
  console.log('ok', name);
};

for (const [n, w, h, inner, tr] of logos) await render(n, w, h, inner, { png: true, transparent: tr, dir: LOGO });
const t = await capturar(browser);
for (const k of ['completo', 'simples']) {
  await render(`${k}-banner-checkout-desktop`, 1320, 790, bannerDesktop(t, k));
  await render(`${k}-banner-checkout-mobile`, 1080, 1080, bannerQuadrado(t, k));
  await render(`${k}-banner-checkout-celular-topo`, 1080, 1350, bannerVertical(t, k));
}
await render('completo-banner-checkout-bonus', 1226, 800, bannerBonus());
await render('completo-banner-checkout-celular-bonus', 1080, 1350, bannerBonusVertical());
await render('banner-checkout-garantia', 1226, 544, bannerGarantia());
await render('banner-checkout-celular-garantia', 1080, 1350, bannerGarantiaVertical());
await browser.close();
