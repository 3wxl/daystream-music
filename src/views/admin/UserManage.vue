<template>
  <transition name="admin-container" appear>
    <div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
        <UserManageHeader
          @search="search"
        ></UserManageHeader>
      </div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3 relative">
        <UserManageContainer
          :userData="userData"
          @prePage="skipPage"
          @nextPage="skipPage"
          @clickPage="skipPage"
          @addUser="refresh"
          @refresh="refresh"
          @deleteUser="deleteUser"
          :total="total"
        ></UserManageContainer>
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
  import {GetUserList} from '@/api/Admin/userManage'        // 获取用户列表数据的
  import type {getListSubmitData,xGetListSubmitData} from '@/types/admin/userManage'       // 获取用户列表参数
  // 数据
  let userData = reactive([])     // 用户数据
  let pageNum = 1                 // 页码
  const pageSize = 8              // 每页显示的条数
  let status = 0                  // 默认状态
  let total = ref(0)              // 总个数
  let currentTotal = ref(0)       // 当前页的数据个数
  let key = ''                    // 搜索关键字,默认或者当前，用于比较新搜索的是否为新的，判断是否要重置currentPage
  let isLoading = ref(true)       // 加载中

  // 方法
  async function getUserList(key?:string,status?:number){
    let getData:getListSubmitData = {pageNum,pageSize}
    if(key){
      getData.key = key
    }
    if(status && status !== 1){
      if(status === 2){
        getData.status = 1
      }else if(status === 3){
        getData.status = 0
      }
    }
    isLoading.value = true
    try{
      let userListRes = await GetUserList(getData)
      if(userListRes.success){
        currentTotal.value = userListRes.data.records.length
        userData.splice(0,userData.length)
        userData.push(...userListRes.data.records)
        total.value = userListRes.data.total
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
    getUserList(key,status)
  }
  function search(searchData:{userSearchKeyword:string,userType:string}){     // 接收暴漏的数据，并搜索
    getUserList(searchData.userSearchKeyword,Number(searchData.userType))
  }
  function refresh(){       // 刷新用的
    skipPage(pageNum)
  }
  function deleteUser(){        // 删除一个用户后的回调
    currentTotal.value -= 1
    if(currentTotal.value < 0){
      skipPage(1)
      return
    }
    if(currentTotal.value === 0){
      skipPage(pageNum-1)
      return
    }
    skipPage(pageNum)
  }
  onMounted(()=>{
    getUserList()
    document.querySelector('.el-pagination__goto').textContent = '跳转到'
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
