// Ilustrações em SVG (traço grosso, para colorir). Cada peça é desenhada em torno de (0,0).
const INK = '#2B2552';
export const S = (extra = '') => `fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" ${extra}`;
export const SK = () => S().replace('#fff', '#fffffe');
const T = (x, y, s = 1, r = 0, flip = false) => `translate(${x} ${y}) rotate(${r}) scale(${flip ? -s : s} ${s})`;
const g = (t, inner) => `<g transform="${t}">${inner}</g>`;

export const bubble = (x, y, r = 20) =>
  `<circle cx="${x}" cy="${y}" r="${r}" ${S()}/><path d="M${x - r * 0.5} ${y - r * 0.1} A${r * 0.55} ${r * 0.55} 0 0 1 ${x - r * 0.1} ${y - r * 0.5}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;

export const shell = (x = 0, y = 0, s = 1, r = 0) => g(T(x, y, s, r), `
  <path d="M-62 38 Q-78 -34 0 -62 Q78 -34 62 38 Q0 70 -62 38Z" ${S()}/>
  <path d="M0 50 L-40 -42 M0 50 L-14 -56 M0 50 L14 -56 M0 50 L40 -42 M0 50 L-58 8 M0 50 L58 8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <rect x="-18" y="52" width="36" height="16" rx="8" ${S()}/>`);

export const starfish = (x = 0, y = 0, s = 1, r = 0) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 ? 30 : 74;
    pts.push(`${(Math.cos(a) * rad).toFixed(1)},${(Math.sin(a) * rad).toFixed(1)}`);
  }
  const dots = [[0, -38], [36, -12], [22, 30], [-22, 30], [-36, -12]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4.5" fill="${INK}"/>`).join('');
  return g(T(x, y, s, r), `<polygon points="${pts.join(' ')}" ${S('stroke-width="6"')}/>${dots}<circle cx="-9" cy="-4" r="4" fill="${INK}"/><circle cx="9" cy="-4" r="4" fill="${INK}"/><path d="M-8 8 Q0 15 8 8" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`);
};

export const fish = (x = 0, y = 0, s = 1, r = 0, flip = false) => g(T(x, y, s, r, flip), `
  <path d="M-70 0 L-108 -30 Q-96 0 -108 30Z" ${S()}/>
  <path d="M-70 0 Q-30 -62 40 -34 Q86 -10 84 8 Q70 40 20 40 Q-34 44 -70 0Z" ${S()}/>
  <path d="M-10 -44 Q10 -80 38 -38" ${S()}/>
  <path d="M-8 -30 Q-18 4 -6 34 M18 -32 Q8 4 20 38" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="52" cy="-8" r="6" fill="${INK}"/><path d="M62 14 Q72 18 78 10" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`);

export const crown = (x = 0, y = 0, s = 1, r = 0) => g(T(x, y, s, r), `
  <path d="M-70 30 L-82 -48 L-38 -6 L0 -60 L38 -6 L82 -48 L70 30Z" ${S()}/>
  <rect x="-72" y="30" width="144" height="22" rx="8" ${S()}/>
  <circle cx="-82" cy="-52" r="9" ${S()}/><circle cx="0" cy="-66" r="10" ${S()}/><circle cx="82" cy="-52" r="9" ${S()}/>
  <circle cx="-36" cy="41" r="5" fill="${INK}"/><circle cx="0" cy="41" r="5" fill="${INK}"/><circle cx="36" cy="41" r="5" fill="${INK}"/>
  <path d="M-48 14 L-30 -4 L-12 14 M12 14 L30 -4 L48 14" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`);

export const seaweed = (x = 0, y = 0, s = 1, flip = false) => g(T(x, y, s, 0, flip), `
  <path d="M0 0 C-44 -60 40 -110 -6 -180 C-2 -230 30 -250 14 -290 C60 -240 20 -200 38 -170 C70 -110 4 -70 34 0Z" ${S()}/>
  <path d="M10 -20 C-8 -60 22 -90 8 -130" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`);

