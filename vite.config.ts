import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// import kiểu từ terser để ép kiểu chính xác
import type { MinifyOptions as TerserMinifyOptions } from 'terser'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      brotliSize: true
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { lossless: false, quality: 80 }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/configs': path.resolve(__dirname, './src/configs'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    sourcemap: false,
    minify: 'terser', // dùng terser để terserOptions có tác dụng
    chunkSizeWarningLimit: 3000,
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    cssMinify: 'lightningcss',
    // ép kiểu object này sang MinifyOptions của terser
    terserOptions: ({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      // terser v5+ dùng `format` thay vì `output`
      format: {
        comments: false
      }
    } as unknown) as TerserMinifyOptions,
    rollupOptions: {
      treeshake: 'recommended',
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          // ... (giữ nguyên các manualChunks của bạn)
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      'framer-motion',
      'class-variance-authority',
      'axios',
      '@tanstack/react-query',
      '@iconify/react'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
