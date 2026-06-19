import Phaser from "phaser";
import type { TileMapData, MapEvent, DialogData, MaterialData } from "../types";
import { TILE_SIZE, generateTileset, generateCharacterSprite } from "./SpriteFactory";
import { DialogBox } from "./DialogBox";
import { audio } from "./Audio";
import { loadState, saveState } from "./save";

/**
 * Base scene untuk semua map dunia (kelas, perpustakaan, perpustakaan digital).
 * Menangani: render tile, pergerakan pemain, interaksi event, transfer ke scene lain.
 */
export abstract class WorldScene extends Phaser.Scene {
  protected mapData!: TileMapData;
  protected player!: Phaser.GameObjects.Sprite;
  protected playerFrontKey!: string;
  protected playerBackKey!: string;
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; interact: Phaser.Input.Keyboard.Key };
  protected dialog!: DialogBox;
  protected eventSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  protected materialPanel: Phaser.GameObjects.Container | null = null;
  private interactCooldown = 0;
  protected abstract getTheme(): "school" | "library" | "digital";
  protected abstract onAfterCreate(): void;

  constructor(key: string) {
    super(key);
  }

  create() {
    this.mapData = this.buildMap();
    const tilesetKey = generateTileset(this, this.getTheme());
    const layer = this.add.container(0, 0);
    const ts = TILE_SIZE;
    for (let y = 0; y < this.mapData.rows; y++) {
      for (let x = 0; x < this.mapData.cols; x++) {
        const t = this.mapData.tiles[y]?.[x] ?? 0;
        // tile id 0 = floor, 1 = wall, 2 = door, 3 = decor
        // tampilkan semua kecuali yang benar-benar kosong
        if (t < 0) continue;
        const img = this.add.image(x * ts + ts / 2, y * ts + ts / 2, tilesetKey, t);
        img.setOrigin(0.5, 0.5);
        layer.add(img);
      }
    }

    // event visuals
    for (const ev of this.mapData.events) {
      this.spawnEventVisual(ev);
    }
    for (const ex of this.mapData.exits) {
      // tandai exit dengan glow
      const g = this.add.circle(ex.x * ts + ts / 2, ex.y * ts + ts / 2, ts / 3, 0xfbbf24, 0.45);
      g.setStrokeStyle(2, 0xfde68a, 0.9);
    }

    // pastikan tekstur pemain tersedia
    const playerKeys = this.loadPlayerTextures();
    if (!this.textures.exists(playerKeys.front) || !this.textures.exists(playerKeys.back)) {
      generateCharacterSprite(this, loadState().gender ?? "male", {
        skin: "#f1c27d",
        hair: loadState().gender === "female" ? "#7c2d12" : "#1f2937",
        shirt: loadState().gender === "female" ? "#be185d" : "#1d4ed8",
        pants: loadState().gender === "female" ? "#831843" : "#1e3a8a",
      });
    }
    this.playerFrontKey = playerKeys.front;
    this.playerBackKey = playerKeys.back;
    // spawn player
    const sp = this.mapData.spawn;
    this.player = this.add.sprite(sp.x * ts + ts / 2, sp.y * ts + ts / 2, this.playerFrontKey);
    this.player.setOrigin(0.5, 1);

    // kamera
    this.cameras.main.setBackgroundColor("#0f172a");
    this.cameras.main.setBounds(0, 0, this.mapData.cols * ts, this.mapData.rows * ts);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

    // input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.dialog = new DialogBox(this);

    // ESC → pause menu
    this.input.keyboard!.on("keydown-ESC", () => this.togglePauseMenu());

    // tandai scene dikunjungi
    const state = loadState();
    if (!state.visited.includes(this.scene.key)) {
      state.visited.push(this.scene.key);
      saveState(state);
    }

    this.onAfterCreate();
    this.showTouchControls();
    this.fadeIn();
  }

  protected loadPlayerTextures(): { front: string; back: string } {
    const state = loadState();
    const gender = state.gender ?? "male";
    return {
      front: `char-${gender}-front`,
      back: `char-${gender}-back`,
    };
  }

  protected spawnEventVisual(ev: MapEvent) {
    const ts = TILE_SIZE;
    const container = this.add.container(ev.x * ts + ts / 2, ev.y * ts + ts / 2);
    let glyph: Phaser.GameObjects.Shape | Phaser.GameObjects.Text;
    if (ev.kind === "material") {
      glyph = this.add.circle(0, 0, ts / 3, 0xfde68a, 0.8);
    } else if (ev.kind === "quiz") {
      glyph = this.add.circle(0, 0, ts / 3, 0x22d3ee, 0.8);
    } else if (ev.kind === "info") {
      glyph = this.add.rectangle(0, 0, ts / 2, ts / 2, 0x94a3b8, 0.8);
    } else {
      glyph = this.add.circle(0, 0, ts / 3, 0xa7f3d0, 0.8);
    }
    container.add(glyph);
    // ring highlight (awalnya tersembunyi)
    const ring = this.add.circle(0, 0, ts / 2, 0xfde68a, 0);
    ring.setStrokeStyle(2, 0xfbbf24, 0.8);
    ring.setVisible(false);
    container.add(ring);
    container.setData("ring", ring);
    if (ev.label) {
      const t = this.add.text(0, -ts / 2 - 4, ev.label, {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#f8fafc",
        backgroundColor: "#0f172a",
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5, 1);
      container.add(t);
    }
    this.eventSprites.set(ev.id, container);
  }

  /** Aktifkan pulse glow pada event terdekat. */
  private updateNearestEventHighlight(): void {
    const ev = this.findNearbyEvent();
    for (const [, container] of this.eventSprites) {
      const ring = container.getData("ring") as Phaser.GameObjects.Arc | undefined;
      if (ring) ring.setVisible(false);
    }
    if (!ev) return;
    const container = this.eventSprites.get(ev.id);
    if (!container) return;
    const ring = container.getData("ring") as Phaser.GameObjects.Arc | undefined;
    if (!ring) return;
    ring.setVisible(true);
    this.tweens.killTweensOf(ring);
    this.tweens.add({
      targets: ring,
      scale: { from: 0.9, to: 1.2 },
      alpha: { from: 0.6, to: 0 },
      duration: 700,
      repeat: -1,
    });
  }

  override update(_time: number, delta: number) {
    if (this.dialog.isActive() || this.materialPanel) {
      this.handleDialogInput();
      return;
    }
    this.handlePlayerMovement(delta);
    this.handleInteractInput();
    this.updateNearestEventHighlight();
    this.checkExits();
  }

  private handlePlayerMovement(delta: number) {
    if (this.interactCooldown > 0) this.interactCooldown -= delta;
    let dx = 0;
    let dy = 0;
    const tUp = this.isTouchDown("up"), tDown = this.isTouchDown("down"), tLeft = this.isTouchDown("left"), tRight = this.isTouchDown("right");
    if (this.cursors.left?.isDown || this.wasd.left.isDown || tLeft) dx -= 1;
    if (this.cursors.right?.isDown || this.wasd.right.isDown || tRight) dx += 1;
    if (this.cursors.up?.isDown || this.wasd.up.isDown || tUp) dy -= 1;
    if (this.cursors.down?.isDown || this.wasd.down.isDown || tDown) dy += 1;

    const speed = 110; // px/s
    const dt = delta / 1000;
    const moveLen = Math.hypot(dx, dy);
    if (moveLen === 0) {
      this.tweens.killTweensOf(this.player);
      return;
    }
    dx /= moveLen;
    dy /= moveLen;
    const vx = dx * speed;
    const vy = dy * speed;
    // gerak + collision
    this.tryMove(vx * dt, 0);
    this.tryMove(0, vy * dt);
    // animasi bob vertikal saat bergerak
    if (!this.tweens.isTweening(this.player)) {
      this.tweens.add({
        targets: this.player,
        y: this.player.y - 2,
        duration: 110,
        yoyo: true,
        repeat: -1,
      });
    }

    // frame & flip
    const wantBack = dy < 0 && dx === 0;
    const targetKey = wantBack ? this.playerBackKey : this.playerFrontKey;
    if (this.player.texture.key !== targetKey) {
      this.player.setTexture(targetKey);
    }
    if (dx < 0) this.player.setFlipX(false);
    else if (dx > 0) this.player.setFlipX(true);
  }

  private tryMove(dx: number, dy: number) {
    const ts = TILE_SIZE;
    const margin = 4;
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    const corners: [number, number][] = [
      [nx - margin, ny - ts + margin],
      [nx + margin, ny - ts + margin],
      [nx - margin, ny - 2],
      [nx + margin, ny - 2],
    ];
    for (const [cx, cy] of corners) {
      const tx = Math.floor(cx / ts);
      const ty = Math.floor(cy / ts);
      if (tx < 0 || ty < 0 || tx >= this.mapData.cols || ty >= this.mapData.rows) continue;
      const t = this.mapData.tiles[ty]?.[tx] ?? 0;
      // tile 1 = wall/blocker
      if (t === 1) return;
    }
    this.player.x = nx;
    this.player.y = ny;
  }

  private handleDialogInput() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space!) || Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      this.dialog.advance();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) || Phaser.Input.Keyboard.JustDown(this.wasd.up)) {
      this.dialog.moveChoice(-1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) || Phaser.Input.Keyboard.JustDown(this.wasd.down)) {
      this.dialog.moveChoice(1);
    }
  }

  private handleInteractInput() {
    if (this.interactCooldown > 0) return;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space!) || Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      const ev = this.findNearbyEvent();
      if (ev) {
        this.triggerEvent(ev);
        this.interactCooldown = 250;
      }
    }
  }

  private findNearbyEvent(): MapEvent | null {
    const ts = TILE_SIZE;
    const px = this.player.x;
    const py = this.player.y - TILE_SIZE / 2;
    for (const ev of this.mapData.events) {
      const ex = ev.x * ts + ts / 2;
      const ey = ev.y * ts + ts / 2;
      if (Math.hypot(px - ex, py - ey) < ts * 0.8) return ev;
    }
    return null;
  }

  private triggerEvent(ev: MapEvent) {
    audio.playSfx("interact");
    const data = ev.data as DialogData | MaterialData | undefined;
    if (ev.kind === "dialog" && data && "lines" in data) {
      this.dialog.show(data, () => this.afterDialog(ev, data));
    } else if (ev.kind === "material" && data && "body" in data) {
      audio.playSfx("success");
      this.showMaterialPanel(ev.id, data);
    } else if (ev.kind === "quiz") {
      WorldScene.fadeOutThenStart(this, "Quiz", { from: this.scene.key });
    } else if (ev.kind === "info" && data && "text" in data) {
      this.dialog.show({ lines: [data.text as string] });
    }
  }

  private afterDialog(_ev: MapEvent, data: DialogData) {
    // tandai flag
    if (data.onFinish) {
      const state = loadState();
      state.flags[data.onFinish] = true;
      saveState(state);
    }
  }

  private checkExits() {
    const ts = TILE_SIZE;
    const px = this.player.x;
    const py = this.player.y - TILE_SIZE / 2;
    for (const ex of this.mapData.exits) {
      if (Math.hypot(px - (ex.x * ts + ts / 2), py - (ex.y * ts + ts / 2)) < ts * 0.5) {
        WorldScene.fadeOutThenStart(this, ex.toScene, { spawn: ex.toSpawn });
      }
    }
  }

  private showMaterialPanel(id: string, data: MaterialData) {
    const cam = this.cameras.main;
    const w = cam.width;
    const h = cam.height;
    const c = this.add.container(0, 0);
    c.setScrollFactor(0);
    const bg = this.add.rectangle(w / 2, h / 2, w - 40, h - 60, 0x0f172a, 0.96).setStrokeStyle(2, 0xfbbf24);
    c.add(bg);
    const title = this.add.text(w / 2, 50, data.title, {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#fde68a",
    }).setOrigin(0.5);
    c.add(title);
    const body = data.body.join("\n\n");
    const text = this.add.text(60, 100, body, {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#e2e8f0",
      wordWrap: { width: w - 120 },
      lineSpacing: 6,
    });
    c.add(text);
    const close = this.add.text(w / 2, h - 50, "Tutup (Spasi / Klik)", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#fde68a",
      backgroundColor: "#1e293b",
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(close);
    const closePanel = () => {
      // tandai sudah dibaca
      const state = loadState();
      if (!state.materialsRead.includes(id)) {
        state.materialsRead.push(id);
        saveState(state);
      }
      c.destroy();
      this.materialPanel = null;
    };
    close.on("pointerdown", closePanel);
    this.input.keyboard!.once("keydown-SPACE", closePanel);
    this.materialPanel = c;
  }

  protected abstract buildMap(): TileMapData;

  private pauseContainer: Phaser.GameObjects.Container | null = null;
  private paused = false;

  private togglePauseMenu(): void {
    if (this.paused) {
      this.closePauseMenu();
    } else {
      this.openPauseMenu();
    }
  }

  private openPauseMenu(): void {
    if (this.pauseContainer) return;
    this.paused = true;
    const cam = this.cameras.main;
    const w = cam.width;
    const h = cam.height;
    const c = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
    const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x0f172a, 0.85);
    c.add(bg);
    const title = this.add.text(w / 2, h / 2 - 100, "Jeda", {
      fontFamily: "monospace",
      fontSize: "32px",
      color: "#fde68a",
    }).setOrigin(0.5);
    c.add(title);
    const resume = this.add.text(w / 2, h / 2 - 20, "[ Lanjutkan ]", {
      fontFamily: "monospace",
      fontSize: "18px",
      color: "#0f172a",
      backgroundColor: "#fde68a",
      padding: { x: 20, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(resume);
    const titleBtn = this.add.text(w / 2, h / 2 + 30, "[ Kembali ke Judul ]", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#cbd5e1",
      backgroundColor: "#1e293b",
      padding: { x: 16, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    c.add(titleBtn);
    resume.on("pointerdown", () => this.closePauseMenu());
    titleBtn.on("pointerdown", () => { this.scene.start("Title"); });
    this.pauseContainer = c;
  }


  /* -------------------- TOUCH D-PAD -------------------- */
  private touchPadContainer: Phaser.GameObjects.Container | null = null;
  private touchState: { up: boolean; down: boolean; left: boolean; right: boolean } = { up: false, down: false, left: false, right: false };

  /** Tampilkan D-pad di layar untuk device tanpa keyboard. */
  private showTouchControls(): void {
    if (this.touchPadContainer) return;
    if (!this.sys.game.device.input.touch) {
      // device tidak touch (desktop); lewati
      return;
    }
    const cam = this.cameras.main;
    const size = 64;
    const gap = 12;
    const baseX = 80;
    const baseY = cam.height - 80;
    const c = this.add.container(0, 0).setScrollFactor(0).setDepth(1800);

    const makeBtn = (x: number, y: number, label: string, dir: "up" | "down" | "left" | "right") => {
      const bg = this.add.circle(x, y, size / 2, 0x0f172a, 0.7).setStrokeStyle(2, 0x94a3b8, 0.8);
      const t = this.add.text(x, y, label, { fontFamily: "monospace", fontSize: "22px", color: "#e2e8f0" }).setOrigin(0.5);
      c.add([bg, t]);
      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerdown", () => { this.touchState[dir] = true; bg.setFillStyle(0xfbbf24, 0.9); });
      bg.on("pointerup", () => { this.touchState[dir] = false; bg.setFillStyle(0x0f172a, 0.7); });
      bg.on("pointerout", () => { this.touchState[dir] = false; bg.setFillStyle(0x0f172a, 0.7); });
    };

    makeBtn(baseX, baseY - size - gap, "▲", "up");
    makeBtn(baseX - size - gap, baseY, "◀", "left");
    makeBtn(baseX + size + gap, baseY, "▶", "right");
    makeBtn(baseX, baseY + size + gap, "▼", "down");

    const actBg = this.add.circle(cam.width - 80, cam.height - 80, size / 2, 0x16a34a, 0.85).setStrokeStyle(2, 0x86efac, 0.9);
    const actT = this.add.text(cam.width - 80, cam.height - 80, "Aksi", { fontFamily: "monospace", fontSize: "16px", color: "#f0fdf4" }).setOrigin(0.5);
    c.add([actBg, actT]);
    actBg.setInteractive({ useHandCursor: true });
    actBg.on("pointerdown", () => this.handleInteractInput());

    this.touchPadContainer = c;
  }

  private isTouchDown(dir: "up" | "down" | "left" | "right"): boolean {
    return this.touchState[dir];
  }


  /* -------------------- TRANSISI -------------------- */
  private fadeIn(): void {
    const cam = this.cameras.main;
    cam.fadeIn(400, 15, 23, 42);
  }
  static fadeOutThenStart(scene: Phaser.Scene, key: string, data?: object): void {
    const cam = scene.cameras.main;
    cam.fadeOut(300, 15, 23, 42);
    cam.once("camerafadeoutcomplete", () => {
      scene.scene.start(key, data);
    });
  }

  private closePauseMenu(): void {
    if (this.pauseContainer) {
      this.pauseContainer.destroy();
      this.pauseContainer = null;
    }
    this.paused = false;
  }
}

