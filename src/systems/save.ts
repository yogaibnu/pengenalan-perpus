import type { SaveState } from "../types";

const STORAGE_KEY = "pengenalan-perpus:save:v1";

export function defaultState(): SaveState {
  return {
    gender: undefined,
    visited: [],
    materialsRead: [],
    flags: {},
    badges: [],
  };
}

export function loadState(): SaveState {
  if (typeof localStorage === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveState(state: SaveState): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function resetState(): SaveState {
  const fresh = defaultState();
  saveState(fresh);
  return fresh;
}
