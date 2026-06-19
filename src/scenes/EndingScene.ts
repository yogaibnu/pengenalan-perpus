import Phaser from "phaser";
import { loadState, resetState } from "../systems/save";
import { audio } from "../systems/Audio";

export class EndingScene extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  init(data: { score?: number; total?: number; badge?: string }) {
    // No-op; data akan dipakai di create()
    void data;
  }

  create(data: { score?: number; total?: number; badge?: string }) {
    audio.stopBgm();
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.add.rectangle(0, 0, w, h, 0x0f172a).setOrigin(0);

    const state = loadState();

    this.add.text(w / 2, 60, "🎉 Selamat!", {
      fontFamily: "monospace",
      fontSize: "30px",
      color: "#fde68a",
    }).setOrigin(0.5);

    if (data.score !== undefined) {
      this.add.text(w / 2, 110, `Skor Kuis: ${data.score} / ${data.total}`, {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#cbd5e1",
      }).setOrigin(0.5);
    }
    if (data.badge) {
      this.add.text(w / 2, 140, `Lencana: ${data.badge}`, {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#86efac",
      }).setOrigin(0.5);
    }

    this.add.text(w / 2, 200, "Materi yang sudah dibaca:", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#94a3b8",
    }).setOrigin(0.5);
    const read = state.materialsRead.length === 0 ? "(belum ada)" : state.materialsRead.join(", ");
    this.add.text(w / 2, 230, read, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#cbd5e1",
      wordWrap: { width: w - 100 },
      align: "center",
    }).setOrigin(0.5);

    this.add.text(w / 2, 320, "— Kredit —", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#fde68a",
    }).setOrigin(0.5);
    this.add.text(w / 2, 350, "Game: Pengenalan Perpustakaan\nDibangun dengan Phaser 3 + Vite + TypeScript\nKonten orisinal untuk pengajaran", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#cbd5e1",
      align: "center",
    }).setOrigin(0.5);

    const restart = this.add.text(w / 2, h - 90, "[ Main Lagi dari Awal ]", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#0f172a",
      backgroundColor: "#fde68a",
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => {
      resetState();
      this.scene.start("Boot");
    });

    const back = this.add.text(w / 2, h - 50, "[ Kembali ke Judul ]", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#cbd5e1",
      backgroundColor: "#1e293b",
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start("Title"));
  }
}
