<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <div class="flex justify-between px-4 items-center">
        <div class="flex items-center h-full">
          <AdminInput class="mr-5" type="text" placeholder="请输入用户名:" value="" width="w-[300px]" label="用户名:"></AdminInput>
          <AdminSelect v-model="typeVal" class="mr-18" :options="[{value:'1',label:'全部'},{value:'2',label:'启用'},{value:'3',label:'禁用'}]" label="状态"></AdminSelect>
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
          <el-button type="primary" class="mr-4" @click="addUser">
            <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
            添加用户
          </el-button>
          <AdminConfirm
            v-model="isAddUser"
            width="700px"
            iconName="yonghushuliang"
            iconColor="#76B0FD"
            title="添加用户"
            :isCustom="true"
          >
            <div class="px-2">
              <div class="flex mb-6 mt-2">
                <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
                <AdminInput class="ml-2 mr-5" type="text" placeholder="新用户昵称" value="" width="w-[230px]" label="昵称:"></AdminInput>
                <AdminInput class="ml-2" type="text" placeholder="密码" value="Aa12345!" width="w-[230px]" label="密码:"></AdminInput>
              </div>
              <div class="flex mb-6 items-center">
                <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
                <AdminInput class="ml-2 mr-5" type="text" placeholder="新用户邮箱" value="" width="w-[230px]" label="邮箱:"></AdminInput>
                <span class="mr-3 text-[16px] text-[#666] ml-2">状态:</span>
                <el-switch
                  v-model="addStatus"
                  class="ml-2"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                />
              </div>
              <div class="flex items-start mb-2 mt-4">
                <label for="jj" class="mr-1 ml-[22px] text-[#666]">简介：</label>
                <textarea name="" id="jj" placeholder="新用户简介" class="h-25 custom-scrollbar resize-none w-100 z-11 outline-none border-[#666] bg-[#E9F0FE] hover:bg-[#e4ecfd] focus:bg-[#dee9ff] rounded-[8px] px-[15px] py-[8px] text-[15px] text-[#666]"></textarea>
              </div>
              <div class="flex justify-end gap-3 mt-8 mb-3">
                <el-button type="primary" class="w-[85px]">
                  <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
                  添加
                </el-button>
                <el-button type="default" class="mr-5 w-[80px]" @click="isAddUser = false">取消</el-button>
              </div>
            </div>
          </AdminConfirm>
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
              <el-button type="primary" class="mr-3" @click="updateUser">
                <IconFontSymbol name="xiugai" size="18px" class="mr-1"></IconFontSymbol>
                修改
              </el-button>
              <el-button type="danger" @click="deleteUser">
                <IconFontSymbol name="shanchu" class="mr-1"></IconFontSymbol>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <AdminConfirm
          v-model="isShowDel"
          width="470px"
          iconName="gongzuotai-dongtaishenhe"
          iconColor="#F72A33"
          title="操作确认"
          :content="`是否删除该用户？操作执行后将无法撤销。`"
        ></AdminConfirm>
        <AdminConfirm
          v-model="isShowUpdate"
          width="700px"
          iconName="yonghushuliang"
          iconColor="#76B0FD"
          title="修改信息"
          :isCustom="true"
        >
          <div class="px-2">
            <div class="flex mb-6 mt-2">
              <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
              <AdminInput class="ml-2 mr-5" type="text" placeholder="用户昵称" value="" width="w-[230px]" label="昵称:"></AdminInput>
              <AdminInput class="ml-2" type="text" placeholder="密码" value="Aa12345!" width="w-[230px]" label="密码:"></AdminInput>
            </div>
            <div class="flex mb-6 items-center">
              <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
              <AdminInput class="ml-2 mr-5" type="text" placeholder="用户邮箱" value="" width="w-[230px]" label="邮箱:"></AdminInput>
              <span class="mr-3 text-[16px] text-[#666] ml-2">状态:</span>
              <el-switch
                v-model="addStatus"
                class="ml-2"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </div>
            <div class="flex items-start mb-2 mt-4">
              <label for="jj" class="mr-1 ml-[22px] text-[#666]">简介：</label>
              <textarea name="" id="jj" placeholder="用户简介" class="h-25 custom-scrollbar resize-none w-100 z-11 outline-none border-[#666] bg-[#E9F0FE] hover:bg-[#e4ecfd] focus:bg-[#dee9ff] rounded-[8px] px-[15px] py-[8px] text-[15px] text-[#666]"></textarea>
            </div>
            <div class="flex justify-end gap-3 mt-8 mb-3">
              <el-button type="primary" class="w-[85px]">
                <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
                添加
              </el-button>
              <el-button type="default" class="mr-5 w-[80px]" @click="isAddUser = false">取消</el-button>
            </div>
          </div>
        </AdminConfirm>
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
  import AdminConfirm from "@/components/admin/AdminConfirm.vue";

  let typeVal = ref('1')
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

  // 添加用户
  let isAddUser = ref(false)
  let addStatus = ref(true)
  function addUser(){
    isAddUser.value = true
  }
  // 删除用户
  let isShowDel = ref(false)
  function deleteUser(){
    isShowDel.value = true
  }
  // 修改用户
  let isShowUpdate = ref(false)
  function updateUser(){
    isShowUpdate.value = true
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

</style>
