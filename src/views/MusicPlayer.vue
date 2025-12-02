<template>
  <div
    class="music-player min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden"
  >
    <!-- 顶部控制栏（放大尺寸） -->
    <header
      class="relative z-20 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center backdrop-blur-lg bg-black/50 border-b border-white/10"
    >
      <button
        class="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-all duration-300"
      >
        <i
          class="iconfont icon-arrow-left text-lg md:text-xl transition-transform group-hover:-translate-x-1"
          >&#xe62e;</i
        >
        <span class="text-sm hidden md:inline opacity-50 group-hover:opacity-100 transition-opacity"
          >返回</span
        >
      </button>
      <div class="text-center">
        <h1 class="text-base md:text-lg font-medium">音乐详情</h1>
        <div class="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
          <div class="flex items-center gap-1">
            <div class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
            <span>正在播放</span>
          </div>
          <span>•</span>
          <span class="font-mono text-sm">{{ currentTime }}/{{ duration }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-300">
          <i class="iconfont icon-more text-lg md:text-xl">&#xe7e3;</i>
        </button>
      </div>
    </header>

    <!-- 主内容区（放大尺寸+填充空间） -->
    <main
      class="relative container mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 flex-1"
    >
      <!-- 黑胶唱片区域（核心优化：放大尺寸+保留简化唱臂） -->
      <div class="relative w-full max-w-sm lg:w-2/5 flex flex-col items-center justify-center">
        <!-- 外发光效果（放大） -->
        <div
          class="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 blur-xl transition-all duration-1000"
          :class="{ 'animate-pulse': isPlaying }"
        ></div>

        <!-- 唱片旋转容器（放大尺寸） -->
        <div
          class="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] flex items-center justify-center cursor-pointer"
          @click="togglePlay"
        >
          <!-- 唱片底座 -->
          <div
            class="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black shadow-xl"
          ></div>

          <!-- 旋转唱片 -->
          <div class="absolute w-[90%] h-[90%] rounded-full" :class="{ rotating: isPlaying }">
            <div class="absolute inset-0 rounded-full border-8 border-gray-800/30"></div>
            <div
              class="absolute inset-0 rounded-full opacity-30"
              :style="{
                backgroundImage: `conic-gradient(
                  from 0deg,
                  transparent 0deg,
                  rgba(255,255,255,0.1) 60deg,
                  transparent 120deg,
                  rgba(255,255,255,0.05) 180deg,
                  transparent 240deg,
                  rgba(255,255,255,0.1) 300deg,
                  transparent 360deg
                )`,
              }"
            ></div>
          </div>

          <!-- 专辑封面（放大） -->
          <div
            class="relative z-10 w-[60%] h-[60%] rounded-full overflow-hidden border-4 border-gray-800/50 shadow-xl transition-all duration-500"
            :class="{ 'scale-105 border-pink-500/50': isPlaying }"
          >
            <img
              :src="currentSong.cover"
              alt="专辑封面"
              class="w-full h-full object-cover transition-transform duration-700"
              :class="{ 'scale-110': isPlaying }"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            >
              <div
                class="w-12 h-12 md:w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg transform scale-90 hover:scale-100 transition-transform"
              >
                <i
                  :class="
                    isPlaying
                      ? 'iconfont icon-pause text-lg md:text-xl'
                      : 'iconfont icon-play text-lg md:text-xl'
                  "
                  class="text-white ml-0.5"
                ></i>
              </div>
            </div>
          </div>

          <!-- 唱片中心标签（放大） -->
          <div
            class="absolute z-20 w-14 h-14 md:w-18 h-18 rounded-full bg-gradient-to-br from-gray-800 to-black border-4 border-gray-700/50 flex items-center justify-center shadow-inner"
          >
            <div
              class="w-4 h-4 md:w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            ></div>
          </div>
        </div>

        <!-- 简化唱臂（放大尺寸+保留颠倒位置逻辑） -->
        <div
          class="absolute top-0 right-0 w-[320px] h-[320px] md:w-[380px] md:h-[380px] pointer-events-none z-30"
        >
          <div class="relative w-full h-full">
            <!-- 唱臂底座（放大） -->
            <div
              class="absolute top-4 right-10 w-8 h-8 md:w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-3 border-gray-600 shadow-lg"
            ></div>

            <!-- 唱臂长臂（放大+颠倒位置逻辑保留） -->
            <div
              class="absolute top-8 right-14 w-36 h-2 md:w-42 h-2.5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full shadow-lg transform origin-top-right"
              :class="isPlaying ? '-rotate-[10deg]' : 'rotate-[32deg]'"
              style="transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
            ></div>
          </div>
        </div>

        <!-- 播放控制提示（放大字体） -->
        <div class="mt-6 text-sm text-gray-400 text-center animate-pulse">
          点击{{ isPlaying ? '暂停' : '播放' }}
        </div>
      </div>

      <!-- 歌曲信息区域（放大尺寸+填充空间） -->
      <div class="w-full lg:w-3/5 max-w-lg">
        <!-- 歌曲标题与操作（放大间距+字体） -->
        <div class="mb-6 md:mb-7">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 mr-4">
              <h2
                class="text-2xl md:text-3xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient"
              >
                {{ currentSong.title }}
              </h2>
              <div class="flex items-center flex-wrap gap-2 text-sm md:text-base text-gray-300">
                <div
                  class="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-500/30 transition-colors"
                >
                  <i class="iconfont icon-artist text-sm text-pink-400">&#xe602;</i>
                  <span>{{ currentSong.artist }}</span>
                </div>
                <div
                  class="inline-flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <i class="iconfont icon-album text-sm text-purple-400">&#xe64b;</i>
                  <span class="hidden sm:inline">专辑: </span>
                  <span>{{ currentSong.album || '未知专辑' }}</span>
                </div>
                <el-tag
                  class="cursor-pointer hover:scale-105 transition-transform ml-2"
                  size="small"
                  type="danger"
                  effect="dark"
                  @click="playMV"
                >
                  <i class="iconfont icon-play text-sm mr-1"></i>
                  MV
                </el-tag>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="toggleLike"
                class="p-2 md:p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
                :class="{ 'text-pink-500': liked, 'text-gray-400': !liked }"
              >
                <i
                  :class="
                    liked
                      ? 'iconfont icon-like-filled text-lg md:text-xl'
                      : 'iconfont icon-like text-lg md:text-xl'
                  "
                ></i>
              </button>
            </div>
          </div>

          <!-- 交互式数据展示（放大尺寸） -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div
              v-for="(stat, index) in statistics"
              :key="index"
              class="p-3 md:p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-pink-500/30 transition-all duration-300 group cursor-pointer"
            >
              <div class="text-sm text-gray-400 mb-1 group-hover:text-pink-300 transition-colors">
                {{ stat.label }}
              </div>
              <div class="text-lg md:text-xl font-bold">{{ stat.value }}</div>
              <div class="text-sm text-gray-500 mt-1">{{ stat.subtitle }}</div>
            </div>
          </div>
        </div>

        <!-- 标签页切换（放大尺寸） -->
        <div class="mb-4 md:mb-5">
          <el-tabs v-model="activeTab" class="w-full custom-tabs" @tab-click="handleTabChange">
            <el-tab-pane name="lyric">
              <template #label>
                <div class="flex items-center gap-1.5">
                  <i class="iconfont icon-lyric text-sm md:text-base"></i>
                  <span class="text-sm md:text-base">歌词</span>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane name="encyclopedia">
              <template #label>
                <div class="flex items-center gap-1.5">
                  <i class="iconfont icon-info text-sm md:text-base"></i>
                  <span class="text-sm md:text-base">歌曲信息</span>
                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane name="recommend">
              <template #label>
                <div class="flex items-center gap-1.5">
                  <i class="iconfont icon-recommend text-sm md:text-base"></i>
                  <span class="text-sm md:text-base">相似推荐</span>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 标签内容区域（放大高度+填充空间） -->
        <div
          class="bg-gray-900/80 backdrop-blur-lg rounded-lg md:rounded-xl border border-white/10 p-4 md:p-5 h-60 md:h-72 scrollbar-hide"
        >
          <!-- 歌词内容（放大排版） -->
          <div
            v-if="activeTab === 'lyric'"
            class="lyric-container h-full overflow-y-auto"
            @scroll="handleLyricScroll"
            ref="lyricContainer"
          >
            <div class="space-y-3 md:space-y-4 pt-5 pb-5">
              <div
                v-for="(line, index) in lyrics"
                :key="index"
                @click="seekToLyric(line.time)"
                :class="[
                  'p-2 md:p-3 rounded-lg cursor-pointer transition-all duration-300 text-center',
                  currentLyricIndex === index
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-l-2 border-pink-500'
                    : 'hover:bg-white/5',
                  currentLyricIndex > index
                    ? 'opacity-50 text-gray-400'
                    : 'opacity-100 text-gray-300',
                  currentLyricIndex === index ? 'text-pink-300 font-medium scale-105' : '',
                ]"
              >
                <span class="text-base md:text-lg">{{ line.text }}</span>
                <span
                  v-if="currentLyricIndex === index"
                  class="block text-sm text-pink-400 px-2 py-1 mt-1 rounded-full bg-pink-500/10 inline-block"
                >
                  {{ formatTime(line.time) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 歌曲信息（放大排版） -->
          <div v-if="activeTab === 'encyclopedia'" class="h-full overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="(item, index) in songInfo"
                :key="index"
                class="flex items-center p-2 md:p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div
                  class="w-24 md:w-32 text-sm text-gray-500 group-hover:text-pink-300 transition-colors"
                >
                  {{ item.label }}
                </div>
                <div
                  class="flex-1 text-sm md:text-base text-gray-300 group-hover:text-white truncate"
                >
                  {{ item.value }}
                </div>
              </div>
            </div>
          </div>

          <!-- 相似推荐（放大排版） -->
          <div v-if="activeTab === 'recommend'" class="h-full overflow-y-auto">
            <div class="space-y-3">
              <div
                v-for="song in recommendations"
                :key="song.id"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-all cursor-pointer group border border-transparent hover:border-pink-500/20"
                @click="playRecommendation(song)"
              >
                <div class="relative flex-shrink-0">
                  <img
                    :src="song.cover"
                    alt="推荐歌曲"
                    class="w-12 h-12 md:w-14 h-14 rounded-lg object-cover shadow-md"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                  >
                    <div
                      class="w-6 h-6 md:w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center"
                    >
                      <i class="iconfont icon-play text-white text-sm"></i>
                    </div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-sm md:text-base font-medium truncate group-hover:text-pink-300 transition-colors"
                  >
                    {{ song.title }}
                  </h4>
                  <p class="text-sm text-gray-400 truncate">{{ song.artist }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-sm px-2 py-1 rounded-full bg-pink-500/20 text-pink-300">
                      {{ song.similarity }}%相似
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部播放控制栏（放大版+无滚动条） -->
    <footer
      class="sticky bottom-0 left-0 right-0 backdrop-blur-2xl bg-black/95 border-t border-white/10 py-3 px-4 md:px-6 z-50"
    >
      <div class="container mx-auto max-w-5xl">
        <!-- 进度条（放大尺寸） -->
        <div class="flex items-center gap-3 md:gap-4 mb-3">
          <span class="text-sm text-gray-400 w-12 text-right font-mono">{{ currentTime }}</span>
          <div class="flex-1 relative group cursor-pointer" @click="seekProgress" ref="progressBar">
            <div class="h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
              <!-- 已播放进度 -->
              <div
                class="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                :style="{ width: progress + '%' }"
              ></div>
              <!-- 进度点（放大） -->
              <div
                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 h-4 bg-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform z-10"
                :style="{ left: progress + '%' }"
              ></div>
            </div>
          </div>
          <span class="text-sm text-gray-400 w-12 font-mono">{{ duration }}</span>
        </div>

        <!-- 控制区域（放大布局） -->
        <div class="flex items-center justify-between gap-4">
          <!-- 左侧：歌曲信息（放大） -->
          <div class="flex items-center gap-3 w-1/4 min-w-[120px]">
            <div class="relative flex-shrink-0">
              <img
                :src="currentSong.cover"
                alt="歌曲封面"
                class="w-10 h-10 md:w-12 h-12 rounded-lg object-cover shadow-md cursor-pointer transition-all hover:scale-105"
                @click="togglePlay"
              />
              <!-- 播放状态指示器（放大） -->
              <div
                v-if="isPlaying"
                class="absolute -top-1 -right-1 w-3 h-3 md:w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-md"
              >
                <div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="min-w-0">
              <h4
                class="text-sm font-semibold truncate hover:text-pink-300 transition-colors cursor-pointer"
                @click="togglePlay"
              >
                {{ currentSong.title }}
              </h4>
              <p class="text-sm text-gray-400 truncate">{{ currentSong.artist }}</p>
            </div>
          </div>

          <!-- 中间：核心控制按钮（放大版） -->
          <div class="flex items-center gap-4 md:gap-5">
            <button
              @click="prevSong"
              class="p-3 rounded-full hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              title="上一曲"
            >
              <i class="iconfont icon-prev text-sm md:text-lg"></i>
            </button>
            <button
              @click="togglePlay"
              class="w-12 h-12 md:w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all active:scale-95"
              title="播放/暂停"
            >
              <i
                :class="[
                  isPlaying
                    ? 'iconfont icon-pause text-lg md:text-xl'
                    : 'iconfont icon-play text-lg md:text-xl',
                  'text-white ml-0.5',
                ]"
              ></i>
            </button>
            <button
              @click="nextSong"
              class="p-3 rounded-full hover:bg-white/10 transition-all duration-300 text-gray-300 hover:text-white"
              title="下一曲"
            >
              <i class="iconfont icon-next text-sm md:text-lg"></i>
            </button>
          </div>

          <!-- 右侧：扩展控制（放大版） -->
          <div class="flex items-center gap-3 md:gap-4 w-1/4 justify-end min-w-[160px]">
            <!-- 点赞按钮（放大） -->
            <button
              @click="toggleLike"
              class="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              :class="{ 'text-pink-500': liked, 'text-gray-400': !liked }"
              title="收藏歌曲"
            >
              <i
                :class="
                  liked
                    ? 'iconfont icon-like-filled text-sm md:text-lg'
                    : 'iconfont icon-like text-sm md:text-lg'
                "
              ></i>
            </button>

            <!-- 随机播放（放大） -->
            <button
              @click="toggleShuffle"
              class="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              :class="{ 'text-pink-500': shuffle, 'text-gray-400': !shuffle }"
              title="随机播放"
            >
              <i class="iconfont icon-random text-sm md:text-lg"></i>
            </button>

            <!-- 循环播放（放大） -->
            <button
              @click="toggleLoop"
              class="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              :class="{ 'text-purple-500': loop, 'text-gray-400': !loop }"
              title="循环播放"
            >
              <i
                :class="[
                  loop
                    ? 'iconfont icon-loop-one text-sm md:text-lg'
                    : 'iconfont icon-loop text-sm md:text-lg',
                ]"
              ></i>
            </button>

            <!-- 音量控制（放大） -->
            <div class="flex items-center gap-2 group">
              <button
                @click="toggleMute"
                class="p-1.5 hover:text-pink-300 transition-colors"
                title="静音"
              >
                <i
                  :class="[
                    muted || volume === 0
                      ? 'iconfont icon-mute text-sm md:text-lg'
                      : 'iconfont icon-sound text-sm md:text-lg',
                  ]"
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 播放列表抽屉（放大版） -->
    <el-drawer
      v-model="showPlaylistDrawer"
      title="播放列表"
      direction="rtl"
      size="360px"
      class="custom-drawer"
    >
      <div class="p-4 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">当前播放队列</h3>
          <button
            class="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            @click="clearPlaylist"
          >
            清空列表
          </button>
        </div>
        <div
          v-for="song in playlist"
          :key="song.id"
          @click="selectSong(song)"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-800/50',
            currentSong.id === song.id
              ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-l-2 border-pink-500'
              : 'border border-transparent hover:border-pink-500/20',
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="relative">
              <img :src="song.cover" alt="歌曲封面" class="w-10 h-10 rounded-lg object-cover" />
              <div
                v-if="currentSong.id === song.id && isPlaying"
                class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
              >
                <div class="flex gap-1">
                  <div class="w-1 h-2 bg-pink-500 animate-pulse"></div>
                  <div
                    class="w-1 h-2.5 bg-pink-500 animate-pulse"
                    style="animation-delay: 0.1s"
                  ></div>
                  <div
                    class="w-1 h-1.5 bg-pink-500 animate-pulse"
                    style="animation-delay: 0.2s"
                  ></div>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4
                class="text-sm font-medium truncate"
                :class="{ 'text-pink-300': currentSong.id === song.id }"
              >
                {{ song.title }}
              </h4>
              <p class="text-sm text-gray-400 truncate">{{ song.artist }}</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatTime(song.duration) }}
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 歌词悬浮窗（放大版） -->
    <div
      v-if="showFloatLyric"
      class="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-4 w-4/5 max-w-md z-40 shadow-xl"
    >
      <div class="text-center space-y-2">
        <div class="text-sm text-gray-400">正在播放</div>
        <div class="text-lg font-medium text-pink-300">
          {{ currentSong.title }} - {{ currentSong.artist }}
        </div>
        <div class="py-2 text-center text-white text-base">
          {{ lyrics[currentLyricIndex]?.text || '' }}
        </div>
        <div class="flex justify-center gap-4 mt-2">
          <button
            @click="togglePlay"
            class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            {{ isPlaying ? '暂停' : '播放' }}
          </button>
          <button
            @click="toggleLyricShow"
            class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            关闭歌词
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

