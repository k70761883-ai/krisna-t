# 📱 Panduan Setup Android - weddfin

Selamat datang! Repository ini berisi aplikasi **weddfin** yang dibangun dengan React + Vite + Capacitor.

## 📚 Daftar Panduan

Project ini menyediakan beberapa panduan lengkap untuk membantu Anda build APK Android:

### 1. **QUICK_START_ANDROID.md** ⚡
Panduan tercepat untuk build APK. Cocok untuk yang sudah familiar dengan Android development.

**Isi:**
- Setup cepat menggunakan script otomatis
- Command-line quick reference
- Troubleshooting singkat

**Waktu baca:** 2 menit  
**Link:** [QUICK_START_ANDROID.md](./QUICK_START_ANDROID.md)

---

### 2. **SETUP_ANDROID_STUDIO.md** 🎓
Panduan lengkap dari nol hingga bisa build APK pertama kali. Cocok untuk pemula.

**Isi:**
- Install Android Studio dari awal
- Install Java JDK
- Setup Android SDK
- Konfigurasi environment
- Step-by-step buka project di Android Studio

**Waktu baca:** 10 menit  
**Link:** [SETUP_ANDROID_STUDIO.md](./SETUP_ANDROID_STUDIO.md)

---

### 3. **PANDUAN_BUILD_APK.md** 🏗️
Panduan detail untuk build APK Debug dan Release, termasuk signing.

**Isi:**
- Build APK via command line
- Build APK via Android Studio
- Generate signed APK/AAB untuk produksi
- Buat dan manage keystore
- Install APK ke device
- Troubleshooting lengkap

**Waktu baca:** 15 menit  
**Link:** [PANDUAN_BUILD_APK.md](./PANDUAN_BUILD_APK.md)

---

### 4. **android/README_ANDROID.md** 🔧
Technical reference untuk Android project.

**Isi:**
- Struktur folder Android project
- Gradle tasks dan commands
- Konfigurasi files
- Signing APK via Gradle
- Dependencies management

**Waktu baca:** 5 menit  
**Link:** [android/README_ANDROID.md](./android/README_ANDROID.md)

---

## 🚀 Mulai dari Mana?

### Jika Anda BARU pertama kali:
1. ✅ Baca **SETUP_ANDROID_STUDIO.md** untuk install semua prasyarat
2. ✅ Jalankan `.\setup-android.ps1` untuk setup otomatis
3. ✅ Jalankan `.\build-apk.ps1 -BuildType debug` untuk build APK
4. ✅ Lihat **QUICK_START_ANDROID.md** untuk referensi cepat

### Jika sudah pernah build Android app:
1. ✅ Baca **QUICK_START_ANDROID.md** untuk command cepat
2. ✅ Jalankan `.\setup-android.ps1`
3. ✅ Build APK sesuai kebutuhan

### Jika sudah setup dan mau build APK:
1. ✅ Baca **PANDUAN_BUILD_APK.md** untuk detail build
2. ✅ Gunakan Android Studio atau command line

---

## 🛠️ Script Otomatis

Project ini menyediakan PowerShell scripts untuk mempermudah setup:

### `setup-android.ps1`
Setup project Android dari awal.

```powershell
.\setup-android.ps1
```

**Fungsi:**
- Cek prasyarat (Node.js, Java, Android SDK)
- Buat file `local.properties` otomatis
- Install npm dependencies
- Build web app
- Sync ke Android platform

### `build-apk.ps1`
Build APK Debug atau Release.

```powershell
# Build debug APK
.\build-apk.ps1 -BuildType debug

# Build release APK
.\build-apk.ps1 -BuildType release
```

**Fungsi:**
- Build web app
- Sync ke Android
- Compile APK via Gradle
- Tampilkan lokasi APK hasil build

---

## 📦 npm Scripts

Tersedia juga npm scripts untuk berbagai keperluan:

