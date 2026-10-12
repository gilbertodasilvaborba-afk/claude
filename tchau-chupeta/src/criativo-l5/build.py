"""Criativo L5: narrativa no estilo "antes, a rotina era… / foi aí que veio a virada…" para o Tchau Chupeta.

Cada frase narrada tem a sua cena (ilustração com movimento de câmera, cena animada ou página
real do PDF). Legenda amarela palavra a palavra (funções da skill producao-ads), título no gancho
e tela final com fundo desfocado.

Uso: python3 src/criativo-l5/build.py   (rode antes: node src/criativo-l5/stills.mjs)
"""
import importlib.util
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "videos" / "criativos" / "L5"
TRAB = OUT / "_trab"
STILLS = TRAB / "stills"
CENAS = ROOT / "cenas-animadas"
PDF = ROOT / "entregavel" / "tchau-chupeta-historinhas.pdf"
MUSICA = ROOT / "levas" / "L3" / "musicas" / "m01.m4a"
VOZ = "c9611be8-aae9-4a93-bb1c-98dd6b7d52a4"  # Isabella
VEL = 1.15
FPS, W, H = 30, 1080, 1920

LEVA = Path(os.environ.get("LEVA_PY", "/root/.claude/skills/synced/2ba233e4-afb5-4a1d-b25d-8f40d91ce18a_dab983a1-62de-483e-9ba4-c11445dfd82f/producao-ads/scripts/leva.py"))
spec = importlib.util.spec_from_file_location("leva", LEVA)
leva = importlib.util.module_from_spec(spec)
spec.loader.exec_module(leva)

# Visuais: ("still", png, (cx0, cy0, z0), (cx1, cy1, z1))  centro normalizado e zoom (1 = imagem inteira)
#          ("page", n, ...mesmo movimento)  página do PDF, mostrada inteira sobre fundo desfocado
#          ("clip", mp4)                    cena animada 9:16
S = lambda nome, a, b: ("still", STILLS / f"{nome}.png", a, b)
P = lambda n, a=(0.5, 0.5, 1.0), b=(0.5, 0.45, 1.25): ("page", n, a, b)
K = lambda nome: ("clip", CENAS / f"{nome}.mp4")

ROTEIRO = [
    ("Se o seu filho chora toda vez que você tira a chupeta, presta atenção nisso.", [S("noite", (0.7, 0.55, 1.0), (0.7, 0.45, 2.1))]),
    ("Antes, a noite aqui era sempre igual.", [K("quarto-noite")]),
    ("Você escondia a chupeta, ele acordava chorando às três da manhã,", [S("noite", (0.75, 0.5, 1.6), (0.82, 0.55, 2.3))]),
    ("e você, morta de cansaço, acabava devolvendo.", [S("noite", (0.2, 0.42, 1.5), (0.2, 0.36, 1.8))]),
    ("Durante o dia, era me dá a chupeta toda hora.", [S("gaveta", (0.55, 0.5, 1.0), (0.78, 0.55, 1.9))]),
    ("E no fim do dia vinha a culpa.", [S("gaveta", (0.53, 0.45, 1.6), (0.53, 0.38, 2.4))]),
    ("Você sabia que a chupeta usada por muito tempo pode mexer nos dentinhos, mas não sabia por onde começar.", [K("mordida"), K("dente-preocupado")]),
    ("Foi aí que veio a virada: o Tchau Chupeta.", [P(0, (0.5, 0.5, 1.0), (0.5, 0.42, 1.18))]),
    ("Ele não tira a chupeta na marra. Ele ensina a criança a se despedir dela.", [S("ritual", (0.5, 0.5, 1.0), (0.55, 0.45, 1.5))]),
    ("Tudo começa com uma historinha antes de dormir.", [S("leitura", (0.5, 0.5, 1.0), (0.55, 0.5, 1.6))]),
    ("A Chupi precisa ajudar as estrelinhas lá no céu, e a criança decide ajudar.", [P(5, (0.5, 0.3, 1.5), (0.5, 0.27, 1.8))]),
    ("Ela escolhe o dia, faz um desenho, coloca a chupeta na caixinha e dá tchau.", [P(7, (0.5, 0.3, 1.5), (0.5, 0.27, 1.8)), K("crianca-despedida")]),
    ("Agora imagina a sua noite assim: ele dormindo tranquilo, contando orgulhoso que a chupeta foi morar na Lua.", [K("noite-chupi"), K("chupi-nuvem")]),
    ("E você terminando o dia sem briga e sem culpa.", [K("abraco-coracoes")]),
    ("São cinco historinhas, calendário de sete dias, bilhetes mágicos e certificado. Tudo pronto pra começar hoje.", [P(0), P(41), P(42), P(45)]),
    ("Toque em saiba mais e conheça o Tchau Chupeta.", [("cta",)]),
]
TITULO = ["ELE CHORA", "SEM A CHUPETA?"]

