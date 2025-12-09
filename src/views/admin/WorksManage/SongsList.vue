<template>
  <el-container class="songs-container">
    <el-aside width="260px" class="shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[10px] overflow-hidden">
      <el-scrollbar height="87vh" class="relative">
        <AdminInput type="text" placeholder="请输入歌手名" v-model="musicianSearch" width="w-[220px]" lable="" rightIcon="sousuo"  class="flex ml-2 absolute top-0"></AdminInput>
        <ul class="mt-[50px] flex flex-col items-center">
          <li @click="activeId = musicianObj.id"
            :class="activeId===musicianObj.id?'bg-[#529FFD] text-[white]':'hover:bg-[#d1e5fa]'"
            class="min-w-[215px] px-[10px] py-[6px] my-0.5 rounded-[6px] cursor-pointer z-7 duration-300" v-for="musicianObj in musicianList"
            :key="musicianObj.id">
            <IconFontSymbol name="yinleren" size="16px" class="ml-2 mr-3" :color="activeId===musicianObj.id?'white':'#666'"></IconFontSymbol>
            <span>{{musicianObj.name}}</span>
          </li>
          <li class="bt-3 text-[13px] text-[#888]">暂无更多歌手</li>
        </ul>
      </el-scrollbar>
    </el-aside>
    <el-main style="padding:0 10px 0px 8px">
      <div class="shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[15px] flex items-center">
        <AdminInput v-model="songsSearch" class="ml-4 mr-4" type="text" placeholder="请输入歌曲名" width="w-[220px]" label="歌名:"></AdminInput>
        <AdminSelect v-model="typeVal1" class="mr-15" :options="[{value:'1',label:'全部'},{value:'2',label:'指定歌手'}]" label="歌手" ></AdminSelect>
        <AdminSelect v-model="typeVal2" class="mr-15" :options="[{value:'1',label:'歌曲'},{value:'2',label:'MV'},{value:'3',label:'专辑'}]" label="类型" ></AdminSelect>
        <AdminButton
          text="搜索"
          class="ml-4 text-[15px]!"
          @click="handleSearch"
        />
      </div>
      <div class="mt-2 shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
        <div class="flex justify-between">
          <span class="text-[18px] font-700 ml-2">歌曲管理</span>
          <div class="flex mr-4">
            <el-button type="primary" class="mr-4">
              <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
              添加歌曲
            </el-button>
            <el-tooltip content="删除所选歌曲">
              <IconFontSymbol name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
            </el-tooltip>
            <el-tooltip content="刷新">
              <IconFontSymbol name="refresh" class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
            </el-tooltip>
          </div>
        </div>
        <div class="user-table w-full mt-5">
          <el-table :data="songsList" stripe >
            <el-table-column type="selection" width="55" align="center" class="ml-3"/>
            <el-table-column label="封面" width="100" align="center">
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
            <el-table-column label="分类" width="150" align="center">
              <template #default="scope">
                <span v-for="type,index in scope.row.type" :key="index" class="text-[14px] px-[8px] py-[3px] rounded-[8px] bg-[#EDF3F9] mx-1 text-[#529FFD]">{{ type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发行日期" width="180" align="center">
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
                    <IconFontSymbol name="xiugai" size="17px"></IconFontSymbol>
                    修改
                  </span>
                  <span class="text-red-700 cursor-pointer">
                    <IconFontSymbol name="shanchu"></IconFontSymbol>
                    删除
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
    </el-main>
  </el-container>

</template>

<script setup lang="ts">
  let typeVal1 = ref('1')
  let typeVal2 = ref('1')
  let songsSearch = ref('')      // 搜索歌曲
  let musicianList = reactive([
    {
      name: '张杰',
      id: '1'
    },
    {
      name: '王备',
      id: '2'
    },
    {
      name: '周深',
      id: '3'
    },
    {
      name: '张艺兴',
      id: '4'
    },
    {
      name: '张震岳',
      id: '5'
    },
    {
      name: '王力宏',
      id: '6'
    },
    {
      name: '徐嘉良',
      id: '7'
    },
    {
      name: '寻道树',
      id: '8'
    },
    {
      name: '五月天',
      id: '9'
    },
    {
      name: '张学友',
      id: '10'
    },
    {
      name: '林俊杰',
      id: '11'
    },
    {
      name: '林志玲',
      id: '12'
    },
    {
      name: '曾沛慈',
      id: '13'
    },
    {
      name: '张杰',
      id: '14'
    },
    {
      name: '王备',
      id: '15'
    },
    {
      name: '周深',
      id: '16'
    },
    {
      name: '张艺兴',
      id: '17'
    },
    {
      name: '张震岳',
      id: '18'
    },
    {
      name: '王力宏',
      id: '19'
    },
    {
      name: '徐嘉良',
      id: '20'
    },
    {
      name: '寻道树',
      id: '21'
    },
    {
      name: '五月天',
      id: '22'
    },
    {
      name: '张学友',
      id: '23'
    },
    {
      name: '林俊杰',
      id: '24'
    },
    {
      name: '林志玲',
      id: '25'
    },
    {
      name: '曾沛慈',
      id: '26'
    },
  ])
  let activeId = ref('0')
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
  let musicianSearch = ref('')

  function handleSearch(){
    console.log(musicianSearch.value)
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
  ::v-deep .user-table .el-table__header-wrapper th{
    background-color: #F5F7F9;
  }
</style>
