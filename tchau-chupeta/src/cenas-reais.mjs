// Estáticos com encenação de situações reais (mãe e filho), leva L3.
// Personagens e cenários em SVG, no estilo flat da marca.
// Uso: node src/cenas-reais.mjs [filtro] → png/l3/L3R*.png
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, logo } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'png', 'l3');
const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

// ---------------------------------------------------------------- personagens
const INK = C.ink;
const face = (cx, cy, r, expr) => {
  const ex = r * 0.36, ey = cy - r * 0.02, s = r / 46;
  const L = cx - ex, R = cx + ex, w = 7 * s;
  const st = `stroke="${INK}" stroke-width="${4 * s}" fill="none" stroke-linecap="round"`;
  const blush = `<circle cx="${cx - r * 0.55}" cy="${cy + r * 0.28}" r="${7 * s}" fill="${C.peachDeep}" opacity=".35"/><circle cx="${cx + r * 0.55}" cy="${cy + r * 0.28}" r="${7 * s}" fill="${C.peachDeep}" opacity=".35"/>`;
  const my = cy + r * 0.38;
  const parts = {
    happy: `<path d="M${L - w} ${ey} Q${L} ${ey - w * 1.2} ${L + w} ${ey}" ${st}/><path d="M${R - w} ${ey} Q${R} ${ey - w * 1.2} ${R + w} ${ey}" ${st}/>
            <path d="M${cx - 12 * s} ${my - 4 * s} Q${cx} ${my + 9 * s} ${cx + 12 * s} ${my - 4 * s}" ${st}/>`,
    tired: `<path d="M${L - w} ${ey} L${L + w} ${ey}" ${st}/><path d="M${R - w} ${ey} L${R + w} ${ey}" ${st}/>
            <path d="M${L - w} ${ey + 7 * s} Q${L} ${ey + 11 * s} ${L + w} ${ey + 7 * s}" stroke="${INK}" stroke-width="${2.2 * s}" fill="none" opacity=".45"/>
            <path d="M${R - w} ${ey + 7 * s} Q${R} ${ey + 11 * s} ${R + w} ${ey + 7 * s}" stroke="${INK}" stroke-width="${2.2 * s}" fill="none" opacity=".45"/>
            <path d="M${cx - 9 * s} ${my + 2 * s} Q${cx} ${my - 3 * s} ${cx + 9 * s} ${my + 2 * s}" ${st}/>`,
    worried: `<circle cx="${L}" cy="${ey}" r="${4.5 * s}" fill="${INK}"/><circle cx="${R}" cy="${ey}" r="${4.5 * s}" fill="${INK}"/>
            <path d="M${L - w * 1.2} ${ey - 9 * s} L${L + w} ${ey - 14 * s}" ${st}/><path d="M${R + w * 1.2} ${ey - 9 * s} L${R - w} ${ey - 14 * s}" ${st}/>
            <path d="M${cx - 10 * s} ${my + 2 * s} Q${cx - 5 * s} ${my - 3 * s} ${cx} ${my + 1 * s} Q${cx + 5 * s} ${my + 4 * s} ${cx + 10 * s} ${my - 1 * s}" ${st}/>`,
    cry: `<path d="M${L - w} ${ey - 2 * s} Q${L} ${ey + 6 * s} ${L + w} ${ey - 2 * s}" ${st}/><path d="M${R - w} ${ey - 2 * s} Q${R} ${ey + 6 * s} ${R + w} ${ey - 2 * s}" ${st}/>
            <ellipse cx="${cx}" cy="${my + 4 * s}" rx="${11 * s}" ry="${9 * s}" fill="#7A3550"/>
            <path d="M${L + 2 * s} ${ey + 6 * s} q${-5 * s} ${12 * s} 0 ${18 * s} q${5 * s} ${-6 * s} 0 ${-18 * s}z" fill="#8CCBF2"/>
            <path d="M${R - 2 * s} ${ey + 6 * s} q${5 * s} ${12 * s} 0 ${18 * s} q${-5 * s} ${-6 * s} 0 ${-18 * s}z" fill="#8CCBF2"/>`,
    grin: `<path d="M${L - w} ${ey} Q${L} ${ey - w * 1.2} ${L + w} ${ey}" ${st}/><path d="M${R - w} ${ey} Q${R} ${ey - w * 1.2} ${R + w} ${ey}" ${st}/>
            <path d="M${cx - 15 * s} ${my - 6 * s} Q${cx} ${my + 14 * s} ${cx + 15 * s} ${my - 6 * s} Z" fill="#fff" stroke="${INK}" stroke-width="${3 * s}"/>`,
    nervous: `<circle cx="${L}" cy="${ey}" r="${4.5 * s}" fill="${INK}"/><circle cx="${R}" cy="${ey}" r="${4.5 * s}" fill="${INK}"/>
            <path d="M${cx - 12 * s} ${my} L${cx + 12 * s} ${my}" ${st}/>
            <path d="M${cx + r * 0.8} ${cy - r * 0.3} q${5 * s} ${9 * s} 0 ${14 * s} q${-5 * s} ${-5 * s} 0 ${-14 * s}z" fill="#8CCBF2"/>`,
  };
  return (parts[expr] || parts.happy) + blush;
};

