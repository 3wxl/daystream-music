<template>
  <div class="min-h-screen font-sans antialiased text-gray-100">
    <main class="container mx-auto px-4 py-6 space-y-8">
      <!-- 顶部横幅 -->
      <section
        class="relative rounded-3xl overflow-hidden h-48 md:h-64 group banner-section"
        @mouseenter="startBannerAnimation"
        @mouseleave="stopBannerAnimation"
      >
        <img
          :src="bannerImage"
          alt="音乐推荐"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          :class="{ 'animate-pan': isBannerAnimating }"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-pink-700/80 via-pink-600/80 to-pink-700/80 mix-blend-multiply animate-gradient"
        ></div>
        <div class="absolute inset-0 flex flex-col justify-center p-6 md:p-10 z-10">
          <p
            class="text-white/90 text-sm md:text-base mb-2 animate-text-slide"
            style="--delay: 0.1s"
          >
            本周推荐
          </p>
          <h2
            class="text-2xl md:text-4xl font-bold mb-3 max-w-md animate-text-slide"
            style="--delay: 0.2s"
          >
            发现最热门的<br />流行音乐榜单
          </h2>
          <button
            class="w-fit px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2 animate-text-slide hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
            style="--delay: 0.3s"
            @mouseenter="buttonHover = true"
            @mouseleave="buttonHover = false"
          >
            <span class="relative">
              立即探索
              <span
                v-if="buttonHover"
                class="absolute -bottom-1 left-0 w-full h-0.5 bg-white rounded-full animate-underline"
              ></span>
            </span>
            <i
              class="fa fa-arrow-right text-sm transition-transform duration-300"
              :class="{ 'translate-x-1': buttonHover }"
            ></i>
          </button>
        </div>

        <!-- 浮动音乐图标 -->
        <div class="absolute top-4 right-4 flex space-x-2">
          <div
            v-for="n in 3"
            :key="n"
            class="w-2 h-2 rounded-full bg-white/60 animate-pulse"
            :style="`animation-delay: ${n * 0.2}s`"
          ></div>
        </div>
      </section>

      <!-- 榜单分类标签 -->
      <section class="animate-fade-in-up" style="--delay: 0.15s">
        <div class="flex items-center space-x-2 mb-4">
          <div
            class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
          ></div>
          <h2 class="text-xl font-bold text-pink-400">榜单分类</h2>
        </div>

        <div class="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide">
          <button
            v-for="(category, index) in chartCategories"
            :key="index"
            @click="switchCategory(index)"
            class="px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300"
            :class="[
              activeCategory === index
                ? 'bg-gradient-to-r from-puink-500/70 to-pink-500/30 border border-pink-500/50 text-white shadow-lg shadow-pink-500/10'
                : 'glass-effect text-gray-300 hover:text-white',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </section>

      <!-- 轮播图榜单区域 -->
      <section class="space-y-4 animate-fade-in-up" style="--delay: 0.2s">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div
              class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
            ></div>
            <h2 class="text-2xl font-bold text-pink-400">{{ chartCategories[activeCategory] }}</h2>
            <span
              class="ml-2 px-2 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 animate-bounce-subtle"
            >
              <i class="fa fa-globe mr-1"></i>实时更新
            </span>
          </div>
          <div class="flex items-center gap-2">
            <!-- 轮播控制按钮 -->
            <button
              class="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
              @click="pauseAutoPlay"
              :class="{ 'bg-white/20': !isAutoPlaying }"
            >
              <i class="iconfont text-lg">&#xe697;</i>
            </button>
            <button
              class="w-10 h-10 rounded-full glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20"
              @click="resumeAutoPlay"
              :class="{ 'bg-white/20': isAutoPlaying }"
            >
              <i class="iconfont text-lg">&#xe621;</i>
            </button>
          </div>
        </div>

        <!-- 轮播图容器 -->
        <div class="relative px-4">
          <!-- 左切换按钮 -->
          <!-- <button
            class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-effect flex items-center justify-center shadow-2xl opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
            @click="prevChart"
          >
            <i class="iconfont text-sm">&#xe62e;</i>
          </button> -->

          <!-- 轮播图 - 修复无限轮播 -->
          <div
            ref="carouselContainer"
            class="carousel-wrapper overflow-hidden"
            @mouseenter="pauseAutoPlay"
            @mouseleave="resumeAutoPlay"
          >
            <div
              class="carousel-track flex gap-6"
              :class="{ 'carousel-paused': !isAutoPlaying }"
              :style="{ animationDuration: `${carouselSpeed}s` }"
            >
              <!-- 第一组 -->
              <div
                v-for="(chart, index) in originalCharts"
                :key="`first-${index}`"
                class="carousel-item group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out w-[320px] md:w-[360px] flex-shrink-0 h-[340px] opacity-90"
                @mouseenter="expandChart(index)"
                @mouseleave="collapseChart"
                @click="playChart(chart)"
                :class="{
                  'h-[380px] scale-105 z-10 shadow-2xl shadow-pink-500/20 active-chart':
                    hoveredChartIndex === index,
                }"
              >
                <!-- 背景图 -->
                <div class="absolute inset-0">
                  <img
                    :src="getChartImage(chart)"
                    :alt="chart.title"
                    class="w-full h-full object-cover transition-transform duration-700"
                    :class="{ 'scale-110': hoveredChartIndex === index }"
                  />
                  <div
                    class="absolute inset-0"
                    :class="
                      chart.gradientClass || 'bg-gradient-to-br from-pink-600/70 to-pink-500/70'
                    "
                  ></div>
                  <div
                    class="album-overlay"
                    :class="{ 'opacity-80': hoveredChartIndex === index }"
                  ></div>
                </div>

                <!-- 主要内容 -->
                <div class="relative z-10 p-5 h-full flex flex-col justify-between">
                  <!-- 榜单信息 -->
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-xl font-bold mb-2 transition-all duration-300 truncate">
                        {{ chart.title }}
                      </h3>
                      <p class="text-white/80 text-sm mb-1 truncate">{{ chart.subtitle }}</p>
                      <div class="flex items-center gap-1 text-xs text-white/70">
                        <i class="fa fa-clock-o animate-spin-slow"></i>
                        <span>{{ chart.updateTime }}</span>
                      </div>
                    </div>
                    <span
                      class="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm ml-2 flex-shrink-0"
                    >
                      {{ chart.songCount }}
                    </span>
                  </div>

                  <!-- 展开时的歌曲列表 -->
                  <div
                    v-if="hoveredChartIndex === index"
                    class="mt-3 space-y-2 animate-fade-in-up flex-1 overflow-y-auto max-h-[150px] custom-scrollbar"
                  >
                    <div
                      v-for="(song, songIndex) in chart.topSongs"
                      :key="songIndex"
                      class="flex items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20"
                    >
                      <div
                        class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"
                      >
                        {{ songIndex + 1 }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-xs truncate">{{ song.title }}</h4>
                        <p class="text-white/60 text-xs truncate">{{ song.artist }}</p>
                      </div>
                      <button
                        class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 flex-shrink-0 ml-2"
                        @click.stop="playSong(song)"
                      >
                        <i class="iconfont text-xs">&#xe623;</i>
                      </button>
                    </div>
                  </div>

                  <!-- 播放按钮 -->
                  <div class="flex justify-end mt-2">
                    <button
                      class="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20"
                      :class="{ 'scale-110 bg-white/30': hoveredChartIndex === index }"
                      @click.stop="playChart(chart)"
                    >
                      <i
                        class="iconfont text-white text-sm transition-transform duration-200"
                        :class="{ 'scale-110': hoveredChartIndex === index }"
                        >&#xe623;</i
                      >
                    </button>
                  </div>
                </div>

                <!-- 悬停光晕效果 -->
                <div
                  class="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 pointer-events-none"
                  :class="{
                    'border-white/40 shadow-2xl shadow-pink-500/30': hoveredChartIndex === index,
                  }"
                ></div>
              </div>

              <!-- 第二组（重复第一组，用于无缝循环） -->
              <div
                v-for="(chart, index) in originalCharts"
                :key="`second-${index}`"
                class="carousel-item group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out w-[320px] md:w-[360px] flex-shrink-0 h-[340px] opacity-90"
                @mouseenter="expandChart(index)"
                @mouseleave="collapseChart"
                @click="playChart(chart)"
                :class="{
                  'h-[380px] scale-105 z-10 shadow-2xl shadow-pink-500/20 active-chart':
                    hoveredChartIndex === index,
                }"
              >
                <!-- 背景图 -->
                <div class="absolute inset-0">
                  <img
                    :src="getChartImage(chart)"
                    :alt="chart.title"
                    class="w-full h-full object-cover transition-transform duration-700"
                    :class="{ 'scale-110': hoveredChartIndex === index }"
                  />
                  <div
                    class="absolute inset-0"
                    :class="
                      chart.gradientClass || 'bg-gradient-to-br from-pink-600/70 to-pink-500/70'
                    "
                  ></div>
                  <div
                    class="album-overlay"
                    :class="{ 'opacity-80': hoveredChartIndex === index }"
                  ></div>
                </div>

                <!-- 主要内容 -->
                <div class="relative z-10 p-5 h-full flex flex-col justify-between">
                  <!-- 榜单信息 -->
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-xl font-bold mb-2 transition-all duration-300 truncate">
                        {{ chart.title }}
                      </h3>
                      <p class="text-white/80 text-sm mb-1 truncate">{{ chart.subtitle }}</p>
                      <div class="flex items-center gap-1 text-xs text-white/70">
                        <i class="fa fa-clock-o animate-spin-slow"></i>
                        <span>{{ chart.updateTime }}</span>
                      </div>
                    </div>
                    <span
                      class="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm ml-2 flex-shrink-0"
                    >
                      {{ chart.songCount }}
                    </span>
                  </div>

                  <!-- 展开时的歌曲列表 -->
                  <div
                    v-if="hoveredChartIndex === index"
                    class="mt-3 space-y-2 animate-fade-in-up flex-1 overflow-y-auto max-h-[150px] custom-scrollbar"
                  >
                    <div
                      v-for="(song, songIndex) in chart.topSongs"
                      :key="songIndex"
                      class="flex items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/20"
                    >
                      <div
                        class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0"
                      >
                        {{ songIndex + 1 }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-xs truncate">{{ song.title }}</h4>
                        <p class="text-white/60 text-xs truncate">{{ song.artist }}</p>
                      </div>
                      <button
                        class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 flex-shrink-0 ml-2"
                        @click.stop="playSong(song)"
                      >
                        <i class="iconfont text-xs">&#xe623;</i>
                      </button>
                    </div>
                  </div>

                  <!-- 播放按钮 -->
                  <div class="flex justify-end mt-2">
                    <button
                      class="w-12 h-12 rounded-2xl glass-effect flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20"
                      :class="{ 'scale-110 bg-white/30': hoveredChartIndex === index }"
                      @click.stop="playChart(chart)"
                    >
                      <i
                        class="iconfont text-white text-sm transition-transform duration-200"
                        :class="{ 'scale-110': hoveredChartIndex === index }"
                        >&#xe623;</i
                      >
                    </button>
                  </div>
                </div>

                <!-- 悬停光晕效果 -->
                <div
                  class="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 pointer-events-none"
                  :class="{
                    'border-white/40 shadow-2xl shadow-pink-500/30': hoveredChartIndex === index,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 右切换按钮 -->
          <!-- <button
            class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-effect flex items-center justify-center shadow-2xl opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
            @click="nextChart"
          >
            <i class="iconfont text-sm">&#xe62d;</i>
          </button> -->
        </div>

        <!-- 轮播指示器 -->
        <!-- <div class="flex justify-center gap-2 mt-4">
          <div
            v-for="(chart, index) in originalCharts"
            :key="index"
            class="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="[
              currentChartIndex === index ? 'bg-pink-400 w-6' : 'bg-white/30 hover:bg-white/50',
            ]"
            @click="goToChart(index)"
          ></div>
        </div> -->
      </section>

      <!-- 歌手排行榜区域 -->
      <section class="animate-fade-in-up" style="--delay: 0.3s">
        <div class="flex items-center space-x-2 mb-6">
          <div
            class="w-2 h-6 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full animate-pulse-glow"
          ></div>
          <h2 class="text-2xl font-bold text-pink-400">歌手排行榜</h2>
          <span
            class="ml-2 px-2 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 animate-bounce-subtle"
          >
            <i class="fa fa-fire mr-1"></i>人气歌手
          </span>
        </div>

        <!-- 歌手排行榜网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(singer, index) in singers"
            :key="singer.id"
            class="ranking-card relative overflow-hidden flex items-center p-4 h-28 rounded-2xl border border-gray-700/50 bg-gray-800/40 shadow-xl transition-all duration-400 backdrop-blur-sm group"
            @mouseenter="hoveredSinger = singer.id"
            @mouseleave="hoveredSinger = null"
          >
            <!-- 排名数字 -->
            <div
              class="rank-number text-2xl font-bold w-11 h-11 flex items-center justify-center mr-4 relative z-10 rounded-full transition-all duration-300"
              :class="getRankClass(index + 1)"
            >
              {{ index + 1 }}
            </div>

            <!-- 头像容器 -->
            <div class="avatar-container relative mr-4">
              <el-avatar
                :size="50"
                :src="singer.avatar"
                class="avatar border-2 border-pink-500/50 transition-all duration-400 relative z-10"
                :class="{ 'avatar-hover': hoveredSinger === singer.id }"
              />
              <div
                class="avatar-glow absolute top-0 left-0 w-full h-full rounded-full opacity-0 transition-opacity duration-400 bg-pink-500/30 blur-[12px]"
                :class="{ 'glow-active': hoveredSinger === singer.id }"
              ></div>
            </div>

            <!-- 歌手信息 -->
            <div class="info flex-1 relative z-10">
              <h3
                class="singer-name text-base font-bold mb-1 text-white transition-colors duration-300"
                :class="{ 'name-hover': hoveredSinger === singer.id }"
              >
                {{ singer.name }}
              </h3>
              <div class="fans-count text-gray-400 text-sm flex items-center mb-0.5">
                <span class="heart text-pink-500 mr-1 text-sm">♥</span>
                粉丝数: {{ singer.fans }}
              </div>
              <div class="genre text-gray-500 text-xs">{{ singer.genre }}</div>
            </div>

            <!-- 趋势指示器 -->
            <div
              class="trend-indicator flex items-center text-xs ml-2 px-3 py-1 rounded-full font-bold transition-all duration-300"
              :class="[
                getTrendClass(singer.trend.type),
                { 'scale-110': hoveredSinger === singer.id },
              ]"
            >
              <span>{{ singer.trend.value > 0 ? '+' : '' }}{{ singer.trend.value }}</span>
              <span class="trend-icon ml-1">{{ getTrendIcon(singer.trend.type) }}</span>
            </div>

            <!-- 热门歌曲 -->
            <div
              class="top-songs absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 rounded-b-2xl transition-all duration-400 z-20"
              :class="{ 'songs-visible': hoveredSinger === singer.id }"
            >
              <h4 class="text-xs mb-2 text-pink-300 font-semibold">热门歌曲</h4>
              <div class="song-list flex flex-wrap gap-2">
                <span
                  v-for="song in singer.topSongs"
                  :key="song"
                  class="song-tag px-2 py-1 text-xs rounded-lg border border-pink-500/40 bg-pink-500/20 text-pink-200 transition-colors duration-300 hover:bg-pink-500/30"
                >
                  {{ song }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ElAvatar } from 'element-plus'

