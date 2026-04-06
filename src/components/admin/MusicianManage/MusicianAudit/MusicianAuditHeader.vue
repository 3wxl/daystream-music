<template>
  <div class="w-full flex items-center overflow-hidden">
    <AdminInput
      type="text"
      placeholder="请输入艺名"
      width="280px"
      label="搜索:"
      class="flex ml-2 items-center"
      v-model="keyword"
    />
    <AdminSelect
      label="类型"
      :options="[
        {value: 0, label: '待审核'},
        {value: 1, label: '已通过'},
        {value: 2, label: '已驳回'}
      ]"
      v-model="musicianType"
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
  import {debounce,throttle} from '@/utils/debounceThrottle'

  const emit = defineEmits(['searchHandle'])
  // 数据
  let musicianType:any = ref(0)
  let keyword = ref('')
  // 方法
  let handleSearch = throttle(() => {
    emit('searchHandle',[musicianType.value,keyword.value])
  },500)
</script>

<style scoped>

</style>
