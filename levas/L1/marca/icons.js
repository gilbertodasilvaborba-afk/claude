// ícones: espiga de trigo, cubo de açúcar, garrafa de leite, coração
const wheat=(c='#4a2c17')=>`<g fill="${c}"><path d="M0 -60 C-9 -50 -9 -38 0 -30 C9 -38 9 -50 0 -60Z"/>${[-22,-6,10,26].map(y=>`<path transform="translate(0 ${y})" d="M-3 0 C-20 -4 -26 -18 -24 -30 C-12 -28 -4 -18 -3 0Z"/><path transform="translate(0 ${y})" d="M3 0 C20 -4 26 -18 24 -30 C12 -28 4 -18 3 0Z"/>`).join('')}<rect x="-2.5" y="-10" width="5" height="95" rx="2"/></g>`;
const heart=(c='#b98a4a',s=1)=>`<path transform="scale(${s})" fill="${c}" d="M0 14 C-26 -6 -20 -26 -8 -26 C-3 -26 0 -22 0 -18 C0 -22 3 -26 8 -26 C20 -26 26 -6 0 14Z"/>`;
const nope=(inner,col='#4a2c17')=>`<svg viewBox="-60 -60 120 120"><circle r="52" fill="none" stroke="${col}" stroke-width="5"/><g transform="scale(.62)">${inner}</g><line x1="-37" y1="-37" x2="37" y2="37" stroke="${col}" stroke-width="5" stroke-linecap="round"/></svg>`;
const iGluten=nope(wheat('#4a2c17'));
const iSugar=nope(`<g fill="none" stroke="#4a2c17" stroke-width="6" stroke-linejoin="round"><path d="M-30 -10 L0 -26 L30 -10 L30 24 L0 40 L-30 24Z"/><path d="M-30 -10 L0 6 L30 -10M0 6 L0 40"/></g>`);
const iMilk=nope(`<g fill="none" stroke="#4a2c17" stroke-width="6" stroke-linejoin="round"><path d="M-12 -40 H12 V-24 C26 -14 26 -4 26 4 V36 H-26 V4 C-26 -4 -26 -14 -12 -24Z"/><path d="M-26 8 H26"/></g>`);
