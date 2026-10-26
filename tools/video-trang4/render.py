"""
Video "Trang 4 sống dậy" cho AR (Giữ Một Đốm Sáng: Vòm-9, MLN122).

Khung hình đúng bằng trang in (896x1200): bắt đầu và kết thúc bằng chính trang 4
để khi phát đè lên giấy thì liền mạch. Ở giữa, từng khung tranh lần lượt sáng lên,
máy quay đẩy nhẹ, mạng Nếp Sáng chạy tín hiệu, ô cửa méo được tô sáng, Đốm lấp lánh,
các lời thoại bật lên, Đốm nói "Nhà mình vẫn phải sáng chứ!", rồi thẻ kết.

Dùng: python3 render.py <ảnh trang 4> <thư mục font> <file video ra (không tiếng)>
"""
import math
import random
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC, FONTS, OUT = sys.argv[1:4]
FPS = 24
DUR = 26.0
W, H = 896, 1200
random.seed(7)

page = Image.open(SRC).convert('RGB')
assert page.size == (W, H)
PAGE = np.asarray(page).astype(np.float32)

# Khung tranh (toạ độ trang, phần bên trong viền đen)
PANELS = {
    'p1': (34, 44, 861, 390),
    'p2': (34, 417, 442, 734),
    'p3': (458, 417, 861, 734),
    'p4': (34, 757, 861, 1165),
}

# Lịch: khung nào sáng, đẩy máy vào đâu, bao nhiêu
SECTIONS = [
    # (panel, start, end, zoom tâm (toạ độ trang), mức zoom)
    ('p1', 2.0, 7.2, (410, 268), 1.12),
    ('p2', 7.2, 11.6, (222, 575), 1.14),
    ('p3', 11.6, 16.0, (650, 585), 1.10),
    ('p4', 16.0, 21.6, (330, 1000), 1.08),
]
FINALE = (21.6, 24.6)  # mọi khung sáng, thẻ kết
END_STATIC = 25.4      # từ đây trở về đúng trang in

# Bong bóng thoại có sẵn trên tranh: (khung, hộp, thời điểm bật)
BUBBLES = [
    ('p1', (268, 106, 454, 160), 2.4),   # SFX TÁCH... TÁCH
    ('p1', (54, 264, 223, 373), 4.6),    # *Nếp Sáng... một giấc mơ nhỏ bé...*
    ('p2', (40, 420, 267, 466), 7.5),    # *Góc nhỏ của mẹ...*
    ('p2', (258, 682, 428, 726), 8.0),   # SFX KÉO LÊ
    ('p2', (74, 464, 183, 501), 8.9),    # (Mẹ ơi...)
    ('p3', (464, 419, 793, 471), 11.9),  # *Và Đốm, người bạn kỳ diệu...
    ('p3', (472, 674, 603, 708), 12.9),  # SFX OÁC!
    ('p3', (709, 677, 863, 731), 13.3),  # ÁNH SÁNG!
    ('p4', (49, 780, 378, 918), 16.5),   # Mẹ đã luôn làm việc chăm chỉ...
    ('p4', (661, 790, 811, 873), 18.2),  # Vì nếp sống bình yên...
    ('p4', (737, 1120, 848, 1151), 19.2),  # (Mẹ ơi...)
]

# Mạng nơ-ron vẽ trên giấy (khung 1)
NODES = {
    'N1': (360, 223), 'N2': (422, 215), 'N3': (493, 222), 'N4': (381, 248), 'N5': (447, 245),
    'N6': (397, 270), 'N7': (473, 277), 'N8': (410, 290), 'N9': (436, 318),
    'I1': (327, 268), 'I2': (346, 294), 'I3': (367, 322),
}
CHAINS = [
    ['I1', 'N4', 'N5', 'N7'], ['I2', 'N6', 'N7'], ['I3', 'N8', 'N9', 'N7'], ['N1', 'N2', 'N3'],
    ['I1', 'N6', 'N5', 'N3'], ['I2', 'N8', 'N7'], ['N1', 'N4', 'N6', 'N9'], ['I3', 'N9', 'N7'],
]

# Ô cửa méo (khung 2): khung ngoài và hai chấm vàng
WINDOW = [(138, 542), (250, 493), (300, 600), (200, 653)]
MULLIONS = [((200, 527), (247, 620)), ((173, 593), (222, 571))]
DOTS = [((244, 542), 10), ((237, 570), 6)]

LAMP1 = (225, 72)
DOM3 = (650, 585)
DOM4 = (286, 1049)
LAMP4 = (148, 978)

