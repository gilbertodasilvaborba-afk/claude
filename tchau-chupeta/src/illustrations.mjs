// Ilustrações em SVG (estilo flat infantil) usadas pelos criativos.
// Tudo vetorial para manter nitidez em qualquer tamanho.

export const C = {
  cream: '#FFF7EE',
  peach: '#FFB59E',
  peachDeep: '#F28E78',
  lavender: '#C9B8F2',
  lavenderDeep: '#8C74D6',
  night: '#3B3470',
  nightDeep: '#2A2556',
  mint: '#A9DEC9',
  mintDeep: '#5DB896',
  sun: '#FFD66B',
  ink: '#3A3563',
  inkSoft: '#6B6690',
  skin: '#F4C7A6',
  skin2: '#E9B08D',
  hair: '#6B4332',
  hair2: '#3F2A22',
  white: '#FFFFFF',
};

// Mascote "Chupi": uma chupeta simpática. mood: 'happy' | 'sad' | 'wave'
export function pacifier({ size = 200, mood = 'happy', color = C.peach, ring = C.lavenderDeep, wave = false } = {}) {
  const face =
    mood === 'sad'
      ? `<circle cx="84" cy="104" r="6" fill="${C.ink}"/><circle cx="116" cy="104" r="6" fill="${C.ink}"/>
         <path d="M88 126 Q100 118 112 126" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
         <path d="M76 94 L90 88 M124 94 L110 88" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M78 104 Q84 96 90 104" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
         <path d="M110 104 Q116 96 122 104" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
         <path d="M88 118 Q100 130 112 118" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const arm = wave
    ? `<path d="M168 104 Q186 90 190 66" stroke="${color}" stroke-width="11" fill="none" stroke-linecap="round"/>
       <circle cx="191" cy="60" r="11" fill="${color}"/>
       <path d="M204 44 q6 -6 12 0 M208 62 q8 -2 12 4" stroke="${C.sun}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : '';
  return `<svg width="${size}" height="${size * 1.15}" viewBox="0 0 230 265" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="212" r="38" fill="none" stroke="${ring}" stroke-width="14"/>
    <rect x="88" y="150" width="24" height="34" rx="10" fill="${ring}"/>
    ${arm}
    <path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${color}"/>
    <ellipse cx="62" cy="86" rx="14" ry="9" fill="#fff" opacity=".45"/>
    <circle cx="70" cy="120" r="9" fill="${C.peachDeep}" opacity=".45"/>
    <circle cx="130" cy="120" r="9" fill="${C.peachDeep}" opacity=".45"/>
    ${face}
  </svg>`;
}

export function star(size = 40, color = C.sun) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 1.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.7l7.1-.6z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
}

export function sparkle(size = 30, color = C.sun) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="${color}"/></svg>`;
}

export function heart(size = 40, color = C.peachDeep) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.2 0 3.9 1.3 5.4 3.2 1.5-1.9 3.2-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z" fill="${color}"/></svg>`;
}

