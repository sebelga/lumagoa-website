import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss({ config: "./tailwind.config.js" })],
  // Basic config for static site
  build: {
    outDir: "dist", // Output directory for builds
  },
  server: {
    open: true, // Auto-open browser on dev server start
  },
});
