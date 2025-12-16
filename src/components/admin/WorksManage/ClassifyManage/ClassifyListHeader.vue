<template>
  <!-- 分类列表头部 -->
  <div class="w-full flex items-center overflow-hidden">
    <AdminInput
      v-model="classifyManageStore.keyword"
      type="text"
      placeholder="请输入类名"
      width="280px"
      label="搜索:"
      class="flex ml-2 items-center"
    />
    <AdminSelect
      label="类型"
      :options="[
        {value: '0', label: '歌曲'},
        {value: '1', label: '歌单'},
      ]"
      v-model="type2"
      class="ml-5"
    />
    <AdminButton
      text="搜索"
      class="ml-18 text-[15px]!"
      @click="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
  import {useClassifyManageStore} from '@/stores/admin/classify'
  const classifyManageStore = useClassifyManageStore()
  let type2 = ref('0')
  function handleSearch() {
    classifyManageStore.type = type2.value
    console.log(classifyManageStore.keyword)
    console.log(classifyManageStore.type)
  }
</script>

<style scoped>

</style>
