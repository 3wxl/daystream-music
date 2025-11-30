import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
console.log('vite-plugin-pages 生成的路由：', routes)
export default router
