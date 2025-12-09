<template>
  <div class="w-full flex items-center overflow-hidden">
    <AdminInput
      v-model="musicianManageStore.keyword"
      type="text"
      placeholder="请输入艺名"
      width="280px"
      label="搜索:"
      class="flex ml-2 items-center"
    />
    <AdminSelect
      label="类型"
      :options="[
        {value: '0', label: '待审核'},
        {value: '1', label: '已通过'},
        {value: '2', label: '已驳回'}
      ]"
      v-model="musicianType2"
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
  import {useMusicianManageStore} from '@/stores/admin/musicianManage'
  // 数据
  let musicianManageStore = useMusicianManageStore()
  let musicianType2 = ref('1')
  // 方法
  let handleSearch = throttle(() => {
    // 搜搜相关的交互
    musicianManageStore.type = musicianType2.value
  },500)
</script>

<style scoped>

</style>
