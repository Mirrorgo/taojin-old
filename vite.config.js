const { resolve } = require("path");
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        //用于配置多页面应用
        main: resolve(__dirname, "index.html"), //http://localhost:3000 和 http://localhost:3000/index.html 都可以访问
        nested: resolve(__dirname, "/taojin/options.html"), //http://localhost:3000/taojin/options.html
      },
    },
  },
});
