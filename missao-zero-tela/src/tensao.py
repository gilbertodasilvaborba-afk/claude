#!/usr/bin/env python3
"""Gera uma trilha de tensão (drone grave, batida de coração e tique-taque, com subida no fim).
Uso: python3 src/tensao.py saida.wav duracao_em_segundos"""
import sys, wave
import numpy as np

TAXA = 44100
saida, dur = sys.argv[1], float(sys.argv[2])
n = int(dur * TAXA)
t = np.arange(n) / TAXA
rng = np.random.default_rng(7)

# drone grave com batimento (duas notas quase iguais) e uma segunda menor bem baixinha
swell = 0.45 + 0.55 * np.clip(t / dur, 0, 1)
drone = (np.sin(2 * np.pi * 55 * t) + 0.6 * np.sin(2 * np.pi * 110 * t) + 0.5 * np.sin(2 * np.pi * 110.7 * t)
         + 0.18 * np.sin(2 * np.pi * 116.5 * t) + 0.12 * np.sin(2 * np.pi * 164.8 * t))
drone *= swell * (0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t))

# batida de coração (tum-tum), acelerando um pouco até o fim
coracao = np.zeros(n)
pos, k = 0.4, 0
while pos < dur - 0.3:
    for atraso, amp in ((0.0, 1.0), (0.2, 0.65)):
        i0 = int((pos + atraso) * TAXA)
        m = min(n - i0, int(0.18 * TAXA))
        if m <= 0:
            continue
        tt = np.arange(m) / TAXA
        coracao[i0:i0 + m] += amp * np.sin(2 * np.pi * (70 - 25 * tt / 0.18) * tt) * np.exp(-tt * 28)
    pos += 0.9 - 0.25 * (pos / dur)

# tique-taque de relógio
tic = np.zeros(n)
for j, s in enumerate(np.arange(0.25, dur - 0.2, 0.5)):
    i0 = int(s * TAXA)
    m = min(n - i0, int(0.012 * TAXA))
    tt = np.arange(m) / TAXA
    tic[i0:i0 + m] += (1 if j % 2 else 0.7) * np.sin(2 * np.pi * (2200 if j % 2 else 1700) * tt) * np.exp(-tt * 400)

# subida nos últimos 2,2 s (ruído e tom subindo)
sobe = np.zeros(n)
ini = max(0, n - int(2.2 * TAXA))
m = n - ini
tt = np.arange(m) / TAXA
env = (tt / tt[-1]) ** 2
freq = 180 + 700 * (tt / tt[-1]) ** 2
ruido = np.convolve(rng.standard_normal(m), np.ones(12) / 12, mode="same")
sobe[ini:] = env * (0.6 * np.sin(2 * np.pi * np.cumsum(freq) / TAXA) + 0.5 * ruido)

mix = 0.35 * drone + 0.9 * coracao + 0.12 * tic + 0.35 * sobe
fade_in = np.clip(t / 0.6, 0, 1)
fade_out = np.clip((dur - t) / 0.08, 0, 1)
mix *= fade_in * fade_out
mix /= np.sqrt(np.mean(mix ** 2)) / 10 ** (-18 / 20)  # volume médio de -18 dB, igual às outras músicas
mix = np.clip(mix, -0.98, 0.98)
with wave.open(saida, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(TAXA)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", saida, dur)
