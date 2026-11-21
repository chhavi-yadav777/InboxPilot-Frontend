import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/emails": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/chat": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/chats": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/users": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/health": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