// 基础状态
const isPlaying = ref(true)
const progress = ref(35)
const volume = ref(80)
const muted = ref(false)
const shuffle = ref(false)
const loop = ref(false)
const liked = ref(true)
const showPlaylistDrawer = ref(false)
const showFloatLyric = ref(false)
const isFullScreen = ref(false)
const activeTab = ref('lyric')

// 当前歌曲
const currentSong = ref({
  id: 1,
  title: '在你的身边',
  artist: '盛哲',
  album: '在你的身边',
  cover: 'https://picsum.photos/id/1074/100/100',
  duration: 238, // 3分58秒
})

// 计算属性
const currentTime = computed(() => {
  const totalSeconds = currentSong.value.duration
  const currentSeconds = (progress.value / 100) * totalSeconds
  return formatTime(currentSeconds)
})
const duration = computed(() => formatTime(currentSong.value.duration))

// 歌词数据（补充部分内容，填充空间）
const lyrics = ref([
  { time: 0, text: '[前奏音乐]' },
  { time: 10, text: '世界这么大还是遇见你' },
  { time: 15, text: '多少次疯狂多少天真' },
  { time: 20, text: '一起做过梦' },
  { time: 25, text: '有一天我们会重逢故里' },
  { time: 30, text: '世界这么大还是遇见你' },
  { time: 35, text: '一起走过许多个四季' },
  { time: 40, text: '天南地北' },
  { time: 45, text: '别忘记我们之间的情谊' },
  { time: 50, text: '陌生的城市啊' },
  { time: 55, text: '熟悉的角落里' },
  { time: 60, text: '也曾彼此安慰' },
  { time: 65, text: '也曾相拥叹息' },
  { time: 70, text: '不管将会面对什么样的结局' },
  { time: 75, text: '在某年在某月' },
  { time: 80, text: '在某个转身的瞬间' },
  { time: 85, text: '我们会重逢相见' },
  { time: 90, text: '笑着说声好久不见' },
  { time: 95, text: '世界这么大还是遇见你' },
  { time: 100, text: '多少次疯狂多少天真' },
  { time: 105, text: '一起做过梦' },
  { time: 110, text: '有一天我们会重逢故里' },
])

