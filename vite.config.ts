import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mkcert(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  server: {
    host: true,
    // port: 8080,
    https: true as any, // 👈 safe cast for mkcert
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
