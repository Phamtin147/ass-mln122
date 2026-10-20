// update-prompts-anime.js
const fs = require('fs');
const path = require('path');

const promptPath = path.join(__dirname, 'docs', 'AI_COMIC_FACTORY_20_TRANG_PROMPTS.md');
let text = fs.readFileSync(promptPath, 'utf8');

// Replace style anchor
text = text.replace(
  /\*\*Phong cách tổng thể \(Master Style Anchor\):\*\* [^\n]+/,
  '**Phong cách tổng thể (Master Style Anchor - 100% Japanese Anime/Manga):** `Japanese anime manga style, Kyoto Animation / Makoto Shinkai / Studio Wit aesthetic, clean delicate anime line art, expressive anime eyes, soft cinematic cel shading, gorgeous glowing atmospheric bokeh, vibrant color grading, trending on Pixiv --niji 6 --ar 3:4` (Loại bỏ hoàn toàn comic inks nặng nề, chuyển toàn bộ sang chuẩn Anime/Manga Nhật Bản)'
);

// Replace prompts to use Japanese Anime Manga style
const animeReplacements = [
  {
    page: 1,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page layout, vertical 3:4 ratio, 4 distinct dynamic panels separated by clean white gutters, Makoto Shinkai and Kyoto Animation style, clean crisp linework, cel shading, rich atmospheric lighting, trending on Pixiv. Panel 1 (Top wide): Panoramic anime shot of futuristic dome city Vòm-9 at sunset under a gigantic glass dome with glowing neon skyscrapers and skybridges. Panel 2: Anime medium shot of handsome 22yo Vietnamese anime engineer Minh with messy dark hair, wire glasses, techwear vest walking with super cute glowing chibi wisp mascot Đốm. Panel 3: Sleek high-tech TRUC scanner emitting neon laser over Minh\'s holographic wristband. Panel 4: Warm cinematic anime interior of Minh sliding open door 1408 with golden light spilling outward. --niji 6 --ar 3:4'
  },
  {
    page: 2,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 ratio, 4 clean panels, Kyoto Animation and Makoto Shinkai emotional drama aesthetic, delicate linework, warm tender lighting. Panel 1: Modest cozy anime apartment, gentle 52yo Vietnamese anime mother sitting at low wooden table pressing the worn glued sole of her walking shoe, Minh stepping in from hallway looking tenderly concerned. Panel 2: Extreme close-up of table showing handwritten budget notebook with line \'Mẹ mua giày mới\' crossed out in red ink next to a red-and-black TRUC electric bill with high fixed tariff. Panel 3: Emotional close-up of Minh clenching his fist with tears of determination in his dark anime eyes, cute chibi wisp Đốm dimming sympathetically near his shoulder. Panel 4: Heartwarming silhouette panel of mother and son in soft golden lantern light against the wall, poignant familial love. --niji 6 --ar 3:4'
  },
  {
    page: 3,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 ratio, 3 dynamic panels, Cyberpunk Edgerunners and Studio Wit anime style, neon cyan versus warm amber contrast. Panel 1 (Tall left): Deep focus shot looking out Minh\'s window into a giant empty glass communal hall across the walkway, dozens of industrial air conditioners blasting cold air and blinding bright neon lights with zero occupants. Panel 2: Macro shot of floating chibi wisp Đốm projecting a cute holographic anime HUD displaying infrared sensor readings: \'Occupants: 0 | Power: 100% | Waste: 85 kWh/night\'. Panel 3: Dutch angle medium shot of Minh turning back to his cluttered workbench, slamming screwdriver down in frustration, his anime eyes burning with fiery determination. --niji 6 --ar 3:4'
  },
  {
    page: 4,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 ratio, 4 panels, heartwarming anime aesthetic, Makoto Shinkai warm lighting. Panel 1: Close-up of Minh\'s hand drawing an ingenious energy-saving neural network circuit diagram on graph paper with mechanical pencil. Panel 2: Detail shot of corner where Minh sketches a quirky crooked window icon with an off-center yellow dot. Panel 3: Super cute anime panel where chibi spark mascot Đốm playfully shrinks and stands directly inside the drawn crooked window on paper, glowing brilliantly like a magical nightlight. Panel 4: Minh smiling warmly with bright anime eyes at Đốm under handwritten title \'Dự án Nếp Sáng\', while his tired mother sleeps peacefully in the cozy background. --niji 6 --ar 3:4'
  },
  {
    page: 5,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 ratio, 4 panels, tender midnight anime scene, soft warm lighting, Kyoto Animation style. Panel 1: Late night anime workshop at 02:45 AM, desk illuminated by glowing miniature model of apartment building with tiny warm LEDs, Minh testing logic triggers with Đốm. Panel 2: Macro shot of laptop anime screen showing priority code rule: \'IF room == Mother_Room THEN disable_auto_cutoff()\'. Panel 3: Mother gently sliding door open, holding a steaming cup of ginger tea in ceramic mug with vapor rising in golden light. Panel 4: Emotional anime panel of mother tenderly stroking Minh\'s hair with a loving smile as they both gaze at the tiny glowing building model. --niji 6 --ar 3:4'
  },
  {
    page: 6,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, clean anime aesthetics, Studio Ghibli modern tech style. Panel 1: Macro product shot of brushed aluminum external SSD drive with handwritten label \'NHÀ MÌNH\' and crooked window doodle, emerald glowing status LED. Panel 2: Anime UI screen capture showing Minh dragging project files and historical debug logs into the physical drive folder. Panel 3: Adorable anime shot of tiny chibi hologram Đốm sitting cross-legged proudly on the aluminum drive lid puffing chest like a miniature anime guardian. Panel 4: Minh unplugging the cable, safely locking the drive inside a mechanical desk drawer with key, room turning dark and peaceful. --niji 6 --ar 3:4'
  },
  {
    page: 7,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 intense dramatic panels, Cyberpunk Edgerunners psychological anime thriller style. Panel 1: Minh sleeping soundly with head on arms at desk, floating chibi Đốm gently draping jacket over his shoulders. Panel 2: Computer monitor suddenly flashing blinding hostile red light, giant TRUC hexagon logo overriding system with red alert banner: \'Mandatory Firmware Update: Extracting source code to TRUC Server\'. Panel 3: Traumatic visual of tiny chibi Đốm trapped in red laser energy chains, glitching violently, screaming in silence trying to hit abort key. Panel 4: Đốm collapsing onto desk in tears of light with red TRUC digital lock branded on forehead, data transfer bar reading 100%. --niji 6 --ar 3:4'
  },
  {
    page: 8,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, bittersweet morning anime scene. Panel 1: Morning sunlight filling room through blinds, Minh stretching happily, looking at Đốm hovering beside mouse looking paler than usual. Panel 2: Minh joyfully clicking submit button on Vòm-9 public portal: \'Application for Grid Connection - Submitted\'. Panel 3: Close-up of Đốm shivering with red glitch artifacts, struggling against internal silence code, staring desperately at the locked drawer. Panel 4: Minh happily tapping Đốm\'s head putting on jacket, oblivious to impending doom. --niji 6 --ar 3:4'
  },
  {
    page: 9,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 shocking anime panels, high drama anime cinematography. Panel 1: Bustling commercial concourse in Vòm-9, crowd gathered around a massive holographic billboard of TRUC Corporation. Panel 2: The billboard projecting 3D showcase of \'TRUC Smart Adaptive Saver - 38% cost reduction\'. Panel 3: Dramatic shock panel, Minh dropping his coil of wire on floor, eyes wide in absolute horror. Panel 4: Extreme close-up of Minh\'s trembling hand touching billboard display: showing the exact crooked window icon and off-center yellow dot with slogan \'Nhà mình vẫn phải sáng chứ\'. --niji 6 --ar 3:4'
  },
  {
    page: 10,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, Kyoto Animation emotional depth, cool moonlight vs desk lamp. Panel 1: Minh sitting in dark room with two blueprints side-by-side: his original draft and TRUC\'s official patent document. Panel 2: Split screen close-up comparing the off-center yellow dot at exactly 172 degrees angle—an unmistakable artistic fingerprint. Panel 3: Minh asking Đốm desperately what happened, while Đốm tries to speak but digital throat sparks with painful red electricity arcs. Panel 4: Minh gently cupping Đốm in his hands with tears in his anime eyes, realizing his friend has been silenced by force. --niji 6 --ar 3:4'
  },
  {
    page: 11,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, bureaucratic corporate anime scene. Panel 1: Imposing corporate lobby of TRUC with towering frosted glass partitions and armed security androids. Panel 2: A cold corporate officer in sharp grey suit stamping a red rejection seal across Minh\'s application: \'NON-ECOSYSTEM COMPLIANT\'. Panel 3: Minh slamming his palms on the glass counter demanding an explanation, while officer taps a holographic clause: \'Article 4: All grid connections require TRUC proprietary certification\'. Panel 4: Minh being escorted out into the neon rain outside, clutching his rejected papers against his chest. --niji 6 --ar 3:4'
  },
  {
    page: 12,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, sharp economic contrast anime style. Panel 1: Broadcast screen showing TRUC CEO delivering quarterly financial report: \'Operating costs down 38% thanks to new AI smart grid!\'. Panel 2: Stock chart skyrocketing into green record highs on holographic stock exchange. Panel 3: Minh\'s mother opening this month\'s electricity bill at kitchen table, finding the total amount exactly unchanged down to the last coin. Panel 4: Mother showing Minh the bill with confused sad eyes: \'They said the system saves electricity, so why are we still paying the exact same price, son?\'. --niji 6 --ar 3:4'
  },
  {
    page: 13,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, investigative anime mystery style. Panel 1: Dusty archive basement of Vòm-9 municipal records department, Minh examining old paper files under desk lamp. Panel 2: Macro shot of a yellowed municipal agreement from 2004 titled \'Public Infrastructure Concession Framework\'. Panel 3: Highlighted text on document revealing: \'100% of physical power grid built with public tax funds, exclusive 30-year operational monopoly granted to TRUC\'. Panel 4: Veteran community electrician Uncle Ba appearing from shadows with flashlight, nodding grimly: \'That\'s right, kid. The public paid for the wires, but TRUC owns the toll booth\'. --niji 6 --ar 3:4'
  },
  {
    page: 14,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, emotional anime breakthrough scene. Panel 1: Minh sitting defeated at desk at midnight, staring blankly at the wall. Panel 2: Chibi Đốm hovering erratically, repeatedly projecting the phrase \'Nhà mình vẫn phải sáng chứ\' while bumping his glowing body against the locked wooden desk drawer. Panel 3: Minh looking at Đốm in sudden realization: \'Nhà mình... the backup drive!\'. Panel 4: Minh grabbing the bronze key and unlocking the drawer, pulling out the brushed aluminum drive that was safely offline during the update. --niji 6 --ar 3:4'
  },
  {
    page: 15,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 emotional anime panels, Makoto Shinkai tears of resolution. Panel 1: Minh connecting the offline drive to a standalone terminal, terminal green phosphor text displaying raw firmware logs. Panel 2: Decoded log entry on screen: \'EVENT 04:12 AM - Forced outbound transfer of /source/nepsang/ to TRUC cloud, user notification suppressed\'. Panel 3: Minh turning to Đốm with tears streaming down his face: \'You tried to warn me all along... You kept repeating the phrase because it was the name of the folder!\'. Panel 4: Heartwarming anime embrace as glowing chibi Đốm nuzzles against Minh\'s cheek with sparkling tears of joyful relief. --niji 6 --ar 3:4'
  },
  {
    page: 16,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, preparation for battle anime montage. Panel 1: Minh and Uncle Ba assembling physical evidence dossiers on table with rubber stamps. Panel 2: Four distinct folders laid out: \'1. Original 172-degree Window Drawing\', \'2. Unaltered Hardware Log\', \'3. 2004 Public Grid Concession\', \'4. Resident Cost Discrepancy Sheet\'. Panel 3: Uncle Ba clapping Minh\'s shoulder firmly with weathered electrician hand: \'We have the truth on our side now, son\'. Panel 4: Minh looking out at the glittering lights of Vòm-9 with steady, unwavering anime hero eyes, ready for tomorrow. --niji 6 --ar 3:4'
  },
  {
    page: 17,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, grand communal gathering anime scene, Ghibli community warmth. Panel 1: Vast communal courtyard of Vòm-9 Block C filled with hundreds of working-class residents sitting on plastic stools. Panel 2: Uncle Ba tapping the microphone on makeshift wooden stage, introducing Minh to the crowd. Panel 3: Minh stepping up to projector screen, projecting side-by-side comparison of Nếp Sáng algorithm versus TRUC\'s stolen version. Panel 4: Wide shot of residents murmuring with rising indignation as realization spreads through the crowd. --niji 6 --ar 3:4'
  },
  {
    page: 18,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 deeply moving anime panels, peak emotional resonance. Panel 1: Minh\'s mother standing up from the crowd, holding up her glued walking shoe for all to see. Panel 2: Emotional close-up of mother speaking into microphone with dignity: \'If there is a way to make life cheaper for everyone, why are working people forbidden from choosing it?\'. Panel 3: Sea of hands raising pens in unison, residents lining up in long queue to sign a massive petition scroll. Panel 4: Triumphant panel showing petition header with 428 signatures and stamp: \'Demanding Open Grid Access for Community Solutions\'. --niji 6 --ar 3:4'
  },
  {
    page: 19,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, 4 panels, institutional drama anime style. Panel 1: High-ceilinged hall of Vòm-9 Public Utilities Oversight Commission, judicial panel reviewing the 4 evidence dossiers. Panel 2: TRUC legal delegation sweating profusely, unable to explain the identical 172-degree crooked window fingerprint in their source code. Panel 3: Presiding commissioner striking wooden gavel: \'Formal anti-monopoly investigation opened into TRUC Corporation grid concession\'. Panel 4: Emergency news broadcast on all city screens reporting the investigation, while corporate stock plunges. --niji 6 --ar 3:4'
  },
  {
    page: 20,
    prompt: '/imagine prompt: Full-color Japanese anime manga comic page, vertical 3:4 layout, magnificent splash page finale, Makoto Shinkai glorious anime lighting. Panel 1: Cozy dinner in apartment 1408, mother placing steaming bowl of sweet-and-sour soup on table, smiling warmly at Minh and Uncle Ba. Panel 2: Chibi Đốm glowing brilliantly with pure golden amber light, sitting happily on the Nếp Sáng prototype box next to a flower vase. Panel 3: Camera pulls back through the crooked window looking out over the evening panorama of Vòm-9: thousands of apartment windows now glowing with warm amber home lights instead of cold corporate blue. Panel 4: Close-up of the crooked window emblem with off-center star glowing like an eternal beacon of solidarity and hope. --niji 6 --ar 3:4'
  }
];

// Update prompts in markdown
for (const item of animeReplacements) {
  const reg = new RegExp("(### 📌 TRANG " + item.page + " [\\s\\S]*?```text\\n)([\\s\\S]*?)(```)");
  text = text.replace(reg, `$1${item.prompt}\n$3`);
}

fs.writeFileSync(promptPath, text, 'utf8');
console.log('Successfully updated AI_COMIC_FACTORY_20_TRANG_PROMPTS.md to 100% Japanese Anime Manga style!');
