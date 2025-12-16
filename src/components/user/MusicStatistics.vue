<template>
  <section id="stats" class="lg:col-span-1">
    <div class="flex items-center">
      <img src="../../assets/headphones-11207_256.gif" alt="" class="w-20" />
      <h3 class="text-white font-semibold text-lg">音乐统计</h3>
    </div>
    <div class="bg-dark/30 rounded-xl p-6 border border-gray-800">
      <!-- 加载状态 -->
      <div v-if="props.loading" class="h-[400px] flex items-center justify-center"></div>

      <!-- 加载完成后内容 -->
      <div v-else class="space-y-6">
        <!-- 本周听歌时长 -->
        <div>
          <h3 class="text-lg font-semibold mb-4">本周听歌时长</h3>
          <div class="h-64 mb-6 relative">
            <canvas ref="listeningChart"></canvas>
          </div>
        </div>

        <!-- 音乐标签占比（显示所有34个标签，percent均为0） -->
        <div
          class="space-y-4 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 transition-colors"
        >
          <div v-for="(item, index) in props.musicTagRatio" :key="index">
            <div class="flex justify-between mb-1">
              <span class="text-sm">{{ item.tagName }}</span>
              <span class="text-sm" :style="{ color: getTagColor(index) }">
                {{ (item.ratio || 0).toFixed(1) }}%
              </span>
            </div>
            <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{ width: (item.ratio || 0) + '%', backgroundColor: getTagColor(index) }"
              ></div>
            </div>
          </div>

          <!-- 无接口数据时显示所有34个标签，percent均为0 -->
          <div v-if="props.musicTagRatio.length === 0">
            <div v-for="(item, index) in defaultMusicTypes" :key="index">
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { ChartConfiguration } from 'chart.js'
import type { MusicTagRatioVO } from '@/types/personalCenter/index'

Chart.register(...registerables)

const props = withDefaults(
  defineProps<{
    dailyListenDuration: number[] // 每日听歌时长（分钟）
    dailyListenSeconds: number[] // 每日听歌时长（原始秒数，用于tooltip）
    musicTagRatio: MusicTagRatioVO[]
    loading: boolean
    showChart?: boolean
    chartHeight?: string
  }>(),
  {
    showChart: true,
    chartHeight: 'h-64',
    dailyListenDuration: () => [0, 0, 0, 0, 0, 0, 0],
    dailyListenSeconds: () => [0, 0, 0, 0, 0, 0, 0],
    musicTagRatio: () => [],
    loading: false,
  },
)

/**
 * 将秒数转换为友好的文本格式（用于tooltip）
 */
const formatDurationText = (seconds: number) => {
  if (seconds === 0) return '0分钟'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}小时${minutes}分`
  } else {
    return `${minutes}分钟`
  }
}

// ========== 关键修改：完整添加34个音乐标签，percent均为0 ==========
// 兜底的默认音乐类型（包含所有34个标签，percent=0，颜色循环使用）
interface DefaultMusicType {
  name: string
  color: string
  percent: number
}
const defaultMusicTypes: DefaultMusicType[] = [
  { name: '流行', color: '#6C5CE7', percent: 0 },
  { name: '电子', color: '#ee3b9e', percent: 0 },
  { name: '轻音乐', color: '#4ade80', percent: 0 },
  { name: '说唱', color: '#60a5fa', percent: 0 },
  { name: '民谣', color: '#8A2BE2', percent: 0 },
  { name: '摇滚', color: '#FFD700', percent: 0 },
  { name: '爵士', color: '#DAA520', percent: 0 },
  { name: '伤感', color: '#A0522D', percent: 0 },
  { name: '快乐', color: '#6C5CE7', percent: 0 },
  { name: '安静', color: '#ee3b9e', percent: 0 },
  { name: '励志', color: '#4ade80', percent: 0 },
  { name: '治愈', color: '#60a5fa', percent: 0 },
  { name: '思念', color: '#8A2BE2', percent: 0 },
  { name: '甜蜜', color: '#FFD700', percent: 0 },
  { name: '寂寞', color: '#DAA520', percent: 0 },
  { name: '宣泄', color: '#A0522D', percent: 0 },
  { name: '夜店', color: '#6C5CE7', percent: 0 },
  { name: '学习工作', color: '#ee3b9e', percent: 0 },
  { name: '咖啡馆', color: '#4ade80', percent: 0 },
  { name: '运动', color: '#60a5fa', percent: 0 },
  { name: '睡前', color: '#8A2BE2', percent: 0 },
  { name: '旅行', color: '#FFD700', percent: 0 },
  { name: '跳舞', color: '#DAA520', percent: 0 },
  { name: '派对', color: '#A0522D', percent: 0 },
  { name: '驾车', color: '#6C5CE7', percent: 0 },
  { name: '钢琴', color: '#ee3b9e', percent: 0 },
  { name: '吉他', color: '#4ade80', percent: 0 },
  { name: '贝斯', color: '#60a5fa', percent: 0 },
  { name: '架子鼓', color: '#8A2BE2', percent: 0 },
  { name: '小提琴', color: '#FFD700', percent: 0 },
  { name: '大提琴', color: '#DAA520', percent: 0 },
  { name: '古筝', color: '#A0522D', percent: 0 },
  { name: '唢呐', color: '#6C5CE7', percent: 0 },
  { name: '尤克里里', color: '#ee3b9e', percent: 0 },
]

// 生成标签颜色（备用，默认数据已直接配置颜色）
const tagColors = [
  '#6C5CE7',
  '#ee3b9e',
  '#4ade80',
  '#60a5fa',
  '#8A2BE2',
  '#FFD700',
  '#DAA520',
  '#A0522D',
]
const getTagColor = (index: number) => {
  return tagColors[index % tagColors.length]
}

// 图表相关
const listeningChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const initOrUpdateChart = () => {
  if (props.loading || !props.showChart || !listeningChart.value) return

  const ctx2d = listeningChart.value.getContext('2d')
  if (!ctx2d) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const pink400 = '#f472b6'
  const pink400Opacity = 'rgba(244, 114, 182, 0.1)'

  const chartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [
        {
          label: '听歌时长（分钟）',
          data:
            props.dailyListenDuration.length === 7
              ? props.dailyListenDuration
              : [0, 0, 0, 0, 0, 0, 0],
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
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex
              const seconds = props.dailyListenSeconds[index] || 0
              return `听歌时长：${formatDurationText(seconds)}`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          // 全0时Y轴最大值设为5，确保0能清晰显示
          max:
            Math.max(...props.dailyListenDuration) > 0
              ? Math.max(...props.dailyListenDuration) * 1.2
              : 5,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            precision: 1,
            // Y轴标签显示单位，全0时会显示"0 分钟"
            callback: (value) => {
              return `${value} 分钟`
            },
          },
        },
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)' },
        },
      },
      interaction: { intersect: false, mode: 'index' },
    },
  }

  chartInstance = new Chart(ctx2d, chartConfig)
}

// 监听逻辑
watch(
  () => [props.loading, props.dailyListenDuration, props.dailyListenSeconds, props.musicTagRatio],
  () => {
    if (!props.loading) {
      nextTick(() => {
        initOrUpdateChart()
      })
    }
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (!props.loading) {
    nextTick(() => {
      initOrUpdateChart()
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
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

.h-\[400px\] {
  height: 400px;
}

.relative {
  position: relative;
}

// 优化滚动容器样式，34个标签可正常滚动
.space-y-4 {
  gap: 1rem;
}
</style>
