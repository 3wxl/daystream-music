<template>
  <el-container class="songs-container">
    <el-aside width="260px" class="shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[10px]">
      <el-scrollbar height="87vh" class="relative" always>
        <AdminInput type="text" placeholder="请输入歌手名" value="" width="w-[220px]" lable="" rightIcon="sousuo"  class="flex ml-2 absolute top-0"></AdminInput>
        <ul class="mt-[50px] flex flex-col items-center">
          <li @click="activeId = musicianObj.id"
            :class="activeId===musicianObj.id?'bg-[#529FFD] text-[white]':'hover:bg-[#d1e5fa]'"
            class="min-w-[215px] px-[10px] py-[6px] my-0.5 rounded-[6px] cursor-pointer z-10" v-for="musicianObj in musicianList"
            :key="musicianObj.id">
            <IconFontSymbol name="yinleren" size="16px" class="ml-2 mr-3" :color="activeId===musicianObj.id?'white':'#666'"></IconFontSymbol>
            <span>{{musicianObj.name}}</span>
          </li>
        </ul>
      </el-scrollbar>
    </el-aside>
    <el-main style="padding:0 10px 15px 8px">
      <div class="shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[15px] flex items-center">
        <AdminInput class="ml-4" type="text" placeholder="请输入歌曲名" value="" width="w-[220px]" label="歌名:"></AdminInput>
        <el-button type="primary" class="ml-4">
          <IconFontSymbol name="sousuo" class="mr-1"></IconFontSymbol>
          搜索
        </el-button>
      </div>
      <div class="mt-2 shadow-md border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">

      </div>
    </el-main>
  </el-container>

</template>

<script setup lang="ts">
  import AdminInput from "@/components/admin/AdminInput.vue";
  import IconFontSymbol from '@/components/IconFontSymbol.vue';
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
</style>
