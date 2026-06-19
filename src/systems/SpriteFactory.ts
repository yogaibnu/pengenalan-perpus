import Phaser from "phaser";
import type { Gender } from "../types";

/**
 * Menggambar sprite & tile secara prosedural ke sebuah offscreen canvas,
 * lalu mendaftarkannya sebagai Phaser.Texture (sprite sheet untuk sprite,
 * multi-frame canvas untuk tileset).
 *
 * Sprite sheet karakter: 2 kolom (frame 0 = down, frame 1 = up) × 1 baris.
 * Untuk hadap kiri/kanan gunakan setFlipX(true) di pemain — frame "down" jadi
 * dasar visual dan dibalik untuk hadap kanan.
 */

const TILE = 32;
const SPRITE_W = 24;
const SPRITE_H = 32;

function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/* ----------- SPRITE KARAKTER ----------- */

/** Sprite karakter 2-frame (down, up). FlipX untuk hadap kiri/kanan. */
export function generateCharacterSprite(
  scene: Phaser.Scene,
  gender: Gender,
  palette: { skin: string; hair: string; shirt: string; pants: string },
): { front: string; back: string } {
  // Buat dua texture terpisah (front & back) — sederhana, sync, dan dijamin bekerja.
  const frontKey = `char-${gender}-front`;
  const backKey = `char-${gender}-back`;

  const frontCanvas = makeCanvas(SPRITE_W, SPRITE_H).canvas;
  const frontCtx = frontCanvas.getContext("2d")!;
  frontCtx.imageSmoothingEnabled = false;
  drawFront(frontCtx, palette);

  const backCanvas = makeCanvas(SPRITE_W, SPRITE_H).canvas;
  const backCtx = backCanvas.getContext("2d")!;
  backCtx.imageSmoothingEnabled = false;
  drawBack(backCtx, palette);

  if (scene.textures.exists(frontKey)) scene.textures.remove(frontKey);
  scene.textures.addCanvas(frontKey, frontCanvas);
  if (scene.textures.exists(backKey)) scene.textures.remove(backKey);
  scene.textures.addCanvas(backKey, backCanvas);

  return { front: frontKey, back: backKey };
}

function drawFront(ctx: CanvasRenderingContext2D, p: { skin: string; hair: string; shirt: string; pants: string }) {
  // rambut (depan, poni jatuh ke dahi)
  rect(ctx, 6, 2, 12, 4, p.hair);
  rect(ctx, 5, 4, 2, 2, p.hair);
  rect(ctx, 17, 4, 2, 2, p.hair);
  // wajah
  rect(ctx, 7, 6, 10, 6, p.skin);
  // mata
  px(ctx, 9, 8, "#1e293b");
  px(ctx, 14, 8, "#1e293b");
  // senyum tipis
  px(ctx, 10, 10, "#1e293b");
  px(ctx, 13, 10, "#1e293b");
  // baju
  rect(ctx, 6, 12, 12, 8, p.shirt);
  // tangan
  rect(ctx, 4, 13, 2, 6, p.shirt);
  rect(ctx, 18, 13, 2, 6, p.shirt);
  // celana
  rect(ctx, 7, 20, 4, 8, p.pants);
  rect(ctx, 13, 20, 4, 8, p.pants);
  // sepatu
  rect(ctx, 7, 28, 4, 2, "#0f172a");
  rect(ctx, 13, 28, 4, 2, "#0f172a");
}

function drawBack(ctx: CanvasRenderingContext2D, p: { skin: string; hair: string; shirt: string; pants: string }) {
  // rambut (belakang, lebih panjang)
  rect(ctx, 6, 2, 12, 6, p.hair);
  rect(ctx, 5, 6, 2, 2, p.hair);
  rect(ctx, 17, 6, 2, 2, p.hair);
  // leher
  rect(ctx, 9, 8, 6, 4, p.skin);
  // baju
  rect(ctx, 6, 12, 12, 8, p.shirt);
  // tangan
  rect(ctx, 4, 13, 2, 6, p.shirt);
  rect(ctx, 18, 13, 2, 6, p.shirt);
  // celana
  rect(ctx, 7, 20, 4, 8, p.pants);
  rect(ctx, 13, 20, 4, 8, p.pants);
  // sepatu
  rect(ctx, 7, 28, 4, 2, "#0f172a");
  rect(ctx, 13, 28, 4, 2, "#0f172a");
}

/* ----------- TILESET ----------- */

/** Buat tileset sederhana (1 baris = 4 tile: floor, wall, door, decor). */
export function generateTileset(scene: Phaser.Scene, theme: "school" | "library" | "digital"): string {
  const key = `tiles-${theme}`;
  const { canvas, ctx } = makeCanvas(TILE * 4, TILE);
  drawFloor(ctx, 0, theme);
  drawWall(ctx, TILE, theme);
  drawDoor(ctx, TILE * 2, theme);
  drawDecor(ctx, TILE * 3, theme);

  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
  return key;
}

