<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">{{musicianManageStore.type==='0'?'音乐人审核':musicianManageStore.type==='1'?'已通过音乐人':'已驳回音乐人'}}</span>
    <div class="flex mr-8">
      <el-tooltip content="通过所选的音乐人申请" v-if="musicianManageStore.type==='0'||musicianManageStore.type==='2'">
        <IconFontSymbol name="quanbutongguo" class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-[0.3s] hover:text-[#529FFD] mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="驳回所选音乐人申请" v-if="musicianManageStore.type==='0'||musicianManageStore.type==='1'">
        <IconFontSymbol name="quanbubohui" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="删除所选音乐人记录">
        <IconFontSymbol name="shanchu" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol name="refresh" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <el-table v-if="musicianManageStore.type==='0'" :data="musicianManageStore.musicianList_0" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-[6px]">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="mr-3 active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showDetail = true"
          >
            <IconFontSymbol name="robot-3-line" size="18px"></IconFontSymbol>
            详情
          </span>
          <span
            class="mr-3 active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showDetail = true"
          >
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="18px"></IconFontSymbol>
            通过
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click=""
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            驳回
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-if="musicianManageStore.type==='1'" :data="musicianManageStore.musicianList_1" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-[6px]">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入驻时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.joinTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="mr-3 active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showMusicianDetail = true"
          >
            <IconFontSymbol name="robot-3-line" size="18px"></IconFontSymbol>
            详情
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click=""
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-if="musicianManageStore.type==='2'" :data="musicianManageStore.musicianList_2" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-[6px]">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驳回时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.rejectTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span class="text-[#529FFD] cursor-pointer" @click="showDetail = true">
            <IconFontSymbol name="robot-3-line" size="17px"></IconFontSymbol>
            详情
          </span>
          <span class="text-[#529FFD] cursor-pointer mx-2">
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="17px"></IconFontSymbol>
            通过
          </span>
          <span class="text-red-700 cursor-pointer">
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
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
  <MusicianApplyCard v-model="showDetail">
  </MusicianApplyCard>
  <MusicianDetailCard v-model="showMusicianDetail">
  </MusicianDetailCard>
</template>

<script setup lang="ts">
  import {useMusicianManageStore} from '@/stores/admin/musicianManage'
  let musicianManageStore = useMusicianManageStore()
  let showDetail = ref(false)
  let showMusicianDetail = ref(false)
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
