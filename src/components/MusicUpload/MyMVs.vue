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
      <el-form ref="createMvFormRef" :model="mvForm" label-position="top">
        <el-form-item
          label="MV标题"
          prop="title"
          :rules="[{ required: true, message: '请输入MV标题', trigger: 'blur' }]"
        >
          <el-input placeholder="请输入MV标题" class="dark-input" v-model="mvForm.title" />
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
            @click="startUpload"
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
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
// @ts-ignore
// @ts-ignore
import {
  createMv as createMvApi,
  deleteMv, // Use the new API
  getHotMv,
  mergeChunks as mergeChunksApi,
  uploadChunk,
  validateChunk,
} from '@/api/mv'
import SparkMD5 from 'spark-md5'

// 数据定义
const showCreateMvDialog = ref(false)
const createMvFormRef = ref<FormInstance>()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const isCalculating = ref(false) //添加：是否正在计算md5

// 上传进度相关
const cancelTokenSource = ref<AbortController | null>(null)
const uploadedChunks = ref(0) // 已上传分片数
const chunkSize = 5 * 1024 * 1024 // 每个分片5MB
const fileMd5 = ref('') // 文件MD5值
const uploadStartTime = ref<number>(0) // 上传开始时间

// 模拟MV数据列表
const mvs = ref<any[]>([])

// 表单数据
const mvForm = reactive({
  title: '',
  description: '',
})

// 进度相关数据
const showProgress = ref(false)
const totalProgress = ref(0)
const currentChunk = ref(0)
const totalChunks = ref(0)
const uploadSpeed = ref('0 KB/s')
const elapsedTime = ref('00:00:00')
const uploadStatus = ref<Array<{ text: string; type: string }>>([])

// 计算属性
const canUpload = computed(() => {
  return mvForm.title && selectedFile.value && !isUploading.value
})

const uploadBtnText = computed(() => {
  if (isUploading.value) return '上传中...'
  return '开始上传'
})

// 工具方法：格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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

// 添加状态日志
const addStatusLog = (text: string, type: string = 'normal') => {
  // 这是在干什么
  const time = new Date().toTimeString().split(' ')[0]
  uploadStatus.value.unshift({ text: `[${time}]${text}`, type })
  // 只保留最新的20条状态
  if (uploadStatus.value.length > 20) {
    uploadStatus.value = uploadStatus.value.slice(0, 20)
  }
}

// 计算已用时间
const calculateElapsedTime = () => {
  if (!uploadStartTime.value) return '00:00:00'
  const seconds = Math.floor((Date.now() - uploadStartTime.value) / 1000)
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 更新进度
const updateProgress = () => {
  if (totalChunks.value > 0) {
    const progress = Math.round((uploadedChunks.value / totalChunks.value) * 100)
    totalProgress.value = progress
    elapsedTime.value = calculateElapsedTime()
  }
}

// 重置表单
const resetForm = () => {
  mvForm.title = ''
  mvForm.description = ''
  selectedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
  showProgress.value = false
  totalProgress.value = 0
  uploadStatus.value = []
  fileMd5.value = ''
  uploadedChunks.value = 0
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

// ========== 核心上传方法 ==========
// 1. 计算文件MD5
const calculateFileMD5 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    isCalculating.value = true
    addStatusLog('开始计算文件MD5...', 'calculating')
    addStatusLog(`文件大小: ${formatFileSize(file.size)}`, 'info')

    const chunkSize = 2 * 1024 * 1024 // 每次读取2MB计算MD5
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = (e) => {
      if (!e.target?.result) return
      spark.append(e.target.result as ArrayBuffer)
      currentChunk++

      // 更新计算进度
      const progress = Math.round((currentChunk / chunks) * 100)
      totalProgress.value = progress
      addStatusLog(`计算文件MD5: ${progress}% (${currentChunk}/${chunks})`, 'calculating')

      if (currentChunk < chunks) {
        // 继续读取下一块
        const start = currentChunk * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)
        fileReader.readAsArrayBuffer(chunk)
      } else {
        // 计算完成
        const md5 = spark.end()
        isCalculating.value = false
        addStatusLog(`文件MD5计算完成: ${md5}`, 'success')
        resolve(md5)
      }
    }

    fileReader.onerror = () => {
      isCalculating.value = false
      addStatusLog('文件读取失败', 'error')
      resolve('')
    }

    // 开始读取第一块
    const firstChunk = file.slice(0, Math.min(chunkSize, file.size))
    fileReader.readAsArrayBuffer(firstChunk)
  })
}

