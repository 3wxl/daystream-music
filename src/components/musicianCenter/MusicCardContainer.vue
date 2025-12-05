<template>
  <div class="min-h-screen overflow-hidden ] relative">
    <div class="container mx-auto px-4 py-12 relative">
      <!-- 卡片列表容器 -->
      <div class="card-stack my-24 relative min-h-[600px] ml-[-10rem]">
        <MusicCardItem
          v-for="(card, index) in cardData"
          :key="card.id"
          :card-info="card"
          :card-style="getCardStyle(card, index)"
          @mouse-enter="handleMouseEnter(card)"
          @mouse-leave="handleMouseLeave(card)"
        />
      </div>

      <!-- 右侧文案+按钮区域 -->
      <div class="absolute right-45 top-1/2 transform -translate-y-1/2 max-w-md">
        <h3 class="text-9xl font-bold leading-none mb-6 text-pink-400">6亿</h3>
        <p class="text-3xl font-medium mb-8 text-white">观众期待着看见你的音乐</p>
        <button
          class="bg-pink-400 text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-pink-300 transition-all shadow-lg shadow-pink-400/30 overflow-hidden relative"
        >
          <router-link to="/Musician/MusicianJoin">
            <span class="relative z-10">立即入驻</span>
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import MusicCardItem from './MusicCardItem.vue'

// 1. 定义Props（接收父组件传递的cardData）
const props = defineProps({
  cardData: {
    type: Array,
    required: true,
    // 类型校验：确保数组每项符合格式
    validator: (value) => {
      return value.every(
        (item) =>
          item.hasOwnProperty('id') &&
          item.hasOwnProperty('image') &&
          typeof item.isHovered === 'boolean',
      )
    },
  },
})

// 2. 卡片样式计算逻辑
const getCardStyle = (card, index) => {
  const startX = window.innerWidth / 2 + 400
  const startY = -100
  const endX = -300
  const endY = window.innerHeight - 100

  const stepX = (endX - startX) / (props.cardData.length - 2)
  const stepY = (endY - startY) / (props.cardData.length - 5)

  const finalX = startX + index * stepX
  const finalY = startY + index * stepY

  const tx = -100 + Math.random() * 200
  const ty = -100 + Math.random() * 200
  const rot = -30 + Math.random() * 60

  return {
    left: `${finalX}px`,
    top: `${finalY}px`,
    transform: `translate(-50%, -50%) skew(0deg, 10deg)`,
    zIndex: index + 1,
    transition: `all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) ${index * 0.001}s`,
    opacity: '1',
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    '--rot': `${rot}deg`,
    '--fx': `${finalX}px`,
    '--fy': `${finalY}px`,
    '--rot-end': `${index * 1}deg`,
  }
}

// 3. 鼠标事件处理（回传修改父组件数据）
const handleMouseEnter = (card) => {
  card.isHovered = true
}
const handleMouseLeave = (card) => {
  card.isHovered = false
}

// 4. 入场动画触发
const triggerCardEnter = () => {
  props.cardData.forEach((card, index) => {
    setTimeout(() => {
      card.hasEntered = true
    }, index * 100)
  })
}

// 5. 随机Hover效果
let hoverInterval = null
const triggerRandomHover = () => {
  const randomIndex = Math.floor(Math.random() * props.cardData.length)
  const card = props.cardData[randomIndex]
  card.isHovered = true
  setTimeout(() => {
    card.isHovered = false
  }, 2000)
}

onMounted(() => {
  setTimeout(triggerCardEnter, 500)
  setTimeout(() => {
    hoverInterval = setInterval(triggerRandomHover, 3000)
  }, 1000)
})

onUnmounted(() => {
  if (hoverInterval) clearInterval(hoverInterval)
})
</script>

<style lang="scss" scoped>
:deep(button)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(to top, #f37bb7, #eda5ce);
  z-index: 0;
  transition: height 0.5s ease-out;
}

:deep(button:hover)::after {
  height: 100%;
}

button:hover span {
  color: #1a1a1a;
  transition: color 0.3s ease;
}
</style>
