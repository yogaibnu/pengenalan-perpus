/**
 * Regression test: pastikan key objects untuk dialog dan movement
 * di-cache di create() sekali, BUKAN di-addKey() setiap frame.
 *
 * Jika pola regresif (addKey() di update) muncul lagi, test ini gagal.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(__dirname, "WorldScene.ts"), "utf-8");

describe("Input key handling regression", () => {
  it("does NOT call addKey() inside update() or handleDialogInput() or handleInteractInput()", () => {
    // extract handleDialogInput & handleInteractInput & update methods
    const extract = (name: string) => {
      const re = new RegExp(`(private |override )${name}\\([^)]*\\)(?::[^{]+)?\\s*\\{`, "g");
      const m = re.exec(source);
      if (!m) return "";
      let depth = 1;
      let i = m.index + m[0].length;
      while (i < source.length && depth > 0) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") depth--;
        i++;
      }
      return source.substring(m.index, i);
    };
    const dialog = extract("handleDialogInput");
    const interact = extract("handleInteractInput");
    const update = extract("update");
    expect(dialog).not.toMatch(/addKey\s*\(/);
    expect(interact).not.toMatch(/addKey\s*\(/);
    expect(update).not.toMatch(/addKey\s*\(/);
  });

  it("caches key objects in create()", () => {
    const m = /create\(\)\s*\{[\s\S]*?\n  \}/.exec(source);
    expect(m).not.toBeNull();
    const createBody = m ? m[0] : "";
    // minimal: ada addKey untuk SPACE, ENTER, UP, DOWN
    expect(createBody).toMatch(/addKey.*SPACE/);
    expect(createBody).toMatch(/addKey.*ENTER/);
  });

  it("declares keys field for caching", () => {
    expect(source).toMatch(/protected keys!:/);
  });
});
