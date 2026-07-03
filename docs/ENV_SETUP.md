# Environment Setup

Hướng dẫn tạo file `.env` local. **Không commit** `.env` — chỉ commit `.env.example`.

> Chạy lệnh `Copy-Item` từ **thư mục gốc repo** (`CaffeApp/`), hoặc dùng `.env.example` → `.env` khi đang ở trong `apps/api` / `apps/mobile`.

---

## 1. API (`apps/api/.env`)

### Tạo file

**Windows (PowerShell):**

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

**macOS / Linux:**

```bash
cp apps/api/.env.example apps/api/.env
```

### Biến bắt buộc

| Biến           | Mô tả                                    | Giá trị dev mẫu                                                        |
| -------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string             | `postgresql://postgres:postgres@localhost:5432/caffeapp?schema=public` |
| `JWT_SECRET`   | Secret ký JWT — **đổi trước production** | `dev-secret-change-me`                                                 |

### Biến tùy chọn (có default trong code)

| Biến                     | Default                | Ghi chú                                               |
| ------------------------ | ---------------------- | ----------------------------------------------------- |
| `PORT`                   | `3000`                 | API listen port                                       |
| `NODE_ENV`               | `development`          |                                                       |
| `JWT_EXPIRES_IN`         | `15m`                  | Access token TTL                                      |
| `JWT_REFRESH_EXPIRES_IN` | `7d`                   | Refresh token TTL                                     |
| `CORS_ORIGINS`           | localhost Expo origins | Comma-separated                                       |
| `SMTP_HOST`              | —                      | SMTP host gửi mã đổi mật khẩu, ví dụ `smtp.gmail.com` |
| `SMTP_PORT`              | `587`                  | SMTP port                                             |
| `SMTP_SECURE`            | `false`                | `true` nếu dùng port 465                              |
| `SMTP_USER`              | —                      | Gmail/email gửi mã                                    |
| `SMTP_PASS`              | —                      | App Password/SMTP password                            |
| `SMTP_FROM`              | `SMTP_USER`            | From address                                          |

### Ví dụ `apps/api/.env` hoàn chỉnh

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/caffeapp?schema=public
PORT=3000
NODE_ENV=development
JWT_SECRET=dev-secret-change-me
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,http://10.0.2.2:8081
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM=your-gmail@gmail.com
```

> Nếu SMTP chưa cấu hình ở local/dev, API sẽ log mã đổi mật khẩu ra console để dev không bị kẹt. Production phải cấu hình SMTP thật.

---

## 2. Mobile (`apps/mobile/.env`)

### Tạo file

**Windows (PowerShell):**

```powershell
Copy-Item apps\mobile\.env.example apps\mobile\.env
```

**macOS / Linux:**

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

> Chỉ biến `EXPO_PUBLIC_*` được bundle vào app — không đặt secret ở đây.

### Biến

| Biến                  | Mô tả               | Giá trị theo môi trường |
| --------------------- | ------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL` | Base URL NestJS API | Xem bảng dưới           |
| `EXPO_PUBLIC_APP_ENV` | Label môi trường    | `development`           |

> **Android / JDK:** Expo SDK 54 — xem [ANDROID_JDK.md](ANDROID_JDK.md).

### `EXPO_PUBLIC_API_URL` theo thiết bị

| Môi trường                         | URL                        |
| ---------------------------------- | -------------------------- |
| iOS Simulator                      | `http://localhost:3000`    |
| Android Emulator                   | `http://10.0.2.2:3000`     |
| Expo Go (thiết bị thật, cùng WiFi) | `http://<IP-máy-dev>:3000` |
| Expo tunnel                        | URL API public hoặc tunnel |

### Ví dụ `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
EXPO_PUBLIC_APP_ENV=development
```

Sau khi sửa `.env`, **restart Expo** (`npm run mobile`).

---

## 3. Android SDK (`ANDROID_HOME` + `local.properties`)

> **Không commit** `apps/mobile/android/local.properties` — file này theo từng máy, đã gitignore cùng thư mục `android/`.

### Biến môi trường (cài trên máy)

| Biến           | Mô tả                        | Giá trị mẫu (Windows)                       |
| -------------- | ---------------------------- | ------------------------------------------- |
| `ANDROID_HOME` | Thư mục Android SDK          | `C:\Users\<user>\AppData\Local\Android\Sdk` |
| `Path` (thêm)  | Công cụ adb / platform-tools | `%ANDROID_HOME%\platform-tools`             |

**Windows — Environment Variables (User):**

1. `ANDROID_HOME` = `C:\Users\<user>\AppData\Local\Android\Sdk`
2. Thêm `%ANDROID_HOME%\platform-tools` vào `Path`
3. Đóng và mở lại terminal

**Kiểm tra:**

```powershell
echo $env:ANDROID_HOME
where.exe adb
adb version
```

> **Lưu ý:** Không đặt `adb.exe` trong `C:\Windows\`. Chỉ dùng bản từ Android SDK (`platform-tools`).

### `local.properties` (sau `expo prebuild`)

Gradle cần biết SDK location. Tạo file **local** (không commit):

**Windows** — `apps/mobile/android/local.properties`:

```properties
sdk.dir=C\:\\Users\\<user>\\AppData\\Local\\Android\\Sdk
```

**macOS / Linux:**

```properties
sdk.dir=/Users/<user>/Library/Android/sdk
```

Thay `<user>` bằng username máy bạn. Android Studio thường tự tạo file này khi mở project native lần đầu.

**Khi nào cần:** `npm run mobile:android` (`expo run:android`) báo `SDK location not found`.

**Không cần** khi chỉ chạy Expo Go: `npm run mobile:android:go`.

Chi tiết JDK + Gradle: [ANDROID_JDK.md](ANDROID_JDK.md).

---

## 4. Kiểm tra

```bash
# API — phải start không lỗi env validation
npm run api

# Health check (terminal khác)
curl http://localhost:3000/api/v1/health
```

---

## 5. Troubleshooting

| Lỗi                                 | Nguyên nhân                                  | Cách xử lý                                             |
| ----------------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `Invalid environment configuration` | Thiếu `DATABASE_URL` hoặc `JWT_SECRET`       | Kiểm tra `apps/api/.env`                               |
| Mobile không gọi được API           | Sai `EXPO_PUBLIC_API_URL`                    | Dùng `10.0.2.2` cho Android emulator                   |
| `Can't reach database`              | PostgreSQL chưa chạy                         | Xem [infra/README.md](../infra/README.md)              |
| Expo không đọc env mới              | Cache                                        | Stop Expo, chạy lại `npm run mobile`                   |
| `SDK location not found`            | Thiếu `local.properties` hoặc `ANDROID_HOME` | Xem mục 3 — tạo `local.properties`, set `ANDROID_HOME` |
| `adb` not found / lỗi emulator      | PATH sai hoặc adb cũ trong `C:\Windows`      | Xóa adb cũ; thêm `platform-tools` vào PATH             |

---

## 6. Liên quan

- [ANDROID_JDK.md](ANDROID_JDK.md) — JDK 17, `gradle.properties`, script helper

- [infra/README.md](../infra/README.md) — PostgreSQL Docker
- [database/README.md](../database/README.md) — Prisma migrate/seed
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Dev workflow
