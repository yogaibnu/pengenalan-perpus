import { describe, it, expect } from "vitest";
import { audio } from "./Audio";

describe("Audio", () => {
  it("startBgm and stopBgm do not throw in jsdom", () => {
    expect(() => audio.startBgm("title")).not.toThrow();
    expect(() => audio.stopBgm()).not.toThrow();
  });

  it("setMuted stops current bgm", () => {
    audio.startBgm("explore");
    audio.setMuted(true);
    // setelah mute, currentBgm harus null
    expect((audio as unknown as { currentBgm: unknown }).currentBgm).toBeNull();
    audio.setMuted(false);
  });

  it("playSfx accepts all kinds without throwing", () => {
    expect(() => audio.playSfx("interact")).not.toThrow();
    expect(() => audio.playSfx("success")).not.toThrow();
    expect(() => audio.playSfx("fail")).not.toThrow();
    expect(() => audio.playSfx("step")).not.toThrow();
  });
});
