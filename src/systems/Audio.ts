/**
 * Audio engine ringan: BGM chip-tune (sintesis melodi sederhana via WebAudio API)
 * dan SFX (beep pendek). Tidak butuh file audio eksternal.
 *
 * Pemakaian:
 *   import { audio } from "./systems/Audio";
 *   audio.startBgm("title");
 *   audio.playSfx("interact");
 */

type BgmId = "title" | "explore" | "quiz";

const NOTE_FREQS: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
};

/** Pola melodi sederhana: title = ceria, explore = tenang, quiz = tegang. */
const PATTERNS: Record<BgmId, { notes: string[]; tempo: number; wave: OscillatorType }> = {
  title: {
    notes: ["C5", "E5", "G5", "E5", "C5", "D5", "F5", "D5", "E5", "G5", "C5", "G4", "E5", "C5"],
    tempo: 220,
    wave: "triangle",
  },
  explore: {
    notes: ["E4", "G4", "A4", "G4", "E4", "B4", "A4", "G4", "F4", "A4", "C5", "A4", "G4", "E4"],
    tempo: 380,
    wave: "sine",
  },
  quiz: {
    notes: ["A3", "E3", "A3", "C4", "A3", "E3", "B3", "A3", "D4", "A3", "E3", "A3", "C4", "A3"],
    tempo: 160,
    wave: "square",
  },
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmTimers: number[] = [];
  private muted = false;
  private currentBgm: BgmId | null = null;

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.08;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  setMuted(v: boolean) {
    this.muted = v;
    if (this.muted) this.stopBgm();
  }

  startBgm(id: BgmId) {
    this.stopBgm();
    const ctx = this.ensure();
    if (!ctx || !this.masterGain || this.muted) return;
    this.currentBgm = id;
    const pat = PATTERNS[id];
    let i = 0;
    const play = () => {
      if (this.currentBgm !== id) return;
      const note = pat.notes[i % pat.notes.length];
      this.playNote(note, pat.tempo, pat.wave);
      i++;
      const id2 = window.setTimeout(play, pat.tempo);
      this.bgmTimers.push(id2);
    };
    play();
  }

  stopBgm() {
    this.currentBgm = null;
    for (const t of this.bgmTimers) clearTimeout(t);
    this.bgmTimers = [];
  }

  private playNote(note: string, durationMs: number, wave: OscillatorType) {
    const ctx = this.ensure();
    if (!ctx || !this.masterGain) return;
    const freq = NOTE_FREQS[note];
    if (!freq) return;
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000 + 0.05);
  }

  /** SFX pendek: "interact" (tombol ditekan), "success" (buku dibuka), "fail" (jawaban salah). */
  playSfx(kind: "interact" | "success" | "fail" | "step") {
    const ctx = this.ensure();
    if (!ctx || !this.masterGain || this.muted) return;
    if (kind === "interact") {
      this.playNote("C5", 80, "square");
    } else if (kind === "success") {
      this.playNote("E5", 100, "sine");
      window.setTimeout(() => this.playNote("G5", 100, "sine"), 100);
      window.setTimeout(() => this.playNote("C6", 150, "sine"), 200);
    } else if (kind === "fail") {
      this.playNote("E3", 200, "square");
    } else if (kind === "step") {
      this.playNote("C3", 40, "triangle");
    }
  }
}

export const audio = new AudioEngine();
