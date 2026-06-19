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

## 7. Status Saat Ini (Update Terakhir — v0.2.1)
**HOTFIX: bug movement vertikal & dialog stuck.**

- [x] Cache key objects di `create()` sekali (tidak boleh `addKey()` di `update()`/`handleDialogInput()`/`handleInteractInput()`).
- [x] Hapus animasi langkah via tween yang override `player.y` (mengganggu collision detection).
- [x] Regression test: 3 test untuk pola input key.

**Game LIVE di**: https://yogaibnu.github.io/pengenalan-perpus/ (auto-deploy via GitHub Actions)
**Game LIVE di**: https://yogaibnu.github.io/pengenalan-perpus/ (auto-deploy via GitHub Actions)

- [x] Konfigurasi project (Vite + TS + Vitest).
- [x] Sistem save (`save.ts`).
- [x] `DialogBox` UI + skip (Shift+Enter).
- [x] `SpriteFactory` prosedural (front/back sprite + 3 tema tileset).
- [x] `WorldScene` base: collision, event, exit, material panel, pause menu, transisi fade, highlight event, touch D-pad, animasi langkah.
- [x] Konten data orisinal: 5 buku referensi + 4 konsep perpustakaan digital + 5 soal kuis + 5 item mini-game.
- [x] Scene konkret: Boot, Title (mute), CharacterSelect, Classroom (tutorial popup), Library (5 buku + 4 NPC), DigitalLibrary (4 konsep + 4 NPC), Quiz, MatchGame (mini-game), Ending.
- [x] Audio BGM 3 channel + SFX (WebAudio API sintesis).
- [x] Progress HUD.
- [x] Unit test: 6/6 (save + audio).
- [x] Build & smoke test lokal: 0 error console.
- [x] Live deployment ke GitHub Pages (auto-deploy).
- [x] NPC tambahan: Siswa Teladan, Pustakawan Sirkulasi, Pembaca Aktif, Admin Sistem, Peneliti.

## 7a. Status v0.1 (sebelumnya)
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
- [x] Sprite 2-arah (front/back)
- [x] Tile school kontras
- [x] Highlight event terdekat (pulse ring)
- [x] Pause menu (Esc)
- [x] Progress bar HUD
- [x] Audio BGM 3 channel + SFX (WebAudio sintesis)
- [x] Tutorial popup interaktif
- [x] Audio test (3 test, 6/6 total)
- [x] Smoke test semua scene (0 error)
- [x] Touch D-pad mobile
- [x] Transisi fade
- [x] Animasi langkah
- [x] Tombol mute
- [x] **Mini-game Mencocokkan Buku** (MatchGameScene): 5 deskripsi → 5 kategori
  - Lencana baru: "Ahli Referensi" (5/5), "Penjelajah Buku" (≥3/5)
  - Trigger dari tile ungu di LibraryScene
- [x] **Dialog skip** (Shift+Enter)
- [x] **NPC tambahan** (4 NPC baru dengan dialog orisinal): Siswa Teladan, Pustakawan Sirkulasi, Pembaca Aktif, Admin Sistem, Peneliti
- [x] **GitHub Pages workflow** auto-deploy saat push ke main
- [x] **Vite base** dinamis: GITHUB_PAGES=true → /pengenalan-perpus/, default → ./
- [x] **window.__game** hook untuk automated testing
- [ ] Unit test untuk DialogBox flow (kompleks; perlu Phaser mock).
- [ ] Polish: animasi langkah lebih halus, transisi scene dengan directional hint.

## 7c. Commit Riwayat (ringkas)
- `b6dcf39` feat: initial scaffold
- `74cd833` chore: gitignore tsbuildinfo
- `fe09e7f` docs: update handover
- `3accc22` feat: sprite 2-arah + tile school kontras
- `7dcd0df` feat: audio, pause menu, progress HUD, tutorial, highlight
- `94ef9ef` feat: touch D-pad, transisi fade, animasi langkah, mute toggle
- `07485da` docs: finalisasi README & HANDOVER
- (current) feat: mini-game MatchGame, dialog skip, NPC tambahan, GitHub Pages workflow

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
