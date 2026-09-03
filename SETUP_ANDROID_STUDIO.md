# 🚀 Setup Android Studio untuk Project Weddfin

## 📌 Ringkasan Cepat

Panduan ini akan membantu Anda setup Android Studio dari awal hingga bisa build APK aplikasi weddfin.

**Estimasi waktu:** 30-60 menit (termasuk download & install)

---

## ✅ Checklist Persiapan

- [ ] Install Android Studio
- [ ] Install Java Development Kit (JDK 17 atau 21)
- [ ] Setup Android SDK
- [ ] Install Node.js dan npm (untuk build web)
- [ ] Clone/Download project
- [ ] Konfigurasi local.properties
- [ ] Build web app
- [ ] Sync Capacitor
- [ ] Buka project di Android Studio
- [ ] Build APK

---

## 📥 Step 1: Install Android Studio

### Download & Install

1. **Download Android Studio:**
   - URL: https://developer.android.com/studio
   - Download versi terbaru (Hedgehog, Iguana, atau lebih baru)
   - Ukuran: ~1-2 GB

2. **Install Android Studio:**
   - Double-click file installer
   - Pilih **Standard Installation** (recommended)
   - Centang semua komponen:
     - ✅ Android SDK
     - ✅ Android SDK Platform
     - ✅ Android Virtual Device
   - Pilih tema (Light atau Dark)
   - Klik **Next** hingga selesai

3. **First Run Setup:**
   - Buka Android Studio pertama kali
   - Akan ada **Setup Wizard**
   - Pilih **Standard** setup type
   - Tunggu download komponen SDK (3-5 GB, butuh waktu)
   - Klik **Finish**

### Verifikasi Android SDK

1. Buka Android Studio
2. Menu **File > Settings** (atau **Ctrl+Alt+S**)
3. Navigasi ke **Appearance & Behavior > System Settings > Android SDK**
4. Tab **SDK Platforms:**
   - ✅ Pastikan minimal **Android 13.0 (Tiramisu) API Level 33** terinstall
   - ✅ Recommended: Install juga **Android 14.0 (API 34)** dan **Android 15.0 (API 35)**
5. Tab **SDK Tools:**
   - ✅ Android SDK Build-Tools (latest)
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator (optional)
   - ✅ Android SDK Platform-Tools
6. Note lokasi SDK (biasanya): `C:\Users\PC - SIGAMPANG\AppData\Local\Android\Sdk`
7. Klik **Apply** jika ada perubahan

---

## ☕ Step 2: Install Java Development Kit (JDK)

### Download & Install JDK

1. **Download JDK 21 (Recommended):**
   - URL: https://adoptium.net/
   - Pilih **Temurin 21 (LTS)**
   - Platform: **Windows**
   - Architecture: **x64** (atau sesuai sistem Anda)
   - Package Type: **.msi** (installer)

2. **Install JDK:**
   - Double-click file .msi
   - Centang **Set JAVA_HOME variable**
   - Centang **JavaSoft (Oracle) registry keys**
   - Centang **Add to PATH**
   - Klik **Next** hingga selesai

3. **Verifikasi Instalasi:**
   ```powershell
   java -version
   ```
   Output yang benar:
   ```
   openjdk version "21.0.x" 2024-xx-xx
   OpenJDK Runtime Environment Temurin-21.x.x+x (build 21.x.x+x)
   OpenJDK 64-Bit Server VM Temurin-21.x.x+x (build 21.x.x+x, mixed mode, sharing)
   ```

### Set JAVA_HOME (jika belum otomatis)

1. **Windows Search** → ketik `Environment Variables`
2. Klik **Edit the system environment variables**
3. Klik tombol **Environment Variables...**
4. Di **System variables**, cari `JAVA_HOME`
5. Jika belum ada, klik **New**:
   - **Variable name:** `JAVA_HOME`
   - **Variable value:** `C:\Program Files\Eclipse Adoptium\jdk-21.0.x.x-hotspot`
     (Sesuaikan dengan lokasi instalasi JDK Anda)
6. Edit variable **Path**, tambahkan:
   ```
   %JAVA_HOME%\bin
   ```
7. Klik **OK** pada semua dialog
8. **Restart PowerShell/Command Prompt** untuk apply perubahan

---

## 🌐 Step 3: Install Node.js (jika belum)

Project ini memerlukan Node.js untuk build web app.

1. **Download Node.js:**
   - URL: https://nodejs.org/
   - Pilih versi **LTS** (Long Term Support)
   - Download installer Windows (.msi)

2. **Install Node.js:**
   - Double-click installer
   - Centang **Automatically install necessary tools**
   - Klik **Next** hingga selesai

3. **Verifikasi:**
   ```powershell
   node -v
   npm -v
   ```

---

## 📂 Step 4: Persiapkan Project

### A. Navigasi ke Project Folder

```powershell
cd "D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter"
```

### B. Install Dependencies

```powershell
# Install semua package yang diperlukan
npm install
```

Tunggu hingga selesai (2-5 menit, tergantung internet).

### C. Build Web App

```powershell
# Build web app (akan generate folder 'dist')
npm run build
```

Output yang benar:
```
✓ built in Xms
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.js        XXX.XX kB
...
```

### D. Sync ke Platform Android

```powershell
# Sync web build ke folder android
npx cap sync android
```

