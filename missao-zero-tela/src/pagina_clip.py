#!/usr/bin/env python3
"""Transforma páginas do PDF do produto em cenas 9:16 com zoom lento (Ken Burns).
Uso: python3 src/pagina_clip.py saida.mp4 pagina [pagina2 pagina3] [--titulo "Missão Zero Tela"] [--seg 6]
Com uma página: a página inteira, aproximando devagar. Com três: as páginas em leque e o título em cima."""
import sys, subprocess, tempfile
from pathlib import Path
import pymupdf

RAIZ = Path(__file__).resolve().parent.parent
args = sys.argv[1:]
seg = 6.0
titulo = None
if "--seg" in args:
    i = args.index("--seg"); seg = float(args[i + 1]); args = args[:i] + args[i + 2:]
if "--titulo" in args:
    i = args.index("--titulo"); titulo = args[i + 1]; args = args[:i] + args[i + 2:]
saida, paginas = args[0], [int(p) for p in args[1:]]
doc = pymupdf.open(RAIZ / "entregavel" / "missao-zero-tela-completo.pdf")
tmp = Path(tempfile.mkdtemp())
pngs = []
for p in paginas:
    f = tmp / f"p{p}.png"
    doc[p - 1].get_pixmap(dpi=150).save(f)
    pngs.append(f)
fonte = RAIZ / "fonts" / "Baloo2-latin.woff2"
quadros = int(seg * 30)
if len(pngs) == 1:
    fc = (f"color=c=#EAF3FF:s=1080x1920:d={seg}[bg];[0:v]scale=980:-1[pg];[bg][pg]overlay=(W-w)/2:(H-h)/2,"
          f"scale=2160:3840,zoompan=z='1+0.12*on/{quadros}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={quadros}:s=1080x1920:fps=30")
    entradas = ["-loop", "1", "-t", str(seg), "-i", str(pngs[0])]
else:
    entradas = []
    for f in pngs:
        entradas += ["-loop", "1", "-t", str(seg), "-i", str(f)]
    fc = f"color=c=#EAF3FF:s=1080x1920:d={seg}[bg];"
    pos = [(-10, 120, 500), (330, 0, 600), (610, 140, 500)]  # x, y extra, largura
    rot = [-0.12, 0, 0.12]
    ultimo = "bg"
    for k in range(len(pngs)):
        x, dy, w = pos[k]
        fc += (f"[{k}:v]scale={w}:-1,pad=iw+12:ih+12:6:6:color=#1E2A4A,rotate={rot[k]}:c=none:ow=rotw({rot[k]}):oh=roth({rot[k]})[p{k}];"
               f"[{ultimo}][p{k}]overlay={x}:{620 + dy}[o{k}];")
        ultimo = f"o{k}"
    texto = (titulo or "").replace(":", "\\:")
    fc += (f"[{ultimo}]drawtext=fontfile={RAIZ / 'fonts' / 'Baloo2-latin.woff2'}:text='{texto}':fontsize={min(125, int(125 * 16 / max(16, len(titulo or ''))))}:fontcolor=#1E2A4A:borderw=3:bordercolor=#1E2A4A:"
           f"x=(w-tw)/2:y=330,scale=2160:3840,zoompan=z='1+0.08*on/{quadros}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={quadros}:s=1080x1920:fps=30")
subprocess.run(["ffmpeg", "-v", "error", "-y", *entradas, "-filter_complex", fc, "-frames:v", str(quadros),
                "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-an", saida], check=True)
print("ok", saida)
