<template>
  <div class="min-h-screen bg-white text-gray-800 py-8 px-4">
    <button
      @click="goBack"
      class="text-pink-500 hover:text-pink-700 transition-all duration-300 mb-4 pl-10 hover:scale-110 hover:-translate-x-1"
      aria-label="返回上一页"
    >
      <i class="iconfont" style="font-size: 24px"> &#xe64e; </i>
    </button>
    <div class="container mx-auto max-w-4xl">
      <!-- 步骤导航 -->
      <MusicianJoinSteps />

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarChange"
        />

        <!-- 头像上传 -->
        <!-- 父组件：删除冗余的v-model，只保留必要的单向传值+事件监听 -->
        <AvatarUpload
          v-model:avatar="formData.avatar"
          :uploading="uploading"
          v-model:isDragging="isDragging"
          @remove="removeAvatar"
          @trigger-file-input="triggerFileInput"
          @handle-avatar-change="handleAvatarChange"
        />

        <!-- 艺人名称 -->
        <ArtistNameInput v-model="formData.artistName" :error="errors.artistName" />

        <!-- 个人简介 -->
        <BioInput v-model="formData.bio" />

        <!-- 音乐人标签 -->
        <TagSelector v-model="formData.tags" :error="errors.tags" />

        <!-- 表单底部按钮 -->
        <FormActions :submitting="submitting" @reset="handleReset" @preview="handlePreview" />
      </form>

      <!-- 认证权益 -->
      <CertificationBenefits />

      <!-- 常见问题 -->
      <FAQ />
    </div>

    <!-- 预览弹窗 -->
    <PreviewModal
      :visible="showPreview"
      :avatar="formData.avatar"
      :artistName="formData.artistName"
      :bio="formData.bio"
      :tags="formData.tags"
      @close="showPreview = false"
      @confirm="handleSubmit"
    />

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="fixed bottom-6 right-6 z-50">
      <div
        class="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 shadow-2xl animate-slide-up"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <i class="iconfont icon-success text-white text-lg">&#xe752;</i>
          </div>
          <div>
            <p class="font-medium text-white">信息已保存！</p>
            <p class="text-sm text-white/90">艺人信息已成功更新</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { applyMusician, updateImage } from '@/api/personalCenter/musician/index'

const router = useRouter()

const goBack = () => {
  router.back()
}

const formData = reactive({
  avatar: '',
  artistName: '',
  bio: '',
  tags: [],
})
const uploading = ref(false)
const submitting = ref(false)
const showPreview = ref(false)
const showSuccess = ref(false)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const errors = reactive({
  artistName: '',
  tags: '',
  avatar: '',
})
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const uploadImage = async (file: File) => {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  try {
    uploading.value = true
    const form = new FormData()
    form.append('file', file)
    console.log('上传的文件:', form.get('file'))
    const res = await updateImage(form)
    console.log('图片上传结果:', res)
    if (res.success && res.data) {
      formData.avatar = res.data as string
      return true
    } else {
      ElMessage.error(res.errorMsg || '图片上传失败')
      return false
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败，请稍后重试')
    return false
  } finally {
    uploading.value = false
  }
}

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target || !target.files) return
  const file = target.files[0]
  if (!file) return

  selectedFile.value = file
  await uploadImage(file)
}

const removeAvatar = () => {
  formData.avatar = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const validateForm = () => {
  errors.artistName = ''
  errors.tags = ''
  errors.avatar = ''

  if (!formData.avatar) {
    errors.avatar = '请上传艺人头像'
    return false
  }

  if (!formData.artistName.trim()) {
    errors.artistName = '艺人名称不能为空'
    return false
  }

  if (formData.artistName.length < 2) {
    errors.artistName = '艺人名称至少需要2个字符'
    return false
  }

  if (formData.artistName.length > 30) {
    errors.artistName = '艺人名称不能超过30个字符'
    return false
  }

  if (formData.tags.length === 0) {
    errors.tags = '请至少选择一个音乐标签'
    return false
  }

  return true
}

const handlePreview = () => {
  if (validateForm()) {
    showPreview.value = true
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    const res = await applyMusician({
      stageName: formData.artistName,
      introduction: formData.bio,
      avatar: formData.avatar,
      tags: [...formData.tags],
    })
    console.log(res)
    ElMessage.success('申请提交成功')
    selectedFile.value = null
    Object.assign(formData, {
      artistName: '',
      bio: '',
      avatar: '',
      tags: [],
    })
  } catch (error) {
    const errorMessage = (error as Error).message
    if (
      !errorMessage.includes('您已经申请过申请，请耐心等待认证') &&
      !errorMessage.includes('用户名2-16位，请输入正确的用户名')
    ) {
      ElMessage.error('申请提交失败，请稍后重试')
    }
    console.error('申请失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  if (confirm('确定要重置所有信息吗？')) {
    formData.avatar = ''
    formData.artistName = ''
    formData.bio = ''
    formData.tags = []
    selectedFile.value = null
    errors.artistName = ''
    errors.tags = ''
    errors.avatar = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover\:shadow-lg:hover {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.text-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .flex-col-reverse {
    flex-direction: column-reverse;
  }
}
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
}
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #db2777);
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
.iconfont {
  font-family: 'iconfont' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<route lang="yaml">
meta:
  layout: empty
</route>
