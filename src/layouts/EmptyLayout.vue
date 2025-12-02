<!-- layouts/EmptyLayout.vue -->
<template>
  <!-- 空布局：仅包含内容插槽，无导航栏、页脚 -->
  <div class="empty-layout">
    <main class="min-h-screen bg-white">
      <!-- 继承全局白色背景 -->
      <router-view />
      <!-- 渲染认证页面内容 -->
    </main>
  </div>
</template>

<style scoped></style>
