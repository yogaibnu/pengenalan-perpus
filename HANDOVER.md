# Handover Context — Pengenalan Perpustakaan

> **File ini adalah sumber kebenaran tunggal untuk melanjutkan pekerjaan di chat baru.**
> Baca file ini **dulu** sebelum mulai. Update di akhir setiap sesi.

---

## TL;DR

Game web edukatif 2D bergaya RPG klasik bertema "Pengenalan Perpustakaan" (sekolah + digital).
Stack: **Phaser 3 + Vite + TypeScript**. Aset 100% prosedural (sprite/tile di-generate via Canvas2D saat runtime).

- **Live**: https://yogaibnu.github.io/pengenalan-perpus/
- **Repo**: https://github.com/yogaibnu/pengenalan-perpus (public, branch `main`)
- **Status**: v0.2.1 — game playable, 9/9 unit test passing, auto-deploy aktif.
- **Total**: 12 commit, ~3500 baris TypeScript.

---

## 1. Tujuan Proyek

Membangun ulang game edukatif dari `referencecollector.web.id` (RPG Maker MV) dengan stack web modern. Game memperkenalkan perpustakaan sekolah & digital kepada pelajar dan umum melalui eksplorasi RPG + kuis + mini-game.

**Yang sudah dicapai**: gameplay loop lengkap (title → pilih karakter → kelas → perpustakaan sekolah → perpustakaan digital → mini-game → kuis → ending), dengan audio, save state, pause menu, transisi fade, dan kontrol mobile.

---

## 2. Quick Start (untuk chat baru)

```bash
cd pengenalan-perpus
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # TypeScript
npm run test         # Vitest (9 tests)
npm run build        # production ke dist/
npm run preview      # serve dist/ lokal
```

**Verifikasi cepat bahwa game bekerja**: buka `http://localhost:5173`, klik Mulai, pilih karakter, tekan Spasi untuk bicara dengan Bapak Guru, tekan ArrowDown berulang untuk ke pintu perpustakaan.

---

## 3. Stack & Keputusan Arsitektur

| Aspek | Pilihan | Alasan |
|---|---|---|
| Renderer | Phaser 3.90 | Pipeline PIXI mature, ekosistem besar untuk game 2D |
| Build | Vite 5 | Dev server cepat, HMR, build optimal |
| Bahasa | TypeScript 5 (strict) | Type safety untuk game state yang kompleks |
| Test | Vitest + jsdom | Unit test cepat, jsdom untuk localStorage shim |
| Aset | **100% prosedural** (Canvas2D di `SpriteFactory.ts`) | Tidak ada file gambar eksternal — repo kecil, modifikasi mudah |
| Save | `localStorage` key `pengenalan-perpus:save:v1` | Offline-first, tanpa server |
| Audio | WebAudio API (sintesis) | Tidak ada file audio eksternal |
| Deploy | GitHub Pages via GitHub Actions | Gratis, otomatis tiap push ke `main` |

**Base path Vite** dinamis: `GITHUB_PAGES=true` saat build → `/pengenalan-perpus/`, default → `./`.

---

## 4. Struktur Direktori

```
pengenalan-perpus/
├── HANDOVER.md                  ← file ini
├── README.md                    ← quick start + fitur
├── LICENSE                      ← MIT
├── package.json
├── package-lock.json
├── tsconfig.json / .app.json / .node.json
├── vite.config.ts               ← base path dinamis
├── vitest.config.ts
├── vitest.setup.ts              ← jsdom localStorage shim
├── index.html
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml           ← auto-deploy ke GitHub Pages
└── src/
    ├── main.ts                  (42)   entry; expose (window as any).__game untuk testing
    ├── types.ts                 (98)   tipe bersama
    ├── data/                          ← konten orisinal (Indonesia)
    │   ├── dialogs.ts          (95)   12 dialog NPC
    │   ├── materials.ts        (81)   9 materi (5 buku ref + 4 digital)
    │   └── quiz.ts             (46)   5 soal kuis
    ├── systems/                      ← engine & utilities
    │   ├── save.ts              (40)   localStorage wrapper + SaveState
    │   ├── DialogBox.ts        (217)   UI dialog ala RPG (typing effect, choices, skip)
    │   ├── SpriteFactory.ts    (242)   generator sprite/tile prosedural
    │   ├── WorldScene.ts       (515)   base scene untuk semua map (terbesar)
    │   ├── Audio.ts            (124)   BGM 3 channel + SFX via WebAudio
    │   ├── ProgressHud.ts       (46)   HUD pojok kanan-atas
    │   ├── save.test.ts         (45)   3 test
    │   ├── Audio.test.ts        (24)   3 test
    │   └── keys.test.ts         (49)   3 regression test untuk input handling
    ├── scenes/                       ← scene konkret
    │   ├── BootScene.ts         (25)
    │   ├── TitleScene.ts       (110)   +mute button, shortcut G/K
    │   ├── CharacterSelectScene (114)
    │   ├── ClassroomScene.ts    (82)   tutorial popup interaktif
    │   ├── LibraryScene.ts      (76)   5 buku + 4 NPC + mini-game tile
    │   ├── DigitalLibraryScene  (70)   4 konsep + 4 NPC
    │   ├── QuizScene.ts        (148)
    │   ├── MatchGameScene.ts   (244)   mini-game mencocokkan buku
    │   └── EndingScene.ts       (91)
    └── assets/                       ← (kosong, placeholder)
```

