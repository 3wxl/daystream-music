<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <UserHeader :userInfo="userInfo" :isOthersPage="false" />

      <div class="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
        <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <div class="shrink-0 w-[280px]">
            <h3 class="text-white font-semibold flex items-center">
              <img src="../../assets/爱心动图.gif" alt="" class="w-12" />
              我喜欢的歌曲
            </h3>
          </div>
          <div v-if="likedSongs.length > 0" class="w-[200px] text-center">
            <span class="text-gray-400 text-sm">专辑</span>
          </div>
          <router-link to="/User/LikedSongsList">
            <div v-if="likedSongs.length > 0" class="shrink-0 w-[100px] flex justify-end">
              <el-button type="text" size="small" class="text-gray-400 hover:text-white">
                查看全部
              </el-button>
            </div>
          </router-link>
        </div>
        <LikedSongs />
      </div>

      <div class="flex flex-col md:flex-row gap-20">
        <div class="flex-[3] min-w-[200px]">
          <MusicStatistics />
        </div>
        <div class="flex-[6]">
          <PlaylistSection />
        </div>
      </div>
      <div>
        <FollowSection />
      </div>

      <div>
        <h3 class="text-xl font-bold mb-4 flex items-center">
          <MessageSquare class="text-pink-500 mr-2" />
          收到的评论
        </h3>
        <CommentSection />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const likedSongs = ref([
  {
    id: 1,
    name: '夏日晚风',
    artist: 'Daystream Music',
    album: '晚风集',
    cover: 'https://picsum.photos/80/80?random=1',
    duration: 237,
    tags: ['超清母带', 'MV'],
    isLiked: true,
  },
  {
    id: 2,
    name: '星光坠落时',
    artist: 'Daystream Music',
    album: '星光合集',
    cover: 'https://picsum.photos/80/80?random=2',
    duration: 198,
    tags: ['VIP', '无损'],
    isLiked: false,
  },
  {
    id: 3,
    name: '城市浪漫',
    artist: 'Daystream Music',
    album: '城市之声',
    cover: 'https://picsum.photos/80/80?random=3',
    duration: 215,
    tags: ['超清母带'],
    isLiked: true,
  },
  {
    id: 4,
    name: '深海回响',
    artist: 'Daystream Music',
    album: '深海秘境',
    cover: 'https://picsum.photos/80/80?random=4',
    duration: 242,
    tags: [],
    isLiked: false,
  },
])

const userInfo = ref({
  name: '音乐爱好者',
  avatar: 'https://picsum.photos/100/100?random=20',
  signature: '喜欢一切美好的音乐，分享治愈系歌单',
  followCount: 32,
  fansCount: 156,
  likedCount: 248,
  isVip: true,
})
</script>
<route lang="yaml">
meta:
  layout: main
</route>
