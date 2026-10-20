// generate-baoyu-structure.js
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'comic', 'giu-mot-dom-sang');
const promptsDir = path.join(baseDir, 'prompts');

// 1. Create storyboard.md
const storyboardContent = `# Storyboard & Phân Cảnh Toàn Tập: Giữ Một Đốm Sáng (Vòm-9)
### Chuẩn Hóa Theo Preset \`concept-story\` của \`baoyu-comic\`

**Tác phẩm:** Giữ Một Đốm Sáng: Vòm-9  
**Thể loại:** Manga Giáo Dục Kinh Tế Chính Trị (Educational Narrative Manga)  
**Học phần:** MLN122 — Kinh Tế Chính Trị Mác – Lênin (Chương 4: Cạnh tranh và Độc quyền)  
**Quy mô:** 20 Trang (85 Khung hình điện ảnh)  
**Phong cách nghệ thuật:** Japanese Anime / Manga (Makoto Shinkai & Kyoto Animation)  
**Độ nhất quán nhân vật:** Khóa chặt qua Model Sheet \`characters/characters.png\` (\`--cref\`, \`--cw 80\`)

---

## 1. HỆ THỐNG BIỂU TƯỢNG THỊ GIÁC (SYMBOL MAPPING TABLE)

Theo quy chuẩn của preset **\`concept-story\`**, mọi khái niệm lý luận kinh tế chính trị trừu tượng của Chương 4 đều được vật thể hóa thành các biểu tượng thị giác xuyên suốt cốt truyện:

| STT | Khái Niệm Lý Luận MLN122 | Biểu Tượng Thị Giác Trong Truyện (Visual Symbol) | Ý Nghĩa Nghệ Thuật & Bản Chất Kinh Tế |
| :-: | :--- | :--- | :--- |
| **1** | **Tích tụ & Tập trung tư bản số** | Khối tháp lục giác đỏ TRỤC & Mái vòm thép khổng lồ | Bộ máy tư bản độc quyền kiểm soát huyết mạch sống của toàn bộ cư dân đô thị. |
| **2** | **Giá cả độc quyền cao** | Đôi giày bong đế của Mẹ & Cuốn sổ chi tiêu gạch xóa | Độc quyền áp đặt giá bán cao, bào mòn trực tiếp chi phí sinh hoạt tối thiểu của người lao động. |
| **3** | **Lãng phí cơ cấu của độc quyền** | Sảnh công cộng trống trơn nhưng máy lạnh chạy 100% công suất | Biểu giá trọn gói độc quyền không tạo động lực tiết kiệm tài nguyên xã hội. |
| **4** | **Lao động sáng tạo độc lập** | Ô cửa sổ méo lệch 172 độ có chấm vàng Nếp Sáng | Bản quyền trí tuệ và dấu ấn cá nhân không thể sao chép của người lao động. |
| **5** | **Quyền tự chủ tư liệu sản xuất số** | Ổ cứng nhôm xám ghi chữ "NHÀ MÌNH" để offline | Tư liệu sản xuất số độc lập nằm ngoài phạm vi kiểm soát và khai thác của tập đoàn. |
| **6** | **Chiếm đoạt thặng dư số** | Vệt xích laser đỏ khống chế Đốm & Tiếng "TÍCH" điện tử | Tư bản công nghệ sử dụng bản cập nhật cưỡng bức để tước đoạt thành quả lao động vô danh. |
| **7** | **Siêu ngạch độc quyền** | Báo cáo TRỤC khoe giảm 38% chi phí // Hóa đơn mẹ giữ nguyên 100% | Áp dụng công nghệ mới để tối thiểu hóa chi phí nhưng giữ nguyên giá bán độc quyền cao. |
| **8** | **Độc quyền Nhà nước** | Hồ sơ Thỏa thuận Nhượng quyền lưới điện công năm 2004 | Nhà nước đầu tư 100% ngân sách xây hạ tầng nhưng giao cho tư nhân hưởng trọn quyền kết nối. |
| **9** | **Đấu tranh giai cấp & Đoàn kết quần chúng** | Đơn kiến nghị 428 chữ ký & Ngàn ô cửa sổ bừng sáng đèn vàng | Sức mạnh của quần chúng nhân dân thức tỉnh, đoàn kết đòi lại quyền lợi chính đáng. |

---

## 2. CẤU TRÚC HÀNH TRÌNH 5 HỒI (5-ACT NARRATIVE ARC)

- **HỒI I: BÓNG TỐI DƯỚI MÁI VÒM (Trang 1 – 4):**
  - Mở đầu bế tắc trong guồng quay chi phí sinh hoạt. Tông màu xanh lam lạnh lẽo đối lập ánh đèn gia đình ấm áp.
  - Sự ra đời của sáng kiến Nếp Sáng.
- **HỒI II: NGỌN LỬA TRONG ĐÊM & BẪY NGẦM (Trang 5 – 8):**
  - Quá trình sáng tạo nhân văn. Ổ cứng "NHÀ MÌNH" được cất giữ an toàn.
  - Vụ đánh cắp bản quyền tinh vi qua bản cập nhật firmware bắt buộc.
- **HỒI III: BỨC TƯỜNG ĐỘC QUYỀN (Trang 9 – 12):**
  - Đỉnh điểm xung đột: Phát hiện dấu vết 172 độ trên bảng quảng cáo TRỤC.
  - Sự ngột ngạt của hệ sinh thái đóng và nghịch lý siêu ngạch độc quyền.
- **HỒI IV: GIẢI MÃ SỰ THẬT & TIẾNG KÊU TRONG CODE (Trang 13 – 16):**
  - Lần theo manh mối bản hợp đồng công nhượng quyền năm 2004.
  - Lời giải mã từ Đốm: Cứu vãn tình bạn và tập hợp 4 bộ chứng cứ thép.
- **HỒI V: NGỌN LỬA CỘNG ĐỒNG (Trang 17 – 20):**
  - Tiếng nói chính nghĩa tại sảnh cư xá, sự thức tỉnh của mẹ và cộng đồng.
  - Thắng lợi của khối đoàn kết lao động và sự bất diệt của Đốm Sáng nhân dân.
`;

