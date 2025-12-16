<template>
  <div
    v-if="isDialogOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-8"
    @click.self="resetAndClose"
  >
    <!-- 背景遮罩 -->
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"></div>

    <!-- 弹窗主体 -->
    <div
      class="relative z-50 w-full max-w-md bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-fade-in flex flex-col"
      style="height: 680px; max-height: 85vh"
    >
      <!-- 头部 -->
      <div
        class="h-18 w-full bg-gradient-to-r from-[#121212] to-[#1a1a1a] border-b border-white/10 px-6 py-4 flex justify-between items-center shrink-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#FF6B9D] flex items-center justify-center"
          >
            <i class="iconfont text-white" style="font-size: 20px">&#xe619;</i>
          </div>
          <h2 class="text-xl font-semibold text-white">
            {{ isEditMode ? '编辑歌单' : '创建新歌单' }}
          </h2>
        </div>
        <button
          class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all duration-200"
          @click="resetAndClose"
        >
          <i class="iconfont">&#xe69e;</i>
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="p-6 overflow-y-auto flex-1 min-h-0">
        <div class="space-y-6">
          <!-- 歌单封面上传 -->
          <div>
            <label class="text-sm text-[#8A8A8A] block mb-2"
              >歌单封面 {{ isEditMode ? '' : '*' }}</label
            >
            <div class="flex items-start gap-6">
              <el-upload
                class="cover-upload"
                :show-file-list="false"
                :http-request="handleUpload"
                accept="image/jpeg,image/png"
                :disabled="isUploading"
              >
                <div
                  class="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-white/10 hover:border-[#FF2E93] transition-all duration-300 cursor-pointer bg-gradient-to-br from-[#121212] to-[#1a1a1a] group shrink-0"
                >
                  <!-- 默认/原有封面 -->
                  <div
                    v-if="!newPlaylistCover && (!isEditMode || !editPlaylist?.cover)"
                    class="w-full h-full flex flex-col items-center justify-center text-[#8A8A8A] group-hover:text-[#FF2E93] transition-colors"
                  >
                    <i class="iconfont" style="font-size: 32px">&#xe63b;</i>
                    <span class="text-xs mt-2">点击上传</span>
                  </div>

                  <!-- 已上传/原有封面 -->
                  <img
                    v-else
                    :src="newPlaylistCover || editPlaylist?.cover"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />

                  <!-- 上传遮罩 -->
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <i class="iconfont text-white text-lg" style="font-size: 30px">&#xe639;</i>
                  </div>

                  <!-- 上传中遮罩 -->
                  <div
                    v-if="isUploading"
                    class="absolute inset-0 bg-black/60 flex items-center justify-center"
                  >
                    <div class="flex flex-col items-center">
                      <i
                        class="iconfont icon-loading mb-2"
                        style="font-size: 20px; color: #ff2e93; animation: spin 1s linear infinite"
                      ></i>
                      <span class="text-xs text-white">上传中...</span>
                    </div>
                  </div>
                </div>
              </el-upload>

              <div class="flex-1">
                <p class="text-white text-sm font-medium mb-1">封面要求</p>
                <ul class="text-[#8A8A8A] text-xs space-y-1">
                  <li class="flex items-center gap-1">
                    <i class="iconfont text-[#FF2E93]" style="font-size: 12px">&#xe611;</i>
                    <span>支持 JPG、PNG 格式</span>
                  </li>
                  <li class="flex items-center gap-1">
                    <i class="iconfont text-[#FF2E93]" style="font-size: 12px">&#xe611;</i>
                    <span>建议尺寸 1:1 正方形</span>
                  </li>
                </ul>

                <!-- 移除按钮 -->
                <button
                  v-if="newPlaylistCover || (isEditMode && editPlaylist?.cover)"
                  class="mt-3 px-3 py-1 text-xs border border-white/20 rounded text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                  @click.stop="handleRemoveCover"
                >
                  <i class="iconfont" style="font-size: 12px">&#xe607;</i>
                  <span>移除封面</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 歌单名称 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm text-[#8A8A8A]">歌单名称 *</label>
              <span class="text-xs text-[#8A8A8A]">{{ newPlaylistName.length }}/16</span>
            </div>
            <input
              type="text"
              v-model="newPlaylistName"
              class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all duration-200"
              placeholder="输入歌单名称"
              maxlength="16"
              :class="{ 'border-red-500': newPlaylistNameError }"
              @input="validatePlaylistName"
            />
            <div
              v-if="newPlaylistNameError"
              class="text-red-500 text-xs mt-1 flex items-center gap-1"
            >
              <i class="iconfont" style="font-size: 12px">&#xe607;</i>
              <span>{{ newPlaylistNameError }}</span>
            </div>
          </div>

          <!-- 歌单描述 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm text-[#8A8A8A]">歌单描述 *</label>
              <span class="text-xs text-[#8A8A8A]">{{ newPlaylistDesc.length }}/30</span>
            </div>
            <textarea
              v-model="newPlaylistDesc"
              rows="2"
              class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF2E93] focus:ring-1 focus:ring-[#FF2E93] transition-all duration-200 resize-none"
              placeholder="描述一下这个歌单..."
              maxlength="30"
              :class="{ 'border-red-500': newPlaylistDescError }"
              @input="validatePlaylistDesc"
            ></textarea>
            <div
              v-if="newPlaylistDescError"
              class="text-red-500 text-xs mt-1 flex items-center gap-1"
            >
              <i class="iconfont" style="font-size: 12px">&#xe607;</i>
              <span>{{ newPlaylistDescError }}</span>
            </div>
          </div>

          <!-- 多标签选择 -->
          <div class="tag-section">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm text-[#8A8A8A]">歌单标签 *</label>
              <span class="text-xs text-[#FF2E93]">已选择 {{ selectedTagIds.length }} 个</span>
            </div>

            <div class="relative">
              <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto pb-2 pr-2 scrollbar-thin">
                <button
                  v-for="tag in tags"
                  :key="tag.id"
                  type="button"
                  class="px-3 py-1.5 rounded-full transition-all duration-200 text-sm flex items-center gap-1 select-none whitespace-nowrap shrink-0"
                  :class="[
                    selectedTagIds.includes(tag.id)
                      ? 'bg-[#FF2E93] text-white shadow-md border-transparent'
                      : 'bg-[#121212] text-white border border-white/10 hover:border-[#FF2E93] hover:text-[#FF2E93]',
                  ]"
                  @click="(e) => toggleTag(tag.id, e)"
                >
                  <i
                    v-if="selectedTagIds.includes(tag.id)"
                    class="iconfont text-xs"
                    style="font-size: 10px"
                  >
                    &#xe607;
                  </i>
                  {{ tag.tag_name }}
                </button>
              </div>
              <div class="scroll-shadow"></div>
            </div>

            <div v-if="tagError" class="text-red-500 text-xs mt-2 flex items-center gap-1">
              <i class="iconfont" style="font-size: 12px">&#xe607;</i>
              <span>{{ tagError }}</span>
            </div>
            <div v-else-if="selectedTagIds.length > 0" class="text-xs text-[#8A8A8A] mt-2">
              已选择：
              <span class="text-[#FF2E93]">
                {{ getSelectedTagNames().join('、') }}
              </span>
            </div>
          </div>

          <!-- 隐私设置 -->
          <div>
            <label class="text-sm text-[#8A8A8A] block mb-3">隐私设置</label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="relative flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group"
                :class="
                  playlistPrivacy === 'public'
                    ? 'border-[#FF2E93] bg-[#FF2E93]/10'
                    : 'border-white/10 hover:border-white/20'
                "
              >
                <input
                  type="radio"
                  name="privacy"
                  class="absolute opacity-0"
                  value="public"
                  v-model="playlistPrivacy"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    :class="
                      playlistPrivacy === 'public'
                        ? 'bg-[#FF2E93]'
                        : 'bg-white/5 group-hover:bg-white/10'
                    "
                  >
                    <i class="iconfont text-white" style="font-size: 16px">&#xe653;</i>
                  </div>
                  <span class="text-sm font-medium text-white">公开</span>
                  <span class="text-xs text-[#8A8A8A] mt-1">所有人可见</span>
                </div>
              </label>

              <label
                class="relative flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 group"
                :class="
                  playlistPrivacy === 'private'
                    ? 'border-[#FF2E93] bg-[#FF2E93]/10'
                    : 'border-white/10 hover:border-white/20'
                "
              >
                <input
                  type="radio"
                  name="privacy"
                  class="absolute opacity-0"
                  value="private"
                  v-model="playlistPrivacy"
                />
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                    :class="
                      playlistPrivacy === 'private'
                        ? 'bg-[#FF2E93]'
                        : 'bg-white/5 group-hover:bg-white/10'
                    "
                  >
                    <i class="iconfont text-white" style="font-size: 16px">&#xe99b;</i>
                  </div>
                  <span class="text-sm font-medium text-white">私密</span>
                  <span class="text-xs text-[#8A8A8A] mt-1">仅自己可见</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div
        class="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-[#121212] to-[#1a1a1a] flex justify-between shrink-0"
      >
        <div class="text-xs text-[#8A8A8A] flex items-center gap-1">
          <span>{{ isEditMode ? '修改后即时生效' : '创建后可在歌单设置中修改' }}</span>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            class="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
            @click="resetAndClose"
          >
            <span>取消</span>
          </button>
          <button
            type="button"
            class="px-6 py-2 bg-gradient-to-r from-[#FF2E93] to-[#FF6B9D] rounded-lg text-white hover:shadow-lg hover:shadow-[#FF2E93]/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="
              () => {
                isEditMode ? updatePlaylist() : createNewPlaylist()
              }
            "
          >
            <i class="iconfont" style="font-size: 14px">&#xe619;</i>
            <span v-if="!isSubmitting">{{ isEditMode ? '保存修改' : '创建歌单' }}</span>
            <span v-else class="flex items-center gap-2">
              <i class="iconfont icon-loading animate-spin" style="font-size: 14px"></i>
              {{ isEditMode ? '保存中...' : '创建中...' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { PlaylistVO } from '@/types/personalCenter/index'
import type { UploadRequestOptions } from 'element-plus'
// 定义UploadOptions类型
interface UploadOptions {
  file: File
  onSuccess: (response: any, file: File) => void
  onError: (err: Error, file: File) => void
}

// 扩展Props
const props = defineProps<{
  isDialogOpen: boolean
  isEditMode?: boolean
  editPlaylist?: PlaylistVO
}>()
console.log('props', props.isEditMode)
// 扩展Emit
const emit = defineEmits<{
  'update:isDialogOpen': [value: boolean]
  'create-success': [formData: FormData]
  'update-success': [formData: FormData, playlistId: number]
}>()

interface Tag {
  id: number
  tag_name: string
}

// 表单数据
const newPlaylistName = ref('')
const newPlaylistDesc = ref('')
const playlistPrivacy = ref('public')
const newPlaylistCover = ref('')
const coverFile = ref<File | null>(null)
const newPlaylistNameError = ref('')
const newPlaylistDescError = ref('')
const tagError = ref('')

// 标签数据
const tags = ref<Tag[]>([
  { id: 28, tag_name: '贝斯' },
  { id: 23, tag_name: '跳舞' },
  { id: 3, tag_name: '轻音乐' },
  { id: 20, tag_name: '运动' },
  { id: 26, tag_name: '钢琴' },
  { id: 25, tag_name: '驾车' },
  { id: 18, tag_name: '学习工作' },
  { id: 15, tag_name: '寂寞' },
  { id: 30, tag_name: '小提琴' },
  { id: 9, tag_name: '快乐' },
  { id: 13, tag_name: '思念' },
  { id: 6, tag_name: '摇滚' },
  { id: 22, tag_name: '旅行' },
  { id: 29, tag_name: '架子鼓' },
  { id: 5, tag_name: '民谣' },
  { id: 12, tag_name: '治愈' },
  { id: 24, tag_name: '派对' },
  { id: 1, tag_name: '流行' },
  { id: 7, tag_name: '爵士' },
  { id: 14, tag_name: '甜蜜' },
  { id: 2, tag_name: '电子' },
  { id: 21, tag_name: '睡前' },
  { id: 4, tag_name: '说唱' },
  { id: 8, tag_name: '伤感' },
  { id: 11, tag_name: '励志' },
  { id: 32, tag_name: '古筝' },
  { id: 27, tag_name: '吉他' },
  { id: 31, tag_name: '大提琴' },
])
const selectedTagIds = ref<number[]>([])

// 状态
const isUploading = ref(false)
const isSubmitting = ref(false)

// 获取已选择的标签名称
const getSelectedTagNames = () => {
  return selectedTagIds.value
    .map((tagId) => {
      const tag = tags.value.find((t) => t.id === tagId)
      return tag ? tag.tag_name : ''
    })
    .filter((name) => name)
}

// 切换标签选择（修复event未定义问题）
const toggleTag = (tagId: number, e: MouseEvent) => {
  const index = selectedTagIds.value.indexOf(tagId)
  if (index > -1) {
    selectedTagIds.value.splice(index, 1)
  } else {
    selectedTagIds.value.push(tagId)
  }
  tagError.value = ''
  e.preventDefault()
  e.stopPropagation()
  nextTick(() => {})
}

// 验证歌单名称
const validatePlaylistName = () => {
  const name = newPlaylistName.value.trim()
  if (!name) {
    newPlaylistNameError.value = '歌单名称不能为空'
    return false
  }
  if (name.length > 16) {
    newPlaylistNameError.value = '歌单名称不能超过16个字'
    return false
  }
  newPlaylistNameError.value = ''
  return true
}

// 验证歌单描述
const validatePlaylistDesc = () => {
  const desc = newPlaylistDesc.value.trim()
  if (!desc) {
    newPlaylistDescError.value = '歌单描述不能为空'
    return false
  }
  if (desc.length > 30) {
    newPlaylistDescError.value = '歌单描述不能超过30个字'
    return false
  }
  newPlaylistDescError.value = ''
  return true
}

// 验证标签选择
const validateTags = () => {
  if (selectedTagIds.value.length === 0) {
    tagError.value = '至少选择一个歌单标签'
    return false
  }
  tagError.value = ''
  return true
}

// 移除封面
const handleRemoveCover = () => {
  newPlaylistCover.value = ''
  if (props.editPlaylist) {
    props.editPlaylist.cover = ''
  }
  coverFile.value = null
  ElMessage.info('封面已移除')
}

// 处理图片上传（添加类型定义）

// 替换原来的 UploadOptions 接口定义
const handleUpload = async (options: UploadRequestOptions) => {
  const { file, onError, onSuccess } = options

  coverFile.value = file
  isUploading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      newPlaylistCover.value = reader.result as string
      isUploading.value = false
      onSuccess(null) // 成功时调用 onSuccess
      ElMessage.success('封面上传成功')
    }
    reader.onerror = () => {
      isUploading.value = false
      coverFile.value = null // 失败时调用 onError
      ElMessage.error('图片读取失败，请重试')
    }
  } catch (error) {
    isUploading.value = false
    coverFile.value = null
    ElMessage.error('封面上传失败，请稍后重试')
  }
}
// 重置表单
const resetForm = () => {
  newPlaylistName.value = ''
  newPlaylistDesc.value = ''
  playlistPrivacy.value = 'public'
  newPlaylistCover.value = ''
  coverFile.value = null
  newPlaylistNameError.value = ''
  newPlaylistDescError.value = ''
  tagError.value = ''
  selectedTagIds.value = []
  isUploading.value = false
  isSubmitting.value = false
}

// 重置并关闭弹窗
const resetAndClose = () => {
  resetForm()
  emit('update:isDialogOpen', false)
}

// 监听弹窗打开/编辑数据变化
watch(
  () => [props.isDialogOpen, props.isEditMode, props.editPlaylist],
  ([isOpen, isEditMode, editPlaylist]) => {
    if (isOpen && isEditMode && editPlaylist) {
      // 编辑模式：回显数据
      newPlaylistName.value = (editPlaylist as PlaylistVO)?.name || ''
      newPlaylistDesc.value = (editPlaylist as PlaylistVO)?.description || ''
      playlistPrivacy.value = (editPlaylist as PlaylistVO)?.isPublic === 1 ? 'public' : 'private'
      selectedTagIds.value = (editPlaylist as PlaylistVO)?.tagIds ?? []
      newPlaylistCover.value = (editPlaylist as PlaylistVO).cover || ''
      coverFile.value = null

      // 聚焦名称输入框
      setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        input?.focus()
      }, 100)
    } else if (isOpen && !isEditMode) {
      // 创建模式：重置表单
      resetForm()
      selectedTagIds.value = [8]
    }
  },
  { deep: true, immediate: true },
)

