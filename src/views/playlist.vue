<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="shrink-0 overflow-x-auto overflow-y-hidden tag-bar-container">
      <MultiBar v-model="filterValue" :filter-groups="filterGroups" />
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MultiBar from '@/components/MultiBar.vue'
import { ref,onMounted } from 'vue'
import { getAllTags } from '@/api/playlist/AllTag'
import { transformFilterGroups } from '@/utils/transformFilterGroups'
import { ElMessage } from 'element-plus'

const filterValue = ref({
  area: '',
  type: '',
  genre: '',
})

let filterGroups = ref()

onMounted(() => {
  getAllTags().then(res => {
    if(!res.data) return 
    const tags = transformFilterGroups(res.data)
    console.log(tags)
    filterGroups.value = tags
  }).catch(err => {
    ElMessage.error(err.message)
  })
})

// const filterGroups = [
//   {
//     key: 'area',
//     name: '地区',
//     options: [
//       { label: '内地', value: 'mainland' },
//       { label: '港台', value: 'hktw' },
//       { label: '欧美', value: 'western' },
//       { label: '日本', value: 'japan' },
//       { label: '韩国', value: 'korea' },
//     ],
//   },
//   {
//     key: 'type',
//     name: '类型',
//     options: [
//       { label: '男', value: 'male' },
//       { label: '女', value: 'female' },
//       { label: '组合', value: 'group' },
//     ],
//   },
//   {
//     key: 'genre',
//     name: '流派',
//     options: [
//       { label: '流行', value: 'pop' },
//       { label: '说唱', value: 'rap' },
//       { label: '国风', value: 'chinese_style' },
//       { label: '摇滚', value: 'rock' },
//     ],
//   },
// ]
</script>

<style lang="scss" scoped>
.tag-bar-container {
  display: flex;
  white-space: nowrap;
  padding: 12px 20px;
  background-color: transparent;
  min-width: min-content;
}

.tag-bar-container::-webkit-scrollbar {
  display: none;
}

.tag-bar-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>
