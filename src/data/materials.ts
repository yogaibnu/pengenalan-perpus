// Materi edukasi orisinal tentang perpustakaan (sekolah & digital).
// Konten ditulis dari pengetahuan umum; bebas untuk pengajaran.

import type { MaterialData } from "../types";

export const MATERIALS: Record<string, MaterialData> = {
  "lib-kamus": {
    title: "Kamus",
    body: [
      "Kamus adalah buku rujukan yang memuat daftar kata suatu bahasa beserta penjelasan singkat tentang makna, pelafalan, ejaan, dan contoh pemakaiannya. Isinya biasanya disusun menurut abjad agar mudah dicari.",
      "Jenis kamus antara lain: (1) Kamus umum, misalnya Kamus Besar Bahasa Indonesia (KBBI); (2) Kamus istilah/khusus, misalnya kamus kedokteran, kamus teknik; (3) Kamus dwibahasa, misalnya Indonesia–Inggris.",
      "Tips: Saat mencari arti kata, perhatikan lema (kata kepala) dan sub-entri. Contoh kalimat pada kamus membantu membedakan makna yangmirip.",
    ],
  },
  "lib-ensiklopedi": {
    title: "Ensiklopedia",
    body: [
      "Ensiklopedia adalah buku rujukan yang memuat uraian singkat namun lengkap tentang berbagai topik pengetahuan, disusun sistematis (abjad atau berdasarkan cabang ilmu).",
      "Berbeda dari kamus, ensiklopedia membahas konsep, peristiwa, tokoh, atau tempat secara lebih luas dan kontekstual.",
      "Contoh ensiklopedia populer: Ensiklopedia Nasional Indonesia, Encyclopedia Britannica, Wikipedia (versi daringnya).",
    ],
  },
  "lib-biografi": {
    title: "Buku Biografi",
    body: [
      "Biografi adalah buku yang menceritakan kisah hidup seseorang — sejak latar belakang keluarga, pendidikan, karier, hingga kontribusi yang dikenangnya.",
      "Berdasarkan penulisnya, biografi dibedakan menjadi: (1) Autobiografi (ditulis sendiri); (2) Biografi (ditulis orang lain).",
      "Biografi bermanfaat untuk mengenal tokoh, belajar dari pengalaman orang lain, dan menemukan inspirasi.",
    ],
  },
  "lib-geografi": {
    title: "Sumber Geografi",
    body: [
      "Sumber geografi adalah bahan rujukan yang memuat informasi tentang permukaan bumi, iklim, penduduk, flora, fauna, dan bentang alam suatu wilayah.",
      "Bentuk sumber geografi antara lain: (1) Peta (gambar permukaan bumi dengan skala dan simbol); (2) Atlas (kumpulan peta dalam satu buku); (3) Globe (tiruan bola bumi); (4) Citra satelit/foto udara.",
      "Saat membaca peta, perhatikan judul, skala, legenda, orientasi arah, dan tahun pembuatannya agar informasinya relevan.",
    ],
  },
  "lib-pedoman": {
    title: "Buku Pedoman (Handbook)",
    body: [
      "Buku pedoman adalah buku petunjuk yang memberikan panduan langkah demi langkah untuk melakukan suatu kegiatan atau memahami suatu prosedur.",
      "Contoh: Pedoman Penulisan Karya Ilmiah, Buku Panduan Praktikum Laboratorium, Pedoman Penggunaan Aplikasi.",
      "Ciri utamanya: bahasa singkat, jelas, sering menggunakan daftar, diagram alir, dan contoh penerapan.",
    ],
  },

  // ---- Perpustakaan digital ----
  "dig-ebook": {
    title: "E-Book",
    body: [
      "E-book (electronic book) adalah versi digital dari buku cetak yang dapat dibaca di perangkat seperti komputer, tablet, atau ponsel. Formatnya beragam: PDF, EPUB, MOBI.",
      "Keunggulan e-book: mudah diunduh, portabel (ribuan buku dalam satu perangkat),常有 fitur pencarian teks, dan sering lebih murah dari buku fisik.",
      "Untuk meminjam e-book di perpustakaan sekolah, gunakan aplikasi resmi seperti iPusnas, Gramedia Digital, atau platform lokal yang disediakan pustakawan.",
    ],
  },
  "dig-opac": {
    title: "OPAC (Online Public Access Catalog)",
    body: [
      "OPAC adalah katalog daring yang digunakan untuk mencari koleksi perpustakaan dari komputer. Fungsinya mirip lemari katalog kartu, tetapi lebih cepat dan lengkap.",
      "Lewat OPAC, Anda bisa mencari berdasarkan judul, pengarang, subjek, atau ISBN. Hasil pencarian menunjukkan lokasi rak dan status ketersediaan (tersedia/dipinjam).",
      "Biasanya OPAC diakses melalui situs web perpustakaan atau aplikasi móvel. Tanyakan kepada pustakawan jika Anda kesulitan menemukan judul tertentu.",
    ],
  },
  "dig-database": {
    title: "Database Perpustakaan",
    body: [
      "Database perpustakaan menyimpan metadata setiap koleksi (judul, pengarang, subjek, ISBN, tahun terbit) sehingga koleksi dapat dicari, disortir, dan dilaporkan dengan cepat.",
      "Perpustakaan sekolah modern biasanya menggunakan perangkat lunak manajemen perpustakaan (library management system) seperti SLiMS, Senayan, Koha, atau Inlislite.",
      "Selain katalog, database sering menyimpan data anggota, transaksi peminjaman, dan statistik kunjungan — semuanya membantu pustakawan mengelola layanan.",
    ],
  },
  "dig-repo": {
    title: "Repositori Digital",
    body: [
      "Repositori digital adalah tempat penyimpanan dokumen digital yang dikelola sebuah institusi. Isinya bisa berupa skripsi, laporan penelitian, artikel jurnal, foto sejarah, atau manuskrip.",
      "Repositori berguna sebagai arsip sekaligus sumber belajar terbuka. Banyak repositori dapat diakses publik secara gratis.",
      "Contoh: Repository universitas (ETD), Perpustakaan Nasional Indonesia (iNFO Publik), Perpustakaan Kongres AS (Library of Congress), arXiv (artikel ilmiah).",
    ],
  },
};
