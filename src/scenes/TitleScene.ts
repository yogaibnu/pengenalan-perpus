import Phaser from "phaser";
import { audio } from "../systems/Audio";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // background gradien
    const g = this.add.graphics();
    g.fillGradientStyle(0x0f172a, 0x0f172a, 0x1e3a8a, 0x1e3a8a, 1);
    g.fillRect(0, 0, w, h);

    // dekorasi rak buku abstrak
    for (let i = 0; i < 8; i++) {
      const bw = Phaser.Math.Between(10, 22);
      const bh = Phaser.Math.Between(60, 120);
      const bx = Phaser.Math.Between(20, w - 30);
      const by = Phaser.Math.Between(40, h - 200);
      g.fillStyle(Phaser.Math.RND.pick([0xdc2626, 0x2563eb, 0x16a34a, 0xeab308, 0x7c3aed, 0xf97316]), 1);
      g.fillRect(bx, by, bw, bh);
    }

    this.add.text(w / 2, 100, "Pengenalan Perpustakaan", {
      fontFamily: "monospace",
      fontSize: "36px",
      color: "#fde68a",
      stroke: "#0f172a",
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(w / 2, 150, "Eksplorasi Perpustakaan Sekolah & Digital", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#cbd5e1",
    }).setOrigin(0.5);

    audio.startBgm("title");
    const startBtn = this.add.text(w / 2, 320, "[ Mulai ]", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#0f172a",
      backgroundColor: "#fde68a",
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const continueBtn = this.add.text(w / 2, 380, "[ Lanjutkan ]", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#0f172a",
      backgroundColor: "#a7f3d0",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const creditBtn = this.add.text(w / 2, 440, "[ Kredit ]", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#cbd5e1",
      backgroundColor: "#1e293b",
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on("pointerdown", () => this.scene.start("CharacterSelect"));
    continueBtn.on("pointerdown", () => this.continueGame());
    creditBtn.on("pointerdown", () => this.scene.start("Ending"));

    // Tombol mute
    const muteBtn = this.add.text(w - 60, 36, "🔊", {
      fontFamily: "monospace",
      fontSize: "20px",
      backgroundColor: "#1e293b",
      padding: { x: 8, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const refreshMute = () => {
      const muted = (audio as unknown as { muted: boolean }).muted;
      muteBtn.setText(muted ? "🔇" : "🔊");
      muteBtn.setBackgroundColor(muted ? "#7f1d1d" : "#1e293b");
    };
    muteBtn.on("pointerdown", () => {
      const cur = (audio as unknown as { muted: boolean }).muted;
      audio.setMuted(!cur);
      refreshMute();
    });
    refreshMute();

    this.input.keyboard!.on("keydown-ENTER", () => this.scene.start("CharacterSelect"));
    // shortcut untuk testing/demo
    this.input.keyboard!.on("keydown-G", () => this.scene.start("MatchGame"));
    this.input.keyboard!.on("keydown-K", () => this.scene.start("Quiz", { from: "Title" }));
  }

  private continueGame() {
    // Lanjutkan: jika gender sudah dipilih, langsung ke scene terakhir yang dikunjungi.
    const state = (() => { try { return JSON.parse(localStorage.getItem("pengenalan-perpus:save:v1") || "{}"); } catch { return {}; } })();
    const last = ["Classroom", "Library", "DigitalLibrary", "Quiz"] as const;
    if (state.visited && Array.isArray(state.visited)) {
      for (let i = last.length - 1; i >= 0; i--) {
        if (state.visited.includes(last[i])) {
          this.scene.start(last[i]);
          return;
        }
      }
    }
    this.scene.start("CharacterSelect");
  }
}
