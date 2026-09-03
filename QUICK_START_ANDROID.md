# ⚡ Quick Start - Build APK Android

Panduan cepat untuk build APK aplikasi weddfin.

## 🎯 Cara Tercepat (Menggunakan Script Otomatis)

### 1. Setup (Hanya Sekali)

```powershell
# Jalankan dari root project
.\setup-android.ps1
```

Script ini akan:
- ✅ Cek semua prasyarat (Node.js, Java, Android SDK)
- ✅ Buat file `local.properties` otomatis
- ✅ Install dependencies
- ✅ Build web app
- ✅ Sync ke Android

**Waktu:** ~5-10 menit

### 2. Build APK

```powershell
# Build APK Debug (untuk testing)
.\build-apk.ps1 -BuildType debug

# Build APK Release (untuk produksi)
.\build-apk.ps1 -BuildType release
```

**APK Location:**
- Debug: `android\app\build\outputs\apk\debug\app-debug.apk`
- Release: `android\app\build\outputs\apk\release\app-release.apk`

**Waktu:** ~5-10 menit (pertama kali lebih lama)

---

## 🛠️ Cara Manual (Step by Step)

### Persiapan

```powershell
# 1. Install dependencies
npm install

# 2. Build web app
npm run build

# 3. Sync ke Android
npx cap sync android

# 4. Buat local.properties (ganti path SDK sesuai PC Anda)
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > android\local.properties
```

### Build via Android Studio

```powershell
# Buka Android Studio
npx cap open android

# Tunggu Gradle sync selesai, lalu:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### Build via Command Line

```powershell
cd android

# Debug APK
.\gradlew.bat assembleDebug

# Release APK
.\gradlew.bat assembleRelease
```

---

## 📱 Install APK ke HP Android

### Via USB (ADB)

```powershell
# 1. Aktifkan USB Debugging di HP
# 2. Hubungkan HP ke PC via USB
# 3. Install APK
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### Via Transfer File

1. Copy file APK ke HP (via USB, Bluetooth, atau cloud)
2. Buka File Manager di HP
3. Tap file APK → Install

---

## 🆘 Troubleshooting Cepat

### Error: "SDK location not found"
```powershell
# Buat/edit file android\local.properties
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > android\local.properties
```

### Error: "Java version incompatible"
- Install Java 17 atau 21 dari https://adoptium.net/

### Error: "Gradle sync failed"
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug --refresh-dependencies
```

### Build Sangat Lambat
Edit `android\gradle.properties`, tambahkan:
```properties
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx4096m
```

---

## 📋 Checklist

Sebelum build, pastikan:

- [ ] Node.js sudah terinstall
- [ ] Java 17+ sudah terinstall
- [ ] Android Studio sudah terinstall (jika build via GUI)
- [ ] Android SDK sudah di-setup
- [ ] File `android\local.properties` sudah ada
- [ ] Dependencies sudah di-install (`npm install`)
- [ ] Web app sudah di-build (`npm run build`)

---

## 🎓 Resources

Untuk panduan lengkap, lihat:

- **Setup Android Studio:** `SETUP_ANDROID_STUDIO.md`
- **Build APK Detail:** `PANDUAN_BUILD_APK.md`
- **Android Project Info:** `android\README_ANDROID.md`

---

## 💡 Tips

1. **Untuk testing cepat:** Gunakan APK Debug
2. **Untuk produksi:** Gunakan APK Release dengan signing
3. **Untuk Play Store:** Gunakan AAB (Android App Bundle)
4. **Simpan keystore:** File .jks sangat penting untuk update app!

---

## 🚀 Quick Commands

```powershell
# Setup sekali
.\setup-android.ps1

# Build debug APK
.\build-apk.ps1 -BuildType debug

# Build release APK
.\build-apk.ps1 -BuildType release

# Install ke device
adb install -r android\app\build\outputs\apk\debug\app-debug.apk

# Buka di Android Studio
npx cap open android

# Clean build (jika ada masalah)
cd android && .\gradlew.bat clean && cd ..
```

---

**✨ Selamat coding!**
