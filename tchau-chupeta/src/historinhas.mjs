// Entregável: livro de historinhas "Tchau Chupeta" em PDF (A5 retrato).
// Uso: node src/historinhas.mjs → entregavel/tchau-chupeta-historinhas.pdf
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, cloud, familyHug, childWaving } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'entregavel');
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

// ---------------------------------------------------------------- ilustrações extras
const bear = (size = 260, withPaci = true) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200">
  <circle cx="58" cy="44" r="22" fill="#B98563"/><circle cx="142" cy="44" r="22" fill="#B98563"/>
  <circle cx="58" cy="44" r="11" fill="#E8C3A4"/><circle cx="142" cy="44" r="11" fill="#E8C3A4"/>
  <ellipse cx="100" cy="160" rx="62" ry="40" fill="#B98563"/>
  <circle cx="100" cy="88" r="58" fill="#C99673"/>
  <ellipse cx="100" cy="108" rx="28" ry="22" fill="#E8C3A4"/>
  <ellipse cx="100" cy="98" rx="10" ry="7" fill="${C.ink}"/>
  <path d="M78 78 Q84 72 90 78 M110 78 Q116 72 122 78" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M90 116 Q100 124 110 116" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="70" cy="100" r="8" fill="${C.peachDeep}" opacity=".4"/><circle cx="130" cy="100" r="8" fill="${C.peachDeep}" opacity=".4"/>
  <circle cx="52" cy="150" r="16" fill="#C99673"/><circle cx="148" cy="150" r="16" fill="#C99673"/>
  ${withPaci ? `<g transform="translate(118 120) scale(.28)"><circle cx="100" cy="212" r="38" fill="none" stroke="${C.lavenderDeep}" stroke-width="14"/><rect x="88" y="150" width="24" height="34" rx="10" fill="${C.lavenderDeep}"/><path d="M22 110 C22 58 62 46 100 62 C138 46 178 58 178 110 C178 152 140 166 100 154 C60 166 22 152 22 110 Z" fill="${C.peach}"/></g>` : ''}
</svg>`;

const miniPaci = (x, y, s, color, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <path d="M100 0 L100 40" stroke="${C.peachDeep}" stroke-width="10"/>
  <circle cx="100" cy="80" r="34" fill="none" stroke="${C.lavenderDeep}" stroke-width="12"/>
  <path d="M22 170 C22 118 62 106 100 122 C138 106 178 118 178 170 C178 212 140 226 100 214 C60 226 22 212 22 170 Z" fill="${color}"/></g>`;
const tree = (size = 360) => `<svg width="${size}" height="${size}" viewBox="0 0 300 300">
  <rect x="136" y="170" width="30" height="120" rx="12" fill="#A77B5A"/>
  <circle cx="150" cy="110" r="95" fill="${C.mint}"/><circle cx="80" cy="140" r="55" fill="${C.mint}"/><circle cx="220" cy="140" r="55" fill="${C.mint}"/>
  <circle cx="120" cy="80" r="30" fill="#fff" opacity=".25"/>
  ${miniPaci(60, 110, .22, C.peach, -8)}${miniPaci(120, 70, .22, C.sun, 6)}${miniPaci(190, 100, .22, C.lavender, -4)}
  ${miniPaci(100, 150, .22, '#9FD3F2', 5)}${miniPaci(215, 160, .22, C.peach, -6)}${miniPaci(160, 150, .2, '#F7A8C8', 3)}
</svg>`;

const fairy = (size = 260) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200">
  <ellipse cx="62" cy="96" rx="40" ry="26" fill="#DCEBFF" opacity=".9" transform="rotate(-25 62 96)"/>
  <ellipse cx="138" cy="96" rx="40" ry="26" fill="#DCEBFF" opacity=".9" transform="rotate(25 138 96)"/>
  <path d="M70 180 C74 130 86 112 100 112 C114 112 126 130 130 180Z" fill="${C.lavender}"/>
  <circle cx="100" cy="78" r="32" fill="${C.skin}"/>
  <path d="M66 74 C62 36 138 34 134 74 C124 58 110 54 100 60 C90 54 76 58 66 74Z" fill="#E7A94F"/>
  <path d="M88 82 Q92 78 96 82 M104 82 Q108 78 112 82" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M92 94 Q100 100 108 94" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="92" r="5" fill="${C.peachDeep}" opacity=".4"/><circle cx="120" cy="92" r="5" fill="${C.peachDeep}" opacity=".4"/>
  <path d="M100 38 L94 26 L100 30 L106 26Z" fill="${C.sun}"/>
  <path d="M128 132 L166 70" stroke="${C.lavenderDeep}" stroke-width="5" stroke-linecap="round"/>
  <path d="M166 50 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1z" fill="${C.sun}"/>
</svg>`;

const box = (size = 200, open = false) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200">
  <rect x="30" y="90" width="140" height="90" rx="12" fill="${C.peach}"/>
  <rect x="92" y="90" width="16" height="90" fill="${C.sun}"/>
  ${open ? `<rect x="22" y="40" width="156" height="34" rx="10" fill="${C.peachDeep}" transform="rotate(-14 30 74)"/>`
    : `<rect x="22" y="66" width="156" height="34" rx="10" fill="${C.peachDeep}"/><rect x="92" y="66" width="16" height="34" fill="${C.sun}"/>
       <path d="M100 66 C80 40 60 50 72 64 Z M100 66 C120 40 140 50 128 64 Z" fill="${C.sun}"/>`}
</svg>`;

