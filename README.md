# Pengenalan Perpustakaan

Game web edukatif 2D bergaya RPG klasik untuk memperkenalkan **perpustakaan sekolah** dan **perpustakaan digital** kepada pelajar dan umum. Dibangun dengan Phaser 3 + Vite + TypeScript, tanpa gambar eksternal (semua sprite & tile di-generate secara prosedural).

## Fitur
- 5 adegan: Judul → Pilih Karakter → Ruang Kelas → Perpustakaan Sekolah → Perpustakaan Digital → Kuis → Ending.
- 5 buku referensi interaktif (Kamus, Ensiklopedia, Biografi, Geografi, Buku Pedoman).
- 4 konsep perpustakaan digital (E-Book, OPAC, Database, Repositori).
- Kuis 5 soal dengan sistem lencana otomatis.
- Save otomatis ke `localStorage` (gender, materi yang sudah dibaca, lencana).
- Responsif (Phaser Scale.FIT) — jalan di laptop/HP.
- Aset 100% prosedural — tidak ada dependensi gambar eksternal.

## Cara Menjalankan (Lokal di Mac)
```bash
cd pengenalan-perpus
npm install
npm run dev
# buka http://localhost:5173
```

## Build Produksi
```bash
npm run build
npm run preview
# output di folder dist/
```

## Skrip
- `npm run dev` — server pengembangan Vite.
- `npm run build` — type-check TypeScript + bundle Vite.
- `npm run preview` — pratinjau hasil build.
- `npm run typecheck` — TypeScript saja.
- `npm run test` — Vitest unit test.

## Kontrol
- Panah / WASD: bergerak.
- Spasi / Enter: interaksi (bicara dengan NPC, buka buku, pilih jawaban).
- ↑↓: memilih jawaban kuis / opsi dialog.

## Struktur Project
Lihat `HANDOVER.md` untuk dokumentasi teknis lengkap dan catatan untuk melanjutkan di chat baru.

## Lisensi
Konten edukasi dalam game ini bebas digunakan untuk tujuan pengajaran. Kode dilisensikan MIT (lihat `LICENSE`).