// 2. 计算分片MD5
const calculateChunkMD5 = (chunk: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(e.target?.result as ArrayBuffer)
      resolve(spark.end())
    }
    reader.readAsArrayBuffer(chunk)
  })
}

// 3. 检查分片是否已存在
const checkChunkExists = async (chunkIndex: string, chunkMd5: string) => {
  try {
    addStatusLog(`检查分片 ${chunkIndex + 1}/${totalChunks.value} 是否已存在...`, 'info')

    const res = await validateChunk(fileMd5.value, chunkIndex, chunkMd5)

    return res.success // 返回true表示分片已存在
  } catch (error) {
    console.error('检查分片失败:', error)
    addStatusLog(`检查分片 ${chunkIndex + 1} 失败`, 'warning')
    return false
  }
}

// 4. 上传单个分片
const uploadSingleChunk = async (
  file: File,
  chunkIndex: number,
  chunkData: Blob,
  retryCount = 0,
): Promise<boolean> => {
  if (retryCount >= 3) {
    throw new Error(`分片 ${chunkIndex + 1} 上传失败，已达最大重试次数`)
  }

  try {
    // 计算分片MD5
    const chunkMd5 = await calculateChunkMD5(chunkData)
    addStatusLog(`分片 ${chunkIndex + 1}: MD5 = ${chunkMd5}`, 'info')

    // 检查分片是否已上传
    const exists = await checkChunkExists(chunkIndex, chunkMd5)
    if (exists) {
      addStatusLog(`分片 ${chunkIndex + 1} 已存在，跳过上传`, 'warning')
      uploadedChunks.value++
      updateProgress()
      return true
    }

    // 创建FormData
    const formData = new FormData()
    formData.append('multipartFile', chunkData, file.name) // 分片文件
    formData.append('fileMd5', fileMd5.value) // 整个文件的MD5
    formData.append('chunkMd5', chunkMd5) // 分片的MD5
    formData.append('chunk', chunkIndex.toString()) // 分片编号
    formData.append('chunks', totalChunks.value.toString()) // 总分片数
    formData.append('originalFilename', file.name) // 原始文件名
    formData.append('operation', 'upload') // 操作类型

    // 计算分片在文件中的位置
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    formData.append('start', start.toString())
    formData.append('end', end.toString())
    formData.append('size', file.size.toString())

    addStatusLog(`开始上传分片 ${chunkIndex + 1}/${totalChunks.value}...`, 'info')

    // 上传分片
    const startTime = Date.now()

    // 注意：request工具通常已经处理了data.success判断，如果失败会抛错或返回错误结构
    // 这里假设request返回的是response.data
    const res = await uploadChunk(formData)

    // 计算上传速度
    const elapsed = (Date.now() - startTime) / 1000
    if (elapsed > 0) {
      const uploadedMB = chunkData.size / 1024 / 1024
      const speed = (uploadedMB / elapsed).toFixed(2)
      uploadSpeed.value = `${speed} MB/s`
    }

    uploadedChunks.value++
    updateProgress()
    addStatusLog(`分片 ${chunkIndex + 1} 上传成功`, 'success')
    return true
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw error // 取消上传
    }

    addStatusLog(`分片 ${chunkIndex + 1} 上传失败，第${retryCount + 1}次重试...`, 'error')

    if (retryCount < 2) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)))
      return uploadSingleChunk(file, chunkIndex, chunkData, retryCount + 1)
    } else {
      throw error
    }
  }
}

// 5. 合并分片文件
const mergeChunks = async (): Promise<string> => {
  try {
    addStatusLog('开始合并分片文件...', 'info')

    const res = await mergeChunksApi(fileMd5.value, selectedFile.value?.name || '')

    addStatusLog('分片合并成功', 'success')
    return (res.data as string) || '' // 返回文件路径
  } catch (error) {
    console.error('合并分片失败:', error)
    addStatusLog('分片合并失败', 'error')
    throw error
  }
}

