# Đặc tả yêu cầu phần mềm (SRS)

## Mario Mini Platformer — Web game tự host (1 màn)

| Trường | Giá trị |
| :--- | :--- |
| Phiên bản tài liệu | 1.0 |
| Chuẩn tham chiếu | IEEE 830-1998 (cấu trúc tài liệu) |
| Ngày | Tháng 5 năm 2026 |
| Trạng thái | Draft |
| Loại dự án | Ứng dụng web / Game HTML5 Canvas |
| Repository | [github.com/ducduyando/Mario](https://github.com/ducduyando/Mario) |
| Stack | Vite 5, JavaScript (ES modules), Canvas 2D, Web Audio API, Vitest |

*Tài liệu này thay thế bản SRS mẫu “Loan Process System”; mọi yêu cầu dưới đây bám sát mã nguồn và README của dự án game.*

---

## Lịch sử sửa đổi

| Phiên bản | Ngày | Tác giả | Mô tả |
| :--- | :--- | :--- | :--- |
| 1.0 | 05/2026 | Nhóm phát triển | SRS ban đầu cho game Mario web 1 màn |

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu SRS mô tả các yêu cầu chức năng và phi chức năng của **Mario Mini Platformer** — game platformer 2D một màn, chạy trên trình duyệt, build bằng Vite, không cần backend. Tài liệu dùng cho đồ án / báo cáo môn CNPM và làm cơ sở kiểm thử (thủ công + tự động).

### 1.2 Phạm vi dự án

**Trong phạm vi:**

- Một màn chơi cố định (level dữ liệu trong `src/game/level.js`).
- Điều khiển nhân vật: trái/phải, nhảy; camera theo người chơi.
- Va chạm với nền tảng, ống, block; thu coin; enemy (va chạm bên / giẫm trên); nấm power-up; cột đích.
- Điểm, mạng (3), bộ đếm thời gian (mặc định 120 giây), trạng thái thắng/thua và chơi lại bằng phím `R`.
- Âm thanh: file WAV (coin, win); hiệu ứng jump/stomp/… bằng Web Audio; nhạc nền loop tổng hợp.
- Triển khai tĩnh: `npm run build` → thư mục `dist/` có thể đặt lên bất kỳ host tĩnh nào.

**Ngoài phạm vi (phiên bản hiện tại):**

- Nhiều màn / map editor / lưu tiến trình server.
- Đăng nhập người chơi, thanh toán, bảng xếp hạng online.
- Ứng dụng di động native (chỉ web).

### 1.3 Thuật ngữ

| Thuật ngữ | Ý nghĩa |
| :--- | :--- |
| SRS | Software Requirements Specification — đặc tả yêu cầu phần mềm |
| FR | Functional Requirement — yêu cầu chức năng |
| NFR | Non-Functional Requirement — yêu cầu phi chức năng |
| HUD | Phần text hiển thị điểm, mạng, thời gian dưới canvas |
| Canvas | Vùng vẽ 2D HTML5 (`#game`, 960×540 px) |

### 1.4 Tài liệu tham chiếu

- IEEE Std 830-1998 — khuyến nghị cấu trúc SRS.
- README dự án: `README.md`.
- Mã nguồn chính: `src/game/Game.js`, `src/main.js`, `src/game/physics.js`, `tests/`.

### 1.5 Tổ chức tài liệu

Mục 2 mô tả tổng quan hệ thống; mục 3 là các use case / FR; mục 4 NFR; mục 5 giao diện; mục 6 tóm tắt use case; mục 7 phạm vi và hạn chế.

---

## 2. Mô tả tổng quan

### 2.1 Bối cảnh sản phẩm

Game là ứng dụng **độc lập phía client**: không gọi API ngoài khi chơi; asset âm thanh/hình nằm trong `public/assets/`. Người dùng mở URL (dev: Vite; production: file hoặc CDN sau build).

### 2.2 Chức năng chính (tóm tắt)

| Mã | Chức năng | Mô tả ngắn |
| :--- | :--- | :--- |
| FR-001 | Điều khiển nhân vật | Di chuyển trái/phải, nhảy; giới hạn trong thế giới game. |
| FR-002 | Vật lý & va chạm | Trọng lực, va chạm platform/ống/block, rơi khỏi map trừ mạng. |
| FR-003 | Tương tác thực thể | Coin, enemy (giẫm / va chạm), power-up nấm, đích thắng. |
| FR-004 | Luật thắng / thua | Hết giờ hoặc hết mạng → thua; chạm đích → thắng; phím `R` restart khi kết thúc. |
| FR-005 | Phản hồi âm thanh & HUD | Cập nhật điểm, mạng, thời gian; phát SFX/BGM phù hợp sự kiện. |

### 2.3 Người dùng

| Vai trò | Mô tả |
| :--- | :--- |
| Người chơi | Người mở trang web, đọc hướng dẫn phím, chơi một màn và có thể chơi lại. |

### 2.4 Môi trường vận hành

- Trình duyệt: Chrome, Firefox, Edge (phiên bản gần đây).
- Máy tính để bàn / laptop; viewport trang có thể responsive nhưng **vùng game cố định 960×540** pixel.
- Cần kết nối mạng khi dev (Vite); bản build tĩnh có thể offline sau khi tải.

### 2.5 Ràng buộc

- Không có máy chủ game logic trong phạm vi phiên bản này.
- Sprite/âm thanh định dạng file cục bộ (PNG, WAV) như trong repo.

---

## 3. Yêu cầu chức năng chi tiết

### 3.1 FR-001 — Điều khiển nhân vật

| Mục | Nội dung |
| :--- | :--- |
| **ID** | FR-001 |
| **Tác nhân** | Người chơi |
| **Kích hoạt** | Giữ / nhấn phím điều hướng hoặc nhảy. |
| **Điều kiện trước** | Trang đã tải; game chưa ở trạng thái `finished` hoặc đang chờ restart. |
| **Luồng chính** | 1) Người chơi dùng `A/D` hoặc mũi tên trái/phải để di chuyển. 2) Dùng `W`, Space hoặc mũi tên lên để nhảy khi đứng trên mặt đất. 3) Hệ thống cập nhật vận tốc và vị trí nhân vật theo từng frame. |
| **Luồng thay thế** | Khi game đã kết thúc (`finished`), input điều khiển không còn tác dụng (trừ `R` theo FR-004). |
| **Điều kiện sau** | Nhân vật phản hồi mượt, không xuyên qua giới hạn ngang của thế giới (`WORLD.width`). |