// 响应式数据
const bannerImage = ref(
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&auto=format',
)
const isBannerAnimating = ref(false)
const buttonHover = ref(false)
const carouselContainer = ref(null)
const activeCategory = ref(0)
const currentChartIndex = ref(0)
const hoveredChartIndex = ref(-1)
const hoveredSinger = ref(null)
const isAutoPlaying = ref(true)
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

// 获取排名样式类
const getRankClass = (rank) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-[0_0_25px_rgba(255,215,0,0.6)]'
    case 2:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-[0_0_25px_rgba(192,192,192,0.6)]'
    case 3:
      return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-[0_0_25px_rgba(205,127,50,0.6)]'
    default:
      return 'bg-gradient-to-br from-pink-500 to-pink-700 text-pink-100 shadow-[0_0_25px_rgba(138,43,226,0.6)]'
  }
}

// 获取趋势样式类
const getTrendClass = (type) => {
  return {
    up: 'text-green-400 bg-green-500/15 shadow-[0_0_10px_rgba(76,175,80,0.2)]',
    down: 'text-red-400 bg-red-500/15 shadow-[0_0_10px_rgba(244,67,54,0.2)]',
    stable: 'text-orange-400 bg-orange-500/15 shadow-[0_0_10px_rgba(255,152,0,0.2)]',
  }[type]
}

