import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createProxy } from './build/proxy'

const VITE_PORT = 3001
const VITE_PROXY = [
  ['/api-sso', 'https://sso.farmthailand.app'],
  ['/api-main', 'https://stg-api.checkwolrd.com/api']
]

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
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
