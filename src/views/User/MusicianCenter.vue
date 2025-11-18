<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <UserHeader :userInfo="musicianInfo" :isOthersPage="false" />
    <h3 class="mt-8 mb-4 text-lg font-semibold text-gray-800 pl-3 border-l-3 border-pink-500">
      音乐人信息
    </h3>
    <MusicianIntro class="mb-8" />
    <h3 class="mb-4 text-lg font-semibold text-gray-800 pl-3 border-l-3 border-pink-500">
      我的作品
    </h3>
    <MusicianWorks class="mb-8" />
    <h3 class="mb-4 text-lg font-semibold text-gray-800 pl-3 border-l-3 border-pink-500">
      我的专辑
    </h3>
    <PlaylistSection class="mb-8" />
    <h3 class="mb-4 text-lg font-semibold text-gray-800 pl-3 border-l-3 border-pink-500">
      我的动态
    </h3>
    <MusicianDynamic class="mb-8" />
    <h3 class="mb-4 text-lg font-semibold text-gray-800 pl-3 border-l-3 border-pink-500">
      收到的评论
    </h3>
    <CommentSection />
    <router-view />
  </div>
</template>

<script setup lang="ts">
const musicianInfo = {
  name: 'Daystream',
  avatar: 'https://picsum.photos/100/100?random=21',
  signature: '独立音乐人 | 创作不止于声',
  followCount: 125,
  fansCount: 12400,
  likedCount: 56800,
}
</script>
<route lang="yaml">
meta:
  layout: main
</route>
