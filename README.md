# Pengenalan Perpustakaan

Game web edukatif 2D bergaya RPG klasik untuk memperkenalkan **perpustakaan sekolah** dan **perpustakaan digital** kepada pelajar dan umum.

> Inspirasi alur & fitur: `referencecollector.web.id` (RPG Maker MV), dibangun ulang dari nol dengan stack web modern.

## ✨ Fitur
- **8 scene**: Boot → Title → CharacterSelect → Classroom → Library → DigitalLibrary → Quiz → Ending.
- **5 buku referensi** interaktif di perpustakaan sekolah: Kamus, Ensiklopedia, Biografi, Geografi, Buku Pedoman.
- **4 konsep perpustakaan digital**: E-Book, OPAC, Database, Repositori.
- **Kuis 5 soal** dengan sistem lencana otomatis (Pustakawan Muda, Penjelajah Buku, Pemula).
- **Save otomatis** ke `localStorage` (gender, materi yang sudah dibaca, lencana, scene dikunjungi).
- **Audio**: BGM 3 channel (title, explore, quiz) + SFX (interact, success, fail) — sintesis via WebAudio API, tanpa file audio.
- **Touch D-pad** untuk mobile/tablet (auto-detect).
- **Transisi fade** antar scene.
- **Progress HUD** (X / total materi dibaca).
- **Highlight event** terdekat (pulse ring kuning) untuk UX discoverability.
- **Pause menu** (Esc) — lanjutkan atau kembali ke judul.
- **Tutorial popup** interaktif di scene pertama.

## 🛠 Stack
- **Engine**: Phaser 3.90
- **Build**: Vite 5
- **Bahasa**: TypeScript 5 (strict)
- **Test**: Vitest + jsdom
- **Aset**: 100% prosedural (sprite + tileset via Canvas2D) — tidak ada gambar/file audio eksternal.

## 🚀 Menjalankan Lokal (Mac)
```bash
cd pengenalan-perpus
npm install
npm run dev          # http://localhost:5173
```

## 📦 Build Produksi
```bash
npm run build        # output di dist/
npm run preview      # pratinjau build
```

## 🧪 Test
```bash
npm run typecheck    # TypeScript type-check
npm run test         # Vitest unit test
```

## 🎮 Kontrol
| Aksi | Tombol |
|---|---|
| Bergerak | Panah / WASD |
| Interaksi | Spasi / Enter (saat dekat NPC/buku) |
| Pilih jawaban kuis | ↑↓ lalu Spasi/Enter |
| Pause | Esc |
| Mute/unmute | 🔊 di layar judul |

Di mobile, gunakan D-pad on-screen + tombol **Aksi**.

## 📁 Struktur
Lihat `HANDOVER.md` untuk dokumentasi teknis lengkap dan catatan handover antar chat.

## 📜 Lisensi
- **Kode**: MIT (lihat `LICENSE`).
- **Konten edukasi**: Bebas digunakan untuk pengajaran.

## 🔗 Live Demo
Game deployed via GitHub Pages: **https://yogaibnu.github.io/pengenalan-perpus/**

Setiap push ke branch `main` akan otomatis trigger deploy.

## 🔗 Repo
https://github.com/yogaibnu/pengenalan-perpus
