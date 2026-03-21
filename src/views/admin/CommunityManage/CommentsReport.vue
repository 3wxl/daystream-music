<template>
  <transition name="admin-container" appear>
    <div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
        <CommnetsReportHeader
          @search="search"
          @prePage="skipPage"
          @nextPage="skipPage"
          @clickPage="skipPage"
          :total="total"
        ></CommnetsReportHeader>
      </div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
        <CommnetsReportContainer
          :reportData="reportData"
          @prePage="skipPage"
          @nextPage="skipPage"
          @clickPage="skipPage"
          :total="total"
          @refreshW="refreshW"
          @refresh="refresh"
          :state="status"
          :reportType="reportType"
        ></CommnetsReportContainer>
        <div v-show="isLoading" class="w-full h-full absolute top-0 left-0 z-10 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center">
          <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import {GetCommentReportListApi} from '@/api/Admin/communtiy/commentReport'     // 获取举报列表
  import type {getReportListType,xGetReportListType,reportType} from '@/types/admin/community'
  import CommnetsReportHeader from '@/components/Admin/Community/CommunityCommentReport/CommnetsReportHeader.vue'
  import CommnetsReportContainer from '@/components/Admin/Community/CommunityCommentReport/CommnetsReportContainer.vue'
  let pageNum = 1                 // 页码
  const pageSize = 8              // 每页显示的条数
  let status = 0                  // 默认状态.0-待处理
  let total = ref(0)              // 总个数
  let currentTotal = ref(0)       // 当前页的数据个数
  let key = ''                    // 搜索关键字,默认或者当前，用于比较新搜索的是否为新的，判断是否要重置currentPage
  let isLoading = ref(true)       // 加载中
  let reportData:reportType[] = reactive([])
  let reportType = ref('1')       // 举报类型

  async function getReportList(){
    let getData:getReportListType = {pageNum,pageSize,key,status,reason:Number(reportType.value)}
    isLoading.value = true
    try{
      let reportListRes:xGetReportListType = (await GetCommentReportListApi(getData)) as xGetReportListType
      if(reportListRes.success){
        currentTotal.value = reportListRes.data.records.length
        reportData.splice(0,reportData.length)
        reportData.push(...reportListRes.data.records)
        total.value = reportListRes.data.total
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
  function search(data:any){
    key = data.key
    status = data.status
    reportType.value = data.reportType
    getReportList()
  }
  function skipPage(page:number){       // 跳转的函数
    pageNum = page
    getReportList()
  }
  function refreshW(){
    getReportList()
  }
  function refresh(){
    isLoading.value = true
    setTimeout(() => {
      getReportList()
      ElMessage({
        message: '以刷新为最新数据',
        type: 'success',
      })
    }, 500);
  }
  onMounted(()=>{
    getReportList()
  })
</script>

<style scoped>
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
  .el-button--primary{
    transition: all 0.2s;
  }
  .el-button--primary:hover{
    background-color: #74b2ff;
  }
  .el-button--primary:active{
    background-color: #417FCA;
    scale: 0.98;
  }
  ::v-deep .user-table .el-table__header-wrapper th{
    background-color: #F5F7F9;
  }
  /* ::v-deep .user-table .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
    background-color: #f8fdff;
  } */
  ::v-deep .admin-page .btn-prev{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-prev:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-prev .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .btn-next{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-next:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-next .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .el-pager .number{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .number:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .el-pager .more{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .more:hover{
    border-color: #0084ff;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px; /* 滚动条宽度 */
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3); /* 滚动滑块颜色 */
    border-radius: 3px; /* 滚动滑块圆角 */
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; /* 隐藏滚动轨道 */
  }

  /* Firefox 浏览器 */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  .admin-container-enter-from{
    opacity: 0;
    transform: translateX(-40px);
  }
  .admin-container-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .admin-container-leave-from{
    opacity: 1;
    transform: translateX(0);
  }
  .admin-container-leave-to{
    opacity: 0;
    transform: translateX(40px);
  }
  .admin-container-enter-active, .admin-container-leave-active {
    transition: all 0.5s ease;
  }
</style>