// 当前歌词索引
const currentLyricIndex = computed(() => {
  const currentSeconds = (progress.value / 100) * currentSong.value.duration
  const index = lyrics.value.findIndex((line, idx) => {
    const nextLineTime = lyrics.value[idx + 1]?.time || currentSong.value.duration
    return line.time <= currentSeconds && currentSeconds < nextLineTime
  })
  return index === -1 ? 0 : index
})

// 统计信息（保留）
const statistics = ref([
  { label: '播放量', value: '1.2亿', subtitle: '实时增长' },
  { label: '收藏数', value: '856万', subtitle: '+1.2万 今日' },
  { label: '评论数', value: '34.8万', subtitle: '999+ 新评' },
  { label: '分享数', value: '89.6万', subtitle: '社交热度' },
])

// 歌曲信息（保留）
const songInfo = ref([
  { label: '作词', value: '盛哲' },
  { label: '作曲', value: '盛哲' },
  { label: '编曲', value: '盛哲' },
  { label: '制作人', value: '盛哲' },
  { label: '发行时间', value: '2023-05-20' },
  { label: '唱片公司', value: '独立发行' },
  { label: '音乐风格', value: '流行 / 民谣' },
])

// 相似推荐（补充一条，填充空间）
const recommendations = ref([
  {
    id: 2,
    title: '夏夜最后的烟火',
    artist: '戴羽彤',
    album: '夏夜最后的烟火',
    cover: 'https://picsum.photos/id/1025/100/100',
    similarity: 92,
    duration: 215,
  },
  {
    id: 3,
    title: '晚风心里吹',
    artist: '阿梨粤',
    album: '晚风心里吹',
    cover: 'https://picsum.photos/id/1028/100/100',
    similarity: 88,
    duration: 245,
  },
  {
    id: 4,
    title: '茫',
    artist: '李润祺',
    album: '茫',
    cover: 'https://picsum.photos/id/1075/100/100',
    similarity: 85,
    duration: 198,
  },
  {
    id: 5,
    title: '彩虹下面',
    artist: '赵雷',
    album: '无法长大',
    cover: 'https://picsum.photos/id/1080/100/100',
    similarity: 82,
    duration: 228,
  },
])

