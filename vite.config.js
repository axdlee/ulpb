import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ],

  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@views': resolve(__dirname, 'src/views'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@core': resolve(__dirname, 'src/core'),
      '@data': resolve(__dirname, 'src/data')
    },
  },

  // 开发服务器配置
  server: {
    port: 1420,
    strictPort: true,
    host: true,
    hmr: {
      overlay: true
    }
  },

  // 预览服务器配置
  preview: {
    port: 1421,
    strictPort: true
  },

  // 环境变量前缀
  envPrefix: ['VITE_', 'TAURI_'],

  // 构建配置
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['chart.js'],
          utils: ['pinyin-pro']
        }
      }
    },
    // 优化构建性能
    chunkSizeWarningLimit: 1000
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'chart.js', 'pinyin-pro'],
    exclude: ['@tauri-apps/api']
  },

  // CSS 配置
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // 清屏配置
  clearScreen: false
}) 