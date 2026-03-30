<template>
  <div class="min-h-screen font-sans antialiased text-gray-100">
    <main class="container mx-auto px-10 py-6 space-y-8">
      <!-- 顶部横幅 -->
      <BannerSection :banner-image="bannerImage" />

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <span class="ml-3 text-lg">加载中...</span>
      </div>

      <!-- 错误信息 -->
      <div
        v-else-if="error"
        class="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-center"
      >
        <p class="text-red-400">{{ error }}</p>
        <button
          @click="fetchRankData"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          重试
        </button>
      </div>

      <!-- 内容区域 -->
      <div v-else>
        <!-- 轮播图榜单区域 -->
        <ChartCarousel
          :charts="allCharts"
          :active-category-name="'全球榜单'"
          :carousel-speed="carouselSpeed"
          @play-chart="playChart"
          @play-song="playSong"
        />

        <!-- 歌手排行榜区域 -->
        <SingerRanking :singers="singers" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRankHome } from '@/api/rank'
import type { RankHomeVO, MusicianVO } from '@/types/rank'

// 响应式数据
const bannerImage = ref(
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&auto=format',
)
const carouselSpeed = ref(30) // 轮播速度（秒）
const loading = ref(true)
const error = ref('')

// 歌手数据
const singers = ref<
  Array<{
    id: number
    name: string
    avatar: string
    fans: string
    genre: string
    trend: { type: string; value: number }
    topSongs: string[]
  }>
>([])

// 所有榜单数据
const allCharts = ref<
  Array<{
    title: string
    subtitle: string
    updateTime: string
    backgroundImage: string
    gradientClass: string
    songCount: string
    topSongs: Array<{
      title: string
      artist: string
      rank: number
    }>
  }>
>([])

// 从API获取排行榜数据
const fetchRankData = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await getRankHome()
    if (!response.success) {
      throw new Error(response.errorMsg || '获取排行榜数据失败')
    }
    console.log('排行榜主页数据:', response.data)
    const data = response.data || ({} as RankHomeVO)
    // 处理榜单数据
    if (data.rankVOMap && typeof data.rankVOMap === 'object') {
      const charts = []
      // 遍历前先过滤空值
      const validRankEntries = Object.entries(data.rankVOMap).filter(
        ([_, rankVO]) => rankVO && rankVO.musicList,
      )

      for (const [key, rankVO] of validRankEntries) {
        // 跳过无效key（可选）
        if (!rankVO.name) continue

        // 处理歌曲列表：兜底空数组
        const topSongs = (rankVO.musicList || []).map((song, index) => ({
          title: song.musicName || '未知歌曲',
          artist: song.musicianName || '未知歌手',
          rank: index + 1,
        }))

        const chart = {
          title: rankVO.name || '未知榜单',
          subtitle: rankVO.description || '暂无描述',
          updateTime: formatUpdateTime(rankVO.updatedTime || new Date().toISOString()), // 修正字段名
          backgroundImage:
            topSongs.length > 0
              ? rankVO.musicList[0].coverUrl
              : 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
          gradientClass: getRandomGradient(),
          songCount: `TOP ${(rankVO.musicList || []).length}`,
          topSongs: topSongs,
        }
        charts.push(chart)
      }
      allCharts.value = charts
    }

    // 处理歌手数据：新增空值判断
    if (Array.isArray(data.musicianList)) {
      const singerList = data.musicianList
        .filter((musician) => musician?.stageName) // 过滤无效歌手
        .map((musician) => ({
          id: musician.id || Math.random(), // 兜底ID
          name: musician.stageName || '未知歌手',
          avatar: musician.avatar || '默认头像URL',
          fans: formatFansCount(musician.totalFans || 0), // 兜底0
          genre: '流行音乐',
          trend: {
            type: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)], // 扩展类型
            value: Math.floor(Math.random() * 100),
          },
          topSongs: musician.hotMusics || [], // 兜底空数组
        }))
      singers.value = singerList
    }
  } catch (err) {
    console.error('获取排行榜数据失败:', err)
    // 区分超时/普通错误
    error.value = err.message === '请求超时' ? '网络超时，请检查网络' : '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}
// 格式化更新时间
const formatUpdateTime = (updateTime?: string) => {
  if (!updateTime) return '暂无更新时间' // 兜底
  const now = new Date()
  const updateDate = new Date(updateTime)
  if (isNaN(updateDate.getTime())) return '暂无更新时间' // 无效日期兜底

  const diffMs = now.getTime() - updateDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return '刚刚更新'
  if (diffMinutes < 60) return `${diffMinutes}分钟前更新`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}小时前更新`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}天前更新`
}

// 格式化粉丝数量
const formatFansCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

// 获取随机渐变颜色
const getRandomGradient = () => {
  const gradients = [
    'bg-gradient-to-br from-blue-600/70 to-blue-400/70',
    'bg-gradient-to-br from-emerald-600/70 to-emerald-400/70',
    'bg-gradient-to-br from-cyan-600/70 to-cyan-400/70',
    'bg-gradient-to-br from-red-600/70 to-orange-500/70',
    'bg-gradient-to-br from-pink-600/70 to-pink-500/70',
    'bg-gradient-to-br from-purple-600/70 to-purple-400/70',
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

// 播放函数
const playChart = (chart) => {
  console.log('播放榜单:', chart.title)
}

const playSong = (song) => {
  console.log('播放歌曲:', song.title, '-', song.artist)
}

// 初始化
onMounted(() => {
  // 初始加载完成后获取排行榜数据
  fetchRankData()
})
</script>

<style scoped>
/* 页面级专属样式 */
main {
  margin: 0 auto;
}
</style>
