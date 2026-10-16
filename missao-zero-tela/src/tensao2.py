#!/usr/bin/env python3
"""Outras trilhas de tensão sintetizadas, audíveis em celular.
  piano  : piano de suspense (nota repetida acelerando, acordes graves em menor, sininho agudo, relógio)
  cinema : trailer (batidas graves com ataque, cordas em staccato subindo, sopro de ruído, relógio)
Uso: python3 src/tensao2.py saida.wav duracao estilo"""
import sys, wave
import numpy as np

TAXA = 44100
saida, dur, estilo = sys.argv[1], float(sys.argv[2]), sys.argv[3]
n = int(dur * TAXA)
t = np.arange(n) / TAXA
prog = np.clip(t / dur, 0, 1)
rng = np.random.default_rng(3)


def soma(dest, i0, s):
    m = min(len(s), len(dest) - i0)
    if m > 0:
        dest[i0:i0 + m] += s[:m]


def piano(f, seg, vel=1.0):
    tt = np.arange(int(seg * TAXA)) / TAXA
    s = np.zeros_like(tt)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)  # leve inarmonicidade de corda
        s += np.sin(2 * np.pi * fk * tt) / k ** 1.1 * np.exp(-tt * (1.5 + 0.9 * k))
    ataque = np.clip(tt / 0.004, 0, 1)
    return vel * s * ataque


def corda(f, seg):
    tt = np.arange(int(seg * TAXA)) / TAXA
    s = sum(np.sin(2 * np.pi * f * k * tt) / k for k in range(1, 10))
    return s * np.clip(tt / 0.01, 0, 1) * np.exp(-tt * 9)


def relogio(dest, vol):
    for j, s in enumerate(np.arange(0.25, dur - 0.2, 0.5)):
        tt = np.arange(int(0.014 * TAXA)) / TAXA
        soma(dest, int(s * TAXA), vol * np.sin(2 * np.pi * (2300 if j % 2 else 1800) * tt) * np.exp(-tt * 320))


def subida(dest, vol, seg=2.0, f0=350, f1=1300):
    m = int(seg * TAXA)
    tt = np.arange(m) / TAXA
    env = (tt / tt[-1]) ** 2.2
    fr = f0 + (f1 - f0) * (tt / tt[-1]) ** 2
    ruido = np.convolve(rng.standard_normal(m), np.ones(5) / 5, mode="same")
    soma(dest, n - m, vol * env * (0.7 * np.sin(2 * np.pi * np.cumsum(fr) / TAXA) + 0.5 * ruido))


mix = np.zeros(n)
if estilo == "piano":
    # mi4 repetido, acelerando de semínima para colcheia
    s = 0.2
    while s < dur - 0.25:
        p = s / dur
        soma(mix, int(s * TAXA), piano(329.63, 0.9, 0.55 + 0.35 * p))
        s += 0.62 - 0.32 * p
    # acordes graves em lá menor com segunda menor (lá2, mi3, sib3) a cada 2,4 s
    for j, s in enumerate(np.arange(0.2, dur - 1.0, 2.4)):
        for f in ((110.0, 164.81, 233.08) if j % 2 == 0 else (103.83, 155.56, 220.0)):
            soma(mix, int(s * TAXA), piano(f, 2.6, 0.9))
    # sininho agudo de vez em quando
    for s in np.arange(1.4, dur - 1.0, 3.6):
        soma(mix, int(s * TAXA), piano(1318.5, 1.6, 0.25))
    relogio(mix, 0.25)
    subida(mix, 0.6)
else:  # cinema
    # batidas graves com ataque (impacto) a cada compasso, depois a cada meio compasso
    s = 0.15
    while s < dur - 0.3:
        tt = np.arange(int(0.9 * TAXA)) / TAXA
        f = 95 * np.exp(-tt * 6) + 45
        bate = np.sin(2 * np.pi * np.cumsum(f) / TAXA) * np.exp(-tt * 5)
        bate += 0.6 * np.convolve(rng.standard_normal(len(tt)), np.ones(3) / 3, mode="same") * np.exp(-tt * 40)
        bate += 0.5 * np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 12)
        soma(mix, int(s * TAXA), 0.9 * bate)
        s += 1.8 if s < dur * 0.5 else 0.9
    # cordas em staccato, em semicolcheias, subindo de meio em meio tom a cada 4 s
    base = 146.83  # ré3
    passo = 60 / 120 / 4
    for j, s in enumerate(np.arange(0.15, dur - 0.2, passo)):
        f = base * 2 ** (int(s // 4) / 12)
        soma(mix, int(s * TAXA), (0.5 if j % 4 else 0.8) * (0.4 + 0.6 * s / dur) * corda(f * (2 if j % 8 == 7 else 1), 0.18))
    relogio(mix, 0.2)
    subida(mix, 0.7, seg=2.4)

mix *= np.clip(t / 0.3, 0, 1) * np.clip((dur - t) / 0.08, 0, 1)
mix /= np.sqrt(np.mean(mix ** 2)) / 10 ** (-18 / 20)
mix = np.clip(mix, -0.98, 0.98)
with wave.open(saida, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(TAXA)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", saida, estilo, dur)
