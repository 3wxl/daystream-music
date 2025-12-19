<template>
  <div class="flex justify-between px-4 items-center">
    <div class="flex items-center h-full">
      <AdminInput
        v-model="dynamicSearch"
        class="mr-5" type="text" placeholder="请输入动态标题" width="w-[300px]" label="动态："
      ></AdminInput>
      <AdminSelect
        v-model="typeVal"
        class="mr-16"
        :options="[{value:'0',label:'全部'},{value:'1',label:'普通用户'},{value:'3',label:'音乐人'}]"
        label="类型"
      ></AdminSelect>
      <AdminButton
        text="搜索"
        class="ml-4 text-[15px]!"
        @click="handleSearch"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AdminInput from "@/components/Admin/AdminInput.vue";
  import AdminSelect from "@/components/Admin/AdminSelect.vue";
  let emit = defineEmits(['search'])

  let dynamicSearch = ref('')
  let typeVal = ref('0')

  function handleSearch(){
    emit('search',{
      key:dynamicSearch.value,
      role:Number(typeVal.value)
    })
  }
</script>

<style scoped>

</style>