const getTrendIcon = (type) => {
  switch (type) {
    case 'up':
      return '↑'
    case 'down':
      return '↓'
    case 'stable':
      return '→'
    default:
      return ''
  }
}

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

// 获取图表图片的安全方法
const getChartImage = (chart) => {
  return (
    chart.backgroundImage ||
    chart.imageUrl ||
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
  )
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
// 显示的榜单
const displayedCharts = ref([...allCharts.value])
const originalCharts = ref([])

// 过滤榜单数据
const filterChartsByCategory = () => {
  originalCharts.value = displayedCharts.value.filter(
    (chart) => chart.category === activeCategory.value,
  )
  currentChartIndex.value = 0
  hoveredChartIndex.value = -1
}

// 切换分类
const switchCategory = (index) => {
  activeCategory.value = index
  filterChartsByCategory()
}

// 轮播控制
const nextChart = () => {
  if (originalCharts.value.length <= 1) return
  currentChartIndex.value = (currentChartIndex.value + 1) % originalCharts.value.length
}

const prevChart = () => {
  if (originalCharts.value.length <= 1) return
  currentChartIndex.value =
    (currentChartIndex.value - 1 + originalCharts.value.length) % originalCharts.value.length
}

const goToChart = (index) => {
  currentChartIndex.value = index
}

// 自动播放控制
const pauseAutoPlay = () => {
  isAutoPlaying.value = false
}

const resumeAutoPlay = () => {
  isAutoPlaying.value = true
}

// 悬停展开
const expandChart = (index) => {
  hoveredChartIndex.value = index
}

const collapseChart = () => {
  hoveredChartIndex.value = -1
}

// 动画控制
const startBannerAnimation = () => {
  isBannerAnimating.value = true
}

const stopBannerAnimation = () => {
  isBannerAnimating.value = false
}

// 播放函数
const playChart = (chart) => {
  console.log('播放榜单:', chart.title)
}

const playSong = (song) => {
  console.log('播放歌曲:', song.title, '-', song.artist)
}

// 监听分类变化
watch(activeCategory, filterChartsByCategory)

onMounted(() => {
  filterChartsByCategory()
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.carousel-track {
  animation: infinite-carousel linear infinite;
  width: max-content;
  display: flex;
  gap: 1.5rem;
}

.carousel-paused {
  animation-play-state: paused;
}

@keyframes infinite-carousel {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - 0.75rem)); /* 减去gap的一半 */
  }
}

