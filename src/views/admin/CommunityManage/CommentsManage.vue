<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <div class="flex justify-between px-4 items-center">
        <div class="flex items-center h-full">
          <AdminInput
            class="mr-5"
            type="text"
            placeholder="请输入用户名"
            value=""
            width="w-[300px]"
            label="用户名:"
          ></AdminInput>
          <AdminSelect
            class="mr-16"
            v-model="typeVal"
            :options="[
              { value: '1', label: '歌曲' },
              { value: '2', label: '歌单' },
              { value: '3', label: '动态' },
            ]"
            label="类型"
          ></AdminSelect>
          <el-button type="primary">
            <IconFontSymbol name="sousuo" class="mr-1"></IconFontSymbol>
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <div class="flex justify-between">
        <span class="text-[18px] font-700 ml-2">评论管理</span>
        <div class="flex mr-8">
          <el-tooltip content="删除所选评论">
            <IconFontSymbol
              name="shanchu"
              class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"
            ></IconFontSymbol>
          </el-tooltip>
          <el-tooltip content="刷新">
            <IconFontSymbol
              name="refresh"
              class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"
            ></IconFontSymbol>
          </el-tooltip>
        </div>
      </div>
      <div class="user-table w-full mt-4">
        <el-table
          :data="
            typeVal === '1'
              ? commentsListSongs
              : typeVal === '2'
                ? commentsListGD
                : commentsListDynamic
          "
          stripe
        >
          <el-table-column type="selection" width="55" align="center" class="ml-3" />
          <el-table-column label="头像" width="130" align="center">
            <template #default="scope">
              <!-- <img :src="scope.row.avatar" alt="用户头像"> -->
              <div class="flex justify-center">
                <img
                  src="../../../assets/头像.png"
                  alt="头像"
                  class="m-1 w-[45px] h-[45px] rounded-[40px] outline-1.5 outline-offset-1 outline-solid outline-[#619ca4]"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="昵称" width="170" align="center">
            <template #default="scope">
              <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="评论" width="250" align="center">
            <template #default="scope">
              <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="typeVal === '1' ? '评论歌曲' : typeVal === '2' ? '评论歌单' : '评论动态'"
            width="320"
            align="center"
          >
            <template #default="scope">
              <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="200" align="center">
            <template #default="scope">
              <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="primary">编辑</el-button>
              <el-button type="danger">删除</el-button>
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
import AdminInput from '@/components/admin/AdminInput.vue'
import AdminSelect from '@/components/admin/AdminSelect.vue'
import IconFontSymbol from '@/components/IconFontSymbol.vue'

let typeVal = ref('1')
let commentsListSongs = reactive([
  {
    avatar: 'daw',
    author: '一只无忧无虑的小马驹',
    content: '歌词写的真好！！',
    title: '光辉岁月',
    date: '2024-05-01 12:30:45',
  },
])
let commentsListGD = reactive([
  {
    avatar: 'daw',
    author: '一只无忧无虑的小马驹',
    content: '这个歌单真棒！！',
    title: '前夜歌单',
    date: '2024-05-01 12:30:45',
  },
])
let commentsListDynamic = reactive([
  {
    avatar: 'daw',
    author: '一只无忧无虑的小马驹',
    content: '期待新歌',
    title: '家人们，我要出新歌啦！',
    date: '2024-05-01 12:30:45',
  },
])
</script>

<style scoped>
.el-button--primary {
  transition: all 0.2s;
}
.el-button--primary:hover {
  background-color: #74b2ff;
}
.el-button--primary:active {
  background-color: #417fca;
  scale: 0.98;
}
::v-deep .user-table .el-table__header-wrapper th {
  background-color: #f5f7f9;
}
/* ::v-deep .user-table .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
    background-color: #f8fdff;
  } */
::v-deep .admin-page .btn-prev {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-prev:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-prev .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .btn-next {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-next:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-next .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .el-pager .number {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .number:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .el-pager .more {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .more:hover {
  border-color: #0084ff;
}
</style>
