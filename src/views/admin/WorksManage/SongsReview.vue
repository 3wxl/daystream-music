<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <div class="flex justify-between px-4 items-center">
        <div class="flex items-center h-full">
          <AdminInput class="mr-5" type="text" placeholder="请输入歌曲名:" value="" width="w-[300px]" label="歌名:"></AdminInput>
          <AdminSelect v-model="typeVal1" class="mr-18" :options="[{value:'1',label:'待审核'},{value:'2',label:'已通过'},{value:'3',label:'已驳回'}]" label="状态"></AdminSelect>
          <AdminSelect v-model="typeVal2" class="mr-16" :options="[{value:'1',label:'歌曲'},{value:'2',label:'MV'}]" label="类型" ></AdminSelect>
          <el-button type="primary">
            <IconFontSymbol name="sousuo" class="mr-1"></IconFontSymbol>
            搜索
          </el-button>
        </div>
      </div>
    </div>
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
        <el-table :data="songsList" stripe >
          <el-table-column type="selection" width="55" align="center" class="ml-3"/>
          <el-table-column label="封面" width="130" align="center">
            <template #default="scope">
              <!-- <img :src="scope.row.avatar" alt="用户头像"> -->
              <div class="group flex justify-center relative cursor-pointer">
                <img src="../../../../public/头像.png" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[6px]">
                <div class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100">
                  <IconFontSymbol name="bofang" class="text-[white] relative top-[10px]" size="20px"></IconFontSymbol>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌名" width="180" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.name }}</span>
              <span class="absolute left-[77px] text-[10px]/[16px] font-[600] rounded-[4px] px-[4px] py-[0px] bg-[#3278EA] text-[white]">原创</span>
            </template>
          </el-table-column>
          <el-table-column label="歌手" width="180" align="center">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="vip" width="60" align="center">
            <template #default="scope">
              <span class="px-[3px] border-[1.5px] rounded-[6px] border-[#3278EA] text-[13px] text-[#3278EA]">vip</span>
              <!-- <span class="px-[3px] border-[1.5px] rounded-[6px] border-[#3278EA] text-[12px] text-[#3278EA]">免费</span> -->
            </template>
          </el-table-column>
          <el-table-column label="曲风" width="180" align="center">
            <template #default="scope">
              <span v-for="type,index in scope.row.type" :key="index" class="text-[14px] px-[8px] py-[3px] rounded-[8px] bg-[#EDF3F9] mx-1 text-[#529FFD]">{{ type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请日期" width="180" align="center">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center gap-4">
                <!-- <span class="py-[3px] px-[6px] rounded-full bg-[#3278EA] cursor-pointer" >
                  <el-tooltip content="播放/暂停">
                    <IconFontSymbol name="bofang" size="18px" color="white"></IconFontSymbol>
                  </el-tooltip>
                </span> -->
                <span class="text-[#529FFD] cursor-pointer">
                  <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="17px"></IconFontSymbol>
                  通过
                </span>
                <span class="text-red-700 cursor-pointer">
                  <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
                  驳回
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
          <el-pagination
            background
            layout="prev, pager, next ,jumper"
            :total="100"
            :default-page-size="8"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AdminInput from "@/components/admin/AdminInput.vue";
  import AdminSelect from "@/components/admin/AdminSelect.vue";
  import IconFontSymbol from "@/components/IconFontSymbol.vue";

  let typeVal1 = ref('1')
  let typeVal2 = ref('1')
  let songsList = reactive([
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      cover:'awd',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
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
</style>
