# 📱 Panduan Lengkap Build APK dengan Android Studio - weddfin

## ✅ Status Persiapan
- ✅ Capacitor v8.5.0 sudah terinstall
- ✅ Android platform sudah di-sync
- ✅ Gradle 9.0.1 sudah siap
- ✅ Build web sudah sukses

---

## 📋 Prasyarat

### 1. Install Android Studio
1. Download Android Studio dari: https://developer.android.com/studio
2. Install dengan semua komponen default
3. Saat pertama kali buka, ikuti setup wizard untuk install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (optional)

### 2. Install Java Development Kit (JDK)
Project ini memerlukan JDK 17 atau 21:
- Download dari: https://adoptium.net/
- Pilih versi **JDK 17 LTS** atau **JDK 21 LTS**
- Install dan set JAVA_HOME di environment variables

### 3. Verifikasi Instalasi
```powershell
# Cek Java version
java -version

# Cek Android SDK
# Buka Android Studio > Tools > SDK Manager
# Pastikan minimal Android 13.0 (API 33) terinstall
```

---

## 🎯 Cara 1: Build APK via Command Line (TERCEPAT)

### Langkah 1: Build dan Sync
```powershell
# Pastikan Anda di folder project
cd "D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter"

# Build web app
npm run build

# Sync ke Android
npx cap sync android
```

### Langkah 2: Build APK Debug (untuk testing)
```powershell
cd android
.\gradlew.bat assembleDebug
```

**Lokasi APK Debug:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Langkah 3: Build APK Release (untuk produksi)
```powershell
cd android
.\gradlew.bat assembleRelease
```

**Lokasi APK Release:**
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

⚠️ **CATATAN:** APK release perlu di-sign sebelum bisa diinstall.

---

## 🎯 Cara 2: Build APK via Android Studio (DIREKOMENDASIKAN)

### Langkah-langkah Detail:

#### 1️⃣ Persiapkan Project

**A. Build web app terlebih dahulu:**
```powershell
# Pastikan Anda di folder project
cd "D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter"

# Install dependencies (jika belum)
npm install

# Build web app
npm run build
```

**B. Sync ke Android:**
```powershell
# Sync web build ke platform Android
npx cap sync android
```

**C. Buat file local.properties (PENTING!):**
```powershell
# Buat file yang berisi lokasi Android SDK
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > android\local.properties
```

> **⚠️ CATATAN:** Ganti path SDK sesuai lokasi di komputer Anda.
> Untuk cek lokasi SDK: Buka Android Studio > Tools > SDK Manager > Copy "Android SDK Location"

#### 2️⃣ Buka Project di Android Studio

**Opsi A: Via Command (Otomatis)**
```powershell
npx cap open android
```

**Opsi B: Via Android Studio (Manual)**
1. Buka **Android Studio**
2. Pilih **Open** (atau **File > Open**)
3. Navigasi ke folder: `D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android`
4. Pastikan Anda memilih folder **android** (bukan folder root project)
5. Klik **OK**

#### 3️⃣ Tunggu Gradle Sync Selesai

Setelah project terbuka:
1. Android Studio akan otomatis melakukan **Gradle Sync**
2. Anda akan melihat progress di bagian bawah: `Gradle Build Running...`
3. Tunggu hingga muncul **"Gradle sync finished"** (bisa 3-10 menit pertama kali)

**Jika ada masalah:**
- Klik icon 🐘 (Sync Project with Gradle Files) di toolbar
- Atau **File > Sync Project with Gradle Files**

**Masalah umum dan solusi:**
- ❌ "SDK location not found" → Pastikan file `local.properties` sudah dibuat
- ❌ "Java version incompatible" → Install JDK 17 atau 21
- ❌ "Failed to download..." → Periksa koneksi internet

#### 4️⃣ Build APK Debug (untuk testing)

