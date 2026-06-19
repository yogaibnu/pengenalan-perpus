import { WorldScene } from "../systems/WorldScene";
import type { TileMapData } from "../types";
import { DIALOGS } from "../data/dialogs";
import { MATERIALS } from "../data/materials";

export class DigitalLibraryScene extends WorldScene {
  constructor() {
    super("DigitalLibrary");
  }

  protected getTheme(): "school" | "library" | "digital" {
    return "digital";
  }

  protected onAfterCreate(): void {
    this.add.text(16, 16, "Perpustakaan Digital — pelajari 4 konsep di sini.", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#fde68a",
      backgroundColor: "#0f172a",
      padding: { x: 6, y: 4 },
    }).setScrollFactor(0).setDepth(1000);
  }

  protected buildMap(): TileMapData {
    const cols = 19;
    const rows = 13;
    const tiles: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        if (y === 0 || y === rows - 1) row.push(1);
        else if (x === 0 || x === cols - 1) row.push(1);
        // monitor / komputer di 4 sudut tengah
        else if ((y === 4 || y === 8) && (x === 5 || x === 13)) row.push(3);
        else row.push(0);
      }
      tiles.push(row);
    }
    tiles[rows - 1]![Math.floor(cols / 2)] = 2;

    return {
      id: "digital",
      name: "Perpustakaan Digital",
      tileSize: 32,
      cols,
      rows,
      tiles,
      spawn: { x: Math.floor(cols / 2), y: rows - 3 },
      events: [
        { id: "dig-panduan", x: Math.floor(cols / 2), y: 6, kind: "dialog", label: "Panduan", trigger: "interact", data: DIALOGS["dig-panduan"] },
        { id: "dig-siswa", x: 9, y: 11, kind: "dialog", label: "Siswa", trigger: "interact", data: DIALOGS["dig-siswa"] },
        { id: "dig-ebook", x: 5, y: 4, kind: "material", label: "E-Book", trigger: "interact", data: MATERIALS["dig-ebook"] },
        { id: "dig-opac", x: 13, y: 4, kind: "material", label: "OPAC", trigger: "interact", data: MATERIALS["dig-opac"] },
        { id: "dig-database", x: 5, y: 8, kind: "material", label: "Database", trigger: "interact", data: MATERIALS["dig-database"] },
        { id: "dig-repo", x: 13, y: 8, kind: "material", label: "Repositori", trigger: "interact", data: MATERIALS["dig-repo"] },
        { id: "dig-quiz", x: Math.floor(cols / 2), y: 1, kind: "quiz", label: "Kuis", trigger: "interact" },
      ],
      exits: [
        { x: Math.floor(cols / 2), y: rows - 1, toScene: "Library", message: "Kembali ke perpustakaan sekolah..." },
      ],
    };
  }
}
