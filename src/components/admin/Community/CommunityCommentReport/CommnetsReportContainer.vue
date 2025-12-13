<!-- 用户管理内容区 -->
<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">评论举报</span>
    <div class="flex mr-4">
      <el-tooltip content="删除所选评论">
        <IconFontSymbol name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol name="refresh" class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <el-table :data="userData" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="举报人" width="150" align="center">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.reportFrom.author.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被举报评论" width="280" align="center">
        <template #default="scope">
          <div class="relative">
            <span class="line-clamp-1">{{ scope.row.reportComment }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="举报理由" width="280" align="center">
        <template #default="scope">
          <div class="relative">
            <span class="line-clamp-2">{{ scope.row.reportReason }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="举报时间" width="180" align="center">
        <template #default="scope">
            <span class="line-clamp-1">{{ scope.row.reportTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="reportDetail = scope.row;showReportDetail = true;"
          >
            <IconFontSymbol name="liebiao" size="18px"></IconFontSymbol>
            详情
          </span>
          <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#fff2bf] inline-block bg-[#fff5e0] text-[#ffaa00] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]">
            <IconFontSymbol name="shanchu" size="15px"></IconFontSymbol>
            删除评论
          </span>
          <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]">
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            驳回
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="100"
        :default-page-size="7"
      />
    </div>
  </div>
  <CommentReportDetail
    v-model="showReportDetail"
    :reportDetail="reportDetail"
  />
</template>

<script setup lang="ts">
  let props = defineProps<{userData:any}>()
  let emit = defineEmits([])
  let showReportDetail = ref(false)
  let reportDetail = reactive({
    id:1,            // 举报评论id
    commentId:1,     // 评论id
    reportTime:'2022-03-01 12:00:00',     // 举报时间
    reportReason:'垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论垃圾评论',     // 举报理由
    reportType: 2,       // 举报类型，1、色情低俗 2、违法信息 3、人身攻击 4、广告 5、侵权
    reportStatus:'1',       // 举报状态，1表示待处理
    reportComment:'垃圾评论',  // 被举报的评论内容
    reportFrom:{
      type:1,       // 来源：1动态 2歌曲 3歌单
      id:1,           // 动态id、歌单id、歌曲id
      title:'歌单标题/动态标题/歌曲标题',
      cover:'https://picsum.photos/200/300?random=1',
      author:{
        id:1,
        nickName:'用户昵称',
        avatar:'https://picsum.photos/200/300?random=1'
      }
    }
  })
</script>

<style scoped>
  ::v-deep(.el-table__row){
    height: 60px;
  }
</style>
