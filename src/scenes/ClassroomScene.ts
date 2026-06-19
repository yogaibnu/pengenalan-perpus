import { WorldScene } from "../systems/WorldScene";
import type { TileMapData } from "../types";
import { DIALOGS } from "../data/dialogs";
import { audio } from "../systems/Audio";

export class ClassroomScene extends WorldScene {
  constructor() {
    super("Classroom");
  }

  protected getTheme(): "school" | "library" | "digital" {
    return "school";
  }

  protected onAfterCreate(): void {
    audio.startBgm("explore");
    this.showTutorial();
  }

  private showTutorial(): void {
    const tut = this.add.container(this.cameras.main.width / 2, 80).setScrollFactor(0).setDepth(1500);
    const tutBg = this.add.rectangle(0, 0, 560, 80, 0x0f172a, 0.9).setStrokeStyle(2, 0xfbbf24);
    tut.add(tutBg);
    const tutText = this.add.text(
      0, 0,
      "Tutorial\nGerak: Panah / WASD   ·   Bicara: Spasi (dekat NPC/buku)",
      { fontFamily: "monospace", fontSize: "13px", color: "#fde68a", align: "center" }
    ).setOrigin(0.5);
    tut.add(tutText);
    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      this.tweens.add({ targets: tut, alpha: 0, y: 50, duration: 300, onComplete: () => tut.destroy() });
    };
    const checkMove = () => {
      const k = this.input.keyboard!;
      if (k.addKey("UP").isDown || k.addKey("DOWN").isDown || k.addKey("LEFT").isDown || k.addKey("RIGHT").isDown
        || k.addKey("W").isDown || k.addKey("A").isDown || k.addKey("S").isDown || k.addKey("D").isDown) {
        dismiss();
      }
    };
    this.time.addEvent({ delay: 100, callback: checkMove, callbackScope: this, loop: true });
    this.time.delayedCall(8000, dismiss);
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
        else if (y === 7 && x >= 6 && x <= 12) row.push(3);
        else row.push(0);
      }
      tiles.push(row);
    }
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
        { id: "ev-pintar", x: 7, y: 9, kind: "dialog", label: "Siswa Teladan", trigger: "interact", data: DIALOGS["class-pintar"] },
        { id: "ev-papan", x: 9, y: 3, kind: "info", label: "Papan Tulis", trigger: "interact", data: { text: "Papan tulis berisi jadwal pelajaran hari ini." } },
      ],
      exits: [
        { x: Math.floor(cols / 2), y: rows - 1, toScene: "Library", message: "Menuju perpustakaan..." },
      ],
    };
  }
}
