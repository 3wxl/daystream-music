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
        v-model="reportType"
        class="mr-18"
        :options="[{value:'1',label:'色情低俗'},{value:'2',label:'违法信息'},{value:'3',label:'人身攻击'},{value:'4',label:'广告'},{value:'5',label:'侵权'}]"
        label="分类"
      />
      <AdminSelect
        v-model="userType"
        class="mr-18"
        :options="[{value:'0',label:'待处理'},{value:'1',label:'举报通过'},{value:'2',label:'举报驳回'}]"
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
  let userType = ref('0')
  let reportType = ref('1')
  let emit = defineEmits(['search'])      // search暴露数据
  function handleSearch() {
    emit('search',{
      key:userSearchKeyword.value,
      status:Number(userType.value),
      reportType:reportType.value
    })
  }
</script>

<style scoped>

</style>
