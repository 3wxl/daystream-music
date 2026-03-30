<template>
  <div class="space-y-4">
    <label class="block text-lg font-semibold text-gray-900">
      <span>艺人头像</span>
      <span class="text-sm text-gray-500 block mt-1">
        请上传清晰的头像照片，建议尺寸 800x800px，文件大小不超过 5MB
      </span>
    </label>

    <div
      ref="dropZone"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      class="border-2 border-dashed rounded-2xl p-8 transition-all hover:border-purple-400"
      :class="{
        'border-purple-400 bg-purple-50': isDragging,
      }"
    >
      <div class="text-center">
        <div
          v-if="!uploading && !avatar"
          class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="iconfont icon-upload text-purple-400" style="font-size: 2.5rem">&#xe602;</i>
        </div>

        <div
          v-if="uploading"
          class="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <i class="iconfont icon-loading animate-spin text-purple-400 text-3xl">&#xe699;</i>
        </div>

        <div
          v-if="avatar && !uploading"
          class="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden"
        >
          <img :src="avatar" alt="艺人头像" class="w-full h-full object-cover" />
        </div>

        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          {{ avatar ? '头像已上传' : '上传艺人头像' }}
        </h3>

        <p class="text-gray-500 mb-4">
          {{ avatar ? '点击下方按钮更换头像' : '支持 JPG、PNG、GIF 格式，文件大小不超过 5MB' }}
        </p>

        <div class="flex flex-col items-center space-y-3">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          />

          <button
            type="button"
            @click="triggerFileInput"
            class="px-6 py-2 bg-white border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all"
          >
            <i class="iconfont icon-upload mr-2 text-base">&#xe893;</i>
            <span>{{ avatar ? '更换头像' : '选择图片' }}</span>
          </button>

          <p class="text-sm text-gray-400">或直接将图片拖放到此处</p>
        </div>

        <button
          v-if="avatar && !uploading"
          type="button"
          @click="removeAvatar"
          class="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <i class="iconfont icon-delete mr-1 text-base">&#xe767;</i>
          <span>移除头像</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  uploading: {
    type: Boolean,
    default: false,
  },
  isDragging: {
    type: Boolean,
    default: false,
  },
  selectedFile: {
    type: Object as () => File | null,
    default: null,
  },
})

const emit = defineEmits([
  'update:avatar',
  'update:isDragging',
  'remove',
  'trigger-file-input',
  'drag-over',
  'drag-leave',
  'drop',
  'handle-avatar-change',
])

const fileInput = ref<HTMLInputElement | null>(null)
const dropZone = ref(null)

const triggerFileInput = () => {
  emit('trigger-file-input')
}

const handleAvatarChange = (event: Event) => {
  emit('handle-avatar-change', event)
}

const removeAvatar = () => {
  emit('update:avatar', '')
  emit('remove')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (!props.isDragging) {
    // 加判断：只有状态变化时才发射
    emit('update:isDragging', true)
  }
}

const handleDragLeave = () => {
  if (props.isDragging) {
    // 加判断：避免重复发射
    emit('update:isDragging', false)
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  emit('update:isDragging', false)
  emit('drop', e)

  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    // 创建一个模拟的change事件
    const event = {
      target: {
        files: [file],
      },
    }
    emit('handle-avatar-change', event)
  }
}
</script>
