<template>
  <transition name="admin-container" appear>
    <div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
        <UserManageHeader
          @search="search"
        ></UserManageHeader>
      </div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
        <UserManageContainer
          :userData="userData"
        ></UserManageContainer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import {GetUserList} from '@/api/Admin/userManage'        // 获取用户列表数据的
  // 数据
  let userData = reactive([      // 用户数据
    {
      avatar:'awdaw',
      name: "张三",
      emil: "2450488888@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "爱吃糖葫芦的小猫",
      emil: "88451545@qq.com",
      status: false,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: false,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    },
    {
      avatar:'wad',
      name: "荆芥",
      emil: "48949684@qq.com",
      status: true,
      createTime: "2021-01-01 12:00:00"
    }
  ])

  // 方法

  function search(searchData:{userSearchKeyword:string,userType:string}){     // 接收暴漏的数据，并搜索
    console.log(searchData)
  }
</script>

<style scoped>
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
