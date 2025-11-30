<template>
  <div v-if="mySongs.length === 0" class="py-12 text-center">
    <el-empty description="暂无已发布的音乐作品" class="text-gray-500" />
    <el-button
      type="primary"
      class="mt-4 bg-pink-600 hover:bg-pink-700 border-none"
      @click="handleAddSong"
    >
      发布新作品
    </el-button>
  </div>

  <div class="song-list" v-else>
    <div
      v-for="(song, index) in mySongs"
      :key="song.id"
      class="relative flex items-center px-5 py-3 hover:bg-gray-800/30 transition-colors group cursor-pointer justify-between"
    >
      <!-- 左侧歌曲信息 -->
      <div class="flex items-center shrink-0 w-[280px]">
        <div class="w-8 text-center text-gray-400 mr-4">
          <span class="inline-block text-gray-400 group-hover:hidden transition-opacity">{{
            index + 1
          }}</span>
          <i class="iconfont text-pink-500 hidden group-hover:inline-block transition-opacity"
            >&#xe638;</i
          >
        </div>
        <img :src="song.cover" class="w-10 h-10 rounded object-cover shrink-0" />
        <div class="ml-3 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span
              class="text-white text-sm font-medium group-hover:text-pink-400 transition-colors truncate max-w-[150px]"
            >
              {{ song.name }}
            </span>
            <template v-for="(tag, tagIndex) in song.tags" :key="tagIndex">
              <span :class="getTagClass(tag)" class="text-xs px-1.5 py-0.25 rounded">
                {{ tag }}
              </span>
            </template>
          </div>
          <div class="text-gray-500 text-xs truncate">
            {{ song.album || '未分类专辑' }}
          </div>
        </div>
      </div>

      <!-- 中间操作按钮区 -->
      <div class="flex items-center w-[500px]">
        <div class="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <!-- 下载按钮 -->
          <el-tooltip content="下载作品文件" placement="top" custom-class="tooltip-small">
            <el-button
              type="text"
              class="text-gray-400 hover:text-white transition-colors p-0 text-sm"
              style="
                width: 20px;
                height: 20px;
                display: flex;
                alignment-baseline: center;
                justify-content: center;
              "
              @click.stop="handleDownload(song.id)"
            >
              <i class="iconfont text-sm">&#xe605;</i>
            </el-button>
          </el-tooltip>

          <!-- 编辑按钮 -->
          <el-tooltip content="编辑作品信息" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 transition-colors text-gray-400 hover:text-green-400"
              @click.stop="handleEdit(song)"
            >
              <i class="iconfont text-sm">&#xe615;</i>
            </button>
          </el-tooltip>

          <!-- 评论按钮 -->
          <el-tooltip content="查看作品评论" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-orange-400 transition-colors"
              @click.stop="handleViewComment(song.id)"
            >
              <i class="iconfont text-sm">&#xe62c;</i>
            </button>
          </el-tooltip>

          <!-- 分享按钮 -->
          <el-tooltip content="分享作品" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
              @click.stop="handleShare(song.id)"
            >
              <i class="iconfont text-sm">&#xe64f;</i>
            </button>
          </el-tooltip>

          <!-- 删除按钮 -->
          <el-tooltip content="删除作品" placement="top">
            <button
              class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-red-400 transition-colors"
              @click.stop="handleDelete(song.id)"
            >
              <i class="iconfont text-sm">&#xe607;</i>
            </button>
          </el-tooltip>
        </div>

        <!-- 播放量/发布时间 -->
        <div class="w-[200px] text-gray-500 text-xs text-center">
          <span>播放量: {{ formatPlayCount(song.playCount) }}</span>
          <span class="ml-2">|</span>
          <span>{{ song.releaseTime }}</span>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="flex items-center gap-3 shrink-0 w-[100px] justify-end">
        <!-- 上架/下架状态 -->
        <el-switch
          v-model="song.isOnline"
          active-text="上架"
          inactive-text="下架"
          active-color="#ec479a"
          inactive-color="#666"
          size="small"
          @change="handleOnlineStatusChange(song.id, song.isOnline)"
        />
        <div class="text-gray-500 text-xs">
          {{ formatTime(song.duration) }}
        </div>
      </div>

      <!-- 编辑弹窗（优化后） -->
      <teleport to="body">
        <div
          v-if="editDialogVisible"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" @click="closeDialog"></div>

          <div
            class="relative z-50 w-full max-w-md bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
          >
            <!-- 弹窗头部 -->
            <div
              class="h-18 w-full bg-[#121212] border-b border-white/10 px-6 py-4 flex justify-between items-center"
            >
              <div class="flex items-center gap-3">
                <img src="../../assets/logo.jpg" alt="" class="w-10 h-10 rounded-full" />
                <h2 class="text-xl font-semibold text-white">编辑音乐作品</h2>
              </div>
              <button
                class="text-[#8A8A8A] hover:text-white transition-colors"
                @click="editDialogVisible = false"
              >
                <i class="iconfont">&#xe69e;</i>
              </button>
            </div>

            <!-- 弹窗内容 -->
            <div class="p-6 overflow-y-auto max-h-[calc(85vh-4.5rem)] scrollbar-custom">
              <el-form
                :model="editForm"
                label-width="90px"
                class="edit-form space-y-6"
                :rules="editFormRules"
                ref="editFormRef"
              >
                <!-- 作品名称 -->
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">作品名称 *</label>
                  <el-input
                    v-model="editForm.name"
                    placeholder="请输入作品名称"
                    class="form-input dark-input"
                    @focus="inputFocus"
                    @blur="inputBlur"
                  />
                </div>

                <!-- 所属专辑 -->
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">所属专辑</label>
                  <el-input
                    v-model="editForm.album"
                    placeholder="请输入专辑名称（选填）"
                    class="form-input dark-input"
                    @focus="inputFocus"
                    @blur="inputBlur"
                  />
                </div>

                <!-- 作品标签 -->
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">作品标签</label>
                  <el-select
                    v-model="editForm.tags"
                    multiple
                    placeholder="请选择/新增标签"
                    class="form-select dark-select w-full"
                    collapse-tags
                    collapse-tags-max-width="300px"
                    @focus="selectFocus"
                    @blur="selectBlur"
                  >
                    <el-option
                      v-for="option in ['超清母带', '无损', 'MV', '热门', '新歌', 'VIP']"
                      :key="option"
                      :label="option"
                      :value="option"
                      class="dark-option"
                    />
                  </el-select>
                  <div class="tag-tips text-xs text-gray-400 mt-1">
                    最多选择3个标签，多个标签会提升作品曝光
                  </div>
                </div>

                <!-- 封面图 -->
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">封面图</label>
                  <div class="cover-upload-wrap flex items-start gap-4">
                    <el-upload
                      action="#"
                      :show-file-list="false"
                      :on-change="handleCoverUpload"
                      :before-upload="beforeCoverUpload"
                      class="avatar-uploader"
                    >
                      <div
                        class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-white/10 hover:border-[#FF2E93] transition-colors cursor-pointer bg-[#121212]"
                      >
                        <img
                          v-if="editForm.cover"
                          :src="editForm.cover"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A]"
                        >
                          <i class="iconfont" style="font-size: 28px">&#xe69d;</i>
                          <span class="text-xs mt-2">点击上传封面图</span>
                          <span class="text-xs">或拖放至此</span>
                        </div>
                      </div>
                    </el-upload>
                    <div class="cover-tips text-sm text-[#8A8A8A] flex-1">
                      <p>• 封面图会展示在作品列表和播放页</p>
                      <p>• 支持jpg/png格式，建议尺寸 1:1</p>
                      <p>• 高清图体验更佳，不超过2MB</p>
                    </div>
                  </div>
                </div>

                <!-- 作品时长 -->
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">作品时长</label>
                  <div class="duration-wrap flex items-center gap-2">
                    <span class="text-[#FF2E93]">{{ formatTime(editForm.duration) }}</span>
                    <span class="text-xs text-[#8A8A8A]">(时长不可修改)</span>
                  </div>
                </div>
              </el-form>
            </div>

            <!-- 弹窗底部 -->
            <div class="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                class="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                @click="editDialogVisible = false"
              >
                取消
              </button>
              <button
                type="button"
                class="px-6 py-2 bg-gradient-to-r from-[#e2036f] to-[#b277bb] rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                @click="saveEditForm"
                :disabled="saveLoading"
                :class="{
                  'opacity-70 cursor-not-allowed': saveLoading,
                }"
              >
                <i class="iconfont mr-1" style="font-size: 16px">&#xe619;</i>
                <span>{{ saveLoading ? '保存中...' : '保存修改' }}</span>
              </button>
            </div>

            <!-- 底部装饰条 -->
            <div
              class="h-1 w-full bg-gradient-to-r from-[#FF2E93] via-[#d46ab5] to-[#b481bc]"
            ></div>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// ========== 核心响应式变量 ==========