// 播放列表（补充一条，填充空间）
const playlist = ref([
  {
    id: 1,
    title: '在你的身边',
    artist: '盛哲',
    album: '在你的身边',
    cover: 'https://picsum.photos/id/1074/100/100',
    duration: 238,
  },
  {
    id: 2,
    title: '夏夜最后的烟火',
    artist: '戴羽彤',
    album: '夏夜最后的烟火',
    cover: 'https://picsum.photos/id/1025/100/100',
    duration: 215,
  },
  {
    id: 3,
    title: '晚风心里吹',
    artist: '阿梨粤',
    album: '晚风心里吹',
    cover: 'https://picsum.photos/id/1028/100/100',
    duration: 245,
  },
  {
    id: 4,
    title: '茫',
    artist: '李润祺',
    album: '茫',
    cover: 'https://picsum.photos/id/1075/100/100',
    duration: 198,
  },
])

// 引用
const lyricContainer = ref(null)
const progressBar = ref(null)
const volumeBar = ref(null)

// 工具函数：格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 监听歌词索引变化，自动滚动
watch(
  currentLyricIndex,
  (newIndex) => {
    if (activeTab.value === 'lyric' && lyricContainer.value) {
      nextTick(() => {
        const lyricElement = lyricContainer.value.children[0]?.children[newIndex]
        if (lyricElement) {
          const containerRect = lyricContainer.value.getBoundingClientRect()
          const lyricRect = lyricElement.getBoundingClientRect()
          const scrollTop =
            lyricContainer.value.scrollTop +
            (lyricRect.top - containerRect.top) -
            (containerRect.height / 2 - lyricRect.height / 2)
          lyricContainer.value.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      })
    }
  },
  { immediate: true },
)

// 手动滚动歌词处理
const handleLyricScroll = () => {}

// 播放控制方法
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  ElMessage.success(isPlaying.value ? '继续播放' : '暂停播放')
}

