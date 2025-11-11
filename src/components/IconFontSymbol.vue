<template>
  <!-- 通过类名引用 FontClass 图标，动态绑定属性 -->
  <i
    :class="['iconfont', `icon-${name}`, customClass]"
    :style="{
      fontSize: sizeToPx,
      color: color,
      ...customStyle
    }"
    :title="title"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义组件接收的 props
const props = defineProps<{
  /** 图标 ID（对应 FontClass 的类名，无需加 'icon-' 前缀） */
  name: string
  /** 图标尺寸（支持数字/字符串，如 24、'24px'、'1.5em'） */
  size?: number | string
  /** 图标颜色（支持 CSS 颜色格式） */
  color?: string
  /** 自定义类名（用于额外样式） */
  customClass?: string
  /** 自定义样式（覆盖默认样式） */
  customStyle?: Record<string, string | number>
  /** 图标提示文本（hover 时显示） */
  title?: string
}>()

// 处理尺寸：数字自动补 px，字符串直接使用
const sizeToPx = computed(() => {
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  return props.size || '1em' // 默认继承父元素字体大小
})
</script>

<style scoped>
/* 可选：调整图标垂直对齐方式（根据实际字体微调） */
.iconfont {
  vertical-align: 0;
}
</style>
