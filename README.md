# CYBER-MARX: AR COMIC EXPERIENCE 🦾📖
> **Đồ án Sản phẩm Sáng tạo - Học phần Kinh tế chính trị Mác - Lênin (MLN122)**  
> **Hình thức:** Truyện tranh in ấn vật lý kết hợp Ứng dụng AR Di động Đa nền tảng (PWA Fullscreen / Standalone Non-Web)  
> **Chủ đề lý luận:** Biểu hiện mới của Chủ nghĩa tư bản độc quyền và Độc quyền nhà nước trong kỷ nguyên số (Chương 4)

---

## 🚀 1. HƯỚNG DẪN TEST NHANH TRONG 1 PHÚT

### Cách 1: Test trên máy tính (Laptop có Webcam)
1. Trong thư mục dự án, khởi chạy web server cục bộ:
   ```bash
   npx serve .
   ```
2. Mở trình duyệt truy cập: `http://localhost:3000` (hoặc link https do Vercel cấp).
3. Bấm **"KHỞI ĐỘNG HỆ THỐNG AR"** và cấp quyền Camera.
4. Mở ảnh `assets/cyber_marx.jpg` trên điện thoại của bạn, sau đó đưa điện thoại giơ trước webcam laptop:
   * **Hiệu ứng kích hoạt:** Khung Hologram neon xoay quanh bức tranh, công thức $W = c + v + m$ phát sáng, tỷ lệ thặng dư $85\%$ nổi lên và âm thanh Cyberpunk Synthwave vang lên!

### Cách 2: Test bằng điện thoại (Khuyên dùng khi đi thi / demo)
1. Đẩy repo lên GitHub và kết nối với **[Vercel](https://vercel.com)** để có link HTTPS miễn phí (ví dụ: `https://ass-mln122.vercel.app`).
2. Mở link trên điện thoại:
   * **Trên iPhone (iOS):** Mở bằng **Safari** $\rightarrow$ Bấm nút **Chia sẻ** $\rightarrow$ Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**. Một icon App tên **CyberMarx** sẽ xuất hiện ngoài màn hình. Bấm mở từ icon này để chạy **toàn màn hình, không có thanh địa chỉ URL**!
   * **Trên Android:** Mở bằng **Chrome** $\rightarrow$ Chọn **Cài đặt ứng dụng** $\rightarrow$ Chạy full-screen như app native.
3. Hướng camera điện thoại vào bức tranh **Cyber-Marx** (mở sẵn trên màn hình máy tính hoặc in ra giấy A4/A5).

---

## 🎨 2. TRANH MẪU ĐỂ TEST (TARGET MARKER)

* Tệp ảnh gốc: [`assets/cyber_marx.jpg`](assets/cyber_marx.jpg)
* **Ý nghĩa đồ họa:** Karl Marx trong phong cách Cyberpunk với kính neon, áo khoác vi mạch, cầm cuốn sách phát sáng *"DAS KAPITAL 2.0"*, đối đầu với biển hiệu độc quyền *"OMNI-CORP"* bị glitch.
* Tệp nhận diện MindAR đã được biên dịch sẵn: [`assets/targets.mind`](assets/targets.mind).

---

## 🛠️ 3. CÔNG CỤ DÀNH CHO CẢ NHÓM (KHI THÊM TRANH MỚI)

Khi các thành viên trong nhóm vẽ thêm các trang truyện mới (Trang 1, Trang 2, Trang 3...):

### Cách 1: Dùng trình biên dịch Web trực quan (Không cần gõ code)
Mở file [`compiler.html`](compiler.html) trực tiếp trên trình duyệt Zen/Chrome/Safari:
1. Kéo thả các trang truyện tranh (PNG/JPG) vào khung.
2. Bấm **"BẮT ĐẦU BIÊN DỊCH"**.
3. Sau vài giây, file `targets.mind` mới sẽ tự động được tải về máy của bạn! Chỉ cần copy file này đè vào thư mục `assets/` là xong!

### Cách 2: Dùng dòng lệnh Node.js CLI (Chạy offline cực nhanh)
```bash
node compile-cli.mjs assets/cyber_marx.jpg assets/targets.mind
```

---

## 📚 4. BẢN CHẤT LÝ LUẬN KINH TẾ CHÍNH TRỊ (MLN122)

Sản phẩm truyền tải các luận điểm cốt lõi của **Chương 4: Cạnh tranh và Độc quyền trong nền kinh tế thị trường**:
1. **Công thức \(W = c + v + m\):**
   * \(c\) (Tư bản bất biến): Cơ sở hạ tầng server, chip bán dẫn, máy chủ AI, bản quyền phần mềm độc quyền.
   * \(v\) (Tư bản khả biến): Chi phí trả cho lực lượng lao động công nghệ (lập trình viên, tài xế công nghệ, shipper).
   * \(m\) (Giá trị thặng dư): Dữ liệu lớn (Big Data) và hành vi người dùng bị các tập đoàn độc quyền chiếm đoạt miễn phí.
2. **Bản chất của Siêu tập đoàn độc quyền (Omni-Corp):**
   * Tận dụng "Hiệu ứng mạng lưới" (Network Effect) để chiếm lĩnh hạ tầng số.
   * Tiêu diệt hoặc thâu tóm các công ty khởi nghiệp sáng tạo (như dự án mã nguồn mở Open-Grid của nhân vật Kael).
   * Cấu kết với bộ máy nhà nước thông qua hợp đồng đối tác công - tư (PPP) và luật bản quyền khắt khe để bảo hộ siêu ngạch lợi nhuận độc quyền.

---

## 📁 5. CẤU TRÚC THƯ MỤC

```text
ass-mln122/
├── index.html            # Ứng dụng AR tương tác chính (MindAR + A-Frame + Cyberpunk HUD)
├── compiler.html         # Công cụ biên dịch ảnh truyện thành targets.mind trên trình duyệt
├── compile-cli.mjs       # Script Node.js biên dịch targets.mind offline không cần Canvas
├── manifest.json         # Cấu hình PWA để cài đặt toàn màn hình trên iPhone & Android
├── sw.js                 # Service Worker hỗ trợ chạy mượt và cache dữ liệu
├── icon.png              # Icon ứng dụng kích thước 512x512
└── assets/
    ├── cyber_marx.jpg    # Tranh truyện mẫu Karl Marx phong cách Cyberpunk
    └── targets.mind      # File dữ liệu điểm đặc trưng đã biên dịch chuẩn xác
```
