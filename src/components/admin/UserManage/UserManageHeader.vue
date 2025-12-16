<!-- 用户管理头部 -->
<template>
  <div class="flex justify-between px-4 items-center">
    <div class="flex items-center h-full">
      <AdminInput
        v-model="userSearchKeyword"
        class="mr-5"
        type="text"
        placeholder="请输入用户名:"
        width="w-[300px]"
        label="用户名:"
      />
      <AdminSelect
        v-model="userType"
        class="mr-18"
        :options="[{value:'1',label:'全部'},{value:'2',label:'启用'},{value:'3',label:'禁用'}]"
        label="状态"
      />
      <AdminButton
        text="搜索"
        class="ml-2 text-[15px]!"
        @click="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  let userSearchKeyword = ref('')
  let userType = ref('1')
  let emit = defineEmits(['search'])      // search暴露数据
  function handleSearch() {
    emit('search',{
      userSearchKeyword:userSearchKeyword.value,
      userType:userType.value
    })
  }
</script>

<style scoped>

</style>
