// Tipe data bersama untuk seluruh game.

export type Gender = "male" | "female";

export type SceneKey =
  | "Boot"
  | "Title"
  | "CharacterSelect"
  | "Classroom"
  | "Library"
  | "DigitalLibrary"
  | "Quiz"
  | "Ending";

/** Tile map sederhana berbasis string id 2D array. */
export interface TileMapData {
  id: string;
  name: string;
  tileSize: number;
  cols: number;
  rows: number;
  /** rows × cols, tiap cell adalah tile id (0 = kosong/lantai) */
  tiles: number[][];
  /** event interaktif di peta */
  events: MapEvent[];
  /** spawn point pemain saat masuk */
  spawn: { x: number; y: number };
  /** posisi tujuan "transfer" ke scene lain */
  exits: MapExit[];
}

export type InteractionKind =
  | "dialog"          // dialog biasa
  | "material"        // buku referensi -> buka panel materi
  | "transfer"        // pindah scene (handled by exits)
  | "quiz"            // picu kuis
  | "info";           // info singkat (sign/label)

export interface MapEvent {
  id: string;
  /** tile coords */
  x: number;
  y: number;
  kind: InteractionKind;
  label?: string;        // badge di atas tile (cth: "Buku")
  trigger: "interact" | "touch";
  /** Data tambahan sesuai kind */
  data?: DialogData | MaterialData | InfoData;
}

export interface MapExit {
  x: number;
  y: number;
  toScene: SceneKey;
  toSpawn?: { x: number; y: number };
  message?: string;
}

export interface DialogData {
  speaker?: string;
  lines: string[];
  /** opsional: pilihan yang mengubah state */
  choices?: DialogChoice[];
  onFinish?: string; // event id untuk picu sesuatu
}

export interface DialogChoice {
  label: string;
  next?: string;        // event id tujuan (opsional)
  setFlag?: string;     // nama flag
  setValue?: number;
}

export interface MaterialData {
  title: string;
  body: string[];       // paragraf
}

export interface InfoData {
  title?: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SaveState {
  gender?: Gender;
  visited: string[];        // daftar scene yang pernah dikunjungi
  materialsRead: string[];   // id materi yang sudah dibuka
  flags: Record<string, number | boolean>;
  badges: string[];         // lencana yang diperoleh
}
