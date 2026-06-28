# Android / JDK — Expo SDK 54

CaffeApp mobile dùng **Expo SDK 54** (tương thích **Expo Go** trên App Store) → cần **JDK 17** khi build Android native.

## Yêu cầu

| Thành phần | Phiên bản |
|------------|-----------|
| Expo SDK | **54** |
| JDK (Android build) | **17** |
| Node.js | **≥ 20.19** |
| Expo Go (iPhone) | Supported SDK **54** ✓ |

## Cài JDK 17 (Windows)

```powershell
winget install Microsoft.OpenJDK.17
```

Đường dẫn mặc định:

```
C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot
```

## Dùng JDK 17 trong terminal hiện tại

Từ thư mục gốc repo:

```powershell
. .\scripts\set-java-17.ps1
java -version
# → openjdk version "17.0.19"
```

## Build Android native (sau `expo prebuild`)

Gradle trong `apps/mobile/android/gradle.properties` đã cấu hình:

```properties
org.gradle.java.home=C\:\\Program Files\\Microsoft\\jdk-17.0.19.10-hotspot
```

Nếu chạy lại `npx expo prebuild`, thêm lại dòng trên vào `gradle.properties` (thư mục `android/` không commit — xem `.gitignore`):

```powershell
.\scripts\patch-android-jdk.ps1
```

```powershell
cd apps\mobile
npx expo prebuild --platform android
npm run android
```

## Chạy trên Expo Go (iPhone)

Dự án dùng **SDK 54** — khớp Expo Go trên App Store (Supported SDK 54).

```powershell
npm run api              # terminal 1
npm run mobile:tunnel    # terminal 2 — quét QR trên iPhone
```

Đặt `EXPO_PUBLIC_API_URL` trong `apps/mobile/.env` = IP máy PC (ví dụ `http://192.168.1.10:3000`).

---

## Script npm (Android)

| Lệnh | Mô tả |
|------|--------|
| `npm run mobile` | Metro dev server (Expo Go / web) |
| `npm run mobile:tunnel` | Dev server qua tunnel (iPhone khác mạng LAN) |
| `npm run mobile:android:go` | Mở trên Android emulator qua Expo Go |
| `npm run mobile:android` | Build & chạy native Android (`expo run:android`) |
