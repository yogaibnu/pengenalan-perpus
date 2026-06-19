// Kuis singkat 5 soal. Konten orisinal, penjabaran singkat.

import type { QuizQuestion } from "../types";

export const QUIZ: QuizQuestion[] = [
  {
    question: "Buku yang memuat daftar kata suatu bahasa secara alfabetis adalah…",
    options: ["Ensiklopedia", "Kamus", "Biografi", "Atlas"],
    correctIndex: 1,
    explanation: "Kamus menyusun entri menurut abjad dan menjelaskan makna kata. Ensiklopedia membahas topik lebih luas, biografi kisah hidup, atlas kumpulan peta.",
  },
  {
    question: "Berikut ini yang BUKAN termasuk sumber geografi adalah…",
    options: ["Peta", "Atlas", "Globe", "Autobiografi"],
    correctIndex: 3,
    explanation: "Autobiografi adalah kisah hidup seseorang. Peta, atlas, dan globe menggambarkan permukaan bumi sehingga termasuk sumber geografi.",
  },
  {
    question: "Fungsi utama OPAC di perpustakaan adalah…",
    options: [
      "Mencetak buku baru",
      "Mencari koleksi perpustakaan secara daring",
      "Menyimpan buku dari hujan",
      "Menggantikan peran pustakawan",
    ],
    correctIndex: 1,
    explanation: "OPAC (Online Public Access Catalog) adalah katalog daring untuk mencari koleksi perpustakaan. Pustakawan tetap dibutuhkan untuk membimbing pengguna.",
  },
  {
    question: "Format file yang umum digunakan untuk e-book adalah…",
    options: ["PDF / EPUB", "MP3 / WAV", "MP4 / MKV", "EXE / DLL"],
    correctIndex: 0,
    explanation: "PDF dan EPUB adalah format populer untuk e-book. MP3/WAV adalah audio, MP4/MKV adalah video, EXE/DLL adalah program komputer.",
  },
  {
    question: "Repositori digital biasanya digunakan untuk menyimpan…",
    options: [
      "Hanya foto liburan pribadi",
      "Dokumen institusional seperti skripsi dan laporan penelitian",
      "Aplikasi permainan",
      "File sistem operasi",
    ],
    correctIndex: 1,
    explanation: "Repositori digital menyimpan dokumen bernilai institusional (skripsi, artikel, laporan) agar bisa diakses publik dan terjaga kelestariannya.",
  },
];