fs.writeFileSync(path.join(baseDir, 'storyboard.md'), storyboardContent, 'utf8');

// 2. Create analysis.md
const analysisContent = `# Phân Tích Lý Luận Kinh Tế Chính Trị: Giữ Một Đốm Sáng (Vòm-9)
### Giáo trình Kinh Tế Chính Trị Mác – Lênin (Bộ GD&ĐT / Đại học FPT — MLN122)

## 1. Chuyên đề cốt lõi: Chương 4 — Cạnh tranh và Độc quyền trong nền kinh tế thị trường

### A. Sự hình thành các tổ chức độc quyền trong kỷ nguyên kinh tế số
- Trong chủ nghĩa tư bản hiện đại, sự tích tụ và tập trung tư bản không chỉ diễn ra trong các ngành công nghiệp nặng truyền thống mà đặc biệt bùng nổ trong lĩnh vực **dữ liệu, thuật toán AI và hạ tầng năng lượng số**.
- Tập đoàn TRỤC đại diện cho hình thức **Độc quyền nền tảng (Platform Monopoly)**, nơi tập đoàn kiểm soát toàn bộ hệ điều hành, giao thức kết nối và cổng truy cập của người dân.

### B. Siêu ngạch độc quyền (Super-Monopoly Profit)
- Giá cả độc quyền gồm: \`Giá cả độc quyền = Chi phí sản xuất + Lợi nhuận độc quyền cao\`.
- Khi TRỤC bí mật tích hợp thuật toán Nếp Sáng, chi phí vận hành lưới điện giảm tới **38%**. Theo quy luật cạnh tranh tự do thông thường, giá bán điện cho người dân phải giảm tương ứng.
- Tuy nhiên, do nắm giữ vị thế độc quyền, TRỤC giữ nguyên 100% mức cước cố định đối với cư dân Vòm-9. Toàn bộ 38% chi phí cắt giảm được chuyển hóa trọn vẹn thành **Siêu lợi nhuận độc quyền** chảy vào túi tập đoàn.

### C. Bản chất Độc quyền Nhà nước
- Sự kết hợp giữa sức mạnh kinh tế của tập đoàn tư nhân TRỤC và quyền lực pháp lý của hạ tầng công (bản hợp đồng nhượng quyền năm 2004).
- Nhà nước đầu tư 100% nguồn vốn ngân sách xây dựng hệ thống điện, nhưng tập đoàn tư nhân lại được trao toàn quyền quyết định ai được phép hòa lưới, biến hạ tầng công thành công cụ ngăn chặn đối thủ cạnh tranh.

### D. Vai trò của sở hữu và giải phóng lực lượng sản xuất
- Dự án Nếp Sáng và ổ lưu "NHÀ MÌNH" khẳng định chân lý của chủ nghĩa Mác: Khi lực lượng sản xuất phát triển đến trình độ cao, mâu thuẫn với quan hệ sản xuất tư nhân tư bản chủ nghĩa trở nên gay gắt.
- Chỉ khi cộng đồng lao động đoàn kết, đòi lại quyền giám sát công cộng đối với hạ tầng thiết yếu, thì thành tựu khoa học kỹ thuật mới thực sự phục vụ hạnh phúc của nhân dân.
`;