// 弹窗控制
const editDialogVisible = ref(false)
const currentEditSongId = ref<number | null>(null)
const saveLoading = ref(false) // 保存按钮loading

// 表单相关
const editFormRef = ref<FormInstance>()
const editForm = ref({
  id: 0,
  name: '',
  album: '',
  cover: '',
  duration: 0,
  tags: [] as string[],
})

// 表单校验规则
const editFormRules = ref<FormRules>({
  name: [
    { required: true, message: '作品名称不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '作品名称长度在2-30个字符', trigger: 'blur' },
  ],
  tags: [{ type: 'array', max: 3, message: '最多选择3个标签', trigger: 'change' }],
})

// ========== 工具方法 ==========
// 格式化时长（秒转分:秒）
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// 格式化播放量（万为单位）
const formatPlayCount = (count: number) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}

// 获取标签样式类名
const getTagClass = (tag: string) => {
  switch (tag) {
    case '超清母带':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    case 'VIP':
      return 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
    case 'MV':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    case '无损':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case '热门':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
    case '新歌':
      return 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
}

// ========== 模拟数据 ==========
const mySongs = ref([
  {
    id: 1,
    name: '夏日晚风',
    album: '晚风集',
    cover: 'https://picsum.photos/80/80?random=1',
    duration: 237,
    tags: ['超清母带', 'MV'],
    playCount: 125800,
    releaseTime: '2025-01-15',
    isOnline: true,
  },
  {
    id: 2,
    name: '星光坠落时',
    album: '星光合集',
    cover: 'https://picsum.photos/80/80?random=2',
    duration: 198,
    tags: ['无损', '热门'],
    playCount: 89600,
    releaseTime: '2025-02-20',
    isOnline: true,
  },
  {
    id: 3,
    name: '城市浪漫',
    album: '城市之声',
    cover: 'https://picsum.photos/80/80?random=3',
    duration: 215,
    tags: ['超清母带', '新歌'],
    playCount: 56200,
    releaseTime: '2025-03-08',
    isOnline: false,
  },
  {
    id: 4,
    name: '深海回响',
    album: '深海秘境',
    cover: 'https://picsum.photos/80/80?random=4',
    duration: 242,
    tags: [],
    playCount: 32800,
    releaseTime: '2025-04-12',
    isOnline: true,
  },
])

// ========== 弹窗交互方法 ==========
// 弹窗打开动画
const dialogOpenAnimation = () => {
  const dialogEl = document.querySelector('.edit-song-dialog .el-dialog__body')
  if (dialogEl) {
    dialogEl.classList.add('dialog-animate-in')
  }
}

// 弹窗关闭前动画
const handleDialogClose = (done: () => void) => {
  const dialogEl = document.querySelector('.edit-song-dialog .el-dialog__body')
  if (dialogEl) {
    dialogEl.classList.add('dialog-animate-out')
    setTimeout(() => {
      done()
      dialogEl.classList.remove('dialog-animate-out', 'dialog-animate-in')
    }, 200)
  } else {
    done()
  }
}

// 输入框聚焦/失焦动画
const inputFocus = (e: Event) => {
  const inputEl = (e.target as HTMLElement).closest('.el-input')
  if (inputEl) {
    inputEl.classList.add('input-focus')
  }
}

const inputBlur = (e: Event) => {
  const inputEl = (e.target as HTMLElement).closest('.el-input')
  if (inputEl) {
    inputEl.classList.remove('input-focus')
  }
}

// 选择框聚焦/失焦动画
const selectFocus = (e: Event) => {
  const selectEl = (e.target as HTMLElement).closest('.el-select')
  if (selectEl) {
    selectEl.classList.add('select-focus')
  }
}

const selectBlur = (e: Event) => {
  const selectEl = (e.target as HTMLElement).closest('.el-select')
  if (selectEl) {
    selectEl.classList.remove('select-focus')
  }
}

// ========== 业务逻辑方法 ==========
// 发布新作品
const handleAddSong = () => {
  ElMessage.info('跳转到发布新作品页面')
}

// 编辑作品-打开弹窗
const handleEdit = (song: any) => {
  currentEditSongId.value = song.id
  editForm.value = {
    id: song.id,
    name: song.name,
    album: song.album,
    cover: song.cover,
    duration: song.duration,
    tags: [...song.tags],
  }
  editDialogVisible.value = true
}

// 重置编辑表单
const resetEditForm = () => {
  currentEditSongId.value = null
  editForm.value = {
    id: 0,
    name: '',
    album: '',
    cover: '',
    duration: 0,
    tags: [],
  }
}
// 封面上传校验
const beforeCoverUpload = (file: File) => {
  const isJpgPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgPng) {
    ElMessage.error('封面图仅支持jpg/png格式！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('封面图大小不能超过2MB！')
    return false
  }
  return true
}
const closeDialog = () => {
  handleDialogClose(() => {
    editDialogVisible.value = false
  })
}
// 封面上传处理
const handleCoverUpload = (file: any) => {
  editForm.value.cover = URL.createObjectURL(file.raw)
}

// 保存编辑表单（带校验）
const saveEditForm = async () => {
  if (!editFormRef.value) return

  try {
    // 表单校验
    await editFormRef.value.validate()
    saveLoading.value = true

    // 查找并更新数据
    const index = mySongs.value.findIndex((item) => item.id === currentEditSongId.value)
    if (index > -1) {
      mySongs.value[index] = {
        ...mySongs.value[index],
        name: editForm.value.name,
        album: editForm.value.album,
        cover: editForm.value.cover,
        tags: editForm.value.tags,
      }

      // 模拟接口请求延迟
      setTimeout(() => {
        ElMessage.success('作品信息修改成功 ✨')
        editDialogVisible.value = false
        saveLoading.value = false
        resetEditForm() // 重置表单
      }, 800)
    }
  } catch (error) {
    saveLoading.value = false
    ElMessage.warning('请完善表单信息后再保存')
  }
}

// 删除作品
const handleDelete = async (songId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该作品吗？删除后将无法恢复！', '删除确认', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'bg-red-600',
    })
    mySongs.value = mySongs.value.filter((item) => item.id !== songId)
    ElMessage.success('作品删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 下载作品
const handleDownload = (songId: number) => {
  const song = mySongs.value.find((item) => item.id === songId)
  ElMessage.success(`开始下载：${song?.name}`)
}

// 查看评论
const handleViewComment = (songId: number) => {
  ElMessage.info(`查看ID为${songId}的作品评论`)
}

// 分享作品
const handleShare = (songId: number) => {
  ElMessage.success('作品分享链接已复制到剪贴板')
}

// 上架/下架状态变更
const handleOnlineStatusChange = (songId: number, status: boolean) => {
  const statusText = status ? '上架' : '下架'
  ElMessage.success(`作品${statusText}成功`)
  // 实际项目中可调用接口更新状态
}
</script>
<style scoped>
/* 暗黑弹窗整体样式 */
.dark-dialog {
  --el-dialog-bg-color: #1a1a1a;
  --el-dialog-border-color: #2d2d2d;
  --el-dialog-title-color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.dark-dialog :deep(.el-dialog__body) {
  background-color: #1a1a1a;
  color: #e5e5e5;
  padding: 16px 20px;
  border-top: 1px solid #2d2d2d;
  border-bottom: 1px solid #2d2d2d;
}

/* 表单样式 */
.dark-form {
  color: #e5e5e5;
}

.dark-form-item :deep(.el-form-item__label) {
  color: #d1d1d1;
}

/* 输入框暗黑样式 */
.dark-input :deep(.el-input__wrapper) {
  background-color: #252525;
  border: 1px solid #333;
  color: #fff;
  box-shadow: none;
}

.dark-input :deep(.el-input__wrapper:hover) {
  border-color: #ec479a;
}

.dark-input :deep(.el-input__wrapper.is-focus) {
  border-color: #ec479a;
  box-shadow: 0 0 0 2px rgba(236, 71, 154, 0.2);
}

.dark-input :deep(.el-input__prefix) {
  color: #ec479a;
}

/* 选择器暗黑样式 */
.dark-select :deep(.el-select__wrapper) {
  background-color: #252525;
  border: 1px solid #333;
  color: #fff;
}

.dark-select :deep(.el-select__wrapper:hover) {
  border-color: #ec479a;
}

.dark-select :deep(.el-select__wrapper.is-focus) {
  border-color: #ec479a;
  box-shadow: 0 0 0 2px rgba(236, 71, 154, 0.2);
}

.dark-select :deep(.el-select__placeholder) {
  color: #999;
}

/* 下拉选项暗黑样式 */
.dark-option :deep(.el-option) {
  background-color: #252525;
  color: #fff;
}

.dark-option :deep(.el-option:hover) {
  background-color: #ec479a/10;
  color: #ec479a;
}

.dark-option :deep(.el-option.selected) {
  background-color: #ec479a/20;
  color: #ec479a;
}

/* 封面上传区暗黑样式 */
.dark-cover-preview {
  width: 100px;
  height: 100px;
  border: 1px dashed #333;
  border-radius: 4px;
  background-color: #252525;
  transition: all 0.3s;
}

.dark-cover-preview:hover {
  border-color: #ec479a;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* 按钮样式 */
.dark-cancel-btn {
  --el-button-bg-color: #252525;
  --el-button-border-color: #333;
  --el-button-text-color: #d1d1d1;
  --el-button-hover-bg-color: #333;
  --el-button-hover-border-color: #444;
}

.dark-save-btn {
  font-weight: 500;
}

/* 弹窗动画 */
.dialog-animate-in {
  animation: fadeInUp 0.2s ease forwards;
}

.dialog-animate-out {
  animation: fadeOutDown 0.2s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}
.scrollbar-custom::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 2px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #ff2e93;
  border-radius: 2px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #e2036f;
}

/* 输入框样式调整 */
:deep(.dark-input .el-input__wrapper) {
  background-color: #121212;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.dark-input .el-input__wrapper:hover) {
  border-color: #ff2e93;
}

:deep(.dark-input .el-input__wrapper.is-focus) {
  border-color: #ff2e93;
  box-shadow: 0 0 0 2px rgba(255, 46, 147, 0.2);
}

:deep(.dark-input .el-input__inner) {
  color: #fff;
  background: transparent;
}

:deep(.dark-input .el-input__inner::placeholder) {
  color: #8a8a8a;
}

/* 选择器样式调整 */
:deep(.dark-select .el-select__wrapper) {
  background-color: #121212;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.dark-select .el-select__wrapper:hover) {
  border-color: #ff2e93;
}

:deep(.dark-select .el-select__wrapper.is-focus) {
  border-color: #ff2e93;
  box-shadow: 0 0 0 2px rgba(255, 46, 147, 0.2);
}

:deep(.dark-select .el-select__placeholder) {
  color: #8a8a8a;
}

/* 下拉选项样式 */
:deep(.el-select-dropdown) {
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

:deep(.el-select-dropdown .el-option) {
  background-color: #1e1e1e;
  color: #fff;
}

:deep(.el-select-dropdown .el-option:hover) {
  background-color: rgba(255, 46, 147, 0.1);
}

:deep(.el-select-dropdown .el-option.selected) {
  background-color: rgba(255, 46, 147, 0.2);
  color: #ff2e93;
}

/* 多选标签样式 */
:deep(.el-select__tags .el-tag) {
  background: rgba(255, 46, 147, 0.2);
  border: 1px solid rgba(255, 46, 147, 0.3);
  color: #ff2e93;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
