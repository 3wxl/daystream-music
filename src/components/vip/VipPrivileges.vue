<template>
  <div class="mb-12">
    <div class="flex items-center justify-between mb-8">
      <div class="space-y-2">
        <h2
          class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent"
        >
          VIP尊享特权
        </h2>
        <p class="text-gray-300 text-lg">开通VIP，解锁更多专属功能</p>
      </div>
      <el-button
        type="primary"
        class="bg-gradient-to-r from-pink-500 to-pink-300 border-none hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        @click="emit('scrollToPackages')"
        style="border: none"
      >
        <i class="iconfont icon-vip mr-2 text-lg">&#xe640;</i>
        立即开通
      </el-button>
    </div>

    <!-- 特权卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-60">
      <div
        v-for="privilege in filteredPrivileges"
        :key="privilege.id"
        class="relative group cursor-pointer"
        @click="handlePrivilegeClick(privilege)"
        @mouseenter="activePrivilege = privilege.id"
        @mouseleave="activePrivilege = null"
      >
        <!-- 3D卡片效果 -->
        <div class="relative h-full perspective-800">
          <div
            class="relative h-full transform-style-3d transition-transform duration-700"
            :class="{ 'rotate-y-180': activePrivilege === privilege.id }"
          >
            <!-- 卡片正面 -->
            <div
              class="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-lg border border-white/10 rounded-2xl p-6 overflow-hidden vip-card"
            >
              <!-- 背景装饰 -->
              <div
                class="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl"
              ></div>
              <div
                class="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"
              ></div>

              <!-- 图标区域 -->
              <div class="relative mb-5">
                <div
                  class="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-all duration-300"
                >
                  <i
                    :class="`iconfont ${privilege.icon} text-2xl ${getIconColor(privilege.id)}`"
                    style="font-size: 32px"
                  ></i>
                </div>
                <div
                  class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md"
                >
                  <i class="iconfont icon-check text-xs text-white"></i>
                </div>
              </div>

              <!-- 标题和描述 -->
              <div class="space-y-2">
                <h3
                  class="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300"
                >
                  {{ privilege.title }}
                </h3>
                <p
                  class="text-gray-300 text-xs leading-relaxed group-hover:text-gray-200 transition-colors duration-300"
                >
                  {{ privilege.description }}
                </p>
              </div>

              <!-- 悬浮提示 -->
              <div
                class="absolute bottom-5 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
              >
                <span
                  class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs border border-purple-500/30"
                >
                  <i class="iconfont icon-magic text-xs"></i>
                  VIP专属特权
                </span>
              </div>
            </div>

            <!-- 卡片背面（全新设计） -->
            <div
              class="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 overflow-hidden vip-card-back"
              style="transform: rotateY(180deg)"
            >
              <!-- 背景装饰线条 -->
              <div class="absolute inset-0 overflow-hidden">
                <div
                  class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                ></div>
                <div
                  class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                ></div>
                <div
                  class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
                ></div>
              </div>

              <!-- 顶部装饰 -->
              <div class="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div
                  class="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                ></div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-yellow-300"></div>
                  <div class="w-2 h-2 rounded-full bg-pink-400"></div>
                  <div class="w-2 h-2 rounded-full bg-purple-400"></div>
                </div>
                <div
                  class="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                ></div>
              </div>

              <!-- 主要内容区 -->
              <div
                class="relative h-full flex flex-col justify-center items-center text-center space-y-4"
              >
                <!-- 中心徽章 -->
                <div class="relative mb-4">
                  <div class="relative">
                    <!-- 外层光环 -->
                    <div
                      class="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-md animate-spin-slow"
                    ></div>
                    <!-- 中心圆环 -->
                    <div
                      class="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/10 flex items-center justify-center"
                    >
                      <i
                        class="iconfont icon-diamond text-[35px] text-white"
                        style="font-size: 35px"
                      ></i>
                    </div>
                  </div>
                </div>

                <!-- 特权名称 -->
                <div>
                  <h4 class="text-base font-bold text-white mb-2">{{ privilege.title }}</h4>
                  <div
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10"
                  >
                    <i class="iconfont icon-crown text-xs text-yellow-400"></i>
                    <span class="text-xs text-gray-300">尊享特权</span>
                  </div>
                </div>

                <!-- 特权描述 -->
                <div class="px-2">
                  <p class="text-xs text-gray-400 leading-relaxed">
                    解锁{{ privilege.title }}全部功能，享受极致体验
                  </p>
                </div>
              </div>

              <!-- 底部装饰 -->
              <div class="absolute bottom-4 left-4 right-4">
                <div class="flex items-center justify-center gap-1">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <div class="px-2">
                    <i class="iconfont icon-vip text-xs text-yellow-400"></i>
                  </div>
                  <div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute -inset-3 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
        ></div>

        <div class="absolute -inset-3 border-2 border-transparent rounded-2xl pointer-events-none">
          <div
            class="absolute inset-0 border border-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
            :style="{
              animation: activePrivilege === privilege.id ? 'pulse 2s infinite' : 'none',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { VipPrivilege } from '@/types/vip/vipExchange'