### 3.2 FR-002 — Vật lý & va chạm môi trường

| Mục | Nội dung |
| :--- | :--- |
| **ID** | FR-002 |
| **Tác nhân** | Hệ thống (engine) |
| **Kích hoạt** | Mỗi khung hình `update` với `dt`. |
| **Điều kiện trước** | Level đã khởi tạo (platforms, pipes, blocks). |
| **Luồng chính** | 1) Áp dụng trọng lực và giới hạn tốc độ rơi. 2) Giải quyết va chạm theo trục X/Y với platform/ống/block. 3) Nếu rơi dưới đáy màn (`player.y` vượt ngưỡng), gọi mất mạng / respawn theo luật game. |
| **Ngoại lệ** | — |
| **Điều kiện sau** | Nhân vật đứng được trên nền; không “rơi xuyên” platform khi va chạm hợp lệ. |

### 3.3 FR-003 — Tương tác coin, enemy, power-up, đích

| Mục | Nội dung |
| :--- | :--- |
| **ID** | FR-003 |
| **Tác nhân** | Người chơi |
| **Kích hoạt** | Nhân vật chồng lấn (overlap) với thực thể. |
| **Điều kiện trước** | Thực thể còn hiệu lực (coin chưa thu, enemy còn sống, …). |
| **Luồng chính** | 1) **Coin:** overlap → coin `collected`, điểm +10. 2) **Enemy:** va chạm từ trên (stomp) → enemy chết, điểm +100; va chạm ngang/dưới → trừ mạng, invulnerable ngắn, respawn vị trí an toàn. 3) **Power-up (nấm):** overlap → `player.form` = `big`, chiều cao cập nhật theo hằng số. 4) **Đích:** overlap với goal → `finished`, `won`. |
| **Luồng thay thế** | Trong thời gian bất tử ngắn, có thể nhấp nháy hiển thị (theo `invulnerableFor`). |
| **Điều kiện sau** | Điểm và trạng thái thực thể đồng bộ với HUD / logic test. |

### 3.4 FR-004 — Kết thúc màn: thắng, thua, chơi lại