// 进度条点击跳转
const seekProgress = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = (clickX / rect.width) * 100
  progress.value = Math.min(100, Math.max(0, percentage))
}

// 音量调节
const adjustVolume = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = (clickX / rect.width) * 100
  volume.value = Math.min(100, Math.max(0, Math.round(percentage)))
  muted.value = false
}

// 静音切换
const toggleMute = () => {
  muted.value = !muted.value
  ElMessage.info(muted.value ? '已静音' : '取消静音')
}

// 随机播放切换
const toggleShuffle = () => {
  shuffle.value = !shuffle.value
  ElMessage.info(shuffle.value ? '已开启随机播放' : '已关闭随机播放')
}

// 循环播放切换
const toggleLoop = () => {
  loop.value = !loop.value
  ElMessage.info(loop.value ? '已开启单曲循环' : '已关闭单曲循环')
}

// 收藏切换
const toggleLike = () => {
  liked.value = !liked.value
  ElMessage.success(liked.value ? '已收藏歌曲' : '已取消收藏')
}

// 上一曲
const prevSong = () => {
  const currentIndex = playlist.value.findIndex((song) => song.id === currentSong.value.id)
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.value.length - 1
  currentSong.value = playlist.value[prevIndex]
  progress.value = 0
  isPlaying.value = true
  ElMessage.success(`正在播放：${currentSong.value.title}`)
}

