"""Gera as narrações dos vídeos orgânicos na Cartesia (usa a função narrar da skill producao-ads).

Lê _trabalho/tts.json ([{id, texto, voz, velocidade}]) e grava _trabalho/<id>.wav
e _trabalho/duracoes.json. Narrações que já existem com o mesmo texto não são refeitas.
"""
import importlib.util
import json
import os
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
TRAB = AQUI.parent.parent / "videos" / "organicos" / "_trabalho"
LEVA = Path(os.environ.get("LEVA_PY", "/root/.claude/skills/synced/2ba233e4-afb5-4a1d-b25d-8f40d91ce18a_dab983a1-62de-483e-9ba4-c11445dfd82f/producao-ads/scripts/leva.py"))

spec = importlib.util.spec_from_file_location("leva", LEVA)
leva = importlib.util.module_from_spec(spec)
spec.loader.exec_module(leva)

chave = os.environ.get("CARTESIA_API_KEY") or sys.exit("falta CARTESIA_API_KEY")
itens = json.loads((TRAB / "tts.json").read_text(encoding="utf-8"))
dur_arq = TRAB / "duracoes.json"
duracoes = json.loads(dur_arq.read_text(encoding="utf-8")) if dur_arq.exists() else {}

for it in itens:
    wav, marca = TRAB / f"{it['id']}.wav", TRAB / f"{it['id']}.txt"
    if wav.exists() and marca.exists() and marca.read_text(encoding="utf-8") == it["texto"] + it["voz"]:
        continue
    pcm, _ = leva.narrar(it["texto"], chave, it["voz"], it.get("velocidade", 1.05), leva.MODELO_PADRAO)
    seg = len(pcm) / 2 / leva.TAXA
    leva.gravar_wav(wav, pcm, seg)
    marca.write_text(it["texto"] + it["voz"], encoding="utf-8")
    duracoes[it["id"]] = round(seg, 3)
    print(f"{it['id']}: {seg:.2f}s")

dur_arq.write_text(json.dumps(duracoes, indent=1), encoding="utf-8")
