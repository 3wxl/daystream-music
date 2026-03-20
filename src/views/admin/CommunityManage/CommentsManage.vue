<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <CommentManageHeader
        @search="search"
      />
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <CommentManageContainer
        :commentDataList="commentDataList"
        :type="type"
        :isLoading="isLoading"
        :total="total"
        @prePage="skipPage"
        @nextPage="skipPage"
        @clickPage="skipPage"
        @deleteComment="deleteComment"
        @deleteComments="deleteComments"
        @refresh="refresh"
      />
      <div v-show="isLoading" class="w-full h-full absolute top-0 left-0 z-10 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentManageHeader from '@/components/Admin/Community/CommunityCommentManage/CommentManageHeader.vue'
import CommentManageContainer from '@/components/Admin/Community/CommunityCommentManage/CommentManageContainer.vue'
import {GetCommentList} from '@/api/Admin/communtiy/commentManage'      // 获取评论列表
import type {getCommentListType,xGetCommentListType,commentType} from '@/types/admin/community'         // 获取评论列表参数

let commentDataList:commentType[] = reactive([])          // 评论数据
let type = ref(1)             // 类型：1-歌曲 2-歌单 3-专辑 4-动态
let keyword = ref('')           // 关键词
let pageNum = 1                 // 页码
const pageSize = 8              // 每页显示的条数
let total = ref(0)              // 总个数
let currentTotal = ref(0)       // 当前页的数据个数
let isLoading = ref(false)      // 列表加载状态

function search(obj:{key:string,type:number}){        // 搜索
  keyword.value = obj.key
  type.value = obj.type
  getCommentList(obj.key,Number(obj.type))
}
async function getCommentList(keyword?:string,type?:number){      // 获取评论列表
  let getData:getCommentListType = {pageNum,pageSize}
  if(keyword){
    getData.keyword = keyword
  }
  if(getData){
    getData.type = type
  }
  isLoading.value = true
  try{
    let commentListRes:xGetCommentListType = (await GetCommentList(getData)) as xGetCommentListType
    if(commentListRes.success){
      currentTotal.value = commentListRes.data.records.length
      commentDataList.splice(0,commentDataList.length)
      commentDataList.push(...commentListRes.data.records)
      total.value = commentListRes.data.total
    }
    isLoading.value = false
  }
  catch(err){
    isLoading.value = false
    ElMessage({
      message: '查找失败',
      type: 'error',
    })
  }
}
function skipPage(page:number){       // 跳转的函数
  pageNum = page
  getCommentList(keyword.value,type.value)
}
function deleteComment(){           // 删除一条评论成功后的回调
  currentTotal.value --
  if(currentTotal.value <= 0 && pageNum==1){
    pageNum = 1
    getCommentList(keyword.value,type.value)
  }else if(currentTotal.value <= 0 && pageNum>1){
    pageNum --
    getCommentList(keyword.value,type.value)
  }else{
    getCommentList(keyword.value,type.value)
  }
}
function deleteComments(length:number){   // 删除所选评论成功后的回调
  total.value -= length
  if(currentTotal.value <= 0 && pageNum==1){
    pageNum = 1
    getCommentList(keyword.value,type.value)
  }else if(currentTotal.value <= 0 && pageNum>1){
    pageNum --
    getCommentList(keyword.value,type.value)
  }else{
    getCommentList(keyword.value,type.value)
  }
}
function refresh(){     // 刷新
  isLoading.value = true
  setTimeout(() => {
    getCommentList(keyword.value,type.value)
    ElMessage({
      message: '以刷新为最新数据',
      type: 'success',
    })
  }, 500);
}
onMounted(()=>{
  getCommentList('',type.value)
})
</script>

<style scoped>
.el-button--primary {
  transition: all 0.2s;
}
.el-button--primary:hover {
  background-color: #74b2ff;
}
.el-button--primary:active {
  background-color: #417fca;
  scale: 0.98;
}
::v-deep .user-table .el-table__header-wrapper th {
  background-color: #f5f7f9;
}
/* ::v-deep .user-table .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
    background-color: #f8fdff;
  } */
::v-deep .admin-page .btn-prev {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-prev:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-prev .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .btn-next {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-next:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-next .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .el-pager .number {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .number:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .el-pager .more {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .more:hover {
  border-color: #0084ff;
}
svg {
  width:5em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
  }

  circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
  }

  @keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
  }
</style>
