<template>
  <div
    class="card-item absolute w-44 h-44 rounded-3xl overflow-hidden shadow-lg"
    :class="{
      hovered: cardInfo.isHovered,
      'card-enter': !cardInfo.hasEntered,
      'card-enter-active': cardInfo.hasEntered,
    }"
    :style="cardStyle"
    @mouseenter="$emit('mouse-enter')"
    @mouseleave="$emit('mouse-leave')"
  >
    <div
      class="w-full h-full bg-cover bg-center"
      :style="{ backgroundImage: `url('${cardInfo.image}')` }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 to-pink-900/20 opacity-80 rounded-3xl"
      ></div>
    </div>
  </div>
</template>

<script setup>
// 1. 定义Props（接收父组件传递的单个卡片数据和样式）
const props = defineProps({
  cardInfo: {
    type: Object,
    required: true,
    // 精准校验字段
    validator: (val) => {
      return ['id', 'image', 'isHovered', 'hasEntered'].every((key) => key in val)
    },
  },
  cardStyle: {
    type: Object,
    required: true,
  },
})

// 2. 定义事件（回传给父组件）
defineEmits(['mouse-enter', 'mouse-leave'])
</script>

<style lang="scss" scoped>
// 卡片入场/hover动画样式（独立封装）
.card-enter {
  opacity: 0;
  transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.8) !important;
}

.card-enter-active {
  opacity: 1;
  transform: translate(var(--fx), var(--fy)) rotate(var(--rot-end)) scale(1);
  transition: all 5s cubic-bezier(0.25, 1, 0.5, 1);
}

.card-item {
  transform-origin: bottom right;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform, box-shadow, z-index;
}

.card-item.hovered {
  transform: translate(calc(-50% + 70px), calc(-50% + -15px)) rotate(40deg) scale(0.95)
    skew(0deg, 5deg) !important;
  filter: brightness(1.15) saturate(1.1);
  box-shadow: 6px 7px 15px rgba(244, 114, 181, 0.253);
}
</style>
