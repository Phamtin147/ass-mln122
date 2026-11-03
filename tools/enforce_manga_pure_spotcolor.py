#!/usr/bin/env python3
"""
tools/enforce_manga_pure_spotcolor.py
Enforce strict authentic manga spot-color aesthetic:
Pure black & white ink linework and grayscale screentones for all characters,
environments, clothes, and skin.
Selectively retain only vivid neon accents:
- Cyan (#00f0ff): Đốm LED eyes, holographic HUDs, scanlines
- Golden Amber (#ffe600): Cores, lanterns, 172-degree yellow dot
- Crimson (#ff0055): TRỤC lasers, red warning stamps, glitch arcs
"""

import os
import glob
import numpy as np
from PIL import Image, ImageFilter

def process_image(path):
    if not os.path.exists(path):
        return False
    try:
        img = Image.open(path).convert('RGB')
        rgb = np.array(img, dtype=np.float32)

        # Grayscale luminance (ITU-R BT.601)
        gray = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
        gray_3ch = np.stack([gray, gray, gray], axis=-1)

        hsv = np.array(img.convert('HSV'), dtype=np.float32)
        H = hsv[..., 0] # 0-255
        S = hsv[..., 1] # 0-255
        V = hsv[..., 2] # 0-255

        # 1. Neon Cyan (Đốm eyes, holographic HUD, scanlines, data screens)
        cyan_mask = (
            (((H >= 112) & (H <= 148)) | 
             ((rgb[..., 2] > 120) & (rgb[..., 1] > 110) & (rgb[..., 2] > rgb[..., 0] + 25))) 
            & (S >= 40) & (V >= 50)
        )

        # 2. Neon Amber / Pure Golden Yellow (Cores, lantern light, yellow dot, glowing icons)
        amber_mask = (
            (((H >= 22) & (H <= 45)) | 
             ((rgb[..., 0] > 175) & (rgb[..., 1] > 135) & (rgb[..., 2] < 95))) 
            & (S >= 85) & (V >= 90)
        )

        # 3. Neon Crimson / Laser Red / Danger Alerts (TRUC lasers, error arcs, red warning stamps)
        crimson_mask = (
            (((H >= 242) | (H <= 12)) | 
             ((rgb[..., 0] > 160) & (rgb[..., 0] > rgb[..., 1] + 45) & (rgb[..., 0] > rgb[..., 2] + 45))) 
            & (S >= 95) & (V >= 80)
        )

        neon_mask = (cyan_mask | amber_mask | crimson_mask).astype(np.float32)

        # Feather mask for smooth glow transition
        mask_img = Image.fromarray((neon_mask * 255).astype(np.uint8))
        feathered = np.array(mask_img.filter(ImageFilter.GaussianBlur(radius=1.8)), dtype=np.float32) / 255.0
        feathered = np.clip(feathered * 1.4, 0.0, 1.0)[..., None]

        blended = feathered * rgb + (1.0 - feathered) * gray_3ch
        blended = np.clip(blended, 0, 255).astype(np.uint8)

        res = Image.fromarray(blended)
        res.save(path, 'JPEG', quality=95)
        print(f"Processed: {path}")
        return True
    except Exception as e:
        print(f"Error processing {path}: {e}")
        return False

if __name__ == '__main__':
    targets = glob.glob('/home/amtia/Projects/ass-mln122/assets/comic_20pages/page_*.jpg')
    targets += glob.glob('/home/amtia/Projects/ass-mln122/assets/comic_page*.jpg')
    for t in sorted(targets):
        process_image(t)