export const coral = (x = 0, y = 0, s = 1) => g(T(x, y, s), `
  <path d="M-12 0 L-14 -70 Q-48 -90 -52 -140 Q-30 -120 -16 -100 Q-24 -150 -8 -190 Q4 -150 2 -100 Q22 -130 52 -140 Q46 -86 14 -70 L14 0Z" ${S()}/>
  <circle cx="-8" cy="-190" r="8" ${S()}/><circle cx="-52" cy="-142" r="8" ${S()}/><circle cx="52" cy="-142" r="8" ${S()}/>`);

export const octopus = (x = 0, y = 0, s = 1) => g(T(x, y, s), `
  <path d="M-80 20 Q-110 70 -76 98 Q-96 56 -62 52 M-46 40 Q-68 98 -34 112 Q-52 70 -24 62 M0 46 Q-6 104 24 112 Q8 78 18 56 M46 40 Q72 98 40 112 Q56 70 28 62 M80 20 Q112 70 78 98 Q98 56 62 52" ${S('stroke-width="6"')}/>
  <path d="M-88 30 Q-96 -90 0 -96 Q96 -90 88 30 Q70 56 0 56 Q-70 56 -88 30Z" ${S()}/>
  <circle cx="-30" cy="-22" r="9" fill="${INK}"/><circle cx="30" cy="-22" r="9" fill="${INK}"/>
  <path d="M-16 8 Q0 24 16 8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="-52" cy="-2" r="8" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="52" cy="-2" r="8" fill="none" stroke="${INK}" stroke-width="3"/>`);

export const turtle = (x = 0, y = 0, s = 1, flip = false) => g(T(x, y, s, 0, flip), `
  <ellipse cx="-62" cy="46" rx="26" ry="14" transform="rotate(30 -62 46)" ${S()}/><ellipse cx="46" cy="52" rx="26" ry="14" transform="rotate(-20 46 52)" ${S()}/>
  <path d="M70 -4 Q112 -30 118 2 Q112 30 76 22Z" ${S()}/><circle cx="102" cy="-4" r="5" fill="${INK}"/><path d="M96 12 Q106 16 112 8" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M-94 30 Q-96 -64 0 -66 Q96 -64 90 30 Q0 54 -94 30Z" ${S()}/>
  <path d="M-30 -62 L-48 -14 L-18 22 L24 22 L48 -14 L30 -62Z M-48 -14 L-84 -2 M-18 22 L-30 44 M24 22 L30 44 M48 -14 L82 -2" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`);

export const seahorse = (x = 0, y = 0, s = 1, flip = false) => g(T(x, y, s, 0, flip), `
  <path d="M10 -130 Q70 -150 66 -100 Q62 -80 40 -76 L30 -66 Q70 -30 40 40 Q20 90 -10 110 Q-50 120 -50 86 Q-48 66 -24 70 Q-30 90 -14 88 Q8 70 10 30 Q-30 -4 -20 -50 Q-14 -76 10 -86Z" ${S()}/>
  <path d="M40 -122 L100 -118 Q104 -108 96 -104 L56 -96" ${S()}/>
  <path d="M-22 -56 L-52 -66 L-34 -40 L-56 -26 L-26 -22" ${S()}/>
  <path d="M-4 -4 Q16 8 12 28 M-6 -38 Q18 -30 18 -14" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="44" cy="-110" r="5" fill="${INK}"/><path d="M0 -128 L-8 -156 L8 -142 L16 -164 L22 -134" ${S()}/>`);

export const dolphin = (x = 0, y = 0, s = 1, flip = false) => g(T(x, y, s, 0, flip), `
  <path d="M-110 -40 Q-70 -50 -62 -20 Q-90 -4 -126 -20Z" ${S()}/>
  <path d="M-70 -10 Q-20 -90 50 -62 Q86 -44 124 -44 Q130 -36 116 -28 Q80 -10 70 22 Q20 70 -50 34 Q-62 20 -70 -10Z" ${S()}/>
  <path d="M-8 -66 Q4 -112 32 -66" ${S()}/>
  <path d="M10 28 Q6 66 -20 70 Q-4 44 -10 26Z" ${S()}/>
  <circle cx="66" cy="-36" r="5" fill="${INK}"/><path d="M80 -20 Q94 -14 108 -26" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`);

