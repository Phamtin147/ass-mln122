# tools/sync_all_manga_assets.py
import re
import os
import glob

manga_header = (
    "Authentic Japanese cyberpunk manga comic page layout, vertical 3:4 ratio, "
    "distinct dynamic panels separated by clean white gutters, Katsuhiro Otomo and Tsutomu Nihei graphic novel style. "
    "Sharp black ink linework, fine halftone screentone shading, high-contrast chiaroscuro on off-white manga paper #f4f1ea. "
    "Selective vivid neon spot-color accents ONLY on key focal elements (electric cyan #00f0ff for Đốm LED eyes and HUD, "
    "warm golden amber #ffe600 for cores/lamp, hostile crimson #ff0055 for TRUC alerts). "
    "Strictly authentic black and white manga with selective neon highlights, NOT full-color anime. "
    "Integrated manga speech bubbles with clean legible dialogue in Vietnamese, square narration caption boxes in panel corners, "
    "and stylized bold manga sound effects (SFX onomatopoeia)."
)

prompt_file = '/home/amtia/Projects/ass-mln122/docs/AI_COMIC_FACTORY_20_TRANG_PROMPTS.md'
with open(prompt_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all variations of /imagine prompt: Full-color Japanese anime manga...
text = re.sub(
    r'/imagine prompt: (?:Full-color Japanese anime manga comic page layout|Full-color Japanese anime manga comic page)[^,]+,[^.]+\. ',
    f"/imagine prompt: {manga_header} ",
    text
)

# Also replace any remaining Kyoto Animation / Makoto Shinkai in the prompts with Otomo / Nihei
text = re.sub(r'Kyoto Animation and Makoto Shinkai style', 'Katsuhiro Otomo and Tsutomu Nihei cyberpunk manga style', text)
text = re.sub(r'Kyoto Animation and Makoto Shinkai emotional drama aesthetic', 'Katsuhiro Otomo cyberpunk manga emotional chiaroscuro aesthetic', text)
text = re.sub(r'Cyberpunk Edgerunners and Studio Wit anime style', 'Tsutomu Nihei cyberpunk manga mechanical style', text)
text = re.sub(r'Studio Ghibli modern tech style', 'Katsuhiro Otomo detailed manga technical style', text)
text = re.sub(r'Cyberpunk Edgerunners psychological anime thriller style', 'high-tension cyberpunk manga psychological thriller style', text)

# Ensure Minh ALWAYS has wireframe glasses in every prompt
text = re.sub(r'Minh\s*\((?!ALWAYS)', 'Minh (ALWAYS wearing thin round wireframe glasses, ', text)

with open(prompt_file, 'w', encoding='utf-8') as f:
    f.write(text)

print("Synchronized docs/AI_COMIC_FACTORY_20_TRANG_PROMPTS.md")

# Sync novel-reader.html
with open('/home/amtia/Projects/ass-mln122/novel-reader.html', 'r', encoding='utf-8') as f:
    nr_content = f.read()

nr_content = re.sub(
    r'/imagine prompt: (?:Full-color Japanese anime manga comic page layout|Full-color Japanese anime manga comic page)[^,]+,[^.]+\. ',
    f"/imagine prompt: {manga_header} ",
    nr_content
)
with open('/home/amtia/Projects/ass-mln122/novel-reader.html', 'w', encoding='utf-8') as f:
    f.write(nr_content)

print("Synchronized novel-reader.html")

# Sync gallery.html
with open('/home/amtia/Projects/ass-mln122/gallery.html', 'r', encoding='utf-8') as f:
    gal_content = f.read()

gal_content = re.sub(
    r'/imagine prompt: (?:Full-color Japanese anime manga comic page layout|Full-color Japanese anime manga comic page)[^,]+,[^.]+\. ',
    f"/imagine prompt: {manga_header} ",
    gal_content
)
with open('/home/amtia/Projects/ass-mln122/gallery.html', 'w', encoding='utf-8') as f:
    f.write(gal_content)

print("Synchronized gallery.html")

# Sync all 20 files in comic/giu-mot-dom-sang/prompts/
prompt_files = glob.glob('/home/amtia/Projects/ass-mln122/comic/giu-mot-dom-sang/prompts/*.md')
for pf in prompt_files:
    with open(pf, 'r', encoding='utf-8') as f:
        c = f.read()
    c = re.sub(
        r'/imagine prompt: (?:Full-color Japanese anime manga comic page layout|Full-color Japanese anime manga comic page)[^,]+,[^.]+\. ',
        f"/imagine prompt: {manga_header} ",
        c
    )
    with open(pf, 'w', encoding='utf-8') as f:
        f.write(c)

print(f"Synchronized {len(prompt_files)} prompt files in comic/giu-mot-dom-sang/prompts/")
