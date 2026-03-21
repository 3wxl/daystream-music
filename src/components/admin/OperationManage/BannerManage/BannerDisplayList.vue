<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <IconFontSymbol name="gongzuotai-dongtaishenhe"></IconFontSymbol>
        <span>当前展示的轮播图（共4个）</span>
      </h2>
      <span class="text-sm text-gray-500">更新时间: {{ formatDate(new Date()) }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all group relative"
      >
        <div class="relative aspect-video bg-gray-50">
          <img
            :src="banner.imageUrl"
            alt="轮播图"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span class="absolute top-0 right-2 top-1 text-white text-xs p-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
            更新时间：{{ formatDate(banner.updateTime) }}
          </span>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3 flex">
            <div>
              <h3 class="font-medium text-sm truncate">{{ banner.name }}</h3>
              <div class="text-xs mt-1 opacity-90 flex flex-wrap gap-1">
                <el-tag size="mini" :type="banner.actionType==0?'info':'primary'" class="mr-1">
                  {{ clickTypeText[banner.actionType]  }}
                </el-tag>
              </div>
              <div class="text-xs mt-1 opacity-80 truncate">
                {{ clickType[banner.actionType] }}
              </div>
            </div>
            <div class="ml-auto items-center">
              <span
                @click="updateSong"
                @mousedown.stop
                class=" opacity-0 group-hover:opacity-[1] duration-800 p-1 px-2 rounded-[100px] absolute right-3 bottom-3 bg-[rgba(255,255,255,0.1)] cursor-pointer"
              >
                <IconFontSymbol name="a-shezhi-shucaidanshezhi-copy" class="text-white" size="16px"/>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { ElTag } from 'element-plus';

const { banners, formatDate, clickTypeText } = defineProps({
  banners: { type: Array, required: true },
  formatDate: { type: Function, required: true },
  clickTypeText: {type: Object, required: true },
  clickType:{type: Object, required: true }
});

onMounted(()=>{

})
</script>
