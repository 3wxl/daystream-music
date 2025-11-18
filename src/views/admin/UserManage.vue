<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <div class="flex justify-between px-4 items-center">
        <div class="flex items-center h-full">
          <AdminInput class="mr-5" type="text" placeholder="请输入用户名:" value="" width="w-[300px]" label="用户名:"></AdminInput>
          <AdminSelect class="mr-18"></AdminSelect>
          <el-button type="primary">
            <IconFontSymbol name="sousuo" class="mr-1"></IconFontSymbol>
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <div class="flex justify-between">
        <span class="text-[18px] font-700 ml-2">用户管理</span>
        <div class="flex mr-4">
          <el-button type="primary" class="mr-4">
            <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
            添加用户
          </el-button>
          <el-tooltip content="删除所选用户">
            <IconFontSymbol name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
          </el-tooltip>
          <el-tooltip content="刷新">
            <IconFontSymbol name="refresh" class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
          </el-tooltip>
        </div>
      </div>
      <div class="user-table w-full mt-4">
        <el-table :data="data" stripe >
          <el-table-column type="selection" width="55" align="center" class="ml-3"/>
          <el-table-column label="头像" width="130" align="center">
            <template #default="scope">
              <!-- <img :src="scope.row.avatar" alt="用户头像"> -->
              <div class="flex justify-center">
                <img src="../../../public/头像.png" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[40px] outline-1.5 outline-offset-1 outline-solid outline-[#619ca4]">
              </div>
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center">
            <template #default="scope">
              <span class="line-clamp-1 text-[16px] text-black">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="200" align="center">
            <template #default="scope">
              <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.emil }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"  align="center">
            <template #default="scope">
              <el-button type="primary" class="mr-3">
                <IconFontSymbol name="xiugai" size="18px" class="mr-1"></IconFontSymbol>
                修改
              </el-button>
              <el-button type="danger">
                <IconFontSymbol name="shanchu" class="mr-1"></IconFontSymbol>
                删除
              </el-button>
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

  let data = reactive([
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