| Mục | Nội dung |
| :--- | :--- |
| **ID** | FR-004 |
| **Tác nhân** | Người chơi / hệ thống (timer) |
| **Kích hoạt** | Chạm đích; `timeLeft` ≤ 0; `lives` = 0 sau mất mạng. |
| **Điều kiện trước** | Game đang chạy. |
| **Luồng chính** | 1) Thắng: `finished = true`, `won = true`, HUD báo thắng. 2) Thua (hết giờ hoặc hết mạng): `finished = true`, `won = false`. 3) Khi `finished`, nhấn `R` → `reset()` toàn level. |
| **Điều kiện sau** | Trạng thái game nhất quán cho render và âm thanh (sự kiện `win` / `lose`). |

### 3.5 FR-005 — Âm thanh, hình ảnh, HUD

| Mục | Nội dung |
| :--- | :--- |
| **ID** | FR-005 |
| **Tác nhân** | Người chơi |
| **Kích hoạt** | Tương tác gameplay và tải trang (tương tác âm thanh sau gesture đầu tiên theo chính sách trình duyệt). |
| **Luồng chính** | 1) Vẽ cảnh, nhân vật, enemy, coin, goal trên canvas. 2) HUD hiển thị Score, Lives, Time, dạng nhân vật (small/big), và dòng trạng thái thắng/thua. 3) Phát hiệu ứng theo `game.events`; BGM loop sau lần input đầu. |
| **Điều kiện sau** | Người chơi nhận phản hồi rõ ràng từ màn hình và âm thanh. |

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng

- Vòng lặp game dùng `requestAnimationFrame`; bước thời gian `dt` clamp để tránh bùng nổ vật lý khi tab background.
- Tải trang dev/build: mục tiêu thực tế là tải nhẹ (asset cục bộ nhỏ).

### 4.2 Khả năng sử dụng & giao diện

- Trang có tiêu đề và hướng dẫn phím bằng **tiếng Anh** (theo README).
- HUD đọc được, cập nhật theo thời gian thực.

### 4.3 Khả năng bảo trì

- Mã tách module: `Game.js`, `level.js`, `physics.js`, `constants.js`, `main.js`.
- Kiểm thử tự động (`npm test`) cho physics và luật game cốt lõi.

### 4.4 Khả năng triển khai

- Build Vite tạo bundle có thể host tĩnh; không bắt buộc HTTPS cho chạy local (production nên HTTPS theo thông lệ web).

---

## 5. Giao diện bên ngoài

### 5.1 Giao diện người dùng (web)

- **Trang:** tiêu đề “Mario Mini Platformer”, đoạn mô tả phím, canvas 960×540, `#hud` text.
- **Điều khiển bàn phím:** như README và mục 3.1.

### 5.2 Phần mềm / file

| Thành phần | Mô tả |
| :--- | :--- |
| `public/assets/images/*.png` | Sprite player, enemy, coin, goal (nếu dùng ảnh). |
| `public/assets/audio/coin.wav`, `win.wav` | SFX file. |
| `src/main.js` | Vòng lặp render, input, tích hợp `Game` + âm thanh. |

---

## 6. Bảng tóm tắt use case

| ID | Tên | Mô tả ngắn |
| :--- | :--- | :--- |
| FR-001 | Điều khiển nhân vật | Di chuyển, nhảy, giới hạn map. |
| FR-002 | Vật lý & va chạm | Trọng lực, platform, rơi khỏi map. |
| FR-003 | Thực thể & điểm | Coin, enemy, nấm, đích. |
| FR-004 | Thắng / thua / restart | Timer, mạng, `R`. |
| FR-005 | Âm thanh & HUD | Vẽ, SFX, BGM, thông tin trạng thái. |

---

## 7. Phạm vi, ràng buộc và hạn chế

### 7.1 Đã bao gồm

- Một level cố định; đầy đủ luật nêu trong mục 3.
- Unit test (Vitest) cho `clamp`, `overlaps`, `resolvePlatformCollision`, và các luật `Game` chính.

### 7.2 Chưa bao gồm

- Nhiều người chơi; lưu điểm server; AI enemy nâng cao; mobile touch tối ưu (chỉ bàn phím được mô tả đầy đủ).

### 7.3 Hạn chế

- Cân bằng độ khó và thời gian màn phụ thuộc dữ liệu level cứng; không có công cụ chỉnh sửa level cho người chơi cuối.

---

## Phụ lục A — Bảng ánh xạ kiểm thử tự động

| File test | Nội dung kiểm chứng |
| :--- | :--- |
| `tests/physics.test.js` | `clamp`, `overlaps`, `resolvePlatformCollision` |
| `tests/game.test.js` | Thu coin (+10), va enemy / stomp (+100), đích thắng, hết mạng thua, nấm → `big` |

---

*Tài liệu kết thúc.*