# ------------------------------------------------------------------ tiện ích
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)

def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3

def back_out(x):
    x = clamp(x)
    s = 2.2
    return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2

def phase(t, a, d):
    return clamp((t - a) / d)

_glow_cache = {}
def glow_kernel(r):
    r = max(2, int(r))
    if r not in _glow_cache:
        y, x = np.mgrid[-r:r + 1, -r:r + 1].astype(np.float32)
        d = np.sqrt(x * x + y * y) / r
        k = np.clip(1 - d, 0, 1) ** 2.2
        _glow_cache[r] = k[..., None]
    return _glow_cache[r]

def add_glow(img, cx, cy, r, color, amount):
    """Cộng ánh sáng (additive) vào mảng float img (h, w, 3)."""
    if amount <= 0.002:
        return
    k = glow_kernel(r)
    rr = k.shape[0] // 2
    cx, cy = int(round(cx)), int(round(cy))
    h, w = img.shape[:2]
    x0, y0, x1, y1 = cx - rr, cy - rr, cx + rr + 1, cy + rr + 1
    kx0, ky0 = max(0, -x0), max(0, -y0)
    kx1, ky1 = k.shape[1] - max(0, x1 - w), k.shape[0] - max(0, y1 - h)
    x0, y0, x1, y1 = max(0, x0), max(0, y0), min(w, x1), min(h, y1)
    if x1 <= x0 or y1 <= y0:
        return
    img[y0:y1, x0:x1] += k[ky0:ky1, kx0:kx1] * (np.array(color, np.float32) * amount)

def font(name, size):
    return ImageFont.truetype(f'{FONTS}/{name}.ttf', size)

# Ngôi sao lấp lánh 4 cánh
def star_sprite(size):
    s = size * 4
    im = Image.new('L', (s, s), 0)
    d = ImageDraw.Draw(im)
    c = s / 2
    d.polygon([(c, 0), (c + s * 0.07, c), (c, s), (c - s * 0.07, c)], fill=255)
    d.polygon([(0, c), (c, c - s * 0.07), (s, c), (c, c + s * 0.07)], fill=255)
    im = im.filter(ImageFilter.GaussianBlur(s * 0.02)).resize((size, size), Image.LANCZOS)
    return np.asarray(im).astype(np.float32)[..., None] / 255.0

STARS = {s: star_sprite(s) for s in (10, 14, 18, 24, 30)}

def add_star(img, cx, cy, size, color, amount):
    if amount <= 0.01:
        return
    size = min(STARS, key=lambda s: abs(s - size))
    k = STARS[size]
    r = size // 2
    x0, y0 = int(cx) - r, int(cy) - r
    h, w = img.shape[:2]
    if x0 < 0 or y0 < 0 or x0 + size > w or y0 + size > h:
        return
    img[y0:y0 + size, x0:x0 + size] += k * (np.array(color, np.float32) * amount)
    add_glow(img, cx, cy, size * 0.9, color, amount * 0.35)

def sparkles(n, cx, cy, rx, ry, seed):
    rnd = random.Random(seed)
    return [(cx + rnd.uniform(-rx, rx), cy + rnd.uniform(-ry, ry), rnd.choice([10, 14, 18, 24]), rnd.uniform(0, 6.28), rnd.uniform(1.5, 3.2)) for _ in range(n)]

SPARK3 = sparkles(16, DOM3[0], DOM3[1] - 20, 150, 120, 3)
SPARK4 = sparkles(9, DOM4[0], DOM4[1] - 10, 70, 60, 4)

def panel_brightness(name, t):
    """1 = sáng hẳn; các khung khác mờ đi khi một khung đang được kể."""
    base = 1.0 - 0.55 * ease(phase(t, 1.4, 0.6))
    base = base + (1 - base) * ease(phase(t, FINALE[0] - 0.2, 0.6))
    lit = 0.0
    for (p, a, b, _, _) in SECTIONS:
        if p == name:
            lit = max(lit, ease(phase(t, a - 0.35, 0.45)) * (1 - ease(phase(t, b - 0.1, 0.45))))
    return base + (1 - base) * lit

def panel_zoom(name, t):
    for (p, a, b, c, z) in SECTIONS:
        if p == name and a - 0.3 <= t <= b + 0.6:
            grow = ease(phase(t, a - 0.3, b - a))
            back = ease(phase(t, b - 0.2, 0.8))
            return 1 + (z - 1) * grow * (1 - back), c
    return 1.0, None