export const chest = (x = 0, y = 0, s = 1) => g(T(x, y, s), `
  <rect x="-90" y="-10" width="180" height="90" rx="10" ${S()}/>
  <path d="M-90 -10 Q-90 -80 0 -80 Q90 -80 90 -10Z" ${S()}/>
  <path d="M-40 -78 L-40 80 M40 -78 L40 80" fill="none" stroke="${INK}" stroke-width="4"/>
  <rect x="-16" y="-14" width="32" height="38" rx="7" ${S()}/><circle cx="0" cy="2" r="5" fill="${INK}"/>
  <circle cx="-62" cy="-100" r="13" ${S()}/><circle cx="-34" cy="-92" r="9" ${S()}/><circle cx="58" cy="-96" r="12" ${S()}/>
  <path d="M-6 -98 L6 -118 L18 -98 L6 -86Z" ${S()}/>`);

export const key = (x = 0, y = 0, s = 1, r = 0) => g(T(x, y, s, r), `
  <circle cx="-50" cy="0" r="26" ${S()}/><circle cx="-50" cy="0" r="9" ${S()}/>
  <path d="M-24 -7 H76 V7 H-24Z M50 7 V32 H64 V7 M28 7 V24 H40 V7" ${S()}/>`);

export const pearl = (x, y, r = 18) => `<circle cx="${x}" cy="${y}" r="${r}" ${S()}/><path d="M${x - r * 0.55} ${y - r * 0.15} A${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.15} ${y - r * 0.55}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;

export const castle = (x = 0, y = 0, s = 1) => g(T(x, y, s), `
  <rect x="-60" y="-110" width="120" height="190" ${S()}/>
  <rect x="-170" y="-40" width="74" height="120" ${S()}/><rect x="96" y="-40" width="74" height="120" ${S()}/>
  <path d="M-182 -40 L-133 -140 L-84 -40Z M84 -40 L133 -140 L182 -40Z M-72 -110 L0 -230 L72 -110Z" ${S()}/>
  <path d="M0 -230 V-280 L36 -266 L0 -252" ${S()}/><path d="M-133 -140 V-176 L-106 -166 L-133 -154" ${S()}/><path d="M133 -140 V-176 L160 -166 L133 -154" ${S()}/>
  <path d="M-30 80 V28 Q0 -8 30 28 V80Z" ${S()}/>
  <path d="M-12 -70 V-100 Q0 -118 12 -100 V-70Z M-150 20 V-8 Q-133 -26 -116 -8 V20Z M116 20 V-8 Q133 -26 150 -8 V20Z" ${S()}/>
  <circle cx="0" cy="-160" r="14" ${S()}/>`);

// ---------- sereias ----------
// hair: 'long' | 'braid' | 'bun' | 'curly'
export function mermaid(x = 0, y = 0, s = 1, hair = 'long', r = 0, flip = false) {
  const hairBack = {
    long: `<path d="M-46 -150 Q-84 -100 -70 -10 Q-62 18 -40 6 L40 6 Q62 18 70 -10 Q84 -100 46 -150 Q0 -190 -46 -150Z" ${S()}/>`,
    braid: `<path d="M-42 -150 Q0 -184 42 -150 Q50 -120 46 -100 L-46 -100 Q-50 -120 -42 -150Z" ${S()}/><path d="M-44 -104 Q-64 -60 -44 -20 Q-60 -4 -50 14 Q-30 6 -28 -24 Q-40 -60 -34 -100Z M44 -104 Q64 -60 44 -20 Q60 -4 50 14 Q30 6 28 -24 Q40 -60 34 -100Z" ${S()}/>`,
    bun: `<circle cx="0" cy="-196" r="24" ${S()}/><path d="M-44 -148 Q0 -190 44 -148 Q52 -120 46 -96 L-46 -96 Q-52 -120 -44 -148Z" ${S()}/>`,
    curly: `<path d="M-70 -120 a22 22 0 0 1 22 -30 a24 24 0 0 1 48 -16 a24 24 0 0 1 48 16 a22 22 0 0 1 22 30 a22 22 0 0 1 8 36 a22 22 0 0 1 -8 36 a22 22 0 0 1 -14 34 L14 -40 L-14 -40 L-56 -14 a22 22 0 0 1 -14 -34 a22 22 0 0 1 -8 -36 a22 22 0 0 1 8 -36Z" ${S()}/>`,
  }[hair];
  const hairFront = hair === 'bun' || hair === 'braid'
    ? `<path d="M-40 -126 Q-4 -150 6 -118 Q22 -144 40 -126 Q34 -156 0 -158 Q-34 -156 -40 -126Z" ${S()}/>`
    : `<path d="M-42 -124 Q-6 -150 10 -112 Q28 -142 42 -118 Q40 -158 0 -160 Q-40 -158 -42 -124Z" ${S()}/>`;
  return g(T(x, y, s, r, flip), `
  ${hairBack}
  <path d="M-30 -60 Q-40 -10 -26 36 L26 36 Q40 -10 30 -60Z" ${SK()}/>
  <path d="M-26 36 Q-60 110 -30 170 Q-60 196 -96 180 Q-70 250 -4 226 Q-14 270 30 290 Q16 240 40 200 Q66 150 26 36Z" ${S()}/>
  <path d="M-28 150 q14 12 28 0 M-6 190 q14 12 28 0 M-34 100 q14 12 28 0 M2 110 q14 12 28 0 M-14 66 q14 12 28 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M-30 -26 Q-12 -6 0 -22 Q12 -6 30 -26 Q28 -2 0 6 Q-28 -2 -30 -26Z" ${S()}/>
  <path d="M-30 -60 Q-72 -40 -62 -6" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M30 -60 Q72 -40 62 -6" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
  <path d="M-30 -60 Q-72 -40 -62 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M30 -60 Q72 -40 62 -6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <rect x="-12" y="-82" width="24" height="26" rx="8" ${SK()}/>
  <circle cx="0" cy="-118" r="42" ${SK()}/>
  ${hairFront}
  <circle cx="-16" cy="-112" r="5" fill="${INK}"/><circle cx="16" cy="-112" r="5" fill="${INK}"/>
  <path d="M-12 -94 Q0 -82 12 -94" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="-28" cy="-98" r="6" fill="none" stroke="${INK}" stroke-width="2.5"/><circle cx="28" cy="-98" r="6" fill="none" stroke="${INK}" stroke-width="2.5"/>`);
}

// pequena coroa de princesa para por em cima da cabeça da sereia (usa coords locais)
export const tiara = (x, y, s = 0.4) => crown(x, y, s);

export const waves = (y = 60, w = 600, n = 6) => {
  const step = w / n;
  let d = `M0 ${y}`;
  for (let i = 0; i < n; i++) d += ` q${step / 4} -26 ${step / 2} 0 t${step / 2} 0`;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
};
export const sand = (y = 540, w = 600) => {
  let d = `M0 ${y}`;
  const n = 5, step = w / n;
  for (let i = 0; i < n; i++) d += ` q${step / 2} -34 ${step} 0`;
  d += ` V600 H0Z`;
  return `<path d="${d}" ${S()}/>`;
};
export const moon = (x, y, s = 1) => g(T(x, y, s), `<path d="M0 -60 A60 60 0 1 0 60 0 A44 44 0 1 1 0 -60Z" ${S()}/>`);
export const sparkle = (x, y, s = 1) => g(T(x, y, s), `<path d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26Z" ${S()}/>`);

export const svg = (inner, vb = '0 0 600 600', cls = '') => `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
export { INK };

// Colore as peças brancas com uma paleta (capa e página de vendas). "#fffffe" vira cor de pele.
export function tint(str, palette, skin = '#FFD9C2') {
  let i = 0;
  return str.replace(/fill="#fffffe"/g, `fill="${skin}"`).replace(/fill="#fff"/g, () => `fill="${palette[i++ % palette.length]}"`);
}
