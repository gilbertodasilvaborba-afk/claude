// Cenas de colorir (viewBox 600x600) e atividades geradas.
import { S, INK, bubble, shell, starfish, fish, crown, seaweed, coral, octopus, turtle, seahorse, dolphin, chest, key, pearl, castle, mermaid, waves, sand, moon, sparkle, svg } from './art.mjs';

const bubbles = (pts) => pts.map(([x, y, r]) => bubble(x, y, r)).join('');

export const NOMES = { marina: 'Marina', perola: 'Pérola', coralia: 'Corália', estrela: 'Estrela' };

export const colorir = [
  ['Marina e a concha mágica', () => mermaid(300, 250, 1.0, 'long') + shell(120, 470, 0.8, -8) + shell(490, 500, 0.6, 10) + bubbles([[130, 120, 22], [90, 180, 14], [500, 140, 24], [470, 90, 12]]) + sand(550)],
  ['A coroa da Pérola', () => mermaid(300, 260, 1.0, 'bun') + crown(300, 60, 0.7) + sparkle(100, 120, 1.2) + sparkle(510, 160, 1) + sparkle(470, 40, 0.7) + bubbles([[110, 400, 20], [500, 420, 26]]) + sand(560)],
  ['O castelo no fundo do mar', () => castle(300, 360, 1.1) + seaweed(70, 590, 0.9) + seaweed(540, 590, 0.9, true) + bubbles([[120, 100, 20], [480, 90, 26], [530, 190, 14]]) + sand(570)],
  ['Cavalo-marinho dançarino', () => seahorse(300, 280, 1.4) + bubbles([[110, 160, 20], [500, 200, 24], [470, 120, 12]]) + starfish(110, 500, 0.7) + sand(560)],
  ['Corália e os peixinhos', () => mermaid(210, 270, 0.95, 'braid') + fish(470, 150, 0.7, 0, true) + fish(450, 330, 0.55, -8, true) + fish(500, 480, 0.5, 0, true) + bubbles([[360, 80, 18], [400, 200, 12]]) + sand(560)],
  ['Estrela e a tartaruga', () => mermaid(220, 230, 0.9, 'curly') + turtle(420, 440, 1.1) + bubbles([[100, 470, 16], [520, 120, 22]]) + sand(560)],
  ['O baú do tesouro', () => chest(300, 420, 1.6) + pearl(90, 520, 20) + pearl(130, 540, 14) + shell(500, 520, 0.6) + bubbles([[120, 140, 22], [480, 110, 26], [430, 190, 12]]) + sand(575)],
  ['A grande estrela-do-mar', () => starfish(300, 300, 3) + bubbles([[90, 110, 20], [510, 100, 26], [90, 500, 16]])],
  ['Golfinho saltitante', () => dolphin(300, 250, 1.7) + waves(470, 600, 6) + waves(520, 600, 6) + sparkle(110, 100, 1) + sparkle(500, 90, 1.2) + bubbles([[120, 380, 16]])],
  ['A carruagem de concha', () => shell(300, 330, 3) + dolphin(120, 450, 0.45) + sparkle(100, 130, 1.1) + sparkle(500, 120, 1.2) + pearl(300, 90, 22) + sand(570)],
  ['Jardim de algas e corais', () => coral(160, 580, 1.3) + coral(470, 580, 1.1) + seaweed(300, 590, 1.2) + fish(300, 130, 0.5, 0, false) + bubbles([[420, 220, 20], [120, 180, 14], [470, 110, 24]])],
  ['O polvo fofinho', () => octopus(300, 290, 1.7) + bubbles([[90, 120, 22], [510, 130, 18]]) + sand(570)],
  ['Joias do reino', () => crown(300, 150, 1.1) + pearl(110, 330, 28) + pearl(300, 360, 32) + pearl(490, 330, 28) + shell(160, 520, 0.7) + shell(440, 520, 0.7) + starfish(300, 520, 0.6)],
  ['O baile das sereias', () => mermaid(110, 280, 0.62, 'long', -6) + mermaid(240, 260, 0.62, 'bun', 4) + mermaid(370, 280, 0.62, 'braid', -4) + mermaid(500, 260, 0.62, 'curly', 6) + sparkle(300, 60, 1.2) + sparkle(80, 80, 0.8) + sparkle(530, 90, 0.9) + sand(570)],
  ['Noite no reino encantado', () => moon(470, 110, 1.4) + castle(220, 400, 0.8) + sparkle(90, 90, 1) + sparkle(330, 60, 0.8) + sparkle(560, 260, 0.7) + sparkle(380, 200, 1) + waves(520, 600, 6) + fish(480, 470, 0.4, 0, true)],
];

