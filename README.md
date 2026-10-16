# VÒM-9: TRUYỆN TRANH AR TƯƠNG TÁC 🦾📖
> **Đồ án Sản phẩm Sáng tạo - Học phần Kinh tế chính trị Mác - Lênin (MLN122)**  
> **Hình thức:** Truyện tranh in ấn vật lý 6 trang kết hợp Ứng dụng AR Di động Đa nền tảng (PWA Fullscreen)  
> **Chủ đề lý luận:** Biểu hiện mới của Độc quyền và Độc quyền Nhà nước trong kỷ nguyên số (Chương 4)

---

## 🚀 1. HƯỚNG DẪN TEST NHANH TRONG 1 PHÚT

### Cách 1: Test trên máy tính (Laptop có Webcam)
1. Trong thư mục dự án, khởi chạy web server cục bộ:
   ```bash
   npx serve .
   ```
2. Mở trình duyệt truy cập: `http://localhost:3000` (hoặc link do Vercel cấp).
3. Bấm **"KHỞI ĐỘNG HỆ THỐNG AR"** và cấp quyền Camera.
4. Hướng camera vào các trang truyện hoặc dùng chế độ **"XEM THỬ 3D" (Live Preview)** để xem mô hình hologram tương tác ngay lập tức!

### Cách 2: Test bằng điện thoại (Khuyên dùng khi đi thi / demo)
1. Mở trang web trên Safari (iOS) hoặc Chrome (Android).
2. Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)** để chạy toàn màn hình không có thanh URL.
3. Hướng camera điện thoại vào các trang truyện tranh in hoặc hiển thị trên màn hình.

---

## 📚 2. BẢN CHẤT LÝ LUẬN KINH TẾ CHÍNH TRỊ (MLN122 - CHƯƠNG 4)

Sản phẩm truyền tải trực quan các luận điểm trọng tâm qua câu chuyện tại **Thành phố Vòm-9**:
1. **Biểu hiện mới của Tổ chức Độc quyền trong Kỷ nguyên Số:**
   * Chi phối hệ sinh thái thuật toán và nền tảng thiết yếu.
   * Cưỡng ép cập nhật để thôn tính dữ liệu và ý tưởng của các nhà sáng tạo nhỏ (Minh & AI).
2. **Quan hệ giữa Độc quyền và Cạnh tranh:**
   * Độc quyền không triệt tiêu cạnh tranh mà làm cho cạnh tranh gay gắt hơn; tập đoàn dùng rào cản kết nối hạ tầng để chặn đứng giải pháp tiết kiệm chi phí của Minh.
3. **Bản chất của Độc quyền Nhà nước trong Khai thác Hạ tầng:**
   * Mạng lưới năng lượng vốn xây bằng ngân sách công được giao cho tập đoàn tư nhân khai thác độc quyền.
   * Nhờ công nghệ mới, chi phí vận hành giảm nhưng tập đoàn giữ nguyên mức thu cố định của cư dân để chiếm trọn phần thặng dư siêu ngạch.
4. **Kiểm soát Quyền lực & Trách nhiệm Giải trình:**
   * Minh, AI đồng hành và cộng đồng cư dân tập hợp bằng chứng nhật ký hệ thống để kiến nghị cơ quan quản lý mở cuộc xem xét công khai.

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