// 下一曲
const nextSong = () => {
  const currentIndex = playlist.value.findIndex((song) => song.id === currentSong.value.id)
  const nextIndex = shuffle.value
    ? Math.floor(Math.random() * playlist.value.length)
    : (currentIndex + 1) % playlist.value.length
  currentSong.value = playlist.value[nextIndex]
  progress.value = 0
  isPlaying.value = true
  ElMessage.success(`正在播放：${currentSong.value.title}`)
}

// 播放MV
const playMV = () => {
  ElMessage.info(`即将播放《${currentSong.title}》MV`)
}

// 跳转到歌词对应时间
const seekToLyric = (time) => {
  progress.value = (time / currentSong.value.duration) * 100
}

// 播放推荐歌曲
const playRecommendation = (song) => {
  const exists = playlist.value.some((item) => item.id === song.id)
  if (!exists) {
    playlist.value.push(song)
  }
  currentSong.value = song
  progress.value = 0
  isPlaying.value = true
  ElMessage.success(`正在播放：${song.title}`)
}

// 选择播放列表歌曲
const selectSong = (song) => {
  currentSong.value = song
  progress.value = 0
  isPlaying.value = true
  showPlaylistDrawer.value = false
  ElMessage.success(`正在播放：${song.title}`)
}

// 切换播放列表显示
const togglePlaylist = () => {
  showPlaylistDrawer.value = !showPlaylistDrawer.value
}

