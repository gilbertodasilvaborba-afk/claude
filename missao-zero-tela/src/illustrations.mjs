// Ilustrações em SVG no estilo da página de vendas: traço azul-marinho grosso,
// cores chapadas de giz de cera e sombra deslocada. Tudo vetorial.

export const C = {
  ink: '#1E2A4A',
  inkSoft: '#4A5677',
  paper: '#FFFFFF',
  line: '#DCE6F5',
  sky: '#EAF3FF',
  sun: '#FFD23F',
  sunSoft: '#FFF4C7',
  crayon: '#E5483B',
  crayonSoft: '#FFE3DF',
  leaf: '#1F9D55',
  leafDark: '#157A41',
  leafSoft: '#E3F6EB',
  blue: '#2F6FDE',
  skin: '#F6C7A1',
  skin2: '#C98B62',
  hair: '#3B2A22',
};

const S = `stroke="${C.ink}" stroke-linejoin="round" stroke-linecap="round"`;

// Logo: o "0" vermelho riscado + nome
export function logo({ size = 1, light = false } = {}) {
  const s = size;
  return `<div style="display:flex;align-items:center;gap:${12 * s}px;font-family:'Baloo 2';font-weight:800;font-size:${34 * s}px;color:${light ? '#fff' : C.ink};line-height:1">
    <span style="position:relative;display:inline-grid;place-items:center;width:${52 * s}px;height:${52 * s}px;border-radius:50%;background:${C.crayon};color:#fff;font-size:${28 * s}px;flex:none">0
      <span style="position:absolute;width:${62 * s}px;height:${6 * s}px;background:${light ? '#fff' : C.ink};transform:rotate(-40deg);border-radius:3px"></span></span>
    Missão Zero Tela</div>`;
}

// Artes das cartas de missão (as mesmas da página)
export const art = {
  cabana: (w = 110) => `<svg width="${w}" height="${w * 0.82}" viewBox="0 0 110 90"><path d="M10 80 L55 12 L100 80 Z" fill="${C.sun}" ${S} stroke-width="4"/><path d="M55 12 L55 80" ${S} stroke-width="3" opacity=".5"/><rect x="45" y="52" width="20" height="28" fill="${C.crayon}" ${S} stroke-width="4"/></svg>`,
  detetive: (w = 110) => `<svg width="${w}" height="${w * 0.82}" viewBox="0 0 110 90"><circle cx="55" cy="45" r="34" fill="#fff" ${S} stroke-width="4"/><circle cx="43" cy="40" r="5" fill="${C.ink}"/><circle cx="67" cy="40" r="5" fill="${C.ink}"/><path d="M40 56 Q55 70 70 56" fill="none" stroke="${C.crayon}" stroke-width="5" stroke-linecap="round"/></svg>`,
  cidade: (w = 150) => `<svg width="${w}" height="${w * 0.67}" viewBox="0 0 150 100"><path d="M8 92 H142" ${S} stroke-width="4"/><path d="M18 92 V52 L40 32 L62 52 V92" fill="#fff" ${S} stroke-width="4"/><rect x="33" y="68" width="14" height="24" fill="${C.sun}" ${S} stroke-width="3"/><path d="M78 92 V44 L104 20 L130 44 V92" fill="#fff" ${S} stroke-width="4"/><rect x="92" y="54" width="10" height="10" fill="${C.blue}"/><rect x="108" y="54" width="10" height="10" fill="${C.blue}"/><rect x="97" y="70" width="14" height="22" fill="${C.crayon}" ${S} stroke-width="3"/></svg>`,
  foguete: (w = 110) => `<svg width="${w}" height="${w * 0.82}" viewBox="0 0 110 90"><path d="M55 6 C74 20 78 44 72 66 H38 C32 44 36 20 55 6Z" fill="#fff" ${S} stroke-width="4"/><circle cx="55" cy="34" r="9" fill="${C.blue}" ${S} stroke-width="3"/><path d="M38 52 L24 70 L38 66Z M72 52 L86 70 L72 66Z" fill="${C.crayon}" ${S} stroke-width="3"/><path d="M46 70 Q55 90 64 70" fill="${C.sun}" ${S} stroke-width="3"/></svg>`,
  caixa: (w = 110) => `<svg width="${w}" height="${w * 0.82}" viewBox="0 0 110 90"><path d="M16 34 L55 20 L94 34 L94 74 L55 86 L16 74Z" fill="#E7B77B" ${S} stroke-width="4"/><path d="M16 34 L55 46 L94 34 M55 46 V86" fill="none" ${S} stroke-width="4"/><path d="M16 34 L4 20 L44 8 L55 20" fill="#F2CF9B" ${S} stroke-width="4"/><circle cx="36" cy="60" r="6" fill="${C.ink}"/><circle cx="74" cy="60" r="6" fill="${C.ink}"/></svg>`,
  lua: (w = 110) => `<svg width="${w}" height="${w * 0.82}" viewBox="0 0 110 90"><path d="M66 12 A34 34 0 1 0 92 62 A28 28 0 1 1 66 12Z" fill="${C.sun}" ${S} stroke-width="4"/><circle cx="24" cy="20" r="4" fill="${C.ink}"/><circle cx="90" cy="18" r="3" fill="${C.ink}"/></svg>`,
};

