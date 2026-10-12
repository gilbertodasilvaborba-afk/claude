"""Busca (Pexels) ou gera (IA) as imagens reais do criativo L5.

  python3 src/criativo-l5/fotos.py pexels   → precisa de PEXELS_API_KEY
  python3 src/criativo-l5/fotos.py ia       → precisa de REPLICATE_API_TOKEN (Flux) ou OPENAI_API_KEY

Saída: videos/criativos/L5/_trab/fotos/<fonte>/<cena>.jpg, mais uma folha de conferência
(_trab/fotos/<fonte>/folha.jpg). No Pexels, cada cena baixa até 6 candidatas (<cena>_1.jpg…);
a escolhida vira <cena>.jpg e pode ser trocada em escolhas.json.
"""
import base64
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ROOT = AQUI.parents[1]
SPEC = json.loads((AQUI / "cenas-fotos.json").read_text(encoding="utf-8"))


def http(url, dados=None, cab=None, timeout=120):
    req = urllib.request.Request(url, data=json.dumps(dados).encode() if dados is not None else None,
                                 headers={"User-Agent": "Mozilla/5.0", **(cab or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def baixar(url, dest):
    dest.write_bytes(http(url))


def folha(pasta, nomes):
    from PIL import Image, ImageDraw
    w, h = 220, 390
    cols = 6
    out = Image.new("RGB", (cols * (w + 6), ((len(nomes) + cols - 1) // cols) * (h + 24)), "black")
    d = ImageDraw.Draw(out)
    for i, n in enumerate(nomes):
        x, y = (i % cols) * (w + 6), (i // cols) * (h + 24)
        try:
            im = Image.open(pasta / f"{n}.jpg").convert("RGB")
            im.thumbnail((w, h))
            out.paste(im, (x + (w - im.width) // 2, y + 22))
        except Exception:
            pass
        d.text((x + 4, y + 4), n, fill="yellow")
    out.save(pasta / "folha.jpg", quality=85)


def pexels():
    chave = os.environ.get("PEXELS_API_KEY") or sys.exit("falta PEXELS_API_KEY no ambiente")
    pasta = ROOT / "videos/criativos/L5/_trab/fotos/pexels"
    pasta.mkdir(parents=True, exist_ok=True)
    escolhas_arq = pasta / "escolhas.json"
    escolhas = json.loads(escolhas_arq.read_text()) if escolhas_arq.exists() else {}
    creditos, nomes = {}, []
    for c in SPEC["cenas"]:
        q = urllib.parse.quote(c["pexels"])
        d = json.loads(http(f"https://api.pexels.com/v1/search?query={q}&orientation=portrait&per_page=6",
                            cab={"Authorization": chave}))
        for k, foto in enumerate(d.get("photos", []), 1):
            dest = pasta / f"{c['id']}_{k}.jpg"
            if not dest.exists():
                baixar(foto["src"]["large2x"], dest)
            creditos[f"{c['id']}_{k}"] = f"{foto['photographer']} / Pexels ({foto['url']})"
            nomes.append(f"{c['id']}_{k}")
        k = escolhas.get(c["id"], 1)
        if (pasta / f"{c['id']}_{k}.jpg").exists():
            (pasta / f"{c['id']}.jpg").write_bytes((pasta / f"{c['id']}_{k}.jpg").read_bytes())
        escolhas.setdefault(c["id"], k)
        print(c["id"], len(d.get("photos", [])), "candidatas")
    escolhas_arq.write_text(json.dumps(escolhas, indent=1))
    (pasta / "creditos.json").write_text(json.dumps(creditos, indent=1, ensure_ascii=False))
    folha(pasta, nomes)


def ia():
    pasta = ROOT / "videos/criativos/L5/_trab/fotos/ia"
    pasta.mkdir(parents=True, exist_ok=True)
    rep, oai = os.environ.get("REPLICATE_API_TOKEN"), os.environ.get("OPENAI_API_KEY")
    if not (rep or oai):
        sys.exit("falta REPLICATE_API_TOKEN ou OPENAI_API_KEY no ambiente")
    for c in SPEC["cenas"]:
        dest = pasta / f"{c['id']}.jpg"
        if dest.exists():
            continue
        prompt = f"{c['ia']}. {SPEC['estilo_ia']}"
        if rep:
            r = json.loads(http("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
                                {"input": {"prompt": prompt, "aspect_ratio": "9:16", "output_format": "jpg", "safety_tolerance": 2}},
                                {"Authorization": f"Bearer {rep}", "Content-Type": "application/json", "Prefer": "wait"}))
            while r.get("status") not in ("succeeded", "failed", "canceled"):
                time.sleep(2)
                r = json.loads(http(r["urls"]["get"], cab={"Authorization": f"Bearer {rep}"}))
            if r["status"] != "succeeded":
                print(c["id"], "falhou:", r.get("error"))
                continue
            out = r["output"][0] if isinstance(r["output"], list) else r["output"]
            baixar(out, dest)
        else:
            r = json.loads(http("https://api.openai.com/v1/images/generations",
                                {"model": "gpt-image-1", "prompt": prompt, "size": "1024x1536", "n": 1},
                                {"Authorization": f"Bearer {oai}", "Content-Type": "application/json"}, timeout=300))
            dest.write_bytes(base64.b64decode(r["data"][0]["b64_json"]))
        print("ok", c["id"])
    folha(pasta, [c["id"] for c in SPEC["cenas"]])


if __name__ == "__main__":
    import urllib.parse  # noqa: E402
    {"pexels": pexels, "ia": ia}.get(sys.argv[1] if len(sys.argv) > 1 else "", lambda: sys.exit(__doc__))()
