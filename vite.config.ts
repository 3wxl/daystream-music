import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 1. 引入 vite-plugin-pages 插件
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [
    // 2. 配置自动路由插件（放在 vue() 之前）
    Pages({
      dirs: [
        // 指定页面存放目录（与之前的 src/views 保持一致）
        { dir: 'src/views', baseRoute: '' },
      ],
      // 可选：配置路由生成规则（如文件名是否转小写等）
      extendRoute(route) {
        // 示例：给所有路由添加 meta.title
        if (route.path === '/') {
          route.meta = { ...route.meta, title: '首页' }
        }
        return route
      },
    }),
    vue(),
    vueDevTools(),
    AutoImport({
      // 自动导入的目标库
      imports: [
        'vue', // 自动导入 Vue 的 API（ref、reactive、onMounted 等）
        'vue-router', // 自动导入 VueRouter 的 API（useRouter、useRoute 等）
        'pinia', // 自动导入 Pinia 的 API（defineStore 等，若使用 Pinia）
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // 启用 ESLint 配置生成
        globalsPropValue: true, // 将声明的变量标记为全局变量
        filepath: './.eslintrc-auto-import.json', // 生成的 ESLint 配置文件路径
      },
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
      // 生成组件类型声明文件（可选，建议开启）
      dts: 'src/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
