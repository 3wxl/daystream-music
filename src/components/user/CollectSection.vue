<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-auto-fill md:grid-cols-auto-fill lg:grid-cols-auto-fill gap-6 y-auto"
    :style="gridStyle"
    key="playlist-grid"
  >
    <div
      v-for="playlist in playlists"
      :key="`playlist_${playlist.id}_${playlist.name}`"
      :to="{ path: '/User/LikedSongsList' }"
      class="group w-[180px]"
      @mouseleave="handleMouseLeave(playlist.id)"
      @click="handlePlaylistClick(playlist)"
    >
      <div class="relative overflow-hidden rounded-lg mb-2 aspect-square">
        <img
          :src="playlist.cover"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          :alt="playlist.name + '封面'"
        />

        <!-- 播放按钮遮罩层 -->
        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform mr-2"
            @click.stop="handlePlay(playlist)"
          >
            <i class="iconfont" style="font-size: 20px; color: white">&#xe623;</i>
          </div>
        </div>

        <!-- 右上角操作菜单 -->
        <div
          class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop
        >
          <!-- 菜单按钮 -->
          <div
            class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer"
            @click="toggleMenu(playlist.id)"
            @mouseenter="handleMenuHover(playlist.id)"
          >
            <i class="iconfont icon-more" style="font-size: 16px; color: white">&#xe73a;</i>
          </div>

          <!-- 菜单内容 -->
          <div
            v-if="openMenuId === playlist.id"
            class="absolute right-0 top-full mt-1 w-32 bg-gray-800 rounded-lg shadow-lg py-1 z-10"
            @click.stop
            @mouseenter="keepMenuOpen()"
            @mouseleave="closeMenuWithDelay"
          >
            <div
              v-if="showActionButton"
              class="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white flex items-center"
              @click="handleAction(playlist)"
              :style="{ pointerEvents: loading[playlist.id] ? 'none' : 'auto' }"
            >
              <!-- 加载状态 -->
              <i v-if="loading[playlist.id]" class="iconfont icon-loading mr-2 animate-spin"></i>
              <i v-else :class="actionIconClass" class="mr-2"></i>
              {{ loading[playlist.id] ? '处理中...' : actionTitle }}
            </div>
            <!-- 只有自己创建的歌单才显示编辑信息 -->
            <div
              v-if="props.actionType === 'delete'"
              class="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white flex items-center"
              @click="handleEdit(playlist)"
            >
              <i class="iconfont icon-edit mr-2" style="font-size: 14px">&#xe7e5;</i>
              编辑信息
            </div>
            <div
              class="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-white flex items-center"
              @click="handleShare(playlist)"
            >
              <i class="iconfont icon-share mr-2" style="font-size: 14px">&#xe64f;</i>
              分享
            </div>
          </div>
        </div>
      </div>

      <div
        class="text-white text-sm font-medium line-clamp-1 group-hover:text-pink-400 transition-colors cursor-pointer"
        @click="handlePlay(playlist)"
      >
        {{ playlist.name }}
      </div>
      <div class="text-gray-500 text-xs mt-1">{{ playlist.playCount }}首歌曲</div>
    </div>

    <!-- 加载更多提示 -->
    <div v-if="isLoadingMore" class="col-span-full py-6 text-center">
      <i class="iconfont icon-loading animate-spin text-pink-500 mr-2"></i>
      <span class="text-gray-400">加载更多歌单...</span>
    </div>

    <!-- 无更多数据提示 -->

    <UpdatePlayList
      v-if="currentEditPlaylist"
      v-model:isDialogOpen="isDialogOpen"
      :isEditMode="isEditMode"
      :editPlaylist="currentEditPlaylist"
      @create-success="handleCreateSuccess"
      @update-success="handleUpdateSuccess"
    />
  </div>
</template>
<script setup lang="ts">
import type { PlaylistVO } from '@/types/personalCenter/index'
import { ElMessage } from 'element-plus'
import { cancelCollectPlaylist, deleteCreatePlaylist } from '@/api/personalCenter/index'
import {
  createPlaylistApi,
  updatePlaylistApi,
  getCreatePlaylists,
} from '@/api/personalCenter/index'
import { usePlaylistStore } from '@/stores/playList.ts'
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playlistStore = usePlaylistStore()

// 定义props
interface Props {
  playlists: PlaylistVO[]
  actionType?: 'collect' | 'delete'
  showActionButton?: boolean
  searchKeyword?: string
  // 新增：父组件传递分页相关回调
  onLoadMore?: (pageNum: number) => Promise<PlaylistVO[]>
  hasMore?: boolean
  isLoadingMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  playlists: () => [],
  actionType: 'collect',
  showActionButton: true,
  searchKeyword: '',
  hasMore: true,
  isLoadingMore: false,
})

// 核心状态
const openMenuId = ref<string | number | null>(null)
let closeMenuTimer: ReturnType<typeof setTimeout> | null = null
const loading = ref<{ [key: string | number]: boolean }>({})