// ---------- atividades geradas ----------
function rng(seed) { let a = seed; return () => (a = (a * 1664525 + 1013904223) % 4294967296) / 4294967296; }

export function labirinto() {
  const N = 9, C = 56, ox = 48, oy = 70, rand = rng(7);
  const walls = [];
  const vis = Array.from({ length: N }, () => Array(N).fill(false));
  const open = new Set();
  const key2 = (a, b, c, d) => `${a},${b}-${c},${d}`;
  const st = [[0, 0]]; vis[0][0] = true;
  while (st.length) {
    const [x, y] = st[st.length - 1];
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && !vis[b][a]);
    if (!nb.length) { st.pop(); continue; }
    const [nx, ny] = nb[Math.floor(rand() * nb.length)];
    vis[ny][nx] = true; open.add(key2(x, y, nx, ny)); open.add(key2(nx, ny, x, y)); st.push([nx, ny]);
  }
  let d = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (y === 0 || !open.has(key2(x, y, x, y - 1))) d += `M${ox + x * C} ${oy + y * C}h${C}`;
    if (x === 0 && y !== 0 || (x > 0 && !open.has(key2(x, y, x - 1, y)))) d += `M${ox + x * C} ${oy + y * C}v${C}`;
    if (y === N - 1 && x !== N - 1) d += `M${ox + x * C} ${oy + (y + 1) * C}h${C}`;
    if (x === N - 1) d += `M${ox + (x + 1) * C} ${oy + y * C}v${C}`;
  }
  return svg(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    mermaid(ox - 4, oy - 6, 0.13, 'long') + chest(ox + N * C - 10, oy + N * C + 36, 0.28) +
    `<text x="${ox}" y="40" font-family="Baloo 2" font-weight="800" font-size="22" fill="${INK}">Início</text><text x="${ox + N * C - 78}" y="${oy + N * C + 78}" font-family="Baloo 2" font-weight="800" font-size="22" fill="${INK}">Tesouro</text>`, '0 0 600 680');
}

export function cacaPalavras() {
  const palavras = ['CONCHA', 'PEROLA', 'CORAL', 'ONDA', 'SEREIA', 'MARE'];
  const N = 10, rand = rng(11), grid = Array.from({ length: N }, () => Array(N).fill(''));
  const spots = [[0, 0, 1, 0], [1, 2, 1, 0], [2, 4, 1, 0], [6, 6, 1, 0], [9, 0, 0, 1], [0, 8, 1, 0]];
  const pos = [[1, 1, 1, 0], [2, 3, 1, 0], [0, 5, 1, 0], [5, 7, 1, 0], [9, 2, 0, 1], [3, 9, 1, 0]];
  palavras.forEach((w, i) => {
    let [x, y, dx, dy] = pos[i];
    if (i === 4) { x = 9; y = 1; }          // SEREIA desce pela última coluna
    if (i === 3) { x = 5; y = 7; }
    [...w].forEach((ch, k) => { grid[y + dy * k][x + dx * k] = ch; });
  });
  const letras = 'ABCDEFGHIJLMNOPQRSTUV';
  const cells = grid.map((row, y) => row.map((c, x) => {
    const ch = c || letras[Math.floor(rand() * letras.length)];
    return `<text x="${40 + x * 52}" y="${100 + y * 52}" text-anchor="middle" font-family="Baloo 2" font-weight="700" font-size="30" fill="${INK}">${ch}</text>`;
  }).join('')).join('');
  return { svg: svg(`<rect x="14" y="52" width="544" height="544" rx="18" ${S()}/>${cells}`, '0 0 572 610'), palavras };
}

