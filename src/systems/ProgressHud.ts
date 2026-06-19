import Phaser from "phaser";
import { loadState } from "./save";

/**
 * HUD mini: tampilkan progres materi dibaca (X / total) di pojok kanan-atas.
 * Update otomatis setiap frame dari save state.
 */
export class ProgressHud {
  private container: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;
  private barBg: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, total: number) {
    const cam = scene.cameras.main;
    const w = 220;
    const h = 36;
    const x = cam.width - w - 16;
    const y = 16;

    this.container = scene.add.container(x, y).setScrollFactor(0).setDepth(900);
    const bg = scene.add.rectangle(w / 2, h / 2, w, h, 0x0f172a, 0.85).setStrokeStyle(2, 0x334155);
    this.container.add(bg);
    this.text = scene.add.text(8, 4, "", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#fde68a",
    });
    this.container.add(this.text);
    this.barBg = scene.add.rectangle(8, 22, w - 16, 6, 0x1e293b);
    this.container.add(this.barBg);
    this.barFill = scene.add.rectangle(8, 22, 0, 6, 0xfbbf24);
    this.container.add(this.barFill);
    scene.add.existing(this.container);

    this.update(total);
  }

  update(total: number) {
    const state = loadState();
    const read = state.materialsRead.length;
    const ratio = total > 0 ? Math.min(1, read / total) : 0;
    this.text.setText(`Materi: ${read} / ${total}`);
    this.barFill.width = (this.barBg.width) * ratio;
  }
}
