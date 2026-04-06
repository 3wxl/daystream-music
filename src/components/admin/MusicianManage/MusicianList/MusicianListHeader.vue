<template>
  <div class="w-full flex items-center overflow-hidden">
    <AdminInput
      type="text"
      placeholder="请输入艺名/简介/邮箱"
      width="280px"
      label="搜索:"
      class="flex ml-2 items-center"
      v-model="keyword"
    />
    <AdminSelect
      label="类型"
      :options="[
        {value: 0, label: '正常'},
        {value: 1, label: '封禁'}
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
