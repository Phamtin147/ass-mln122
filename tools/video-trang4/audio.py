"""Nhạc nền + hiệu ứng âm thanh cho video trang 4 (tổng hợp, không dùng mẫu có bản quyền).
Dùng: python3 audio.py <file wav ra>
"""
import math
import sys
import wave

import numpy as np

SR = 44100
DUR = 26.0
N = int(SR * DUR)
rng = np.random.default_rng(4)
L = np.zeros(N, np.float32)
R = np.zeros(N, np.float32)

def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def env_adsr(n, a, r):
    e = np.ones(n, np.float32)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * math.cos((pan + 1) * math.pi / 4)
    R[i:i + len(sig)] += sig * math.sin((pan + 1) * math.pi / 4)

def tt(d):
    return np.arange(int(d * SR), dtype=np.float32) / SR

# ---------- đệm (pad) theo hợp âm ----------
CHORDS = [  # (bắt đầu, độ dài, nốt midi)
    (1.2, 3.4, [48, 55, 59, 64]),      # Cmaj7
    (4.6, 2.8, [45, 52, 55, 60, 64]),  # Am7
    (7.2, 2.3, [41, 48, 52, 57, 64]),  # Fmaj7
    (9.5, 2.3, [43, 50, 55, 59, 64]),  # G6
    (11.8, 2.2, [48, 55, 60, 64, 67]), # C
    (14.0, 2.2, [40, 47, 52, 55, 62]), # Em7
    (16.2, 2.7, [41, 48, 53, 57, 64]), # Fmaj7
    (18.9, 2.8, [43, 50, 55, 60, 62]), # Gsus
    (21.6, 4.2, [36, 48, 55, 60, 64, 67, 72]),  # C kết
]
for (st, d, notes) in CHORDS:
    t = tt(d + 1.2)
    sig = np.zeros_like(t)
    for k, m in enumerate(notes):
        f = note(m)
        trem = 1 + 0.06 * np.sin(2 * np.pi * 0.25 * t + k)
        sig += (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t + 0.3) + 0.08 * np.sin(2 * np.pi * 3.01 * f * t)) * trem
    sig *= env_adsr(len(t), 0.9, 1.4) * 0.045
    add(sig, st, pan=-0.15)
    add(sig * 0.9, st + 0.013, pan=0.2)

# ---------- rải nốt (đàn gảy nhẹ) ----------
def pluck(m, d=1.6, bright=1.0):
    t = tt(d)
    f = note(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * bright * np.sin(2 * np.pi * 2 * f * t) + 0.12 * bright * np.sin(2 * np.pi * 3 * f * t)
    return (s * np.exp(-t * 3.2) * env_adsr(len(t), 0.004, 0.05)).astype(np.float32)

for (st, d, notes) in CHORDS:
    seq = [m + 24 for m in notes[1:]] + [notes[1] + 36]
    step = 0.42
    k = 0
    tcur = st + 0.2
    while tcur < st + d - 0.1:
        m = seq[k % len(seq)]
        add(pluck(m), tcur, pan=0.35 * math.sin(k), gain=0.05)
        tcur += step
        k += 1

# ---------- hiệu ứng ----------
def click():
    n = int(0.018 * SR)
    s = rng.standard_normal(n).astype(np.float32)
    s = np.diff(np.concatenate([[0], s]))  # bỏ trầm
    return s * np.exp(-np.arange(n) / (0.004 * SR)) * 0.5

def ping(f, d=0.12, g=1.0):
    t = tt(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 28) * g).astype(np.float32)

def blip():
    t = tt(0.14)
    f = 520 + 520 * (t / 0.14)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 22) * 0.5).astype(np.float32)

def chime(notes, gap=0.07, g=0.5):
    out = np.zeros(int((gap * len(notes) + 1.4) * SR), np.float32)
    for i, m in enumerate(notes):
        p = pluck(m, 1.2, bright=0.4) * g
        j = int(i * gap * SR)
        out[j:j + len(p)] += p
    return out

def scratch(d):
    n = int(d * SR)
    s = rng.standard_normal(n).astype(np.float32)
    s = np.diff(np.concatenate([[0], s]))
    k = np.ones(6, np.float32) / 6
    s = np.convolve(s, k, mode='same')
    t = np.arange(n) / SR
    amp = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 3.1 * t)) * (0.6 + 0.4 * rng.random(n).astype(np.float32))
    return (s * amp * env_adsr(n, 0.05, 0.2) * 0.22).astype(np.float32)

def whoosh(d, up=True):
    n = int(d * SR)
    s = rng.standard_normal(n).astype(np.float32)
    k = np.ones(40, np.float32) / 40
    s = np.convolve(s, k, mode='same')
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return (s * e * 0.35).astype(np.float32)

# vệt sáng mở đầu
add(whoosh(1.2), 1.0, pan=-0.3, gain=0.6)
add(chime([84, 88, 91]), 1.3, gain=0.35)
# tiếng bút "tách... tách"
for t0 in (2.35, 2.55, 3.05, 3.25):
    add(click(), t0, pan=0.3, gain=0.7)
# các nút mạng sáng lên
for i in range(12):
    add(ping(1600 + 90 * i, g=0.12), 2.6 + i * 0.09, pan=-0.4 + 0.07 * i)
# bong bóng thoại bật lên
for t0 in (2.4, 4.6, 7.5, 8.0, 8.9, 11.9, 12.9, 13.3, 16.5, 18.2, 19.2):
    add(blip(), t0, gain=0.35)
# "kéo lê" khi ô cửa được tô sáng
add(scratch(1.5), 7.7, pan=-0.2)
# chấm vàng sáng
add(chime([79, 83, 86], gap=0.09, g=0.4), 9.2, pan=-0.2)
# "OÁC!" Đốm loé sáng
t = tt(0.16)
f = 260 + 1100 * (t / 0.16) ** 1.5
add((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.45).astype(np.float32), 12.9, pan=0.3)
add(chime([84, 88, 91, 96], gap=0.06, g=0.55), 13.0, pan=0.3)
# Đốm nói "Nhà mình vẫn phải sáng chứ!"
add(chime([76, 79, 84], gap=0.12, g=0.45), 20.0, pan=-0.1)
# kết: lấp lánh
add(whoosh(1.4), 21.4, gain=0.5)
for i, m in enumerate([84, 88, 91, 96, 100]):
    add(pluck(m, 1.8, 0.3), 21.9 + i * 0.11, pan=-0.5 + 0.25 * i, gain=0.08)

# ---------- vang (delay đơn giản) ----------
def echo(x, d, fb, mix):
    y = x.copy()
    n = int(d * SR)
    for _ in range(5):
        y[n:] += y[:-n] * fb
    return x * (1 - mix) + y * mix

L = echo(L, 0.29, 0.32, 0.35)
R = echo(R, 0.33, 0.32, 0.35)

# lặng dần ở cuối để video lặp liền mạch
fade = np.ones(N, np.float32)
fs = int(24.8 * SR)
fade[fs:] = np.linspace(1, 0, N - fs) ** 1.5
L *= fade
R *= fade

peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89
data = np.stack([L, R], axis=1)
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((data * 32767).astype(np.int16).tobytes())
print('ok', sys.argv[1])
