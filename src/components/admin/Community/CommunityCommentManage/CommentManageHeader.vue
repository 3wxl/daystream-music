<template>
  <div class="flex justify-between px-4 items-center">
    <div class="flex items-center h-full">
      <AdminInput
        class="mr-5"
        type="text"
        placeholder="请输入评论关键字"
        v-model="commentSearch"
        width="w-[300px]"
        label="评论关键字:"
      ></AdminInput>
      <AdminSelect
        class="mr-16"
        v-model="typeVal"
        :options="[
          { value: '1', label: '歌曲' },
          { value: '2', label: '歌单' },
          { value: '3', label: '专辑' },
          { value: '4', label: '动态' },
        ]"
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

<script setup lang="ts">
import AdminInput from '@/components/Admin/AdminInput.vue'
import AdminSelect from '@/components/Admin/AdminSelect.vue'

let emit = defineEmits(['search'])

let commentSearch = ref('')
let typeVal = ref('1')

function handleSearch(){
  emit('search',{
    key:commentSearch.value,
    type:typeVal.value
  })
}
</script>

<style scoped>

</style>
