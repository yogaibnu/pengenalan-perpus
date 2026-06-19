import { WorldScene } from "../systems/WorldScene";
import type { TileMapData } from "../types";
import { DIALOGS } from "../data/dialogs";
import { MATERIALS } from "../data/materials";
import { ProgressHud } from "../systems/ProgressHud";
import { audio } from "../systems/Audio";

export class LibraryScene extends WorldScene {
  constructor() {
    super("Library");
  }

  protected getTheme(): "school" | "library" | "digital" {
    return "library";
  }

  protected onAfterCreate(): void {
    audio.startBgm("explore");
    new ProgressHud(this, 5);
    this.add.text(16, 16, "Perpustakaan Sekolah — dekati 5 buku referensi.", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#fde68a",
      backgroundColor: "#0f172a",
      padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(1000);
  }

  protected buildMap(): TileMapData {
    const cols = 19;
    const rows = 16;
    const tiles: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        if (y === 0 || y === rows - 1) row.push(1);
        else if (x === 0 || x === cols - 1) row.push(1);
        // rak buku di sisi kiri & kanan
        else if ((x === 2 || x === cols - 3) && y >= 2 && y <= 13) row.push(3);
        // meja baca di tengah
        else if (y === 8 && x >= 7 && x <= 11) row.push(3);
        else row.push(0);
      }
      tiles.push(row);
    }
    // pintu di bawah
    tiles[rows - 1]![Math.floor(cols / 2)] = 2;

    return {
      id: "library",
      name: "Perpustakaan Sekolah",
      tileSize: 32,
      cols,
      rows,
      tiles,
      spawn: { x: Math.floor(cols / 2), y: rows - 3 },
      events: [
        { id: "lib-kepala", x: 16, y: 2, kind: "dialog", label: "Kepala", trigger: "interact", data: DIALOGS["lib-kepala"] },
        { id: "lib-pustakawan", x: 2, y: 14, kind: "dialog", label: "Pustakawan", trigger: "interact", data: DIALOGS["lib-pustakawan"] },
        { id: "lib-siswa", x: 9, y: 9, kind: "dialog", label: "Siswa", trigger: "interact", data: DIALOGS["lib-siswa"] },
        { id: "lib-kamus", x: 2, y: 4, kind: "material", label: "Kamus", trigger: "interact", data: MATERIALS["lib-kamus"] },
        { id: "lib-ensiklopedi", x: 2, y: 6, kind: "material", label: "Ensiklopedia", trigger: "interact", data: MATERIALS["lib-ensiklopedi"] },
        { id: "lib-biografi", x: 2, y: 8, kind: "material", label: "Biografi", trigger: "interact", data: MATERIALS["lib-biografi"] },
        { id: "lib-geografi", x: cols - 3, y: 4, kind: "material", label: "Geografi", trigger: "interact", data: MATERIALS["lib-geografi"] },
        { id: "lib-pedoman", x: cols - 3, y: 6, kind: "material", label: "Pedoman", trigger: "interact", data: MATERIALS["lib-pedoman"] },
        { id: "lib-quiz", x: Math.floor(cols / 2), y: 14, kind: "quiz", label: "Kuis", trigger: "interact" },
        { id: "lib-digital", x: Math.floor(cols / 2), y: 1, kind: "info", label: "Pintu Digital", trigger: "interact", data: { text: "Pintu menuju Perpustakaan Digital. Tekan Spasi saat berdiri di tile bercahaya kuning." } },
      ],
      exits: [
        { x: Math.floor(cols / 2), y: rows - 1, toScene: "Classroom", message: "Kembali ke kelas..." },
        { x: Math.floor(cols / 2), y: 0, toScene: "DigitalLibrary" },
      ],
    };
  }
}
