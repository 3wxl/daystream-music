<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <IconFontSymbol name="gongzuotai-dongtaishenhe"></IconFontSymbol>
        <span>当前展示的轮播图（共4个）</span>
      </h2>
      <span class="text-sm text-gray-500">更新时间: {{ formatDate(currentDisplayUpdateTime) }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div
        v-for="(banner, index) in currentDisplayBanners"
        :key="banner.id"
        class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all group relative"
      >
        <div class="absolute top-2 left-2 flex gap-1">
          <el-tag type="success" size="mini">展示中</el-tag>
          <el-tag v-if="banner.isDefault" size="mini" class="bg-gray-200 text-gray-700">默认</el-tag>
        </div>
        <div class="relative aspect-video bg-gray-50">
          <img
            :src="banner.imageUrl"
            alt="轮播图"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
            <h3 class="font-medium text-sm truncate">{{ banner.name }}</h3>
            <div class="text-xs mt-1 opacity-90 flex flex-wrap gap-1">
              <el-tag size="mini" :type="getClickTypeTagType(banner.clickType)" class="mr-1">
                {{ getClickTypeText(banner.clickType) }}
              </el-tag>
            </div>
            <div class="text-xs mt-1 opacity-80 truncate">
              {{ banner.clickType === 'link' ? `链接: ${banner.linkUrl}` :
                 banner.clickType === 'music' ? `音乐: ${banner.musicName}` :
                 banner.clickType === 'playlist' ? `歌单: ${banner.playlistName}` : '无点击行为' }}
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

const props = defineProps({
  currentDisplayBanners: { type: Array, required: true },
  formatDate: { type: Function, required: true },
  currentDisplayUpdateTime: { type: Date, required: true },
  getClickTypeText: { type: Function, required: true },
  getClickTypeTagType: { type: Function, required: true }
});
</script>