# Versões com imagem real: mesmo roteiro, uma foto (Pexels ou IA) por frase. Ver cenas-fotos.json.
FONTE = sys.argv[1] if len(sys.argv) > 1 else "ilustrado"
NOME = {"ilustrado": "L5V1", "pexels": "L5V2-pexels", "ia": "L5V3-ia"}[FONTE]
FOTOS = TRAB / "fotos" / FONTE
ZOOM_IN, ZOOM_OUT = ((0.5, 0.5, 1.0), (0.5, 0.47, 1.14)), ((0.5, 0.47, 1.14), (0.5, 0.5, 1.0))
F = lambda nome, mov=ZOOM_IN: ("photo", FOTOS / f"{nome}.jpg", *mov)
if FONTE != "ilustrado":
    fotos = [
        [F("choro-noite")], [F("quarto-noite", ZOOM_OUT)], [F("acorda-chorando")], [F("mae-cansada", ZOOM_OUT)],
        [F("pede-chupeta")], [F("culpa", ZOOM_OUT)], [F("chupeta-close"), F("dentista", ZOOM_OUT)],
        None, [F("janela-tchau")], [F("leitura", ZOOM_OUT)], None, [F("desenho"), F("caixinha", ZOOM_OUT)],
        [F("dormindo")], [F("abraco", ZOOM_OUT)], None, None,
    ]
    ROTEIRO = [(txt, novo or vis) for (txt, vis), novo in zip(ROTEIRO, fotos)]
FUNDO_FINAL = FOTOS / "abraco.jpg" if FONTE != "ilustrado" else STILLS / "leitura.png"


def ff(*args):
    r = subprocess.run(["ffmpeg", "-y", "-v", "error", *map(str, args)], capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr)


def paginas():
    import pypdfium2 as pdfium
    pdf = pdfium.PdfDocument(str(PDF))
    for n in {v[1] for _, vs in ROTEIRO for v in vs if v[0] == "page"}:
        dest = STILLS / f"pagina{n}.png"
        if not dest.exists():
            pdf[n].render(scale=4).to_pil().save(dest)
    return lambda n: STILLS / f"pagina{n}.png"


def narracoes():
    chave = os.environ.get("CARTESIA_API_KEY") or sys.exit("falta CARTESIA_API_KEY")
    res = []
    for i, (txt, _) in enumerate(ROTEIRO):
        wav, js = TRAB / f"v{i:02d}.wav", TRAB / f"v{i:02d}.json"
        if not (js.exists() and json.loads(js.read_text())["texto"] == txt + f"@{VEL}"):
            pcm, palavras = leva.narrar(txt, chave, VOZ, VEL, leva.MODELO_PADRAO)
            seg = len(pcm) / 2 / leva.TAXA
            leva.gravar_wav(wav, pcm, seg)
            js.write_text(json.dumps({"texto": txt + f"@{VEL}", "dur": seg, "palavras": palavras}, ensure_ascii=False))
        res.append(json.loads(js.read_text()))
    return res


