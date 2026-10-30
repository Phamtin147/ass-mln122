# tools/update_manga_prompts.py
import re
import os

manga_header = (
    "Authentic Japanese cyberpunk manga comic page layout, vertical 3:4 ratio, "
    "distinct dynamic panels separated by crisp white gutters, Katsuhiro Otomo and Tsutomu Nihei graphic novel style. "
    "Sharp black ink linework, authentic halftone screentone shading, high-contrast chiaroscuro on off-white manga paper #f4f1ea. "
    "Selective vivid neon spot-color accents ONLY on key focal elements (electric cyan #00f0ff for Đốm LED eyes and HUD, "
    "warm golden amber #ffe600 for cores/lamp, hostile crimson #ff0055 for TRUC alerts). "
    "Strictly authentic black and white manga with selective neon highlights, NOT full-color anime. "
    "Integrated manga speech bubbles with clean dialogue, square narration caption boxes in panel corners, "
    "and stylized bold manga sound effects (SFX onomatopoeia)."
)

prompt_file = '/home/amtia/Projects/ass-mln122/docs/AI_COMIC_FACTORY_20_TRANG_PROMPTS.md'

with open(prompt_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace "Full-color Japanese anime manga comic page layout, vertical 3:4 ratio..." or similar prefixes
pattern = r'/imagine prompt: (?:Full-color Japanese anime manga comic page layout|Full-color Japanese anime manga comic page)[^,]+,[^.]+\. '

def replace_prefix(match):
    return f"/imagine prompt: {manga_header} "

new_text = re.sub(pattern, replace_prefix, text)

# Ensure Minh ALWAYS has wireframe glasses
new_text = re.sub(r'Minh with messy dark hair, wire glasses', 'Minh (ALWAYS wearing thin round wireframe glasses, messy dark hair with bangs over forehead, olive tech vest over dark grey tee)', new_text)
new_text = re.sub(r'Minh stepping in from hallway', 'Minh (ALWAYS wearing thin round wireframe glasses, tech vest) stepping in from hallway', new_text)
new_text = re.sub(r'close-up of Minh clenching his fist', 'close-up of Minh (ALWAYS wearing thin round wireframe glasses) clenching his fist', new_text)
new_text = re.sub(r'Minh turning back to his cluttered workbench', 'Minh (ALWAYS wearing thin round wireframe glasses, tech vest) turning back to his cluttered workbench', new_text)

# Ensure Đốm is always a miniature spherical robot drone
new_text = re.sub(r'spherical robot companion Đốm with cyan LED eyes', 'miniature hovering spherical white-ceramic robot drone Đốm with cyan LED eyes and micro thruster fins', new_text)
new_text = re.sub(r'spherical robot drone Đốm with cyan LED eyes', 'miniature hovering spherical white-ceramic robot drone Đốm with cyan LED eyes and micro thruster fins', new_text)
new_text = re.sub(r'spherical robot drone Đốm', 'miniature hovering spherical white-ceramic robot drone Đốm with cyan LED eyes and micro thruster fins', new_text)

with open(prompt_file, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("AI_COMIC_FACTORY_20_TRANG_PROMPTS.md updated successfully with authentic manga style!")
