<template>
  <!-- 借助 el-icon 统一处理尺寸和颜色 -->
  <el-icon :size="size" :color="color">
    <!-- 核心：通过 SVG Symbol 引用阿里图标 -->
    <svg aria-hidden="true">
      <!-- xlink:href 格式：#icon-图标名称（阿里图标库中的 Symbol ID） -->
      <use :xlink:href="`#icon-${name}`"></use>
    </svg>
  </el-icon>
</template>

<script setup lang="ts">
// 定义组件属性
const props = defineProps<{
  // 图标名称（阿里图标库中 Symbol 图标的 ID，无需加 "icon-" 前缀）
  name: string
  // 图标尺寸（继承 el-icon 的 size 属性）
  size?: number | string
  // 图标颜色（继承 el-icon 的 color 属性）
  color?: string
}>()
</script>

<style scoped>
/* 基础样式：确保 SVG 图标自适应尺寸 */
svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em; /* 对齐文字基线 */
  overflow: hidden;
}
</style>
