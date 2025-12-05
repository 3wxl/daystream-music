<template>
  <div
    class="bg-gradient-to-br from-white/70 to-pink-50/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center text-center group hover:from-white/80 hover:to-pink-100/60 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,105,180,0.2)] animate-fadeIn border border-pink-200/30 hover:border-pink-300/50"
    :style="{ animationDelay: `${delay}ms` }"
  >
    <!-- 图标容器 -->
    <div class="relative mb-6">
      <!-- 主圆形背景（柔和的渐变） -->
      <div
        class="w-32 h-32 rounded-full bg-gradient-to-br from-[#F6A8BD] via-[#FFCBE6] to-[#D8CAE5] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-pink-300/30 group-hover:shadow-pink-400/50"
      >
        <!-- Iconfont 图标 -->
        <i :class="['iconfont', iconClass, 'text-3xl text-white/95']" style="font-size: 57px"></i>
      </div>

      <!-- 小圆形标记 -->
      <div
        class="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-gradient-to-br from-white to-pink-100 flex items-center justify-center shadow-lg border border-pink-200 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12"
      >
        <i
          :class="['iconfont', markerIconClass, 'text-sm text-pink-600']"
          style="font-size: 25px"
        ></i>
      </div>
    </div>

    <!-- 标题和描述 -->
    <h3
      class="text-xl font-bold mb-3 bg-pink-900 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-500"
    >
      {{ title }}
    </h3>
    <p
      class="text-gray-600/80 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-500"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    default: 'icon-tubiao-',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

// 根据索引选择不同的图标方案
const iconClass = computed(() => {
  const icons = [
    'icon-shuidi', // 默认图标
    'icon-yonghu', // 用户图标
    'icon-diqiu', // 地球图标
  ]
  return icons[props.index % icons.length]
})

// 小标记图标
const markerIconClass = computed(() => {
  const markers = ['icon-up', 'icon-xingxing', 'icon-yinyue']
  return markers[props.index % markers.length]
})

// 渐入动画延迟（交错效果）
const delay = computed(() => {
  return props.index * 150 // 每个卡片间隔150ms
})

// 卡片颜色方案（可选，如果需要进一步定制）
const cardGradient = computed(() => {
  const gradients = [
    'from-rose-400 via-pink-400 to-purple-400', // 粉紫色系
    'from-sky-400 via-blue-400 to-indigo-400', // 蓝紫色系
    'from-emerald-400 via-teal-400 to-cyan-400', // 青绿色系
    'from-amber-400 via-orange-400 to-red-400', // 橙红色系
    'from-violet-400 via-purple-400 to-fuchsia-400', // 紫粉色系
    'from-rose-300 via-pink-300 to-red-400', // 粉红色系
  ]
  return gradients[props.index % gradients.length]
})
</script>

<style scoped>
.animate-fadeIn {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: fadeInUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  70% {
    transform: translateY(-5px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 悬浮效果增强 */
.group {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    transform: translateY(-8px);
  }
}

/* Iconfont 样式修复 */
.iconfont {
  font-family: 'iconfont' !important;
  font-size: inherit;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-shuidi::before {
  content: '\e7cf';
}
.icon-up::before {
  content: '\e750';
}
.icon-yonghu::before {
  content: '\e788';
}
.icon-diqiu::before {
  content: '\e6d6';
}
.icon-yinyue::before {
  content: '\e7fe';
}
.icon-xingxing::before {
  content: '\e661';
}
</style>
