<template>
  <div class="flex justify-between px-4 items-center">
    <div class="flex items-center h-full">
      <AdminInput
        v-model="userSearchKeyword"
        class="mr-5"
        type="text"
        placeholder="请输入被举报评论"
        width="w-[300px]"
        label="评论内容:"
      />
      <AdminSelect
        v-model="userType"
        class="mr-18"
        :options="[{value:'1',label:'待处理'},{value:'2',label:'已处理'}]"
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
