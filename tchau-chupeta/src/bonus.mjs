// Bônus do Tchau Chupeta: 4 PDFs A4 para imprimir.
// Uso: node src/bonus.mjs → entregavel/bonus/*.pdf (+ capas em PNG para a página de vendas)
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier, star, sparkle, heart, moon, cloud, familyHug, childWaving } from './illustrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'entregavel', 'bonus');
const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;

// ---------------------------------------------------------------- ilustrações extras
const sun = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><g stroke="${C.sun}" stroke-width="6" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M50 50 m0 -34 v-10" transform="rotate(${a} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="24" fill="${C.sun}"/><path d="M41 50 q3 -4 6 0 M53 50 q3 -4 6 0 M43 58 q7 6 14 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
const gift = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="16" y="42" width="68" height="48" rx="6" fill="${C.peach}"/><rect x="10" y="30" width="80" height="18" rx="5" fill="${C.peachDeep}"/><rect x="45" y="30" width="10" height="60" fill="${C.lavenderDeep}"/><path d="M50 30 C36 10 22 22 34 30Z M50 30 C64 10 78 22 66 30Z" fill="${C.lavenderDeep}"/></svg>`;
const balloon = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M50 72 q-6 10 4 26" stroke="${C.inkSoft}" stroke-width="2.5" fill="none"/><ellipse cx="50" cy="38" rx="26" ry="32" fill="${C.lavender}"/><path d="M46 70 h8 l-4 6Z" fill="${C.lavender}"/><ellipse cx="40" cy="26" rx="6" ry="10" fill="#fff" opacity=".5"/></svg>`;
const rainbow = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><g fill="none" stroke-width="9" stroke-linecap="round"><path d="M12 72 A38 38 0 0 1 88 72" stroke="${C.peachDeep}"/><path d="M22 72 A28 28 0 0 1 78 72" stroke="${C.sun}"/><path d="M32 72 A18 18 0 0 1 68 72" stroke="${C.mint}"/></g><ellipse cx="16" cy="76" rx="14" ry="8" fill="#fff" stroke="${C.lavender}" stroke-width="2"/><ellipse cx="84" cy="76" rx="14" ry="8" fill="#fff" stroke="${C.lavender}" stroke-width="2"/></svg>`;
const bear = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 200 200"><circle cx="58" cy="44" r="22" fill="#B98563"/><circle cx="142" cy="44" r="22" fill="#B98563"/><circle cx="58" cy="44" r="11" fill="#E8C3A4"/><circle cx="142" cy="44" r="11" fill="#E8C3A4"/><ellipse cx="100" cy="160" rx="62" ry="40" fill="#B98563"/><circle cx="100" cy="88" r="58" fill="#C99673"/><ellipse cx="100" cy="108" rx="28" ry="22" fill="#E8C3A4"/><ellipse cx="100" cy="98" rx="10" ry="7" fill="${C.ink}"/><path d="M78 78 Q84 72 90 78 M110 78 Q116 72 122 78" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M90 116 Q100 124 110 116" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
const medal = (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M34 6 L44 40 L56 40 L66 6Z" fill="${C.lavenderDeep}"/><circle cx="50" cy="62" r="30" fill="${C.sun}"/><circle cx="50" cy="62" r="22" fill="none" stroke="#fff" stroke-width="3"/><path d="M50 48 l4 9 10 1 -7.5 7 2 10 -8.5 -5 -8.5 5 2 -10 -7.5 -7 10 -1Z" fill="#fff"/></svg>`;

// ---------------------------------------------------------------- base
const page = (inner, cls = '') => `<section class="page ${cls}">${inner}</section>`;
const cabecalho = (kicker, titulo, sub = '') => `<div class="cab"><div class="kicker">${kicker}</div><div class="h t">${titulo}</div>${sub ? `<p class="sub">${sub}</p>` : ''}</div>`;
const rodape = (txt) => `<div class="rod">Tchau Chupeta · ${txt}</div>`;

const CSS = `
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
@font-face{font-family:'Nunito';font-weight:200 1000;src:${font('Nunito-latin.woff2')}}
@page{size:210mm 297mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Nunito',sans-serif;color:${C.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:#fff;padding:16mm 16mm 18mm}
.h{font-family:'Baloo 2';font-weight:800;line-height:1.05}
.kicker{font-weight:900;font-size:10pt;letter-spacing:2px;text-transform:uppercase;color:${C.lavenderDeep}}
.cab{text-align:center}
.t{font-size:30pt;margin-top:2mm}
.sub{font-size:12pt;font-weight:600;color:${C.inkSoft};margin-top:3mm;line-height:1.45}
.rod{position:absolute;left:0;right:0;bottom:7mm;text-align:center;font-size:8.5pt;font-weight:700;color:${C.inkSoft}}
.capa{background:linear-gradient(180deg,${C.nightDeep},${C.night} 70%,#5B4F9C);color:#fff;text-align:center;padding-top:40mm}
.capa .kicker{color:${C.sun}}
.capa .t{font-size:48pt;color:#fff}
.capa .t em{font-style:normal;color:${C.sun}}
.capa .sub{color:#fff;opacity:.9;font-size:14pt}
.capa .arte{margin-top:22mm;display:flex;justify-content:center;align-items:flex-end;gap:10mm}
.capa .arte svg{transform:scale(1.6);transform-origin:bottom center;margin:0 10mm}
.capa .rod{color:#fff;opacity:.6}
.box{background:${C.cream};border-radius:6mm;padding:7mm 9mm;margin-top:9mm;font-size:12pt;line-height:1.55;font-weight:600}
.box h3{font-family:'Baloo 2';font-size:17pt;margin-bottom:2mm}
.box ol,.box ul{padding-left:6mm}
.box li{margin-bottom:2mm}
/* jogo da memória */
.cartas{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:0;height:250mm;margin-top:4mm}
.carta{border:.5mm dashed ${C.inkSoft};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm;padding:3mm}
.carta .in{width:100%;height:100%;border-radius:5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2mm}
.carta svg{max-width:34mm;max-height:34mm;width:34mm;height:34mm}
.carta b{font-family:'Baloo 2';font-size:12pt}
.verso .in{background:${C.lavenderDeep};color:#fff}
.verso b{font-size:16pt;color:#fff}
/* colorir: transforma as ilustrações em contorno */
.colorir .desenho{position:absolute;left:16mm;right:16mm;top:44mm;bottom:28mm;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8mm;border:.6mm solid ${C.lavender};border-radius:8mm}
.colorir .desenho svg *{fill:#fff!important;stroke:${C.ink}!important;stroke-width:2.2px!important}
.colorir .desenho .grande svg{width:120mm;height:auto}
.colorir .desenho .medio svg{width:70mm;height:auto}
.colorir .desenho .livre svg{width:100%;height:auto}
.colorir .desenho .estrelas>svg{width:26mm}
.colorir .t{font-size:24pt}
.letras{font-family:'Baloo 2';font-weight:800;font-size:64pt;line-height:1;color:#fff;-webkit-text-stroke:1.2mm ${C.ink};text-align:center}
/* kit festa */
.bandeiras{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm 4mm;margin-top:8mm}
.flag{height:72mm;clip-path:polygon(0 0,100% 0,50% 100%);display:flex;justify-content:center;padding-top:8mm;font-family:'Baloo 2';font-weight:800;font-size:58pt;color:#fff;position:relative}
.flag::after{content:'';position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 100%);border-top:4mm solid rgba(255,255,255,.35)}
.coroa{margin-top:10mm;height:62mm;background:${C.sun};clip-path:polygon(0 30%,10% 0,20% 30%,30% 0,40% 30%,50% 0,60% 30%,70% 0,80% 30%,90% 0,100% 30%,100% 100%,0 100%);display:flex;align-items:flex-end;justify-content:center;padding-bottom:9mm;font-family:'Baloo 2';font-weight:800;font-size:28pt;color:${C.ink}}
.aba{height:12mm;border:.5mm dashed ${C.inkSoft};border-top:0;width:40mm;margin-left:auto;font-size:8pt;text-align:center;padding-top:3mm;color:${C.inkSoft}}
.medalhas{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-top:10mm}
.medalha{height:82mm;border:.5mm dashed ${C.inkSoft};border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle,#FFF4C7 0 58%,#fff 59%)}
.medalha b{font-family:'Baloo 2';font-size:20pt;line-height:1}
.medalha span{font-size:10pt;font-weight:700;color:${C.inkSoft};margin-top:1mm}
/* guia de frases */
.frases{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:8mm}
.frase{background:#fff;border:.6mm solid #EEE8FF;border-radius:5mm;padding:5mm 6mm;font-size:11.5pt;line-height:1.45;font-weight:600}
.frase small{display:block;font-weight:900;font-size:8.5pt;letter-spacing:1px;text-transform:uppercase;color:${C.lavenderDeep};margin-bottom:1.5mm}
.evitar{margin-top:7mm;background:#FFEDE4;border-radius:5mm;padding:6mm 8mm;font-size:11pt;line-height:1.5;font-weight:600}
.evitar h3{font-family:'Baloo 2';font-size:16pt;color:${C.peachDeep};margin-bottom:2mm}
.evitar ul{padding-left:6mm}
`;

const capa = (kicker, titulo, sub, arte) => page(`
  <div class="kicker">${kicker}</div>
  <div class="h t">${titulo}</div>
  <p class="sub">${sub}</p>
  <div class="arte">${arte}</div>
  ${rodape('Bônus para imprimir')}`, 'capa');

// ---------------------------------------------------------------- 1. jogo da memória
const cartas = [
  ['Chupi', pacifier({ size: 120 })], ['Tchau!', pacifier({ size: 120, wave: true })], ['Lua', moon(120)],
  ['Estrela', star(120)], ['Coração', heart(120)], ['Nuvem', cloud(140, C.lavender)],
  ['Sol', sun()], ['Presente', gift()], ['Balão', balloon()],
  ['Arco-íris', rainbow()], ['Ursinho', bear()], ['Medalha', medal()],
];
const gradeCartas = () => `<div class="cartas">${cartas.map(([n, svg]) => `<div class="carta"><div class="in" style="background:${C.cream}">${svg}<b>${n}</b></div></div>`).join('')}</div>`;
const gradeVerso = () => `<div class="cartas">${cartas.map(() => `<div class="carta verso"><div class="in">${pacifier({ size: 90, color: '#fff', ring: C.sun })}<b>Tchau Chupeta</b></div></div>`).join('')}</div>`;
const jogo = [
  capa('Bônus 1', 'Jogo da memória<br><em>da Chupi</em>', '12 pares de cartas ilustradas para<br>brincar com seu filho', `${pacifier({ size: 170, wave: true })}${star(80)}`),
  page(`${cabecalho('Como brincar', 'Jogo da memória da Chupi')}
    <div class="box"><h3>Preparando</h3><ol>
      <li>Imprima as páginas de cartas <b>duas vezes</b> (assim você tem os pares). Se quiser, imprima o verso no lado de trás.</li>
      <li>Recorte na linha pontilhada. Papel mais grosso ou cartolina deixa as cartas mais firmes.</li>
    </ol></div>
    <div class="box"><h3>Jogando</h3><ol>
      <li>Embaralhe e espalhe as cartas viradas para baixo.</li>
      <li>Cada um vira duas cartas na sua vez. Se forem iguais, guarda o par e joga de novo.</li>
      <li>Ganha quem juntar mais pares. Para os pequenos, comece com 6 pares.</li>
    </ol></div>
    <div class="box" style="background:#FFF4C7"><h3>Dica para os pais</h3>Aproveite o jogo para conversar sobre a despedida: quando sair a carta <b>“Tchau!”</b>, pergunte como a Chupi vai se sentir no novo lar dela, nas estrelas.</div>
    ${rodape('Bônus 1 · Jogo da memória')}`),
  page(`${gradeCartas()}${rodape('Bônus 1 · Cartas (imprima 2 vezes)')}`),
  page(`${gradeVerso()}${rodape('Bônus 1 · Verso das cartas (opcional)')}`),
];

// ---------------------------------------------------------------- 2. livro de colorir
const colorir = (titulo, arte, cls = 'grande') => page(`${cabecalho('Para colorir', titulo)}<div class="desenho"><div class="${cls}">${arte}</div></div>${rodape('Bônus 2 · Livro de colorir')}`, 'colorir');
const livroColorir = [
  capa('Bônus 2', 'Livro de colorir<br><em>Tchau Chupeta</em>', '8 desenhos para pintar enquanto<br>a despedida se aproxima', `${childWaving({ size: 180 })}${pacifier({ size: 140, wave: true })}`),
  colorir('A Chupi dando tchau', pacifier({ size: 400, wave: true })),
  colorir('Eu já sou grande!', childWaving({ size: 380 })),
  colorir('Abraço da família', familyHug({ size: 460 })),
  colorir('A Lua e as estrelas', `<div style="display:flex;flex-direction:column;align-items:center;gap:10mm"><div style="width:80mm">${moon(300)}</div><div class="estrelas" style="display:flex;gap:8mm">${star(90)}${star(70)}${star(90)}</div></div>`, 'livre'),
  colorir('O ursinho corajoso', bear(380)),
  colorir('Um presente pela coragem', `${gift(260)}${balloon(200)}`, 'medio'),
  colorir('Arco-íris do tchau', `${rainbow(380)}`),
  page(`${cabecalho('Para colorir', 'Escreva e pinte')}<div class="desenho" style="flex-direction:column"><div class="letras">TCHAU,<br>CHUPETA!</div><div class="medio">${heart(120)}</div></div>${rodape('Bônus 2 · Livro de colorir')}`, 'colorir'),
];

// ---------------------------------------------------------------- 3. kit festa do tchau
const coresFlag = [C.peachDeep, C.lavenderDeep, C.mintDeep, '#F2A93B', C.night, C.peach];
const bandeiras = (letras) => `<div class="bandeiras">${[...letras].map((l, i) => `<div class="flag" style="background:${coresFlag[i % coresFlag.length]}">${l}</div>`).join('')}</div>`;
const kitFesta = [
  capa('Bônus 3', 'Kit festa<br><em>do tchau</em>', 'Bandeirinhas, coroa e medalhas para<br>transformar o dia do tchau numa comemoração', `${gift(150)}${balloon(150)}${medal(130)}`),
  page(`${cabecalho('Como usar', 'Kit festa do tchau', 'O dia do tchau merece ser lembrado com carinho. Uma comemoração simples ajuda a criança a sentir que cresceu, e não que perdeu algo.')}
    <div class="box"><h3>O que tem no kit</h3><ul>
      <li><b>Bandeirinhas “TCHAU CHUPETA”</b>: recorte, cole num barbante e pendure no quarto.</li>
      <li><b>Coroa “Eu já sou grande!”</b>: recorte, una as pontas com fita e coloque na cabeça do seu pequeno.</li>
      <li><b>Medalhas de coragem</b>: recorte e prenda na roupa com fita dupla face ou um alfinete de segurança (sempre com um adulto por perto).</li>
    </ul></div>
    <div class="box" style="background:#FFF4C7"><h3>Ideia de comemoração</h3>Depois da cartinha e do tchau, faça um momento só de vocês: uma música, um bolinho ou um passeio. O importante é a criança associar o dia a orgulho e carinho.</div>
    ${rodape('Bônus 3 · Kit festa')}`),
  page(`${cabecalho('Recorte e pendure', 'Bandeirinhas (1/2)')}${bandeiras('TCHAU!')}${rodape('Bônus 3 · Bandeirinhas')}`),
  page(`${cabecalho('Recorte e pendure', 'Bandeirinhas (2/2)')}${bandeiras('CHUPETA')}${rodape('Bônus 3 · Bandeirinhas')}`),
  page(`${cabecalho('Recorte e monte', 'Coroa “Eu já sou grande!”', 'Recorte as duas partes e una com fita adesiva para ajustar ao tamanho da cabeça.')}
    <div class="coroa">Eu já sou grande!</div><div class="aba">colar aqui</div>
    <div class="coroa" style="background:${C.peach}">⭐ ⭐ ⭐</div><div class="aba">colar aqui</div>
    ${rodape('Bônus 3 · Coroa')}`),
  page(`${cabecalho('Recorte', 'Medalhas de coragem')}
    <div class="medalhas">${['Corajoso!', 'Corajosa!', 'Dei tchau!', 'Já sou grande!'].map((t) => `<div class="medalha">${medal(120)}<b>${t}</b><span>Tchau Chupeta</span></div>`).join('')}</div>
    ${rodape('Bônus 3 · Medalhas')}`),
];

// ---------------------------------------------------------------- 4. guia: o que dizer nos dias seguintes
const frases = [
  ['Quando pedir a chupeta', '“Você está com saudade da Chupi, né? Eu entendo. Ela está feliz cuidando das estrelinhas.”'],
  ['Na hora de dormir', '“Vamos abraçar o ursinho e lembrar da história do tchau? Eu fico aqui pertinho.”'],
  ['Quando chorar', '“Tudo bem chorar. Eu estou aqui com você.” (abrace, sem pressa e sem bronca)'],
  ['Para lembrar a conquista', '“Lembra do seu certificado? Você foi muito corajoso(a).”'],
  ['Quando estiver nervoso(a)', '“Vamos respirar juntos? Cheira a florzinha… sopra a velinha.”'],
  ['Quando alguém oferecer chupeta', '“Ele(a) já deu tchau para a chupeta, obrigada!” (combinado com toda a família)'],
  ['Para valorizar', '“Você está crescendo tanto! Hoje você dormiu sem a chupeta.”'],
  ['Quando perguntar onde ela está', '“A Chupi foi ajudar os bebês. Quer fazer um desenho para mandar para ela?”'],
];
const guia = [
  capa('Bônus 4', 'O que dizer<br><em>nos dias seguintes</em>', 'Frases prontas para acolher seu filho<br>quando ele pedir a chupeta', `${familyHug({ size: 260 })}`),
  page(`${cabecalho('Guia rápido', 'Frases prontas para os dias seguintes', 'Os primeiros dias depois do tchau são de adaptação. Pedir a chupeta e sentir saudade é normal. Estas frases ajudam a acolher sem voltar atrás.')}
    <div class="frases">${frases.map(([s, t]) => `<div class="frase"><small>${s}</small>${t}</div>`).join('')}</div>
    ${rodape('Bônus 4 · Guia rápido')}`),
  page(`${cabecalho('Guia rápido', 'Para os dias seguintes')}
    <div class="evitar"><h3>Evite</h3><ul>
      <li>Ameaçar (“se chorar, não ganha presente”) ou comparar com outras crianças.</li>
      <li>Ceder “só hoje”: a criança aprende que o choro traz a chupeta de volta.</li>
      <li>Rir ou contar para os outros que ele(a) chorou.</li>
      <li>Cada adulto fazer de um jeito: combine a mesma resposta com pai, avós e babá.</li>
    </ul></div>
    <div class="box"><h3>Ajuda nos primeiros dias</h3><ul>
      <li>Mantenha a rotina do sono igual: banho, história, abraço, luz baixa.</li>
      <li>Ofereça um objeto de conforto: ursinho, paninho ou travesseiro especial.</li>
      <li>Reforce as conquistas todos os dias, com palavras e abraços.</li>
      <li>Releia a historinha favorita sempre que a saudade apertar.</li>
    </ul></div>
    <div class="box" style="background:#FFF4C7">Cada criança tem seu ritmo. Se tiver dúvidas sobre o sono, a saúde ou o desenvolvimento do seu filho, converse com o pediatra.</div>
    ${rodape('Bônus 4 · Guia rápido')}`),
];

// ---------------------------------------------------------------- gerar
const bonus = [
  ['bonus-1-jogo-da-memoria', 'Jogo da memória da Chupi', jogo],
  ['bonus-2-livro-de-colorir', 'Livro de colorir Tchau Chupeta', livroColorir],
  ['bonus-3-kit-festa-do-tchau', 'Kit festa do tchau', kitFesta],
  ['bonus-4-o-que-dizer-nos-dias-seguintes', 'O que dizer nos dias seguintes', guia],
];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const [arq, titulo, paginas] of bonus) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Tchau Chupeta — ${titulo}</title><style>${CSS}</style></head><body>${paginas.join('')}</body></html>`;
  const pg = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await pg.setContent(html);
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: join(OUT, `${arq}.pdf`), preferCSSPageSize: true, printBackground: true });
  await pg.close();
  console.log('ok', arq, paginas.length, 'páginas');
}
await browser.close();
