# Handover Context — Pengenalan Perpustakaan

> File ini adalah **satu-satunya sumber kebenaran** untuk melanjutkan pekerjaan di chat baru.
> Selalu baca file ini dulu sebelum melanjutkan, lalu update di akhir sesi.

## 1. Tujuan Proyek
Membangun game web edukatif 2D bergaya **RPG klasik** bertema **"Pengenalan Perpustakaan"** (sekolah + digital) untuk pelajar dan umum. Inspirasi: `referencecollector.web.id` (RPG Maker MV), tetapi dibangun ulang dari nol dengan **Phaser 3 + Vite + TypeScript** agar modern, ringan, dan mudah dikustomisasi.

## 2. Stack & Keputusan Arsitektur
- **Renderer**: Phaser 3.90 (pakai pipeline PIXI di bawahnya)
- **Build tool**: Vite 5
- **Bahasa**: TypeScript 5 (strict mode)
- **Testing**: Vitest + jsdom (unit test, bukan e2e)
- **Aset**: 100% prosedural — sprite & tile di-generate via `Canvas2D` saat runtime di `SpriteFactory.ts`. Tidak ada gambar eksternal.
- **Save**: `localStorage` (`pengenalan-perpus:save:v1`).
- **Audio**: tidak ada di v0.1 (placeholder; bisa ditambah).
- **Map format**: 2D array tile id + daftar event JSON-like di dalam `WorldScene.buildMap()`.

## 3. Struktur Direktori
```
pengenalan-perpus/
├── index.html
├── package.json
├── tsconfig.json | tsconfig.app.json | tsconfig.node.json
├── vite.config.ts | vitest.config.ts
├── HANDOVER.md           <- file ini
├── README.md
├── .gitignore
└── src/
    ├── main.ts           <- entry; daftarkan semua scene
    ├── types.ts          <- tipe bersama (SaveState, TileMapData, MapEvent, dst)
    ├── data/             <- konten orisinal (dialog, materi, kuis)
    ├── systems/
    │   ├── save.ts       <- load/save state ke localStorage
    │   ├── DialogBox.ts  <- komponen UI dialog ala RPG
    │   ├── SpriteFactory.ts <- generator sprite/tile prosedural
    │   └── WorldScene.ts <- base scene untuk semua map
    ├── scenes/
    │   ├── BootScene.ts
    │   ├── TitleScene.ts
    │   ├── CharacterSelectScene.ts
    │   ├── ClassroomScene.ts
    │   ├── LibraryScene.ts
    │   ├── DigitalLibraryScene.ts
    │   ├── QuizScene.ts
    │   └── EndingScene.ts
    └── assets/           <- (cadangan untuk asset statis di masa depan)
```

## 4. Alur Game (Scene Graph)
```
Boot → Title → CharacterSelect → Classroom → Library
                                            ↓
                                       DigitalLibrary
                                            ↓
                                          Quiz → Ending
```
- **Boot**: opsional, generate tekstur & preload.
- **Title**: layar judul + tombol Mulai/Lanjutkan.
- **CharacterSelect**: pilih gender (male/female).
- **Classroom**: Map Ruang Kelas — dialog Bapak Guru memberi tugas.
- **Library**: Map Perpustakaan Sekolah — 5 buku referensi interaktif (kamus, ensiklopedi, biografi, geografi, buku pedoman).
- **DigitalLibrary**: Map Perpustakaan Digital — 4 konsep (e-book, OPAC, database, repositori).
- **Quiz**: 5 soal kuis singkat, hasilnya jadi lencana.
- **Ending**: rangkuman lencana & kredit.

## 5. Mekanik Inti
- **Bergerak**: panah / WASD (4 arah).
- **Interaksi**: Spasi / klik pada NPC atau buku ber-glyph kuning.
- **Dialog**: tombol Spasi untuk lanjut, ↑↓ + Spasi untuk pilihan.
- **Material panel**: panel fullscreen dengan tombol "Tutup".
- **Exit**: tile bercahaya kuning — otomatis pindah scene saat diinjak.
- **Lencana**: diberikan otomatis saat semua materi di scene terkait dibaca + lulus kuis.

## 6. State Game (lihat `types.ts → SaveState`)
```ts
{
  gender?: "male" | "female";
  visited: string[];        // scene yang pernah dikunjungi
  materialsRead: string[];  // id materi yang sudah dibuka
  flags: Record<string, number | boolean>;
  badges: string[];         // nama lencana
}
```

