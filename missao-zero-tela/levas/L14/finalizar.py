"""Pós-produção da L14: trilha de piano de tensão até a virada ("É por isso..."), música alegre depois.
Uso: python3 L14/finalizar.py L14V1 [L14V2 ...]  (rodar de levas/)"""
import json, shutil, subprocess, sys
from pathlib import Path
L = Path(__file__).resolve().parent
S = "/root/.claude/skills/synced/2ba233e4-afb5-4a1d-b25d-8f40d91ce18a_dab983a1-62de-483e-9ba4-c11445dfd82f/producao-ads/scripts/leva.py"
trab = L / "_trabalho"
dura = lambda p: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]))
nomes = sys.argv[1:]
subprocess.run(["python3", S, "montar", str(L), "--videos", *nomes], cwd=L.parent, capture_output=True)
w = json.loads((trab / "c1.voz.json").read_text())["palavras"]
virada = next(p["s"] for p in w if p["t"] == "É")
(L / "final").mkdir(exist_ok=True)
(trab / "voz-sem-musica").mkdir(exist_ok=True)
for n in nomes:
    i = int(n.split("V")[1])
    T = dura(trab / f"g{i}.wav") + virada - 0.08
    tens = trab / f"tensao{i}.wav"
    subprocess.run(["python3", str(L.parent.parent / "src" / "tensao2.py"), str(tens), f"{T + 0.1:.2f}", "piano"], check=True, capture_output=True)
    voz = trab / "voz-sem-musica" / f"{n}.mp4"
    shutil.move(L / "videos" / f"{n}.mp4", voz)
    total = dura(voz)
    d = int(T * 1000)
    fc = (f"[1:a]aresample=44100,aformat=channel_layouts=stereo,volume=0.45[t];"
          f"[2:a]aresample=44100,aformat=channel_layouts=stereo,atrim=9:{9 + total - T + 0.5:.2f},asetpts=PTS-STARTPTS,"
          f"afade=t=in:d=0.25,afade=t=out:st={max(0, total - T - 1.2):.2f}:d=1.2,volume=0.36,adelay={d}|{d}[h];"
          f"[0:a]aformat=channel_layouts=stereo[v];[v][t][h]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.95[a]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(voz), "-i", str(tens), "-i", str(L.parent / "L3/musicas/m02.m4a"),
                    "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(L / "final" / f"{n}.mp4")], check=True)
    print(n, f"virada {T:.1f}s de {total:.1f}s")