interface Props {
  privileges: VipPrivilege[]
}

interface Emits {
  (e: 'scrollToPackages'): void
  (e: 'showPrivilegeDetail', privilege: VipPrivilege): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 直接显示前3个特权，不做过滤
const filteredPrivileges = computed(() => {
  return props.privileges.slice(0, 3)
})

const activePrivilege = ref<number | null>(null)

const getIconColor = (privilegeId: number) => {
  const colors = ['text-purple-400', 'text-pink-400', 'text-blue-400']
  return colors[privilegeId % colors.length]
}

const handlePrivilegeClick = (privilege: VipPrivilege): void => {
  ElMessage.info({
    message: `查看${privilege.title}特权详情`,
    type: 'success',
    duration: 2000,
    customClass: 'vip-message',
  })
  emit('showPrivilegeDetail', privilege)
}
</script>

<style scoped>
/* 3D效果相关 */
.perspective-800 {
  perspective: 800px;
}

.transform-style-3d {
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.backface-hidden {
  backface-visibility: hidden;
}

/* 翻转动画 */
.rotate-y-180 {
  transform: rotateY(180deg);
}

/* 卡片悬停效果 */
.vip-card {
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.vip-card:hover {
  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(139, 92, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* 卡片背面设计 - 全新样式 */
.vip-card-back {
  box-shadow:
    0 10px 40px rgba(139, 92, 246, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 0 20px rgba(139, 92, 246, 0.05);
  background: linear-gradient(
    135deg,
    rgba(17, 24, 39, 0.95) 0%,
    rgba(31, 41, 55, 0.95) 50%,
    rgba(17, 24, 39, 0.95) 100%
  ) !important;
  border-image: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3)) 1 !important;
}

/* 脉冲动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.03);
  }
}

/* 慢速旋转动画 */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

/* 图标悬停动画 */
.group:hover .iconfont:not(.vip-card-back .iconfont) {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .perspective-800 {
    perspective: 400px;
  }

  .vip-card,
  .vip-card-back {
    padding: 1.25rem;
  }

  .text-4xl {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 2rem;
  }

  /* 移动端禁用3D翻转 */
  .transform-style-3d {
    transform-style: flat;
  }

  .rotate-y-180 {
    transform: none;
  }

  .backface-hidden {
    backface-visibility: visible;
  }

  /* 移动端改为淡入淡出效果 */
  .vip-card-back {
    transform: none !important;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .group:hover .vip-card {
    opacity: 0;
  }

  .group:hover .vip-card-back {
    opacity: 1;
  }
}

/* 自定义消息样式 */
:deep(.vip-message) {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9)) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

/* 卡片进入动画 */
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: cardFadeIn 0.6s ease-out;
}

.grid > div:nth-child(2) {
  animation-delay: 0.1s;
}

.grid > div:nth-child(3) {
  animation-delay: 0.2s;
}

/* 自定义滚动提示 */
::selection {
  background: rgba(139, 92, 246, 0.3);
  color: white;
}

/* 优雅的过渡效果 */
.vip-card-back * {
  transition: all 0.3s ease;
}

.group:hover .vip-card-back {
  box-shadow:
    0 15px 50px rgba(139, 92, 246, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 30px rgba(139, 92, 246, 0.1);
}
</style>