def bubble_scale(appear, t):
    if t < appear:
        return 1.0
    k = phase(t, appear, 0.45)
    return 1 + 0.16 * math.sin(math.pi * k) * (1 - 0.3 * k)

# Bong bóng mới của Đốm (vẽ theo phong cách thoại trên tranh)
def make_new_bubble(text, f, pad=(16, 10)):
    tw, th = f.getbbox(text)[2], f.getbbox(text)[3]
    bw, bh = tw + pad[0] * 2, th + pad[1] * 2 + 4
    tail = 22
    im = Image.new('RGBA', (bw + 8, bh + tail + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([4, 4, 4 + bw, 4 + bh], radius=14, fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=3)
    tx = 4 + int(bw * 0.72)
    d.polygon([(tx - 12, 4 + bh - 2), (tx + 22, 4 + bh + tail), (tx + 10, 4 + bh - 2)], fill=(255, 255, 255, 255))
    d.line([(tx - 12, 4 + bh - 1), (tx + 22, 4 + bh + tail), (tx + 10, 4 + bh - 1)], fill=(20, 20, 20, 255), width=3)
    d.text((4 + pad[0], 4 + pad[1] - 2), text, font=f, fill=(15, 15, 15, 255))
    return im

NEW_BUBBLE = make_new_bubble('Nhà mình vẫn phải sáng chứ!', font('BeVietnamPro-Bold', 21))
NEW_BUBBLE_AT = (DOM4[0] - int(NEW_BUBBLE.width * 0.74) - 4, DOM4[1] - 52 - NEW_BUBBLE.height)
NEW_BUBBLE_T = 20.0

# Thẻ kết
def make_title_card():
    w, h = 760, 214
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=22, fill=(8, 20, 32, 232), outline=(255, 210, 63, 255), width=3)
    d.text((w / 2, 30), 'MLN122 · CHƯƠNG 4', font=font('BeVietnamPro-Bold', 18), fill=(62, 230, 255, 255), anchor='mt')
    d.text((w / 2, 60), 'DỰ ÁN NẾP SÁNG', font=font('BeVietnamPro-ExtraBold', 50), fill=(255, 210, 63, 255), anchor='mt')
    d.text((w / 2, 124), 'Nhà mình vẫn phải sáng chứ.', font=font('BeVietnamPro-Bold', 27), fill=(255, 255, 255, 255), anchor='mt')
    d.text((w / 2, 168), 'Ý tưởng và dấu riêng này là thành quả lao động của Minh và Đốm.', font=font('BeVietnamPro-SemiBold', 18), fill=(200, 214, 224, 255), anchor='mt')
    return im

TITLE = make_title_card()

def paste_rgba(dst, img, x, y, alpha=1.0):
    """Dán ảnh RGBA lên mảng float."""
    a = np.asarray(img).astype(np.float32) / 255.0
    rgb, al = a[..., :3] * 255.0, a[..., 3:4] * alpha
    h, w = dst.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(w, x + img.width), min(h, y + img.height)
    if x1 <= x0 or y1 <= y0:
        return
    sx0, sy0 = x0 - x, y0 - y
    sl = (slice(sy0, sy0 + y1 - y0), slice(sx0, sx0 + x1 - x0))
    dst[y0:y1, x0:x1] = dst[y0:y1, x0:x1] * (1 - al[sl]) + rgb[sl] * al[sl]

# ------------------------------------------------------------------ dựng từng khung hình
def render_panel(name, t):
    x0, y0, x1, y1 = PANELS[name]
    pw, ph = x1 - x0, y1 - y0
    tile = PAGE[y0:y1, x0:x1].copy()

    def L(p):  # toạ độ trang -> toạ độ trong khung
        return p[0] - x0, p[1] - y0

    # bong bóng bật lên (vẽ lên bản trong khung trước khi zoom)
    for (pn, box, at) in BUBBLES:
        if pn != name:
            continue
        s = bubble_scale(at, t)
        if s <= 1.001:
            continue
        bx0, by0, bx1, by1 = box
        crop = page.crop(box)
        nw, nh = int(crop.width * s), int(crop.height * s)
        big = crop.resize((nw, nh), Image.BICUBIC)
        cx, cy = (bx0 + bx1) / 2 - x0, (by0 + by1) / 2 - y0
        px = int(clamp(cx - nw / 2, 0, max(0, pw - nw)))  # giữ bong bóng trong khung
        py = int(clamp(cy - nh / 2, 0, max(0, ph - nh)))
        shadow = Image.new('RGBA', (nw + 16, nh + 16), (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rounded_rectangle([8, 8, nw + 8, nh + 8], radius=12, fill=(0, 0, 0, 90))
        shadow = shadow.filter(ImageFilter.GaussianBlur(5))
        paste_rgba(tile, shadow, px - 4, py - 2, alpha=clamp((s - 1) * 8))
        paste_rgba(tile, big.convert('RGBA'), px, py)

    if name == 'p1':
        flick = 0.75 + 0.25 * math.sin(t * 9.0) * math.sin(t * 3.7)
        on = ease(phase(t, 2.0, 0.8)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.9)))
        add_glow(tile, *L(LAMP1), 120, (255, 190, 90), 0.45 * on * flick)
        nk = phase(t, 2.6, 1.2)
        for i, (k, p) in enumerate(NODES.items()):
            lit = ease(phase(t, 2.6 + i * 0.09, 0.3)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.9)))
            pulse = 0.7 + 0.3 * math.sin(t * 4 + i)
            add_glow(tile, *L(p), 16, (90, 220, 255), 0.75 * lit * pulse)
        if t > 3.6:
            fade = 1 - ease(phase(t, END_STATIC - 1.0, 0.9))
            for ci, chain in enumerate(CHAINS):
                speed = 0.55 + 0.1 * (ci % 3)
                u = ((t - 3.6) * speed + ci * 0.37) % 1.0
                seg = u * (len(chain) - 1)
                a = NODES[chain[int(seg)]]
                b = NODES[chain[min(int(seg) + 1, len(chain) - 1)]]
                f = seg - int(seg)
                p = (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
                add_glow(tile, *L(p), 9, (255, 255, 255), 0.9 * fade)
                add_glow(tile, *L(p), 20, (80, 210, 255), 0.5 * fade)
            # nút ra (N7) sáng mạnh dần
            add_glow(tile, *L(NODES['N7']), 34, (255, 210, 80), 0.8 * ease(phase(t, 5.2, 1.0)) * fade)

    if name == 'p2':
        trace = ease(phase(t, 7.7, 1.5))
        fade = 1 - ease(phase(t, END_STATIC - 1.0, 0.9))
        if trace > 0:
            layer = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
            d = ImageDraw.Draw(layer)
            pts = [L(p) for p in WINDOW] + [L(WINDOW[0])]
            lens = [math.dist(pts[i], pts[i + 1]) for i in range(4)]
            total = sum(lens) * trace
            path = [pts[0]]
            for i in range(4):
                if total <= 0:
                    break
                seg = min(lens[i], total)
                f = seg / lens[i]
                path.append((pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f))
                total -= seg
            mull = ease(phase(t, 9.0, 0.6))
            for wdt, col in ((14, (255, 200, 60, 110)), (6, (255, 220, 90, 220)), (2, (255, 250, 220, 255))):
                d.line(path, fill=col, width=wdt, joint='curve')
                if mull > 0:
                    for (a, b) in MULLIONS:
                        a, b = L(a), L(b)
                        d.line([a, (a[0] + (b[0] - a[0]) * mull, a[1] + (b[1] - a[1]) * mull)], fill=col, width=max(1, wdt - 2))
            layer = layer.filter(ImageFilter.GaussianBlur(1.2))
            glow = layer.filter(ImageFilter.GaussianBlur(7))
            g = np.asarray(glow).astype(np.float32)
            tile += g[..., :3] * (g[..., 3:4] / 255.0) * 0.9 * fade
            l = np.asarray(layer).astype(np.float32)
            tile += l[..., :3] * (l[..., 3:4] / 255.0) * 0.55 * fade
            # đầu bút đang "kéo lê"
            if trace < 1:
                add_glow(tile, *path[-1], 18, (255, 240, 200), 0.9 * fade)
        dk = ease(phase(t, 9.2, 0.5)) * fade
        for i, (p, r) in enumerate(DOTS):
            pulse = 0.75 + 0.25 * math.sin(t * 5 + i * 1.7)
            add_glow(tile, *L(p), r * 4.5, (255, 190, 40), 0.9 * dk * pulse)

    if name == 'p3':
        on = ease(phase(t, 11.7, 0.8)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.9)))
        flash = math.exp(-max(0, t - 12.9) * 3.0) if t >= 12.9 else 0
        pulse = 0.8 + 0.2 * math.sin(t * 3.0)
        add_glow(tile, *L(DOM3), 150, (255, 205, 80), (0.35 * pulse + 0.9 * flash) * on)
        for (sx, sy, size, ph0, sp) in SPARK3:
            tw = max(0.0, math.sin(t * sp + ph0)) ** 2
            add_star(tile, *L((sx, sy)), size, (255, 240, 170), 1.1 * tw * on)

    if name == 'p4':
        on = ease(phase(t, 16.0, 0.8)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.9)))
        add_glow(tile, *L(LAMP4), 130, (255, 180, 80), 0.32 * on * (0.85 + 0.15 * math.sin(t * 2.3)))
        dom_on = ease(phase(t, 16.6, 0.8)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.9)))
        add_glow(tile, *L(DOM4), 85, (255, 205, 80), 0.45 * dom_on * (0.8 + 0.2 * math.sin(t * 3.2)))
        for (sx, sy, size, ph0, sp) in SPARK4:
            tw = max(0.0, math.sin(t * sp + ph0)) ** 2
            add_star(tile, *L((sx, sy)), size * 0.8, (255, 240, 170), 1.0 * tw * dom_on)
        s = bubble_scale(NEW_BUBBLE_T, t) if t >= NEW_BUBBLE_T else 0
        vis = ease(phase(t, NEW_BUBBLE_T, 0.25)) * (1 - ease(phase(t, END_STATIC - 1.0, 0.7)))
        if vis > 0:
            bw, bh = int(NEW_BUBBLE.width * s), int(NEW_BUBBLE.height * s)
            b = NEW_BUBBLE.resize((max(1, bw), max(1, bh)), Image.BICUBIC)
            bx = NEW_BUBBLE_AT[0] - x0 - (bw - NEW_BUBBLE.width) // 2
            by = NEW_BUBBLE_AT[1] - y0 - (bh - NEW_BUBBLE.height) // 2
            paste_rgba(tile, b, bx, by, alpha=vis)

    # đẩy máy (zoom) trong khung
    z, c = panel_zoom(name, t)
    out = np.clip(tile, 0, 255)
    if z > 1.001:
        cx, cy = L(c)
        cw, ch = pw / z, ph / z
        left = clamp(cx - cw / 2, 0, pw - cw)
        top = clamp(cy - ch / 2, 0, ph - ch)
        im = Image.fromarray(out.astype(np.uint8)).resize((pw, ph), Image.BICUBIC, box=(left, top, left + cw, top + ch))
        out = np.asarray(im).astype(np.float32)

    b = panel_brightness(name, t)
    if b < 0.999:
        grey = out.mean(axis=2, keepdims=True)
        desat = (1 - b) / 0.55 * 0.35
        out = (out * (1 - desat) + grey * desat) * b
    return out