const calendar = (done = 7, size = 360) => `<svg width="${size}" height="${size * 0.7}" viewBox="0 0 360 250">
  <rect x="10" y="20" width="340" height="220" rx="24" fill="#fff" stroke="${C.lavender}" stroke-width="6"/>
  <rect x="10" y="20" width="340" height="50" rx="24" fill="${C.lavenderDeep}"/><rect x="10" y="50" width="340" height="20" fill="${C.lavenderDeep}"/>
  ${Array.from({ length: 7 }, (_, i) => {
    const x = 30 + (i % 4) * 80, y = 88 + Math.floor(i / 4) * 74;
    return `<rect x="${x}" y="${y}" width="64" height="60" rx="12" fill="${i < done ? [C.peach, C.sun, C.mint, C.lavender, C.peach, C.sun, C.sun][i] : '#F3EFFA'}"/>
      <text x="${x + 32}" y="${y + 42}" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="30" fill="${C.ink}">${i + 1}</text>`;
  }).join('')}
  ${done >= 7 ? `<g transform="translate(270 150)">${`<path d="M40 0 l12 26 28 3 -21 19 6 28 -25 -14 -25 14 6 -28 -21 -19 28 -3z" fill="${C.sun}" stroke="#fff" stroke-width="4"/>`}</g>` : ''}
</svg>`;

const girl = (size = 300) => childWaving({ size }).replace(/fill="#6B4332"/g, 'fill="#3F2A22"')
  .replace('<path d="M56 82', '<circle cx="50" cy="60" r="18" fill="#3F2A22"/><circle cx="142" cy="60" r="18" fill="#3F2A22"/><path d="M56 82');

const scatter = (items) => items.map(([x, y, s]) => `<div class="a" style="left:${x}%;top:${y}%">${s}</div>`).join('');
const nightStars = scatter([[6, 8, star(22)], [22, 26, sparkle(16)], [40, 4, sparkle(14)], [60, 52, star(16)], [88, 30, sparkle(18)], [12, 44, sparkle(14)], [78, 50, star(14)], [50, 36, sparkle(12)]]);

