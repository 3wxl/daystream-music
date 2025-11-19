<template>
  <div class="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
    <!-- 头部 -->
    <div class="flex justify-between items-center px-5 py-3 border-b border-gray-800">
      <h3 class="text-white font-semibold flex items-center">
        <Activity class="text-pink-500 mr-2" />
        我的动态
      </h3>
      <el-button
        type="primary"
        size="small"
        class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0"
      >
        <Plus class="mr-1" /> 发布动态
      </el-button>
    </div>

    <!-- 动态列表 -->
    <div v-if="dynamics.length === 0" class="py-12 text-center">
      <el-empty description="暂无动态，发布第一条动态吧" class="text-gray-500" />
    </div>

    <div class="divide-y divide-gray-800">
      <div
        v-for="dynamic in dynamics"
        :key="dynamic.id"
        class="p-4 hover:bg-gray-800/20 transition-colors"
      >
        <div class="flex gap-3">
          <!-- 头像 -->
          <el-avatar :size="40" class="border border-gray-700">
            <img :src="dynamic.avatar" alt="头像" class="object-cover" />
          </el-avatar>

          <!-- 动态内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap justify-between items-start gap-2">
              <span class="text-white font-medium text-sm">{{ dynamic.author }}</span>
              <span class="text-gray-500 text-xs whitespace-nowrap">{{
                formatTime(dynamic.time)
              }}</span>
            </div>

            <div class="mt-1 text-gray-300 text-sm leading-relaxed">
              {{ dynamic.content }}
            </div>

            <!-- 动态图片 -->
            <div v-if="dynamic.images.length" class="mt-3 grid grid-cols-3 gap-2">
              <img
                v-for="(img, idx) in dynamic.images"
                :key="idx"
                :src="img"
                class="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>

            <!-- 互动区 -->
            <div class="mt-3 flex items-center gap-6">
              <button
                class="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 text-sm transition-colors group"
              >
                <Heart class="w-4 h-4 group-hover:fill-pink-500 transition-all" />
                <span>{{ dynamic.likeCount }}</span>
              </button>
              <button
                class="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 text-sm transition-colors"
              >
                <MessageCircle class="w-4 h-4" />
                <span>{{ dynamic.commentCount }}</span>
              </button>
              <button
                class="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 text-sm transition-colors"
              >
                <Share class="w-4 h-4" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 格式化时间（多久前）
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  return `${Math.floor(diff / day)}天前`
}

// 模拟数据
const dynamics = ref([
  {
    id: 1,
    author: 'Daystream',
    avatar: 'https://picsum.photos/100/100?random=21',
    time: Date.now() - 3 * 60 * 60 * 1000, // 3小时前
    content:
      '新单曲《夏夜星芒》已上线各大平台，感谢大家的支持！这次尝试了新的编曲风格，希望你们喜欢~',
    images: ['https://picsum.photos/300/300?random=17', 'https://picsum.photos/300/300?random=18'],
    likeCount: 320,
    commentCount: 45,
  },
  {
    id: 2,
    author: 'Daystream',
    avatar: 'https://picsum.photos/100/100?random=21',
    time: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2天前
    content: '正在筹备新专辑，预计9月发布，先放一张录音室花絮~ 猜猜这次会有多少首歌？',
    images: ['https://picsum.photos/300/300?random=19'],
    likeCount: 189,
    commentCount: 23,
  },
])
</script>
