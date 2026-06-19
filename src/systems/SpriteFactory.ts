import Phaser from "phaser";
import type { Gender } from "../types";

/**
 * Menggambar sprite & tile secara prosedural ke sebuah offscreen canvas,
 * lalu mengembalikannya sebagai Phaser.Texture. Tidak butuh file gambar.
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

function registerTexture(scene: Phaser.Scene, key: string, canvas: HTMLCanvasElement) {
  if (scene.textures.exists(key)) scene.textures.removeKey(key);
  // Pakai addCanvas agar konsisten, dan set frameWidth/frameHeight agar frame bekerja.
  scene.textures.addCanvas(key, canvas);
}

/** Buat sprite karakter single-frame. Untuk hadap kiri/kanan gunakan setFlipX. */
export function generateCharacterSprite(scene: Phaser.Scene, gender: Gender, palette: { skin: string; hair: string; shirt: string; pants: string }): string {
  const finalKey = `char-${gender}`;
  const { canvas, ctx } = makeCanvas(SPRITE_W, SPRITE_H);
  // Default: hadap depan (down)
  drawDown(ctx, 0, palette);
  registerTexture(scene, finalKey, canvas);
  return finalKey;
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawDown(ctx: CanvasRenderingContext2D, frame: number, p: { skin: string; hair: string; shirt: string; pants: string }) {
  // hair top
  rect(ctx, 6, 2, 12, 4, p.hair);
  // face
  rect(ctx, 7, 6, 10, 6, p.skin);
  // eyes
  px(ctx, 9, 8, "#1e293b");
  px(ctx, 14, 8, "#1e293b");
  // shirt
  rect(ctx, 6, 12, 12, 8, p.shirt);
  // arms
  rect(ctx, 4, 13, 2, 6, p.shirt);
  rect(ctx, 18, 13, 2, 6, p.shirt);
  // pants
  rect(ctx, 7, 20, 4, 8, p.pants);
  rect(ctx, 13, 20, 4, 8, p.pants);
  // shoes (frame berbeda)
  if (frame === 0) {
    rect(ctx, 7, 28, 4, 2, "#0f172a");
    rect(ctx, 13, 28, 4, 2, "#0f172a");
  } else {
    rect(ctx, 6, 28, 4, 2, "#0f172a");
    rect(ctx, 14, 28, 4, 2, "#0f172a");
  }
}



/** Buat tileset sederhana (1 baris = 4 tile: floor, wall, door, decor). */
export function generateTileset(scene: Phaser.Scene, theme: "school" | "library" | "digital"): string {
  const key = `tiles-${theme}`;
  // 4 tile per baris, 1 baris
  const { canvas, ctx } = makeCanvas(TILE * 4, TILE);
  // tile 0: lantai
  drawFloor(ctx, 0, theme);
  // tile 1: dinding/pohon
  drawWall(ctx, TILE, theme);
  // tile 2: pintu
  drawDoor(ctx, TILE * 2, theme);
  // tile 3: dekorasi (rak buku / komputer)
  drawDecor(ctx, TILE * 3, theme);
  registerTexture(scene, key, canvas);
  return key;
}

function drawFloor(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  const base = theme === "digital" ? "#1e293b" : theme === "library" ? "#7c5b3e" : "#94a3b8";
  const alt = theme === "digital" ? "#0f172a" : theme === "library" ? "#6b4f37" : "#64748b";
  for (let y = 0; y < TILE; y += 8) {
    for (let x = 0; x < TILE; x += 8) {
      rect(ctx, ox + x, y, 8, 8, ((x + y) / 8) % 2 === 0 ? base : alt);
    }
  }
  // garis nat
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
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
  } else {
    // bata
    rect(ctx, ox, 0, TILE, TILE, theme === "library" ? "#8b5a2b" : "#475569");
    for (let y = 0; y < TILE; y += 8) {
      const offset = (y / 8) % 2 === 0 ? 0 : 8;
      for (let x = -offset; x < TILE; x += 16) {
        rect(ctx, ox + Math.max(0, x), y, 15, 7, theme === "library" ? "#a06a36" : "#64748b");
        rect(ctx, ox + Math.max(0, x) + 1, y + 1, 13, 5, theme === "library" ? "#6b3f1d" : "#334155");
      }
    }
  }
}

function drawDoor(ctx: CanvasRenderingContext2D, ox: number, theme: "school" | "library" | "digital") {
  rect(ctx, ox, 0, TILE, TILE, theme === "digital" ? "#0b1220" : "#1e293b");
  rect(ctx, ox + 4, 4, TILE - 8, TILE - 4, theme === "digital" ? "#22d3ee" : theme === "library" ? "#a16207" : "#854d0e");
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
    // meja + papan tulis
    rect(ctx, ox + 2, 8, TILE - 4, 14, "#854d0e");
    rect(ctx, ox + 2, 22, TILE - 4, 4, "#1e293b");
    rect(ctx, ox + 4, 10, 2, 2, "#f8fafc");
    rect(ctx, ox + 8, 10, 2, 2, "#f8fafc");
  }
}

export const TILE_SIZE = TILE;
export const SPRITE_WIDTH = SPRITE_W;
export const SPRITE_HEIGHT = SPRITE_H;