// 清空播放列表
const clearPlaylist = () => {
  playlist.value = [currentSong.value]
  ElMessage.success('已清空播放列表（保留当前歌曲）')
}

// 切换歌词悬浮窗
const toggleLyricShow = () => {
  showFloatLyric.value = !showFloatLyric.value
}

// 全屏切换
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      ElMessage.error(`全屏失败：${err.message}`)
    })
    isFullScreen.value = true
  } else {
    document.exitFullscreen()
    isFullScreen.value = false
  }
}

// 标签页切换处理
const handleTabChange = (tab) => {
  activeTab.value = tab.props.name
  if (activeTab.value === 'lyric') {
    nextTick(() => {
      updateLyricScroll()
    })
  }
}

// 更新歌词滚动位置
const updateLyricScroll = () => {
  if (lyricContainer.value && currentLyricIndex.value >= 0) {
    nextTick(() => {
      const lyricElement = lyricContainer.value.children[0]?.children[currentLyricIndex.value]
      if (lyricElement) {
        const containerHeight = lyricContainer.value.clientHeight
        const lyricHeight = lyricElement.offsetHeight
        const lyricTop = lyricElement.offsetTop
        const scrollTop = lyricTop - (containerHeight / 2 - lyricHeight / 2)
        lyricContainer.value.scrollTop = scrollTop
      }
    })
  }
}

