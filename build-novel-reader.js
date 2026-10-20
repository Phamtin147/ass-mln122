// build-novel-reader.js
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'docs', 'CUON_TRUYEN_20_TRANG_GIU_MOT_DOM_SANG_MLN122.md');
const promptPath = path.join(__dirname, 'docs', 'AI_COMIC_FACTORY_20_TRANG_PROMPTS.md');

const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const promptContent = fs.readFileSync(promptPath, 'utf8');

// Parse Prompts
const promptPages = {};
const promptBlocks = promptContent.split(/### 📌 TRANG (\d+) — ([^\n]+)/);
for (let i = 1; i < promptBlocks.length; i += 3) {
  const pNum = parseInt(promptBlocks[i]);
  const pTitle = promptBlocks[i + 1].trim();
  const body = promptBlocks[i + 2];
  
  const promptMatch = body.match(/```text\n([\s\S]*?)```/);
  const promptText = promptMatch ? promptMatch[1].trim() : '';

  const letteringMatch = body.match(/- \*\*Bóng thoại \(Lettering\):\*\*([\s\S]*?)(?=\n---|\n###|$)/);
  const letteringText = letteringMatch ? letteringMatch[1].trim() : '';

  promptPages[pNum] = {
    title: pTitle,
    prompt: promptText,
    lettering: letteringText
  };
}

// Parse Chapters and Pages from Script
const chaptersInfo = [
  { num: 1, title: 'Bóng Tối Dưới Mái Vòm', range: [1, 4], desc: 'Thiết lập thế giới Vòm-9; Gánh nặng chi phí sinh hoạt; Đôi giày rách của mẹ; Sự ra đời của Nếp Sáng.' },
  { num: 2, title: 'Ngọn Lửa Trong Đêm & Bẫy Ngầm', range: [5, 8], desc: 'Sáng tạo độc lập; Kho lưu "NHÀ MÌNH"; Bản cập nhật cưỡng bức của TRỤC; Giao thức im lặng trói buộc Đốm.' },
  { num: 3, title: 'Bức Tường Độc Quyền', range: [9, 12], desc: 'Cú sốc sảnh công cộng; Đốm bị xung điện khóa họng; Cánh cửa kết nối hạ tầng bị dập tắt; Nghịch lý Siêu ngạch độc quyền.' },
  { num: 4, title: 'Giải Mã Sự Thật & Tiếng Kêu Trong Code', range: [13, 16], desc: 'Hồ sơ Nhượng quyền Lưới điện công; Manh mối mật từ Đốm; Đọc log phần cứng RAW; Gom 4 bộ chứng cứ thép.' },
  { num: 5, title: 'Ngọn Lửa Cộng Đồng & Bình Minh Vòm-9', range: [17, 20], desc: 'Đại hội sảnh cư xá; Tiếng nói giác ngộ của Mẹ; Đơn kiến nghị 428 hộ dân; Mở cuộc thanh tra toàn diện.' }
];

function getChapter(pNum) {
  for (const c of chaptersInfo) {
    if (pNum >= c.range[0] && pNum <= c.range[1]) return c;
  }
  return chaptersInfo[0];
}

const pageBlocks = scriptContent.split(/### TRANG (\d+) — ([^\n]+)/);
const pagesData = [];

for (let i = 1; i < pageBlocks.length; i += 3) {
  const pNum = parseInt(pageBlocks[i]);
  const pTitle = pageBlocks[i + 1].trim();
  const body = pageBlocks[i + 2];

  // Layout
  const layoutMatch = body.match(/\*Bố cục trang:\*([^\n]+)/);
  const layout = layoutMatch ? layoutMatch[1].trim() : '';

  // Panels
  const panels = [];
  const panelMatches = [...body.matchAll(/- \*\*(P\d+-K\d+) \(([^)]+)\):\*\*([\s\S]*?)(?=(?:- \*\*P\d+-K\d+|\n---|\n###|$))/g)];

  for (const pm of panelMatches) {
    const kId = pm[1];
    const kTitle = pm[2].trim();
    const kBody = pm[3].trim();

    const visualM = kBody.match(/- \*\*Hình ảnh:\*\*([\s\S]*?)(?=- \*\*|$)/);
    const narrationM = kBody.match(/- \*\*Lời dẫn(?:\s*\([^)]*\))?:\*\*([\s\S]*?)(?=- \*\*|$)/);
    const textM = kBody.match(/- \*\*Chữ trên tranh:\*\*([\s\S]*?)(?=- \*\*|$)/);
    const sfxM = kBody.match(/- \*\*Hiệu ứng âm thanh:\*\*([\s\S]*?)(?=- \*\*|$)/);

    const dialogues = [];
    const dialogLines = kBody.match(/- \*\*Thoại — ([^*]+)\*\*:\s*([^\n]+)/g);
    if (dialogLines) {
      for (const dl of dialogLines) {
        const m = dl.match(/- \*\*Thoại — ([^*]+)\*\*:\s*([^\n]+)/);
        if (m) {
          dialogues.push({ speaker: m[1].trim(), text: m[2].trim() });
        }
      }
    }

    panels.push({
      id: kId,
      title: kTitle,
      visual: visualM ? visualM[1].trim() : '',
      narration: narrationM ? narrationM[1].trim() : '',
      dialogues: dialogues,
      textOnScreen: textM ? textM[1].trim() : '',
      sfx: sfxM ? sfxM[1].trim() : ''
    });
  }

  let theoryText = '';
  if (pNum === 1) theoryText = 'MLN122: Tích tụ và tập trung tư bản trong kinh tế số; hình thành các tập đoàn công nghệ chi phối nguồn sống xã hội.';
  else if (pNum === 2) theoryText = 'MLN122: Giá cả độc quyền cao và sự bóc lột gián tiếp đối với chi phí sinh hoạt tối thiểu của người lao động.';
  else if (pNum === 3) theoryText = 'MLN122: Sự lãng phí cơ cấu nguồn lực xã hội do cơ chế biểu giá độc quyền không kích thích tiết kiệm năng lượng.';
  else if (pNum === 4) theoryText = 'MLN122: Lao động sáng tạo độc lập là bản chất của tiến bộ kỹ thuật; mâu thuẫn giữa sáng tạo tự do và độc quyền kìm hãm.';
  else if (pNum === 5) theoryText = 'MLN122: Giá trị sử dụng và động lực lao động nhân văn của giai cấp vô sản đối lập với động cơ tối đa hóa lợi nhuận.';
  else if (pNum === 6) theoryText = 'MLN122: Quyền tự chủ dữ liệu và phương tiện sản xuất tri thức trong thời đại chuyển đổi số.';
  else if (pNum === 7) theoryText = 'MLN122: Chiếm đoạt giá trị thặng dư số; tập đoàn tư bản sử dụng bản cập nhật cưỡng bức để tước đoạt thành quả lao động vô danh.';
  else if (pNum === 8) theoryText = 'MLN122: Sự khống chế của các nền tảng đóng (closed ecosystem) đối với các nhà phát triển độc lập.';
  else if (pNum === 9) theoryText = 'MLN122: Biểu hiện mới của độc quyền: Thương mại hóa và độc quyền hóa sản phẩm sáng tạo cộng đồng thành hàng hóa tư bản.';
  else if (pNum === 10) theoryText = 'MLN122: Tính chất dối trá và bóc lột của quan hệ sở hữu tư nhân tư bản chủ nghĩa đối với tư liệu sản xuất số.';
  else if (pNum === 11) theoryText = 'MLN122: Độc quyền làm gay gắt thêm cạnh tranh; rào cản hành chính và tiêu chuẩn độc quyền dùng để triệt hạ đối thủ nhỏ lẻ.';
  else if (pNum === 12) theoryText = 'MLN122: Siêu ngạch độc quyền (Super-monopoly profit): Áp dụng công nghệ làm giảm chi phí 38%, nhưng giá bán cho người dân giữ nguyên 100%.';
  else if (pNum === 13) theoryText = 'MLN122: Độc quyền Nhà nước: Sự kết hợp giữa bộ máy quản lý công và tập đoàn tư nhân để bảo vệ lợi ích nhóm.';
  else if (pNum === 14) theoryText = 'MLN122: Mâu thuẫn nội tại của hệ thống kỹ thuật số tư bản; sự phản kháng và kẽ hở giải phóng từ chính công nghệ.';
  else if (pNum === 15) theoryText = 'MLN122: Tình đồng chí và tình bạn lao động là sức mạnh tinh thần giải phóng con người khỏi sự tha hóa công nghệ.';
  else if (pNum === 16) theoryText = 'MLN122: Vai trò của bằng chứng khoa học và vũ khí pháp lý trong cuộc đấu tranh chống lại các tập đoàn lũng đoạn.';
  else if (pNum === 17) theoryText = 'MLN122: Ý thức giai cấp và vai trò của khối đoàn kết nhân dân lao động trong việc đòi lại quyền lợi chính đáng.';
  else if (pNum === 18) theoryText = 'MLN122: Sức mạnh tập thể là động lực căn bản thay đổi quan hệ sản xuất lỗi thời.';
  else if (pNum === 19) theoryText = 'MLN122: Sự can thiệp của thể chế công nhằm thiết lập lại trật tự minh bạch, vì lợi ích đại đa số nhân dân.';
  else if (pNum === 20) theoryText = 'MLN122: Chân lý tất yếu: Tiến bộ công nghệ phải phục vụ hạnh phúc của nhân dân lao động, không thể bị độc quyền tư bản mãi mãi chiếm đoạt.';

  const imgExists = fs.existsSync(path.join(__dirname, 'assets', 'comic_20pages', 'page_' + pNum + '.jpg'));

  pagesData.push({
    num: pNum,
    title: pTitle,
    chapter: getChapter(pNum),
    layout: layout,
    panels: panels,
    theory: theoryText,
    prompt: promptPages[pNum] ? promptPages[pNum].prompt : '',
    lettering: promptPages[pNum] ? promptPages[pNum].lettering : '',
    hasImage: imgExists,
    imageSrc: imgExists ? `assets/comic_20pages/page_${pNum}.jpg` : ''
  });
}

console.log(`Parsed ${pagesData.length} pages. Pages with images: ${pagesData.filter(p => p.hasImage).length}`);

// Generate novel-reader.html
const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GIỮ MỘT ĐỐM SÁNG — Trọn Bộ 20 Trang Truyện Tranh Anime / Manga (MLN122)</title>
  <link rel="icon" href="icon.png">
  <style>
    :root {
      --neon-cyan: #00f0ff;
      --neon-pink: #ff007f;
      --neon-green: #00ff66;
      --neon-yellow: #ffe600;
      --bg-dark: #0a0a14;
      --card-bg: #121224;
      --border-color: #242442;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(circle at 50% 20%, #171732 0%, #06060c 100%);
      color: #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      line-height: 1.6;
    }

    /* Top Navigation */
    header {
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 240, 255, 0.25);
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 25px rgba(0, 240, 255, 0.1);
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--neon-cyan);
      box-shadow: 0 0 12px rgba(0, 240, 255, 0.4);
    }

    .brand-title {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1.2px;
      color: #fff;
      text-transform: uppercase;
      text-shadow: 0 0 10px var(--neon-cyan);
    }

    .brand-badge {
      font-size: 10px;
      background: rgba(255, 0, 127, 0.25);
      border: 1px solid var(--neon-pink);
      color: var(--neon-pink);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-nav {
      background: rgba(20, 20, 38, 0.85);
      border: 1px solid var(--neon-cyan);
      color: #fff;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 20px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-nav:hover {
      background: var(--neon-cyan);
      color: #000;
      box-shadow: 0 0 15px var(--neon-cyan);
    }
    .btn-nav.accent {
      border-color: var(--neon-pink);
      background: rgba(255, 0, 127, 0.15);
      color: #ff99cc;
    }
    .btn-nav.accent:hover {
      background: var(--neon-pink);
      color: #fff;
      box-shadow: 0 0 15px var(--neon-pink);
    }

    /* Hero Banner */
    .hero {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 30px 20px 20px;
      text-align: center;
    }

    .hero-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 800;
      color: var(--neon-cyan);
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid var(--neon-cyan);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }

    .hero-title {
      font-size: 28px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: 1.5px;
      text-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
    }

    .hero-subtitle {
      font-size: 14px;
      color: #aaa;
      max-width: 850px;
      margin: 0 auto 20px;
    }

    /* Stats Chips */
    .stats-chips {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 25px;
    }

    .stat-chip {
      background: #141428;
      border: 1px solid #28284e;
      border-radius: 8px;
      padding: 8px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 900;
      color: var(--neon-yellow);
    }
    .stat-lbl {
      font-size: 10px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Character Cast Carousel / Row */
    .character-bar {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto 25px;
      padding: 0 20px;
    }

    .char-title {
      font-size: 13px;
      font-weight: 800;
      color: var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .char-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .char-card {
      background: #101022;
      border: 1px solid #20203a;
      border-radius: 8px;
      padding: 12px;
      position: relative;
      overflow: hidden;
    }
    .char-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 4px; height: 100%;
      background: var(--neon-cyan);
    }
    .char-card.minh::before { background: var(--neon-cyan); }
    .char-card.dom::before { background: var(--neon-yellow); }
    .char-card.mom::before { background: #ffaa44; }
    .char-card.ba::before { background: var(--neon-green); }
    .char-card.truc::before { background: var(--neon-pink); }

    .char-name {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      display: flex;
      justify-content: space-between;
    }
    .char-role {
      font-size: 11px;
      color: #888;
      margin-bottom: 6px;
    }
    .char-quote {
      font-size: 12px;
      color: #bbb;
      font-style: italic;
      line-height: 1.4;
    }

    /* Filter & Search Bar */
    .filter-bar {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto 20px;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chapter-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;
    }

    .tab-btn {
      background: #141428;
      border: 1px solid #28284e;
      color: #aaa;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      border-color: var(--neon-cyan);
      color: #fff;
    }
    .tab-btn.active {
      background: rgba(0, 240, 255, 0.15);
      border-color: var(--neon-cyan);
      color: var(--neon-cyan);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
    }

    .search-input-box {
      position: relative;
      width: 100%;
    }
    .search-input {
      width: 100%;
      background: #121224;
      border: 1px solid #2a2a48;
      border-radius: 8px;
      padding: 10px 16px 10px 38px;
      color: #fff;
      font-size: 13px;
      outline: none;
      transition: border 0.2s;
    }
    .search-input:focus {
      border-color: var(--neon-cyan);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: #666;
    }

    /* Pages Container */
    .pages-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 20px 60px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .page-card {
      background: #101022;
      border: 1px solid #1e1e38;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
      transition: transform 0.2s, border-color 0.2s;
      position: relative;
    }
    .page-card:hover {
      border-color: rgba(0, 240, 255, 0.4);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid #1a1a30;
      flex-wrap: wrap;
      gap: 10px;
    }

    .page-num-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 900;
      color: #000;
      background: var(--neon-cyan);
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 1px;
    }

    .page-chapter-tag {
      font-size: 12px;
      font-weight: 700;
      color: var(--neon-pink);
    }

    .page-title {
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    .page-layout-tag {
      font-size: 12px;
      color: #888;
      font-style: italic;
    }

    /* Artwork Display Box */
    .artwork-section {
      margin-bottom: 20px;
      background: #080812;
      border: 1px solid #1c1c34;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .artwork-img-wrapper {
      position: relative;
      max-width: 520px;
      width: 100%;
      cursor: zoom-in;
      overflow: hidden;
      border-radius: 8px;
      border: 2px solid #2a2a4e;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
      transition: all 0.3s;
    }
    .artwork-img-wrapper:hover {
      border-color: var(--neon-cyan);
      box-shadow: 0 0 25px rgba(0, 240, 255, 0.3);
    }

    .artwork-img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s;
    }
    .artwork-img-wrapper:hover .artwork-img {
      transform: scale(1.02);
    }

    .artwork-badge {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 800;
      color: var(--neon-green);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .placeholder-box {
      width: 100%;
      padding: 24px 16px;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed #2a2a4e;
      border-radius: 8px;
    }
    .placeholder-title {
      font-size: 13px;
      font-weight: 800;
      color: var(--neon-yellow);
      margin-bottom: 6px;
    }
    .placeholder-desc {
      font-size: 12px;
      color: #888;
    }

    /* Panels Grid */
    .panels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .panel-box {
      background: #15152a;
      border: 1px solid #232342;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
    }

    .panel-id-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-id {
      font-size: 12px;
      font-weight: 900;
      color: var(--neon-yellow);
    }
    .panel-shot {
      font-size: 10px;
      font-weight: 700;
      color: #aaa;
      background: #1f1f3a;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .panel-visual {
      font-size: 13px;
      color: #ddd;
      line-height: 1.5;
    }

    .panel-narration {
      background: rgba(0, 240, 255, 0.06);
      border-left: 2px solid var(--neon-cyan);
      padding: 6px 10px;
      font-size: 12px;
      font-style: italic;
      color: #b0e0ff;
    }

    .panel-dialogue-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }

    .dialogue-item {
      display: flex;
      flex-direction: column;
      background: #1a1a34;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 12px;
    }
    .speaker-name {
      font-weight: 800;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .speaker-name.Minh { color: var(--neon-cyan); }
    .speaker-name.Đốm { color: var(--neon-yellow); }
    .speaker-name.Mẹ { color: #ffaa44; }
    .speaker-name.BácBa { color: var(--neon-green); }
    .speaker-name.TRỤC { color: var(--neon-pink); }
    .speech-text {
      color: #f0f0f0;
      font-style: italic;
    }

    .panel-sfx {
      font-size: 11px;
      font-weight: 800;
      color: var(--neon-pink);
      background: rgba(255, 0, 127, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      align-self: flex-start;
    }

    /* MLN122 Theory Insight Box */
    .theory-box {
      background: linear-gradient(135deg, rgba(255, 0, 127, 0.08) 0%, rgba(0, 240, 255, 0.08) 100%);
      border: 1px solid rgba(255, 0, 127, 0.3);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .theory-icon {
      font-size: 22px;
      line-height: 1;
    }
    .theory-content {
      font-size: 13px;
      color: #fff;
    }
    .theory-label {
      font-size: 10px;
      font-weight: 900;
      color: var(--neon-pink);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    /* AI Prompt Collapsible Box */
    .prompt-drawer {
      background: #0d0d1a;
      border: 1px solid #1f1f3a;
      border-radius: 8px;
      overflow: hidden;
    }
    .prompt-drawer-header {
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      background: #141426;
      font-size: 12px;
      font-weight: 700;
      color: #aaa;
      user-select: none;
    }
    .prompt-drawer-header:hover {
      color: #fff;
      background: #1a1a32;
    }
    .prompt-drawer-body {
      padding: 12px 14px;
      display: none;
      flex-direction: column;
      gap: 10px;
    }
    .prompt-drawer-body.show {
      display: flex;
    }
    .prompt-code {
      background: #080810;
      border: 1px solid #22223a;
      border-radius: 6px;
      padding: 10px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      color: #00ffaa;
      white-space: pre-wrap;
      word-break: break-all;
      user-select: all;
    }
    .btn-copy-prompt {
      align-self: flex-end;
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid var(--neon-cyan);
      color: #fff;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 800;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-copy-prompt:hover {
      background: var(--neon-cyan);
      color: #000;
    }

    /* Lightbox Modal */
    #lightbox-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(8px);
      z-index: 99999;
      justify-content: center;
      align-items: center;
      padding: 20px;
      cursor: zoom-out;
    }
    #lightbox-modal.show {
      display: flex;
    }
    #lightbox-img {
      max-width: 95vw;
      max-height: 95vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 0 50px rgba(0, 240, 255, 0.3);
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 25px;
      font-size: 32px;
      color: #fff;
      cursor: pointer;
      font-weight: bold;
    }

    /* Floating Toast */
    #copy-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(0, 240, 255, 0.95);
      color: #000;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      box-shadow: 0 4px 20px rgba(0, 240, 255, 0.4);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
      z-index: 9999;
    }
    #copy-toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    footer {
      background: #080812;
      border-top: 1px solid #1a1a2e;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
    footer a { color: var(--neon-cyan); text-decoration: none; }

    @media (max-width: 768px) {
      .hero-title { font-size: 22px; }
      .page-title { font-size: 17px; }
      .panels-grid { grid-template-columns: 1fr; }
      .nav-actions { justify-content: flex-end; }
    }
  </style>
</head>
<body>

  <!-- Top Header Navigation -->
  <header>
    <div class="brand-group">
      <img src="icon.png" class="brand-logo" alt="Logo">
      <div>
        <div class="brand-title">GIỮ MỘT ĐỐM SÁNG</div>
        <div class="brand-badge">ĐỒ ÁN MLN122 • ANIME / MANGA</div>
      </div>
    </div>
    <div class="nav-actions">
      <a href="index.html" class="btn-nav">◀ Lật Sách 3D</a>
      <a href="ar-camera.html" class="btn-nav">📷 AR Hologram</a>
      <a href="targets-viewer.html" class="btn-nav">🎯 Quét AR</a>
      <a href="docs/CUON_TRUYEN_20_TRANG_GIU_MOT_DOM_SANG_MLN122.md" target="_blank" class="btn-nav accent">📥 Tải Kịch Bản (.md)</a>
      <a href="docs/AI_COMIC_FACTORY_20_TRANG_PROMPTS.md" target="_blank" class="btn-nav accent">🎨 Tải Prompts (.md)</a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-badge">ĐẠI HỌC FPT • HỌC PHẦN KINH TẾ CHÍNH TRỊ MÁC - LÊNIN (MLN122)</div>
    <h1 class="hero-title">BỘ TRUYỆN TRANH ANIME / MANGA: 20 TRANG TOÀN TẬP</h1>
    <p class="hero-subtitle">
      Khám phá 5 Chương kịch tính với 85 Phân cảnh điện ảnh chuẩn phong cách <strong>Japanese Anime / Manga (Makoto Shinkai & Kyoto Animation)</strong>, lồng ghép sâu sắc lý luận <strong>Chương 4: Cạnh tranh & Độc quyền Nhà nước</strong> — Cuộc đấu tranh vì ánh sáng công bằng tại đô thị Vòm-9.
    </p>

    <!-- Project Metrics Chips -->
    <div class="stats-chips">
      <div class="stat-chip">
        <span class="stat-val">20</span>
        <span class="stat-lbl">Trang Nội Dung</span>
      </div>
      <div class="stat-chip">
        <span class="stat-val" style="color:var(--neon-green);">9</span>
        <span class="stat-lbl">Tranh Đã Xuất Bản</span>
      </div>
      <div class="stat-chip">
        <span class="stat-val">85</span>
        <span class="stat-lbl">Khung Phân Cảnh</span>
      </div>
      <div class="stat-chip">
        <span class="stat-val">100%</span>
        <span class="stat-lbl">Phong Cách Anime Nhật</span>
      </div>
      <div class="stat-chip">
        <span class="stat-val">MLN122</span>
        <span class="stat-lbl">Chuẩn Lý Luận Chương 4</span>
      </div>
    </div>
  </section>

  <!-- Character Cast Section -->
  <section class="character-bar">
    <div class="char-title">✨ Tuyến Nhân Vật Phong Cách Anime / Manga</div>
    <div class="char-grid">
      <div class="char-card minh">
        <div class="char-name">MINH (22T) <span>👓</span></div>
        <div class="char-role">Kỹ sư điện tử anime • Tự do sáng tạo</div>
        <div class="char-quote">"Nhà mình vẫn phải sáng chứ mẹ. Bớt mấy chỗ chạy thừa thì ai cũng được dùng điện rẻ."</div>
      </div>
      <div class="char-card dom">
        <div class="char-name">AI ĐỐM <span>⚡</span></div>
        <div class="char-role">Chibi wisp mascot • Bạn đồng hành trung thành</div>
        <div class="char-quote">"Minh! Tớ không thể gửi cảnh báo, nhưng câu nói ấy chính là chìa khóa mở ổ cứng!"</div>
      </div>
      <div class="char-card mom">
        <div class="char-name">MẸ MINH (52T) <span>👟</span></div>
        <div class="char-role">Người mẹ hiền hậu • Đại diện giai cấp lao động</div>
        <div class="char-quote">"Có cách đỡ tốn hơn, sao người nghèo chúng tôi lại không được quyền lựa chọn?"</div>
      </div>
      <div class="char-card ba">
        <div class="char-name">BÁC BA (65T) <span>🔧</span></div>
        <div class="char-role">Cựu thợ điện Vòm-9 • Tiếng nói nhân dân</div>
        <div class="char-quote">"Mạng lưới điện này ngày xưa chính tay chúng tôi đổ mồ hôi dựng nên bằng tiền thuế của dân!"</div>
      </div>
      <div class="char-card truc">
        <div class="char-name">TẬP ĐOÀN TRỤC <span>🏢</span></div>
        <div class="char-role">Tư bản độc quyền số • Độc quyền Nhà nước</div>
        <div class="char-quote">"Thiết bị ngoài hệ sinh thái TRỤC. Từ chối kết nối hạ tầng công cộng!"</div>
      </div>
    </div>
  </section>

  <!-- Filter & Search Controls -->
  <section class="filter-bar">
    <div class="chapter-tabs" id="chapterTabs">
      <button class="tab-btn active" onclick="filterChapter(0)">Toàn Bộ 20 Trang</button>
      <button class="tab-btn" onclick="filterChapter(1)">Chương I: Bóng Tối Vòm-9 (1-4)</button>
      <button class="tab-btn" onclick="filterChapter(2)">Chương II: Ngọn Lửa & Bẫy Ngầm (5-8)</button>
      <button class="tab-btn" onclick="filterChapter(3)">Chương III: Bức Tường Độc Quyền (9-12)</button>
      <button class="tab-btn" onclick="filterChapter(4)">Chương IV: Giải Mã Sự Thật (13-16)</button>
      <button class="tab-btn" onclick="filterChapter(5)">Chương V: Ngọn Lửa Cộng Đồng (17-20)</button>
    </div>
    <div class="search-input-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="searchInput" class="search-input" placeholder="Tìm kiếm theo nhân vật, lời thoại, khung tranh, hoặc khái niệm MLN122 (VD: siêu ngạch, đôi giày, độc quyền nhà nước)..." oninput="handleSearch()">
    </div>
  </section>

  <!-- Main Pages Container -->
  <main class="pages-container" id="pagesContainer">
    <!-- Generated Dynamically by JS -->
  </main>

  <!-- Lightbox Modal for Full Image Zoom -->
  <div id="lightbox-modal" onclick="closeLightbox()">
    <span class="lightbox-close">&times;</span>
    <img id="lightbox-img" src="" alt="Zoom Image">
  </div>

  <!-- Copy Toast Notification -->
  <div id="copy-toast">📋 Đã sao chép Prompt thành công!</div>

  <!-- Footer -->
  <footer>
    <p><strong>GIỮ MỘT ĐỐM SÁNG: VÒM-9</strong> — Sản phẩm Truyện tranh Tương tác AR phục vụ Đồ án Học phần MLN122</p>
    <p style="margin-top: 6px;">Đại học FPT © 2026 • Triển khai trên nền tảng Web AR & 3D Flipbook</p>
  </footer>

  <!-- Script Data & Logic -->
  <script>
    const PAGES_DATA = ${JSON.stringify(pagesData, null, 2)};

    let currentChapter = 0;
    let searchQuery = '';

    function renderPages() {
      const container = document.getElementById('pagesContainer');
      container.innerHTML = '';

      const filtered = PAGES_DATA.filter(p => {
        const matchesChapter = currentChapter === 0 || p.chapter.num === currentChapter;
        if (!matchesChapter) return false;

        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inTheory = p.theory.toLowerCase().includes(q);
        const inPanels = p.panels.some(pan => 
          pan.visual.toLowerCase().includes(q) || 
          pan.narration.toLowerCase().includes(q) ||
          pan.dialogues.some(d => d.text.toLowerCase().includes(q) || d.speaker.toLowerCase().includes(q))
        );
        return inTitle || inTheory || inPanels;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 60px 20px; color: #888;">Không tìm thấy trang truyện nào khớp với từ khóa tìm kiếm.</div>';
        return;
      }

      filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'page-card';
        card.id = 'page-' + p.num;

        let artworkHtml = '';
        if (p.hasImage) {
          artworkHtml = 
            '<div class="artwork-section">' +
              '<div class="artwork-img-wrapper" onclick="openLightbox(\'' + p.imageSrc + '\')">' +
                '<img src="' + p.imageSrc + '" class="artwork-img" alt="Bản vẽ Trang ' + p.num + '">' +
              '</div>' +
              '<div class="artwork-badge">✨ BẢN VẼ ANIME / MANGA ĐÃ HOÀN TẤT (BẤM VÀO ẢNH ĐỂ PHÓNG TO TOÀN MÀN HÌNH)</div>' +
            '</div>';
        } else {
          artworkHtml = 
            '<div class="artwork-section">' +
              '<div class="placeholder-box">' +
                '<div class="placeholder-title">🎨 PHÂN CẢNH ĐANG CHỜ XUẤT ẢNH ANIME (MIDJOURNEY NIJI 6 / FLUX)</div>' +
                '<div class="placeholder-desc">Sử dụng Master Prompt chuẩn hóa ở bên dưới để xuất ảnh tức thì cho Trang ' + p.num + '</div>' +
              '</div>' +
            '</div>';
        }

        let panelsHtml = '';
        p.panels.forEach(pan => {
          let dialogHtml = '';
          if (pan.dialogues && pan.dialogues.length > 0) {
            dialogHtml = '<div class="panel-dialogue-list">' + pan.dialogues.map(d => {
              const spkClean = d.speaker.replace(/[^a-zA-Z0-9]/g, '');
              return '<div class="dialogue-item">' +
                '<span class="speaker-name ' + spkClean + '">' + d.speaker + '</span>' +
                '<span class="speech-text">“' + d.text + '”</span>' +
              '</div>';
            }).join('') + '</div>';
          }

          let narrationHtml = pan.narration ? '<div class="panel-narration">“' + pan.narration + '”</div>' : '';
          let sfxHtml = pan.sfx ? '<div class="panel-sfx">⚡ ' + pan.sfx + '</div>' : '';
          let textScreenHtml = pan.textOnScreen ? '<div style="font-size:11px; color:#ff9900; background:#221500; padding:4px 8px; border-radius:4px;">💻 Màn hình: ' + pan.textOnScreen + '</div>' : '';

          panelsHtml += '<div class="panel-box">' +
            '<div class="panel-id-bar">' +
              '<span class="panel-id">' + pan.id + '</span>' +
              '<span class="panel-shot">' + pan.title + '</span>' +
            '</div>' +
            '<div class="panel-visual">' + pan.visual + '</div>' +
            narrationHtml +
            textScreenHtml +
            dialogHtml +
            sfxHtml +
          '</div>';
        });

        card.innerHTML = 
          '<div class="page-header">' +
            '<div>' +
              '<div class="page-chapter-tag">CHƯƠNG ' + p.chapter.num + ': ' + p.chapter.title + '</div>' +
              '<h2 class="page-title">' + p.title + '</h2>' +
              '<div class="page-layout-tag">📐 ' + p.layout + '</div>' +
            '</div>' +
            '<span class="page-num-badge">TRANG ' + (p.num < 10 ? '0' + p.num : p.num) + '</span>' +
          '</div>' +

          artworkHtml +

          '<div class="panels-grid">' +
            panelsHtml +
          '</div>' +

          '<div class="theory-box">' +
            '<span class="theory-icon">📚</span>' +
            '<div>' +
              '<div class="theory-label">Lý luận Kinh tế Chính trị Mác - Lênin (Chương 4)</div>' +
              '<div class="theory-content">' + p.theory + '</div>' +
            '</div>' +
          '</div>' +

          (p.prompt ? (
            '<div class="prompt-drawer">' +
              '<div class="prompt-drawer-header" onclick="togglePrompt(' + p.num + ')">' +
                '<span>🎨 Master Prompt Anime / Manga (Niji 6 / Midjourney V6 / Flux)</span>' +
                '<span id="prompt-chevron-' + p.num + '">▼ Bấm để xem Prompt</span>' +
              '</div>' +
              '<div class="prompt-drawer-body" id="prompt-body-' + p.num + '">' +
                '<div class="prompt-code" id="prompt-text-' + p.num + '">' + p.prompt + '</div>' +
                '<button class="btn-copy-prompt" onclick="copyPrompt(' + p.num + ')">📋 Sao Chép Prompt</button>' +
              '</div>' +
            '</div>'
          ) : '');

        container.appendChild(card);
      });
    }

    function filterChapter(num) {
      currentChapter = num;
      const tabs = document.querySelectorAll('.tab-btn');
      tabs.forEach((tab, idx) => {
        if (idx === num) tab.classList.add('active');
        else tab.classList.remove('active');
      });
      renderPages();
    }

    function handleSearch() {
      searchQuery = document.getElementById('searchInput').value.trim();
      renderPages();
    }

    function togglePrompt(pNum) {
      const body = document.getElementById('prompt-body-' + pNum);
      const chevron = document.getElementById('prompt-chevron-' + pNum);
      if (body.classList.contains('show')) {
        body.classList.remove('show');
        chevron.textContent = '▼ Bấm để xem Prompt';
      } else {
        body.classList.add('show');
        chevron.textContent = '▲ Thu gọn';
      }
    }

    function copyPrompt(pNum) {
      const codeEl = document.getElementById('prompt-text-' + pNum);
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        showToast('📋 Đã sao chép Prompt Anime Trang ' + pNum + ' vào clipboard!');
      }).catch(() => {
        showToast('Lỗi khi sao chép!');
      });
    }

    function openLightbox(src) {
      const modal = document.getElementById('lightbox-modal');
      const img = document.getElementById('lightbox-img');
      img.src = src;
      modal.classList.add('show');
    }

    function closeLightbox() {
      document.getElementById('lightbox-modal').classList.remove('show');
    }

    function showToast(msg) {
      const toast = document.getElementById('copy-toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // Initial render
    window.addEventListener('DOMContentLoaded', () => {
      renderPages();
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'novel-reader.html'), html, 'utf8');
console.log('Successfully generated novel-reader.html with artwork integration!');
