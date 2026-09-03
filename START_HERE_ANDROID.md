# 🚀 START HERE - Setup Android untuk weddfin

**Selamat datang!** File ini adalah titik awal Anda untuk setup dan build APK aplikasi weddfin.

---

## 🎯 Pilih Jalur Anda

### 🟢 Jalur 1: PEMULA (Belum Pernah Build APK Android)

**Waktu:** ~60-90 menit (termasuk instalasi)

**Langkah-langkah:**

1. **Baca dulu:** [SETUP_ANDROID_STUDIO.md](./SETUP_ANDROID_STUDIO.md)
   - Panduan install semua software yang diperlukan
   - Setup Android Studio dari nol
   - Konfigurasi environment

2. **Ikuti checklist:** [CHECKLIST_ANDROID_SETUP.md](./CHECKLIST_ANDROID_SETUP.md)
   - Centang setiap langkah yang sudah selesai
   - Pastikan tidak ada yang terlewat

3. **Jalankan setup otomatis:**
   ```powershell
   .\setup-android.ps1
   ```

4. **Build APK pertama:**
   ```powershell
   .\build-apk.ps1 -BuildType debug
   ```

5. **Selesai!** APK Anda ada di:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

### 🟡 Jalur 2: INTERMEDIATE (Sudah Familiar dengan Android)

**Waktu:** ~20-30 menit

**Langkah-langkah:**

1. **Baca quick start:** [QUICK_START_ANDROID.md](./QUICK_START_ANDROID.md)
   - Command-command cepat
   - Troubleshooting umum

2. **Setup sekali jalan:**
   ```powershell
   .\setup-android.ps1
   ```

3. **Build APK:**
   ```powershell
   .\build-apk.ps1 -BuildType debug
   ```

4. **Lihat detail build** (opsional): [PANDUAN_BUILD_APK.md](./PANDUAN_BUILD_APK.md)

---

### 🔵 Jalur 3: EXPERT (Hanya Butuh Referensi)

**Waktu:** ~5 menit

**Quick commands:**

```powershell
# Install dependencies
npm install

# Build web + sync + build APK
npm run build && npx cap sync android && cd android && .\gradlew.bat assembleDebug

# Atau gunakan script
.\build-apk.ps1 -BuildType debug
```

**Referensi teknis:** [android/README_ANDROID.md](./android/README_ANDROID.md)

---

## 📚 Daftar Lengkap Panduan

| File | Deskripsi | Target | Waktu Baca |
|------|-----------|--------|------------|
| **QUICK_START_ANDROID.md** | Command cepat, no explanation | Intermediate+ | 2 min |
| **SETUP_ANDROID_STUDIO.md** | Install & setup dari nol | Pemula | 10 min |
| **PANDUAN_BUILD_APK.md** | Build APK detail, signing, AAB | Semua level | 15 min |
| **CHECKLIST_ANDROID_SETUP.md** | Checklist interaktif | Pemula | 5 min |
| **README_ANDROID_SETUP.md** | Ringkasan semua panduan | Semua level | 5 min |
| **android/README_ANDROID.md** | Technical reference | Advanced | 5 min |

---

## 🛠️ Tools & Scripts

Project ini menyediakan helper scripts:

### `setup-android.ps1`
Setup otomatis project Android.

```powershell
.\setup-android.ps1
```

**Fungsi:**
- ✅ Cek prasyarat (Node, Java, SDK)
- ✅ Buat `local.properties`
- ✅ Install dependencies
- ✅ Build web app
- ✅ Sync ke Android

---

### `build-apk.ps1`
Build APK dengan satu command.

```powershell
# Debug APK (untuk testing)
.\build-apk.ps1 -BuildType debug

# Release APK (untuk produksi)
.\build-apk.ps1 -BuildType release
```

**Fungsi:**
- ✅ Build web app
- ✅ Sync ke Android
- ✅ Compile APK
- ✅ Tampilkan lokasi file

---

## ⚡ Quick Start (TL;DR)

Jika sudah install semua prasyarat:

