import { defineConfig } from "vite";

// Saat build, jika GITHUB_PAGES=true → base=/pengenalan-perpus/
// (project page). Untuk development/preview lokal, base tetap relatif "./".
const isGhPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGhPages ? "/pengenalan-perpus/" : "./",
  server: {
    host: true,
    port: 5173,
    open: false,
  },
  build: {
    target: "es2022",
    sourcemap: true,
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
