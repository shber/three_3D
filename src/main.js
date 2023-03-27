/*
 * @Author: Shber
 * @Date: 2023-03-27 11:31:14
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-27 11:48:42
 * @Description: 
 */
import { createApp } from 'vue'
import '@/style/common.css'
import App from './App.vue'
import router from '@/router/index'

createApp(App).use(router).mount('#app')
