import Phaser from "phaser";
import { loadState, saveState } from "../systems/save";
import { generateCharacterSprite } from "../systems/SpriteFactory";

export class CharacterSelectScene extends Phaser.Scene {
  private selected: "male" | "female" = "male";

  constructor() {
    super("CharacterSelect");
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(0, 0, w, h, 0x0f172a).setOrigin(0);

    this.add.text(w / 2, 60, "Pilih Karakter", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#fde68a",
    }).setOrigin(0.5);

    // hasilkan tekstur di scene ini juga (jika user me-reload)
    if (!this.textures.exists("char-male-front") || !this.textures.exists("char-female-front")) {
      generateCharacterSprite(this, "male", { skin: "#f1c27d", hair: "#1f2937", shirt: "#1d4ed8", pants: "#1e3a8a" });
      generateCharacterSprite(this, "female", { skin: "#f1c27d", hair: "#7c2d12", shirt: "#be185d", pants: "#831843" });
    }

    // 2 sprite preview
    const male = this.add.image(w / 2 - 120, h / 2, "char-male-front").setScale(3);
    const female = this.add.image(w / 2 + 120, h / 2, "char-female-front").setScale(3);

    const maleBg = this.add.rectangle(w / 2 - 120, h / 2, 100, 140, 0x1e293b, 0.7);
    const femaleBg = this.add.rectangle(w / 2 + 120, h / 2, 100, 140, 0x1e293b, 0.7);

    const maleLabel = this.add.text(w / 2 - 120, h / 2 + 100, "Siswa Laki-laki", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#cbd5e1",
    }).setOrigin(0.5);
    const femaleLabel = this.add.text(w / 2 + 120, h / 2 + 100, "Siswa Perempuan", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#cbd5e1",
    }).setOrigin(0.5);

    male.setInteractive({ useHandCursor: true });
    female.setInteractive({ useHandCursor: true });

    male.on("pointerdown", () => this.select("male"));
    female.on("pointerdown", () => this.select("female"));

    // input keyboard
    this.input.keyboard!.on("keydown-LEFT", () => this.select("male"));
    this.input.keyboard!.on("keydown-RIGHT", () => this.select("female"));
    this.input.keyboard!.on("keydown-A", () => this.select("male"));
    this.input.keyboard!.on("keydown-D", () => this.select("female"));
    this.input.keyboard!.on("keydown-ENTER", () => this.confirm());
    this.input.keyboard!.on("keydown-SPACE", () => this.confirm());

    this.refresh(male, female, maleBg, femaleBg, maleLabel, femaleLabel);

    const start = this.add.text(w / 2, h - 80, "[ Mulai Petualangan ]", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#0f172a",
      backgroundColor: "#fde68a",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    start.on("pointerdown", () => this.confirm());

    // Pre-load state
    const state = loadState();
    if (state.gender) this.selected = state.gender;
    this.refresh(male, female, maleBg, femaleBg, maleLabel, femaleLabel);
  }

  private select(g: "male" | "female") {
    this.selected = g;
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const male = this.children.list.find((c) => c.type === "Image" && (c as Phaser.GameObjects.Image).x === w / 2 - 120) as Phaser.GameObjects.Image;
    const female = this.children.list.find((c) => c.type === "Image" && (c as Phaser.GameObjects.Image).x === w / 2 + 120) as Phaser.GameObjects.Image;
    const maleBg = this.children.list.find((c) => c.type === "Rectangle" && (c as Phaser.GameObjects.Rectangle).x === w / 2 - 120) as Phaser.GameObjects.Rectangle;
    const femaleBg = this.children.list.find((c) => c.type === "Rectangle" && (c as Phaser.GameObjects.Rectangle).x === w / 2 + 120) as Phaser.GameObjects.Rectangle;
    const maleLabel = this.children.list.find((c) => c.type === "Text" && (c as Phaser.GameObjects.Text).x === w / 2 - 120 && (c as Phaser.GameObjects.Text).y === h / 2 + 100) as Phaser.GameObjects.Text;
    const femaleLabel = this.children.list.find((c) => c.type === "Text" && (c as Phaser.GameObjects.Text).x === w / 2 + 120 && (c as Phaser.GameObjects.Text).y === h / 2 + 100) as Phaser.GameObjects.Text;
    this.refresh(male, female, maleBg, femaleBg, maleLabel, femaleLabel);
  }

  private refresh(
    male: Phaser.GameObjects.Image,
    female: Phaser.GameObjects.Image,
    maleBg: Phaser.GameObjects.Rectangle,
    femaleBg: Phaser.GameObjects.Rectangle,
    maleLabel: Phaser.GameObjects.Text,
    femaleLabel: Phaser.GameObjects.Text,
  ) {
    maleBg.setStrokeStyle(this.selected === "male" ? 4 : 0, 0xfde68a);
    femaleBg.setStrokeStyle(this.selected === "female" ? 4 : 0, 0xfde68a);
    maleLabel.setColor(this.selected === "male" ? "#fde68a" : "#cbd5e1");
    femaleLabel.setColor(this.selected === "female" ? "#fde68a" : "#cbd5e1");
    male.setAlpha(this.selected === "male" ? 1 : 0.6);
    female.setAlpha(this.selected === "female" ? 1 : 0.6);
  }

  private confirm() {
    const state = loadState();
    state.gender = this.selected;
    saveState(state);
    this.scene.start("Classroom");
  }
}
