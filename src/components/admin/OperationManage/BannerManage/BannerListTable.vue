<template>
  <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <IconFontSymbol name="liebiao"></IconFontSymbol>
      <span>轮播图列表</span>
      <div class="w-[250px] ml-auto">
        <AdminInput
          v-model="searchKeyword"
          placeholder="搜索轮播图名称"
          prefix="&#xe65c;"
          width="250px"
          @input="$emit('searchChange', searchKeyword)"
        ></AdminInput>
      </div>
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">轮播图名称</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">权重</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">点击类型</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">状态</th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(bannerObj) in filteredBanners"
            :key="bannerObj.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="py-3 px-4 border-b border-gray-100 font-medium">
              {{ bannerObj.title }}
              <el-tag size="mini" v-if="bannerObj.isDefault" class="ml-2 bg-gray-200 text-gray-700">默认</el-tag>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag type="warning" size="mini">{{ bannerObj.sortOrder || 0 }}</el-tag>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag :type="getClickTypeTagType(bannerObj.actionType)">
                {{ getClickTypeText(bannerObj.actionType) }}
              </el-tag>
              <div class="text-xs text-gray-500 mt-1 truncate">
                {{ bannerObj.actionType === 'TO_ACTIVITY' ? bannerObj.linkUrl :
                   bannerObj.actionType === 'TO_SINGER' ? '歌曲' :
                   bannerObj.actionType === 'TO_PLAYLIST' ? '歌单' : '无' }}
              </div>
            </td>
            <td class="py-3 px-4 border-b border-gray-100">
              <el-tag
                :type="isCurrentlyDisplayed(bannerObj) ? 'success' : 'info'"
              >
                {{ isCurrentlyDisplayed(bannerObj) ? '当前展示' : '未生效' }}
              </el-tag>
            </td>
          </tr>
          <tr v-if="filteredBanners.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-500">
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
import AdminInput from '@/components/admin/AdminInput.vue';

const props = defineProps({
  filteredBanners: { type: Array, required: true },
  formatDate: { type: Function, required: true },
  isCurrentlyDisplayed: { type: Function, required: true },
  getClickTypeText: { type: Function, required: true },
  getClickTypeTagType: { type: Function, required: true },
  searchKeyword: { type: String, default: '' }
});

const emit = defineEmits(['searchChange']);
const searchKeyword = ref(props.searchKeyword);
</script>
