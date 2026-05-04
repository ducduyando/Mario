# Mario self-hosted web game (1 level)

## Tài liệu trong `docs/`

- **SRS game (bài nộp / đặc tả thực tế):** [`docs/SRS_MarioWebGame.md`](docs/SRS_MarioWebGame.md)
- **Mẫu SRS Loan Process (cấu trúc tham chiếu IEEE):**
  - [`docs/SRS_LoanProcessSystem_Final.docx`](docs/SRS_LoanProcessSystem_Final.docx) — bản Word gốc
  - [`docs/SRS_LoanProcessSystem.md`](docs/SRS_LoanProcessSystem.md) — bản Markdown trích từ `.docx`
- **Test case → Google Sheets:** [`docs/test_cases_google_sheet.csv`](docs/test_cases_google_sheet.csv) — Google Sheets → **File → Import → Upload**

---

Game platformer Mario-like 1 man choi, chay local tren web.
Ban nay tap trung vao trai nghiem giong game platform co dien (quai vat, block hoi, power-up, nhac nen loop, timer).

## Chay du an

```bash
npm install
npm run dev
```

Sau do mo URL do Vite cung cap (thuong la `http://localhost:5173`).

## Build va self-host production

```bash
npm run build
npm run preview
```

Ban co the deploy thu muc `dist/` len bat ky static host nao (Nginx, Caddy, GitHub Pages, Netlify, Vercel static...).

## Dieu khien

- Trai/phai: `A/D` hoac `Arrow Left/Right`
- Nhay: `W`, `Space`, hoac `Arrow Up`
- Choi lai: `R` (khi win/thua)

## Sprite va am thanh

- Sprite nhan vat/enemy/coin/goal luu local trong `public/assets/images`.
- Am thanh thu coin va win luu local trong `public/assets/audio`.
- Hieu ung jump/hit/lose duoc tao bang WebAudio API (khong can file am thanh ngoai).
- Nhac nen loop duoc tao bang WebAudio API, tu dong phat khi bat dau choi.
- Game van self-host 100%: clone repo, `npm install`, `npm run dev` la chay.

## Bo ca kiem thu

### Test tu dong (Vitest)

```bash
npm test
```

Da bao gom cac ca:
- `clamp` gioi han gia tri dung mien min/max.
- Kiem tra va cham hinh chu nhat (`overlaps`).
- Kiem tra ha canh len platform (`resolvePlatformCollision`).
- Nhat coin thi tang diem.
- Cham enemy thi tru mang va respawn.
- Cham goal thi win game.
- Mat het mang thi game over.

### Test thu cong de xac nhan gameplay

1. **Di chuyen va nhay**: nhan trai/phai + nhay, Mario phan hoi dung input.
2. **Roi khoi ban do**: roi xuong duoi man hinh, bi tru 1 mang va tro ve vi tri dau.
3. **An coin**: di qua coin vang, coin bien mat va score +10.
4. **Va enemy**: cham enemy do, tru mang va respawn.
5. **Can dich**: cham cot dich mau xanh, hien `You Win`.
6. **Game over**: co tinh mat het 3 mang, hien `Game Over`.
