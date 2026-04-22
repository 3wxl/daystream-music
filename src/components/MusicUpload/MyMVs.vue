<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">我的MV</h2>
      <button
        @click="showCreateMvDialog = true"
        class="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-500/10 transition-colors"
      >
        <i class="fa fa-plus mr-1"></i> 新建MV
      </button>
    </div>

    <div v-if="mvs.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="mv in mvs" :key="mv.id" class="group relative">
        <div
          class="aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3 relative cursor-pointer"
        >
          <img
            :src="mv.coverUrl || '/default-cover.png'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          <div
            class="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500/80 transition-colors mr-2"
              @click.stop="handleSetting(mv)"
            >
              <i class="fa fa-cog text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-red-500/80 transition-colors"
              @click.stop="handleDelete(mv.id)"
            >
              <i class="fa fa-trash text-xs"></i>
            </button>
          </div>
          <!-- 播放图标 -->
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            <i class="fa fa-play-circle text-4xl text-white/80"></i>
          </div>
        </div>
        <h3 class="font-medium text-sm truncate">{{ mv.musicName }}</h3>
        <p class="text-xs text-gray-500 mt-1 truncate">{{ mv.description || '暂无描述' }}</p>
      </div>
    </div>
    <el-empty v-else description="暂无MV作品" :image-size="100"></el-empty>

    <!-- 创建MV对话框 -->
    <el-dialog
      v-model="showCreateMvDialog"
      title="上传新MV"
      width="600px"
      custom-class="dark-dialog"
      :close-on-click-modal="!isUploading"
      :show-close="!isUploading"
    >
      <el-form ref="createMvFormRef" :model="mvForm" :rules="mvUploadRule" label-position="top">
        <el-form-item label="MV标题" prop="title">
          <el-input placeholder="请输入MV标题" class="dark-input" v-model="mvForm.title" />
        </el-form-item>

        <el-form-item label="关联我的音乐 (必填)" prop="musicId">
          <el-select v-model="mvForm.musicId" @change="handleSongSelect">
            <el-option
              v-for="song in mySongs"
              :key="song.id"
              :label="song.musicName"
              :value="song.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="MV描述" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入MV描述"
            class="dark-input"
            v-model="mvForm.description"
          />
        </el-form-item>

        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="MV封面">
            <div class="flex items-center gap-4">
              <div
                class="w-32 h-20 rounded border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-pink-500/50 bg-[#0f1014]"
                @click="triggerCoverSelect"
              >
                <img
                  v-if="coverPreview"
                  :src="coverPreview"
                  class="w-full h-full object-cover rounded"
                />
                <i v-else class="fa fa-image text-gray-500 text-xl"></i>
              </div>
              <input
                type="file"
                ref="coverInput"
                class="hidden"
                accept="image/*"
                @change="onCoverChange"
              />
              <div class="text-xs text-gray-500">
                <p>点击选择封面</p>
                <p class="mt-1">比例 16:9 效果最佳</p>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="VIP 专属">
            <el-radio-group v-model="mvForm.isVip" class="custom-radio">
              <el-radio :label="0" border>免费</el-radio>
              <el-radio :label="1" border>VIP</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item label="上架状态">
          <el-switch
            v-model="mvForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="立即上架"
            inactive-text="下架暂存"
          />
        </el-form-item>

        <!-- 视频文件选择区域 -->
        <div class="form-item mb-4">
          <label class="el-form-item__label">选择视频</label>
          <div
            class="file-select p-4 border border-dashed border-gray-600 rounded-lg hover:border-pink-500 transition-colors bg-[#0f1014]"
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="video/*"
              style="display: none"
            />
            <div class="flex items-center gap-4">
              <button
                @click.prevent="selectFile"
                class="select-btn px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              >
                <i class="fa fa-folder-open mr-2"></i>
                {{ selectedFile ? '重新选择' : '选择视频文件' }}
              </button>
              <div v-if="selectedFile" class="flex flex-col">
                <span class="text-sm text-pink-500 font-medium">{{ selectedFile.name }}</span>
                <span class="text-xs text-gray-500">
                  ({{ formatFileSize(selectedFile.size) }})
                </span>
              </div>
              <span v-else class="text-xs text-gray-500">支持 mp4, mkv, webm 等格式</span>
            </div>
          </div>
        </div>

        <!-- 上传进度显示 -->
        <div
          v-if="showProgress"
          class="progress-area bg-[#0f1014] p-4 rounded-lg mb-4 border border-gray-700"
        >
          <h3 class="text-sm font-medium mb-3 text-gray-300">上传进度</h3>

          <!-- 总进度 -->
          <div class="progress-bar h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
            <div
              class="progress-fill h-full bg-linear-to-r from-pink-500 to-orange-400 transition-all duration-300"
              :style="{ width: totalProgress + '%' }"
            ></div>
          </div>
          <div class="progress-text text-right text-xs text-pink-400 mb-3">
            总进度：{{ totalProgress }}%
          </div>

          <!-- 分片进度信息 -->
          <div class="chunk-info grid grid-cols-3 gap-2 text-xs text-gray-400 mb-3">
            <div>
              当前分片：<span class="text-white">{{ currentChunk }}/{{ totalChunks }}</span>
            </div>
            <div>
              上传速度：<span class="text-white">{{ uploadSpeed }}</span>
            </div>
            <div>
              已用时间：<span class="text-white">{{ elapsedTime }}</span>
            </div>
          </div>

          <!-- 详细状态 -->
          <div class="status-area max-h-24 overflow-y-auto custom-scrollbar text-xs space-y-1">
            <div
              v-for="(status, index) in uploadStatus"
              :key="index"
              class="status-item px-2 py-1 rounded"
              :class="getStatusClass(status.type)"
            >
              {{ status.text }}
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer flex justify-end gap-3">
          <el-button
            v-if="!isUploading"
            @click="showCreateMvDialog = false"
            class="bg-transparent! border-gray-600! text-gray-300! hover:border-gray-500! hover:text-white!"
          >
            取消
          </el-button>

          <el-button
            v-if="!isUploading"
            type="primary"
            @click="handleCreateMV"
            :disabled="!canUpload"
            class="bg-pink-600! border-pink-600! hover:bg-pink-500!"
          >
            {{ uploadBtnText }}
          </el-button>

          <!-- 取消上传按钮 -->
          <el-button v-if="isUploading" @click="cancelUpload" type="danger" plain>
            取消上传
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { useUploadtRules } from '@/utils/rules/upload'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref, watch } from 'vue'

