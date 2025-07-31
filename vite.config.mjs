import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss({ config: "./tailwind.config.js" })],
  // Basic config for static site
  build: {
    outDir: "dist", // Output directory for builds
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        termsAndServices: resolve(__dirname, "terms-and-services.html"),
      },
    },
  },
  server: {
    open: true, // Auto-open browser on dev server start
  },
});
