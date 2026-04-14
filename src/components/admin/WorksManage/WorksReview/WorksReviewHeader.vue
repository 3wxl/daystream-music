<template>
  <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <div class="flex justify-between px-4 items-center">
      <div class="flex items-center h-full">
        <AdminInput v-model="songsReviewSearch" class="mr-5" type="text" placeholder="请输入作品名" width="w-[300px]" label="歌名:"></AdminInput>
        <AdminSelect v-model="typeVal1" class="mr-18" :options="[{value:'0',label:'待审核'},{value:'1',label:'已通过'},{value:'2',label:'已驳回'}]" label="状态"></AdminSelect>
        <AdminSelect v-model="typeVal2" class="mr-16" :options="[{value:'1',label:'歌曲'},{value:'2',label:'MV'},{value:'3',label:'专辑'}]" label="类型" ></AdminSelect>
        <AdminButton
          text="搜索"
          class="ml-4 text-[15px]!"
          @click="emit('handleSearch',songsReviewSearch,typeVal1,typeVal2)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['handleSearch'])
  let songsReviewSearch = ref('')   // 搜索
  let typeVal1 = ref("0")           // 审核作品状态
  let typeVal2 = ref('1')           // 审核作品类型
</script>

<style scoped lang="scss">

</style>
