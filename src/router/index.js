/*
 * @Author: Shber
 * @Date: 2023-03-27 11:41:55
 * @LastEditors: Shber
 * @LastEditTime: 2023-03-28 10:57:23
 * @Description: 
 */
import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  {
    path: '',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
  },
  {
    path: '/demo1',
    name: 'demo1',
    component: () => import('@/views/bufferGeometry/index.vue'),
  },
  {
    path: '/styleModel',
    name: 'styleModel',
    component: () => import('@/views/styleModel/index.vue'),
  },
  {
    path: '/earth',
    name: 'earth',
    component: () => import('@/views/earth/index.vue'),
  },
  {
    path: '/house',
    name: 'house',
    component: () => import('@/views/house/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router