**Cara A: Via Menu (Paling Mudah)**
1. Klik menu **Build** di toolbar atas
2. Pilih **Build Bundle(s) / APK(s)**
3. Pilih **Build APK(s)**
4. Tunggu proses build (2-10 menit)
5. Setelah selesai, akan muncul notifikasi pop-up di kanan bawah:
   ```
   APK(s) generated successfully
   [locate] [analyze]
   ```
6. Klik **locate** untuk membuka folder APK

**Cara B: Via Gradle Panel**
1. Buka panel **Gradle** di sebelah kanan Android Studio
2. Expand: **atter > app > Tasks > build**
3. Double-click **assembleDebug**
4. Lihat progress di panel **Build** di bawah

**Lokasi file APK:**
```
D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android\app\build\outputs\apk\debug\app-debug.apk
```

**Ukuran file:** ~5-15 MB (tergantung assets)

#### 5️⃣ Build APK Release (untuk produksi & distribusi)

APK Release diperlukan untuk:
- Upload ke Google Play Store
- Distribusi ke pengguna akhir
- Testing yang lebih mendekati kondisi produksi

**Langkah-langkah:**

**A. Generate Signed APK (Dengan Tanda Tangan Digital)**

1. Klik menu **Build** → **Generate Signed Bundle / APK**
2. Pilih **APK** → Klik **Next**
3. Anda akan melihat dialog **Generate Signed Bundle or APK**

**B. Buat Keystore (Pertama Kali)**

> **⚠️ SANGAT PENTING:** Keystore ini adalah "kunci" aplikasi Anda. Simpan file dan password dengan AMAN! Jika hilang, Anda tidak bisa update aplikasi di Play Store.

1. Klik **Create new...** (tombol di samping Key store path)
2. Isi form pembuatan keystore:

   **Key store path:**
   ```
   D:\weddfin-keystore.jks
   ```
   (Atau lokasi lain yang mudah Anda ingat)

   **Password:** (Contoh: `Weddfin2026!Secure`)
   > Buat password yang kuat dan CATAT di tempat aman!

   **Confirm password:** (Ulangi password yang sama)

   **Key - Alias:** `weddfin-release-key`
   
   **Password:** (Bisa sama dengan keystore password atau beda)
   
   **Validity (years):** `25` atau `30`

   **Certificate:**
   - **First and Last Name:** `Vena Pictures` (atau nama Anda)
   - **Organizational Unit:** `Development`
   - **Organization:** `Vena Pictures`
   - **City or Locality:** `Jakarta` (kota Anda)
   - **State or Province:** `DKI Jakarta` (provinsi Anda)
   - **Country Code (XX):** `ID`

3. Klik **OK**

**C. Sign APK**

1. Setelah keystore dibuat, Anda kembali ke dialog signing
2. Pastikan semua field terisi:
   - ✅ Key store path
   - ✅ Key store password
   - ✅ Key alias
   - ✅ Key password
3. Centang **Remember passwords** (opsional, untuk kemudahan)
4. Klik **Next**

**D. Pilih Build Variant**

1. **Destination Folder:** (Lokasi output APK, biarkan default)
2. **Build Variants:**
   - ✅ Centang **release**
   - ❌ Jangan centang debug
3. **Signature Versions:**
   - ✅ V1 (Jar Signature) - untuk kompatibilitas Android lama
   - ✅ V2 (Full APK Signature) - untuk Android modern
4. Klik **Finish**

**E. Tunggu Build Selesai**

1. Proses build akan berjalan (5-15 menit)
2. Anda bisa lihat progress di panel **Build** di bawah
3. Setelah selesai, akan muncul notifikasi:
   ```
   APK(s) generated successfully.
   [locate] [analyze]
   ```
4. Klik **locate**

**Lokasi file APK Release:**
```
D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android\app\release\app-release.apk
```

**Ukuran file:** ~3-10 MB (lebih kecil dari debug karena teroptimasi)

**F. Backup Keystore (WAJIB!)**

```powershell
# Copy keystore ke lokasi backup
Copy-Item "D:\weddfin-keystore.jks" "D:\BACKUP\weddfin-keystore-backup.jks"

# Atau upload ke cloud storage (Google Drive, Dropbox, dll)
```

