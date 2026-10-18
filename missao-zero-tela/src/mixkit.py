#!/usr/bin/env python3
"""Lista vídeos gratuitos do Mixkit (licença livre para uso comercial, sem marca d'água) por tema.
Uso: python3 src/mixkit.py listar saida.json tema1 tema2 ... [--paginas 3]
     python3 src/mixkit.py baixar levas/L16 lista.json id1 id2 ...   (baixa em 720p para cenas/cNN.mp4)"""
import json, re, sys, subprocess, urllib.request
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0"}


def pagina(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def listar(saida, temas, paginas):
    achados = {}
    for tema in temas:
        for p in range(1, paginas + 1):
            url = f"https://mixkit.co/free-stock-video/{tema}/" + (f"?page={p}" if p > 1 else "")
            try:
                h = pagina(url)
            except Exception as e:  # noqa: BLE001
                print("falhou", url, e); break
            novos = 0
            for slug, vid in re.findall(r'href="/free-stock-video/([a-z0-9-]+)-(\d+)/"', h):
                if vid not in achados:
                    achados[vid] = {"id": vid, "titulo": slug.replace("-", " "), "tema": tema}
                    novos += 1
            if not novos:
                break
    Path(saida).write_text(json.dumps(list(achados.values()), ensure_ascii=False, indent=1))
    print(len(achados), "vídeos listados")


def achar_mp4(vid, titulo):
    """720p direto; se não existir, lê o link do vídeo na página dele."""
    for res in ("720", "1080"):
        url = f"https://assets.mixkit.co/videos/{vid}/{vid}-{res}.mp4"
        try:
            urllib.request.urlopen(urllib.request.Request(url, headers=UA, method="HEAD"), timeout=30)
            return url
        except Exception:  # noqa: BLE001
            pass
    try:
        h = pagina(f"https://mixkit.co/free-stock-video/{titulo.replace(' ', '-')}-{vid}/")
    except Exception:  # noqa: BLE001
        return None
    for m in re.finditer(r'"contentUrl":"([^"]+)"', h):
        return m.group(1)
    m = re.search(r'https://assets\.mixkit\.co/[^"\s]+\.mp4', h)
    return m.group(0) if m else None


def baixar(pasta, lista, ids):
    pasta = Path(pasta); dest = pasta / "cenas"; dest.mkdir(parents=True, exist_ok=True)
    info = {x["id"]: x for x in json.loads(Path(lista).read_text())}
    meta = json.loads((dest / "cenas.json").read_text()) if (dest / "cenas.json").exists() else []
    n = max([m["n"] for m in meta], default=0)
    for vid in ids:
        n += 1
        arq = dest / f"c{n:02d}.mp4"
        bruto = dest / f"_m{vid}.mp4"
        url = achar_mp4(vid, info.get(vid, {}).get("titulo", ""))
        if not url:
            print("sem link", vid); n -= 1; continue
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r:
            bruto.write_bytes(r.read())
        # 9:16 a partir do vídeo deitado: corta o centro e sobe para 1080x1920
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(bruto), "-vf",
                        "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920,setsar=1,fps=30",
                        "-an", "-c:v", "libx264", "-crf", "20", "-preset", "fast", str(arq)], check=True)
        bruto.unlink()
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arq)]))
        meta.append({"n": n, "arquivo": arq.name, "duracao": round(d, 2), "fonte": "mixkit", "id": vid,
                     "titulo": info.get(vid, {}).get("titulo", ""), "link": f"https://mixkit.co/free-stock-video/{vid}/"})
        print(n, vid, info.get(vid, {}).get("titulo", ""), round(d, 1), flush=True)
        (dest / "cenas.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    (dest / "cenas.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    if sys.argv[1] == "listar":
        args = sys.argv[3:]
        pag = 3
        if "--paginas" in args:
            i = args.index("--paginas"); pag = int(args[i + 1]); args = args[:i] + args[i + 2:]
        listar(sys.argv[2], args, pag)
    else:
        baixar(sys.argv[2], sys.argv[3], sys.argv[4:])
