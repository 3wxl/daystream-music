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
            <img src="https://www.histweilai.top/minio/file/70567a01-09d0-443b-9d8a-bab6e5623967.png" class="w-full h-full object-cover" alt="">
          </div>
          <div class="flex-1">
            <h4 class="text-2xl font-bold text-gray-900 mb-2">name</h4>
            <div class="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-200 to-pink-400 text-white px-3 py-1 rounded-full">
              <IconFontSymbol name="quanbutongguo"/>
              <span class="text-sm">认证音乐人</span>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-around">
          <span class="">
            <IconFontSymbol name="aixin1" class="text-pink-600"/>
            粉丝 · <span class="text-pink-400">100w</span>
          </span>
          <span class="">
            <IconFontSymbol name="geshou" class="text-pink-600"/>
            歌曲 · <span class="text-pink-400">56</span>
          </span>
          <span class="">
            <IconFontSymbol name="zhuanjiguangpan" class="text-pink-600"/>
            专辑 · <span class="text-pink-400">13</span>
          </span>
          <span class="">
            <IconFontSymbol name="songbook_mv" class="text-pink-600"/>
            MV · <span class="text-pink-400">41</span>
          </span>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h5 class="font-semibold mb-3 text-gray-700 flex items-center space-x-2">
            <IconFontSymbol name="wanshanxinxi"/>
            <span>个人简介</span>
          </h5>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line">擅长唱跳rap篮球</p>
        </div>
        <div class="flex justify-end space-x-4 pt-4">
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
  let showDetail = defineModel<boolean>({ default: false })
</script>

<style scoped>

</style>