export function moon(size = 160, color = C.sun) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><path d="M64 8 A44 44 0 1 0 92 70 A36 36 0 1 1 64 8Z" fill="${color}"/>
  <circle cx="40" cy="60" r="5" fill="#000" opacity=".06"/><circle cx="30" cy="40" r="3" fill="#000" opacity=".06"/></svg>`;
}

export function cloud(w = 220, color = '#fff', opacity = 1) {
  return `<svg width="${w}" height="${w * 0.5}" viewBox="0 0 200 100" opacity="${opacity}"><path d="M40 90 C10 90 8 56 34 52 C34 24 70 16 84 38 C94 14 138 14 142 46 C172 42 190 60 180 80 C176 88 168 90 160 90 Z" fill="${color}"/></svg>`;
}

// Mãe ajoelhada abraçando a criança; a criança acena com a chupeta na mão.
export function familyHug({ size = 520, parent = 'mae' } = {}) {
  const hairParent =
    parent === 'pai'
      ? `<path d="M168 92 C166 56 238 50 244 92 C236 78 190 76 168 92Z" fill="${C.hair2}"/>`
      : `<circle cx="206" cy="46" r="20" fill="${C.hair}"/>
         <path d="M162 108 C154 58 250 50 250 104 C250 132 244 150 238 160 L238 110 C224 96 196 90 170 104 L170 160 C164 150 160 128 162 108Z" fill="${C.hair}"/>`;
  return `<svg width="${size}" height="${size * 0.92}" viewBox="0 0 440 405" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="220" cy="388" rx="190" ry="16" fill="${C.ink}" opacity=".07"/>
    <!-- adulto -->
    <path d="M120 390 C112 270 140 200 206 196 C272 200 300 270 292 390Z" fill="${C.lavender}"/>
    <path d="M186 196 L206 226 L226 196" fill="${C.lavenderDeep}" opacity=".35"/>
    <rect x="194" y="160" width="24" height="40" rx="10" fill="${C.skin2}"/>
    <circle cx="206" cy="120" r="44" fill="${C.skin}"/>
    ${hairParent}
    <path d="M186 124 Q192 118 198 124 M214 124 Q220 118 226 124" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M196 140 Q206 148 216 140" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="182" cy="138" r="7" fill="${C.peachDeep}" opacity=".35"/><circle cx="230" cy="138" r="7" fill="${C.peachDeep}" opacity=".35"/>
    <!-- criança -->
    <path d="M250 392 C246 318 262 282 300 280 C338 282 352 318 348 392Z" fill="${C.mint}"/>
    <circle cx="300" cy="238" r="40" fill="${C.skin}"/>
    <path d="M262 232 C258 194 336 188 340 228 C330 214 312 208 300 216 C292 206 272 208 262 232Z" fill="${C.hair}"/>
    <path d="M284 240 Q290 234 296 240 M306 240 Q312 234 318 240" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M290 254 Q301 264 312 254" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="276" cy="254" r="6" fill="${C.peachDeep}" opacity=".4"/><circle cx="324" cy="254" r="6" fill="${C.peachDeep}" opacity=".4"/>
    <!-- braço da criança acenando, com a chupeta -->
    <path d="M336 300 Q370 280 380 236" stroke="${C.mint}" stroke-width="20" fill="none" stroke-linecap="round"/>
    <circle cx="381" cy="228" r="13" fill="${C.skin}"/>
    <g transform="translate(362 170) scale(.24)">
      <circle cx="100" cy="212" r="38" fill="none" stroke="${C.lavenderDeep}" stroke-width="14"/>
      <rect x="88" y="150" width="24" height="34" rx="10" fill="${C.lavenderDeep}"/>
      <path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${C.peach}"/>
    </g>
    <path d="M404 176 q10 -8 18 2 M408 206 q12 0 16 10" stroke="${C.sun}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- braço do adulto abraçando -->
    <path d="M150 262 C170 330 250 344 300 322" stroke="${C.lavender}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <circle cx="304" cy="320" r="15" fill="${C.skin}"/>
    <g transform="translate(96 60)">${heartPath(C.peachDeep, 1.4)}</g>
  </svg>`;
}

function heartPath(color, s = 1) {
  return `<path transform="scale(${s})" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.2 0 3.9 1.3 5.4 3.2 1.5-1.9 3.2-3.2 5.4-3.2 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z" fill="${color}"/>`;
}

// Criança sozinha, de costas para o céu, acenando para a chupeta que vai embora.
export function childWaving({ size = 300 } = {}) {
  return `<svg width="${size}" height="${size * 1.2}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="96" cy="232" rx="70" ry="8" fill="#000" opacity=".15"/>
    <path d="M54 232 C50 160 66 130 96 128 C126 130 142 160 138 232Z" fill="${C.mint}"/>
    <circle cx="96" cy="88" r="42" fill="${C.skin}"/>
    <path d="M56 82 C52 40 138 34 140 80 C128 64 108 58 96 66 C86 56 64 58 56 82Z" fill="${C.hair}"/>
    <path d="M78 92 Q84 86 90 92 M102 92 Q108 86 114 92" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M84 106 Q96 116 108 106" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="72" cy="104" r="6" fill="${C.peachDeep}" opacity=".4"/><circle cx="120" cy="104" r="6" fill="${C.peachDeep}" opacity=".4"/>
    <path d="M132 150 Q164 130 170 86" stroke="${C.mint}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <circle cx="171" cy="78" r="12" fill="${C.skin}"/>
    <path d="M182 60 q8 -6 14 2 M186 84 q9 0 12 8" stroke="${C.sun}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`;
}

export function logo({ light = false, size = 1 } = {}) {
  const ink = light ? '#fff' : C.ink;
  return `<div class="logo" style="--s:${size}">
    <span class="logo-icon">${pacifier({ size: 58 * size, mood: 'happy' })}</span>
    <span class="logo-text" style="color:${ink}">Tchau<br><b>Chupeta</b></span>
  </div>`;
}