def render(t):
    frame = PAGE.copy()
    if t < END_STATIC:
        for name, (x0, y0, x1, y1) in PANELS.items():
            frame[y0:y1, x0:x1] = render_panel(name, t)
        # vệt sáng quét chéo mở đầu
        if 1.0 <= t <= 2.2:
            k = phase(t, 1.0, 1.2)
            yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
            band = (xx * 0.6 + yy) / (W * 0.6 + H)
            d = np.abs(band - (k * 1.3 - 0.15))
            sweep = np.clip(1 - d / 0.07, 0, 1) ** 2 * 0.35
            frame += sweep[..., None] * np.array([255, 245, 220], np.float32)
        # thẻ kết
        if FINALE[0] <= t:
            vis = ease(phase(t, FINALE[0] + 0.3, 0.5)) * (1 - ease(phase(t, FINALE[1], 0.6)))
            if vis > 0:
                rise = int(14 * (1 - ease_out(phase(t, FINALE[0] + 0.3, 0.6))))
                paste_rgba(frame, TITLE, (W - TITLE.width) // 2, 500 + rise, alpha=vis)
    # trở về đúng trang in ở cuối
    if t > END_STATIC - 0.6:
        k = ease(phase(t, END_STATIC - 0.6, 0.6))
        frame = frame * (1 - k) + PAGE * k
    return np.clip(frame, 0, 255).astype(np.uint8)


if __name__ == '__main__':
    n = int(DUR * FPS)
    if len(sys.argv) > 4:  # chế độ chụp thử: các thời điểm cách nhau dấu phẩy
        for tt in sys.argv[4].split(','):
            Image.fromarray(render(float(tt))).save(OUT.replace('.mp4', f'-t{tt}.png'))
        sys.exit(0)
    ff = subprocess.Popen([
        'ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
        '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', OUT,
    ], stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(render(i / FPS).tobytes())
        if i % 96 == 0:
            print(f'frame {i}/{n}', flush=True)
    ff.stdin.close()
    ff.wait()
    print('done', OUT)