---

## 5. Alur Game (Scene Graph)

```
Boot
 ↓
Title (Mulai / Lanjutkan / Kredit / 🔇 mute)
 ↓
CharacterSelect (male/female)
 ↓
Classroom (Bapak Guru → task; tutorial popup)
 ↓
Library (5 buku ref + 4 NPC + match game tile + pintu digital)
 ↓ ↓
DigitalLibrary (4 konsep + 4 NPC + kuis)  exit back
 ↓
MatchGame (mini-game) ←────┐
 ↓                          │
Quiz (5 soal) ──────────────┘
 ↓
Ending (skor, lencana, kredit)
```

**Akses cepat via shortcut di TitleScene** (untuk demo):
- `G` → langsung ke MatchGame
- `K` → langsung ke Quiz
- `M` → toggle mute
- `Enter` → mulai dari awal

---

## 6. Mekanik Inti

| Aksi | Kontrol |
|---|---|
| Bergerak | Panah / WASD (4 arah) |
| Interaksi | Spasi / Enter (saat dekat NPC/buku) |
| Pilihan dialog | ↑↓ lalu Spasi |
| Skip semua dialog | Shift+Enter |
| Pause | Esc |
| Mute | 🔊 di TitleScene atau tombol M |
| Di mobile | D-pad on-screen + tombol Aksi (auto-detect) |

**Event di map**:
- `dialog` — NPC bicara
- `material` — buka panel materi fullscreen
- `quiz` — trigger kuis
- `minigame` — trigger mini-game
- `info` — info singkat (sign)
- `exits` (di map.exits) — pindah scene otomatis saat diinjak

**Visual cues**:
- NPC/buku: glyph berwarna + label
- Exit: lingkaran bercahaya kuning
- Event terdekat: pulse ring kuning
- Tile wall: blocker (tidak bisa dilewati)
- Tile door: bisa dilewati, visual pintu

---

## 7. Save State

Disimpan di `localStorage` key `pengenalan-perpus:save:v1` (lihat `src/types.ts → SaveState`):

```ts
interface SaveState {
  gender?: "male" | "female";
  visited: string[];                  // scene yang pernah dikunjungi
  materialsRead: string[];            // id materi yang sudah dibuka
  flags: Record<string, number | boolean>;
  badges: string[];                   // lencana yang diperoleh
}
```

**Lencana yang ada**:
- "Pustakawan Muda" (kuis ≥80%)
- "Penjelajah Buku" (kuis ≥50% atau mini-game ≥3/5)
- "Pemula" (kuis <50%)
- "Ahli Referensi" (mini-game 5/5)

---

## 8. Status Saat Ini (v0.2.1)

✅ **Semua fitur utama berfungsi**, di-deploy & terverifikasi live.

| Fitur | Status |
|---|---|
| 8 scene playable (termasuk MatchGame) | ✅ |
| 5 buku referensi + 4 konsep digital + 5 soal kuis + 5 item mini-game | ✅ |
| Audio BGM 3 channel + SFX (WebAudio sintesis) | ✅ |
| Save state ke localStorage | ✅ |
| Touch D-pad mobile | ✅ |
| Transisi fade in/out scene | ✅ |
| Pause menu (Esc) | ✅ |
| Progress HUD | ✅ |
| Tutorial popup interaktif | ✅ |
| Highlight event terdekat (pulse ring) | ✅ |
| Mute toggle | ✅ |
| Dialog skip (Shift+Enter) | ✅ |
| 11 NPC dengan dialog orisinal | ✅ |
| Auto-deploy ke GitHub Pages | ✅ |
| TypeScript: 0 error | ✅ |
| Unit test: **9/9 passing** | ✅ |
| Live URL: 200, 0 error console | ✅ |