// 6. 创建MV记录 (调用业务接口)
const createMvRecord = async (filePath: string) => {
  try {
    addStatusLog('正在创建MV记录...', 'info')

    const payload = {
      mvName: mvForm.title,
      musicId: null, // 暂时没有关联音乐的逻辑，传null或0
      duration: videoDuration.value || 0,
      coverUrl: '', // 暂时没有封面上传逻辑，传空或默认图
      isVip: 0, // 默认非VIP
      status: 1, // 默认上架
      qualityList: [
        {
          qualityType: 2, // 假设默认为 720P (2-高清720P)
          mvUrl: filePath, // 合并接口返回的文件路径/URL
          fileSize: selectedFile.value?.size || 0,
          isVipLimit: 0,
        },
      ],
    }

    const res = await createMvApi(payload)

    addStatusLog('MV记录创建成功', 'success')
    return res.data
  } catch (error) {
    console.error('创建MV记录失败:', error)
    addStatusLog('创建MV记录失败', 'error')
    throw error
  }
}

// 7. 主上传流程
const startUpload = async () => {
  if (!createMvFormRef.value || !selectedFile.value) return

  await createMvFormRef.value.validate(async (valid) => {
    if (!valid) return

    // 初始化上传状态
    isUploading.value = true
    showProgress.value = true
    uploadStartTime.value = Date.now()
    uploadedChunks.value = 0
    totalProgress.value = 0
    uploadStatus.value = []
    cancelTokenSource.value = new AbortController()

    try {
      const file = selectedFile.value!
      addStatusLog('=== 开始上传MV ===', 'info')
      addStatusLog(`文件: ${file.name}`, 'info')
      addStatusLog(`大小: ${formatFileSize(file.size)}`, 'info')

      // 步骤1: 计算文件MD5
      addStatusLog('步骤1: 计算文件MD5...', 'info')
      fileMd5.value = await calculateFileMD5(file)
      if (!fileMd5.value) {
        throw new Error('计算文件MD5失败')
      }

      // 步骤2: 计算总分片数
      totalChunks.value = Math.ceil(file.size / chunkSize)
      addStatusLog(`步骤2: 文件将被分为 ${totalChunks.value} 个分片`, 'info')

      // 步骤3: 逐个上传分片
      addStatusLog('步骤3: 开始上传分片...', 'info')

      for (let i = 0; i < totalChunks.value; i++) {
        if (!isUploading.value) {
          throw new Error('上传被取消')
        }

        currentChunk.value = i + 1

        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        await uploadSingleChunk(file, i, chunk)
      }

      // 步骤4: 合并分片
      addStatusLog('步骤4: 合并分片文件...', 'info')
      const filePath = await mergeChunks()

      // 步骤5: 创建MV记录
      addStatusLog('步骤5: 创建MV记录...', 'info')
      await createMvRecord(filePath)

      // 上传成功
      addStatusLog('🎉 MV上传成功！', 'success')
      ElMessage.success('MV上传成功！')

      showCreateMvDialog.value = false
      resetForm()
      getMvList()
    } catch (error) {
      if ((error as Error).message === '上传被取消') {
        addStatusLog('上传已取消', 'warning')
        ElMessage.warning('上传已取消')
      } else {
        console.error('上传失败:', error)
        addStatusLog('上传失败: ' + (error as Error).message, 'error')
        ElMessage.error('上传失败: ' + (error as Error).message)
      }
    } finally {
      isUploading.value = false
      isCalculating.value = false
    }
  })
}

// 8. 取消上传
const cancelUpload = () => {
  ElMessageBox.confirm('确定要取消上传吗？已上传的部分将不会保存。', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    isUploading.value = false
    isCalculating.value = false

    if (cancelTokenSource.value) {
      cancelTokenSource.value.abort()
      cancelTokenSource.value = null
    }

    addStatusLog('用户取消上传', 'warning')
  })
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
    const res = await getHotMv('1', '40')
    mvs.value = (res.data.records as any[]) || []

    if (mvs.value.length === 0) {
      // 没有任何MV时，保留一个示例方便展示 (可选)
      /* mvs.value = [
        { id: '1', title: '示例MV', description: '上传你的第一个MV吧！', cover: '' }
      ] */
    }
  } catch (error) {
    console.error('获取MV列表失败:', error)
  }
}

onMounted(() => {
  getMvList()
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
