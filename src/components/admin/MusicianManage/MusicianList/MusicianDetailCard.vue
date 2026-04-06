<template>
  <AdminConfirm
    :width="'672px'"
    :Teleport="'body'"
    :iconName="'sparkle'"
    :iconColor="'#3991FD'"
    :iconSize="20"
    :title="'音乐人详情'"
    :isCustom="true"
    v-model="showDetail"
  >
    <div class="mt-6">
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-lg">
            <a :href="musicianData.avatar" target="_blank">
              <img :src="musicianData.avatar" class="w-full h-full object-cover hover:scale-105 duration-300 cursor-pointer" alt="头像">
            </a>
          </div>
          <div class="flex-1">
            <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ musicianData.nickname }}</h4>
            <div class="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-200 to-pink-400 text-white px-3 py-1 rounded-full">
              <IconFontSymbol name="quanbutongguo"/>
              <span class="text-sm">认证音乐人</span>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-around">
          <span class="">
            <IconFontSymbol name="aixin1" class="text-pink-600"/>
            粉丝 · <span class="text-pink-400">{{ musicianData.fansCount }}</span>
          </span>
          <span class="">
            <IconFontSymbol name="geshou" class="text-pink-600"/>
            歌曲 · <span class="text-pink-400">{{musicianData.musicCount}}</span>
          </span>
          <span class="">
            <IconFontSymbol name="zhuanjiguangpan" class="text-pink-600"/>
            专辑 · <span class="text-pink-400">{{ musicianData.albumCount }}</span>
          </span>
          <span class="">
            <IconFontSymbol name="songbook_mv" class="text-pink-600"/>
            MV · <span class="text-pink-400">{{ musicianData.mvCount }}</span>
          </span>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h5 class="font-semibold mb-3 text-gray-700 flex items-center space-x-2">
            <IconFontSymbol name="wanshanxinxi" color="rgb(173, 70, 255)"/>
            <span>个人简介</span>
          </h5>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ musicianData.introduction }}</p>
        </div>
        <div class="mt-6 pb-6 pt-6 border-t border-gray-200">
          <h5 class="font-semibold mb-3 text-gray-700 flex items-center space-x-2">
            <IconFontSymbol name="a-shezhi-shucaidanshezhi-copy" color="rgb(173, 70, 255)"/>
            <span>音乐标签</span>
          </h5>
          <div class="flex flex-wrap gap-2">
            <span class="text-pink-400 text-[15px] font-[500]" v-if="musicianData.tags.length==0">没有设置风格标签</span>
            <span class="px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium" v-for="item in musicianData.tags" :key="item.id">{{ item }}</span>
          </div>
        </div>
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button @click="showDetail = false" class="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <IconFontSymbol name="fanhui1"/>
            <span>返回</span>
          </button>
        </div>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  const props = defineProps({
    musicianData: {
      type: Object,
      default: () => ({})
    }
  })
  let showDetail = defineModel<boolean>({ default: false })
</script>

<style scoped>

</style>