**Verifikasi terakhir di live** (`757c482`):
```
Movement:  y 336 → 247 (ArrowUp, 89px) → 336 (ArrowDown, 89px) ✅
Dialog:    Line 1 → Line 2 → Line 3 → close (3× Space) ✅
ERRORS:    [] ✅
```

---

## 9. Riwayat Commit

| SHA | Pesan |
|---|---|
| `b6dcf39` | feat: initial scaffold |
| `74cd833` | chore: gitignore tsbuildinfo |
| `fe09e7f` | docs: update handover |
| `3accc22` | feat: sprite 2-arah + tile school kontras |
| `7dcd0df` | feat: audio, pause menu, progress HUD, tutorial, highlight |
| `94ef9ef` | feat: touch D-pad, transisi fade, animasi langkah, mute toggle |
| `07485da` | docs: finalisasi README & HANDOVER |
| `9e9e09c` | feat: mini-game MatchGame, dialog skip, NPC, GitHub Pages workflow |
| `286af0b` | docs: add live demo URL |
| `9499af0` | docs: HANDOVER v0.2 |
| `041389f` | **fix: movement vertikal & dialog stuck** (hotfix penting) |
| `757c482` | docs: HANDOVER hotfix verified |

---

## 10. Bug Fix History (PENTING — baca sebelum edit!)

### 🐛 Hotfix 041389f — Movement vertikal & dialog stuck

**Gejala yang dilaporkan user**: player tidak bisa gerak ke atas/bawah; dialog muncul lalu stuck walau pencet tombol apapun.

**Root cause #1 (movement)**:
Tween animasi langkah `tweens.add({ targets: player, y: player.y - 2, yoyo: true, repeat: -1 })` meng-override `player.y` setiap frame. Logic `tryMove()` (collision) set `player.y` baru, tapi tween langsung timpa. Hasil: vertical movement stuck/berbalik.

**Root cause #2 (dialog)**:
`input.keyboard!.addKey(KeyCodes.SPACE)` (dan key lain) dipanggil **di dalam** `handleDialogInput()` yang dieksekusi setiap frame. Setiap frame buat key object baru, `Phaser.Input.Keyboard.JustDown` state drift karena banyak key object untuk KeyCode yang sama.

**Fix**:
1. Hapus tween animasi langkah (collision sudah cukup feedback).
2. Cache semua key object **sekali** di `create()`, simpan di field `this.keys`.
3. `handleDialogInput()` & `handleInteractInput()` pakai `this.keys.*` (cached).

**Regression test** (`src/systems/keys.test.ts`):
- ❌ Tidak boleh `addKey()` di `update()` / `handleDialogInput()` / `handleInteractInput()`.
- ✅ `create()` harus cache key objects.
- ✅ Field `keys` harus dideklarasikan.

**Pelajaran**: SELALU cache Phaser key objects di `create()`. Jangan `addKey()` di method yang dipanggil setiap frame.

---

## 11. Catatan Penting untuk Chat Baru

### Environment Codex
- **Skill "superpowers" TIDAK tersedia** di environment Codex ini. Yang tersedia: `imagegen`, `openai-docs`, `plugin-creator`, `skill-creator`, `skill-installer`, `browser:control-in-app-browser`, `documents`, `pdf`, `presentations`, `spreadsheets`.
- Workflow yang dipakai = praktik engineering umum: typecheck lulus, test passing, commit kecil, HANDOVER update.
- Untuk testing otomatis: `window.__game` di-expose di `main.ts` (lihat cara pakai di bawah).

### Konten & Lisensi
- **Konten 100% orisinal** (Bahasa Indonesia) — semua teks materi & dialog ditulis dari pengetahuan umum. Tidak menyalin dari `referencecollector.web.id` (hanya inspirasi struktur).
- **Lisensi kode**: MIT (lihat `LICENSE`).
- **Lisensi konten edukasi**: bebas untuk pengajaran.

