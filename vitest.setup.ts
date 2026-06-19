// Polyfill localStorage untuk jsdom (kadang undefined di lingkungan tertentu).
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string, string>();
  // @ts-expect-error -- shim sederhana untuk testing
  globalThis.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
}
