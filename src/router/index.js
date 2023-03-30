/*
 * @Author: Shber
 * @Date: 2023-03-27 11:41:55
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-30 15:38:18
 * @Description: 
 */
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  {
    path: '',
    name: 'earth',
    component: () => import('@/views/earth/index.vue'),
  },
  {
    path: '/house',
    name: 'house',
    component: () => import('@/views/house/index.vue'),
  },
  {
    path: '/aero',
    name: 'aero',
    component: () => import('@/views/airtransport/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router