### Aset Prosedural
Untuk ganti sprite/tile ke pixel art asli nanti, **cukup edit `SpriteFactory.ts`**. Tidak ada path gambar yang tersebar di kode. API yang dipakai:
- `generateCharacterSprite(scene, gender, palette)` → key `char-{gender}-front` & `char-{gender}-back`
- `generateTileset(scene, theme)` → key `tiles-{theme}` (frame 0=floor, 1=wall, 2=door, 3=decor)

### Cara Test Otomatis (Playwright)
```js
// Akses Phaser game dari console
const g = window["__game"];
g.scene.start("MatchGame");   // navigasi langsung
const s = g.scene.getScene("Classroom");
s.player.x; s.player.y;       // inspeksi state
s.dialog.show({ lines: ["Hi"] });  // test dialog
```

### Build & Deploy
- **Auto-deploy** aktif: push ke `main` → GitHub Actions build & deploy ke `https://yogaibnu.github.io/pengenalan-perpus/`. Lihat `.github/workflows/deploy.yml`.
- **Pages settings** sudah di-enable (build_type: workflow).
- Lokal: `npm run build` lalu `npm run preview` untuk serve `dist/`.

---

## 12. Roadmap / Ide Lanjutan (belum selesai)

Prioritas rendah karena game sudah playable. Pilih sesuai minat:

- [ ] **PWA + offline mode** — service worker agar jalan tanpa internet.
- [ ] **i18n (English)** — struktur untuk menambah bahasa Inggris.
- [ ] **Save cloud** — sync save state ke GitHub Gist (perlu auth).
- [ ] **Achievement system** — lebih banyak lencana dengan syarat kompleks.
- [ ] **Mobile UI improvements** — bottom-sheet controls, swipe gestures.
- [ ] **TTS untuk materi** — Web Speech API untuk bacakan materi buku.
- [ ] **Unit test untuk DialogBox flow** — saat ini di-skip karena integrasi Phaser kompleks.
- [ ] **Map lebih besar & dekoratif** — saat ini map masih 19×13–19×16 tile.
- [ ] **More audio** — BGM per-area (perpustakaan digital beda nada).
- [ ] **Pixel art real** — ganti sprite prosedural dengan sprite sungguhan.

---

## 13. Konvensi Kode

- File scene: `PascalCase` + suffix `Scene.ts` (mis. `LibraryScene.ts`).
- File sistem: `PascalCase` tanpa suffix (mis. `WorldScene.ts`).
- Konten data: pisah dari logika di `src/data/`.
- Hindari `any`; gunakan `unknown` + narrowing.
- Public API di-`export`, helper internal tidak.
- Selalu perbarui `HANDOVER.md` & `README.md` saat milestone.
- **WAJIB**: cache Phaser key objects di `create()`. Jangan `addKey()` di `update()`.
- **WAJIB**: jalankan `npm run typecheck && npm run test && npm run build` sebelum commit.

---

## 14. Konten Kustomisasi Cepat

Untuk ganti/extend konten tanpa sentuh logika:

| Ingin tambah | Edit file |
|---|---|
| Dialog NPC | `src/data/dialogs.ts` |
| Materi buku | `src/data/materials.ts` |
| Soal kuis | `src/data/quiz.ts` |
| Item mini-game | `src/scenes/MatchGameScene.ts` (konstanta `ITEMS` & `CATEGORIES`) |
| Sprite/tile | `src/systems/SpriteFactory.ts` |
| Audio pattern | `src/systems/Audio.ts` (konstanta `PATTERNS`) |
| Map | method `buildMap()` di scene konkret |

---

## 15. Ringkasan Eksekutif untuk Chat Baru

**Apa**: Game RPG 2D edukatif tentang perpustakaan.
**Dimana**: Live di `yogaibnu.github.io/pengenalan-perpus`, repo `yogaibnu/pengenalan-perpus` di GitHub.
**Stack**: Phaser 3 + Vite + TypeScript + Vitest.
**Aset**: Prosedural (Canvas2D), no external files.
**Status**: v0.2.1, playable, 9/9 tests, auto-deploy aktif.
**Hotfix terbaru**: cache key objects di `create()` — JANGAN `addKey()` per frame.

Untuk lanjut: baca file ini → cek `git log` → jalankan `npm install && npm run dev` → buka localhost:5173 → main di `src/scenes/` & `src/systems/`.

