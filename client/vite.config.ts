import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const SERVER_URL = `${env.VITE_REACT_APP_BACKEND_URL ?? "http://localhost:3000"}`;
  return {
    server: {
      proxy: {
        "/api": {
          target: SERVER_URL,
          changeOrigin: true,
        },
        "/socket.io": {
          target: SERVER_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    plugins: [react()],
  };
});
