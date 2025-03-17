import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./public/manifest.json";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: manifest,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,png,jpg}"],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // ✅ Increases limit to 6MB
      },
    }),
  ],
});
