<template>
  <div class="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
    <!-- 头部 -->
    <div class="flex justify-between items-center px-5 py-3 border-b border-gray-800">
      <h3 class="text-white font-semibold flex items-center">
        <Music class="text-pink-500 mr-2" />
        我的作品
      </h3>
      <el-button
        type="primary"
        size="small"
        class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0"
      >
        <Plus class="mr-1" /> 发布作品
      </el-button>
    </div>

    <!-- 作品列表 -->
    <div v-if="works.length === 0" class="py-12 text-center">
      <el-empty description="暂无已发布作品" class="text-gray-500" />
    </div>

    <div class="divide-y divide-gray-800">
      <div v-for="work in works" :key="work.id" class="p-4 hover:bg-gray-800/20 transition-colors">
        <div class="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <!-- 作品封面 -->
          <div class="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 group">
            <img :src="work.cover" class="w-full h-full object-cover" />
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <div class="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          </div>

          <!-- 作品信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-start gap-2">
              <h4 class="text-white font-medium text-base">{{ work.name }}</h4>
              <el-tag
                v-if="work.isNew"
                class="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs"
              >
                新发布
              </el-tag>
            </div>

            <div class="mt-1 text-gray-400 text-sm">发行时间：{{ work.releaseTime }}</div>

            <!-- 数据统计 -->
            <div class="flex flex-wrap gap-4 mt-2">
              <div class="flex items-center gap-1 text-gray-400 text-sm">
                <PlayCircle class="w-4 h-4" />
                <span>{{ formatNumber(work.playCount) }} 播放</span>
              </div>
              <div class="flex items-center gap-1 text-gray-400 text-sm">
                <Heart class="w-4 h-4" />
                <span>{{ formatNumber(work.likeCount) }} 喜欢</span>
              </div>
              <div class="flex items-center gap-1 text-gray-400 text-sm">
                <MessageCircle class="w-4 h-4" />
                <span>{{ formatNumber(work.commentCount) }} 评论</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-2 mt-3 md:mt-0">
            <el-button type="text" size="small" class="text-gray-400 hover:text-white p-1 h-auto">
              <Edit class="w-4 h-4" />
            </el-button>
            <el-button type="text" size="small" class="text-gray-400 hover:text-red-400 p-1 h-auto">
              <Delete class="w-4 h-4" />
            </el-button>
            <el-button type="text" size="small" class="text-gray-400 hover:text-white p-1 h-auto">
              <Share class="w-4 h-4" />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 格式化数字（1000 → 1k）
const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// 模拟数据
const works = ref([
  {
    id: 1,
    name: '夏日晚风',
    cover: 'https://picsum.photos/100/100?random=15',
    releaseTime: '2024-05-12',
    playCount: 12500,
    likeCount: 3200,
    commentCount: 450,
    isNew: false,
  },
  {
    id: 2,
    name: '星光坠落时',
    cover: 'https://picsum.photos/100/100?random=16',
    releaseTime: '2024-09-03',
    playCount: 8900,
    likeCount: 2100,
    commentCount: 320,
    isNew: true,
  },
])
</script>
