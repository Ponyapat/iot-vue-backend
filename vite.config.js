import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createProxy } from './build/proxy'

const VITE_PORT = 3001
const VITE_PROXY = [
  ['/api-sso', 'https://stg-sso.iotaxons.com'],
  ['/api-core', 'https://stg-core.iotaxons.com/api/core'],
  ['/api-main', 'https://stg-api.iotaxons.com/api']
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'esnext',
      esmExternals: true
    },
    server: {
      https: false,
      port: VITE_PORT,
      proxy: mode === 'development' ? createProxy(VITE_PROXY) : null
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  }
})
