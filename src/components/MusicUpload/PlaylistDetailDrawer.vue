<template>
  <el-drawer
    :model-value="visible"
    direction="rtl"
    size="100%"
    :show-close="false"
    class="playlist-detail-drawer"
    :before-close="handleClose"
  >
    <!-- 自定义 Header -->
    <template #header>
      <div class="flex items-center justify-between w-full pr-4">
        <div class="flex items-center gap-4">
          <button
            @click="handleClose"
            class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <i class="fa fa-arrow-left text-lg"></i>
          </button>
          <span class="text-lg font-semibold">歌单详情管理</span>
        </div>
        <div>
          <!-- 顶部右侧占位 -->
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <!-- 1. 歌单信息概览区域 -->
      <div class="flex gap-6 mb-8 mt-2 p-6 bg-gray-800/40 rounded-2xl border border-white/5">
        <!-- 封面 -->
        <div
          class="w-40 h-40 shrink-0 rounded-xl overflow-hidden shadow-lg bg-gray-700 relative group"
        >
          <img
            :src="playlistDetail.cover"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <span class="text-xs text-white border border-white/50 px-2 py-1 rounded"
              >更换封面</span
            >
          </div>
        </div>

        <!-- 信息 -->
        <div class="flex-1 flex flex-col justify-center">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-xs px-2 py-0.5 rounded border border-pink-500 text-pink-500"
              >{{ isPublic === 0 ? '公开' : '私有' }}</span
            >
            <h1 class="text-3xl font-bold text-white tracking-tight">{{ playlistDetail.name }}</h1>
          </div>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2 max-w-2xl">
            {{ playlistDetail.description || '无' }}
          </p>

          <div class="flex items-center gap-6 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <i class="fa fa-music"></i>
              <span>{{ playlistDetail.musicCount }}首歌曲</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa fa-play-circle"></i>
              <span>{{ playlistDetail.playCount }}次播放</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 操作工具栏 -->
      <div class="flex justify-between items-center mb-4 sticky top-0 z-10 bg-[#141414] py-2">
        <div class="flex items-center gap-3">
          <el-button
            type="primary"
            color="#ec4899"
            class="!rounded-lg"
            @click="showSongSelector = true"
          >
            <i class="fa fa-plus mr-2"></i> 添加歌曲
          </el-button>

          <el-button type="danger" plain class="!rounded-lg !bg-transparent" :disabled="true">
            <i class="fa fa-trash-alt mr-2"></i> 批量删除
          </el-button>
        </div>

        <div class="w-64">
          <el-input placeholder="在歌单内搜索..." prefix-icon="Search" class="dark-input" />
        </div>
      </div>

      <!-- 3. 歌曲列表 -->
      <div class="flex-1 overflow-hidden bg-gray-900/30 rounded-xl border border-white/5">
        <el-table
          :data="musicSongs"
          style="width: 100%; height: 100%"
          class="transparent-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="#" width="60" align="center" />

          <el-table-column label="歌曲标题" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <img :src="row.coverUrl" class="w-10 h-10 rounded bg-gray-800 object-cover" />
                <div class="flex flex-col">
                  <span class="text-white font-medium">{{ row.musicName }}</span>
                  <span class="text-xs text-gray-500 sm:hidden">{{
                    row.musicianName || '未知歌手'
                  }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="artist"
            label="歌手"
            width="180"
            class-name="hidden sm:table-cell"
          />
          <el-table-column
            prop="album"
            label="专辑"
            width="180"
            class-name="hidden md:table-cell"
          />
          <el-table-column prop="duration" label="时长" width="100" align="right" />

          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default>
              <button class="text-gray-400 hover:text-red-500 transition-colors p-2">
                <i class="fa fa-trash"></i>
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部统计 (可选) -->
      <div class="mt-2 text-xs text-center text-gray-600 pb-4">共加载 12 首歌曲</div>
    </div>

    <!-- 引入歌曲选择器组件 -->
    <AllSongsVirtualList
      v-model:visible="showSongSelector"
      :playlistId="props.playlistId"
      @confirm="handleConfirm"
    />
  </el-drawer>
</template>

<script lang="ts" setup>
import { getPlayListDetail,addMusicToPlaylist } from '@/api/playlist'
import { ref } from 'vue'
import AllSongsVirtualList from './AllSongsVirtualList.vue'

const playlistDetail = ref([])
const isPublic =ref()

const props = defineProps({
  visible: Boolean,
  playlistId: String,
})

const emit = defineEmits(['update:visible'])

const showSongSelector = ref(false)

const handleClose = () => {
  emit('update:visible', false)
}

const handleSelectionChange = (val: any[]) => {
  console.log('选中项:', val)
}

const musicSongs = ref([])

const loadData = async () => {
  const res = await getPlayListDetail(props.playlistId, '1', '100')
  playlistDetail.value = res.data
  musicSongs.value = res.data.musicDetailVOList.records
  isPublic.value = res.data.isPublic
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.playlistId) {
      loadData()
    }
  },
)

const handleConfirm = async (selectedIds: number[]) => {
 console.log('选中的歌曲', selectedIds)
 try {
   await addMusicToPlaylist({
     playlistId: props.playlistId,
     songIds: selectedIds,
   })
   ElMessage.success('添加成功')
 } catch (error) {
   console.log('添加失败',error)
 }
}
</script>

<style scoped>
/* 一些特定的样式覆盖，保证在 Drawer 里好看 */
.transparent-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(255, 255, 255, 0.02);
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-text-color: #d1d5db;
  --el-table-header-text-color: #9ca3af;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
}
</style>

<style>
.playlist-detail-drawer.el-drawer {
  background-color: #0f172a !important; /* 类似主背景的深色 */
}
.playlist-detail-drawer .el-drawer__body {
  background-color: transparent !important;
  padding: 0 !important;
}
.playlist-detail-drawer .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 1rem 1.5rem !important;
  background-color: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}
.playlist-detail-drawer .el-drawer__close-btn {
  color: white !important;
}
</style>
