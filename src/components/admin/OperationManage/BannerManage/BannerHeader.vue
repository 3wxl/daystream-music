<template>
  <div>
    <header class="mb-3">
      <h1 class="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-800 flex items-center gap-3">
        <IconFontSymbol name="lunbotuguanli" class="text-[#363636]" size="45px"></IconFontSymbol>
        <span>轮播图管理</span>
      </h1>
    </header>

    <div class="bg-gray-50 rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex flex-wrap gap-3">
        <el-button
          type="primary"
          @click="$emit('openAddDialog')"
          class="bg-blue-500 hover:bg-blue-600 text-white transition-all"
        >
          <IconFontSymbol name="tianjia" class="text-[white] mr-1" size="16px"></IconFontSymbol>
          添加轮播图
        </el-button>
        <el-button
          type="default"
          @click="$emit('refreshData')"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:text-blue-600 relative"
        >
          <IconFontSymbol name="refresh" class="text-[#363636] mr-1" size="15px"></IconFontSymbol>
          刷新
        </el-button>
        <el-button
          type="default"
          @click="$emit('preview')"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:text-blue-600 relative"
        >
          <IconFontSymbol name="print-view" class="text-[#363636] mr-1 relative top-[1px]" size="13px"></IconFontSymbol>
          预览
        </el-button>
      </div>
      <div class="w-[250px]">
        <AdminInput
          v-model="searchKeyword"
          placeholder="搜索轮播图名称"
          prefix="&#xe65c;"
          width="250px"
          @input="$emit('searchChange', $event)"
        ></AdminInput>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminInput from '@/components/admin/AdminInput.vue';
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  searchKeyword: { type: String, default: '' }
});

const emit = defineEmits(['openAddDialog', 'refreshData', 'preview', 'searchChange']);
const searchKeyword = ref(props.searchKeyword);
</script>
