import Phaser from "phaser";
import { QUIZ } from "../data/quiz";
import { loadState, saveState } from "../systems/save";
import { audio } from "../systems/Audio";

export class QuizScene extends Phaser.Scene {
  private qIndex = 0;
  private score = 0;
  private selected = 0;
  // private from = "Library"; // reserved for future use
  private optionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super("Quiz");
  }

  init(_data: { from?: string }) {
    this.qIndex = 0;
    this.score = 0;
    this.selected = 0;
    this.optionTexts = [];
  }

  create() {
    const w = this.cameras.main.width;
    this.add.rectangle(0, 0, w, this.cameras.main.height, 0x0f172a).setOrigin(0);

    this.add.text(w / 2, 40, "Kuis Pengetahuan", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#fde68a",
    }).setOrigin(0.5);

    audio.startBgm("quiz");
    this.input.keyboard!.on("keydown-UP", () => this.move(-1));
    this.input.keyboard!.on("keydown-DOWN", () => this.move(1));
    this.input.keyboard!.on("keydown-W", () => this.move(-1));
    this.input.keyboard!.on("keydown-S", () => this.move(1));
    this.input.keyboard!.on("keydown-ENTER", () => this.answer());
    this.input.keyboard!.on("keydown-SPACE", () => this.answer());

    this.renderQuestion();
  }

  private renderQuestion() {
    this.optionTexts.forEach((t) => t.destroy());
    this.optionTexts = [];
    const q = QUIZ[this.qIndex];
    if (!q) return this.finish();

    const w = this.cameras.main.width;

    this.add.text(w / 2, 90, `Soal ${this.qIndex + 1} / ${QUIZ.length}`, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#94a3b8",
    }).setOrigin(0.5);

    this.add.text(60, 130, q.question, {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#e2e8f0",
      wordWrap: { width: w - 120 },
    });

    q.options.forEach((opt, i) => {
      const t = this.add.text(100, 230 + i * 38, `${String.fromCharCode(65 + i)}. ${opt}`, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#cbd5e1",
      });
      t.setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => {
        this.selected = i;
        this.refresh();
        this.time.delayedCall(80, () => this.answer());
      });
      this.optionTexts.push(t);
    });

    this.refresh();
  }

  private refresh() {
    this.optionTexts.forEach((t, i) => {
      t.setColor(i === this.selected ? "#fde68a" : "#cbd5e1");
      t.setBackgroundColor(i === this.selected ? "#1e3a8a" : "transparent");
      t.setPadding(i === this.selected ? { x: 6, y: 4 } : { x: 0, y: 0 });
    });
  }

  private move(delta: number) {
    const q = QUIZ[this.qIndex];
    if (!q) return;
    this.selected = (this.selected + delta + q.options.length) % q.options.length;
    this.refresh();
  }

  private answer() {
    audio.playSfx("interact");
    const q = QUIZ[this.qIndex];
    if (!q) return this.finish();
    const correct = this.selected === q.correctIndex;
    if (correct) { this.score++; audio.playSfx("success"); } else audio.playSfx("fail");

    // tampilkan penjelasan singkat
    this.optionTexts.forEach((t) => t.destroy());
    this.optionTexts = [];
    const w = this.cameras.main.width;
    this.add.text(w / 2, 140, correct ? "✓ Benar!" : "✗ Kurang tepat", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: correct ? "#86efac" : "#fca5a5",
    }).setOrigin(0.5);
    this.add.text(60, 180, q.explanation, {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#e2e8f0",
      wordWrap: { width: w - 120 },
    });
    const next = this.add.text(w / 2, 460, this.qIndex + 1 < QUIZ.length ? "[ Lanjut ]" : "[ Selesai ]", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#0f172a",
      backgroundColor: "#fde68a",
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    next.on("pointerdown", () => {
      this.qIndex++;
      this.renderQuestion();
    });
  }

  private finish() {
    const state = loadState();
    const total = QUIZ.length;
    const ratio = this.score / total;
    let badge: string | null = null;
    if (ratio >= 0.8) badge = "Pustakawan Muda";
    else if (ratio >= 0.5) badge = "Penjelajah Buku";
    else badge = "Pemula";

    if (badge && !state.badges.includes(badge)) state.badges.push(badge);
    saveState(state);

    this.scene.start("Ending", { score: this.score, total, badge });
  }
}
