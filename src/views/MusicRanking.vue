<template>
  <div class="min-h-screen font-sans antialiased text-gray-100">
    <main class="container mx-auto px-4 py-6 space-y-8">
      <!-- 顶部横幅 -->
      <BannerSection :banner-image="bannerImage" />

      <!-- 榜单分类标签 -->
      <ChartCategory
        :categories="chartCategories"
        :active-index="activeCategory"
        @category-change="switchCategory"
      />

      <!-- 轮播图榜单区域 -->
      <ChartCarousel
        :charts="filteredCharts"
        :active-category-name="chartCategories[activeCategory]"
        :carousel-speed="carouselSpeed"
        @play-chart="playChart"
        @play-song="playSong"
      />

      <!-- 歌手排行榜区域 -->
      <SingerRanking :singers="singers" />
    </main>
  </div>
</template>

<script setup>
// 响应式数据
const bannerImage = ref(
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&auto=format',
)
const activeCategory = ref(0)
const carouselSpeed = ref(30) // 轮播速度（秒）

// 榜单分类
const chartCategories = ref([
  '全球榜单',
  '华语榜单',
  '欧美榜单',
  '日韩榜单',
  '古典音乐',
  '电子音乐',
  '摇滚音乐',
])

// 歌手数据
const singers = ref([
  {
    id: 1,
    name: '周杰伦',
    avatar: 'https://picsum.photos/100/100?random=101',
    fans: '2850万',
    genre: '华语流行 / R&B',
    trend: { type: 'up', value: 125 },
    topSongs: ['夜曲', '七里香', '青花瓷'],
  },
  {
    id: 2,
    name: '邓紫棋',
    avatar: 'https://picsum.photos/100/100?random=102',
    fans: '2430万',
    genre: '华语流行 / 唱作',
    trend: { type: 'up', value: 98 },
    topSongs: ['光年之外', '泡沫', '来自天堂的魔鬼'],
  },
  {
    id: 3,
    name: '林俊杰',
    avatar: 'https://picsum.photos/100/100?random=103',
    fans: '2210万',
    genre: '华语流行 / R&B',
    trend: { type: 'stable', value: 5 },
    topSongs: ['不为谁而作的歌', '修炼爱情', '曹操'],
  },
  {
    id: 4,
    name: '蔡依林',
    avatar: 'https://picsum.photos/100/100?random=104',
    fans: '1980万',
    genre: '华语流行 / 舞曲',
    trend: { type: 'up', value: 42 },
    topSongs: ['日不落', '舞娘', '倒带'],
  },
  {
    id: 5,
    name: '薛之谦',
    avatar: 'https://picsum.photos/100/100?random=105',
    fans: '1760万',
    genre: '华语流行 / 情歌',
    trend: { type: 'down', value: -12 },
    topSongs: ['演员', '丑八怪', '认真的雪'],
  },
  {
    id: 6,
    name: '张碧晨',
    avatar: 'https://picsum.photos/100/100?random=106',
    fans: '1540万',
    genre: '华语流行 / 影视原声',
    trend: { type: 'up', value: 36 },
    topSongs: ['凉凉', '光的方向', '年轮'],
  },
  {
    id: 7,
    name: '李荣浩',
    avatar: 'https://picsum.photos/100/100?random=107',
    fans: '1420万',
    genre: '华语流行 / 民谣',
    trend: { type: 'stable', value: 2 },
    topSongs: ['模特', '李白', '年少有为'],
  },
  {
    id: 8,
    name: '田馥甄',
    avatar: 'https://picsum.photos/100/100?random=108',
    fans: '1280万',
    genre: '华语流行 / 独立',
    trend: { type: 'down', value: -8 },
    topSongs: ['小幸运', '你就不要想起我', '魔鬼中的天使'],
  },
  {
    id: 9,
    name: '王力宏',
    avatar: 'https://picsum.photos/100/100?random=109',
    fans: '1150万',
    genre: '华语流行 / R&B',
    trend: { type: 'up', value: 15 },
    topSongs: ['唯一', '大城小爱', '心中的日月'],
  },
  {
    id: 10,
    name: '张靓颖',
    avatar: 'https://picsum.photos/100/100?random=110',
    fans: '980万',
    genre: '华语流行 / 影视原声',
    trend: { type: 'up', value: 22 },
    topSongs: ['画心', '天下无双', '如果这就是爱情'],
  },
])

