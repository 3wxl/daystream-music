<template>
  <div class="min-h-screen bg-white text-gray-800 py-8 px-4">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-200 to-pink-400 mb-6 shadow-lg"
        >
          <i class="iconfont text-white text-2xl" style="font-size: 40px">&#xe671;</i>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">音乐人认证</h1>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          完成认证，解锁更多发行功能并建立您的专属音乐人档案
        </p>
      </div>
      <div class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200 to-pink-400 flex items-center justify-center shadow-md"
            >
              <span class="text-sm font-bold text-white">1</span>
            </div>
            <span class="font-medium text-gray-700">基本信息</span>
          </div>
          <div class="flex-1 h-1 mx-4 bg-gray-200">
            <div
              class="h-full w-1/3 bg-gradient-to-r from-purple-200 to-pink-400 rounded-full"
            ></div>
          </div>
          <div class="flex items-center space-x-2 text-gray-400">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span class="text-sm font-bold">2</span>
            </div>
            <span class="font-medium">音乐作品</span>
          </div>
          <div class="flex-1 h-1 mx-4 bg-gray-200"></div>
          <div class="flex items-center space-x-2 text-gray-400">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span class="text-sm font-bold">3</span>
            </div>
            <span class="font-medium">完成</span>
          </div>
        </div>
        <p class="text-sm text-gray-500 text-center">步骤 1/3 - 填写基本信息</p>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <div class="space-y-4">
          <label class="block text-lg font-semibold text-gray-900">
            <span class="flex items-center space-x-2">
              <span>艺人头像</span>
              <span
                class="text-xs bg-gradient-to-r from-purple-200 to-pink-400 text-white px-2 py-1 rounded-full"
                >必填</span
              >
            </span>
            <span class="text-sm text-gray-500 block mt-1"
              >推荐尺寸：1000x1000像素，支持 JPG、PNG 格式</span
            >
          </label>

          <div
            class="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8"
          >
            <div class="relative">
              <div
                class="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner"
                :class="{ 'border-purple-400 shadow-lg': isDragging }"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @drop.prevent="handleDrop"
              >
                <img
                  v-if="formData.avatar"
                  :src="formData.avatar"
                  alt="头像预览"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-center p-4">
                  <div
                    class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-3"
                  >
                    <i class="iconfont icon-image text-purple-300 text-2xl" style="font-size: 30px"
                      >&#xe63b;</i
                    >
                  </div>
                  <span class="text-sm text-gray-500">拖放图片到这里</span>
                </div>
                <div
                  v-if="uploading"
                  class="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm"
                >
                  <div class="text-center">
                    <i class="iconfont icon-loading text-purple-500 text-3xl animate-spin"></i>
                    <p class="text-sm text-gray-600 mt-2">上传中...</p>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2 mt-4 justify-center">
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-400 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center space-x-1"
                >
                  <i class="iconfont icon-upload text-sm"></i>
                  <span>选择文件</span>
                </button>
                <button
                  v-if="formData.avatar"
                  type="button"
                  @click="removeAvatar"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-1"
                >
                  <i class="iconfont icon-delete text-sm"></i>
                  <span>移除</span>
                </button>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
            </div>
            <div class="flex-1 max-w-md">
              <div
                class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 space-y-3 border border-purple-100"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"
                  >
                    <i class="iconfont icon-check-circle text-purple-500 text-sm">&#xe603;</i>
                  </div>
                  <span class="text-sm text-gray-700">使用高质量、清晰的图片</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"
                  >
                    <i class="iconfont icon-check-circle text-purple-500 text-sm">&#xe603;</i>
                  </div>
                  <span class="text-sm text-gray-700">正方形图片效果最佳</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"
                  >
                    <i class="iconfont icon-check-circle text-purple-500 text-sm">&#xe603;</i>
                  </div>
                  <span class="text-sm text-gray-700">文件大小不超过 5MB</span>
                </div>
              </div>
              <div
                v-if="selectedFile"
                class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
                    >
                      <i class="iconfont icon-image text-purple-500 text-base">&#xe6b5;</i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-800 truncate max-w-xs">
                        {{ selectedFile.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                      </p>
                    </div>
                  </div>
                  <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <label class="block text-lg font-semibold text-gray-900">
            <span class="flex items-center space-x-2">
              <span>艺人名称</span>
              <span
                class="text-xs bg-gradient-to-r from-purple-200 to-pink-400 text-white px-2 py-1 rounded-full"
                >必填</span
              >
            </span>
            <span class="text-sm text-gray-500 block mt-1">这是您在音乐平台上显示的名称</span>
          </label>

          <div class="relative">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
              <i class="iconfont icon-user text-purple-400 text-lg">&#xe788;</i>
            </div>
            <input
              v-model="formData.artistName"
              type="text"
              placeholder="请输入您的艺人名称"
              class="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:border-purple-400 focus:ring-3 focus:ring-purple-100 focus:outline-none transition-all placeholder-gray-400"
              :class="{
                'border-red-400 focus:border-red-400 focus:ring-red-100': errors.artistName,
              }"
              maxlength="30"
            />
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {{ formData.artistName.length }}/30
            </div>
          </div>
          <p v-if="errors.artistName" class="text-red-500 text-sm flex items-center space-x-2">
            <i class="iconfont icon-warning text-red-500 text-base">&#xe61c;</i>
            <span>{{ errors.artistName }}</span>
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div
              class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
              @click="formData.artistName = formData.artistName || 'Taylor Swift'"
            >
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-2"
              >
                <i class="iconfont icon-user text-purple-500">&#xe788;</i>
              </div>
              <p class="text-sm text-gray-500 mb-1">个人艺人</p>
              <p class="font-medium text-gray-800">Taylor Swift</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <label class="block text-lg font-semibold text-gray-900">
            <span class="flex items-center space-x-2">
              <span>个人简介</span>
              <span
                class="text-xs bg-purple-100 text-purple-600 border border-purple-200 px-2 py-1 rounded-full"
                >选填</span
              >
            </span>
            <span class="text-sm text-gray-500 block mt-1">向听众介绍您的音乐故事和风格</span>
          </label>

          <div class="relative">
            <textarea
              v-model="formData.bio"
              placeholder="例如：独立音乐人，擅长流行和R&B风格。曾发行多张专辑，致力于创作触动人心的音乐..."
              rows="6"
              class="w-full bg-white border border-gray-300 rounded-xl p-4 focus:border-purple-400 focus:ring-3 focus:ring-purple-100 focus:outline-none transition-all resize-none placeholder-gray-400"
              maxlength="500"
            ></textarea>
            <div
              class="absolute bottom-3 right-3 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded flex items-center space-x-1"
            >
              <i class="iconfont icon-edit text-gray-400 text-xs">&#xe7e5;</i>
              <span>{{ formData.bio.length }}/500</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"
          >
            <h4 class="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <i class="iconfont icon-info-circle text-purple-500 text-base">&#xe60f;</i>
              <span>写好简介的建议</span>
            </h4>
            <ul class="text-sm text-gray-600 space-y-2">
              <li class="flex items-start space-x-2">
                <i class="iconfont icon-star text-purple-500 mt-0.5 text-xs">&#xe661;</i>
                <span>介绍您的音乐风格和流派</span>
              </li>
              <li class="flex items-start space-x-2">
                <i class="iconfont icon-star text-purple-500 mt-0.5 text-xs">&#xe661;</i>
                <span>提及重要的作品或成就</span>
              </li>
              <li class="flex items-start space-x-2">
                <i class="iconfont icon-star text-purple-500 mt-0.5 text-xs">&#xe661;</i>
                <span>保持简洁，突出重点</span>
              </li>
              <li class="flex items-start space-x-2">
                <i class="iconfont icon-star text-purple-500 mt-0.5 text-xs">&#xe661;</i>
                <span>可以添加社交媒体账号</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-gray-200">
          <div
            class="flex flex-col-reverse md:flex-row justify-between items-center space-y-4 md:space-y-0 space-y-reverse"
          >
            <button
              type="button"
              @click="handleReset"
              class="px-8 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all hover:shadow-md w-full md:w-auto flex items-center space-x-2"
            >
              <i class="iconfont icon-refresh text-base"></i>
              <span>重置表单</span>
            </button>

            <div
              class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto"
            >
              <button
                type="button"
                @click="handlePreview"
                class="px-8 py-3 border border-purple-400 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all hover:shadow-md w-full md:w-auto flex items-center space-x-2"
              >
                <i class="iconfont icon-eye text-base">&#xe8bf;</i>
                <span>预览效果</span>
              </button>

              <button
                type="submit"
                :disabled="submitting"
                class="px-8 py-3 bg-gradient-to-r from-purple-200 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full md:w-auto flex items-center justify-center space-x-2"
              >
                <span v-if="!submitting" class="flex items-center space-x-2">
                  <span>下一步：上传音乐作品</span>
                  <i class="iconfont icon-arrow-right text-base">&#xe61d;</i>
                </span>
                <span v-else class="flex items-center space-x-2">
                  <i class="iconfont icon-loading animate-spin text-base">&#xe699;</i>
                  <span>提交中...</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
      <div class="mb-12">
        <h3 class="text-2xl font-bold text-center text-gray-900 mb-8 mt-18">
          完成认证，解锁专属权益
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all"
          >
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-200 to-pink-400 flex items-center justify-center mb-4"
            >
              <i class="iconfont icon-badge text-white text-xl" style="font-size: 30px">&#xe68e;</i>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">官方认证标识</h4>
            <p class="text-gray-600 text-sm">获得官方认证徽章，提升专业形象</p>
          </div>
          <div
            class="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100 hover:shadow-lg transition-all"
          >
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-200 to-pink-400 flex items-center justify-center mb-4"
            >
              <i class="iconfont icon-chart text-white text-xl" style="font-size: 30px">&#xe68b;</i>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">高级数据分析</h4>
            <p class="text-gray-600 text-sm">查看详细播放数据，洞察听众喜好</p>
          </div>
          <div
            class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all"
          >
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-200 to-pink-400 flex items-center justify-center mb-4"
            >
              <i class="iconfont icon-earth text-white text-xl" style="font-size: 30px">&#xe6d6;</i>
            </div>
            <h4 class="font-bold text-gray-900 mb-2">平台发行权限</h4>
            <p class="text-gray-600 text-sm">一键发布到白昼音流平台</p>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 rounded-2xl p-6 md:p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">常见问题</h3>
        <div class="space-y-4">
          <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <i class="iconfont icon-clock text-purple-500">&#xe890;</i>
              <span>认证需要多长时间？</span>
            </h4>
            <p class="text-gray-600 text-sm">
              审核通常需要1-3个工作日。审核通过后，您的认证状态会立即更新。
            </p>
          </div>
          <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <i class="iconfont icon-edit text-purple-500">&#xe615;</i>
              <span>可以修改已提交的信息吗？</span>
            </h4>
            <p class="text-gray-600 text-sm">认证通过后，您可以在个人中心随时更新艺人信息。</p>
          </div>
          <div class="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <i class="iconfont icon-question-circle text-purple-500">&#xe8bb;</i>
              <span>认证有什么要求？</span>
            </h4>
            <p class="text-gray-600 text-sm">需要有原创音乐作品，并确保提交的信息真实有效。</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">认证信息预览</h3>
            <button
              @click="showPreview = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="iconfont icon-close text-xl">&#xe69e;</i>
            </button>
          </div>

          <div class="space-y-6">
            <div
              class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200"
            >
              <div class="flex items-center space-x-6">
                <div
                  class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-lg"
                >
                  <img
                    v-if="formData.avatar"
                    :src="formData.avatar"
                    alt="艺人头像"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="iconfont icon-user text-purple-400 text-3xl">&#xe788;</i>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-2xl font-bold text-gray-900 mb-2">
                    {{ formData.artistName || '未设置艺人名称' }}
                  </h4>
                  <div
                    class="inline-flex items-center space-x-1 bg-gradient-to-r from-purple-200 to-pink-400 text-white px-3 py-1 rounded-full"
                  >
                    <i class="iconfont icon-check text-xs">&#xe752;</i>
                    <span class="text-sm">认证音乐人</span>
                  </div>
                </div>
              </div>
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h5 class="font-semibold mb-3 text-gray-700 flex items-center space-x-2">
                  <i class="iconfont icon-file-text text-purple-500">&#xe618;</i>
                  <span>个人简介</span>
                </h5>
                <p class="text-gray-600 leading-relaxed whitespace-pre-line">
                  {{ formData.bio || '暂无个人简介' }}
                </p>
              </div>
            </div>
            <div class="flex justify-end space-x-4 pt-4">
              <button
                @click="showPreview = false"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <i class="iconfont icon-left">&#xe64e;</i>
                <span>返回编辑</span>
              </button>
              <button
                @click="handleSubmit"
                class="px-6 py-2 bg-gradient-to-r from-purple-200 to-pink-400 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>确认并提交</span>
                <i class="iconfont icon-check">&#xe603;</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

<script setup>
const formData = reactive({
  avatar: '',
  artistName: '',
  bio: '',
})
const uploading = ref(false)
const submitting = ref(false)
const showPreview = ref(false)
const showSuccess = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const errors = reactive({})
const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value?.click()
}
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过5MB')
    return
  }

  selectedFile.value = file
  uploading.value = true
  setTimeout(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar = e.target.result
      uploading.value = false
    }
    reader.readAsDataURL(file)
  }, 800)
}
const removeAvatar = () => {
  formData.avatar = ''
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false

  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    uploading.value = true

    setTimeout(() => {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.avatar = e.target.result
        uploading.value = false
      }
      reader.readAsDataURL(file)
    }, 800)
  }
}
const validateForm = () => {
  errors.artistName = ''

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

  return true
}
const handlePreview = () => {
  if (validateForm()) {
    showPreview.value = true
  }
}
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('提交的数据:', {
      avatar: formData.avatar ? '图片数据' : null,
      artistName: formData.artistName,
      bio: formData.bio,
    })
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    if (showPreview.value) {
      showPreview.value = false
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
const handleReset = () => {
  if (confirm('确定要重置所有信息吗？')) {
    formData.avatar = ''
    formData.artistName = ''
    formData.bio = ''
    selectedFile.value = null
    errors.artistName = ''
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
