import Phaser from "phaser";
import { audio } from "../systems/Audio";
import { loadState, saveState } from "../systems/save";

/**
 * Mini-game: cocokkan 5 buku dengan jenisnya (Kamus, Ensiklopedia, dst).
 * Drag & drop, atau tap dua kali: pilih item lalu pilih target.
 *
 * Skor = jumlah benar. Jika 5/5 → lencana "Ahli Referensi".
 */

interface MatchItem {
  id: string;
  label: string;
  matchId: string; // id kategori yang cocok
  emoji: string;
}

const ITEMS: MatchItem[] = [
  { id: "kbbi", label: "Daftar kata A–Z + makna", matchId: "kamus", emoji: "📕" },
  { id: "ensik", label: "Informasi lengkap A–Z", matchId: "ensiklopedi", emoji: "📗" },
  { id: "atlas", label: "Kumpulan peta dunia", matchId: "geografi", emoji: "🗺" },
  { id: "biog", label: "Kisah hidup tokoh", matchId: "biografi", emoji: "👤" },
  { id: "panduan", label: "Langkah-langkah cara", matchId: "pedoman", emoji: "📘" },
];

const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: "kamus", label: "Kamus", emoji: "📕" },
  { id: "ensiklopedi", label: "Ensiklopedia", emoji: "📗" },
  { id: "biografi", label: "Biografi", emoji: "👤" },
  { id: "geografi", label: "Sumber Geografi", emoji: "🗺" },
  { id: "pedoman", label: "Buku Pedoman", emoji: "📘" },
];

interface Card {
  item: MatchItem;
  container: Phaser.GameObjects.Container;
  matched: boolean;
  x: number; // posisi sumber (kiri)
  y: number;
}

interface Slot {
  categoryId: string;
  container: Phaser.GameObjects.Container;
  filledBy?: string; // item id yang mengisi
}

export class MatchGameScene extends Phaser.Scene {
  private cards: Card[] = [];
  private slots: Slot[] = [];
  private selectedCard: Card | null = null;
  private statusText!: Phaser.GameObjects.Text;
  private score = 0;
  private attempts = 0;
  private maxAttempts = 8;
  private shuffleOrder: number[] = [];

  constructor() {
    super("MatchGame");
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.add.rectangle(0, 0, w, h, 0x0f172a).setOrigin(0);

    this.add.text(w / 2, 36, "Mini-game: Cocokkan Buku", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#fde68a",
    }).setOrigin(0.5);