Output yang benar:
```
✔ Copying web assets from dist to android/app/src/main/assets/public in XXms
✔ Creating capacitor.config.json in android/app/src/main/assets in Xms
✔ copy android in XXms
✔ Updating Android plugins in XXms
...
```

---

## ⚙️ Step 5: Konfigurasi local.properties

File ini memberitahu Android Studio lokasi Android SDK.

### Buat File local.properties

```powershell
cd android

# Buat file (ganti path SDK sesuai lokasi di komputer Anda)
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > local.properties
```

### Cek Lokasi SDK Anda

Jika tidak yakin lokasi SDK:
1. Buka Android Studio
2. Menu **File > Settings**
3. Cari **Android SDK**
4. Copy path di **Android SDK Location**
5. Ganti `\` dengan `\\` di file `local.properties`

Contoh:
```
Lokasi asli: C:\Users\PC - SIGAMPANG\AppData\Local\Android\Sdk
Di file: sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk
```

---

## 🏗️ Step 6: Buka Project di Android Studio

### Opsi A: Via Command Line (Otomatis)

```powershell
# Dari root project
npx cap open android
```

Android Studio akan terbuka otomatis dengan project sudah di-load.

### Opsi B: Via Android Studio (Manual)

1. Buka **Android Studio**
2. Jika muncul welcome screen, pilih **Open**
3. Jika sudah ada project terbuka, pilih **File > Open**
4. Navigasi ke folder: `D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android`
5. **PENTING:** Pilih folder **android**, bukan folder root project!
6. Klik **OK**

### Tunggu Gradle Sync

Setelah project terbuka:

1. Android Studio akan melakukan **Gradle Sync** otomatis
2. Anda akan melihat di bagian bawah:
   ```
   Gradle sync started...
   Gradle build running...
   ```
3. **Tunggu hingga selesai** (3-15 menit pertama kali, tergantung internet & spesifikasi PC)
4. Jika berhasil, akan muncul:
   ```
   Gradle sync finished in Xm Ys
   ```

### Troubleshooting Gradle Sync

**Jika muncul error atau stuck:**

1. **Cek koneksi internet** (Gradle download dependencies)
2. **Klik icon 🐘** (Sync Project with Gradle Files) di toolbar
3. **Lihat panel Build** di bawah untuk detail error
4. **File > Invalidate Caches... > Invalidate and Restart**

**Error umum:**
- ❌ "SDK location not found" → Cek file `local.properties`
- ❌ "Java version incompatible" → Install JDK 17 atau 21
- ❌ "Failed to download..." → Periksa internet, atau gunakan VPN jika Gradle URL terblokir

---

## 📱 Step 7: Build APK

### Build APK Debug (untuk testing)

1. Pastikan Gradle sync sudah selesai tanpa error
2. Menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. Tunggu proses build (5-10 menit pertama kali)
4. Panel **Build** di bawah akan menampilkan progress
5. Jika berhasil, akan muncul notifikasi:
   ```
   APK(s) generated successfully.
   locate | analyze
   ```
6. Klik **locate** untuk buka folder APK

**Lokasi APK:**
```
D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android\app\build\outputs\apk\debug\app-debug.apk
```

### Test APK di HP Android

**Via USB Debugging:**

1. Aktifkan USB Debugging di HP:
   - **Settings > About Phone**
   - Tap **Build Number** 7 kali (muncul "You are now a developer")
   - **Settings > Developer Options**
   - Aktifkan **USB Debugging**

2. Hubungkan HP ke PC via USB

3. Install APK:
   ```powershell
   adb install "android\app\build\outputs\apk\debug\app-debug.apk"
   ```

**Via Transfer File:**

1. Copy file APK ke HP (via USB atau Bluetooth)
2. Buka **File Manager** di HP
3. Tap file **app-debug.apk**
4. Jika diminta, izinkan **Install from Unknown Sources**
5. Tap **Install**
6. Selesai! App akan muncul di app drawer

---

## 🎓 Next Steps

Setelah berhasil build APK debug:

1. **Build APK Release** untuk produksi
   - Lihat panduan di `PANDUAN_BUILD_APK.md`
   - Perlu membuat keystore untuk signing

2. **Customize App**
   - Ganti icon: `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - Ganti nama app: `android/app/src/main/res/values/strings.xml`
   - Ganti package name: `capacitor.config.ts` → `appId`

3. **Test di berbagai devices**
   - Gunakan emulator Android Studio
   - Test di device fisik dengan berbagai versi Android

4. **Prepare untuk Google Play Store**
   - Build AAB (Android App Bundle)
   - Buat akun Google Play Developer
   - Upload AAB ke Play Console

---

## 📚 Referensi

- **Android Studio Docs:** https://developer.android.com/studio/intro
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Gradle Docs:** https://docs.gradle.org/
- **Panduan Build APK:** `PANDUAN_BUILD_APK.md`

---

## 🆘 Bantuan Tambahan

Jika masih ada masalah:

1. Baca **PANDUAN_BUILD_APK.md** untuk troubleshooting detail
2. Cek log di Android Studio panel **Build** atau **Logcat**
3. Jalankan dengan verbose:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug --stacktrace --info
   ```
4. Pastikan semua prasyarat terinstall dengan benar

---

**✨ Selamat! Anda sudah siap build APK aplikasi weddfin dengan Android Studio!**
