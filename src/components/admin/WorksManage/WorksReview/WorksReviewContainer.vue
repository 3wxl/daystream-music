<template>
  <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
    <div class="flex justify-between">
      <span class="text-[18px] font-700 ml-2">歌曲审核</span>
      <div class="flex mr-8">
        <el-tooltip content="通过所选的歌曲">
          <IconFontSymbol name="quanbutongguo" class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-[0.3s] hover:text-[#529FFD] mr-4"></IconFontSymbol>
        </el-tooltip>
        <el-tooltip content="驳回所选歌曲">
          <IconFontSymbol name="quanbubohui" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
        </el-tooltip>
        <el-tooltip content="删除所选歌曲">
          <IconFontSymbol name="shanchu" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
        </el-tooltip>
        <el-tooltip content="刷新">
          <IconFontSymbol name="refresh" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
        </el-tooltip>
      </div>
    </div>
    <div class="user-table w-full mt-4">
      <MusicTable v-if="worksType==='1'" :songsList="songsList" :statusType="statusType"></MusicTable>
      <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
        <el-pagination
          background
          layout="prev, pager, next ,jumper"
          :total="total"
          :default-page-size="8"
          @current-change="changePage"
          @prev-click="changePage"
          @next-click="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    songsList:{
      type: Array,
      default: []
    },
    total:{
      type: Number,
      default: 0
    },
    worksType:{
      type: String,
      default: '1'
    },
    statusType:{
      type: Number,
      default: 0
    }
  })
  const emit = defineEmits(['changePage'])
  function changePage(pageNum:number){
    emit('changePage',pageNum)
  }
</script>

<style scoped lang="scss">

</style>
