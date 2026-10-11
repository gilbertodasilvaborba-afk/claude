#!/usr/bin/env python3
"""Busca cenas em vídeo no Pinterest (Apify, ator apt_marble~pinterest-video-scraper) e salva na pasta
da leva no mesmo formato do `leva.py cenas`: cenas/cNN.mp4, cenas/cenas.json e a folha.jpg para conferir.

Uso: python3 src/pinterest.py levas/L5 --busca "termo 1" "termo 2" [--max 40] [--pais br]
"""
import argparse
import importlib.util
import json
import os
import shutil
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ATOR = "apt_marble~pinterest-video-scraper"
SKILL = Path("/root/.claude/skills/synced/2ba233e4-afb5-4a1d-b25d-8f40d91ce18a_dab983a1-62de-483e-9ba4-c11445dfd82f/producao-ads/scripts/leva.py")


def carregar_leva():
    spec = importlib.util.spec_from_file_location("leva", SKILL)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def api(url, corpo=None, token=None):
    dados = json.dumps(corpo).encode() if corpo is not None else None
    req = urllib.request.Request(url, data=dados, headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())


def link_mp4(it):
    """O ator devolve o MP4 em campos que variam de nome; pega o primeiro link .mp4 que achar."""
    for k in ("videoUrl", "mp4Url", "mp4", "video_url", "downloadUrl", "url_mp4"):
        v = it.get(k)
        if isinstance(v, str) and ".mp4" in v:
            return v
    achados = []

    def varrer(x):
        if isinstance(x, dict):
            for v in x.values():
                varrer(v)
        elif isinstance(x, list):
            for v in x:
                varrer(v)
        elif isinstance(x, str) and x.startswith("http") and ".mp4" in x:
            achados.append(x)
    varrer(it)
    return achados[0] if achados else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta")
    ap.add_argument("--busca", nargs="+", required=True)
    ap.add_argument("--max", type=int, default=40)
    ap.add_argument("--pais", default="br")
    a = ap.parse_args()
    token = os.environ.get("APIFY_TOKEN") or sys.exit("falta APIFY_TOKEN")
    pasta = Path(a.pasta).resolve()
    dest = pasta / "cenas"
    dest.mkdir(parents=True, exist_ok=True)

    entrada = {"queries": a.busca, "maxVideos": a.max, "minDurationSeconds": 5, "maxDurationSeconds": 90,
               "excludePromoted": True, "country": a.pais}
    print("Buscando no Pinterest:", ", ".join(a.busca), flush=True)
    run = api(f"https://api.apify.com/v2/acts/{ATOR}/runs?waitForFinish=60", entrada, token)["data"]
    while run["status"] in ("READY", "RUNNING"):
        time.sleep(5)
        run = api(f"https://api.apify.com/v2/actor-runs/{run['id']}?waitForFinish=60", token=token)["data"]
    if run["status"] != "SUCCEEDED":
        sys.exit(f"a busca terminou como {run['status']}")
    itens = api(f"https://api.apify.com/v2/datasets/{run['defaultDatasetId']}/items?clean=true&format=json", token=token)
    (pasta / "pinterest-bruto.json").write_text(json.dumps(itens[:3], ensure_ascii=False, indent=1))

    meta = json.loads((dest / "cenas.json").read_text()) if (dest / "cenas.json").exists() else []
    ja = {m.get("id") for m in meta}
    bons = []
    for it in itens:
        mp4 = link_mp4(it)
        pid = str(it.get("id") or it.get("pinId") or mp4)
        if mp4 and pid not in ja:
            ja.add(pid)
            bons.append((pid, mp4, it))
    print(f"Baixando {len(bons)} vídeos", flush=True)
    leva = carregar_leva()
    proximo = max([m["n"] for m in meta], default=0) + 1

    def baixar(n, pid, mp4, it):
        arq = dest / f"c{n:02d}.mp4"
        with urllib.request.urlopen(urllib.request.Request(mp4, headers={"User-Agent": "Mozilla/5.0"}), timeout=240) as r, open(arq, "wb") as f:
            shutil.copyfileobj(r, f)
        d = leva.duracao(arq)
        if d < 3:
            arq.unlink(missing_ok=True)
            return None
        return {"n": n, "arquivo": arq.name, "duracao": round(d, 2), "id": pid, "fonte": "pinterest",
                "busca": it.get("query") or it.get("searchQuery"), "link": it.get("url") or it.get("pinUrl") or it.get("link")}

    with ThreadPoolExecutor(8) as ex:
        fut = [ex.submit(baixar, proximo + i, *b) for i, b in enumerate(bons)]
        for f in as_completed(fut):
            try:
                m = f.result()
                if m:
                    meta.append(m)
            except Exception as e:  # noqa: BLE001
                print(f"um download falhou: {e}", file=sys.stderr)
    meta.sort(key=lambda m: m["n"])
    (dest / "cenas.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    leva.montar_folha(dest, meta)
    print(f"{len(meta)} cenas prontas. Folha: {dest / 'folha.jpg'}")


if __name__ == "__main__":
    main()
