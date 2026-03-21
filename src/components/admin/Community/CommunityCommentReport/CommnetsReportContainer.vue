<!-- 用户管理内容区 -->
<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">评论举报</span>
    <div class="flex mr-4">
      <el-tooltip content="删除所选评论">
        <IconFontSymbol name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol
          name="refresh"
          class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"
          @click="refresh"
        ></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <div class="w-full h-[666px] flex items-center justify-center bg-white rounded-[12px]" v-show="reportData.length===0">
      <el-empty description="暂无数据" :image-size="200"/>
    </div>
    <el-table :data="reportData" stripe v-show="reportData.length!==0">
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="举报人" width="150" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-black">{{ scope.row.reporterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被举报评论" width="280" align="center">
        <template #default="scope">
          <div class="relative">
            <span class="line-clamp-1 text-black">{{ scope.row.targetContent }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="举报理由" width="280" align="center">
        <template #default="scope">
          <div class="relative">
            <span class="line-clamp-2 text-black">{{ scope.row.reason }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="举报时间" width="180" align="center">
        <template #default="scope">
            <span class="line-clamp-1 text-black">{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="showReportDetail = true;nowId = scope.row.id;nowType=scope.row.reportType"
            v-show="state===0"
          >
            <IconFontSymbol name="liebiao" size="18px"></IconFontSymbol>
            详情
          </span>
          <span v-show="state===0" class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#fff2bf] inline-block bg-[#fff5e0] text-[#ffaa00] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]">
            <IconFontSymbol name="shanchu" size="15px"></IconFontSymbol>
            删除评论
          </span>
          <span v-show="state===0" class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]">
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            驳回
          </span>
          <span v-show="state!==0" class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]">
            <IconFontSymbol name="shanchu" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12" v-show="reportData.length!==0">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="total"
        :default-page-size="8"
        @current-change="pageSkip"
        @prev-click="preSkip"
        @next-click="nextSkip"
      />
    </div>
  </div>
  <CommentReportDetail
    v-model="showReportDetail"
    :reportDetail="reportDetail"
    :id="nowId"
    :reportType="reportType"
  />
</template>

<script setup lang="ts">
  import CommentReportDetail from '@/components/Admin/Community/CommunityCommentReport/CommentReportDetail.vue'
  let props = defineProps<{reportData:any,total:number,state:number,reportType:string}>()
  let emit = defineEmits(['prePage', 'nextPage','clickPage','refresh','refreshW'])
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
  let nowId = ref('')       // 当前点击的id
  function preSkip(page:number){
    emit('prePage', page)
  }
  function nextSkip(page:number){
    emit('nextPage', page)
  }
  function pageSkip(page:number){
    emit('clickPage', page)
  }
  function refresh(){
    emit('refresh')
  }
  onMounted(()=>{
    document.querySelector('.el-pagination__goto').textContent = '跳转'
  })
</script>

<style scoped>
  ::v-deep(.el-table__row){
    height: 60px;
  }
</style>