**Buat catatan berisi:**
```
=== WEDDFIN KEYSTORE INFO ===
Keystore File: D:\weddfin-keystore.jks
Keystore Password: [password Anda]
Key Alias: weddfin-release-key
Key Password: [password key]
Created: [tanggal]
===========================
SIMPAN FILE INI DI TEMPAT AMAN!
```

---

## 🎯 Cara 3: Build AAB (untuk Google Play Store)

### Via Android Studio:
**Menu:** `Build > Generate Signed Bundle / APK`
1. Pilih **Android App Bundle**
2. Klik **Next**
3. Pilih keystore (atau buat baru)
4. Pilih **release**
5. Klik **Finish**

**Lokasi file:**
```
android/app/release/app-release.aab
```

### Via Command Line:
```powershell
cd android
.\gradlew.bat bundleRelease
```

---

## 📦 Install APK ke HP Android

### Via USB Debugging:
```powershell
# Aktifkan USB Debugging di HP terlebih dahulu
# Settings > About Phone > Tap "Build Number" 7x
# Settings > Developer Options > USB Debugging ON

# Install APK
adb install "android/app/build/outputs/apk/debug/app-debug.apk"
```

### Via Transfer File:
1. Copy file APK ke HP (via USB atau sharing)
2. Buka File Manager di HP
3. Tap file APK
4. Izinkan "Install from Unknown Sources" jika diminta
5. Tap **Install**

---

## 🐛 Troubleshooting Android Studio

### ❌ Error: "SDK location not found"
**Penyebab:** Android Studio tidak tahu lokasi Android SDK

**Solusi 1: Buat file local.properties**
```powershell
cd "D:\aplikasi 2026 benar\vendor phtotogrpahy 20206\atter\android"

# Windows PowerShell
echo "sdk.dir=C:\\Users\\PC - SIGAMPANG\\AppData\\Local\\Android\\Sdk" > local.properties
```

**Solusi 2: Cek lokasi SDK Anda**
1. Buka Android Studio
2. Menu **File > Settings** (atau **Ctrl+Alt+S**)
3. Cari **Android SDK** di panel kiri
4. Lihat **Android SDK Location**, contoh:
   ```
   C:\Users\PC - SIGAMPANG\AppData\Local\Android\Sdk
   ```
5. Copy path tersebut ke file `local.properties`

---

### ❌ Error: "Java version incompatible" atau "Unsupported Java"
**Penyebab:** Project memerlukan Java 17 atau 21

**Solusi:**
1. Download Java 21 dari: https://adoptium.net/
2. Install Java
3. Set JAVA_HOME:
   - **Windows Search** → ketik `Environment Variables`
   - Klik **Edit the system environment variables**
   - Klik tombol **Environment Variables...**
   - Di **System variables**, klik **New**:
     - **Variable name:** `JAVA_HOME`
     - **Variable value:** `C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot`
   - Tambahkan ke PATH: `%JAVA_HOME%\bin`
4. Restart Android Studio

**Verifikasi:**
```powershell
java -version
# Output seharusnya: openjdk version "21.x.x" atau "17.x.x"
```

---

### ❌ Error: "Gradle sync failed" atau "Could not resolve dependencies"
**Solusi 1: Clean dan Rebuild**
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
```

**Solusi 2: Invalidate Caches di Android Studio**
1. Menu **File > Invalidate Caches...**
2. Pilih **Invalidate and Restart**
3. Tunggu Android Studio restart
4. Klik sync gradle lagi (icon 🐘)

**Solusi 3: Hapus cache gradle**
```powershell
# Hapus folder .gradle di project
Remove-Item -Recurse -Force "android\.gradle"

# Hapus folder build
Remove-Item -Recurse -Force "android\build"
Remove-Item -Recurse -Force "android\app\build"