// 弹窗相关状态
const isDialogOpen = ref(false)
const isEditMode = ref(false)
const currentEditPlaylist = ref<PlaylistVO | undefined>(undefined)

// 新增：分页核心状态（如果组件独立使用）
const playlistsLocal = ref<PlaylistVO[]>([])
const pageParams = ref({ pageNum: 1, pageSize: 20 })
const hasMore = ref(true) // 是否有更多数据
const isLoadingMore = ref(false) // 是否正在加载更多

// 清除定时器
const clearCloseTimer = () => {
  if (closeMenuTimer) {
    clearTimeout(closeMenuTimer)
    closeMenuTimer = null
  }
}

// 监听父组件传入的playlists变化
watch(
  () => props.playlists,
  (newVal) => {
    openMenuId.value = null
    // 如果父组件传数据，同步到本地
    if (newVal && newVal.length > 0) {
      playlistsLocal.value = newVal
    }
  },
  { deep: true, immediate: true },
)

// 定义emits
const emit = defineEmits<{
  action: [playlist: PlaylistVO]
  play: [playlist: PlaylistVO]
  edit: [playlist: PlaylistVO]
  share: [playlist: PlaylistVO]
  collectChange: [playlistId: string | number]
  deleteChange: [playlistId: string | number]
  // 新增：通知父组件加载更多
  loadMore: []
}>()

// 菜单交互方法
const toggleMenu = (id: string | number) => {
  clearCloseTimer()
  openMenuId.value = openMenuId.value === id ? null : id
}

const keepMenuOpen = () => {
  clearCloseTimer()
}

const handleMenuHover = (id: string | number) => {
  if (openMenuId.value && openMenuId.value !== id) {
    openMenuId.value = id
  }
}

const handleMouseLeave = (id: string | number) => {
  if (openMenuId.value === id) {
    closeMenuWithDelay()
  }
}

// 延迟关闭菜单
const closeMenuWithDelay = () => {
  clearCloseTimer()
  closeMenuTimer = setTimeout(() => {
    openMenuId.value = null
  }, 300)
}

// 立即关闭菜单
const closeMenuImmediately = () => {
  clearCloseTimer()
  openMenuId.value = null
}

// 根据操作类型计算图标和标题
const actionIconClass = computed(() => {
  return props.actionType === 'collect'
    ? 'iconfont icon-collect-filled text-pink-400'
    : 'iconfont icon-delete text-pink-400'
})

const actionTitle = computed(() => {
  return props.actionType === 'collect' ? '取消收藏' : '删除'
})

// 网格样式
const gridStyle = computed(() => {
  const gap = 24
  const maxItemWidth = 220

  return {
    display: 'grid',
    gap: `${gap}px`,
    gridTemplateColumns: `repeat(auto-fill, minmax(${maxItemWidth}px, 1fr))`,
  }
})

// 歌单点击跳转
const handlePlaylistClick = (playlist: PlaylistVO) => {
  // 把歌单ID（number）转字符串存入Pinia
  playlistStore.setCurrentPlaylist(playlist.id, playlist)
  router.push('/user/liked-songs-list')
  console.log(playlist.id)
}

// 取消收藏/删除歌单逻辑
const handleAction = async (playlist: PlaylistVO) => {
  try {
    closeMenuImmediately()
    loading.value[playlist.id] = true

    if (props.actionType === 'collect') {
      const res = await cancelCollectPlaylist(playlist.id)
      if (res.success) {
        ElMessage.success(`取消收藏《${playlist.name}》成功`)
        emit('collectChange', playlist.id)
      } else {
        throw new Error(res.errorMsg || '取消收藏失败')
      }
    } else {
      const res = await deleteCreatePlaylist(playlist.id)
      if (res.success) {
        ElMessage.success(`删除《${playlist.name}》成功`)
        emit('deleteChange', playlist.id)
      } else {
        throw new Error(res.errorMsg || '删除失败')
      }
    }
  } catch (error: any) {
    console.error(`${props.actionType === 'collect' ? '取消收藏' : '删除'}失败：`, error)
    const errorMsg =
      error.message || `${props.actionType === 'collect' ? '取消收藏' : '删除'}失败，请重试`
    ElMessage.error(errorMsg)
  } finally {
    loading.value[playlist.id] = false
  }
}

// 其他事件处理
const handlePlay = (playlist: PlaylistVO) => {
  handlePlaylistClick(playlist)
  closeMenuImmediately()
  emit('play', playlist)
}

// 打开编辑弹窗
const handleEdit = (playlist: PlaylistVO) => {
  closeMenuImmediately()
  isEditMode.value = true
  currentEditPlaylist.value = playlist
  console.log(playlist?.tagIds)
  isDialogOpen.value = true
  emit('edit', playlist)
}

const handleShare = (playlist: PlaylistVO) => {
  closeMenuImmediately()
  emit('share', playlist)
}

// 打开创建弹窗
const openCreateDialog = () => {
  isEditMode.value = false
  isDialogOpen.value = true
}

