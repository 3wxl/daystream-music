<template>
  <el-dialog
    :model-value="visible"
    title="添加歌曲"
    width="800px"
    custom-class="dark-dialog song-selector-dialog"
    :before-close="handleClose"
    append-to-body
  >
    <div class="flex flex-col h-[500px]">
      <!-- 顶部搜索工具栏 -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <el-input
          placeholder="搜索歌曲 / 歌手 / 专辑"
          prefix-icon="Search"
          class="dark-input flex-1"
          clearable
        />
        <el-checkbox label="过滤已添加歌曲" size="small" class="!mr-0" />
      </div>

      <!-- 虚拟列表区域 -->
      <!-- 说明: 这里使用 el-table-v2 -->
      <div class="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50 relative">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="mockData"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer>

        <!-- 空状态提示 (当没有数据时显示) -->
        <div v-if="false" class="absolute inset-0 flex items-center justify-center text-gray-500">
          暂无数据
        </div>
      </div>

      <!-- 底部选中状态栏 -->
      <div
        class="mt-4 flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700"
      >
        <div class="text-sm text-gray-400">
          已选择 <span class="text-pink-500 font-bold text-lg mx-1">{{ selectedNum }}</span> 首歌曲
        </div>
        <div class="flex gap-3">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" color="#ec4899" @click="handleConfirm">确认添加</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getRecommendMusic } from '@/api/home'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  visible: boolean
  playlistId: string
}>()

const emit = defineEmits(['update:visible', 'confirm'])

// 数据
const mockData = ref([])

// 选中的歌曲
const selectedRows = computed(() => mockData.value.filter((row) => row.checked))
const selectedNum = computed(() => selectedRows.value.length)
const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  const selectedIds = selectedRows.value.map((row: any) => row.id)
  console.log('选中的歌曲ID', selectedIds)
  emit('confirm', selectedIds)
  handleClose()
}

// 表头配置 (UI展示用)
const columns = [
  {
    key: 'selection',
    width: 50,
    align: 'center' as const,
    cellRenderer: ({ rowData }) =>
      h('input', {
        type: 'checkbox',
        class: 'custom-checkbox',
        checked: rowData.checked,
        onChange: (e: any) => (rowData.checked = e.target.checked),
      }),
  },
  {
    key: 'name',
    title: '歌曲标题',
    dataKey: 'name',
    width: 200,
  },
  {
    key: 'artist',
    title: '歌手',
    dataKey: 'artist',
    width: 150,
  },
  {
    key: 'hotScore',
    title: '热度',
    dataKey: 'hotScore',
    width: 100,
  },
]

onMounted(async () => {
  const res = await getRecommendMusic()
  console.log(res)
  mockData.value = res.data.map((item: any) => {
    return {
      id: item.itemId,
      name: item.songName,
      artist: item.singer,
      hotScore: item.hotScore,
      checked: false,
    }
  })
})
</script>

<style scoped>
/* 可以在这里添加一些特定的样式 */
.song-selector-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>