def movimento(img, a, b, dur, saida, largura_fg, altura_fg):
    """Zoom/deslocamento suave numa imagem: primeiro plano com o movimento, fundo com a mesma imagem desfocada."""
    n = max(2, round(dur * FPS))
    (cx0, cy0, z0), (cx1, cy1, z1) = a, b
    p = f"(on/{n - 1})"
    ease = f"(0.5-0.5*cos(PI*{p}))"
    z = f"({z0}+({z1}-{z0})*{ease})"
    x = f"(({cx0}+({cx1}-{cx0})*{ease})*iw-iw/{z}/2)"
    y = f"(({cy0}+({cy1}-{cy0})*{ease})*ih-ih/{z}/2)"
    zp = (f"zoompan=z='{z}':x='max(0,min(iw-iw/zoom,{x}))':y='max(0,min(ih-ih/zoom,{y}))':"
          f"d={n}:s={largura_fg}x{altura_fg}:fps={FPS}")
    filtro = (f"[0:v]scale=4000:-2,split[a][b];"
              f"[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,eq=brightness=-0.18,"
              f"loop=loop={n}:size=1,fps={FPS},trim=end_frame={n}[bg];"
              f"[b]{zp}[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p")
    ff("-i", img, "-filter_complex", filtro, "-frames:v", n, "-r", FPS,
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", saida)


def clipe(mp4, dur, saida):
    ff("-stream_loop", "-1", "-i", mp4, "-t", f"{dur:.3f}", "-vf", f"scale={W}:{H},fps={FPS},format=yuv420p",
       "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", saida)


def tela_final(dur, saida):
    n = max(2, round(dur * FPS))
    fundo = FUNDO_FINAL
    filtro = (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=30,eq=brightness=-0.25,"
              f"loop=loop={n}:size=1,fps={FPS},trim=end_frame={n}[bg];[1:v]loop=loop={n}:size=1,trim=end_frame={n}[tx];[bg][tx]overlay=0:0,format=yuv420p")
    ff("-i", fundo, "-i", STILLS / "cta.png", "-filter_complex", filtro, "-frames:v", n,
       "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", saida)


def main():
    TRAB.mkdir(parents=True, exist_ok=True)
    pagina = paginas()
    voz = narracoes()

    gap, t, inicio = 0.1, 0.2, []
    for v in voz:
        inicio.append(t)
        t += v["dur"] + gap
    total = t + 0.9

    # segmentos de vídeo: cada frase cobre do seu início até o início da próxima
    segs, lista = [], TRAB / "lista.txt"
    for i, (_, visuais) in enumerate(ROTEIRO):
        a = 0.0 if i == 0 else inicio[i]
        b = inicio[i + 1] if i + 1 < len(ROTEIRO) else total
        parte = (b - a) / len(visuais)
        for k, vis in enumerate(visuais):
            saida = TRAB / f"{FONTE}_s{i:02d}_{k}.mp4"
            if vis[0] == "still":
                movimento(vis[1], vis[2], vis[3], parte, saida, W, round(W * 0.7) // 2 * 2)
            elif vis[0] == "photo":
                if not vis[1].exists():
                    sys.exit(f"falta a imagem {vis[1]} (rode: python3 src/criativo-l5/fotos.py {FONTE})")
                movimento(vis[1], vis[2], vis[3], parte, saida, W, H)
            elif vis[0] == "page":
                movimento(pagina(vis[1]), vis[2], vis[3], parte, saida, 900, 1276)
            elif vis[0] == "clip":
                clipe(vis[1], parte, saida)
            else:
                tela_final(parte, saida)
            segs.append(saida)
    lista = TRAB / f"lista-{FONTE}.txt"
    lista.write_text("".join(f"file '{s}'\n" for s in segs))
    mudo = TRAB / f"mudo-{FONTE}.mp4"
    ff("-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", mudo)

    # legenda: título no gancho + blocos palavra a palavra (sem legenda na tela final)
    ass = leva.cabecalho_ass("amarela")
    ass += leva.titulo_ass(TITULO, 0.0, inicio[1] - 0.05, y=620)
    for i, v in enumerate(voz[:-1]):
        palavras = [{"t": w["t"], "s": w["s"] + inicio[i], "e": w["e"] + inicio[i]} for w in v["palavras"]]
        fim_frase = inicio[i + 1] - 0.02
        ass += leva.legenda_ass(leva.blocos_auto(palavras), fim_frase, a_partir=inicio[1] - 0.05 if i == 0 else 0.0)
    (TRAB / "legenda.ass").write_text(ass, encoding="utf-8")

    # áudio: narração + música baixa
    ins, filt, mix = ["-stream_loop", "-1", "-i", MUSICA], [f"[0:a]atrim=0:{total:.2f},volume=0.13,afade=t=out:st={total - 1.5:.2f}:d=1.5[m]"], ["[m]"]
    for i in range(len(voz)):
        ins += ["-i", TRAB / f"v{i:02d}.wav"]
        filt.append(f"[{i + 1}:a]adelay={round(inicio[i] * 1000)}:all=1[a{i}]")
        mix.append(f"[a{i}]")
    filt.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first,alimiter=limit=0.95[out]")
    audio = TRAB / "audio.wav"
    ff(*ins, "-filter_complex", ";".join(filt), "-map", "[out]", "-ar", "44100", "-ac", "2", audio)

    final = OUT / f"{NOME}.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mudo.name, "-i", "audio.wav", "-vf", "subtitles=legenda.ass",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                    "-shortest", "-map_metadata", "-1", "-movflags", "+faststart", str(final)], cwd=TRAB, check=True)
    (OUT / f"{NOME}.txt").write_text(f"{NOME}\n\n" + "\n".join(txt for txt, _ in ROTEIRO) + "\n", encoding="utf-8")
    print(f"ok {final} {total:.1f}s")


if __name__ == "__main__":
    main()
