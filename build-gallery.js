// build-gallery.js
const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(path.join(__dirname, 'docs', 'CUON_TRUYEN_20_TRANG_GIU_MOT_DOM_SANG_MLN122.md'), 'utf8');
const promptContent = fs.readFileSync(path.join(__dirname, 'docs', 'AI_COMIC_FACTORY_20_TRANG_PROMPTS.md'), 'utf8');

// Parse prompts
const promptPages = {};
const promptBlocks = promptContent.split(/### 📌 TRANG (\d+) — ([^\n]+)/);
for (let i = 1; i < promptBlocks.length; i += 3) {
  const pNum = parseInt(promptBlocks[i]);
  const pTitle = promptBlocks[i + 1].trim();
  const body = promptBlocks[i + 2];
  const m = body.match(/```text\n([\s\S]*?)```/);
  promptPages[pNum] = m ? m[1].trim() : '';
}

// Parse pages from script
const pageBlocks = scriptContent.split(/### TRANG (\d+) — ([^\n]+)/);
const pages = [];

for (let i = 1; i < pageBlocks.length; i += 3) {
  const pNum = parseInt(pageBlocks[i]);
  const pTitle = pageBlocks[i + 1].trim();
  const body = pageBlocks[i + 2];

  const layoutMatch = body.match(/\*Bố cục trang:\*([^\n]+)/);
  const layout = layoutMatch ? layoutMatch[1].trim() : '';

  const panelMatches = [...body.matchAll(/- \*\*(P\d+-K\d+) \(([^)]+)\):\*\*([\s\S]*?)(?=(?:- \*\*P\d+-K\d+|\n---|\n###|$))/g)];
  const panels = panelMatches.map(pm => {
    const kId = pm[1];
    const kTitle = pm[2].trim();
    const kBody = pm[3].trim();
    const visualM = kBody.match(/- \*\*Hình ảnh:\*\*([\s\S]*?)(?=- \*\*|$)/);
    const narrM = kBody.match(/- \*\*Lời dẫn(?:\s*\([^)]*\))?:\*\*([\s\S]*?)(?=- \*\*|$)/);
    
    const dialogues = [];
    const dialogLines = kBody.match(/- \*\*Thoại — ([^*]+)\*\*:\s*([^\n]+)/g);
    if (dialogLines) {
      for (const dl of dialogLines) {
        const m = dl.match(/- \*\*Thoại — ([^*]+)\*\*:\s*([^\n]+)/);
        if (m) dialogues.push({ speaker: m[1].trim(), text: m[2].trim() });
      }
    }

    return {
      id: kId,
      title: kTitle,
      visual: visualM ? visualM[1].trim() : '',
      narration: narrM ? narrM[1].trim() : '',
      dialogues: dialogues
    };
  });

  const imgPath = path.join(__dirname, 'assets', 'comic_20pages', 'page_' + pNum + '.jpg');
  const hasImg = fs.existsSync(imgPath);

  pages.push({
    num: pNum,
    title: pTitle,
    layout: layout,
    panels: panels,
    prompt: promptPages[pNum] || '',
    hasImg: hasImg,
    imgSrc: hasImg ? `assets/comic_20pages/page_${pNum}.jpg` : ''
  });
}

let articlesHtml = `
    <!-- Character Model Sheet Card (baoyu-comic & ai-comic-factory) -->
    <article class="page-wrapper model-sheet-card">
      <div class="page-tag-bar" style="background:#1a1028; border-color:#ff007f;">
        <span class="page-title" style="color:var(--neon-pink);">✨ BẢNG KHÓA ĐỒNG NHẤT NHÂN VẬT (CHARACTER MODEL SHEET)</span>
        <span class="page-badge" style="background:rgba(255,0,127,0.2); border:1px solid var(--neon-pink); color:var(--neon-pink);">CHUẨN BAOYU-COMIC</span>
      </div>
      <div class="sheet-body">
        <p class="sheet-desc">
          Để chấm dứt tình trạng <em>"nhân vật mỗi trang mỗi khác"</em>, dự án đã thiết lập hệ thống <strong>Character Model Sheet</strong> và <strong>Token Anchor</strong> chuẩn hóa của <code>baoyu-comic</code>. Tất cả các trang đều dùng chung một bộ thông số nhận diện và mỏ neo tham chiếu <code>--cref characters/characters.png --cw 80 --niji 6</code>:
        </p>
        <div class="character-specs-grid">
          <div class="spec-card minh-border">
            <div class="spec-name">👓 MINH (22 Tuổi)</div>
            <div class="spec-detail">
              <strong>Khuôn mặt:</strong> Anime boy thon gọn, tóc đen layer hơi rối, đeo kính gọng tròn mảnh kim loại bạc.<br>
              <strong>Trang phục cố định:</strong> Áo gile kỹ thuật xanh rêu <code>#4b5320</code> có túi hộp viền cam <code>#ff6b35</code>, áo thun cộc tay xám tro <code>#2c2c36</code>, quần cargo đen.<br>
              <strong>Biểu tượng mỏ neo:</strong> Ô cửa sổ méo lệch 172 độ có chấm vàng Nếp Sáng.
            </div>
          </div>
          <div class="spec-card dom-border">
            <div class="spec-name">⚡ AI ĐỐM (Chibi Mascot)</div>
            <div class="spec-detail">
              <strong>Hình thái:</strong> Quả cầu hạt sáng đường kính 15cm, lõi vàng hổ phách <code>#ffe600</code>, hào quang ngọc cyan <code>#00f0ff</code>.<br>
              <strong>Biểu cảm:</strong> Hai đốm mắt hạt đậu đen cực kỳ linh động, vệt hạt bụi sáng bay theo sau.<br>
              <strong>Câu nói mỏ neo:</strong> <em>“Nhà mình vẫn phải sáng chứ.”</em>
            </div>
          </div>
          <div class="spec-card mom-border">
            <div class="spec-name">👟 MẸ MINH (52 Tuổi)</div>
            <div class="spec-detail">
              <strong>Diện mạo:</strong> Tóc điểm bạc búi thấp trâm gỗ, khuôn mặt hiền hậu hằn nếp nhăn lao động.<br>
              <strong>Trang phục cố định:</strong> Áo cánh vải hoa nhí bạc màu hồng đất <code>#8b5a5a</code>, quần lụa đen.<br>
              <strong>Vật phẩm mỏ neo:</strong> Đôi giày vải sờn rách đế bôi keo dán lại & cuốn sổ chi tiêu gạch xóa.
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Bìa Truyện -->
    <article class="page-wrapper">
      <div class="page-tag-bar">
        <span class="page-title">BÌA TRUYỆN — VÒM-9</span>
        <span class="page-badge live">✨ ĐÃ XUẤT BẢN</span>
      </div>
      <img src="assets/comic_cover.jpg" class="comic-img" alt="Bìa Truyện" onclick="openLightbox(this.src)">
      <div class="page-caption">
        <strong>Giữ Một Đốm Sáng:</strong> Minh và AI Đốm đứng trước toàn cảnh thành phố Vòm-9 lúc chiều tà dưới mái vòm thép khổng lồ.
      </div>
    </article>
`;

pages.forEach(p => {
  if (p.hasImg) {
    let panelDesc = p.panels.map(pan => `<strong>${pan.id}:</strong> ${pan.visual}`).join('<br><br>');
    articlesHtml += `
    <article class="page-wrapper" id="page-${p.num}">
      <div class="page-tag-bar">
        <span class="page-title">TRANG ${p.num < 10 ? '0' + p.num : p.num} — ${p.title}</span>
        <span class="page-badge live">✨ TRANH ANIME ĐÃ XUẤT BẢN</span>
      </div>
      <img src="${p.imgSrc}" class="comic-img" alt="Trang ${p.num}" onclick="openLightbox(this.src)">
      <div class="page-caption">
        ${panelDesc}
      </div>
    </article>`;
  } else {
    let panelsListHtml = p.panels.map(pan => {
      let dHtml = pan.dialogues.map(d => `<div class="storyboard-dialogue"><strong>${d.speaker}:</strong> “${d.text}”</div>`).join('');
      return `
        <div class="storyboard-panel">
          <div class="panel-header-mini">
            <span class="panel-code">${pan.id}</span>
            <span class="panel-shot-mini">${pan.title}</span>
          </div>
          <div class="panel-desc-mini">${pan.visual}</div>
          ${dHtml}
        </div>`;
    }).join('');

    articlesHtml += `
    <article class="page-wrapper pending-card" id="page-${p.num}">
      <div class="page-tag-bar">
        <span class="page-title">TRANG ${p.num < 10 ? '0' + p.num : p.num} — ${p.title}</span>
        <span class="page-badge pending">⏳ ĐANG CHỜ QUOTA RESET // ĐÃ CÓ PROMPT NIJI 6</span>
      </div>
      <div class="storyboard-container">
        <div class="storyboard-intro">
          <strong>📐 Phân cảnh Storyboard chi tiết:</strong> ${p.layout}
        </div>
        <div class="storyboard-grid">
          ${panelsListHtml}
        </div>
      </div>
      <div class="prompt-quickbox">
        <div class="prompt-header-row">
          <span>🎨 Master Prompt Anime Niji 6 (Midjourney / Flux.1):</span>
          <button class="btn-copy-mini" onclick="copyPrompt('${p.num}')">📋 Sao Chép Prompt</button>
        </div>
        <pre class="prompt-text-block" id="prompt-${p.num}">${p.prompt}</pre>
      </div>
    </article>`;
  }
});

const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GIỮ MỘT ĐỐM SÁNG — Toàn Bộ 20 Trang Truyện Tranh Anime / Manga (Vòm-9)</title>
  <link rel="icon" href="icon.png">
  <style>
    :root {
      --neon-cyan: #00f0ff;
      --neon-pink: #ff007f;
      --neon-green: #00ff66;
      --neon-yellow: #ffe600;
      --bg-dark: #070712;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #070712;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    header {
      width: 100%;
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 240, 255, 0.25);
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }

    .brand-title {
      font-size: 16px;
      font-weight: 900;
      color: var(--neon-cyan);
      letter-spacing: 1px;
    }
    .brand-sub {
      font-size: 11px;
      color: #888;
    }

    .nav-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-nav {
      background: #151528;
      border: 1px solid var(--neon-cyan);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-nav:hover {
      background: var(--neon-cyan);
      color: #000;
    }

    /* Webtoon Continuous Scroll Container */
    .comic-stream {
      max-width: 760px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      padding: 24px 16px 60px;
    }

    .page-wrapper {
      width: 100%;
      background: #111122;
      border: 1px solid #222244;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.8);
      position: relative;
    }
    .page-wrapper.pending-card {
      border-color: rgba(255, 230, 0, 0.3);
      background: #0d0d1e;
    }

    /* Model Sheet Styles */
    .model-sheet-card {
      border-color: rgba(255, 0, 127, 0.4);
      background: #0e0a1a;
    }
    .sheet-body {
      padding: 16px 20px;
    }
    .sheet-desc {
      font-size: 13px;
      color: #ccc;
      line-height: 1.5;
      margin-bottom: 14px;
    }
    .character-specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    .spec-card {
      background: #151126;
      border: 1px solid #2a1f48;
      border-radius: 8px;
      padding: 12px;
    }
    .spec-card.minh-border { border-left: 3px solid var(--neon-cyan); }
    .spec-card.dom-border { border-left: 3px solid var(--neon-yellow); }
    .spec-card.mom-border { border-left: 3px solid #ffaa44; }
    .spec-name {
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 6px;
    }
    .spec-detail {
      font-size: 11px;
      color: #bbb;
      line-height: 1.5;
    }

    .page-tag-bar {
      padding: 12px 16px;
      background: #16162e;
      border-bottom: 1px solid #25254a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .page-title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
    }
    .page-badge {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .page-badge.live {
      background: rgba(0, 255, 102, 0.15);
      border: 1px solid var(--neon-green);
      color: var(--neon-green);
    }
    .page-badge.pending {
      background: rgba(255, 230, 0, 0.15);
      border: 1px solid var(--neon-yellow);
      color: var(--neon-yellow);
    }

    .comic-img {
      width: 100%;
      height: auto;
      display: block;
      cursor: zoom-in;
      transition: transform 0.2s;
    }
    .comic-img:hover {
      opacity: 0.96;
    }

    .page-caption {
      padding: 14px 18px;
      font-size: 13px;
      color: #ccc;
      line-height: 1.6;
      background: #0d0d1a;
      border-top: 1px solid #1a1a34;
    }

    /* Storyboard Placeholder for Pending Pages */
    .storyboard-container {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .storyboard-intro {
      font-size: 12px;
      color: #aaa;
      font-style: italic;
    }
    .storyboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }
    .storyboard-panel {
      background: #15152a;
      border: 1px solid #252548;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .panel-header-mini {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }
    .panel-code {
      font-weight: 900;
      color: var(--neon-cyan);
    }
    .panel-shot-mini {
      color: #888;
    }
    .panel-desc-mini {
      font-size: 12px;
      color: #ddd;
      line-height: 1.4;
    }
    .storyboard-dialogue {
      font-size: 11px;
      color: #bbb;
      font-style: italic;
      background: #101020;
      padding: 4px 8px;
      border-radius: 4px;
      border-left: 2px solid var(--neon-yellow);
    }

    /* Prompt Box */
    .prompt-quickbox {
      background: #090914;
      border-top: 1px solid #202040;
      padding: 12px 16px;
    }
    .prompt-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: bold;
      color: #aaa;
    }
    .btn-copy-mini {
      background: rgba(0, 240, 255, 0.15);
      border: 1px solid var(--neon-cyan);
      color: #fff;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-copy-mini:hover {
      background: var(--neon-cyan);
      color: #000;
    }
    .prompt-text-block {
      background: #05050a;
      border: 1px solid #1a1a30;
      border-radius: 6px;
      padding: 8px 10px;
      font-family: monospace;
      font-size: 11px;
      color: #00ffaa;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Lightbox Modal */
    #lightbox {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99999;
      justify-content: center;
      align-items: center;
      cursor: zoom-out;
      padding: 10px;
    }
    #lightbox.show {
      display: flex;
    }
    #lightbox-img {
      max-width: 96vw;
      max-height: 96vh;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 0 50px rgba(0, 240, 255, 0.3);
    }

    #copy-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--neon-cyan);
      color: #000;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 13px;
      opacity: 0;
      transform: translateY(60px);
      transition: all 0.3s;
      z-index: 9999;
    }
    #copy-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    footer {
      padding: 30px 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
      width: 100%;
      background: #05050a;
      border-top: 1px solid #151525;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <div class="brand-title">GIỮ MỘT ĐỐM SÁNG: VÒM-9</div>
      <div class="brand-sub">TRỌN BỘ 20 TRANG TRUYỆN TRANH (ANIME / MANGA VIEW)</div>
    </div>
    <div class="nav-actions">
      <a href="index.html" class="btn-nav">📖 Sách Lật 3D</a>
      <a href="novel-reader.html" class="btn-nav" style="border-color:var(--neon-pink); color:var(--neon-pink);">📚 Kịch Bản 20 Trang</a>
      <a href="ar-camera.html" class="btn-nav">📷 Quét AR</a>
    </div>
  </header>

  <main class="comic-stream">
    ${articlesHtml}
  </main>

  <div id="lightbox" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Zoom Image">
  </div>

  <div id="copy-toast">📋 Đã sao chép Prompt thành công!</div>

  <footer>
    <p><strong>GIỮ MỘT ĐỐM SÁNG: VÒM-9</strong> — Đồ Án Học Phần Kinh Tế Chính Trị Mác – Lênin (MLN122)</p>
    <p style="margin-top: 6px;">Đại học FPT © 2026 • Trọn bộ 20 Trang Truyện Tranh Tương Tác</p>
  </footer>

  <script>
    function openLightbox(src) {
      const lb = document.getElementById('lightbox');
      const img = document.getElementById('lightbox-img');
      img.src = src;
      lb.classList.add('show');
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('show');
    }

    function copyPrompt(num) {
      const el = document.getElementById('prompt-' + num);
      if (!el) return;
      navigator.clipboard.writeText(el.textContent).then(() => {
        const toast = document.getElementById('copy-toast');
        toast.textContent = '📋 Đã sao chép Prompt Anime Trang ' + num + '!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'gallery.html'), fullHtml, 'utf8');
console.log('Successfully regenerated gallery.html with Character Model Sheet!');
