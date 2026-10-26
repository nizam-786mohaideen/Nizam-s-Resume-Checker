import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Standalone local dev only; production uses Vercel's same-origin /api rewrite.
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
