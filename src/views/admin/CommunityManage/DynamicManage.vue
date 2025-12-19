<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <DynamicManageHeader
        @search="search"
      />
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <DynamicManageContainer
        :dynamicList="dynamicList"
        @prePage="skipPage"
        @nextPage="skipPage"
        @clickPage="skipPage"
        :total="total"
        @refresh="refresh"
        @deleteDynamic="deleteDynamic"
        @deleteDynamicList="deleteDynamicList"
        @credit="credit"
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
  import DynamicManageHeader from "@/components/Admin/Community/DynamicManage/DynamicManageHeader.vue";
  import DynamicManageContainer from "@/components/Admin/Community/DynamicManage/DynamicManageContainer.vue";
  import { useRouter } from "vue-router";
  import {GetDynamicList} from '@/api/Admin/communtiy/dynamicManage'      //  获取动态列表
  import type {getDynamicListType,xGetDynamicListType,dynamicType} from '@/types/admin/dynamic'       // 获取动态列表参数

  let dynamicList:dynamicType[] = reactive([])    // 动态列表
  let pageNum = 1                 // 页码
  const pageSize = 8              // 每页显示的条数
  let total = ref(0)              // 总个数
  let currentTotal = ref(0)       // 当前页的数据个数
  let key = ''                    // 搜索关键字,默认或者当前，用于比较新搜索的是否为新的，判断是否要重置currentPage
  let role = 0
  let isLoading = ref(true)       // 加载中

  function search(searchObj:{key:string,role:number}){      // 搜索
    key = searchObj.key
    role = searchObj.role
    getDynamicList(key,role)
  }
  async function getDynamicList(key?:string,role?:number){
    let getData:getDynamicListType = {pageNum,pageSize}
    if(key){
      getData.key = key
    }
    if(role !== 0){
      getData.role = role
    }
    isLoading.value = true
    try{
      let dynamicListRes:xGetDynamicListType = (await GetDynamicList(getData)) as xGetDynamicListType
      if(dynamicListRes.success){
        currentTotal.value = dynamicListRes.data.records.length
        dynamicList.splice(0)
        dynamicList.push(...dynamicListRes.data.records)
        total.value = dynamicListRes.data.total
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
  function skipPage(page:number){      // 跳转的函数
    pageNum = page
    getDynamicList(key,role)
  }
  function refresh(){
    isLoading.value = true
    setTimeout(() => {
      getDynamicList(key,role)
      ElMessage({
        message: '以刷新为最新数据',
        type: 'success',
      })
    }, 500);
  }
  function credit(){
    getDynamicList(key,role)
  }
  function deleteDynamic(){     // 删除单个动态时的回调
    currentTotal.value --
    if(currentTotal.value<=0 && pageNum==1){
      skipPage(1)
      return
    }else if(currentTotal.value<=0){
      skipPage(pageNum-1)
      return
    }else{
      skipPage(pageNum)
    }
  }
  function deleteDynamicList(deleteLength:number){  // 删除动态列表时的回调
    currentTotal.value -= deleteLength
    if(currentTotal.value<=0 && pageNum==1){
      skipPage(1)
      return
    }else if(currentTotal.value<=0){
      skipPage(pageNum-1)
      return
    }else{
      skipPage(pageNum)
    }
  }
  onMounted(()=>{
    getDynamicList(key,role)
    document.querySelector('.el-pagination__goto').textContent='跳转'
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
  ::v-deep(.el-table__row){
    height:70px;
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
</style>