    this.add.text(w / 2, 62, "Taruh deskripsi di jenis buku yang tepat. Batas: 8 percobaan.", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#94a3b8",
    }).setOrigin(0.5);

    this.statusText = this.add.text(w / 2, h - 32, "", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#cbd5e1",
    }).setOrigin(0.5);

    // Susun slots di kanan (5 target, vertikal)
    const slotX = w * 0.7;
    const slotY0 = 110;
    const slotH = 56;
    CATEGORIES.forEach((c, i) => {
      const c2 = this.add.container(slotX, slotY0 + i * slotH);
      const bg = this.add.rectangle(0, 0, 200, 48, 0x1e293b, 0.9).setStrokeStyle(2, 0x475569);
      const label = this.add.text(-80, 0, `${c.emoji} ${c.label}`, {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#cbd5e1",
      }).setOrigin(0, 0.5);
      c2.add([bg, label]);
      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerdown", () => this.tryPlace(c.id));
      c2.setData("bg", bg);
      c2.setData("label", label);
      this.slots.push({ categoryId: c.id, container: c2 });
    });

    // Susun cards di kiri (acak urutannya)
    this.shuffleOrder = [];
    for (let i = 0; i < ITEMS.length; i++) this.shuffleOrder.push(i);
    // Fisher-Yates sederhana
    for (let i = this.shuffleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffleOrder[i], this.shuffleOrder[j]] = [this.shuffleOrder[j]!, this.shuffleOrder[i]!];
    }
    const cardX = w * 0.25;
    const cardY0 = 110;
    this.shuffleOrder.forEach((idx, i) => {
      const item = ITEMS[idx]!;
      const c = this.add.container(cardX, cardY0 + i * slotH);
      const bg = this.add.rectangle(0, 0, 200, 48, 0x0b1220, 0.9).setStrokeStyle(2, 0x94a3b8);
      const label = this.add.text(-90, 0, `${item.emoji} ${item.label}`, {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#e2e8f0",
        wordWrap: { width: 180 },
      }).setOrigin(0, 0.5);
      c.add([bg, label]);
      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerdown", () => this.selectCard(item.id));
      c.setData("bg", bg);
      this.cards.push({ item, container: c, matched: false, x: cardX, y: cardY0 + i * slotH });
    });

    // Tombol keluar
    const exit = this.add.text(w - 80, 30, "[ Kembali ]", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#cbd5e1",
      backgroundColor: "#1e293b",
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    exit.on("pointerdown", () => this.scene.start("Library"));

    this.refreshStatus();
  }

  private selectCard(itemId: string) {
    const card = this.cards.find((c) => c.item.id === itemId);
    if (!card || card.matched) return;
    // toggle
    if (this.selectedCard === card) {
      this.selectedCard = null;
    } else {
      this.selectedCard = card;
      audio.playSfx("interact");
    }
    this.refreshHighlight();
  }

  private refreshHighlight() {
    for (const c of this.cards) {
      const bg = c.container.getData("bg") as Phaser.GameObjects.Rectangle;
      if (c.matched) {
        bg.setStrokeStyle(2, 0x16a34a);
        bg.setFillStyle(0x14532d, 0.9);
      } else if (c === this.selectedCard) {
        bg.setStrokeStyle(3, 0xfbbf24);
        bg.setFillStyle(0x422006, 0.9);
      } else {
        bg.setStrokeStyle(2, 0x94a3b8);
        bg.setFillStyle(0x0b1220, 0.9);
      }
    }
  }

  private tryPlace(categoryId: string) {
    if (!this.selectedCard) return;
    if (this.selectedCard.matched) return;
    this.attempts++;
    const card = this.selectedCard;
    const correct = card.item.matchId === categoryId;
    if (correct) {
      card.matched = true;
      this.score++;
      audio.playSfx("success");
      // tampilkan di slot
      const slot = this.slots.find((s) => s.categoryId === categoryId);
      if (slot) {
        const t = this.add.text(slot.container.x + 70, slot.container.y, card.item.label, {
          fontFamily: "monospace",
          fontSize: "9px",
          color: "#86efac",
          wordWrap: { width: 120 },
        }).setOrigin(0, 0.5);
        slot.container.add(t);
      }
      this.selectedCard = null;
    } else {
      audio.playSfx("fail");
      this.flashWrong();
    }
    this.refreshHighlight();
    this.refreshStatus();
    if (this.score === ITEMS.length || this.attempts >= this.maxAttempts) {
      this.time.delayedCall(600, () => this.finish());
    }
  }

  private flashWrong() {
    this.cameras.main.shake(150, 0.005);
  }

  private refreshStatus() {
    this.statusText.setText(`Benar: ${this.score}/${ITEMS.length}  ·  Percobaan: ${this.attempts}/${this.maxAttempts}  ·  Klik deskripsi, lalu klik kategori.`);
  }

  private finish() {
    const state = loadState();
    const badge = this.score === ITEMS.length ? "Ahli Referensi" : (this.score >= 3 ? "Penjelajah Buku" : "Pemula");
    if (!state.badges.includes(badge)) state.badges.push(badge);
    saveState(state);

    // Tampilkan panel hasil
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const c = this.add.container(0, 0).setDepth(2000);
    const bg = this.add.rectangle(w / 2, h / 2, w - 80, h - 120, 0x0f172a, 0.97).setStrokeStyle(2, 0xfbbf24);
    c.add(bg);
    const t1 = this.add.text(w / 2, h / 2 - 60, `Selesai!`, {
      fontFamily: "monospace", fontSize: "28px", color: "#fde68a",
    }).setOrigin(0.5);
    const t2 = this.add.text(w / 2, h / 2 - 20, `Skor: ${this.score}/${ITEMS.length}`, {
      fontFamily: "monospace", fontSize: "20px", color: "#cbd5e1",
    }).setOrigin(0.5);
    const t3 = this.add.text(w / 2, h / 2 + 10, `Lencana: ${badge}`, {
      fontFamily: "monospace", fontSize: "18px", color: "#86efac",
    }).setOrigin(0.5);
    c.add([t1, t2, t3]);
    const ok = this.add.text(w / 2, h / 2 + 70, "[ Lanjut ke Kuis ]", {
      fontFamily: "monospace", fontSize: "16px", color: "#0f172a", backgroundColor: "#fde68a", padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    ok.on("pointerdown", () => this.scene.start("Quiz", { from: "MatchGame" }));
    c.add(ok);
  }
}