// 生命周期
onMounted(() => {
  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', () => {
    isFullScreen.value = !!document.fullscreenElement
  })

  // 模拟播放进度自动更新
  const progressInterval = setInterval(() => {
    if (isPlaying.value && progress.value < 100) {
      progress.value += 0.1
      if (progress.value >= 100) {
        if (loop.value) {
          progress.value = 0 // 单曲循环
        } else {
          nextSong() // 自动下一曲
        }
      }
    }
  }, 100)

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(progressInterval)
    document.removeEventListener('fullscreenchange', () => {})
  })
})
</script>

<style scoped>
/* 隐藏滚动条（全局应用） */
.scrollbar-hide,
.lyric-container {
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth; /* 平滑滚动 */
}

.scrollbar-hide::-webkit-scrollbar,
.lyric-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari 和 Opera */
}

/* 唱片旋转动画（调整速度） */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 12s linear infinite;
}

/* 渐变文字动画 */
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

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

/* 标签页自定义样式（放大版） */
.custom-tabs :deep(.el-tabs__item) {
  color: #9ca3af;
  transition: color 0.3s ease;
  padding: 0 16px;
  font-size: 14px;
}

.custom-tabs :deep(.el-tabs__item):hover {
  color: #f9a8d4;
}

.custom-tabs :deep(.el-tabs__item.is-active) {
  color: #f9a8d4;
  font-weight: 500;
}

.custom-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(to right, #ec4899, #8b5cf6);
  height: 2px;
}

.custom-tabs :deep(.el-tabs__nav-wrap::after) {
  background-color: rgba(255, 255, 255, 0.1);
  height: 1px;
}

/* 抽屉自定义样式（放大版） */
.custom-drawer :deep(.el-drawer) {
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(15px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.custom-drawer :deep(.el-drawer__title) {
  font-size: 18px;
  font-weight: 500;
}

.custom-drawer :deep(.el-drawer__close-btn) {
  color: #9ca3af;
  font-size: 18px;
}

.custom-drawer :deep(.el-drawer__close-btn):hover {
  color: white;
}

.custom-drawer :deep(.el-drawer__body) {
  padding: 0;
}

/* 响应式调整（确保无滚动条+填充空间） */
@media (max-width: 768px) {
  .music-player {
    padding-bottom: 120px;
  }

  /* 强制隐藏页面滚动条 */
  body {
    overflow: hidden !important;
  }

  /* 底部控制栏适配 */
  .w-1\/4 {
    width: 25%;
  }

  .gap-4 {
    gap: 8px;
  }

  .w-12.h-12.md\:w-14.h-14 {
    width: 40px;
    height: 40px;
  }

  .text-sm.md\:text-lg {
    font-size: 14px;
  }
}

/* 按钮交互效果优化 */
button {
  outline: none;
  transition: all 0.2s ease;
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.3);
}

/* 歌词悬浮窗样式（放大版） */
.fixed.bottom-24 {
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 15px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 替换原报错行 */
.custom-drawer :deep(.el-drawer .hover\:bg-gray-800\/50:hover) {
  background-color: rgba(31, 41, 55, 0.5) !important;
}

/* 进度条样式（放大版） */
:deep(.el-slider__runway):hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>

<route lang="yaml">
meta:
  layout: empty
</route>
