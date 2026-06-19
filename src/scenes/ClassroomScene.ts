import { WorldScene } from "../systems/WorldScene";
import type { TileMapData } from "../types";
import { DIALOGS } from "../data/dialogs";

export class ClassroomScene extends WorldScene {
  constructor() {
    super("Classroom");
  }

  protected getTheme(): "school" | "library" | "digital" {
    return "school";
  }

  protected onAfterCreate(): void {
    // info: arahkan pemain ke pintu keluar
    if (this.scene.isActive()) {
      this.time.delayedCall(800, () => {
        this.add.text(16, 16, "Ruang Kelas — bicara dengan Bapak Guru, lalu ke pintu.", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#fde68a",
          backgroundColor: "#0f172a",
          padding: { x: 6, y: 4 },
        }).setScrollFactor(0).setDepth(1000);
      });
    }
  }

  protected buildMap(): TileMapData {
    const cols = 19;
    const rows = 13;
    const tiles: number[][] = [];
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // dinding luar (atas/bawah), meja di tengah
        if (y === 0 || y === rows - 1) row.push(1);
        else if (x === 0 || x === cols - 1) row.push(1);
        else if (y === 7 && x >= 6 && x <= 12) row.push(3); // deretan meja
        else row.push(0);
      }
      tiles.push(row);
    }
    // pintu di tengah-bawah
    tiles[rows - 1]![Math.floor(cols / 2)] = 2;

    return {
      id: "classroom",
      name: "Ruang Kelas",
      tileSize: 32,
      cols,
      rows,
      tiles,
      spawn: { x: Math.floor(cols / 2), y: rows - 3 },
      events: [
        { id: "ev-guru", x: 15, y: 5, kind: "dialog", label: "Bapak Guru", trigger: "interact", data: DIALOGS["class-guru"] },
        { id: "ev-teman", x: 4, y: 9, kind: "dialog", label: "Teman", trigger: "interact", data: DIALOGS["class-teman"] },
        { id: "ev-papan", x: 9, y: 3, kind: "info", label: "Papan Tulis", trigger: "interact", data: { text: "Papan tulis berisi jadwal pelajaran hari ini." } },
      ],
      exits: [
        { x: Math.floor(cols / 2), y: rows - 1, toScene: "Library", message: "Menuju perpustakaan..." },
      ],
    };
  }
}
