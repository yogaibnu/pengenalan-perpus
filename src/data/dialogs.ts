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
  "class-pintar": {
    speaker: "Siswa Teladan",
    lines: [
      "Hei, aku biasanya cari buku lewat katalog dulu biar tidak buang waktu. Kamu bisa minta pustakawan mencarikan.",
      "Kalau perlu, pinjam kamus besar di rak referensi ya. Biasanya paling lengkap.",
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
  "lib-pustakawan2": {
    speaker: "Pustakawan (Meja Sirkulasi)",
    lines: [
      "Mau pinjam buku? Bawakan kartu anggota dan isilah form peminjaman.",
      "Maksimal 2 buku selama 1 minggu. Jangan lupa dikembalikan tepat waktu, ya!",
    ],
  },
  "lib-siswa": {
    speaker: "Siswa",
    lines: [
      "Tempatnya tenang dan nyaman, cocok buat belajar. Yuk, duduk di meja baca!",
    ],
  },
  "lib-pembaca": {
    speaker: "Pembaca Aktif",
    lines: [
      "Aku hampir setiap hari ke sini. Favoritku buku fiksi petualangan, tapi ensiklopedia juga asyik lho.",
      "Kalau kamu suka biografi, ada koleksi bagus di rak sebelah kiri.",
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
  "dig-admin": {
    speaker: "Admin Sistem",
    lines: [
      "Sistem katalog daring kami pakai aplikasi SLiMS. Coba ketik kata kunci di kolom pencarian OPAC.",
      "Kalau koneksi lambat, gunakan repositori cache lokal yang sudah kami sediakan.",
    ],
  },
  "dig-peneliti": {
    speaker: "Peneliti",
    lines: [
      "Untuk karya ilmiah, repositori institusi adalah sumber paling tepercaya. Banyak yang bisa diunduh gratis.",
      "Hindari sumber yang tidak jelas penulisnya. Cek dulu kredibilitasnya.",
    ],
  },
};
