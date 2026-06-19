// Dialog orisinal untuk setiap NPC/event. Tone: sopan, edukatif, sesuai konteks.

import type { DialogData } from "../types";

export const DIALOGS: Record<string, DialogData> = {
  // ---- Ruang Kelas ----
  "class-guru": {
    speaker: "Bapak Guru",
    lines: [
      "Selamat pagi, anak-anak. Hari ini saya akan memberi tugas kelompok.",
      "Carilah informasi dari 5 jenis buku referensi di perpustakaan sekolah. Catat judul buku dan informasi pentingnya.",
      "Jangan cari jawaban di internet ya. Silakan langsung ke perpustakaan setelah bel istirahat. Semoga berhasil!",
    ],
    onFinish: "task_given",
  },
  "class-teman": {
    speaker: "Teman Sekelas",
    lines: [
      "Wah, tugasnya menarik. Ayo kita ke perpustakaan bareng-bareng!",
    ],
  },

  // ---- Perpustakaan Sekolah ----
  "lib-kepala": {
    speaker: "Kepala Perpustakaan",
    lines: [
      "Selamat datang di perpustakaan sekolah. Biasakan membaca 15 menit setiap hari — kecil tapi berdampak besar.",
      "Jika bingung mencari buku, langsung bertanya ke pustakawan ya. Mereka siap membantu.",
    ],
  },
  "lib-pustakawan": {
    speaker: "Pustakawan",
    lines: [
      "Halo! Ada yang bisa dibantu?",
      "Buku referensi seperti kamus, ensiklopedia, dan atlas diletakkan di rak khusus. Yuk, kita lihat bersama!",
    ],
  },
  "lib-siswa": {
    speaker: "Siswa",
    lines: [
      "Tempatnya tenang dan nyaman, cocok buat belajar. Yuk, duduk di meja baca!",
    ],
  },

  // ---- Perpustakaan Digital ----
  "dig-panduan": {
    speaker: "Panduan Digital",
    lines: [
      "Perpustakaan digital adalah versi modern dari perpustakaan tradisional. Koleksinya bisa diakses kapan saja lewat internet.",
      "Berikut empat hal yang akan kamu pelajari di area ini: E-Book, OPAC, Database, dan Repositori.",
    ],
    onFinish: "dig_intro",
  },
  "dig-siswa": {
    speaker: "Siswa",
    lines: [
      "Wah, ternyata banyak cara mencari bahan bacaan sekarang. Tidak harus ke perpustakaan fisik, ya!",
    ],
  },
};