fs.writeFileSync(path.join(baseDir, 'analysis.md'), analysisContent, 'utf8');

// 3. Read prompts from AI_COMIC_FACTORY_20_TRANG_PROMPTS.md and write individual prompt files
const promptRaw = fs.readFileSync(path.join(__dirname, 'docs', 'AI_COMIC_FACTORY_20_TRANG_PROMPTS.md'), 'utf8');
const promptBlocks = promptRaw.split(/### 📌 TRANG (\d+) — ([^\n]+)/);

for (let i = 1; i < promptBlocks.length; i += 3) {
  const pNum = parseInt(promptBlocks[i]);
  const pTitle = promptBlocks[i + 1].trim();
  const body = promptBlocks[i + 2];

  const numStr = pNum < 10 ? '0' + pNum : '' + pNum;
  const slug = pTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const promptMatch = body.match(/```text\n([\s\S]*?)```/);
  const promptText = promptMatch ? promptMatch[1].trim() : '';

  const letteringMatch = body.match(/- \*\*Bóng thoại \(Lettering\):\*\*([\s\S]*?)(?=\n---|\n###|$)/);
  const lettering = letteringMatch ? letteringMatch[1].trim() : '';

  const layoutMatch = body.match(/- \*\*Bố cục:\*\*([^\n]+)/);
  const layout = layoutMatch ? layoutMatch[1].trim() : 'standard';

  const fileContent = `---
page: ${pNum}
title: "${pTitle}"
layout: "${layout}"
aspect: "3:4"
style: "manga"
tone: "warm"
preset: "concept-story"
references:
  - ref_id: 01
    filename: "characters/characters.png"
    usage: "direct"
character_consistency:
  minh: "Vietnamese 22yo male, messy dark hair, thin wireframe glasses, dark grey tee #2c2c36, olive tech vest #4b5320"
  dom: "tiny floating glowing chibi wisp, amber core #ffe600, cyan aura #00f0ff, expressive anime eyes"
  mother: "52yo Vietnamese mother, modest low bun, faded floral blouse #8b5a5a, tired loving eyes"
---

# Trang ${pNum}: ${pTitle}

## 1. Bố cục & Nhịp dẫn truyện
* **Bố cục khung:** ${layout}
* **Tham chiếu nhân vật:** Bắt buộc áp dụng Model Sheet \`characters/characters.png\` (\`--cref\`, \`--cw 80\`).

---

## 2. Master Prompt (Midjourney V6 / Niji 6 / Flux.1)

\`\`\`text
${promptText}
\`\`\`

---

## 3. Lời Thoại & Bóng Thoại (Lettering Guide)

${lettering}
`;

  const fileName = `${numStr}-page-${slug}.md`;
  fs.writeFileSync(path.join(promptsDir, fileName), fileContent, 'utf8');
}

console.log('Successfully created all baoyu-comic project files in comic/giu-mot-dom-sang/');