# Sync ulang
cd android
.\gradlew.bat --refresh-dependencies
```

---

### ❌ Error: "Failed to install APK" atau "INSTALL_FAILED"
**Penyebab:** APK tidak ter-sign atau konflik versi

**Solusi untuk APK Debug:**
```powershell
# Pastikan USB Debugging aktif di HP
# Install ulang dengan force
adb install -r "android\app\build\outputs\apk\debug\app-debug.apk"

# Atau uninstall dulu
adb uninstall com.venapictures.app
adb install "android\app\build\outputs\apk\debug\app-debug.apk"
```

**Solusi untuk APK Release:**
- APK Release HARUS di-sign dengan keystore
- Pastikan Anda sudah ikuti langkah "Generate Signed APK"

---

### ❌ Error: "Execution failed for task ':app:mergeReleaseResources'"
**Penyebab:** Ada masalah dengan resources (gambar, icon, dll)

**Solusi:**
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleRelease --stacktrace
```

Lihat error detail di output, biasanya ada file gambar atau resource yang bermasalah.

---

### ❌ APK tidak bisa diinstall di HP
**Solusi:**
1. Aktifkan **Install from Unknown Sources**:
   - **Settings > Security > Unknown Sources** → ON
   - Atau di Android modern: **Settings > Apps > Special app access > Install unknown apps** → Izinkan untuk file manager Anda

2. Pastikan APK ter-sign (untuk Release APK)

3. Cek apakah ada versi lama yang terinstall:
   ```powershell
   adb uninstall com.venapictures.app
   ```

---

### ❌ Error: "Manifest merger failed"
**Penyebab:** Ada konflik di AndroidManifest.xml

**Solusi:**
```powershell
cd android
.\gradlew.bat assembleDebug --info
```

Lihat output untuk detail konflik. Biasanya perlu edit file:
```
android\app\src\main\AndroidManifest.xml
```

---

### ❌ Build sangat lambat (> 30 menit)
**Solusi 1: Enable Gradle Daemon**
Edit file `android\gradle.properties`:
```properties
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m
```

**Solusi 2: Gunakan build debug untuk testing**
Debug build lebih cepat karena tidak ada optimisasi.

---

### ⚙️ Tips Optimisasi Build

1. **Tambahkan ke android\gradle.properties:**
```properties
# Enable daemon
org.gradle.daemon=true

# Enable parallel
org.gradle.parallel=true

# Increase memory
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError

# Enable caching
org.gradle.caching=true

# Enable configuration cache
org.gradle.configuration-cache=true
```

2. **Disable antivirus sementara untuk folder project** (dapat mempercepat 2-3x)

3. **Tutup aplikasi lain yang berat** saat build pertama kali

---

## 📝 Checklist Build APK

- [ ] Install Android Studio (jika belum)
- [ ] Install Java 17+ (jika belum)
- [ ] npm run build (build web app)
- [ ] npx cap sync android (sync ke Android)
- [ ] npx cap open android (buka Android Studio)
- [ ] Tunggu Gradle sync selesai
- [ ] Build > Build Bundle(s) / APK(s) > Build APK(s)
- [ ] Tunggu build selesai (2-5 menit)
- [ ] Locate APK di folder output
- [ ] Install APK ke HP Android

---

## 🚀 Quick Command untuk Build

```powershell
# Build debug APK (siap testing)
npm run build && npx cap sync android && cd android && .\gradlew.bat assembleDebug && cd ..

# Lokasi APK:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Informasi APK

- **App Name:** weddfin
- **Package Name:** com.venapictures.app
- **Min SDK:** Android 6.0 (API 23)
- **Target SDK:** Android 15 (API 35)
- **Server URL:** https://keuanganvendor.netlify.app

---

## 💡 Tips

1. **Untuk Testing:** Gunakan APK Debug (lebih cepat, tidak perlu signing)
2. **Untuk Produksi:** Gunakan APK Release dengan signing
3. **Untuk Play Store:** Gunakan AAB (Android App Bundle)
4. **Simpan Keystore:** File .jks dan password sangat penting untuk update app di masa depan!

---

**✨ Semoga berhasil!**
