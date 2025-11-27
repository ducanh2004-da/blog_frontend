import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";

// import kiểu từ terser để ép kiểu chính xác
import type { MinifyOptions as TerserMinifyOptions } from "terser";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "EduSocial",
        short_name: "eduSocial",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: [
          { src: "icon.png", sizes: "192x192", type: "image/png" },
          { src: "icon2.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,png}"],
        globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/v1\/forecast.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "open-meteo-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 30, // 30 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    // visualizer({
    //   open: false,
    //   brotliSize: true
    // }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/stores": path.resolve(__dirname, "./src/stores"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/configs": path.resolve(__dirname, "./src/configs"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/types": path.resolve(__dirname, "./src/types"),
    },
  },
  build: {
    sourcemap: false,
    minify: "terser", // dùng terser để terserOptions có tác dụng
    chunkSizeWarningLimit: 3000,
    target: "es2020",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    cssMinify: "lightningcss",
    // ép kiểu object này sang MinifyOptions của terser
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
      },
      // terser v5+ dùng `format` thay vì `output`
      format: {
        comments: false,
      },
    } as unknown as TerserMinifyOptions,
    rollupOptions: {
      treeshake: "recommended",
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom", "zustand"],
          // ... (giữ nguyên các manualChunks của bạn)
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "gsap",
      "framer-motion",
      "class-variance-authority",
      "axios",
      "@tanstack/react-query",
      "@iconify/react",
    ],
    esbuildOptions: {
      target: "es2020",
    },
  },
});