// ---------------------------------------------------------------- conteúdo
const stories = [
  {
    title: 'A Chupi vai morar na Lua', theme: 'night', kid: 'Theo',
    cover: `${nightStars}<div class="a" style="right:10%;top:10%">${moon(150)}</div><div class="a" style="left:32%;top:38%">${pacifier({ size: 190, wave: true })}</div>`,
    pages: [
      { art: `<div class="a" style="left:12%;bottom:4%">${childWaving({ size: 190 })}</div><div class="a" style="left:52%;top:26%">${pacifier({ size: 150 })}</div>${scatter([[80, 14, heart(30)], [70, 60, sparkle(20)]])}`, bg: 'cream',
        text: 'O Theo tinha uma amiga muito especial: a <b>Chupi</b>, uma chupeta cor de pêssego que estava com ele desde que ele era bebezinho. Quando o Theo tinha sono, a Chupi estava lá. Quando o Theo se machucava, a Chupi estava lá também.' },
      { art: `${nightStars}<div class="a" style="left:8%;top:12%">${moon(170)}</div><div class="a" style="right:10%;bottom:10%">${pacifier({ size: 140 })}</div>`, bg: 'night',
        text: 'Uma noite, a Lua espiou pela janela e sussurrou:<br>— Chupi, lá no céu nasceram umas <b>estrelinhas bebês</b>. Elas estão com dificuldade para dormir… Você poderia vir me ajudar?' },
      { art: `<div class="a" style="left:10%;bottom:4%">${childWaving({ size: 180 })}</div><div class="a" style="left:55%;top:18%">${pacifier({ size: 160, wave: true })}</div>`, bg: 'lav',
        text: 'A Chupi olhou para o Theo.<br>— Theo, você cresceu tanto! Agora você já sabe dormir abraçadinho no travesseiro, ouvindo historinhas. Será que eu posso ir ajudar as estrelinhas?<br>O Theo pensou, pensou… e disse:<br>— Pode, Chupi. Mas antes a gente vai se <b>despedir direitinho</b>.' },
      { art: `<div class="a" style="left:6%;bottom:4%">${familyHug({ size: 250 })}</div><div class="a" style="right:8%;bottom:10%">${box(130)}</div>${scatter([[70, 10, heart(26)], [86, 22, sparkle(18)]])}`, bg: 'peach',
        text: 'O Theo escolheu o dia do tchau junto com a mamãe. Eles fizeram um desenho para a Chupi levar, deram um abraço bem apertado e colocaram a Chupi numa caixinha perto da janela.<br>— <b>Tchau, Chupi!</b> Cuida bem das estrelinhas!' },
      { art: `${nightStars}<div class="a" style="right:10%;top:10%">${moon(140)}</div><div class="a" style="left:14%;top:30%;transform:rotate(-12deg)">${pacifier({ size: 110, wave: true })}</div><div class="a" style="left:34%;top:18%">${star(40)}</div>`, bg: 'night',
        text: 'No dia seguinte, no lugar da caixinha, havia um bilhete brilhante: <i>“Obrigada, Theo! As estrelinhas dormiram felizes. Sempre que você olhar para o céu, eu vou estar brilhando para você.”</i><br>Às vezes o Theo ainda sentia saudade… e tudo bem. Ele olhava para a Lua e dizia: — <b>Boa noite, Chupi!</b>' },
    ],
    tip: 'Na noite do tchau, deixe junto da janela o <b>Bilhete da Chupi</b> (modelo no final do livro) e, se quiser, um adesivo de estrelinha para o quarto.',
  },
  {
    title: 'A Fada Pipoca', theme: 'lav', kid: 'Lara',
    cover: `${scatter([[10, 12, sparkle(24)], [80, 18, star(24)], [20, 60, sparkle(18)], [84, 64, sparkle(20)]])}<div class="a" style="left:30%;top:26%">${fairy(230)}</div>`,
    pages: [
      { art: `${scatter([[10, 20, sparkle(22)], [30, 10, sparkle(16)], [80, 14, star(20)], [60, 70, sparkle(16)]])}<div class="a" style="left:30%;top:10%">${fairy(220)}</div>`, bg: 'lav',
        text: 'Você sabia que existe uma fada que cuida das chupetas das crianças que estão crescendo? O nome dela é <b>Fada Pipoca</b>. Ela voa bem baixinho, deixando um rastro de estrelinhas por onde passa.' },
      { art: `${nightStars}<div class="a" style="left:10%;top:16%">${fairy(160)}</div><div class="a" style="right:6%;bottom:6%">${cloud(230, '#fff', .9)}</div><div class="a" style="right:18%;bottom:24%">${star(46)}</div>`, bg: 'night',
        text: 'A Fada Pipoca tem uma missão mágica: ela leva as chupetas para o <b>Reino das Nuvens</b>, onde elas viram estrelinhas que cuidam do sono dos bebezinhos. Mas ela só leva as chupetas das crianças que decidem dar tchau.' },
      { art: `<div class="a" style="left:10%;bottom:4%">${girl(180)}</div><div class="a" style="left:48%;bottom:4%">${familyHug({ size: 220 })}</div>`, bg: 'cream',
        text: 'A Lara ouviu essa história e ficou pensando.<br>— Mamãe, eu já sou grande?<br>— Você está crescendo muito! E pode escolher o dia em que vai ajudar a Fada Pipoca.<br>A Lara pensou um pouquinho e decidiu:<br>— <b>No sábado!</b>' },
      { art: `<div class="a" style="left:12%;bottom:4%">${girl(180)}</div><div class="a" style="right:10%;bottom:8%">${box(140)}</div>${scatter([[60, 14, pacifier({ size: 60 })], [74, 24, pacifier({ size: 50, color: C.sun })], [86, 12, sparkle(20)]])}`, bg: 'peach',
        text: 'No sábado à noite, a Lara colocou as chupetas num saquinho, junto com um desenho para a fada. Ela deu um beijinho em cada uma:<br>— Obrigada por tudo. <b>Agora vocês vão virar estrelinhas!</b>' },
      { art: `<div class="a" style="left:10%;top:10%">${box(150, true)}</div><div class="a" style="right:12%;top:16%">${fairy(150)}</div>${scatter([[40, 8, sparkle(22)], [52, 30, star(26)], [30, 60, sparkle(16)]])}`, bg: 'lav',
        text: 'De manhã, o saquinho tinha sumido. No lugar, havia um presentinho e uma cartinha com pó de estrelas: <i>“Lara, você foi muito corajosa. Obrigada por ajudar os bebês! Com carinho, Fada Pipoca.”</i><br>À noite, a Lara procurou no céu uma estrela nova… <b>e achou!</b>' },
    ],
    tip: 'Deixe no lugar das chupetas a <b>Cartinha da Fada Pipoca</b> (modelo no final do livro) e uma lembrancinha simples, como um livro ou um bichinho para abraçar na hora de dormir.',
  },
  {
    title: 'Bento, o ursinho corajoso', theme: 'mint', kid: 'Bento',
    cover: `<div class="a" style="left:28%;top:22%">${bear(240)}</div>${scatter([[12, 14, heart(30)], [82, 20, star(26)], [80, 70, sparkle(20)]])}`,
    pages: [
      { art: `<div class="a" style="left:30%;top:10%">${bear(220)}</div>${scatter([[12, 20, sparkle(20)], [80, 16, star(22)]])}`, bg: 'mint',
        text: 'O Bento era um ursinho marrom e fofinho que também usava chupeta. Usava de manhã, de tarde e de noite. Um dia, o Bento percebeu que, com a chupeta na boca, ficava difícil contar suas histórias e <b>dar risada bem alto</b>.' },
      { art: `<div class="a" style="left:14%;top:14%">${bear(200)}</div><div class="a" style="left:52%;top:8%">${bear(240, false)}</div>${scatter([[45, 12, heart(30)]])}`, bg: 'cream',
        text: '— Mamãe Ursa, eu queria dar tchau para a minha chupeta. Mas eu fico com um pouquinho de medo.<br>A Mamãe Ursa abraçou o Bento:<br>— Sentir medo é normal, filho. A gente vai fazer isso <b>juntinho, um passinho de cada vez</b>.' },
      { art: `<div class="a" style="left:10%;top:16%">${bear(190, false)}</div><div class="a" style="right:10%;top:30%">${box(150)}</div>${scatter([[56, 16, sparkle(20)]])}`, bg: 'peach',
        text: 'Primeiro, a chupeta ficou só para a hora de dormir. Durante o dia, ela descansava numa caixinha. O Bento brincava, corria e, quando sentia vontade da chupeta, ia pedir um <b>abraço</b> para a mamãe.' },
      { art: `<div class="a" style="left:30%;top:14%">${bear(210)}</div>
        <svg class="a" style="left:8%;top:8%" width="80" height="170" viewBox="0 0 80 170"><ellipse cx="40" cy="40" rx="30" ry="36" fill="${C.peach}"/><path d="M40 76 Q30 120 44 168" stroke="${C.inkSoft}" stroke-width="2" fill="none"/></svg>
        <svg class="a" style="right:10%;top:12%" width="80" height="170" viewBox="0 0 80 170"><ellipse cx="40" cy="40" rx="30" ry="36" fill="${C.sun}"/><path d="M40 76 Q50 120 36 168" stroke="${C.inkSoft}" stroke-width="2" fill="none"/></svg>`, bg: 'lav',
        text: 'Depois, o Bento fez uma <b>festa de despedida</b>! Teve bolo de mel, balão e música. Ele segurou a chupeta e disse:<br>— Obrigado por me ajudar quando eu era bebê. <b>Tchau, chupeta!</b>' },
      { art: `${nightStars}<div class="a" style="left:28%;top:18%">${bear(210, false)}</div><div class="a" style="right:8%;top:8%">${moon(110)}</div>`, bg: 'night',
        text: 'Naquela noite, o Bento ficou um pouquinho chorosinho. A Mamãe Ursa ficou pertinho, cantou uma música e fez carinho. O Bento abraçou seu paninho de estrelas e, devagarinho, dormiu. E sabe de uma coisa? <b>A cada noite, foi ficando um pouquinho mais fácil.</b>' },
    ],
    tip: 'Esta história é ótima para crianças que sentem medo da mudança. Fale sobre sentimentos: “Está tudo bem sentir saudade. Eu estou aqui com você.”',
  },
  {
    title: 'A árvore das chupetas', theme: 'mint', kid: 'Davi',
    cover: `<div class="a" style="left:22%;top:12%">${tree(300)}</div>`,
    pages: [
      { art: `<div class="a" style="left:24%;top:4%">${tree(270)}</div>${scatter([[8, 20, cloud(90, '#fff', .9)], [76, 10, cloud(80, '#fff', .9)]])}`, bg: 'mint',
        text: 'Lá longe, num país bem frio, existe um parque com uma árvore diferente de todas: em vez de frutas, os galhos dela têm <b>chupetas coloridas</b>, penduradas com fitinhas e cartinhas!' },
      { art: `<div class="a" style="left:6%;top:6%">${tree(220)}</div><div class="a" style="right:6%;top:18%">${pacifier({ size: 120, wave: true })}</div>`, bg: 'cream',
        text: 'Cada chupeta pendurada ali é de uma criança que cresceu e resolveu dar tchau. A árvore guarda todas com muito carinho, e elas balançam ao vento, <b>fazendo tchauzinho</b> para quem passa.' },
      { art: `<div class="a" style="left:8%;bottom:4%">${childWaving({ size: 180 })}</div><div class="a" style="right:8%;top:12%">${tree(200)}</div>`, bg: 'peach',
        text: 'O Davi achou isso incrível.<br>— Papai, eu também quero pendurar a minha chupeta numa árvore!<br>Então o Davi e o papai escolheram juntos <b>uma plantinha</b> para ser a árvore das chupetas da família.' },
      { art: `<div class="a" style="left:10%;top:12%">${tree(200)}</div><div class="a card-note">Querida chupeta, obrigado por me acompanhar. Agora eu vou dormir abraçado no meu dinossauro. Com amor, Davi</div>`, bg: 'lav',
        text: 'O Davi fez uma cartinha com a ajuda do papai. Depois, eles amarraram a chupeta e a cartinha com uma <b>fita vermelha</b>, bem bonita. O Davi deu um beijo na chupeta e disse: — Tchau, chupeta. Obrigado!' },
      { art: `<div class="a" style="left:10%;bottom:4%">${childWaving({ size: 180 })}</div><div class="a" style="right:10%;top:10%">${tree(210)}</div>${scatter([[50, 12, heart(28)]])}`, bg: 'mint',
        text: 'Agora, toda vez que passa pela plantinha, o Davi dá um tchauzinho:<br>— Oi, chupeta! Olha como eu estou crescendo!<br>E a plantinha vai <b>crescendo junto com ele</b>.' },
    ],
    tip: 'A “árvore das chupetas” existe de verdade em alguns parques pelo mundo. Em casa, pode ser um vaso, uma planta da varanda ou até um galho decorado. O importante é a criança participar do ritual.',
  },
  {
    title: 'Os 7 dias da Nina', theme: 'peach', kid: 'Nina',
    cover: `<div class="a" style="left:18%;top:18%">${calendar(7, 300)}</div>${scatter([[10, 10, star(24)], [84, 12, sparkle(20)]])}`,
    pages: [
      { art: `<div class="a" style="left:6%;bottom:4%">${girl(170)}</div><div class="a" style="right:6%;top:14%">${calendar(0, 230)}</div>`, bg: 'peach',
        text: 'A Nina e a mamãe fizeram um combinado: em <b>sete dias</b>, a chupeta da Nina ia sair de férias para sempre. Elas desenharam juntas um calendário com sete quadradinhos.' },
      { art: `<div class="a" style="left:18%;top:10%">${calendar(3, 280)}</div>`, bg: 'cream',
        text: 'A cada dia, a Nina pintava um quadradinho e fazia uma coisinha nova.<br><b>Dia 1:</b> contar o plano para o vovô.<br><b>Dia 2:</b> escolher um bichinho para abraçar de noite.<br><b>Dia 3:</b> a chupeta fica em casa quando a Nina sai para passear.' },
      { art: `<div class="a" style="left:18%;top:10%">${calendar(6, 280)}</div>`, bg: 'lav',
        text: '<b>Dia 4:</b> a chupeta só aparece na hora de dormir.<br><b>Dia 5:</b> fazer um desenho de despedida.<br><b>Dia 6:</b> escolher a caixinha onde a chupeta vai guardar suas lembranças.<br><b>Dia 7:</b> o grande dia do tchau!' },
      { art: `<div class="a" style="left:8%;bottom:4%">${girl(170)}</div><div class="a" style="right:10%;top:20%">${box(150)}</div>${scatter([[56, 12, star(30)]])}`, bg: 'peach',
        text: 'No sétimo dia, a Nina pintou o último quadradinho de amarelo, a cor mais feliz que ela conhecia. Colocou a chupeta na caixinha, deu um beijo e fechou a tampa.<br>— <b>Tchau, chupeta. Boas férias!</b>' },
      { art: `<div class="a" style="left:22%;bottom:4%">${familyHug({ size: 270 })}</div>${scatter([[10, 12, heart(30)], [82, 16, heart(24)], [70, 8, sparkle(18)]])}`, bg: 'cream',
        text: 'A mamãe deu o abraço mais apertado do mundo.<br>— Estou muito orgulhosa de você!<br>E a Nina, se sentindo gigante, foi dormir abraçada na coelhinha Lulu. <b>Missão cumprida!</b>' },
    ],
    tip: 'Use o <b>Meu calendário do tchau</b> (no final do livro) para viver os 7 dias com seu filho. Ajuste as tarefas ao ritmo da criança: se precisar, cada etapa pode durar mais de um dia.',
  },
];

