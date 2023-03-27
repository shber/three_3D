/*
 * @Author: Shber
 * @Date: 2023-03-27 11:31:14
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 11:37:50
 * @Description: 
 */
import { defineConfig } from 'vite'
import * as path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //设置别名
    alias: {
        '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [vue()],
})