```powershell
# Setup Android (jalankan script setup)
npm run android:setup

# Build web dan sync ke Android
npm run android:sync

# Buka project di Android Studio
npm run android:open

# Build web, sync, dan buka Android Studio
npm run android:run

# Build APK debug via command line
npm run android:build

# Build APK release via command line
npm run android:build:release

# Clean build Android
npm run android:clean
```

---

## 📋 Checklist Persiapan

Sebelum mulai, pastikan Anda sudah install:

- [ ] **Node.js** (v18 atau lebih baru)  
      Download: https://nodejs.org/

- [ ] **Java JDK 17 atau 21**  
      Download: https://adoptium.net/

- [ ] **Android Studio** (Hedgehog atau lebih baru)  
      Download: https://developer.android.com/studio

- [ ] **Android SDK** (minimal Android 13.0 / API 33)  
      Install via Android Studio SDK Manager

Cek instalasi:
```powershell
node -v    # Should show v18.x.x or higher
npm -v     # Should show version
java -version  # Should show 17 or 21
```

---

## 🔍 Troubleshooting

### Masalah Umum:

| Masalah | Solusi | Panduan |
|---------|--------|---------|
| SDK location not found | Buat file `android\local.properties` | QUICK_START_ANDROID.md |
| Java version incompatible | Install Java 17 atau 21 | SETUP_ANDROID_STUDIO.md |
| Gradle sync failed | Run `.\gradlew.bat clean` | PANDUAN_BUILD_APK.md |
| APK tidak bisa diinstall | Enable "Unknown Sources" di HP | PANDUAN_BUILD_APK.md |
| Build sangat lambat | Edit `gradle.properties` | PANDUAN_BUILD_APK.md |

Untuk troubleshooting lengkap, lihat **PANDUAN_BUILD_APK.md** bagian "Troubleshooting".

---

## 📱 Informasi Aplikasi

- **Nama App:** weddfin
- **Package Name:** com.venapictures.app
- **Platform:** Android (via Capacitor)
- **Framework:** React + Vite
- **Min Android Version:** 6.0 (API 23)
- **Target Android Version:** 15 (API 35)

---

## 📞 Bantuan Lebih Lanjut

1. **Baca panduan yang sesuai** dari daftar di atas
2. **Cek troubleshooting** di PANDUAN_BUILD_APK.md
3. **Jalankan dengan verbose** untuk lihat detail error:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug --stacktrace --info
   ```
4. **Cek log di Android Studio** (panel Build/Logcat)

---

## 🎯 Quick Commands Cheat Sheet

```powershell
# === SETUP (Sekali saja) ===
.\setup-android.ps1

# === BUILD APK ===
# Via script (recommended)
.\build-apk.ps1 -BuildType debug
.\build-apk.ps1 -BuildType release

# Via npm
npm run android:build          # debug
npm run android:build:release  # release

# Via command line manual
cd android
.\gradlew.bat assembleDebug    # debug
.\gradlew.bat assembleRelease  # release
cd ..

# === ANDROID STUDIO ===
npx cap open android

# === INSTALL APK ===
adb install -r android\app\build\outputs\apk\debug\app-debug.apk

# === CLEAN ===
npm run android:clean
# atau
cd android && .\gradlew.bat clean && cd ..
```

---

## 🌟 Best Practices

1. **Untuk testing:** Build APK Debug (lebih cepat)
2. **Untuk distribusi:** Build APK Release dengan signing
3. **Untuk Play Store:** Build AAB (Android App Bundle)
4. **Backup keystore:** File .jks sangat penting! Simpan di tempat aman
5. **Update web app:** Jalankan `npm run build` dan `npx cap sync android` setiap kali ada perubahan

---

## 📄 Lisensi & Credits

- **Project:** weddfin
- **Author:** nopianhadi
- **Description:** Dashboard for wedding business

---

**✨ Happy Building! Jika ada pertanyaan, baca panduan yang sesuai atau jalankan script otomatis.**
