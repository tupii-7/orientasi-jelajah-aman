# Jelajah Aman

Aplikasi Expo/React Native untuk mencari informasi cuaca dan kualitas udara
berdasarkan kota atau lokasi pengguna. Aplikasi dirancang agar data kota yang
pernah dibuka tetap dapat ditampilkan ketika perangkat sedang offline.

## Fitur

- Pencarian kota menggunakan layanan geocoding Open-Meteo.
- Informasi suhu, kondisi cuaca, dan kualitas udara (AQI).
- Dukungan lokasi saat ini dengan izin lokasi perangkat.
- Cache cuaca lokal menggunakan SQLite.
  - Cache segar digunakan tanpa meminta data baru ke internet.
  - Cache basi tetap digunakan jika jaringan tidak tersedia.
  - Cache yang berusia lebih dari 7 hari dibersihkan secara otomatis.
- Daftar kota tersimpan yang dapat dibuka kembali secara offline.
- Penghapusan cache kota secara individual dengan konfirmasi.
- Penyimpanan kota favorit menggunakan penyimpanan lokal.
- Riwayat maksimal 10 pencarian terakhir.
  - Kota yang sama tidak digandakan.
  - Pencarian terbaru berada di urutan paling atas.
  - Item riwayat dapat diklik untuk memuat ulang kota tersebut.
- Navigasi tab dengan ikon representatif:
  - Beranda
  - Riwayat
  - Pengaturan
  - Tentang
- Pilihan tema tampilan:
  - Terang
  - Gelap
  - Ikuti Sistem
- Status data yang menjelaskan apakah data berasal dari internet, cache segar,
  atau cache basi.

## Teknologi

- Expo SDK 57
- Expo Router
- React Native
- TypeScript
- `expo-sqlite` untuk cache cuaca
- `@react-native-async-storage/async-storage` untuk favorit, riwayat, dan
  preferensi tema
- `@expo/vector-icons` untuk ikon navigasi
- Open-Meteo Weather API dan Geocoding API

## Persyaratan

- Node.js dan npm
- Expo CLI melalui `npx`
- Expo Go atau emulator Android/iOS

## Menjalankan Aplikasi

1. Pasang dependensi:

   ```bash
   npm install
   ```

2. Jalankan development server:

   ```bash
   npx expo start
   ```

3. Pilih target yang diinginkan dari terminal Expo:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

### Menjalankan di Web

Konfigurasi [`metro.config.js`](./metro.config.js) diperlukan agar Metro dapat
memuat berkas WASM dari `expo-sqlite`. Dukungan SQLite di web pada Expo SDK 57
masih berstatus alpha.

Jika development server sudah pernah berjalan sebelum perubahan konfigurasi,
hentikan server lalu jalankan ulang dengan cache dibersihkan:

```bash
npx expo start --web --clear
```

Untuk deployment web, server hosting juga perlu mengirim header berikut agar
`SharedArrayBuffer` dapat digunakan:

```text
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

## Struktur Utama

```text
src/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── riwayat.tsx
│       ├── pengaturan.tsx
│       └── tentang.tsx
├── components/
├── constants/
├── db/
├── hooks/
├── services/
│   ├── cacheRepository.ts
│   ├── cuacaRepository.ts
│   ├── favoritStorage.ts
│   └── recentSearchStorage.ts
└── types/
```

## Perilaku Offline

Ketika kota dipilih, data cuaca dan kualitas udara akan disimpan ke cache
SQLite berdasarkan koordinat kota. Pada pencarian berikutnya, aplikasi akan:

1. Menggunakan cache segar jika masih berada dalam batas 30 menit.
2. Mencoba mengambil data terbaru dari internet jika cache sudah lebih lama.
3. Menggunakan cache basi jika permintaan jaringan gagal.
4. Menampilkan pesan error jika tidak ada cache dan jaringan tidak tersedia.

Cache kota dapat dihapus dari daftar **Kota Tersimpan Offline** di Beranda atau
tab **Riwayat**. Aplikasi akan meminta konfirmasi sebelum data dihapus.

## Pemeriksaan Tipe

Untuk memeriksa kode TypeScript:

```bash
npx tsc --noEmit
```

## Lisensi

Lihat file [LICENSE](./LICENSE).
