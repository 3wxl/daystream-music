<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <IconFontSymbol name="sandian"></IconFontSymbol>
        <span>所有轮播图</span>
      </h2>
      <span class="text-sm text-gray-500">共 {{ filteredBanners.length }} 张轮播图（1张默认 + {{ filteredBanners.length - 1 }} 张自定义）</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      <div
        v-for="(banner, index) in filteredBanners"
        :key="banner.id"
        class="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-all group relative"
      >
        <div class="relative aspect-video bg-gray-50">
          <img
            :src="banner.imageUrl"
            alt="轮播图"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute top-2 right-2 flex gap-1">
            <el-tooltip content="编辑">
              <el-button
                size="mini"
                circle
                @click.stop="$emit('openEditDialog', banner)"
                class="bg-white/80 hover:bg-white text-gray-700 shadow-sm"
              >
                <IconFontSymbol name="bianji"></IconFontSymbol>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除" v-if="!banner.isDefault">
              <el-button
                size="mini"
                circle
                @click.stop="$emit('handleDelete', banner.id)"
                class="bg-white/80 hover:bg-red-500/80 hover:text-red-500 text-red-500 shadow-sm"
              >
                <IconFontSymbol name="shanchu"></IconFontSymbol>
              </el-button>
            </el-tooltip>
            <el-tooltip content="默认轮播图不可删除" v-else>
              <el-button
                size="mini"
                circle
                disabled
                class="bg-white/50 text-gray-400 shadow-sm cursor-not-allowed"
              >
                <IconFontSymbol name="shanchu"></IconFontSymbol>
              </el-button>
            </el-tooltip>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3">
            <h3 class="font-medium text-sm truncate">{{ banner.name }}</h3>
            <div class="text-xs mt-1 opacity-90 flex flex-wrap gap-1">
              <el-tag size="mini" :type="banner.isDefault ? 'default' : 'primary'" class="mr-1">
                {{ banner.isDefault ? '系统默认' : '自定义' }}
              </el-tag>
              <el-tag size="mini" :type="getClickTypeTagType(banner.clickType)" class="mr-1">
                {{ getClickTypeText(banner.clickType) }}
              </el-tag>
              <el-tag size="mini" :type="isCurrentlyDisplayed(banner) ? 'success' : (isActive(banner) ? 'info' : 'warning')">
                {{ isCurrentlyDisplayed(banner) ? '当前展示' : (isActive(banner) ? '展示中' : '未生效') }}
              </el-tag>
            </div>
            <div class="text-xs mt-1 opacity-80 flex items-center gap-1">
              <el-icon size="12"><Clock /></el-icon>
              {{ formatDate(banner.startTime) }} 至 {{ formatDate(banner.endTime) }}
            </div>
          </div>
          <el-tag v-if="banner.isDefault" class="absolute top-2 left-2 text-xs bg-gray-200 text-gray-700">
            默认轮播图
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { ElTag, ElTooltip, ElButton, ElIcon } from 'element-plus';
import { Clock } from '@element-plus/icons-vue';

const props = defineProps({
  filteredBanners: { type: Array, required: true },
  formatDate: { type: Function, required: true },
  isActive: { type: Function, required: true },
  isCurrentlyDisplayed: { type: Function, required: true },
  getClickTypeText: { type: Function, required: true },
  getClickTypeTagType: { type: Function, required: true }
});

const emit = defineEmits(['openEditDialog', 'handleDelete']);
</script>
