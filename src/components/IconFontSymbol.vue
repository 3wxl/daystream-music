<template>
  <el-icon :size="size" :color="color">
    <!-- 核心：通过 SVG Symbol 引用阿里图标 -->
    <svg aria-hidden="true">
      <use :xlink:href="`#icon-${name}`"></use>
    </svg>
  </el-icon>
</template>

<script setup lang="ts">
// 定义组件属性
const props = defineProps<{
  // 图标名称（阿里图标库中 Symbol 图标的 ID，无需加 "icon-" 前缀）
  name: string
  size?: number | string
  color?: string
}>()
</script>

<style scoped>
svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