function drawFloor(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  let base: string;
  let alt: string;
  if (theme === "digital") {
    base = "#1e293b";
    alt = "#0f172a";
  } else if (theme === "library") {
    base = "#a16207"; // kayu hangat
    alt = "#854d0e";
  } else {
    // school: lantai keramik abu-abu
    base = "#94a3b8";
    alt = "#64748b";
  }
  for (let y = 0; y < TILE; y += 8) {
    for (let x = 0; x < TILE; x += 8) {
      rect(ctx, ox + x, y, 8, 8, ((x + y) / 8) % 2 === 0 ? base : alt);
    }
  }
  // garis nat
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  for (let y = 0; y <= TILE; y += 8) {
    ctx.beginPath();
    ctx.moveTo(ox, y);
    ctx.lineTo(ox + TILE, y);
    ctx.stroke();
  }
  for (let x = 0; x <= TILE; x += 8) {
    ctx.beginPath();
    ctx.moveTo(ox + x, 0);
    ctx.lineTo(ox + x, TILE);
    ctx.stroke();
  }
}

function drawWall(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  if (theme === "digital") {
    // grid cyber
    rect(ctx, ox, 0, TILE, TILE, "#0b1220");
    for (let i = 0; i < TILE; i += 4) {
      rect(ctx, ox + i, 0, 1, TILE, "#1d4ed8");
    }
    for (let j = 0; j < TILE; j += 4) {
      rect(ctx, ox, j, TILE, 1, "#1d4ed8");
    }
    rect(ctx, ox + 4, 4, 4, 4, "#22d3ee");
    rect(ctx, ox + 20, 16, 6, 6, "#a855f7");
  } else if (theme === "library") {
    // dinding kayu vertikal (perpustakaan)
    rect(ctx, ox, 0, TILE, TILE, "#7c2d12");
    for (let x = 0; x < TILE; x += 6) {
      rect(ctx, ox + x, 0, 1, TILE, "rgba(0,0,0,0.35)");
    }
    for (let y = 0; y < TILE; y += 4) {
      rect(ctx, ox, y, TILE, 1, "rgba(255,255,255,0.05)");
    }
  } else {
    // school: bata putih-krem
    rect(ctx, ox, 0, TILE, TILE, "#e2e8f0");
    for (let y = 0; y < TILE; y += 8) {
      const offset = (y / 8) % 2 === 0 ? 0 : 8;
      for (let x = -offset; x < TILE; x += 16) {
        rect(ctx, ox + Math.max(0, x), y, 15, 7, "#f1f5f9");
        rect(ctx, ox + Math.max(0, x) + 1, y + 1, 13, 5, "#cbd5e1");
      }
    }
  }
}

function drawDoor(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  rect(ctx, ox, 0, TILE, TILE, theme === "digital" ? "#0b1220" : "#1e293b");
  rect(ctx, ox + 4, 4, TILE - 8, TILE - 4, theme === "digital" ? "#22d3ee" : theme === "library" ? "#a16207" : "#475569");
  rect(ctx, ox + TILE - 8, TILE / 2, 2, 2, "#fde68a");
  if (theme === "digital") {
    rect(ctx, ox + 6, 6, TILE - 12, 2, "#67e8f9");
    rect(ctx, ox + 6, TILE - 6, TILE - 12, 2, "#67e8f9");
  }
}

function drawDecor(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  if (theme === "library") {
    // rak buku
    rect(ctx, ox + 2, 4, TILE - 4, 24, "#3f2a14");
    for (let y = 6; y < 28; y += 4) {
      for (let x = 4; x < TILE - 2; x += 3) {
        rect(ctx, ox + x, y, 2, 3, ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#7c3aed"][(x + y) % 5]);
      }
    }
  } else if (theme === "digital") {
    // monitor
    rect(ctx, ox + 2, 6, TILE - 4, 18, "#0b1220");
    rect(ctx, ox + 4, 8, TILE - 8, 14, "#22d3ee");
    rect(ctx, ox + 12, 26, 8, 4, "#0b1220");
  } else {
    // school: papan tulis
    rect(ctx, ox + 4, 4, TILE - 8, 18, "#1e293b");
    rect(ctx, ox + 4, 4, TILE - 8, 18, "#0f172a");
    rect(ctx, ox + 4, 22, TILE - 8, 2, "#7c2d12");
    // coretan kapur
    rect(ctx, ox + 7, 8, 6, 1, "#f1f5f9");
    rect(ctx, ox + 7, 12, 10, 1, "#f1f5f9");
    rect(ctx, ox + 7, 16, 4, 1, "#f1f5f9");
  }
}

export const TILE_SIZE = TILE;
export const SPRITE_WIDTH = SPRITE_W;
export const SPRITE_HEIGHT = SPRITE_H;

/* Konstanta frame sprite untuk referensi eksternal. */
export const SPRITE_FRAME = {
  FRONT: 0,
  BACK: 1,
} as const;
