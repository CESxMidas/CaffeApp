# Android / JDK — Expo SDK 54

CaffeApp mobile dùng **Expo SDK 54** (tương thích **Expo Go** trên App Store) → cần **JDK 17** khi build Android native.

## Yêu cầu

| Thành phần | Phiên bản |
|------------|-----------|
| Expo SDK | **54** |
| JDK (Android build) | **17** |
| Android SDK | API **35** khuyến nghị (emulator 4 KB, không 16 KB) |
| Node.js | **≥ 20.19** |
| Expo Go (iPhone) | Supported SDK **54** ✓ |

## Android SDK

SDK cài **trên máy** qua Android Studio — không nằm trong repo.

| File / biến | Vị trí | Commit? |
|-------------|--------|---------|
| `ANDROID_HOME` | Biến môi trường máy | Không |
| `local.properties` | `apps/mobile/android/local.properties` | **Không** (gitignore) |
| `android/` folder | Sinh bởi `expo prebuild` | **Không** (gitignore) |

Chi tiết `ANDROID_HOME`, `local.properties`, PATH: [ENV_SETUP.md §3](ENV_SETUP.md#3-android-sdk-android_home--localproperties).

## Cài JDK 17 (Windows)

Một trong hai:

```powershell
winget install EclipseAdoptium.Temurin.17.JDK
# hoặc
winget install Microsoft.OpenJDK.17
```

Script `scripts/set-java-17.ps1` tự tìm Temurin hoặc Microsoft JDK 17 đã cài trên máy.

## Dùng JDK 17 trong terminal hiện tại

Từ thư mục gốc repo:

```powershell
. .\scripts\set-java-17.ps1
java -version
# → openjdk version "17.0.19"
```

## Build Android native (sau `expo prebuild`)

1. Tạo `apps/mobile/android/local.properties` (xem [ENV_SETUP.md](ENV_SETUP.md)) nếu Gradle báo thiếu SDK.
2. Ghi JDK vào `gradle.properties` (file local, không commit):

```powershell
.\scripts\patch-android-jdk.ps1
```

Script tự phát hiện JDK 17 (Temurin / Microsoft) và ghi dòng tương tự:

```properties
org.gradle.java.home=C\:\\Program Files\\Eclipse Adoptium\\jdk-17.0.19.10-hotspot
```

Nếu chạy lại `npx expo prebuild`, chạy lại `patch-android-jdk.ps1` (thư mục `android/` không commit).

```powershell
cd apps\mobile
npx expo prebuild --platform android
..\..\scripts\patch-android-jdk.ps1
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
