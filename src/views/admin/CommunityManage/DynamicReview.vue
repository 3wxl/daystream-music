<template>
  <div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <div class="flex justify-between px-4 items-center">
        <div class="flex items-center h-full">
          <AdminInput class="mr-5" type="text" placeholder="请输入动态标题" value="" width="w-[300px]" label="动态："></AdminInput>
          <AdminSelect v-model="typeVal1" class="mr-18" :options="[{value:'1',label:'待审核'},{value:'2',label:'已通过'},{value:'3',label:'已驳回'}]" label="状态"></AdminSelect>
          <AdminSelect v-model="typeVal2" class="mr-16" :options="[{value:'1',label:'全部'},{value:'2',label:'普通用户'},{value:'3',label:'音乐人'}]" label="类型" ></AdminSelect>
          <el-button type="primary">
            <IconFontSymbol name="sousuo" class="mr-1"></IconFontSymbol>
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <div class="flex justify-between">
        <span class="text-[18px] font-700 ml-2">动态审核</span>
        <div class="flex mr-8">
          <el-tooltip content="通过所选的动态">
            <IconFontSymbol name="quanbutongguo" class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-[0.3s] hover:text-[#529FFD] mr-4"></IconFontSymbol>
          </el-tooltip>
          <el-tooltip content="驳回所选动态">
            <IconFontSymbol name="quanbubohui" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
          </el-tooltip>
          <el-tooltip content="删除所选动态">
            <IconFontSymbol name="shanchu" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
          </el-tooltip>
          <el-tooltip content="刷新">
            <IconFontSymbol name="refresh" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
          </el-tooltip>
        </div>
      </div>
      <div class="user-table w-full mt-4">
        <el-table :data="dynamicList" stripe >
          <el-table-column type="selection" width="55" align="center" class="ml-3"/>
          <el-table-column label="标题" width="250" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1 cursor-pointer text-[15px] hover:text-[#529FFD] duration-300">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" width="220" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1 cursor-pointer hover:text-[#529FFD] duration-300">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="作者" width="140" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="140" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" width="200" align="center" class="relative">
            <template #default="scope">
              <span class="line-clamp-1">{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center gap-4">
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
  let dynamicList = reactive([
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
    {
      title: '动态标题1',
      content: '这是动态内容的简要描述。',
      author: '用户1',
      status: true,
      type: '普通用户',
      date: '2024-01-15 10:30:00',
    },
  ])
</script>

<style scoped>
  ::v-deep(.el-table__row){
    height:70px;
  }
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