// Carta de missão (igual às da página, em escala)
export function missionCard({ num, emoji, title, tags = [], artSvg, bg = C.sky, w = 340, rot = 0, x, y, z = 1 }) {
  const pos = x !== undefined ? `position:absolute;left:${x}px;top:${y}px;z-index:${z};` : '';
  return `<div style="${pos}width:${w}px;transform:rotate(${rot}deg);background:#fff;color:${C.ink};border:4px solid ${C.ink};border-radius:26px;padding:${w * 0.06}px;box-shadow:8px 10px 0 rgba(30,42,74,.18)">
    <div style="display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:${w * 0.055}px">
      <span style="background:${C.ink};color:#fff;border-radius:999px;padding:3px 14px">Missão ${num}</span><span style="font-size:${w * 0.08}px">${emoji}</span></div>
    <div style="height:${w * 0.45}px;border-radius:16px;margin:${w * 0.045}px 0;display:grid;place-items:center;background:${bg}">${artSvg}</div>
    <div style="font-family:'Baloo 2';font-weight:800;font-size:${w * 0.085}px;line-height:1.05">${title}</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:${w * 0.03}px">${tags.map((t) => `<span style="background:${C.sky};border:2px solid ${C.line};border-radius:999px;padding:2px 12px;font-weight:800;font-size:${w * 0.048}px;color:${C.inkSoft}">${t}</span>`).join('')}</div>
  </div>`;
}

// Selo redondo "100 missões"
export function sticker({ size = 170, top = '100', bottom = 'missões', bg = C.crayon } = {}) {
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:4px solid ${C.ink};display:grid;place-items:center;color:#fff;transform:rotate(-10deg);box-shadow:6px 8px 0 rgba(30,42,74,.18);text-align:center">
    <div><div style="font-family:'Baloo 2';font-weight:800;font-size:${size * 0.36}px;line-height:.9">${top}</div><div style="font-weight:900;font-size:${size * 0.13}px">${bottom}</div></div></div>`;
}

// Carimbo "Missão cumprida"
export function stamp({ text = 'MISSÃO CUMPRIDA', size = 1, rot = -12, color = C.leaf } = {}) {
  return `<div style="display:inline-block;transform:rotate(${rot}deg);border:${6 * size}px solid ${color};color:${color};border-radius:${14 * size}px;padding:${8 * size}px ${20 * size}px;font-family:'Baloo 2';font-weight:800;font-size:${34 * size}px;letter-spacing:2px;opacity:.9">${text} ✓</div>`;
}

// Tablet com "play" e um X de giz por cima (desligado)
export function tablet({ size = 260, off = false } = {}) {
  return `<svg width="${size}" height="${size * 0.78}" viewBox="0 0 200 156">
    <rect x="8" y="8" width="184" height="140" rx="18" fill="${C.ink}" ${S} stroke-width="4"/>
    <rect x="22" y="22" width="156" height="112" rx="8" fill="${off ? '#2B3A63' : C.blue}"/>
    ${off ? '' : `<path d="M88 58 L120 78 L88 98Z" fill="#fff"/>`}
    ${off ? `<path d="M40 36 L160 120 M160 36 L40 120" stroke="${C.crayon}" stroke-width="12" stroke-linecap="round"/>` : ''}
  </svg>`;
}

// Criança com capa e máscara de agente (a heroína da missão)
export function heroKid({ size = 300, cape = C.crayon, shirt = C.sun, skin = C.skin } = {}) {
  return `<svg width="${size}" height="${size * 1.25}" viewBox="0 0 200 250">
    <path d="M62 112 Q30 190 40 236 L160 236 Q170 190 138 112Z" fill="${cape}" ${S} stroke-width="5"/>
    <path d="M70 120 Q100 108 130 120 L136 200 L64 200Z" fill="${shirt}" ${S} stroke-width="5"/>
    <path d="M90 148 L100 136 L110 148 L100 160Z" fill="${C.crayon}" ${S} stroke-width="3"/>
    <rect x="72" y="198" width="22" height="38" rx="8" fill="${C.blue}" ${S} stroke-width="5"/>
    <rect x="106" y="198" width="22" height="38" rx="8" fill="${C.blue}" ${S} stroke-width="5"/>
    <path d="M132 126 Q160 110 168 72" fill="none" ${S} stroke-width="16"/>
    <path d="M132 126 Q160 110 168 72" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="170" cy="64" r="12" fill="${skin}" ${S} stroke-width="4"/>
    <path d="M68 126 Q46 146 46 170" fill="none" ${S} stroke-width="16"/>
    <path d="M68 126 Q46 146 46 170" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="100" cy="70" r="42" fill="${skin}" ${S} stroke-width="5"/>
    <path d="M58 64 Q60 26 100 26 Q142 26 142 64 Q126 44 100 46 Q76 44 58 64Z" fill="${C.hair}" ${S} stroke-width="4"/>
    <path d="M62 66 Q100 54 138 66 L134 84 Q100 74 66 84Z" fill="${C.ink}"/>
    <circle cx="84" cy="72" r="6" fill="#fff"/><circle cx="116" cy="72" r="6" fill="#fff"/>
    <path d="M86 94 Q100 106 114 94" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="74" cy="92" r="6" fill="${C.crayon}" opacity=".35"/><circle cx="126" cy="92" r="6" fill="${C.crayon}" opacity=".35"/>
  </svg>`;
}

export function star(size = 40, color = C.sun) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 1.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.7l7.1-.6z" fill="${color}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}

// Rabisco de giz (sublinhado à mão)
export function scribble(w = 300, color = C.crayon) {
  return `<svg width="${w}" height="${w * 0.08}" viewBox="0 0 300 24" preserveAspectRatio="none"><path d="M4 16 C60 6 120 8 180 12 S270 18 296 8" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/></svg>`;
}
