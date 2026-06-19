import Phaser from "phaser";
import type { DialogData, DialogChoice } from "../types";

/** Kotak dialog sederhana ala RPG Maker. */
export class DialogBox extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private nameText: Phaser.GameObjects.Text | null = null;
  private bodyText: Phaser.GameObjects.Text;
  private continueIndicator: Phaser.GameObjects.Text;
  private currentLines: string[] = [];
  private currentIndex = 0;
  private fullText = "";
  private displayedText = "";
  private typingTimer: Phaser.Time.TimerEvent | null = null;
  private choiceTexts: Phaser.GameObjects.Text[] = [];
  private choiceCursor: Phaser.GameObjects.Text | null = null;
  private selectedChoice = 0;
  private onComplete?: (choiceIndex?: number) => void;
  private isTyping = false;
  private pendingData: DialogData | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    const cam = scene.cameras.main;
    const w = cam.width;
    const h = 160;
    this.y = cam.height - h - 12;

    this.bg = scene.add.rectangle(w / 2, h / 2, w - 24, h, 0x0f172a, 0.92).setStrokeStyle(2, 0x334155);
    this.add(this.bg);

    this.bodyText = scene.add.text(28, 16, "", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#e2e8f0",
      wordWrap: { width: w - 80 },
      lineSpacing: 6,
    });
    this.add(this.bodyText);

    this.continueIndicator = scene.add
      .text(w - 36, h - 28, "▼", { fontFamily: "monospace", fontSize: "16px", color: "#fbbf24" })
      .setVisible(false);
    this.add(this.continueIndicator);

    this.setSize(w, h);
    this.setVisible(false);
    scene.add.existing(this);
  }

  show(data: DialogData, onComplete?: (choiceIndex?: number) => void) {
    this.pendingData = data;
    this.onComplete = onComplete;
    this.currentLines = data.lines.slice();
    this.currentIndex = 0;

    // header nama
    if (this.nameText) this.nameText.destroy();
    if (data.speaker) {
      this.nameText = this.scene.add.text(20, -22, data.speaker, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#fde68a",
        backgroundColor: "#1e293b",
        padding: { x: 8, y: 4 },
      });
      this.add(this.nameText);
    }

    this.setVisible(true);
    this.showLine(this.currentLines[0] ?? "");
  }

  private showLine(line: string) {
    this.clearChoiceUI();
    this.fullText = line;
    this.displayedText = "";
    this.bodyText.setText("");
    this.continueIndicator.setVisible(false);
    this.isTyping = true;

    if (this.typingTimer) this.typingTimer.remove();
    let i = 0;
    this.typingTimer = this.scene.time.addEvent({
      delay: 28,
      callback: () => {
        i++;
        this.displayedText = this.fullText.substring(0, i);
        this.bodyText.setText(this.displayedText);
        if (i >= this.fullText.length) {
          this.isTyping = false;
          this.typingTimer?.remove();
          this.typingTimer = null;
          this.continueIndicator.setVisible(true);
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  private clearChoiceUI() {
    this.choiceTexts.forEach((t) => t.destroy());
    this.choiceTexts = [];
    if (this.choiceCursor) {
      this.choiceCursor.destroy();
      this.choiceCursor = null;
    }
  }

  /** Dipanggil saat pemain menekan tombol "lanjutkan/pilih". */
  advance(): boolean {
    if (!this.visible) return false;
    if (this.isTyping) {
      // selesaikan typing instan
      this.displayedText = this.fullText;
      this.bodyText.setText(this.displayedText);
      this.isTyping = false;
      this.typingTimer?.remove();
      this.typingTimer = null;
      this.continueIndicator.setVisible(true);
      return true;
    }
    // jika ada pilihan
    if (this.choiceTexts.length > 0) {
      return false; // pilihan di-handle oleh input atas/bawah + enter
    }
    this.currentIndex++;
    if (this.currentIndex < this.currentLines.length) {
      this.showLine(this.currentLines[this.currentIndex] ?? "");
      return true;
    }
    // habis baris; cek pilihan
    if (this.pendingData?.choices && this.pendingData.choices.length > 0) {
      this.showChoices(this.pendingData.choices);
      return true;
    }
    this.finish();
    return true;
  }

  moveChoice(delta: number) {
    if (this.choiceTexts.length === 0) return;
    this.selectedChoice = (this.selectedChoice + delta + this.choiceTexts.length) % this.choiceTexts.length;
    this.refreshChoiceCursor();
  }

  confirmChoice(): boolean {
    if (this.choiceTexts.length === 0) return false;
    const choice = this.pendingData?.choices?.[this.selectedChoice];
    this.finish(choice);
    return true;
  }

  private showChoices(choices: DialogChoice[]) {
    this.clearChoiceUI();
    this.selectedChoice = 0;
    this.continueIndicator.setVisible(false);
    const startY = 24;
    choices.forEach((c, i) => {
      const t = this.scene.add.text(40, startY + i * 22, `› ${c.label}`, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#cbd5e1",
      });
      this.add(t);
      this.choiceTexts.push(t);
    });
    this.refreshChoiceCursor();
  }

  private refreshChoiceCursor() {
    if (this.choiceCursor) this.choiceCursor.destroy();
    const target = this.choiceTexts[this.selectedChoice];
    if (!target) return;
    this.choiceCursor = this.scene.add.text(20, target.y, "►", {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#fde68a",
    });
    this.add(this.choiceCursor);
  }

  private finish(choice?: DialogChoice) {
    this.clearChoiceUI();
    this.setVisible(false);
    this.pendingData = null;
    const cb = this.onComplete;
    this.onComplete = undefined;
    cb?.(choice ? this.pendingChoiceIndex(choice) : undefined);
  }

  private pendingChoiceIndex(choice: DialogChoice): number {
    return (this.pendingData?.choices ?? []).indexOf(choice);
  }

  isActive(): boolean {
    return this.visible;
  }

  hasChoices(): boolean {
    return this.choiceTexts.length > 0;
  }
}
