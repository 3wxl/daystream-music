import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  createMv as createMvApi,
  getImageUrl,
  mergeChunks as mergeChunksApi,
  uploadChunk,
  validateChunk,
} from '@/api/mv'

export function useMvUpload() {
  // 数据定义
  const isCalculating = ref(false) //添加：是否正在计算md5
  const isUploading = ref(false)

  // 上传进度相关
  const cancelTokenSource = ref<AbortController | null>(null)
  const chunkSize = 5 * 1024 * 1024 // 每个分片5MB
  const uploadStartTime = ref<number>(0) // 上传开始时间
  const uploadedChunks = ref(0) // 已上传分片数
  const fileMd5 = ref('') // 文件MD5值

  // 进度相关数据
  const showProgress = ref(false)
  const totalProgress = ref(0)
  const currentChunk = ref(0)
  const totalChunks = ref(0)
  const uploadSpeed = ref('0 KB/s')
  const elapsedTime = ref('00:00:00')
  const uploadStatus = ref<Array<{ text: string; type: string }>>([])

  // 添加状态日志
  const addStatusLog = (text: string, type: string = 'normal') => {
    const time = new Date().toTimeString().split(' ')[0]
    uploadStatus.value.unshift({ text: `[${time}]${text}`, type })
    // 只保留最新的20条状态
    if (uploadStatus.value.length > 20) {
      uploadStatus.value = uploadStatus.value.slice(0, 20)
    }
  }

  // 更新进度
  const updateProgress = () => {
    if (totalChunks.value > 0) {
      const progress = Math.round((uploadedChunks.value / totalChunks.value) * 100)
      totalProgress.value = progress
      elapsedTime.value = calculateElapsedTime()
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

  // 工具方法：格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // ========== 核心上传方法 ==========
  // 1. 计算文件MD5
  const calculateFileMD5 = (file: File, workerInstance: Worker): Promise<string> => {
    return new Promise((resolve, reject) => {
      isCalculating.value = true
      addStatusLog('开始计算文件MD5...', 'calculating')
      addStatusLog(`文件大小: ${formatFileSize(file.size)}`, 'info')
      const handler = (e) => {
        const { type, hash, taskType, percent } = e.data
        if (taskType === 'FULL_FILE') {
          if (type === 'DONE') {
            isCalculating.value = false
            addStatusLog(`文件MD5计算完成: ${hash}`, 'success')
            workerInstance.removeEventListener('message', handler)
            resolve(hash)
          } else if (type === 'PROGRESS') {
            totalProgress.value = percent
            addStatusLog(`计算文件MD5：${percent}%`)
          } else if (type === 'ERROR') {
            isCalculating.value = false
            addStatusLog(`计算文件MD5失败: ${e.data.error}`, 'error')
            workerInstance.removeEventListener('message', handler)
            reject(new Error(e.data.error))
          }
        }
      }

      // 处理worker线程本身的崩溃
      workerInstance.onerror = (error) => {
        reject(new Error('Worker 线程内部崩溃'))
      }
      workerInstance.addEventListener('message', handler)

      workerInstance.postMessage({ file, type: 'FULL_FILE' })
    })
  }

  // 2. 计算分片MD5
  const calculateChunkMD5 = (chunk: Blob, workerInstance: Worker): Promise<string> => {
    return new Promise((resolve, reject) => {
      const handler = (e) => {
        if (e.data.taskType === 'CHUNK' && e.data.type === 'DONE') {
          resolve(e.data.hash)
          workerInstance.removeEventListener('message', handler)
        } else if (e.data.type === 'ERROR') {
          isCalculating.value = false
          addStatusLog(`计算文件MD5失败: ${e.data.error}`, 'error')
          workerInstance.removeEventListener('message', handler)
          reject(new Error(e.data.error))
        }
      }
      workerInstance.onerror = (error) => {
        reject(new Error('Worker 线程内部崩溃'))
      }
      workerInstance.addEventListener('message', handler)
      workerInstance.postMessage({ chunk, type: 'CHUNK' })
    })
  }

  // 3. 检查分片是否已存在
  const checkChunkExists = async (chunkIndex: number, chunkMd5: string) => {
    try {
      addStatusLog(`检查分片 ${chunkIndex + 1}/${totalChunks.value} 是否已存在...`, 'info')

      const res = await validateChunk(fileMd5.value, chunkIndex.toString(), chunkMd5)

      // res.success 只是表示请求成功，res.data 返回的分片是否存在的结果
      return res.data as boolean
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
    workerInstance: Worker,
  ): Promise<boolean> => {
    if (retryCount >= 3) {
      throw new Error(`分片 ${chunkIndex + 1} 上传失败，已达最大重试次数`)
    }

    try {
      // 计算分片MD5
      const chunkMd5 = await calculateChunkMD5(chunkData, workerInstance)
      addStatusLog(`分片 ${chunkIndex + 1}: MD5 = ${chunkMd5}`, 'info')

      // 检查分片是否已上传
      const exists = await checkChunkExists(chunkIndex, chunkMd5)
      if (exists) {
        addStatusLog(`分片 ${chunkIndex + 1} 已存在，跳过上传`, 'warning')
        uploadedChunks.value++
        updateProgress()
        return true
      }

      // 计算分片在文件中的位置
      const start = chunkIndex * chunkSize
      const end = Math.min(start + chunkSize, file.size)

      // 创建FormData
      const formData = new FormData()
      formData.append('file', chunkData, (chunkIndex + 1).toString()) // 改为使用索引作为文件名，防止后端覆盖
      // formData.append('file', chunkData, file.name) // 分片文件 (注意key变为file)
      formData.append('md5Value', fileMd5.value)
      formData.append('chunk', chunkIndex.toString())
      formData.append('chunks', totalChunks.value.toString())
      formData.append('start', start.toString())
      formData.append('end', end.toString())
      formData.append('size', file.size.toString())
      formData.append('chunkMd5', chunkMd5)
      formData.append('originalFilename', file.name)
      formData.append('operation', 'upload')

      addStatusLog(`开始上传分片 ${chunkIndex + 1}/${totalChunks.value}...`, 'info')

      // 调试---------------打印 FormData 内容
      console.log(`--- 分片 ${chunkIndex + 1} 上传数据检查 ---`)
      formData.forEach((value, key) => {
        if (value instanceof Blob) {
          console.log(`${key}: [Blob] size=${value.size}, name=${(value as any).name || 'n/a'}`)
        } else {
          console.log(`${key}: ${value}`)
        }
      })

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
        return uploadSingleChunk(file, chunkIndex, chunkData, retryCount + 1, workerInstance)
      } else {
        throw error
      }
    }
  }

  // 5. 合并分片文件
  const mergeChunks = async (file: File): Promise<string> => {
    try {
      addStatusLog('开始合并分片文件...', 'info')

      const formData = new FormData()
      formData.append('md5Value', fileMd5.value)
      formData.append('originalFilename', file.name)
      formData.append('chunks', totalChunks.value.toString())
      formData.append('size', file.size.toString())
      formData.append('operation', 'merge')

      // 【调试日志】打印 FormData 内容
      console.log('--- 合并分片数据检查 ---')
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`)
      })

      const res = await mergeChunksApi(formData)

      addStatusLog('分片合并成功', 'success')
      return (res.data as string) || '' // 返回文件路径
    } catch (error) {
      console.error('合并分片失败:', error)
      addStatusLog('分片合并失败', 'error')
      throw error
    }
  }

  // 6. 创建MV记录
  const createMvRecord = async (filePath: string,mvForm:any,videoDuration:number,file:File) => {
    try {
      addStatusLog('正在创建MV记录...', 'info')

      const payload = {
        mvName: mvForm.title,
        musicId: mvForm.musicId, // 保持为字符串，防止大整数精度丢失（强制类型转换会丢失精度）
        duration: videoDuration || 0,
        coverUrl: mvForm.coverUrl || '', // 如果封面已通过其他途径上传，这里是URL
        releaseTime: new Date().toISOString(), // 对应后端 releaseTime: "string"
        isVip: mvForm.isVip,
        status: mvForm.status,
        qualityList: [
          {
            qualityType: 2, // 对应后端 qualityType: 2 (高清720P)
            mvUrl: filePath, // 合并接口返回的文件路径
            fileSize: file.size || 0,
            isVipLimit: 0,
          },
        ],
      }

      // 打印最终发往后端的创建参数
      console.log('--- [重要] MV创建提交参数对照 ---')
      console.log('请求路径: POST /mv/create')
      console.log('参数内容:', JSON.stringify(payload, null, 2))

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
  const startUpload = async (
    formRef:FormInstance | undefined,
    mvForm: any,
    selectedFile:File,
    coverFile:File | null,
    videoDuration:number,
    onSuccess:()=>void
  ) => {
    if (!formRef || !selectedFile) return

    await formRef.validate(async (valid) => {
      if (!valid) return
      const myWorker = new Worker(new URL('../utils/workers/hashWorker.ts', import.meta.url), { type: 'module' })

      // 初始化上传状态
      isUploading.value = true
      showProgress.value = true
      uploadStartTime.value = Date.now()
      uploadedChunks.value = 0
      totalProgress.value = 0
      uploadStatus.value = []
      cancelTokenSource.value = new AbortController()

      try {
        const file = selectedFile
        addStatusLog('=== 开始上传MV ===', 'info')
        addStatusLog(`文件: ${file.name}`, 'info')
        addStatusLog(`大小: ${formatFileSize(file.size)}`, 'info')

        // 步骤1：如果选择了封面文件，先将其上传至服务器换取 URL
        if (coverFile) {
          addStatusLog('步骤1：正在上传封面图...', 'info')
          const imgFd = new FormData()
          imgFd.append('multipartFile', coverFile)
          try {
            const imgRes = await getImageUrl(imgFd)
            if (imgRes.success && imgRes.data) {
              console.log(imgRes.data)
              mvForm.coverUrl = imgRes.data
              addStatusLog('封面图上传完成', 'success')
            } else {
              throw new Error('封面图服务返回错误')
            }
          } catch (e) {
            throw new Error('封面上传失败，请重试')
          }
        }

        // 步骤2: 计算文件MD5
        addStatusLog('步骤2: 计算文件MD5...', 'info')
        try {
          fileMd5.value = await calculateFileMD5(file, myWorker)
        } catch (error) {
          addStatusLog(`计算文件MD5失败: ${(error as Error).message}`, 'error')
          throw error
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

          await uploadSingleChunk(file, i, chunk, 0, myWorker)
        }

        // 步骤4: 合并分片
        addStatusLog('步骤4: 合并分片文件...', 'info')
        const filePath = await mergeChunks(file)

        // 步骤5: 创建MV记录
        addStatusLog('步骤5: 创建MV记录...', 'info')
        await createMvRecord(filePath,mvForm,videoDuration,file)

        // 上传成功
        addStatusLog('🎉 MV上传成功！', 'success')
        ElMessage.success('MV上传成功！')
        myWorker.terminate()

        onSuccess()
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
        myWorker.terminate()
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

  return {
    totalProgress,
    uploadSpeed,
    uploadStatus,
    isUploading,
    isCalculating,
    showProgress,
    currentChunk,
    totalChunks,
    elapsedTime,
    startUpload,
    cancelUpload,
    formatFileSize,
  }
}