## 7. Status Saat Ini (Update Terakhir)
- [x] Konfigurasi project (Vite + TS + Vitest).
- [x] Sistem save (`save.ts`).
- [x] `DialogBox` UI.
- [x] `SpriteFactory` prosedural (1 frame sprite + 4 tile tema: school, library, digital).
- [x] `WorldScene` base dengan collision, event, exit, material panel.
- [x] `main.ts` mendaftarkan semua scene.
- [x] Konten data orisinal (`data/dialogs.ts`, `data/materials.ts`, `data/quiz.ts`).
- [x] Implementasi masing-masing scene konkret (Boot, Title, CharacterSelect, Classroom, Library, DigitalLibrary, Quiz, Ending).
- [x] Unit test untuk save (`save.test.ts`).
- [x] Build & smoke test lokal (Playwright headless): Title, CharacterSelect, ClassroomScene — 0 error console.
- [x] Repo GitHub `yogaibnu/pengenalan-perpus` dibuat & dipush: https://github.com/yogaibnu/pengenalan-perpus
  - Visibilitas: public. Branch: main.

## 7b. Roadmap Lanjutan
- [x] Tambah frame 'up' untuk sprite agar hadap atas tidak terlihat seperti hadap depan.
- [x] Tile tema school: warnai dinding lebih kontras dengan library.
- [x] Highlight event terdekat (pulse ring kuning) saat pemain berdiri di dekat event.
- [x] Pause menu (Esc → Lanjutkan / Kembali ke Judul).
- [x] Progress bar (HUD pojok kanan-atas: jumlah materi dibaca / total).
- [x] Audio BGM + SFX (WebAudio API sintesis, tanpa file eksternal).
- [x] Tutorial popup interaktif di ClassroomScene (auto-dismiss saat pemain bergerak).
- [x] Unit test tambahan untuk Audio (3 test).
- [x] Smoke test untuk DigitalLibrary, Quiz, Ending (semua scene di-render, 0 error console).
- [ ] Unit test untuk DialogBox flow (kompleks; perlu Phaser mock).
- [ ] Polish lebih lanjut: animasi langkah pemain, transisi scene, kontrol touch untuk mobile.
- [ ] Audio: tombol mute/unmute di TitleScene.

## Catatan Smoke Test
- File smoke: `scripts-smoke.mjs` (Playwright, spawn `vite preview` lalu navigasi + screenshot).
- Output smoke test: `CANVAS 960x540`, `ERRORS []`. 
- Screenshot tersimpan di `/tmp/title.png`, `/tmp/char-select.png`, `/tmp/classroom.png`.
- Sprite pemain sengaja 1 frame (hadap depan) + `setFlipX(true)` untuk hadap kanan, untuk hemat kanvas. Flip untuk hadap kiri/kanan; belum ada frame "up" (animasi sederhana).
- Tileset addCanvas; lantai (frame 0), dinding (frame 1), pintu (frame 2), decor (frame 3).

## 8. Konvensi Kode
- File scene: PascalCase + suffix `Scene.ts`.
- File sistem: PascalCase tanpa suffix.
- Konten data: pisah dari logika, simpan di `src/data/`.
- Hindari `any`; gunakan `unknown` + narrowing.
- Public API di-`export`, helper internal tidak.
- Selalu perbarui `HANDOVER.md` & `README.md` saat milestone.

## 9. Catatan Penting untuk Chat Baru
1. **Skill "superpowers"** TIDAK tersedia di environment Codex ini. Yang tersedia: `imagegen`, `openai-docs`, `plugin-creator`, `skill-creator`, `skill-installer`, `browser:control-in-app-browser`, `documents`, `pdf`, `presentations`, `spreadsheets`. Workflow yang dipakai = praktik engineering umum (komit kecil, typecheck lulus, test).
2. **Aset 100% prosedural** — untuk ganti ke pixel art asli nanti, modifikasi `SpriteFactory.ts` saja; tidak ada path gambar yang tersebar di kode.
3. **Konten materi orisinal** — semua teks materi & dialog ditulis dari pengetahuan umum tentang perpustakaan. Tidak menyalin teks dari `referencecollector.web.id` (hanya struktur/inspirasi).
4. **Lisensi**: default MIT (lihat `LICENSE` saat dibuat). Konten edukasi bebas digunakan untuk pengajaran.

## 10. Cara Lanjut Cepat (di chat baru)
```bash
cd pengenalan-perpus
npm install
npm run dev        # buka http://localhost:5173
npm run typecheck  # cek TypeScript
npm run test       # jalankan unit test
npm run build      # produksi ke dist/
```
