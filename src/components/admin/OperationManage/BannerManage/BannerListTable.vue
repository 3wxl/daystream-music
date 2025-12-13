<template>
  <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <IconFontSymbol name="liebiao"></IconFontSymbol>
      <span>轮播图列表</span>
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">轮播图名称</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">类型</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">点击类型</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">开始时间</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">结束时间</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(bannerObj, index) in filteredBanners"
            :key="bannerObj.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 border-b border-gray-100 font-medium">
              {{ bannerObj.name }}
              <el-tag size="mini" v-if="bannerObj.isDefault" class="ml-2 bg-gray-200 text-gray-700">默认</el-tag>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag :type="bannerObj.isDefault ? 'default' : 'primary'">
                {{ bannerObj.isDefault ? '系统默认' : '自定义' }}
              </el-tag>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag :type="getClickTypeTagType(bannerObj.clickType)">
                {{ getClickTypeText(bannerObj.clickType) }}
              </el-tag>
              <div class="text-xs text-gray-500 mt-1 truncate">
                {{ bannerObj.clickType === 'link' ? bannerObj.linkUrl :
                   bannerObj.clickType === 'music' ? bannerObj.musicName :
                   bannerObj.clickType === 'playlist' ? bannerObj.playlistName : '无' }}
              </div>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">{{ formatDate(bannerObj.startTime) }}</td>
            <td class="py-3 px-4 border-b border-gray-100">{{ formatDate(bannerObj.endTime) }}</td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag
                :type="isCurrentlyDisplayed(bannerObj) ? 'success' : (isActive(bannerObj) ? 'info' : 'warning')"
              >
                {{ isCurrentlyDisplayed(bannerObj) ? '当前展示' : (isActive(bannerObj) ? '展示' : '未生效') }}
              </el-tag>
            </td>
          </tr>
          <tr v-if="filteredBanners.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500">
              <el-empty description="暂无轮播图数据" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { ElEmpty, ElTag } from 'element-plus';

const props = defineProps({
  filteredBanners: { type: Array, required: true },
  formatDate: { type: Function, required: true },
  isActive: { type: Function, required: true },
  isCurrentlyDisplayed: { type: Function, required: true },
  getClickTypeText: { type: Function, required: true },
  getClickTypeTagType: { type: Function, required: true }
});
</script>
