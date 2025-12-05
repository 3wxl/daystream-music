<template>
  <div
    class="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm"
  >
    <el-tabs
      v-model="activeTab"
      type="card"
      class="follow-tabs"
      :style="{
        '--el-tabs-active-color': '#ff4d94',
        '--el-tabs-border-color': 'transparent',
        '--el-bg-color': 'transparent',
        '--el-tab-font-size': '14px',
      }"
    >
      <el-tab-pane label="关注的歌手" name="artists">
        <div class="p-5">
          <div class="mb-5 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <el-input
              placeholder="搜索关注的歌手..."
              class="bg-gray-800/50 border-gray-700 pl-10 text-gray-300 placeholder:text-gray-500 focus:border-pink-500/50"
            />
          </div>

          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          >
            <div v-for="artist in followedArtists" :key="artist.id" class="group">
              <div class="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800/30">
                <img
                  :src="artist.avatar"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                ></div>
                <div
                  class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-pink-500/90 flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
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
                <div
                  v-if="artist.type"
                  class="absolute top-2 left-2 bg-gray-900/70 text-white text-xs px-2 py-0.5 rounded-full"
                >
                  {{ artist.type }}
                </div>
              </div>

              <h4
                class="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors"
              >
                {{ artist.name }}
              </h4>
              <p class="text-gray-500 text-xs mt-1 flex items-center">
                {{ artist.songCount }}首作品
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="关注的用户" name="users">
        <div class="p-5">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          >
            <div v-for="user in followedUsers" :key="user.id" class="group">
              <div class="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800/30">
                <img
                  :src="user.avatar"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                ></div>
                <div
                  class="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900"
                ></div>
                <div v-if="user.isVip" class="absolute top-2 left-2 text-yellow-400">
                  <Star class="w-4 h-4" />
                </div>
              </div>

              <h4
                class="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors"
              >
                {{ user.name }}
              </h4>
              <p class="text-gray-500 text-xs mt-1 flex items-center">
                <User class="w-3 h-3 mr-1" />
                {{ formatNumber(user.fansCount) }}粉丝
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的粉丝" name="fans">
        <div class="p-5">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          >
            <div v-for="fan in fans" :key="fan.id" class="group">
              <div class="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800/30">
                <img
                  :src="fan.avatar"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                ></div>
                <div
                  v-if="fan.isMutual"
                  class="absolute top-2 left-2 bg-blue-900/70 text-blue-300 text-xs px-2 py-0.5 rounded-full"
                >
                  互关
                </div>
              </div>

              <h4
                class="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors"
              >
                {{ fan.name }}
              </h4>
              <div class="mt-1 flex items-center justify-between">
                <p class="text-gray-500 text-xs flex items-center">
                  {{ fan.likedCount }}个共同喜好
                </p>
                <el-button
                  v-if="!fan.isFollowed"
                  size="small"
                  class="bg-pink-500/80 hover:bg-pink-600 text-white border-0 text-xs px-2.5 py-0.5 rounded-full h-auto"
                >
                  关注
                </el-button>
                <span
                  v-else
                  class="text-gray-500 text-xs bg-gray-800/50 px-2.5 py-0.5 rounded-full"
                >
                  已关注
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

const activeTab = ref('artists')

const followedArtists = ref([
  {
    id: 1,
    name: '林宥嘉',
    avatar: 'https://picsum.photos/200/200?random=30',
    songCount: 128,
    type: '华语',
  },
  {
    id: 2,
    name: 'IU',
    avatar: 'https://picsum.photos/200/200?random=31',
    songCount: 96,
    type: '韩语',
  },
  {
    id: 3,
    name: 'Ed Sheeran',
    avatar: 'https://picsum.photos/200/200?random=32',
    songCount: 87,
    type: '英语',
  },
  {
    id: 4,
    name: '周杰伦',
    avatar: 'https://picsum.photos/200/200?random=33',
    songCount: 156,
    type: '华语',
  },
  {
    id: 5,
    name: 'Billie Eilish',
    avatar: 'https://picsum.photos/200/200?random=34',
    songCount: 42,
    type: '英语',
  },
])

const followedUsers = ref([
  {
    id: 101,
    name: '音乐漫游者',
    avatar: 'https://picsum.photos/200/200?random=35',
    fansCount: 1250,
    isVip: true,
  },
  {
    id: 102,
    name: '深夜电台',
    avatar: 'https://picsum.photos/200/200?random=36',
    fansCount: 8900,
    isVip: true,
  },
  {
    id: 103,
    name: '民谣收集者',
    avatar: 'https://picsum.photos/200/200?random=37',
    fansCount: 320,
    isVip: false,
  },
  {
    id: 104,
    name: '电子迷',
    avatar: 'https://picsum.photos/200/200?random=38',
    fansCount: 5680,
    isVip: true,
  },
  {
    id: 105,
    name: '古典爱好者',
    avatar: 'https://picsum.photos/200/200?random=39',
    fansCount: 1240,
    isVip: false,
  },
])

const fans = ref([
  {
    id: 201,
    name: '小耳朵',
    avatar: 'https://picsum.photos/200/200?random=40',
    likedCount: 12,
    isFollowed: true,
    isMutual: true,
  },
  {
    id: 202,
    name: '旋律控',
    avatar: 'https://picsum.photos/200/200?random=41',
    likedCount: 8,
    isFollowed: false,
    isMutual: false,
  },
  {
    id: 203,
    name: '歌词本',
    avatar: 'https://picsum.photos/200/200?random=42',
    likedCount: 5,
    isFollowed: false,
    isMutual: false,
  },
  {
    id: 204,
    name: '节奏大师',
    avatar: 'https://picsum.photos/200/200?random=43',
    likedCount: 23,
    isFollowed: true,
    isMutual: true,
  },
  {
    id: 205,
    name: '音轨迷',
    avatar: 'https://picsum.photos/200/200?random=44',
    likedCount: 7,
    isFollowed: false,
    isMutual: false,
  },
])
</script>

<style lang="scss" scoped>
::v-deep(.el-tabs__nav) {
  background: linear-gradient(to right, rgba(30, 30, 30, 0.5), rgba(40, 40, 40, 0.3)) !important;
  padding: 0 12px !important;
  border-bottom: 1px solid #333 !important;
}

::v-deep(.el-tabs__item) {
  color: #a0a0a0 !important;
  padding: 12px 16px !important;
  margin: 0 2px !important;
  border-radius: 6px 6px 0 0 !important;
  transition: all 0.2s ease !important;
}

::v-deep(.el-tabs__item.is-active) {
  color: #ff4d94 !important;
  background-color: rgba(40, 40, 40, 0.8) !important;
  font-weight: 500 !important;
}

::v-deep(.el-tabs__item:hover:not(.is-active)) {
  color: #ddd !important;
  background-color: rgba(50, 50, 50, 0.5) !important;
}

::v-deep(.el-tabs__active-bar) {
  background-color: #ff4d94 !important;
  height: 2px !important;
}

::v-deep(.el-tabs__content) {
  background-color: transparent !important;
}
</style>
