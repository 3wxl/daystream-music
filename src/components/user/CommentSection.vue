<template>
  <div class="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
    <div v-if="comments.length === 0" class="py-12 text-center">
      <el-empty description="暂无收到的评论" class="text-gray-500" />
    </div>

    <div class="comment-list divide-y divide-gray-800">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="p-4 hover:bg-gray-800/20 transition-colors"
      >
        <div class="flex gap-3">
          <el-avatar :size="40" class="border border-gray-700">
            <img :src="comment.userAvatar" alt="评论者头像" class="object-cover" />
          </el-avatar>

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap justify-between items-start gap-2">
              <span class="text-white font-medium text-sm">{{ comment.username }}</span>
              <span class="text-gray-500 text-xs whitespace-nowrap">{{
                formatTime(comment.time)
              }}</span>
            </div>

            <div class="mt-1 text-gray-300 text-sm leading-relaxed">
              {{ comment.content }}
            </div>

            <div
              v-if="comment.source"
              class="mt-2 inline-block px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
            >
              来自 {{ comment.source }}
            </div>

            <div class="mt-3 flex items-center gap-4">
              <button
                class="flex items-center gap-1 text-gray-500 hover:text-pink-500 text-sm transition-colors"
              >
                <Heart class="w-4 h-4" />
                <span>{{ comment.likeCount }}</span>
              </button>
              <button
                class="flex items-center gap-1 text-gray-500 hover:text-pink-500 text-sm transition-colors"
              >
                <MessageCircle class="w-4 h-4" />
                <span>回复</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const comments = ref([
  {
    id: 1,
    username: '用户A',
    userAvatar: 'https://picsum.photos/50/50?random=13',
    time: 1699876543210,
    content: '你的歌单太棒了！特别是那首《夏日晚风》，循环了一下午~',
    likeCount: 12,
    source: '歌单《治愈系民谣》',
  },
  {
    id: 2,
    username: '用户B',
    userAvatar: 'https://picsum.photos/50/50?random=14',
    time: 1699765432109,
    content: '推荐一首《星光》，你可能会喜欢，风格很像你收藏的歌曲',
    likeCount: 5,
    source: '个人主页',
  },
])

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
</script>
