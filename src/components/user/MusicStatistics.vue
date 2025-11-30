<template>
  <section id="stats" class="lg:col-span-1">
    <div class="flex items-center">
      <img src="../../assets/headphones-11207_256.gif" alt="" class="w-20" />
      <h3 class="text-white font-semibold text-lg">音乐统计</h3>
    </div>
    <div class="bg-dark/30 rounded-xl p-6 border border-gray-800">
      <h3 class="text-lg font-semibold mb-4">本周聆听时长</h3>
      <div class="h-64 mb-6">
        <canvas ref="listeningChart"></canvas>
      </div>

      <div
        class="space-y-4 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-colors"
      >
        <div v-for="(item, index) in musicTypes" :key="index">
          <div class="flex justify-between mb-1">
            <span class="text-sm">{{ item.name }}</span>
            <span class="text-sm" :style="{ color: item.color }">{{ item.percent }}%</span>
          </div>
          <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :style="{ width: item.percent + '%', backgroundColor: item.color }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, withDefaults } from 'vue'
import { Chart, registerables, ChartConfiguration } from 'chart.js'

Chart.register(...registerables)

interface MusicType {
  name: string
  color: string
  percent: number
}

const musicTypes: MusicType[] = [
  { name: '流行', color: '#6C5CE7', percent: 18 },
  { name: '摇滚', color: '#ee3b9e', percent: 12 },
  { name: '电子', color: '#4ade80', percent: 8 },
  { name: '古典', color: '#60a5fa', percent: 6 },
  { name: '伤感', color: '#8A2BE2', percent: 7 },
  { name: '励志', color: '#FFD700', percent: 5 },
  { name: '古筝', color: '#DAA520', percent: 3 },
  { name: '吉他', color: '#A0522D', percent: 4 },
  { name: '咖啡馆', color: '#CD853F', percent: 3 },
  { name: '唢呐', color: '#B22222', percent: 2 },
  { name: '夜店', color: '#FF00FF', percent: 5 },
  { name: '大提琴', color: '#2F4F4F', percent: 3 },
  { name: '学习工作', color: '#32CD32', percent: 6 },
  { name: '安静', color: '#87CEEB', percent: 4 },
  { name: '宣泄', color: '#FF6347', percent: 3 },
  { name: '寂寞', color: '#9370DB', percent: 2 },
  { name: '小提琴', color: '#7B68EE', percent: 3 },
  { name: '尤克里里', color: '#FFA500', percent: 2 },
  { name: '快乐', color: '#FFFF00', percent: 4 },
  { name: '思念', color: '#FF69B4', percent: 2 },
  { name: '旅行', color: '#00CED1', percent: 3 },
  { name: '架子鼓', color: '#808080', percent: 2 },
  { name: '民谣', color: '#D2B48C', percent: 4 },
  { name: '治愈', color: '#98FB98', percent: 5 },
  { name: '派对', color: '#FF4500', percent: 3 },
  { name: '爵士', color: '#20B2AA', percent: 2 },
  { name: '甜蜜', color: '#FFB6C1', percent: 3 },
  { name: '睡前', color: '#6A5ACD', percent: 4 },
  { name: '说唱', color: '#0000FF', percent: 2 },
  { name: '贝斯', color: '#4B0082', percent: 1 },
  { name: '跳舞', color: '#FF1493', percent: 3 },
  { name: '轻音乐', color: '#F0E68C', percent: 4 },
  { name: '运动', color: '#DC143C', percent: 3 },
  { name: '钢琴', color: '#B0C4DE', percent: 4 },
  { name: '驾车', color: '#228B22', percent: 3 },
]

const listeningChart = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  initListeningChart()
})

const initListeningChart = () => {
  const canvasElement = listeningChart.value
  if (!canvasElement) return

  const ctx2d = canvasElement.getContext('2d')
  if (!ctx2d) return
  const pink400 = '#f472b6'
  const pink400Opacity = 'rgba(244, 114, 182, 0.1)'
  const chartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [
        {
          label: '小时',
          data: [2.5, 1.8, 3.2, 2.1, 4.5, 5.2, 3.8],
          borderColor: pink400,
          backgroundColor: pink400Opacity,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: pink400,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
    },
  }

  new Chart(ctx2d, chartConfig)
}

const props = withDefaults(
  defineProps<{
    showChart?: boolean
    chartHeight?: string
  }>(),
  {
    showChart: true,
    chartHeight: 'h-64',
  },
)
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.8);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
</style>
