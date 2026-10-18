"""Pós-produção da L13: tom de pergunta, remontagem e trilha tensão -> alívio em cada vídeo."""
import json, shutil, subprocess, sys
from pathlib import Path
L = Path(__file__).resolve().parent
sys.path.insert(0, str(L.parent.parent / "src"))
from pergunta import subir
S = "/root/.claude/skills/synced/2ba233e4-afb5-4a1d-b25d-8f40d91ce18a_dab983a1-62de-483e-9ba4-c11445dfd82f/producao-ads/scripts/leva.py"
cfg = json.loads((L / "leva.json").read_text())
trab = L / "_trabalho"
dura = lambda p: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]))

def indice(roteiro, marca, ultima):
    k = 0
    for t in roteiro:
        n = len(t["texto"].split())
        if t.get("marca") == marca:
            return k + n - 1 if ultima else k
        k += n

# 1. tom de pergunta
for ci, c in enumerate(cfg["corpos"], 1):
    raw, orig = trab / f"c{ci}.raw", trab / f"c{ci}.raw.orig"
    if not orig.exists():
        shutil.copy(raw, orig)
    w = json.loads((trab / f"c{ci}.voz.json").read_text())["palavras"]
    p = w[indice(c["roteiro"], "pergunta", True)]
    subir(orig, raw, p["s"], p["e"])
    print("pergunta", ci, p["t"])
    (trab / f"c{ci}.sig").unlink(missing_ok=True)
nomes = ["L15V1"]
for n in nomes:
    (trab / f"{n}.final.sig").unlink(missing_ok=True)
subprocess.run(["python3", S, "montar", str(L), "--videos", *nomes], cwd=L.parent, capture_output=True)

# 2. música: tensão até a virada, alegre depois
(L / "final").mkdir(exist_ok=True)
for i, n in enumerate(nomes, 1):
    c = cfg["corpos"][i - 1]
    w = json.loads((trab / f"c{i}.voz.json").read_text())["palavras"]
    T = dura(trab / f"g{i}.wav") + w[indice(c["roteiro"], "virada", False)]["s"] - 0.08
    estilo = "piano"
    tens = trab / f"tensao{i}.wav"
    subprocess.run(["python3", str(L.parent.parent / "src" / "tensao2.py"), str(tens), f"{T + 0.1:.2f}", estilo], check=True)
    voz = trab / f"{n}-sem-musica.mp4"
    shutil.copy(L / "videos" / f"{n}.mp4", voz)
    total = dura(voz)
    d = int(T * 1000)
    fc = (f"[1:a]aresample=44100,aformat=channel_layouts=stereo,volume=0.45[t];"
          f"[2:a]aresample=44100,aformat=channel_layouts=stereo,atrim=9:{9 + total - T + 0.5:.2f},asetpts=PTS-STARTPTS,"
          f"afade=t=in:d=0.25,afade=t=out:st={max(0, total - T - 1.2):.2f}:d=1.2,volume=0.36,adelay={d}|{d}[h];"
          f"[0:a]aformat=channel_layouts=stereo[v];[v][t][h]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.95[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(voz), "-i", str(tens), "-i", str(L.parent / "L3/musicas/m02.m4a"),
                    "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(L / "final" / f"L15V{i}.mp4")], check=True)
    print(n, "->", f"L15V{i}.mp4", estilo, f"virada {T:.1f}s de {total:.1f}s")