// ---------------------------------------------------------------- páginas
const BG = { cream: C.cream, lav: '#EEE8FF', peach: '#FFEDE4', mint: '#E6F6EF', night: `linear-gradient(180deg, ${C.nightDeep}, ${C.night} 70%, #5B4F9C)` };
const page = (inner, cls = '', style = '') => `<section class="page ${cls}" style="${style}">${inner}</section>`;
let pageNo = 0;
const num = () => `<div class="num">${++pageNo}</div>`;

const coverPage = page(`
  ${nightStars}${scatter([[70, 64, star(20)], [8, 70, sparkle(18)], [90, 80, sparkle(14)]])}
  <div class="a" style="right:8%;top:5%">${moon(130)}</div>
  <div class="center" style="top:16%">
    <div class="kicker" style="color:${C.lavender}">Historinhas para dar</div>
    <div class="h" style="font-size:52pt;line-height:.9;color:#fff;margin-top:4mm">TCHAU<br><span style="color:${C.sun}">CHUPETA</span></div>
    <div style="font-size:12.5pt;font-weight:700;color:#fff;opacity:.9;margin-top:5mm;line-height:1.4">5 histórias para ler com seu filho<br>+ 1 história para personalizar</div>
  </div>
  <div class="a" style="left:12%;bottom:6%">${childWaving({ size: 190 })}</div>
  <div class="a" style="right:12%;bottom:22%;transform:rotate(-10deg)">${pacifier({ size: 150, wave: true })}</div>
`, 'night-bg');

