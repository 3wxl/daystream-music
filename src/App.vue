<template>
  <component :is="layoutComponent">
    <router-view></router-view>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 1. 导入布局
import MainLayout from './layouts/MainLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import MusicianLayout from './layouts/MusicianLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'
const route = useRoute()

// 2. 注册布局
const layouts = {
  main: MainLayout,
  auth: AuthLayout,
  admin: AdminLayout,
  musician: MusicianLayout,
  empty: EmptyLayout,
}

// 3. 核心逻辑
const layoutComponent = computed(() => {
  // 手动从 route.matched 数组中合并所有 meta
  // (这是 vue-router 内部本该做的事)
  const mergedMeta = route.matched.reduce((acc, record) => {
    return Object.assign(acc, record.meta)
  }, {})

  // 现在 mergedMeta 包含了 { layout: 'auth' }
  const layoutName = mergedMeta.layout || 'main'

  // 返回正确的布局
  return layouts[layoutName]
})
</script>
