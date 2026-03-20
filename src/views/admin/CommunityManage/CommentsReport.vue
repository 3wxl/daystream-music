<template>
  <transition name="admin-container" appear>
    <div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
        <CommnetsReportHeader></CommnetsReportHeader>
      </div>
      <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
        <CommnetsReportContainer
          :userData="userData"
        ></CommnetsReportContainer>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import CommnetsReportHeader from '@/components/Admin/Community/CommunityCommentReport/CommnetsReportHeader.vue'
  import CommnetsReportContainer from '@/components/Admin/Community/CommunityCommentReport/CommnetsReportContainer.vue'
  let userData = reactive([
    {
      id:1,            // 举报评论id
      commentId:1,     // 评论id
      reportTime:'2022-03-01 12:00:00',     // 举报时间
      reportReason:'垃圾评论',     // 举报理由
      reportType:'1',
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
    }
  ])
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