const parentsPage = () => page(`
  <div class="pad">
    <div class="kicker">Para os pais</div>
    <div class="h" style="font-size:22pt;margin-top:2mm">Como usar as historinhas</div>
    <p class="lead">Não é só tirar a chupeta. <b>É ensinar a criança a se despedir dela.</b> As histórias ajudam seu filho a entender que uma mudança está chegando e a participar desse momento.</p>
    <ul class="tips">
      <li><b>Comece antes do dia do tchau.</b> Leia por alguns dias seguidos, para a ideia ficar conhecida e gostosa.</li>
      <li><b>Escolha a história que combina com seu filho:</b> a Lua, a fada, o ursinho, a árvore ou o calendário. Pode ler todas e deixar a criança escolher a favorita.</li>
      <li><b>Troque o nome do personagem</b> pelo nome da criança, se quiser.</li>
      <li><b>Deixe a criança participar:</b> escolher o dia, fazer o desenho, decorar a caixinha.</li>
      <li><b>Combine com todos da casa</b> a mesma história, para ninguém contar uma versão diferente.</li>
      <li><b>Acolha a saudade.</b> É comum a criança pedir a chupeta ou chorar nos primeiros dias. Abrace, nomeie o sentimento e relembre a história.</li>
      <li><b>Nunca use a história como ameaça ou castigo.</b> Ela é um convite, não uma bronca.</li>
    </ul>
    <div class="note">Cada criança tem seu próprio ritmo. Se tiver dúvidas sobre a saúde ou o desenvolvimento do seu filho, converse com o pediatra.</div>
  </div>
  <div class="a" style="right:6%;top:4%">${pacifier({ size: 70, wave: true })}</div>
  ${num()}`, '', `background:${C.cream}`);

