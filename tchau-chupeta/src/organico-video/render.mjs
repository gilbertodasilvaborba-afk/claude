// Vídeos 9:16 com cara de orgânico: nota sendo digitada, grupo de mães, busca, caixinha de perguntas e meme.
// A tela "acontece" no ritmo da narração. Fluxo:
//   node src/organico-video/render.mjs tts      → escreve _trabalho/tts.json
//   python3 src/organico-video/tts.py            → gera as narrações (Cartesia)
//   node src/organico-video/render.mjs [filtro]  → renderiza e mixa os vídeos em videos/organicos/
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, pacifier } from '../illustrations.mjs';
import { SC } from '../cenas-reais.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'videos', 'organicos');
const TRAB = join(OUT, '_trabalho');
const W = 1080, H = 1920, FPS = 30;
const VOZ = '1cf751f6-8749-43ab-98bd-230dd633abdb'; // Ana Paula (feminina, informal)
const MUSICA = join(ROOT, 'levas', 'L3', 'musicas', 'm01.m4a');
mkdirSync(TRAB, { recursive: true });

const font = (file) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', file)).toString('base64')}) format('woff2')`;
const strip = (s) => s.replace(/<[^>]+>/g, '');
const esc = (s) => s.replace(/`/g, '\\`');

// ---------------------------------------------------------------- textos narrados
const VO = {
  VO1: {
    titulo: 'coisas que ninguém te conta sobre tirar a chupeta',
    itens: [
      ['esconder <b>não é</b> despedida. ele procura, chora e a chupeta volta na 2ª noite', 'esconder não é despedida. ele procura, chora, e a chupeta volta na segunda noite.'],
      ['chupeta usada por muito tempo <b>pode mexer na mordida</b>', 'chupeta usada por muito tempo pode mexer na mordida.'],
      ['odontopediatras recomendam começar a retirada <b>por volta dos 3 anos</b>', 'odontopediatras recomendam começar a retirada por volta dos três anos.'],
      ['o choro vem. o que muda é se ele vem com briga ou com acolhimento', 'o choro vem. o que muda é se ele vem com briga, ou com acolhimento.'],
      ['criança aceita melhor o que <b>ela ajuda a decidir</b>', 'criança aceita melhor o que ela ajuda a decidir.'],
      ['o segredo: transformar a retirada numa <span class="mk">despedida</span>. historinha, dia escolhido junto, ritual de tchau 🌙', 'e o segredo: transformar a retirada numa despedida. historinha, dia escolhido junto, e um ritual de tchau.'],
    ],
    fim: 'salva pra não esquecer. e se quiser o passo a passo, toca em saiba mais.',
  },
  VO2: { fim: 'se você se viu nessa conversa, existe um jeito mais leve. a criança se despede da chupeta, com historinha, dia escolhido junto e um ritual de tchau. toca em saiba mais.' },
  VO3: {
    hook: 'olha o que as mães mais pesquisam sobre chupeta.',
    resp: [
      ['O uso prolongado da chupeta <b>pode afetar a mordida</b>.', 'o uso prolongado da chupeta pode afetar a mordida.'],
      ['Odontopediatras recomendam começar a retirada <b>por volta dos 3 anos</b>.', 'e odontopediatras recomendam começar a retirada por volta dos três anos.'],
      ['O jeito com menos briga: <b>a criança se despede da chupeta</b>, em vez de ter ela arrancada.', 'o jeito com menos briga é a criança se despedir da chupeta, em vez de ter ela arrancada.'],
    ],
    fim: 'toca em saiba mais e conhece o tchau chupeta.',
  },
  VO4: {
    pergunta: 'como tiro a chupeta sem ele chorar a noite toda?',
    linhas: [
      ['a real: não existe mágica 💛', 'a real? não existe mágica.'],
      ['mas existe um jeito com menos briga:', 'mas existe um jeito com menos briga.'],
      ['✨ prepara com historinha', 'primeiro, prepara com historinha.'],
      ['✨ deixa ele escolher o dia', 'depois, deixa ele escolher o dia.'],
      ['✨ faz um ritual de tchau', 'e faz um ritual de tchau.'],
      ['ele não perde a chupeta. ele se despede dela 🌙', 'ele não perde a chupeta. ele se despede dela.'],
    ],
    fim: 'toca em saiba mais pra ver o passo a passo.',
  },
};
const ttsList = () => {
  const L = [];
  const add = (id, texto) => L.push({ id, texto, voz: VO, velocidade: 1.05 });
  add('vo1_t', VO.VO1.titulo); VO.VO1.itens.forEach(([, f], i) => add(`vo1_${i}`, f)); add('vo1_fim', VO.VO1.fim);
  add('vo2_fim', VO.VO2.fim);
  add('vo3_h', VO.VO3.hook); VO.VO3.resp.forEach(([, f], i) => add(`vo3_${i}`, f)); add('vo3_fim', VO.VO3.fim);
  add('vo4_q', VO.VO4.pergunta); VO.VO4.linhas.forEach(([, f], i) => add(`vo4_${i}`, f)); add('vo4_fim', VO.VO4.fim);
  return L.map((x) => ({ ...x, voz: VOZ }));
};
if (process.argv[2] === 'tts') {
  writeFileSync(join(TRAB, 'tts.json'), JSON.stringify(ttsList(), null, 1));
  console.log('tts.json pronto');
  process.exit(0);
}
const D = JSON.parse(readFileSync(join(TRAB, 'duracoes.json'), 'utf-8'));

// ---------------------------------------------------------------- página base
const CSS = `
@font-face{font-family:'Inter';font-weight:100 900;src:${font('Inter-latin.woff2')}}
@font-face{font-family:'Baloo 2';font-weight:400 800;src:${font('Baloo2-latin.woff2')}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:'Inter',sans-serif;color:#1c1c1e;position:relative;-webkit-font-smoothing:antialiased}
.a{position:absolute}
.status{height:110px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 64px 16px;font-weight:600;font-size:34px}
.status .r{display:flex;gap:16px;align-items:center}
.bat{width:58px;height:28px;border:3px solid currentColor;border-radius:9px;position:relative}
.bat:after{content:'';position:absolute;inset:3px;right:14px;background:currentColor;border-radius:3px}
.cur{display:inline-block;width:4px;height:1em;background:#D4A017;vertical-align:-.12em;margin-left:2px}
.mk{background:#FFF1A8;padding:0 6px}
.cta{position:absolute;left:50px;right:50px;bottom:360px;background:${C.night};color:#fff;border-radius:40px;padding:30px 36px;display:flex;align-items:center;gap:26px;box-shadow:0 20px 50px rgba(0,0,0,.25);opacity:0}
.cta .ic{width:110px;height:110px;flex:none;border-radius:28px;background:${C.cream};display:flex;align-items:center;justify-content:center}
.cta .t1{font-family:'Baloo 2';font-weight:800;font-size:46px;line-height:1}
.cta .t2{font-size:30px;margin-top:8px;color:${C.sun};font-weight:700}
.tiny{font-size:22px;color:#8e8e93;font-weight:500}
`;
const status = (time, color = '#1c1c1e') => `<div class="status" style="color:${color}"><span>${time}</span><span class="r">
  <svg width="40" height="26" viewBox="0 0 36 24"><rect x="0" y="16" width="6" height="8" rx="2" fill="currentColor"/><rect x="10" y="11" width="6" height="13" rx="2" fill="currentColor"/><rect x="20" y="6" width="6" height="18" rx="2" fill="currentColor"/><rect x="30" y="0" width="6" height="24" rx="2" fill="currentColor"/></svg>
  <svg width="38" height="26" viewBox="0 0 34 24"><path d="M17 22 l5 -6 a8 8 0 0 0 -10 0z M4 9 a19 19 0 0 1 26 0 l-4 4 a13 13 0 0 0 -18 0z" fill="currentColor"/></svg>
  <span class="bat"></span></span></div>`;
const ctaCard = (t2 = 'toque em saiba mais 👇') => `<div class="cta" id="cta"><div class="ic">${pacifier({ size: 80, wave: true })}</div>
  <div><div class="t1">Tchau Chupeta</div><div class="t2">${t2}</div></div></div>`;
const RUNTIME = `
const clamp=(x)=>Math.min(Math.max(x,0),1), ease=(x)=>1-Math.pow(1-clamp(x),3);
function appear(el,t0,t,dy=30,d=.28){const p=t<t0?0:ease((t-t0)/d);el.style.opacity=p;el.style.transform='translateY('+((1-p)*dy)+'px) scale('+(.96+.04*p)+')';}
function typed(el,plain,rich,t0,t1,t,cur=true){
  if(t<t0){el.innerHTML='';return;}
  if(t>=t1){el.innerHTML=rich;return;}
  const n=Math.max(1,Math.round(plain.length*(t-t0)/(t1-t0)));
  el.innerHTML=plain.slice(0,n).replace(/&/g,'&amp;').replace(/</g,'&lt;')+(cur?'<span class="cur"></span>':'');
}`;
const page = (body, bodyCss, script) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CSS}${bodyCss}</style></head>
<body>${body}<script>${RUNTIME}${script}</script></body></html>`;

// ---------------------------------------------------------------- vídeos
// Cada builder devolve { html, dur, voz:[[id,t]], sfx:[[tipo,t]] }
const builders = {
  VO1() {
    const v = VO.VO1, voz = [], sfx = [];
    let t = 0.5;
    const tl = { title: [t, t + D.vo1_t * 0.92] }; voz.push(['vo1_t', t]); t += D.vo1_t + 0.25;
    tl.items = v.itens.map((_, i) => { const a = [t, t + D[`vo1_${i}`] * 0.92]; voz.push([`vo1_${i}`, t]); t += D[`vo1_${i}`] + 0.3; return a; });
    tl.cta = t; voz.push(['vo1_fim', t]); sfx.push(['pop', t]);
    const dur = t + D.vo1_fim + 1.2;
    const html = page(`
      ${status('23:41')}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 50px 0;color:#D4A017;font-size:40px;font-weight:500"><span>‹ Notas</span><span style="display:flex;gap:40px"><span>⇪</span><span>⋯</span></span></div>
      <div id="vp" style="position:absolute;left:0;right:0;top:220px;bottom:0;overflow:hidden">
        <div id="c" style="padding:10px 70px 0">
          <div class="tiny" style="text-align:center;font-size:26px">hoje às 23:41</div>
          <div id="tt" style="font-size:62px;font-weight:800;line-height:1.15;margin-top:30px;letter-spacing:-.5px;min-height:1.15em"></div>
          <ol id="ol" style="margin-top:40px;padding-left:56px;font-size:44px;line-height:1.42;font-weight:450">
            ${v.itens.map((_, i) => `<li id="i${i}" style="margin-bottom:30px;display:none"></li>`).join('')}
          </ol>
        </div>
      </div>
      ${ctaCard('o passo a passo para a despedida 👇')}`, 'body{background:#FBFAF6}', `
      const TL=${JSON.stringify(tl)}, IT=${JSON.stringify(v.itens.map(([r]) => [strip(r), r]))}, TT=\`${esc(v.titulo)} 🧸\`;
      window.render=(t)=>{
        typed(document.getElementById('tt'),TT,TT,TL.title[0],TL.title[1],t);
        IT.forEach(([p,r],i)=>{const el=document.getElementById('i'+i);const [a,b]=TL.items[i];el.style.display=t>=a?'list-item':'none';typed(el,p,r,a,b,t);});
        const c=document.getElementById('c');c.style.transform='none';
        const vis=[...document.querySelectorAll('#ol li')].filter(e=>e.style.display!=='none');
        const last=vis.length?vis[vis.length-1]:document.getElementById('tt');
        const limit=TL.cta<=t?1180:1500, over=last.getBoundingClientRect().bottom-limit;
        if(over>0)c.style.transform='translateY('+(-over)+'px)';
        appear(document.getElementById('cta'),TL.cta,t,60);
      };`);
    return { html, dur, voz, sfx };
  },

  VO2() {
    const msgs = [
      ['Ju', '#D9534F', 'gente, alguém conseguiu tirar a chupeta?? 😩'],
      ['Carol', '#2E86C1', 'escondi ontem. pior noite da minha vida kkkk'],
      ['Carol', '#2E86C1', 'devolvi às 3h 🫠'],
      ['Bia', '#27AE60', 'a dentista falou que já tá na hora por causa da mordida 😬'],
      ['Fê', '#AF7AC5', 'aqui ele pede o dia inteiro e eu nem sei por onde começar'],
      ['Ju', '#D9534F', 'socorro, somos todas nós 😂'],
    ];
    const voz = [], sfx = [], tl = { m: [], typing: [] };
    let t = 0.5;
    msgs.forEach(([, , txt]) => { tl.typing.push([t, t + 0.8]); t += 0.8; tl.m.push(t); sfx.push(['pop', t]); t += 0.7 + txt.length * 0.03; });
    t += 0.3; tl.cta = t; sfx.push(['pop', t]); voz.push(['vo2_fim', t + 0.3]);
    const dur = t + 0.3 + D.vo2_fim + 1.2;
    const bubble = ([name, color, text], i) => {
      const first = i === 0 || msgs[i - 1][0] !== name;
      return `<div id="m${i}" style="align-self:flex-start;max-width:880px;background:#fff;border-radius:${first ? '8px' : '30px'} 30px 30px 30px;padding:16px 26px 12px;margin-top:${first ? 22 : 8}px;box-shadow:0 2px 2px rgba(0,0,0,.06);opacity:0">
        ${first ? `<div style="color:${color};font-weight:700;font-size:30px">${name}</div>` : ''}
        <div style="font-size:40px;line-height:1.35">${text} <span style="font-size:24px;color:#8e8e93;margin-left:10px">22:${String(3 + i * 2).padStart(2, '0')}</span></div></div>`;
    };
    const html = page(`
      <div style="background:#5B4F9C;color:#fff;padding-bottom:26px">${status('22:17', '#fff')}
        <div style="display:flex;align-items:center;gap:24px;padding:14px 44px 0"><span style="font-size:46px">‹</span>
        <div style="width:90px;height:90px;border-radius:50%;background:${C.peach};display:flex;align-items:center;justify-content:center;font-size:46px">👶</div>
        <div><div style="font-weight:700;font-size:40px">Mães da turminha 💛</div><div id="sub" style="font-size:28px;opacity:.85">Ju, Carol, Bia, Fê, você</div></div></div></div>
      <div style="display:flex;flex-direction:column;padding:16px 40px">${msgs.map(bubble).join('')}</div>
      <div class="cta" id="cta" style="flex-direction:column;align-items:flex-start;gap:10px;background:#fff;color:${C.ink}">
        <div style="font-family:'Baloo 2';font-weight:800;font-size:50px;line-height:1.1">Se você se viu nessa conversa…</div>
        <div style="font-size:36px;line-height:1.4;color:#3c3c43">existe um jeito mais leve: <b>a criança se despede da chupeta</b>, com historinha, dia escolhido junto e um ritual de tchau.</div>
        <div style="display:flex;align-items:center;gap:14px;margin-top:6px;font-weight:800;font-size:30px;color:${C.lavenderDeep}">${pacifier({ size: 50 })} Tchau Chupeta · toque em saiba mais</div>
        <div class="tiny">conversa ilustrativa</div></div>`,
      `body{background:#ECE5DD;background-image:radial-gradient(#d9cfc4 1.6px, transparent 2px);background-size:40px 40px}`, `
      const TL=${JSON.stringify(tl)}, N=${JSON.stringify(msgs.map((m) => m[0]))};
      window.render=(t)=>{
        TL.m.forEach((a,i)=>appear(document.getElementById('m'+i),a,t,20,.2));
        const ty=TL.typing.findIndex(([a,b])=>t>=a&&t<b);
        document.getElementById('sub').textContent= ty>=0 ? N[ty]+' está digitando…' : 'Ju, Carol, Bia, Fê, você';
        appear(document.getElementById('cta'),TL.cta,t,80);
      };`);
    return { html, dur, voz, sfx };
  },

  VO3() {
    const v = VO.VO3, voz = [], sfx = [];
    const q = 'como tirar a chupeta';
    const tl = {};
    voz.push(['vo3_h', 0.3]);
    tl.q = [0.7, 0.7 + q.length * 0.11];
    for (let i = 0; i < q.length; i++) if (q[i] !== ' ') sfx.push(['key', 0.7 + i * 0.11]);
    tl.s = [0, 1, 2, 3, 4].map((i) => tl.q[1] + 0.3 + i * 0.22);
    tl.hl = Math.max(tl.s[4] + 0.5, 0.3 + D.vo3_h + 0.3);
    tl.tap = tl.hl + 0.6; sfx.push(['tap', tl.tap]);
    tl.ans = tl.tap + 0.35;
    let t = tl.ans + 0.5;
    tl.r = v.resp.map((_, i) => { const a = [t, t + D[`vo3_${i}`] * 0.9]; voz.push([`vo3_${i}`, t]); t += D[`vo3_${i}`] + 0.3; return a; });
    tl.cta = t; voz.push(['vo3_fim', t]); sfx.push(['pop', t]);
    const dur = t + D.vo3_fim + 1.2;
    const sugs = ['como tirar a chupeta <b>sem chorar</b>', 'como tirar a chupeta <b>à noite</b>', 'chupeta <b>pode entortar os dentes?</b>', '<b>com quantos anos</b> tirar a chupeta', 'como tirar a chupeta <b>de criança apegada</b>'];
    const lupa = (c = '#9aa0a6') => `<svg width="40" height="40" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" stroke="${c}" stroke-width="2.5" fill="none"/><path d="M15 15 L21 21" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
    const html = page(`
      ${status('07:12')}
      <div id="p1" style="position:absolute;left:0;right:0;top:110px;bottom:0;padding:40px 56px 0">
        <div style="display:flex;align-items:center;gap:26px;border:3px solid #dfe1e5;border-radius:999px;padding:30px 40px;font-size:46px;box-shadow:0 4px 14px rgba(0,0,0,.08)">${lupa('#5f6368')}<span id="q"></span></div>
        <div style="padding:16px 22px">${sugs.map((s, i) => `<div id="s${i}" style="display:flex;align-items:center;gap:32px;padding:32px 16px;border-bottom:2px solid #eee;font-size:44px;color:#3c4043;border-radius:18px;opacity:0">${lupa()}<span>${s}</span></div>`).join('')}</div>
      </div>
      <div id="p2" style="position:absolute;left:0;right:0;top:110px;bottom:0;padding:40px 56px 0;background:#fff;opacity:0">
        <div style="display:flex;align-items:center;gap:26px;border:3px solid #dfe1e5;border-radius:999px;padding:30px 40px;font-size:42px">${lupa('#5f6368')}<span>chupeta pode entortar os dentes?</span></div>
        <div style="margin-top:50px;background:${C.night};color:#fff;border-radius:40px;padding:44px 46px">
          <div style="font-family:'Baloo 2';font-weight:800;font-size:54px;line-height:1.1">Se você já pesquisou isso: 👇</div>
          ${v.resp.map((_, i) => `<div id="r${i}" style="font-size:42px;line-height:1.42;margin-top:26px;font-weight:500"></div>`).join('')}
        </div>
      </div>
      ${ctaCard()}`, `body{background:#fff} #p2 b{color:${C.sun}}`, `
      const TL=${JSON.stringify(tl)}, Q='${q}', R=${JSON.stringify(v.resp.map(([r]) => [strip(r), r]))};
      window.render=(t)=>{
        typed(document.getElementById('q'),Q,Q,TL.q[0],TL.q[1],t,t<TL.ans);
        TL.s.forEach((a,i)=>appear(document.getElementById('s'+i),a,t,14,.18));
        const h=document.getElementById('s2');h.style.background=t>=TL.hl?'#FFF1A8':'transparent';h.style.color=t>=TL.hl?'#1c1c1e':'#3c4043';
        h.style.transform+= t>=TL.tap&&t<TL.tap+.15?' scale(.97)':'';
        const p2=document.getElementById('p2');const k=ease((t-TL.ans)/.3);p2.style.opacity=t<TL.ans?0:k;p2.style.transform='translateX('+((1-k)*80)+'px)';
        R.forEach(([p,r],i)=>typed(document.getElementById('r'+i),p,r,TL.r[i][0],TL.r[i][1],t,false));
        appear(document.getElementById('cta'),TL.cta,t,60);
      };`);
    return { html, dur, voz, sfx };
  },

  VO4() {
    const v = VO.VO4, voz = [], sfx = [];
    const tl = { q: 0.4 }; sfx.push(['pop', 0.4]); voz.push(['vo4_q', 0.6]);
    let t = 0.6 + D.vo4_q + 0.35;
    tl.l = v.linhas.map((_, i) => { const a = t; voz.push([`vo4_${i}`, t]); sfx.push(['pop', t]); t += D[`vo4_${i}`] + 0.25; return a; });
    tl.cta = t; voz.push(['vo4_fim', t]); sfx.push(['pop', t]);
    const dur = t + D.vo4_fim + 1.2;
    const hl = (txt, i, bg = '#fff', color = '#1c1c1e') => `<div id="l${i}" style="opacity:0;margin-top:${i === 2 || i === 5 ? 40 : 6}px"><span style="background:${bg};color:${color};padding:8px 20px;border-radius:12px;box-decoration-break:clone;-webkit-box-decoration-break:clone;line-height:1.7">${txt}</span></div>`;
    const html = page(`
      <div class="a" style="inset:0;filter:blur(20px) brightness(.72);transform:scale(1.2)">${SC.leitura(1400)}</div>
      <div class="a" style="left:40px;right:40px;top:70px;display:flex;gap:8px">${[1, 1, 0].map((f) => `<div style="flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,${f ? .95 : .4})"></div>`).join('')}</div>
      <div class="a" style="left:56px;right:56px;top:110px;display:flex;align-items:center;gap:20px;color:#fff;font-weight:700;font-size:34px">
        <div style="width:80px;height:80px;border-radius:50%;background:${C.cream};display:flex;align-items:center;justify-content:center">${pacifier({ size: 56 })}</div>tchauchupeta <span style="opacity:.7;font-weight:500">2 h</span></div>
      <div id="q" class="a" style="left:110px;right:110px;top:300px;border-radius:44px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.25);opacity:0">
        <div style="background:linear-gradient(90deg,#F58529,#DD2A7B,#8134AF);color:#fff;text-align:center;font-weight:700;font-size:36px;padding:28px">Faça uma pergunta</div>
        <div style="background:#fff;text-align:center;font-weight:600;font-size:48px;line-height:1.25;padding:44px 46px">${v.pergunta} 😭</div></div>
      <div class="a" style="left:70px;right:70px;top:820px;text-align:center;font-weight:700;font-size:48px">
        ${v.linhas.map(([txt], i) => i < 2 ? hl(txt, i) : i < 5 ? hl(txt, i, '#FFD66B') : hl(txt, i, C.night, '#fff')).join('')}</div>
      ${ctaCard('o passo a passo completo 👇')}`, 'body{background:#2a2556}', `
      const TL=${JSON.stringify(tl)};
      window.render=(t)=>{appear(document.getElementById('q'),TL.q,t,40,.3);TL.l.forEach((a,i)=>appear(document.getElementById('l'+i),a,t,18,.2));appear(document.getElementById('cta'),TL.cta,t,60);};`);
    return { html, dur, voz, sfx };
  },

  VO5() {
    const tl = { p2: 2.6, cap: 5.4 }, sfx = [['whoosh', 2.5], ['pop', 5.4]];
    const panel = (scene, vb) => `<div style="border-radius:24px;overflow:hidden;height:560px;width:1000px">${SC[scene](1000).replace('viewBox="0 0 1000 700"', `viewBox="${vb}"`).replace('style="display:block"', 'style="display:block;width:1000px;height:560px" preserveAspectRatio="xMidYMid slice"')}</div>`;
    const html = page(`
      <div style="padding:240px 40px 0">
        <div style="font-weight:700;font-size:50px;line-height:1.25">eu escondendo a chupeta achando que resolvi 😌</div>
        <div style="margin-top:24px">${panel('gaveta', '60 40 940 527')}</div>
        <div id="p2"><div style="font-weight:700;font-size:50px;line-height:1.25;margin-top:40px">ele, às 3 da manhã:</div>
        <div style="margin-top:24px">${panel('noite', '330 150 700 392')}</div></div>
      <div id="cap" style="margin-top:30px;font-size:38px;color:#444;font-weight:500;opacity:0">não é sobre esconder, <b style="color:#111">é sobre ele se despedir</b> 🌙 <span class="tiny">@tchauchupeta</span></div>
      </div>`,
      'body{background:#fff}', `
      const TL=${JSON.stringify(tl)};
      window.render=(t)=>{appear(document.getElementById('p2'),TL.p2,t,40,.25);appear(document.getElementById('cap'),TL.cap,t,20);};`);
    return { html, dur: 8.5, voz: [], sfx };
  },
};
const NOMES = { VO1: 'VO1-nota-digitando', VO2: 'VO2-grupo-maes', VO3: 'VO3-busca', VO4: 'VO4-caixinha', VO5: 'VO5-meme' };

// ---------------------------------------------------------------- áudio
const ff = (args) => { const r = spawnSync('ffmpeg', ['-y', '-v', 'error', ...args]); if (r.status) throw new Error(r.stderr.toString()); };
const SFX = {
  pop: ['-f', 'lavfi', '-i', 'sine=f=1100:d=0.09', '-af', 'afade=t=out:st=0.01:d=0.08,volume=0.55'],
  key: ['-f', 'lavfi', '-i', 'anoisesrc=d=0.04:c=pink:a=0.6', '-af', 'highpass=f=1800,afade=t=out:st=0.005:d=0.035,volume=0.9'],
  tap: ['-f', 'lavfi', '-i', 'sine=f=650:d=0.07', '-af', 'afade=t=out:st=0.01:d=0.06,volume=0.5'],
  whoosh: ['-f', 'lavfi', '-i', 'anoisesrc=d=0.4:c=pink:a=0.5', '-af', 'bandpass=f=900:w=600,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.2,volume=0.8'],
};
for (const [k, a] of Object.entries(SFX)) { const f = join(TRAB, `sfx_${k}.wav`); if (!existsSync(f)) ff([...a, '-ar', '44100', '-ac', '1', f]); }

const mix = (spec, out) => {
  const ins = ['-stream_loop', '-1', '-i', MUSICA];
  const filt = [`[0:a]atrim=0:${spec.dur},volume=${spec.voz.length ? 0.12 : 0.35},afade=t=out:st=${spec.dur - 1.2}:d=1.2[m]`];
  const parts = ['[m]'];
  let k = 1;
  for (const [id, t] of spec.voz) { ins.push('-i', join(TRAB, `${id}.wav`)); filt.push(`[${k}:a]adelay=${Math.round(t * 1000)}:all=1,volume=1.0[a${k}]`); parts.push(`[a${k}]`); k++; }
  for (const [tp, t] of spec.sfx) { ins.push('-i', join(TRAB, `sfx_${tp}.wav`)); filt.push(`[${k}:a]adelay=${Math.round(t * 1000)}:all=1[a${k}]`); parts.push(`[a${k}]`); k++; }
  filt.push(`${parts.join('')}amix=inputs=${parts.length}:normalize=0:duration=first,alimiter=limit=0.95[out]`);
  ff([...ins, '-filter_complex', filt.join(';'), '-map', '[out]', '-ar', '44100', '-ac', '2', out]);
};

// ---------------------------------------------------------------- render
const filter = process.argv[2];
const browser = await chromium.launch();
for (const [id, build] of Object.entries(builders)) {
  if (filter && !id.includes(filter)) continue;
  const spec = build();
  const pg = await browser.newPage({ viewport: { width: W, height: H } });
  await pg.setContent(spec.html);
  await pg.evaluate(() => document.fonts.ready);
  const silent = join(TRAB, `${id}.mp4`);
  const proc = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', silent]);
  const done = new Promise((res, rej) => proc.on('close', (c) => (c ? rej(new Error('ffmpeg ' + c)) : res())));
  const n = Math.round(spec.dur * FPS);
  for (let f = 0; f < n; f++) {
    await pg.evaluate((t) => window.render(t), f / FPS);
    const buf = await pg.screenshot({ type: 'jpeg', quality: 88 });
    if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
  }
  proc.stdin.end(); await done; await pg.close();
  const audio = join(TRAB, `${id}.wav`);
  mix(spec, audio);
  const final = join(OUT, `${NOMES[id]}.mp4`);
  ff(['-i', silent, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-map_metadata', '-1', '-movflags', '+faststart', final]);
  console.log('ok', NOMES[id], spec.dur.toFixed(1) + 's');
}
await browser.close();
