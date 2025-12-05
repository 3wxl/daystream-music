<template>
  <section class="animate-fade-in-up" :style="{ animationDelay: animationDelay }">
    <div class="mb-4">
      <h2
        class="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent mb-2"
      >
        任务中心
      </h2>
      <p class="text-gray-400 text-sm">完成任务获取更多音浪</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- 任务卡片 -->
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 relative"
        :class="{ 'opacity-70': task.completed, 'neon-border': !task.completed }"
        @click="handleTaskClick(task)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-3 flex-1">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="
                task.completed ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'
              "
            >
              <i class="iconfont" v-html="task.icon" style="font-size: 20px"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-white text-sm mb-1">{{ task.title }}</h3>
              <p class="text-gray-400 text-xs">{{ task.description }}</p>
            </div>
          </div>

          <div
            class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            :class="
              task.completed ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'
            "
          >
            <span>+{{ task.reward }}</span>
            <i class="fas fa-music text-xs"></i>
          </div>
        </div>

        <button
          class="w-full py-2 rounded-lg text-sm font-medium transition-all duration-300"
          :class="
            task.completed
              ? 'bg-gray-700 text-gray-400 cursor-default'
              : 'bg-gradient-to-r from-pink-500 to-pink-300 text-white hover:shadow-lg hover:shadow-pink-500/25'
          "
          :disabled="task.completed"
        >
          {{ task.completed ? '已完成' : '立即完成' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Task } from '@/types/checkIn/index.ts'

interface Props {
  tasks: Task[]
  animationDelay?: string
}

withDefaults(defineProps<Props>(), {
  animationDelay: '0.2s',
})

const emit = defineEmits<{
  'complete-task': [task: Task]
}>()

const handleTaskClick = (task: Task) => {
  if (task.completed) return
  emit('complete-task', task)
}
</script>

<style scoped>
.neon-border {
  position: relative;
}

.neon-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(135deg, #ec4899, #f472b6, #ec4899);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.neon-border:hover::before {
  opacity: 1;
}
</style>
