# 🌿 Tuổi Trẻ Duy Tân – Website Di Sản & Môi Trường Xanh

Website học sinh trường THPT Duy Tân, Quảng Nam – nơi chia sẻ bài viết về di sản văn hóa và bảo vệ môi trường.

---

## 📁 Cấu trúc thư mục

```
duitan-website/
├── index.html          ← Trang chính (mở file này để chạy)
├── css/
│   └── style.css       ← Toàn bộ giao diện
├── js/
│   ├── db.js           ← Cơ sở dữ liệu (localStorage)
│   ├── ui.js           ← Các component UI tái sử dụng
│   └── app.js          ← Logic ứng dụng chính
└── README.md
```

---

## 🚀 Cách sử dụng

### Chạy trực tiếp (không cần server)
1. Giải nén file ZIP
2. Mở file `index.html` bằng trình duyệt (Chrome, Firefox, Edge...)
3. Website chạy ngay – không cần cài đặt gì thêm!

### Chạy với Live Server (khuyến nghị khi phát triển)
```bash
# Nếu có VS Code + extension Live Server:
# Chuột phải vào index.html → "Open with Live Server"

# Hoặc dùng Python:
python -m http.server 8080
# Truy cập: http://localhost:8080
```

---

## ✨ Tính năng đầy đủ

### 👤 Hệ thống tài khoản
- **Đăng ký** tài khoản mới với tên, lớp, email, mật khẩu
- **Đăng nhập / Đăng xuất**
- **Trang cá nhân** – xem bài viết đã đăng, điểm xanh, chỉnh sửa hồ sơ
- Dữ liệu lưu trong **localStorage** – giữ nguyên sau khi tắt trình duyệt

### 📝 Đăng & quản lý bài viết
- Đăng bài viết với **tiêu đề, nội dung, chuyên mục, tags**
- **Upload ảnh** minh họa (tối đa 3 ảnh, lưu dưới dạng base64)
- Xem chi tiết bài viết

### ❤️ Tương tác xã hội
- **Like / Unlike** bài viết
- **Bình luận** trên bài viết
- Đếm lượt xem tự động

### 🏆 Hệ thống điểm & xếp hạng
- Đăng bài: +10 điểm
- Nhận like: +1 điểm
- Bình luận: +2 điểm
- **Bảng xếp hạng** Đại sứ Xanh

### 🔍 Tìm kiếm
- Tìm kiếm bài viết theo **tiêu đề, nội dung, tags**

### 📂 Lọc theo chuyên mục
- Di sản quê em 🏛️
- Môi trường xanh 🌿
- Góc kiến thức 💡
- Hoạt động 🎯
- Khác 📝

---

## 🎨 Demo tài khoản có sẵn

| Email | Mật khẩu | Tên |
|-------|----------|-----|
| minhanh@hs.vn | 123456 | Nguyễn Minh Anh (10A2) |
| vankhoa@hs.vn | 123456 | Trần Văn Khoa (11B1) |
| thhuong@hs.vn | 123456 | Lê Thị Hương (12C3) |

---

## 🛠️ Công nghệ sử dụng

- **HTML5 / CSS3 / JavaScript** thuần – không framework, không thư viện ngoài
- **localStorage** – lưu trữ dữ liệu phía client
- **Google Fonts** – Be Vietnam Pro + Montserrat
- **SPA Router** – điều hướng không tải lại trang
- **FileReader API** – upload và preview ảnh

---

## 📌 Lưu ý

- Dữ liệu lưu trong **localStorage của trình duyệt** – mỗi trình duyệt/máy tính sẽ có dữ liệu riêng
- Để **reset dữ liệu**: mở Console (F12) → gõ `localStorage.clear()` → tải lại trang
- Để **triển khai thật**: cần backend (Node.js/PHP/Firebase...) + database thật

---

## 🌿 Thông tin trường

**Trường THPT Duy Tân** – Duy Xuyên, Quảng Nam  
📧 tuoitreduitan@edu.vn  

*"Tuổi trẻ Duy Tân – Chung tay vì một Việt Nam xanh"* 🌱
# Tu-i-tr-Duy-T-n-chung-tay-gi-g-n-di-s-n-b-o-v-m-i-tr-ng