const summaryPage = () => page(`
  <div class="pad">
    <div class="h" style="font-size:24pt">Sumário</div>
    <ol class="toc">
      ${stories.map((s, i) => `<li><span class="dot" style="background:${[C.peach, C.lavender, C.mint, C.sun, C.peachDeep][i]}">${i + 1}</span>${s.title}</li>`).join('')}
      <li><span class="dot" style="background:${C.lavenderDeep};color:#fff">6</span>A minha história de tchau</li>
    </ol>
    <div class="h" style="font-size:15pt;margin-top:8mm">Para imprimir e brincar</div>
    <ul class="tips" style="margin-top:3mm">
      <li>Meu calendário do tchau</li><li>Bilhete da Chupi e Cartinha da Fada Pipoca</li><li>Cartinha para a chupeta</li><li>Desenho da despedida</li><li>Certificado de despedida da chupeta</li>
    </ul>
  </div>
  <div class="a" style="right:8%;bottom:8%">${childWaving({ size: 150 })}</div>
  ${num()}`, '', `background:#EEE8FF`);

const storyPages = (s, i) => {
  const bgCover = s.theme === 'night' ? BG.night : BG[s.theme];
  const out = [page(`
    ${s.cover}
    <div class="center" style="bottom:12%;top:auto">
      <div class="kicker" style="${s.theme === 'night' ? `color:${C.lavender}` : ''}">História ${i + 1}</div>
      <div class="h" style="font-size:26pt;margin-top:2mm;${s.theme === 'night' ? 'color:#fff' : ''}">${s.title}</div>
    </div>${num()}`, s.theme === 'night' ? 'night-bg' : '', `background:${bgCover}`)];
  s.pages.forEach((p) => {
    const dark = p.bg === 'night';
    out.push(page(`
      <div class="art" style="background:${BG[p.bg]}">${p.art}</div>
      <div class="text"><div>${p.text}</div></div>${num()}`));
  });
  out.push(page(`
    <div class="pad" style="display:flex;flex-direction:column;justify-content:center;height:100%">
      <div class="h" style="font-size:40pt;text-align:center;color:${C.peachDeep}">Fim!</div>
      <div style="text-align:center;margin-top:4mm">${heart(40)}</div>
      <div class="tipbox"><div class="kicker">Dica para os pais</div><div style="margin-top:2mm">${s.tip}</div></div>
      <div class="tipbox" style="background:#fff;border-color:${C.lavender}"><div class="kicker">Converse com seu filho</div>
        <div style="margin-top:2mm">O que você mais gostou nessa história? Como você acha que o(a) ${s.kid} se sentiu no dia do tchau? Como você gostaria que fosse o seu?</div></div>
    </div>${num()}`, '', `background:${C.cream}`));
  return out.join('');
};

const blank = (w = 40) => `<span class="blank" style="min-width:${w}mm"></span>`;
const personalPages = () => [
  page(`${scatter([[10, 12, star(24)], [84, 10, sparkle(20)], [80, 60, heart(26)]])}
    <div class="a" style="left:26%;top:18%">${pacifier({ size: 200, wave: true })}</div>
    <div class="center" style="bottom:12%;top:auto"><div class="kicker">História 6</div>
    <div class="h" style="font-size:26pt;margin-top:2mm">A minha história de tchau</div>
    <div style="font-size:11pt;font-weight:700;color:${C.inkSoft};margin-top:3mm">Complete com seu filho e leia juntos</div></div>${num()}`, '', `background:#EEE8FF`),
  page(`<div class="pad fill">
    <p>Era uma vez ${blank(45)}, uma criança de ${blank(12)} anos, que tinha uma chupeta muito especial. A cor dela era ${blank(30)}.</p>
    <p>A chupeta acompanhou ${blank(35)} desde bebê: na hora de dormir, nos passeios e quando dava vontade de um carinho.</p>
    <p>Mas ${blank(35)} cresceu! Agora já sabe ${blank(55)} e ${blank(55)}.</p>
    <p>Então, junto com ${blank(45)}, decidiu que era hora de dar tchau para a chupeta.</p>
    <div class="drawbox" style="height:55mm">Desenhe você com a sua chupeta</div>
  </div>${num()}`, '', `background:${C.cream}`),
  page(`<div class="pad fill">
    <p>O dia do tchau foi ${blank(50)}.</p>
    <p>A chupeta foi ${blank(40)} <span class="hint">(morar na Lua, com a Fada Pipoca, para a árvore, de férias…)</span></p>
    <p>Na hora da despedida, ${blank(35)} disse: “${blank(70)}”.</p>
    <p>Agora, para dormir, ${blank(35)} abraça ${blank(45)}.</p>
    <p>E todo mundo ficou muito orgulhoso, porque ${blank(35)} foi <b>muito corajoso(a)!</b></p>
    <div class="h" style="font-size:22pt;text-align:center;color:${C.peachDeep};margin-top:6mm">Fim!</div>
  </div>${num()}`, '', `background:${C.cream}`),
].join('');

