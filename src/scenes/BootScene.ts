import Phaser from "phaser";
import { generateCharacterSprite, generateTileset } from "../systems/SpriteFactory";

/**
 * Scene boot: hasilkan tekstur prosedural sebelum scene lain dimulai.
 * Memicu 'Title' setelah siap.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    // Hasilkan sprite untuk dua gender
    generateCharacterSprite(this, "male", { skin: "#f1c27d", hair: "#1f2937", shirt: "#1d4ed8", pants: "#1e3a8a" });
    generateCharacterSprite(this, "female", { skin: "#f1c27d", hair: "#7c2d12", shirt: "#be185d", pants: "#831843" });

    // Pre-render tileset (cache)
    generateTileset(this, "school");
    generateTileset(this, "library");
    generateTileset(this, "digital");

    this.scene.start("Title");
  }
}