export function contar() {
  const bloco = (fn, n, x, y) => Array.from({ length: n }, (_, i) => fn(x + (i % 4) * 52, y + Math.floor(i / 4) * 58)).join('');
  const linha = (y, nome, n, fn) =>
    `<rect x="20" y="${y}" width="560" height="120" rx="16" ${S()}/>${bloco(fn, n, 70, y + 36)}` +
    `<text x="300" y="${y + 74}" font-family="Baloo 2" font-weight="800" font-size="21" fill="${INK}">Quantas ${nome}?</text><rect x="400" y="${y + 84}" width="140" height="0" />` +
    `<line x1="300" y1="${y + 106}" x2="540" y2="${y + 106}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  return svg(
    linha(10, 'conchas', 5, (x, y) => shell(x, y, 0.28)) +
    linha(150, 'estrelas-do-mar', 7, (x, y) => starfish(x, y, 0.26)) +
    linha(290, 'peixinhos', 4, (x, y) => fish(x, y, 0.26)) +
    linha(430, 'pérolas', 6, (x, y) => pearl(x, y, 14)), '0 0 600 570');
}

export function ligarPontos() {
  // contorno de uma coroa, 22 pontos
  const P = [[110, 470], [90, 250], [190, 340], [300, 150], [410, 340], [510, 250], [490, 470], [440, 480], [390, 470], [340, 480], [300, 470], [260, 480], [210, 470], [160, 480]];
  const dots = P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${INK}"/><text x="${x + (x < 300 ? -18 : 12)}" y="${y - 12}" font-family="Baloo 2" font-weight="800" font-size="22" fill="${INK}">${i + 1}</text>`).join('');
  return svg(dots + sparkle(120, 110, 1) + sparkle(490, 100, 1.2) + pearl(300, 90, 18) + bubble(520, 520, 20) + bubble(80, 540, 14), '0 0 600 600');
}

export function simetria() {
  const half = `<path d="M300 520 L170 400 Q150 330 190 270 Q230 200 300 190" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M300 520 L250 260 M300 520 L200 330 M300 520 L225 410" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  const grid = Array.from({ length: 13 }, (_, i) => `<line x1="${60 + i * 40}" y1="130" x2="${60 + i * 40}" y2="570" stroke="#CFC8EA" stroke-width="1.5"/>`).join('') +
    Array.from({ length: 12 }, (_, i) => `<line x1="60" y1="${130 + i * 40}" x2="540" y2="${130 + i * 40}" stroke="#CFC8EA" stroke-width="1.5"/>`).join('');
  return svg(grid + `<line x1="300" y1="110" x2="300" y2="590" stroke="${INK}" stroke-width="3" stroke-dasharray="10 9"/>` + half, '0 0 600 620');
}

export function mapa() {
  const ilha = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${S()}/>`;
  return svg(`<path d="M0 0 H600 V600 H0Z" fill="none"/>` + waves(70, 600, 6) + ilha(150, 200, 110, 70) + ilha(450, 230, 100, 60) + ilha(300, 450, 130, 70) +
    castle(450, 215, 0.3) + shell(150, 195, 0.5) + chest(300, 450, 0.45) + seaweed(110, 250, 0.35) + seaweed(520, 280, 0.3, true) + octopus(80, 480, 0.4) + turtle(520, 500, 0.45, true) + fish(260, 120, 0.3) + dolphin(110, 360, 0.3) +
    `<path d="M150 200 C240 260 340 240 450 230 C520 330 420 400 300 450" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>` + sparkle(540, 120, 0.8) + starfish(430, 560, 0.35) + waves(555, 600, 6), '0 0 600 600');
}
