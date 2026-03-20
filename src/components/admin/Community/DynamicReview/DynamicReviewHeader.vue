<template>
  <div class="flex justify-between px-4 items-center">
    <div class="flex items-center h-full">
      <AdminInput v-model="dynamicSearch" class="mr-5" type="text" placeholder="请输入动态标题" width="w-[300px]" label="动态："></AdminInput>
      <AdminSelect v-model="status" class="mr-18" :options="[{value:'0',label:'待审核'},{value:'1',label:'已通过'},{value:'2',label:'已驳回'}]" label="状态"></AdminSelect>
      <AdminSelect v-model="role" class="mr-16" :options="[{value:'0',label:'全部'},{value:'1',label:'普通用户'},{value:'3',label:'音乐人'}]" label="类型" ></AdminSelect>
      <AdminButton
        text="搜索"
        class="ml-4 text-[15px]!"
        @click="handleSearch"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  let emit = defineEmits(['search'])

  let dynamicSearch = ref('')
  let role = ref('0')
  let status = ref('0')
  function handleSearch(){
    emit('search',{
      key:dynamicSearch.value,
      role:role.value,
      status:status.value
    })
  }
</script>

<style scoped>

</style>