.carousel-item {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
  width: 320px;
}

@media (min-width: 768px) {
  .carousel-item {
    width: 360px;
  }
}

.carousel-item:hover {
  transform: scale(1.05);
  z-index: 10;
  opacity: 1 !important;
  height: 380px !important;
  box-shadow: 0 25px 50px rgba(139, 92, 246, 0.3);
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 隐藏水平滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 玻璃态效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.album-overlay {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
}

/* 动画效果 */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 背景渐变动画 */
.animate-gradient {
  background: linear-gradient(-45deg, #8b5cf6, #ec4899, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 歌手卡片样式 */
.ranking-card {
  transform-style: preserve-3d;
}

.ranking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.2), transparent);
  transition: left 0.7s ease;
  z-index: 1;
}

.ranking-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(163, 27, 113, 0.46);
  border-color: rgba(192, 20, 126, 0.612);
}

.ranking-card:hover::before {
  left: 100%;
}

.avatar-hover {
  border-color: rgba(226, 43, 165, 0.9) !important;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(239, 16, 213, 0.497);
}

.glow-active {
  opacity: 1 !important;
}

.name-hover {
  color: #b19cd9;
}

/* 热门歌曲hover显示 */
.top-songs {
  transform: translateY(100%);
}

.songs-visible {
  transform: translateY(0);
}

/* 响应式微调 */
@media (max-width: 768px) {
  .ranking-card {
    padding: 0.75rem !important;
    height: auto !important;
  }

  .avatar {
    width: 40px !important;
    height: 40px !important;
  }

  .rank-number {
    width: 2.5rem !important;
    height: 2.5rem !important;
    font-size: 1.25rem !important;
  }
}

@media (max-width: 480px) {
  .ranking-card {
    flex-direction: column !important;
    text-align: center !important;
    padding: 1rem !important;
  }

  .rank-number {
    margin-right: 0 !important;
    margin-bottom: 0.5rem !important;
  }

  .avatar-container {
    margin-right: 0 !important;
    margin-bottom: 0.75rem !important;
  }

  .trend-indicator {
    margin-left: 0 !important;
    margin-top: 0.5rem !important;
  }
}
</style>