const cut = (inner, style = '') => `<div class="cut" style="${style}">${inner}</div>`;
const extrasPages = () => [
  page(`<div class="pad">
    <div class="kicker">Para imprimir</div><div class="h" style="font-size:22pt;margin-top:1mm">Meu calendário do tchau</div>
    <p class="lead" style="margin-top:2mm">Pinte um quadradinho por dia. Cada criança tem seu ritmo: se precisar, repita um dia antes de passar para o próximo.</p>
    <div class="cal">${['Contar o plano para alguém da família', 'Escolher um bichinho para abraçar de noite', 'A chupeta fica em casa nos passeios', 'Chupeta só na hora de dormir', 'Fazer um desenho de despedida', 'Escolher e decorar a caixinha', 'O grande dia do tchau!']
      .map((t, i) => `<div class="day"><div class="dn" style="background:${[C.peach, C.sun, C.mint, C.lavender, C.peach, C.sun, C.peachDeep][i]}">${i + 1}</div><div>${t}</div></div>`).join('')}</div>
  </div>${num()}`, '', `background:${C.cream}`),
  page(`<div class="pad">
    <div class="kicker">Para imprimir e recortar</div><div class="h" style="font-size:20pt;margin-top:1mm">Bilhetes mágicos</div>
    ${cut(`<div class="row">${moon(46)}<b>Bilhete da Chupi</b></div><p>Obrigada, ${blank(35)}! As estrelinhas dormiram felizes. Sempre que você olhar para o céu, eu vou estar brilhando para você. Você é muito corajoso(a)!</p><div class="sign">Com carinho, Chupi ⭐</div>`, `background:#EEE8FF`)}
    ${cut(`<div class="row">${sparkle(34)}<b>Cartinha da Fada Pipoca</b></div><p>Querido(a) ${blank(35)}, obrigada por me entregar a sua chupeta! Ela já virou uma estrelinha que cuida do sono dos bebês. Deixei este presentinho para você.</p><div class="sign">Com pó de estrelas, Fada Pipoca ✨</div>`, `background:#FFEDE4`)}
  </div>${num()}`, '', `background:${C.cream}`),
  page(`<div class="pad fill">
    <div class="kicker">Para escrever junto</div><div class="h" style="font-size:20pt;margin-top:1mm">Cartinha para a minha chupeta</div>
    <p style="margin-top:4mm">Querida chupeta,</p>
    <p>obrigado(a) por ${blank(80)}</p>
    <p>Eu vou sentir saudade de ${blank(70)}</p>
    <p>Agora eu já sei ${blank(80)}</p>
    <p>Tchau, chupeta! Com amor, ${blank(45)}</p>
    <div class="drawbox" style="height:62mm">Faça um desenho para a sua chupeta</div>
  </div>${num()}`, '', `background:${C.cream}`),
  page(`<div class="pad">
    <div class="kicker">Para desenhar</div><div class="h" style="font-size:20pt;margin-top:1mm">Como foi a minha despedida</div>
    <div class="drawbox" style="height:140mm;margin-top:5mm">Desenhe aqui o dia do seu tchau</div>
  </div>${num()}`, '', `background:${C.cream}`),
  page(`<div class="cert">
    ${scatter([[6, 6, star(26)], [86, 6, star(26)], [6, 88, sparkle(22)], [88, 88, sparkle(22)]])}
    <div class="kicker">Certificado de</div>
    <div class="h" style="font-size:26pt;line-height:1;margin-top:2mm">Despedida da Chupeta</div>
    <div style="margin:5mm auto 0;width:max-content">${pacifier({ size: 110, wave: true })}</div>
    <p>Certificamos que</p>
    <div class="line"></div>
    <p>se despediu da chupeta com muita coragem e carinho, no dia</p>
    <div class="line" style="width:50%"></div>
    <p style="font-weight:900;color:${C.peachDeep}">Parabéns por crescer tanto!</p>
    <div class="row sigs"><div><div class="line" style="width:100%"></div>Mamãe / Papai</div><div><div class="line" style="width:100%"></div>Chupi</div></div>
  </div>${num()}`, '', `background:#EEE8FF`),
  page(`${nightStars}<div class="a" style="right:10%;top:8%">${moon(120)}</div>
    <div class="center" style="top:30%"><div class="h" style="font-size:30pt;color:#fff">Tchau, chupeta!</div>
    <div style="font-size:13pt;color:#fff;opacity:.9;margin-top:4mm;line-height:1.5;padding:0 12mm">Obrigado por ler com seu filho.<br>Cada criança tem seu tempo, e cada passo conta. 💛</div></div>
    <div class="a" style="left:14%;bottom:6%">${childWaving({ size: 170 })}</div><div class="a" style="right:14%;bottom:24%;transform:rotate(-10deg)">${pacifier({ size: 120, wave: true })}</div>`, 'night-bg'),
].join('');

const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
@page{size:148mm 210mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Nunito',sans-serif;color:${C.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:148mm;height:210mm;position:relative;overflow:hidden;page-break-after:always;background:#fff}
.night-bg{background:${BG.night};color:#fff}
.a{position:absolute}
.h{font-family:'Baloo 2';font-weight:800;line-height:1.05}
.kicker{font-weight:900;font-size:9pt;letter-spacing:2px;text-transform:uppercase;color:${C.lavenderDeep}}
.center{position:absolute;left:0;right:0;text-align:center;padding:0 10mm}
.pad{padding:14mm 13mm}
.art{position:absolute;left:0;right:0;top:0;height:108mm;border-radius:0 0 10mm 10mm;overflow:hidden}
.art svg{display:block}
.text{position:absolute;left:0;right:0;top:114mm;bottom:14mm;padding:0 12mm;font-size:14.5pt;line-height:1.5;font-weight:600;display:flex;flex-direction:column;justify-content:center}
.text b{font-weight:900;color:${C.lavenderDeep}}
.num{position:absolute;bottom:6mm;left:0;right:0;text-align:center;font-weight:800;font-size:9pt;color:${C.inkSoft}}
.night-bg .num{color:#fff;opacity:.7}
.lead{font-size:11pt;line-height:1.45;font-weight:600;margin-top:4mm;color:${C.inkSoft}}
.lead b{color:${C.ink}}
.tips{margin-top:4mm;padding-left:5mm;font-size:10.2pt;line-height:1.42;font-weight:600}
.tips li{margin-bottom:2.2mm}
.note{margin-top:4mm;background:#fff;border-radius:4mm;padding:3.5mm 4.5mm;font-size:9.5pt;font-weight:700;color:${C.inkSoft};border-left:3mm solid ${C.sun}}
.toc{list-style:none;margin-top:6mm}
.toc li{display:flex;align-items:center;gap:4mm;font-family:'Baloo 2';font-weight:700;font-size:15pt;margin-bottom:3.5mm}
.dot{width:10mm;height:10mm;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;padding-top:1mm}
.tipbox{margin-top:7mm;background:#FFF1C9;border:1mm solid ${C.sun};border-radius:5mm;padding:4mm 5mm;font-size:10.5pt;line-height:1.45;font-weight:600}
.card-note{right:6%;top:18%;width:48%;background:#fff;border-radius:3mm;padding:4mm;font-size:9.5pt;font-weight:700;line-height:1.4;transform:rotate(3deg);box-shadow:0 2mm 0 rgba(58,53,99,.08)}
.fill p{font-size:12.5pt;line-height:2.1;font-weight:600;margin-bottom:2mm}
.blank{display:inline-block;border-bottom:.5mm dashed ${C.lavenderDeep};height:6mm;vertical-align:bottom}
.hint{font-size:9pt;color:${C.inkSoft}}
.drawbox{border:.7mm dashed ${C.lavender};border-radius:5mm;display:flex;align-items:flex-end;justify-content:center;padding-bottom:3mm;font-size:9pt;font-weight:800;color:${C.inkSoft};background:#fff}
.cal{margin-top:5mm;display:flex;flex-direction:column;gap:3mm}
.day{display:flex;align-items:center;gap:4mm;background:#fff;border:.6mm solid #EEE8FF;border-radius:4mm;padding:3mm 4mm;font-size:11pt;font-weight:700}
.dn{flex:none;width:11mm;height:11mm;border-radius:3mm;display:flex;align-items:center;justify-content:center;font-family:'Baloo 2';font-weight:800;font-size:14pt;padding-top:1mm}
.cut{margin-top:6mm;border:.7mm dashed ${C.inkSoft};border-radius:4mm;padding:5mm;font-size:11pt;line-height:1.55;font-weight:600}
.cut .row{display:flex;align-items:center;gap:3mm;font-family:'Baloo 2';font-size:14pt;margin-bottom:2mm}
.cut .sign{text-align:right;font-weight:800;margin-top:2mm;color:${C.lavenderDeep}}
.cert{position:absolute;inset:8mm;border:1.2mm solid ${C.lavenderDeep};border-radius:6mm;background:#fff;text-align:center;padding:12mm 10mm}
.cert p{font-size:11pt;font-weight:700;margin-top:4mm;line-height:1.4}
.cert .line{border-bottom:.5mm solid ${C.ink};width:80%;margin:7mm auto 0;height:1mm}
.cert .sigs{display:flex;gap:8mm;margin-top:12mm;font-size:9pt;font-weight:800;color:${C.inkSoft}}
.cert .sigs>div{flex:1}
`;

const htmlDoc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Tchau Chupeta — Historinhas</title><style>${CSS}</style></head><body>
${coverPage}${parentsPage()}${summaryPage()}${stories.map(storyPages).join('')}${personalPages()}${extrasPages()}
</body></html>`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(ROOT, 'html', 'historinhas.html'), htmlDoc);
const browser = await chromium.launch();
const pg = await browser.newPage();
await pg.setContent(htmlDoc);
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: join(OUT, 'tchau-chupeta-historinhas.pdf'), preferCSSPageSize: true, printBackground: true });
await browser.close();
console.log('ok', pageNo + 2, 'páginas');