// 处理创建成功
const handleCreateSuccess = async (formData: FormData) => {
  try {
    const res = await createPlaylistApi(formData)
    if (res.success) {
      ElMessage.success('歌单创建成功')
      await fetchPlaylists() // 创建成功后重新加载列表
    } else {
      ElMessage.error('创建失败')
    }
  } catch (error) {
    ElMessage.error('创建失败，请重试')
  }
}

// 处理编辑成功
const handleUpdateSuccess = async (formData: FormData, playlistId: number) => {
  console.log(88)
  console.log(formData)
  try {
    const res = await updatePlaylistApi(formData)
    console.log(res)
    if (res.success) {
      await fetchPlaylists() // 编辑成功后重新加载列表
      ElMessage.success('歌单修改成功')
    } else {
      ElMessage.error('修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败，请重试')
    console.log(error)
  }
}

// 新增：完整的分页加载逻辑
const fetchPlaylists = async (isLoadMore = false) => {
  // 加载更多时标记状态
  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    // 首次加载重置页码和数据
    pageParams.value.pageNum = 1
    playlistsLocal.value = []
    hasMore.value = true
  }

  try {
    const res = await getCreatePlaylists(pageParams.value)
    console.log(res)
    if (res.success && res.data) {
      // 替换第384行附近的逻辑如下：
      const newPlaylists = Array.isArray(res.data.records)
        ? res.data.records.flat() // 若 records 中可能包含数组，则展平
        : []

      // 确保类型正确后再赋值
      if (isLoadMore) {
        playlistsLocal.value = [...playlistsLocal.value, ...(newPlaylists as PlaylistVO[])]
      } else {
        playlistsLocal.value = newPlaylists as PlaylistVO[]
      }
      // 判断是否有更多数据（当前页码 < 总页数）
      console.log(pageParams.value.pageNum)
      console.log(res.data.pages)
      hasMore.value = pageParams.value.pageNum < (res.data.pages || 0)
      console.log(hasMore.value)
    }
  } catch (error) {
    ElMessage.error('加载歌单失败，请重试')
    console.error('加载歌单失败:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 新增：加载下一页
const loadMore = () => {
  // 防重复请求 + 无更多数据时不请求
  console.log(22)
  if (isLoadingMore.value || !hasMore.value) return

  pageParams.value.pageNum++
  fetchPlaylists(true)
  // 通知父组件加载更多（如果父组件控制分页）
  emit('loadMore')
}

// 新增：滚动监听（组件内独立实现无限滚动）
const handleScroll = () => {
  // 搜索状态下不加载更多
  if (props.searchKeyword) return

  const container = document.querySelector('.grid') // 歌单列表容器
  if (!container) return

  // 计算滚动位置：距离底部100px时加载更多
  const { scrollTop, scrollHeight, clientHeight } = container
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore()
  }
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  closeMenuImmediately()
  const target = event.target as HTMLElement
  if (!target.closest('.group')) {
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 首次加载第一页数据
  fetchPlaylists()
  // 绑定滚动监听（如果组件独立使用）
  const container = document.querySelector('.grid')
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  clearCloseTimer()
  // 解绑滚动监听
  const container = document.querySelector('.grid')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
})
</script>
<style lang="scss" scoped>
/* 优化hover效果 */
.group {
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-4px);
  }
}

/* 操作菜单动画 */
.absolute {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮hover效果 */
.w-10,
.w-12 {
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px rgba(255, 46, 147, 0.5);
  }
}

/* 菜单项hover效果 */
.hover\:bg-gray-700:hover {
  background-color: rgba(255, 46, 147, 0.2) !important;
  color: #ff2e93;
}

/* 菜单按钮效果 */
.w-8 {
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 8px rgba(255, 46, 147, 0.5);
  }
}

/* 加载动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 样式穿透修正 */
:deep(.el-empty) {
  --el-empty-text-color: #999;
  --el-empty-image-color: #666;
}

:deep(.el-input__inner) {
  background-color: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: white !important;
}

:deep(.el-textarea__inner) {
  background-color: transparent !important;
  border: none !important;
  resize: none !important;
  color: white !important;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
  transition: background 0.3s;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.fixed > div:last-child {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cover-upload :deep(.el-upload) {
  width: 100%;
}

:deep(.el-textarea) {
  --el-textarea-border-color: transparent !important;
}

:deep(.el-textarea__wrapper) {
  border: none !important;
  box-shadow: 0 0 0 1px transparent !important;
  transition: all 0.3s ease !important;
}

:deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(255, 46, 147, 0.3) !important;
}

:deep(.el-textarea:focus-within .el-textarea__wrapper) {
  box-shadow:
    0 0 0 2px rgba(255, 46, 147, 0.5),
    0 0 8px rgba(255, 46, 147, 0.2) !important;
  outline: none !important;
}

:deep(.el-textarea.is-disabled .el-textarea__wrapper) {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  background-color: #121212 !important;
}
</style>