```powershell
# 1. Setup (sekali saja)
.\setup-android.ps1

# 2. Build APK
.\build-apk.ps1 -BuildType debug

# 3. Install ke HP
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

**Selesai!** 🎉

---

## 📋 Prasyarat

Pastikan sudah terinstall:

- [ ] **Node.js** v18+ → https://nodejs.org/
- [ ] **Java JDK 17+** → https://adoptium.net/
- [ ] **Android Studio** → https://developer.android.com/studio
- [ ] **Android SDK** API 33+

Cek dengan:
```powershell
node -v
java -version
```

Jika belum, lihat: [SETUP_ANDROID_STUDIO.md](./SETUP_ANDROID_STUDIO.md)

---

## 🎯 Tujuan

Setelah mengikuti panduan ini, Anda akan bisa:

- ✅ Build APK Debug untuk testing
- ✅ Build APK Release untuk produksi
- ✅ Install APK ke device Android
- ✅ Generate signed APK untuk Play Store
- ✅ Build AAB (Android App Bundle)
- ✅ Troubleshoot masalah umum

---

## 📱 Info Aplikasi

- **Nama:** weddfin
- **Package:** com.venapictures.app
- **Platform:** Android via Capacitor
- **Framework:** React + Vite
- **Min Android:** 6.0 (API 23)
- **Target Android:** 15 (API 35)

---

## 🔄 Workflow Development

**Pertama kali:**
```powershell
.\setup-android.ps1
```

**Setiap ada perubahan di web app:**
```powershell
npm run build
npx cap sync android
```

**Build APK lagi:**
```powershell
.\build-apk.ps1 -BuildType debug
```

**Buka di Android Studio:**
```powershell
npx cap open android
```

---

## 🆘 Masalah?

### Error "SDK location not found"
```powershell
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > android\local.properties
```

### Error "Java version incompatible"
Install Java 17 atau 21 dari https://adoptium.net/

### Gradle sync failed
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug --refresh-dependencies
```

### Build sangat lambat
Edit `android\gradle.properties`, tambahkan:
```properties
org.gradle.jvmargs=-Xmx4096m
```

**Troubleshooting lengkap:** [PANDUAN_BUILD_APK.md](./PANDUAN_BUILD_APK.md)

---

## 🎓 Rekomendasi Baca

**Untuk semua orang:**
1. ✅ File ini (START_HERE_ANDROID.md) - Anda di sini
2. ✅ [QUICK_START_ANDROID.md](./QUICK_START_ANDROID.md) - Command reference

**Jika pemula:**
3. ✅ [SETUP_ANDROID_STUDIO.md](./SETUP_ANDROID_STUDIO.md) - Install semua
4. ✅ [CHECKLIST_ANDROID_SETUP.md](./CHECKLIST_ANDROID_SETUP.md) - Checklist lengkap

**Jika mau build release/production:**
5. ✅ [PANDUAN_BUILD_APK.md](./PANDUAN_BUILD_APK.md) - Signing & AAB

**Untuk referensi teknis:**
6. ✅ [android/README_ANDROID.md](./android/README_ANDROID.md) - Gradle, dependencies, dll

---

## 📞 Support

Jika masih ada pertanyaan setelah baca panduan:

1. Cek troubleshooting di PANDUAN_BUILD_APK.md
2. Jalankan command dengan verbose:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug --stacktrace --info
   ```
3. Lihat log di Android Studio (panel Build/Logcat)

---

## 🌟 Tips

- 💡 **Untuk testing:** Pakai APK Debug (lebih cepat)
- 💡 **Untuk produksi:** Pakai APK Release dengan signing
- 💡 **Untuk Play Store:** Pakai AAB (Android App Bundle)
- 💡 **Simpan keystore:** File .jks + password sangat penting!
- 💡 **Update app:** Selalu `npm run build` dan `npx cap sync` sebelum build APK

---

## ✅ Checklist Cepat

Sebelum mulai, pastikan:

- [ ] Sudah punya semua software (Node, Java, Android Studio)
- [ ] Sudah di folder project yang benar
- [ ] Internet tersambung (untuk download dependencies)
- [ ] Ada ~10 GB space kosong (untuk Android SDK & dependencies)
- [ ] Punya device Android atau emulator untuk testing

---

## 🚀 Mari Mulai!

Pilih jalur Anda di atas dan mulai setup!

**Estimasi waktu total:**
- Pemula: 60-90 menit
- Intermediate: 20-30 menit
- Expert: 5-10 menit

**Good luck dan selamat coding! 🎉**

---

**📌 Simpan file ini sebagai referensi utama Anda.**
