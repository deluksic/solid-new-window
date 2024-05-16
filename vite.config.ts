/// <reference types="vitest" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import dts from "vite-plugin-dts";

export default defineConfig({
  root: "./",
  plugins: [
    solidPlugin(),
    dts({
      rollupTypes: true,
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: "node",
    globals: true,
  },
  build: {
    target: "modules",
    lib: {
      formats: ["es"],
      entry: "src/index.ts",
      fileName: "solid-new-window",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web"],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