// 生成示例歌曲数据
const generateTopSongs = (chartTitle) => {
  const artists = ['周杰伦', 'Taylor Swift', 'BTS', 'Adele', 'Ed Sheeran', 'Billie Eilish']
  const songs = [
    '夜曲',
    'Love Story',
    'Dynamite',
    'Hello',
    'Shape of You',
    'Bad Guy',
    '七里香',
    'Blank Space',
    'Butter',
    'Someone Like You',
    'Perfect',
    'Everything I Wanted',
  ]
  return Array.from({ length: 6 }, (_, i) => ({
    title: songs[Math.floor(Math.random() * songs.length)],
    artist: artists[Math.floor(Math.random() * artists.length)],
    rank: i + 1,
  }))
}

// 所有榜单数据
const allCharts = ref([
  {
    title: '日本公信榜',
    subtitle: 'Oricon 官方排行榜',
    updateTime: '2小时前更新',
    imageUrl:
      'https://p3-flow-imagex-download-sign.byteimg.com/tos-cn-i-a9rns2rl98/8f8909d6254c4d5a8b68429c5311742c.jpeg~tplv-a9rns2rl98-24:720:720.jpeg',
    backgroundImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    gradientClass: 'bg-gradient-to-br from-blue-600/70 to-blue-400/70',
    songCount: 'TOP 20',
    category: 0,
    topSongs: generateTopSongs('日本公信榜'),
  },
  {
    title: '韩国Melon榜',
    subtitle: 'Melon 实时排行榜',
    updateTime: '5小时前更新',
    imageUrl:
      'https://p11-flow-imagex-download-sign.byteimg.com/tos-cn-i-a9rns2rl98/b5a878a468d34e2cb3465e766bb16218.jpg~tplv-a9rns2rl98-24:720:720.image',
    backgroundImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    gradientClass: 'bg-gradient-to-br from-emerald-600/70 to-emerald-400/70',
    songCount: 'TOP 97',
    category: 0,
    topSongs: generateTopSongs('韩国Melon榜'),
  },
  {
    title: '台湾KK榜',
    subtitle: 'KKBOX 热门歌曲',
    updateTime: '1天前更新',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    backgroundImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    gradientClass: 'bg-gradient-to-br from-cyan-600/70 to-cyan-400/70',
    songCount: 'TOP 40',
    category: 0,
    topSongs: generateTopSongs('台湾KK榜'),
  },
  {
    title: 'Billboard',
    subtitle: '美国公告牌',
    updateTime: '12小时前更新',
    imageUrl:
      'https://p3-flow-imagex-download-sign.byteimg.com/tos-cn-i-a9rns2rl98/0d0cb6bea9894efb82d465063492aea7.png~tplv-a9rns2rl98-24:720:720.png',
    backgroundImage: 'https://images.unsplash.com/photo-1571974599782-87624638275f?w=400',
    gradientClass: 'bg-gradient-to-br from-red-600/70 to-orange-500/70',
    songCount: 'TOP 100',
    category: 0,
    topSongs: generateTopSongs('Billboard'),
  },
  {
    title: 'QQ音乐巅峰榜',
    subtitle: '华语流行歌曲',
    updateTime: '3小时前更新',
    backgroundImage: 'https://images.unsplash.com/photo-1511689660468-1629270691e0?w=400',
    gradientClass: 'bg-gradient-to-br from-pink-600/70 to-pink-500/70',
    songCount: 'TOP 100',
    category: 1,
    topSongs: generateTopSongs('QQ音乐巅峰榜'),
  },
  {
    title: '网易云热歌榜',
    subtitle: '华语热门歌曲',
    updateTime: '5小时前更新',
    backgroundImage: 'https://images.unsplash.com/photo-1511689660468-1629270691e0?w=400',
    gradientClass: 'bg-gradient-to-br from-red-600/70 to-pink-500/70',
    songCount: 'TOP 100',
    category: 1,
    topSongs: generateTopSongs('网易云热歌榜'),
  },
])

// 过滤后的榜单（计算属性）
const filteredCharts = computed(() => {
  return allCharts.value.filter((chart) => chart.category === activeCategory.value)
})

// 切换分类
const switchCategory = (index) => {
  activeCategory.value = index
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
  // 初始加载完成后的逻辑
})
</script>

<style scoped>
/* 页面级专属样式 */
main {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
