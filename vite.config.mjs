import { resolve } from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { createMpaPlugin } from "vite-plugin-virtual-mpa";

export default defineConfig({
  plugins: [
    {
      name: "redirect-root", // Custom plugin for dev server redirect
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            req.url = "/index.html"; // Required for the Mpa plugin to work correctly
          }
          next();
        });
      },
    },
    createMpaPlugin({
      pages: [
        {
          name: "index",
          template: resolve(__dirname, "src/pages/index.ejs"),
          filename: "index.html",
        },
        {
          name: "termsAndServices",
          template: resolve(__dirname, "src/pages/terms-and-services.ejs"),
          filename: "terms-and-services.html",
        },
      ],
      htmlMinify: true,
    }),
    tailwindcss({ config: "./tailwind.config.js" }),
  ],
  // Basic config for static site
  build: {
    outDir: "dist", // Output directory for builds
  },
  server: {
    open: true, // Auto-open browser on dev server start
  },
});
