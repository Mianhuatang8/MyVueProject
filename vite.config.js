import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
   //自动打开端口
   server:{
    host:'0.0.0.0',
    port:8080,
    open:true
  },
  devServer: {
      // historyApiFallback: true,
    //配置代理跨域
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