// 创建歌单
const createNewPlaylist = async () => {
  const isNameValid = validatePlaylistName()
  const isDescValid = validatePlaylistDesc()
  const isTagsValid = validateTags()
  const hasCover = !!coverFile.value
  console.log(111)
  if (!hasCover) {
    ElMessage.error('请上传歌单封面')
    return
  }

  if (!isNameValid || !isDescValid || !isTagsValid) {
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('name', newPlaylistName.value.trim())
    formData.append('description', newPlaylistDesc.value.trim())
    formData.append('coverFile', coverFile.value!)
    selectedTagIds.value.forEach((tagId, index) => {
      formData.append(`tagIds[${index}]`, tagId.toString())
    })
    formData.append('isPublic', playlistPrivacy.value === 'public' ? '1' : '0')

    emit('create-success', formData)
    resetAndClose()
    ElMessage.success('歌单创建成功')
  } catch (error) {
    console.error('创建歌单失败:', error)
    ElMessage.error('创建失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 更新歌单逻辑
const updatePlaylist = async () => {
  const isNameValid = validatePlaylistName()
  const isDescValid = validatePlaylistDesc()
  const isTagsValid = validateTags()
  console.log('isNameValid:', isNameValid)
  console.log('isDescValid:', isDescValid)
  console.log('isTagsValid:', isTagsValid)
  if (!isNameValid || !isDescValid || !isTagsValid) {
    return
  }

  if (!props.editPlaylist?.id) {
    ElMessage.error('歌单ID不存在，无法修改')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('id', props.editPlaylist.id.toString())
    formData.append('name', newPlaylistName.value.trim())
    formData.append('description', newPlaylistDesc.value.trim())
    formData.append('coverFile', newPlaylistCover.value)
    formData.append('isPublic', playlistPrivacy.value === 'public' ? '1' : '0')
    selectedTagIds.value.forEach((tagId, index) => {
      formData.append(`tagIds[${index}]`, tagId.toString())
    })
    console.log(333)
    if (coverFile.value) {
      formData.append('coverFile', coverFile.value)
    }

    emit('update-success', formData, props.editPlaylist.id)
    resetAndClose()
    ElMessage.success('歌单修改成功')
  } catch (error) {
    console.error('更新歌单失败:', error)
    ElMessage.error('修改失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 自定义滚动条 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* 滚动阴影 */
.scroll-shadow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #1e1e1e 90%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-shadow:hover {
  opacity: 1;
}

/* 标签样式 */
.tag-section button[type='button'] {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.tag-section button[type='button']:hover {
  transform: translateY(-1px);
}

.tag-section button[type='button']:active {
  transform: translateY(0);
}

/* 输入框和文本域样式 */
input,
textarea {
  appearance: none;
  -webkit-appearance: none;
  background: #121212;
}

input:focus,
textarea:focus {
  box-shadow: 0 0 0 2px rgba(255, 46, 147, 0.2);
}

/* 禁用状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 上传区域 */
.cover-upload:hover :deep(.el-upload) {
  border-color: #ff2e93;
}

/* 选中标签样式 */
.bg-\[\#FF2E93\] {
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 46, 147, 0.3);
}

.bg-\[\#FF2E93\]:hover {
  background-color: rgba(255, 46, 147, 0.9) !important;
}

/* 固定布局的关键样式 */
.flex-col {
  display: flex;
  flex-direction: column;
}

.shrink-0 {
  flex-shrink: 0;
}

.flex-1 {
  flex: 1 1 0%;
}

.min-h-0 {
  min-height: 0;
}

/* 修复弹窗内部滚动 */
.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 确保内容不会超出 */
.max-h-40 {
  max-height: 10rem; /* 160px */
}

.whitespace-nowrap {
  white-space: nowrap;
}
</style>
