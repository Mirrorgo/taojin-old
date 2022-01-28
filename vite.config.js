const { resolve } = require("path");
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr"; //svg使用方法:https://www.npmjs.com/package/vite-plugin-svgr
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        //用于配置多页面应用
        main: resolve(__dirname, "index.html"), //http://localhost:3000 和 http://localhost:3000/index.html 都可以访问,仅用于方便开发
        popup: resolve(__dirname, "./taojin/popup/index.html"), //http://localhost:3000/taojin/popup/index.html
        options: resolve(__dirname, "./taojin/options/index.html"), //http://localhost:3000/taojin/options/index.html
        searchbar: resolve(__dirname, "./taojin/searchbar/index.html"), //http://localhost:3000/taojin/searchbar/index.html
        collections: resolve(__dirname, "./taojin/collections/index.html"), //http://localhost:3000/taojin/searchbar/index.html
      },
    },
  },
});
