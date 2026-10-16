#!/usr/bin/env python3
"""Gera uma trilha de tensão audível em celular: ostinato de cordas pinçadas, acorde diminuto,
nota aguda com vibrato, batida de coração, tique-taque e subida no fim.
Uso: python3 src/tensao.py saida.wav duracao_em_segundos"""
import sys, wave
import numpy as np

TAXA = 44100
saida, dur = sys.argv[1], float(sys.argv[2])
n = int(dur * TAXA)
t = np.arange(n) / TAXA
rng = np.random.default_rng(7)
prog = np.clip(t / dur, 0, 1)


def tom(freq, m, harm=8, queda=0.0):
    tt = np.arange(m) / TAXA
    s = sum(np.sin(2 * np.pi * freq * k * tt) / k ** 1.3 for k in range(1, harm + 1))
    return s * (np.exp(-tt * queda) if queda else 1)


def soma(dest, i0, sinal):
    m = min(len(sinal), len(dest) - i0)
    if m > 0:
        dest[i0:i0 + m] += sinal[:m]


# ostinato em colcheias (132 bpm), lá-lá-sib-lá, ficando mais forte
ost = np.zeros(n)
passo = 60 / 132 / 2
notas = [220.0, 220.0, 233.08, 220.0, 220.0, 220.0, 207.65, 220.0]
for j, s in enumerate(np.arange(0.0, dur, passo)):
    m = int(0.32 * TAXA)
    soma(ost, int(s * TAXA), tom(notas[j % 8], m, harm=7, queda=11) * (1.0 if j % 4 == 0 else 0.7))
ost *= 0.55 + 0.45 * prog

# acorde diminuto sustentado (lá, dó, mi bemol) com tremolo
pad = sum(tom(f, n, harm=8) for f in (220.0, 261.63, 311.13)) / 3
pad *= np.clip(t / 2.5, 0, 1) * (0.85 + 0.15 * np.sin(2 * np.pi * 5.5 * t)) * (0.4 + 0.6 * prog)

# nota aguda com vibrato entrando na segunda metade
vib = 659.25 * (1 + 0.006 * np.sin(2 * np.pi * 5 * t))
agudo = np.sin(2 * np.pi * np.cumsum(vib) / TAXA) + 0.3 * np.sin(4 * np.pi * np.cumsum(vib) / TAXA)
agudo *= np.clip((prog - 0.45) / 0.3, 0, 1) * 0.5

# batida de coração com harmônicos (para aparecer no alto-falante do celular)
cor = np.zeros(n)
pos = 0.3
while pos < dur - 0.3:
    for atraso, amp in ((0.0, 1.0), (0.19, 0.6)):
        m = int(0.16 * TAXA)
        tt = np.arange(m) / TAXA
        bate = sum(np.sin(2 * np.pi * f * tt) / k for k, f in enumerate((70, 140, 210, 280), 1)) * np.exp(-tt * 30)
        soma(cor, int((pos + atraso) * TAXA), amp * bate)
    pos += 0.95 - 0.3 * (pos / dur)

# tique-taque
tic = np.zeros(n)
for j, s in enumerate(np.arange(0.25, dur - 0.2, 0.5)):
    m = int(0.015 * TAXA)
    tt = np.arange(m) / TAXA
    soma(tic, int(s * TAXA), np.sin(2 * np.pi * (2200 if j % 2 else 1700) * tt) * np.exp(-tt * 300))

# subida nos últimos 2,2 s
sobe = np.zeros(n)
ini = max(0, n - int(2.2 * TAXA))
m = n - ini
tt = np.arange(m) / TAXA
env = (tt / tt[-1]) ** 2
freq = 300 + 900 * (tt / tt[-1]) ** 2
ruido = np.convolve(rng.standard_normal(m), np.ones(6) / 6, mode="same")
sobe[ini:] = env * (0.7 * np.sin(2 * np.pi * np.cumsum(freq) / TAXA) + 0.6 * ruido)

mix = 0.55 * ost + 0.35 * pad + 0.25 * agudo + 0.45 * cor + 0.2 * tic + 0.5 * sobe
mix *= np.clip(t / 0.4, 0, 1) * np.clip((dur - t) / 0.08, 0, 1)
mix /= np.sqrt(np.mean(mix ** 2)) / 10 ** (-18 / 20)
mix = np.clip(mix, -0.98, 0.98)
with wave.open(saida, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(TAXA)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", saida, dur)