const arm = (pts, color, w = 26) => `<path d="${pts}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const hand = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.skin}"/>`;
const miniPaci = (x, y, s = 0.2, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(-100 -130)">
  <circle cx="100" cy="212" r="38" fill="none" stroke="${C.lavenderDeep}" stroke-width="14"/><rect x="88" y="150" width="24" height="34" rx="10" fill="${C.lavenderDeep}"/>
  <path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${C.peach}"/></g>`;

// Mãe em pé. pose: down | hold | hide | tired | reach
const mom = (x, y, s = 1, { expr = 'happy', pose = 'down', shirt = C.lavender, item = '' } = {}) => {
  const P = '#4E4A86', H = C.hair;
  const behind = pose === 'hide' ? arm('M62 -395 Q70 -320 45 -268', shirt) + hand(45, -262) + miniPaci(70, -262, 0.2, 20) : '';
  const arms = {
    down: arm('M-62 -395 Q-82 -320 -76 -250', shirt) + hand(-76, -244) + arm('M62 -395 Q82 -320 76 -250', shirt) + hand(76, -244),
    hold: arm('M-62 -395 Q-96 -320 -24 -300', shirt) + hand(-22, -300) + arm('M62 -395 Q96 -320 24 -300', shirt) + hand(22, -300),
    hide: arm('M-62 -395 Q-82 -320 -76 -250', shirt) + hand(-76, -244),
    tired: arm('M-62 -395 Q-82 -320 -76 -250', shirt) + hand(-76, -244) + arm('M62 -395 Q112 -460 34 -508', shirt) + hand(30, -508),
    reach: arm('M-62 -395 Q-82 -320 -76 -250', shirt) + hand(-76, -244) + arm('M62 -395 Q120 -380 160 -340', shirt) + hand(164, -336),
  }[pose];
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="4" rx="80" ry="12" fill="#000" opacity=".12"/>
    ${behind}
    <rect x="-40" y="-232" width="32" height="232" rx="14" fill="${P}"/><rect x="8" y="-232" width="32" height="232" rx="14" fill="${P}"/>
    <ellipse cx="-26" cy="0" rx="24" ry="10" fill="${INK}"/><ellipse cx="26" cy="0" rx="24" ry="10" fill="${INK}"/>
    <path d="M-72 -400 Q-80 -240 -64 -218 L64 -218 Q80 -240 72 -400 Q0 -432 -72 -400Z" fill="${shirt}"/>
    <rect x="-13" y="-448" width="26" height="40" rx="10" fill="${C.skin2}"/>
    <path d="M-50 -470 C-58 -560 58 -560 50 -470 L50 -420 C40 -440 -40 -440 -50 -420Z" fill="${H}"/>
    <circle cx="0" cy="-485" r="48" fill="${C.skin}"/>
    <path d="M-50 -488 C-50 -545 50 -545 50 -488 C38 -512 10 -520 -6 -512 C-22 -520 -42 -510 -50 -488Z" fill="${H}"/>
    <circle cx="0" cy="-548" r="22" fill="${H}"/>
    ${face(0, -485, 48, expr)}
    ${arms}${item}
  </g>`;
};

// Criança. pose: stand | sit (tronco, para cama). arm: down | wave | reach | point. paci: hand | mouth | ''
const kid = (x, y, s = 1, { expr = 'happy', pose = 'stand', arm: a = 'down', paci = '', shirt = C.mint, hair = C.hair, girl = false } = {}) => {
  const legs = pose === 'stand' ? `<rect x="-22" y="-95" width="18" height="95" rx="8" fill="${shirt}"/><rect x="4" y="-95" width="18" height="95" rx="8" fill="${shirt}"/>
    <ellipse cx="-14" cy="0" rx="15" ry="7" fill="${INK}"/><ellipse cx="14" cy="0" rx="15" ry="7" fill="${INK}"/>` : '';
  const arms = {
    down: arm('M-40 -185 Q-54 -150 -50 -112', shirt, 18) + hand(-50, -108, 10) + arm('M40 -185 Q54 -150 50 -112', shirt, 18) + hand(50, -108, 10),
    wave: arm('M-40 -185 Q-54 -150 -50 -112', shirt, 18) + hand(-50, -108, 10) + arm('M40 -185 Q78 -210 86 -262', shirt, 18) + hand(87, -268, 11),
    reach: arm('M-40 -185 Q-70 -200 -96 -228', shirt, 18) + hand(-100, -232, 10) + arm('M40 -185 Q54 -150 50 -112', shirt, 18) + hand(50, -108, 10),
    hug: arm('M-40 -185 Q-20 -150 10 -150', shirt, 18) + arm('M40 -185 Q20 -150 -10 -150', shirt, 18),
  }[a];
  const handPaci = paci === 'hand' ? miniPaci(a === 'wave' ? 92 : 56, a === 'wave' ? -292 : -96, 0.18) : '';
  const mouthPaci = paci === 'mouth' ? `<ellipse cx="0" cy="-226" rx="22" ry="15" fill="${C.peach}"/><circle cx="0" cy="-212" r="9" fill="none" stroke="${C.lavenderDeep}" stroke-width="4"/>` : '';
  const pig = girl ? `<circle cx="-46" cy="-262" r="16" fill="${hair}"/><circle cx="46" cy="-262" r="16" fill="${hair}"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${pose === 'stand' ? '<ellipse cx="0" cy="3" rx="46" ry="8" fill="#000" opacity=".12"/>' : ''}
    ${legs}
    <path d="M-46 -192 Q-52 -104 -42 -90 L42 -90 Q52 -104 46 -192 Q0 -212 -46 -192Z" fill="${shirt}"/>
    ${pig}
    <circle cx="0" cy="-245" r="46" fill="${C.skin}"/>
    <path d="M-46 -248 C-50 -300 50 -302 46 -250 C34 -270 14 -276 0 -268 C-12 -278 -36 -272 -46 -248Z" fill="${hair}"/>
    ${face(0, -245, 46, expr)}${mouthPaci}
    ${arms}${handPaci}
  </g>`;
};

// ---------------------------------------------------------------- cenários (viewBox 1000x700)
const svg = (w, inner, vb = '0 0 1000 700') => `<svg width="${w}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="display:block">${inner}</svg>`;
const windowNight = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#F4E9DA"/>
  <rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" rx="10" fill="${C.nightDeep}"/>
  <g transform="translate(${x + w * 0.55} ${y + 30}) scale(${w / 500})">${moon(130).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
  ${[[0.2, 0.3], [0.35, 0.65], [0.75, 0.75], [0.15, 0.8]].map(([a, b]) => `<circle cx="${x + w * a}" cy="${y + h * b}" r="4" fill="${C.sun}"/>`).join('')}
  <rect x="${x + w / 2 - 5}" y="${y + 14}" width="10" height="${h - 28}" fill="#F4E9DA"/></g>`;
const bedBack = (x, y, w) => `<rect x="${x}" y="${y - 160}" width="26" height="200" rx="10" fill="#C9A27E"/><rect x="${x}" y="${y - 120}" width="${w}" height="26" rx="10" fill="#C9A27E"/>
  <rect x="${x + 20}" y="${y - 40}" width="${w - 20}" height="70" rx="20" fill="#fff"/><rect x="${x + 36}" y="${y - 82}" width="150" height="56" rx="26" fill="#F4F0FF"/>`;
const blanket = (x, y, w, color = C.peach) => `<path d="M${x + 10} ${y - 34} Q${x + w / 2} ${y - 70} ${x + w} ${y - 34} L${x + w} ${y + 40} L${x + 10} ${y + 40}Z" fill="${color}"/>
  <path d="M${x + 10} ${y - 34} Q${x + w / 2} ${y - 70} ${x + w} ${y - 34}" stroke="#fff" stroke-width="10" fill="none" opacity=".5"/>
  <rect x="${x}" y="${y + 30}" width="${w + 10}" height="40" rx="12" fill="#C9A27E"/>`;
const clock = (x, y, t = '03:12') => `<rect x="${x}" y="${y}" width="150" height="70" rx="14" fill="#1E1B3E"/><text x="${x + 75}" y="${y + 50}" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="44" fill="#FF7A6B">${t}</text>`;
const nightstand = (x, y) => `<rect x="${x}" y="${y}" width="170" height="140" rx="14" fill="#8C6E9E"/><rect x="${x + 20}" y="${y + 50}" width="130" height="10" rx="5" fill="#6D5480"/>`;
const giftBox = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-50" width="120" height="80" rx="10" fill="${C.peach}"/><rect x="-8" y="-50" width="16" height="80" fill="${C.sun}"/>
  <rect x="-68" y="-72" width="136" height="28" rx="8" fill="${C.peachDeep}"/></g>`;
const book = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-120 -20 L-120 70 L0 90 Z" fill="${C.night}"/><path d="M0 0 L120 -20 L120 70 L0 90 Z" fill="#5B4F9C"/>
  <path d="M-100 -4 L-12 10 M-100 14 L-12 28 M-100 32 L-40 42" stroke="#fff" stroke-width="5" opacity=".6"/><g transform="translate(60 28) scale(.22) translate(-100 -130)">
  <path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${C.peach}"/></g>
  <circle cx="40" cy="0" r="5" fill="${C.sun}"/><circle cx="90" cy="50" r="4" fill="${C.sun}"/></g>`;

const SC = {
  // 3 da manhã: criança chorando na cama, mãe cansada na porta
  noite: (w) => svg(w, `
    <rect width="1000" height="700" fill="#3E3A70"/><rect y="560" width="1000" height="140" fill="#2F2B5A"/>
    <path d="M60 560 L60 140 L230 140 L230 560Z" fill="#FFE7A8"/><path d="M60 560 L230 560 L330 700 L-40 700Z" fill="#FFE7A8" opacity=".35"/>
    ${windowNight(380, 110, 200, 220)}
    ${nightstand(820, 440)}${clock(830, 360)}
    ${bedBack(540, 520, 300)}
    ${kid(700, 560, 1.05, { expr: 'cry', pose: 'sit', arm: 'reach' })}
    ${blanket(540, 540, 300, C.mint)}
    ${mom(150, 600, 0.95, { expr: 'tired', pose: 'tired', shirt: '#B9A7E8' })}`),

  // Escovação: mãe preocupada olhando os dentinhos
  escova: (w) => svg(w, `
    <rect width="1000" height="700" fill="#E3F1FA"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="420" stroke="#fff" stroke-width="5"/>`).join('')}
    ${Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1000" y2="${i * 120}" stroke="#fff" stroke-width="5"/>`).join('')}
    <rect y="420" width="1000" height="280" fill="#CFE3F0"/>
    <rect x="560" y="70" width="300" height="240" rx="30" fill="#BFE0F5" stroke="#fff" stroke-width="14"/>
    <rect x="540" y="360" width="340" height="60" rx="20" fill="#fff"/><rect x="600" y="420" width="220" height="200" rx="16" fill="#fff"/>
    <rect x="690" y="320" width="16" height="50" rx="6" fill="#B8C4D6"/>
    <rect x="300" y="560" width="190" height="60" rx="12" fill="${C.sun}"/>
    ${kid(395, 560, 1.15, { expr: 'grin', arm: 'down', paci: 'hand', shirt: '#9FD3F2' })}
    ${mom(200, 640, 1, { expr: 'worried', pose: 'reach', shirt: C.lavender,
      item: '<rect x="150" y="-352" width="70" height="14" rx="7" fill="#8CCBF2" transform="rotate(-20 160 -345)"/>' })}`),

  // Esconder na gaveta: mãe escondendo a chupeta, criança procurando
  gaveta: (w) => svg(w, `
    <rect width="1000" height="700" fill="#FFEDE4"/><rect y="560" width="1000" height="140" fill="#F2D3C4"/>
    <rect x="80" y="330" width="260" height="230" rx="18" fill="#C9A27E"/><rect x="100" y="360" width="220" height="70" rx="10" fill="#B58B66"/>
    <rect x="100" y="450" width="220" height="70" rx="10" fill="#B58B66"/><rect x="88" y="440" width="244" height="22" rx="8" fill="#9C7556" transform="translate(10 -6)"/>
    <circle cx="210" cy="395" r="8" fill="#7E5C42"/><circle cx="210" cy="485" r="8" fill="#7E5C42"/>
    <rect x="140" y="250" width="70" height="80" rx="10" fill="${C.mint}"/><circle cx="270" cy="300" r="30" fill="${C.sun}"/>
    ${mom(530, 620, 1, { expr: 'nervous', pose: 'hide', shirt: C.lavender })}
    ${kid(800, 620, 1.15, { expr: 'worried', arm: 'reach', girl: true, shirt: '#F7A8C8', hair: C.hair2 })}`),

  // Ritual na janela: criança acena e a chupeta vai para a Lua
  ritual: (w) => svg(w, `
    <rect width="1000" height="700" fill="#4A4285"/><rect y="560" width="1000" height="140" fill="#3A3470"/>
    ${windowNight(450, 60, 420, 380)}
    <g transform="translate(690 210) rotate(-14) scale(.32) translate(-100 -130)">
      <circle cx="100" cy="212" r="38" fill="none" stroke="${C.lavenderDeep}" stroke-width="14"/><rect x="88" y="150" width="24" height="34" rx="10" fill="${C.lavenderDeep}"/>
      <path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${C.peach}"/>
      <path d="M78 104 Q84 96 90 104 M110 104 Q116 96 122 104 M88 118 Q100 130 112 118" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/></g>
    <path d="M590 380 Q640 300 670 250" stroke="#fff" stroke-width="5" stroke-dasharray="6 14" fill="none" opacity=".6"/>
    ${[[600, 300], [760, 170], [820, 260]].map(([a, b]) => `<g transform="translate(${a} ${b})"><path d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z" fill="${C.sun}"/></g>`).join('')}
    ${giftBox(330, 600, 0.9)}
    ${mom(220, 620, 1, { expr: 'happy', pose: 'down', shirt: '#B9A7E8' })}
    ${kid(500, 620, 1.15, { expr: 'happy', arm: 'wave' })}
    <g transform="translate(140 150)">${heart(40).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>`),

  // Historinha na cama: mãe e filho lendo juntos
  leitura: (w) => svg(w, `
    <rect width="1000" height="700" fill="#5A4E96"/><rect y="580" width="1000" height="120" fill="#463C80"/>
    <circle cx="130" cy="200" r="160" fill="${C.sun}" opacity=".18"/>
    <rect x="70" y="330" width="130" height="250" rx="12" fill="#8C6E9E"/><path d="M90 230 L180 230 L160 160 L110 160Z" fill="#FFE7A8"/><rect x="130" y="230" width="10" height="100" fill="#C9A27E"/>
    ${windowNight(720, 70, 220, 220)}
    ${bedBack(240, 560, 640)}
    ${mom(450, 760, 0.95, { expr: 'happy', pose: 'hold', shirt: '#B9A7E8' })}
    ${kid(640, 590, 1.1, { expr: 'happy', pose: 'sit', arm: 'hug', shirt: C.mint })}
    <rect x="240" y="560" width="650" height="140" fill="#463C80"/>
    ${blanket(240, 560, 640, C.peach)}
    ${book(450, 440, 0.8)}`),
};

// ---------------------------------------------------------------- layout
const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:'Nunito',sans-serif;color:${C.ink};background:${C.cream};position:relative}
.h{font-family:'Baloo 2',sans-serif;font-weight:800;line-height:1.02;letter-spacing:-1px}
.a{position:absolute}
.scene{position:absolute;left:0;right:0;top:0;overflow:hidden;border-radius:0 0 48px 48px}
.txt{position:absolute;left:70px;right:70px;display:flex;flex-direction:column}
.tag{display:inline-flex;align-self:flex-start;align-items:center;gap:10px;border-radius:999px;padding:10px 24px;font-weight:900;font-size:26px;background:#FFE1D6;color:#C9553F}
.hl{background:linear-gradient(transparent 58%, ${C.sun} 58%, ${C.sun} 92%, transparent 92%);padding:0 6px}
.hl-red{background:linear-gradient(transparent 58%, #FFB4A2 58%, #FFB4A2 92%, transparent 92%);padding:0 6px}
.body{font-size:32px;line-height:1.35;font-weight:600;color:${C.inkSoft}}
.body b{color:${C.ink};font-weight:900}
.mech{background:${C.night};color:#fff;border-radius:30px;padding:22px 30px}
.mech .k{font-weight:900;font-size:21px;letter-spacing:2px;text-transform:uppercase;color:${C.sun}}
.mech .t{font-size:28px;font-weight:700;line-height:1.3;margin-top:6px}
.mech .t b{color:${C.sun};font-weight:900}
.cta{display:inline-flex;align-items:center;background:${C.peachDeep};color:#fff;font-weight:900;font-size:33px;border-radius:999px;padding:20px 40px;box-shadow:0 9px 0 #C96A56}
.row{display:flex;align-items:center}
.between{justify-content:space-between}
.logo{display:flex;align-items:center;gap:calc(10px*var(--s))}
.logo-icon{display:flex}
.logo-text{font-family:'Baloo 2';font-weight:700;font-size:calc(30px*var(--s));line-height:.9;text-transform:uppercase;letter-spacing:1px}
.logo-text b{font-weight:800;font-size:calc(38px*var(--s))}
.bubble{position:absolute;background:#fff;border-radius:28px;padding:16px 26px;font-weight:900;font-size:30px;box-shadow:0 8px 0 rgba(0,0,0,.12)}
.bubble:after{content:'';position:absolute;bottom:-18px;left:40px;border:12px solid transparent;border-top:18px solid #fff;border-bottom:0}
.small{font-size:19px;font-weight:700;color:${C.inkSoft};margin-top:10px}
.panel{position:relative;border-radius:26px;overflow:hidden;border:5px solid #fff;box-shadow:0 8px 0 rgba(58,53,99,.08)}
.cap{position:absolute;left:12px;top:12px;background:#fff;border-radius:999px;padding:6px 16px;font-weight:900;font-size:22px}
`;
const page = (size, inner, extra = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>:root{--w:${size.w}px;--h:${size.h}px}${CSS}${extra}</style></head><body>${inner}</body></html>`;
const mech = (t) => `<div class="mech"><div class="k">✨ O Ritual da Despedida</div><div class="t">${t}</div></div>`;
const foot = (cta = 'Conheça o método →') => `<div class="row between" style="margin-top:22px"><div class="cta">${cta}</div>${logo({ size: 0.8 })}</div>`;

const feed = (scene, bubbles, text) => page(FEED, `
  <div class="scene" style="height:690px">${SC[scene](1080)}${bubbles}</div>
  <div class="txt" style="top:715px;bottom:56px">${text}</div>`);

const items = [];
const add = (id, size, html) => items.push({ id, size, html });

add('L3R1-madrugada', FEED, feed('noite',
  `<div class="bubble" style="left:560px;top:60px">Mãe, cadê minha chupeta?! 😭</div>`, `
  <div class="h" style="font-size:58px">3 da manhã. Ele chora pela chupeta… <span class="hl-red">e você devolve.</span></div>
  <div class="body" style="margin-top:14px">Cada vez que a chupeta volta, o hábito fica mais forte, <b>e a mordida continua sob pressão.</b></div>
  <div style="margin-top:auto">${mech('Em vez de tirar escondido, a criança <b>se despede da chupeta</b> e entende que ela foi embora.')}</div>
  ${foot()}`));

add('L3R2-escovacao', FEED, feed('escova',
  `<div class="bubble" style="left:70px;top:40px;font-size:27px">Filho, abre bem a boca… 🤔</div>`, `
  <div class="h" style="font-size:58px">A chupeta usada por muito tempo pode <span class="hl-red">mexer na mordida.</span></div>
  <div class="body" style="margin-top:12px">Mordida aberta, dentes da frente empurrados, fala atrapalhada. Odontopediatras recomendam começar a retirada <b>por volta dos 3 anos.</b></div>
  <div class="small">Informação geral. Em caso de dúvidas, converse com o odontopediatra do seu filho.</div>
  <div style="margin-top:auto">${mech('Quanto antes, melhor. E sem guerra: <b>a criança vive a despedida junto com você.</b>')}</div>
  ${foot()}`));

add('L3R3-esconder', FEED, feed('gaveta',
  `<div class="bubble" style="left:640px;top:70px">Cadê minha chupeta? 🥺</div>`, `
  <div class="h" style="font-size:62px">Esconder a chupeta <span class="hl-red">não é despedida.</span></div>
  <div class="body" style="margin-top:12px">A criança procura, chora, e na primeira noite difícil a chupeta volta. <b>Ela precisa entender que a chupeta foi embora.</b></div>
  <div style="margin-top:auto">${mech('Historinhas, um dia escolhido junto e um ritual de tchau: <b>a criança participa da decisão.</b>')}</div>
  ${foot('Veja como funciona →')}`));

add('L3R4-ritual', FEED, feed('ritual',
  `<div class="bubble" style="left:470px;top:470px">Tchau, chupeta! 👋</div>`, `
  <div class="h" style="font-size:60px">Ele não perdeu a chupeta. <span class="hl">Ele se despediu dela.</span></div>
  <div class="body" style="margin-top:12px">Com o Ritual da Despedida, a criança escolhe o dia, vive o tchau e entende a mudança. <b>Quanto antes, melhor para os dentinhos.</b></div>
  <div style="margin-top:auto"></div>
  ${foot('Comece a despedida →')}`));

add('L3R5-historinha', FEED, feed('leitura',
  `<div class="bubble" style="left:200px;top:70px;font-size:26px">Era uma vez a Chupi…</div>`, `
  <div class="h" style="font-size:60px">Tudo começa com uma <span class="hl">historinha antes de dormir.</span></div>
  <div class="body" style="margin-top:12px"><b>5 historinhas ilustradas</b>, calendário de 7 dias, bilhetes mágicos e certificado. Seu filho entende, participa e se despede.</div>
  <div style="margin-top:auto">${mech('A preparação faz a diferença: <b>a criança chega no dia do tchau sabendo o que vai acontecer.</b>')}</div>
  ${foot('Quero o Tchau Chupeta →')}`));

// Quadrinho antes x depois
const panel = (scene, cap, capColor, w, h, vb) => `<div class="panel" style="width:${w}px;height:${h}px">${svg(w, SC[scene](0).replace(/^<svg[^>]*>|<\/svg>$/g, ''), vb)}<div class="cap" style="color:${capColor}">${cap}</div></div>`;
add('L3R6-quadrinho', FEED, page(FEED, `
  <div class="txt" style="top:60px;bottom:56px">
    <div class="h" style="font-size:66px">Arrancar <span style="color:#C9553F">x</span> <span class="hl">Despedir</span></div>
    <div class="row" style="gap:16px;margin-top:24px">
      ${panel('noite', '✕ Tira e devolve', '#C9553F', 462, 330, '0 0 1000 700')}
      ${panel('gaveta', '✕ Esconde', '#C9553F', 462, 330, '0 0 1000 700')}
    </div>
    <div class="row" style="gap:16px;margin-top:16px">
      ${panel('leitura', '✓ Prepara', C.mintDeep, 462, 330, '0 0 1000 700')}
      ${panel('ritual', '✓ Se despede', C.mintDeep, 462, 330, '0 0 1000 700')}
    </div>
    <div class="body" style="margin-top:20px;font-size:31px">Arrancar costuma virar briga, e a chupeta volta. <b>Despedir prepara a criança para a mudança.</b></div>
    <div style="margin-top:auto"></div>
    ${foot('Conheça o Ritual →')}
  </div>`));

// Stories
const story = (scene, bubbles, text) => page(STORY, `
  <div class="scene" style="height:756px;top:170px;border-radius:48px;left:0;right:0">${SC[scene](1080)}${bubbles}</div>
  <div class="txt" style="top:960px;bottom:340px">${text}</div>`);
add('L3RS1-madrugada-stories', STORY, story('noite',
  `<div class="bubble" style="left:560px;top:60px">Mãe, cadê minha chupeta?! 😭</div>`, `
  <div class="h" style="font-size:72px">3 da manhã. Ele chora pela chupeta… <span class="hl-red">e você devolve.</span></div>
  <div class="body" style="margin-top:16px;font-size:36px">Cada vez que ela volta, o hábito fica mais forte, <b>e a mordida continua sob pressão.</b></div>
  <div style="margin-top:auto">${mech('Em vez de tirar escondido, a criança <b>se despede da chupeta</b> e entende que ela foi embora.')}</div>${foot('Veja como funciona ↑')}`));
add('L3RS2-ritual-stories', STORY, story('ritual',
  `<div class="bubble" style="left:470px;top:470px">Tchau, chupeta! 👋</div>`, `
  <div class="h" style="font-size:74px">Ele não perdeu a chupeta. <span class="hl">Ele se despediu dela.</span></div>
  <div class="body" style="margin-top:16px;font-size:36px">O Ritual da Despedida: <b>a criança vive o tchau junto com você.</b></div>
  <div class="body" style="margin-top:16px;font-size:36px">Historinhas, um dia escolhido junto e um ritual de tchau. <b>Quanto antes, melhor para os dentinhos.</b></div>
  <div style="margin-top:auto"></div>${foot('Comece a despedida ↑')}`));

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
