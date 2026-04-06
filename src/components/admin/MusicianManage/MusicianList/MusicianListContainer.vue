<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">音乐人管理</span>
    <div class="flex mr-8">
      <el-tooltip content="删除所选音乐人">
        <IconFontSymbol @click="isShowDeleteMusician=true" name="shanchu" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol @click="emit('refresh')" name="refresh" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>

  <div class="user-table w-full mt-4">
    <el-table :data="musicianList" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-md object-cover">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="320" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="scope">
          <span
            class="cursor-pointer bg-[#c8f2d1] text-[#37D159] rounded-[16px] py-1.5 px-[18px] border-[1px] border-solid border-transparent text-[12px] inline-block font-[700] text-center"
            v-show="scope.row.status===0"
            @click="banMusician(scope.row.id)"
          >启用</span>
          <span
            class="cursor-pointer bg-[#ffd4cb] text-[#FF6746] rounded-[16px] py-1.5 px-[18px] border-[1px] border-solid border-transparent text-[12px] inline-block font-[700] text-center"
            v-show="scope.row.status===2"
            @click="banMusician(scope.row.id)"
          >禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="active:scale-[0.97] mr-3 duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showMusicianDetailFun(scope.row.id)"
          >
            <IconFontSymbol name="robot-3-line" size="18px"></IconFontSymbol>
            详情
          </span>
          <span
            class="active:scale-[0.97] ml-3 duration-150 hover:shadow-xl hover:shadow-[#ffc3bf] inline-block bg-[#ffe4e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showMusicianDetailFun(scope.row)"
          >
            <IconFontSymbol name="shanchu" size="18px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="total"
        :default-page-size="8"
        @current-change="(page) => emit('pageSkip',page)"
        @prev-click="(page) => emit('pageSkip',page)"
        @next-click="(page) => emit('pageSkip',page)"
      />
    </div>
  </div>
  <MusicianListDetailCard
    v-model="showMusicianDetail"
    :musicianData="musicianData"
  />
  <AdminConfirm
    v-model="isShowDeleteMusician"
    width="470px"
    iconName="gongzuotai-dongtaishenhe"
    iconColor="#F72A33"
    title="操作确认"
    :content="`是否删除选中的音乐人？操作后无法取消。`"
    @confirmClick="deleteSelectMusician"
  ></AdminConfirm>
</template>

<script setup lang="ts">
  import {GetMusicianDetailApi,BanMusicianApi} from '@/api/Admin/musicianAudit'
  const props = defineProps({
    musicianType:{
      type: Number,
      default: 0
    },
    musicianList:{
      type: Array,
      default: []
    },
    total:{
      type: Number,
      default: 0
    },
  })
  const emit = defineEmits(['pageSkip', 'refresh'])
  // 数据

  let showMusicianDetail = ref(false)
  let musicianData:any = ref({})
  let nowSelectIds:any = ref([])            // 当前选中的音乐人id列表
  let isShowDeleteMusician = ref(false)     // 是否显示删除所选音乐人弹框


  async function showMusicianDetailFun(id:any){      // 点击查看详情
    let res = await GetMusicianDetailApi(id)
    if(res.success){
      musicianData.value = res.data
      showMusicianDetail.value = true
    }
  }
  function handleSelectionChange(val:any){   // 选择框变化回调
    nowSelectIds.value = val.map((item:any)=>item.id)
  }
  async function deleteSelectMusician(){

  }
  async function banMusician(id:string){
    let res = await BanMusicianApi(id)
    if(res.success){
      console.log(res)
      emit('refresh')
      ElMessage.success('操作成功')
    }
  }
</script>

<style scoped>
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
