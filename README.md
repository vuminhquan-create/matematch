# MateMatch — Premium Dark Purple Prototype

**Slogan:** Connect Less, Connect Better.

Prototype frontend cập nhật theo các quyết định thiết kế đã chốt:
- Giao diện Premium Dark Black Purple, tối giản, tăng chiều sâu bề mặt và khoảng thở.
- Hiệu ứng vừa phải: chuyển động nền, reveal khi cuộn, hover card/nút, progress khi cuộn trang, animation điểm matching và chuyển động modal.
- Tôn trọng cài đặt `prefers-reduced-motion` để giảm chuyển động khi người dùng yêu cầu.
- Font Be Vietnam Pro cho nội dung, Plus Jakarta Sans cho tiêu đề.
- Logo MateMatch ở sidebar và breadcrumb có thể bấm để về trang chủ.
- Avatar thành viên dùng chữ **M** theo nhận diện MateMatch; không có chức năng upload ảnh cá nhân.
- Ngày sinh được thu thập trong onboarding và chỉ xuất hiện ở bảng quản trị Admin (demo). Không hiển thị trên hồ sơ công khai và không tham gia matching.
- Matching Rule-based theo trọng số mục tiêu trong PRD; dữ liệu chưa khai báo không bị tính là không phù hợp.

## Chạy local

Không cần cài package:

```bash
cd matematch-web
python -m http.server 4173
```

Mở http://localhost:4173.

## Lưu ý prototype

Đây vẫn là frontend prototype với dữ liệu mẫu và localStorage. Đăng ký/OTP, phân quyền Admin, bảo vệ ngày sinh, matching và các thao tác quản trị chưa kết nối backend thật. Quy tắc “chỉ Admin được xem ngày sinh” hiện được thể hiện ở giao diện demo; trước khi dùng dữ liệu thật cần enforce ở API/database, kiểm thử quyền truy cập và ghi audit log. Không dùng dữ liệu cá nhân thật trong bản demo.

## Cấu trúc

- `index.html` — entry point
- `styles.css` — hệ thống giao diện Dark Purple cơ sở
- `premium.css` — lớp giao diện Premium và hiệu ứng chuyển động
- `app.js` — màn hình và tương tác demo
- `premium.js` — bổ sung hiệu ứng, không thay đổi logic matching hoặc dữ liệu demo
- `assets/matematch-logo.png` — logo MateMatch