import { getMyMusicList } from '@/api/music'
import {
  deleteMv,
  getMyMvList,
} from '@/api/mv'
import { useMvUpload } from '@/composables/useMvUpload'




const { mvUploadRule } = useUploadtRules()

// 数据定义
const showCreateMvDialog = ref(false)
const userStore = useUserStore()
const fileInput = ref<HTMLInputElement>()
const coverInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const coverPreview = ref('')

const {
  totalProgress,
  uploadStatus,
  isUploading,
  showProgress,
  currentChunk,
  totalChunks,
  uploadSpeed,
  elapsedTime,
  startUpload,
  cancelUpload,
  formatFileSize
} = useMvUpload()
// 模拟MV数据列表
const mvs = ref<any[]>([])

// 表单数据
const mvForm = reactive({
  title: '',
  description: '',
  isVip: 0,
  status: 1,
  coverUrl: '',
  musicId: '' as string | number, // 初始化为选中的音乐ID
})

const createMvFormRef = ref<FormInstance | null>(null)

const mySongs = ref<any[]>([])
const loadingSongs = ref(false)


// 计算属性
const canUpload = computed(() => {
  return mvForm.title && selectedFile.value && !isUploading.value
})

const uploadBtnText = computed(() => {
  if (isUploading.value) return '上传中...'
  return '开始上传'
})

// 状态样式
const getStatusClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-400 bg-green-400/10'
    case 'error':
      return 'text-red-400 bg-red-400/10'
    case 'info':
      return 'text-blue-400 bg-blue-400/10'
    default:
      return 'text-gray-400'
  }
}


// 重置表单
const resetForm = () => {
  mvForm.title = ''
  mvForm.description = ''
  mvForm.isVip = 0
  mvForm.status = 1
  mvForm.coverUrl = ''
  selectedFile.value = null
  coverFile.value = null
  coverPreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
  if (coverInput.value) coverInput.value.value = ''
  showProgress.value = false
  totalProgress.value = 0
  uploadStatus.value = []
}

const triggerCoverSelect = () => {
  coverInput.value?.click()
}

const onCoverChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

// 获取我的音频列表以供关联
const fetchMySongs = async () => {
  loadingSongs.value = true
  try {
    const res: any = await getMyMusicList(userStore.userInfo.id, 1, 100)
    if (res.success && res.data?.records) {
      // 如果后端返回的是 [[{...}]] 嵌套数组，则需要扁平化
      mySongs.value = res.data.records.flat()
    }
  } catch (error) {
    console.error('获取歌曲列表失败:', error)
  } finally {
    loadingSongs.value = false
  }
}

// 处理歌曲选择变化
const handleSongSelect = (val: any) => {
  const selected = mySongs.value.find((s) => s.id === val)
  console.log('--- 选中关联歌曲信息 ---', {
    musicId: val,
    musicName: selected?.musicName,
    musicianName: selected?.musicianName,
    albumName: selected?.albumName,
  })
}

// 交互方法
const selectFile = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    // 自动填充标题如果为空
    if (!mvForm.title) {
      // 移除扩展名
      mvForm.title = selectedFile.value.name.replace(/\.[^/.]+$/, '')
    }
    // 重置进度状态
    showProgress.value = false
    totalProgress.value = 0
    uploadStatus.value = []

    // 获取视频时长
    if (selectedFile.value) {
      getVideoDuration(selectedFile.value)
    }
  }
}

// 获取视频时长
const videoDuration = ref(0)
const getVideoDuration = (file: File) => {
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    videoDuration.value = Math.floor(video.duration)
  }
  video.src = URL.createObjectURL(file)
}



// ========== MV列表管理 ==========
const handleSetting = (mv: any) => {
  console.log('配置 MV', mv)
  ElMessage.info('设置功能开发中...')
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个MV吗？', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })

    // 调用删除API
    await deleteMv(id)
    ElMessage.success('删除成功')
    getMvList()
  } catch {
    // 用户取消删除
  }
}

const getMvList = async () => {
  try {
    const res = await getMyMvList(1, 40)
    if (res.success && res.data?.records) {
      // 使用 flat() 适配可能存在的嵌套结构并渲染
      mvs.value = res.data.records.flat()
    }
  } catch (error) {
    console.error('获取MV列表失败:', error)
  }
}

const handleCreateMV = () => {
  if(!selectedFile.value) {
    ElMessage.warning('请选择要上传的MV文件')
    return
  }
  startUpload(
    createMvFormRef.value,
    mvForm,  
    selectedFile.value,
    coverFile.value,
    videoDuration.value,
    ()=>{
      showCreateMvDialog.value = false
      resetForm()
      getMvList()
    }
  )
}

onMounted(() => {
  getMvList()
  fetchMySongs()
})

watch(showCreateMvDialog, (val) => {
  if (!val && !isUploading.value) {
    // 弹窗关闭，且不再上传过程中，清空表单
    resetForm()
  }
})
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

:deep(.el-upload-dragger) {
  background-color: transparent;
  border: none;
}
</style>
