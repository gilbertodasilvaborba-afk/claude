#!/usr/bin/env python3
"""Dá tom de pergunta a uma palavra da narração (sobe o tom no fim dela, com Praat/PSOLA).
Uso: from pergunta import subir; subir(raw_entrada, raw_saida, inicio, fim, fator=1.18)"""
import numpy as np
import parselmouth
from parselmouth.praat import call

TAXA = 44100


def subir(entrada, saida, s, e, fat=1.18, pico=1.0):
    x = np.frombuffer(open(entrada, "rb").read(), dtype=np.int16).astype(np.float64) / 32768
    e = e + 0.08
    a, b = max(0, int((s - 0.35) * TAXA)), min(len(x), int((e + 0.35) * TAXA))
    snd = parselmouth.Sound(x[a:b], TAXA)
    man = call(snd, "To Manipulation", 0.01, 75, 600)
    pt = call(man, "Extract pitch tier")
    pts = [(call(pt, "Get time from index", i), call(pt, "Get value at index", i))
           for i in range(1, call(pt, "Get number of points") + 1)]
    call(pt, "Remove points between", 0, snd.duration)
    s0 = s - a / TAXA
    e0 = s0 + (e - s)
    dur = e0 - s0
    for t, f in pts:
        if t < s0 + 0.25 * dur or t > e0 + 0.12:
            k = 1.0
        elif t > e0:
            k = 1 + (fat - 1) * 0.65 * (1 - (t - e0) / 0.12)
        else:
            r = (t - (s0 + 0.25 * dur)) / (0.75 * dur)
            k = 1 + (fat - 1) * min(1, r / pico) if r <= pico else fat - (fat - 1) * 0.35 * min(1, (r - pico) / max(1e-6, 1 - pico))
        call(pt, "Add point", t, f * k)
    call([pt, man], "Replace pitch tier")
    novo = call(man, "Get resynthesis (overlap-add)").values[0][:b - a]
    seg = x[a:b].copy()
    fade = int(0.03 * TAXA)
    r = np.linspace(0, 1, fade)
    seg[fade:-fade] = novo[fade:-fade]
    seg[:fade] = x[a:a + fade] * (1 - r) + novo[:fade] * r
    seg[-fade:] = novo[-fade:] * (1 - r) + x[b - fade:b] * r
    x[a:b] = seg
    open(saida, "wb").write((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
