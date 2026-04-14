<template>
  <div>
    <WorksReviewHeader
      @handleSearch="handleSearch"
    />
    <WorksReviewContainer
      :songsList="songsList"
      :total="total"
      @changePage="changePage"
      :worksType="worksType"
      :statusType="statusType"
    />
  </div>
</template>

<script setup lang="ts">
  import {getReviewSongsListApi} from '@/api/Admin/worksManage/index'

  let ReviewSearchKeyword = ref('')       // 搜索关键字
  let statusType = ref(0)                 // 状态类型
  let worksType = ref('1')                // 作品类型

  let songsList = reactive([]);           // 歌曲列表
  let pageNum = ref(1)
  let total = ref(0)                      // 总页数

  function handleSearch(searchKeyword:string,typeVal1:number,typeVal2:string){      // 搜索回调，更新搜索数据
    ReviewSearchKeyword.value = searchKeyword
    statusType.value = Number(typeVal1)
    worksType.value = typeVal2
    if(worksType.value == '1')getSongsList()
  }
  async function getSongsList(){        // 获取各种状态的歌曲列表
    let res:any = await getReviewSongsListApi(pageNum.value,8,ReviewSearchKeyword.value,statusType.value)
    if(res.success){
      songsList.splice(0,songsList.length,...res.data.records)
      total.value = res.data.total
    }else{
      ElMessage.error(res.errorMsg)
    }
  }
  function changePage(pageNumVal:number){     // 切换页码
    pageNum.value = pageNumVal
    getSongsList()
  }
  onMounted(()=>{
    getSongsList()
  })
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
</style>
