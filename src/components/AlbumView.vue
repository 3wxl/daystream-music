<template>
  <div class="h-full flex flex-col bg-gray-800 rounded-lg">
    <header class="shrink-0 p-4 flex items-center justify-between border-b border-purple-900/50">
      <div>
        <h1 class="text-lg font-semibold text-gray-500">{{ playlist.name || 'EXO神曲' }}</h1>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-500 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
            ></path>
          </svg>
        </button>
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </header>

    <div class="flex-grow flex flex-col md:flex-row overflow-hidden">
      <div class="w-full md:w-1/4 flex-shrink-0 overflow-y-auto p-6 space-y-4 music-content">
        <img
          src="../assets/logo.jpg "
          alt="Album Cover"
          class="w-full rounded-lg shadow-lg aspect-square object-cover"
        />

        <div class="flex items-center space-x-2">
          <img :src="playlist.creator.avatar" alt="Creator Avatar" class="w-8 h-8 rounded-full" />
          <span class="text-sm font-medium text-gray-200">{{
            playlist.creator.name || '张艺兴'
          }}</span>
        </div>

        <div class="text-xs text-gray-400">
          <span>歌曲总数：{{ playlist.musicCount || '1230s首' }}</span>
        </div>

        <p class="text-sm text-gray-300 leading-relaxed">
          {{
            playlist.description ||
            '张艺兴（LAY），1991年10月7日出生于湖南省长沙市，中国内地流行乐男歌手、影视演员、音乐制作人、中国国家话剧院演员，韩国男子演唱组合EXO/EXO-M成员。 2005年参加湖南经视《明星学院》比赛并获得总决赛季军。 2008年成为韩国SM娱乐有限公司旗下练习生。 2012年以EXO团体和其子队EXO-M成员身份正式出道。 2015年加盟励志体验真人秀节目《极限挑战》受到广泛关注。 2016年凭借爱情喜剧片《前任2：备胎反击战》获得第四届中英电影节最佳男配角奖；同年，发行个人首张专辑《LOSE CONTROL》，并凭借该专辑获得音悦V榜年度盛典年度专辑、内地最佳男歌手两项奖项。'
          }}
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          这里是更多的简介内容，用于测试滚动条。Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p class="text-sm text-gray-300 leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      <div class="w-full md:flex-grow overflow-y-auto p-6 space-y-2 music-items">
        <MusicListItem :items="musicList" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MusicListItem from '@/components/MusicListItem.vue'
import { ref } from 'vue'

defineProps(['playlist', 'musicList'])

// const playlist = ref({
//   name: '非主流回忆杀 | 曾经火遍大街小巷网络歌曲',
//   coverImg: 'https://placehold.co/400x400/FF0077/FFFFFF?text=Album+Cover',
//   creator: {
//     name: 'OAM聒聒酱',
//     avatar: 'https://placehold.co/100x100/333/FFF?text=A',
//   },
//   songCount: 150,
//   description:
//     '回味那些90后非主流歌曲，见证了一代人的成长。也陪伴了他们懵懂青涩的时光。既然有美好的香甜品，也就有有苦涩的苦涩酒。',
// })

// const musicList = ref([
//   {
//     id: '1',
//     title: '如果爱能早些说',
//     artist: '苏永康',
//     cover: 'https://placehold.co/100x100/5A0A20/FFF?text=S',
//   },
//   {
//     id: '2',
//     title: '可只是个传说',
//     artist: '陈旭',
//     cover: 'https://placehold.co/100x100/7A0A30/FFF?text=C',
//   },
//   {
//     id: '3',
//     title: '爱我就跟我走',
//     artist: '王鹤铮',
//     cover: 'https://placehold.co/100x100/9A0A40/FFF?text=W',
//   },
//   {
//     id: '4',
//     title: '归零',
//     artist: '九千七',
//     cover: 'https://placehold.co/100x100/BA0A50/FFF?text=J',
//   },
//   {
//     id: '5',
//     title: '贝多芬的悲伤',
//     artist: '萧风',
//     cover: 'https://placehold.co/100x100/DA0A60/FFF?text=X',
//   },
//   {
//     id: '6',
//     title: '玫瑰花的葬礼',
//     artist: '许嵩',
//     cover: 'https://placehold.co/100x100/F00A70/FFF?text=V',
//   },
//   {
//     id: '7',
//     title: '不分手的恋爱',
//     artist: '汪苏泷',
//     cover: 'https://placehold.co/100x100/FF0077/FFF?text=W',
//   },
//   {
//     id: '8',
//     title: '客官不可以',
//     artist: '徐良',
//     cover: 'https://placehold.co/100x100/FF3399/FFF?text=X',
//   },
//   {
//     id: '9',
//     title: '犯贱',
//     artist: '阿悄',
//     cover: 'https://placehold.co/100x100/FF66AA/FFF?text=A',
//   },
//   {
//     id: '10',
//     title: '说爱你',
//     artist: '蔡依林',
//     cover: 'https://placehold.co/100x100/FF99CC/FFF?text=J',
//   },
//   {
//     id: '11',
//     title: 'Bad Boy',
//     artist: '张惠妹',
//     cover: 'https://placehold.co/100x100/FFCCEE/FFF?text=A',
//   },
//   {
//     id: '12',
//     title: '坡',
//     artist: 'C-Block',
//     cover: 'https://placehold.co/100x100/5A0A20/FFF?text=C',
//   },
//   {
//     id: '13',
//     title: 'Last Dance',
//     artist: '伍佰',
//     cover: 'https://placehold.co/100x100/7A0A30/FFF?text=W',
//   },
// ])
</script>

<style lang="scss" scoped>
.music-content,
.music-items {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
