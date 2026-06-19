import { describe, it, expect, beforeEach } from "vitest";
import { defaultState, loadState, saveState, resetState } from "./save";

describe("save", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default state when storage is empty", () => {
    const s = loadState();
    expect(s.gender).toBeUndefined();
    expect(s.visited).toEqual([]);
    expect(s.materialsRead).toEqual([]);
    expect(s.badges).toEqual([]);
    expect(s.flags).toEqual({});
  });

  it("round-trips data through storage", () => {
    const s = defaultState();
    s.gender = "female";
    s.visited.push("Library");
    s.materialsRead.push("lib-kamus");
    s.flags["task_given"] = true;
    s.badges.push("Pustakawan Muda");
    saveState(s);

    const s2 = loadState();
    expect(s2.gender).toBe("female");
    expect(s2.visited).toContain("Library");
    expect(s2.materialsRead).toContain("lib-kamus");
    expect(s2.flags["task_given"]).toBe(true);
    expect(s2.badges).toContain("Pustakawan Muda");
  });

  it("resetState clears all data", () => {
    const s = defaultState();
    s.gender = "male";
    s.badges.push("X");
    saveState(s);
    const fresh = resetState();
    expect(fresh.gender).toBeUndefined();
    expect(fresh.badges).toEqual([]);
    expect(loadState().badges).toEqual([]);
  });
});
