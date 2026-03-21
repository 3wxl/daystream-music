<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900">认证信息预览</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
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
                  v-if="avatar"
                  :src="avatar"
                  alt="艺人头像"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="iconfont icon-user text-purple-400 text-3xl">&#xe788;</i>
                </div>
              </div>
              <div class="flex-1">
                <h4 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ artistName || '未设置艺人名称' }}
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
                {{ bio || '暂无个人简介' }}
              </p>
            </div>
            <!-- 添加标签显示部分 -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h5 class="font-semibold mb-3 text-gray-700 flex items-center space-x-2">
                <i class="iconfont icon-tag text-purple-500">&#xe628;</i>
                <span>音乐标签</span>
              </h5>
              <div v-if="tags && tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="(tag, index) in displayTags"
                  :key="index"
                  class="px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {{ tag }}
                </span>
              </div>
              <p v-else class="text-gray-500">暂无音乐标签</p>
            </div>
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button
              @click="close"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <i class="iconfont icon-left">&#xe64e;</i>
              <span>返回编辑</span>
            </button>
            <button
              @click="confirmSubmit"
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
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  artistName: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
})

// 标签数据映射
const tagMap = [
  { id: 1, name: '流行' },
  { id: 2, name: '说唱' },
  { id: 3, name: '国风' },
  { id: 4, name: '摇滚' },
  { id: 5, name: '电子' },
  { id: 6, name: '民谣' },
  { id: 7, name: 'R&B' },
  { id: 8, name: '民族乐' },
  { id: 9, name: '轻音乐' },
  { id: 10, name: '爵士' },
  { id: 11, name: '古典' },
  { id: 12, name: '乡村' },
  { id: 13, name: '蓝调' },
]

// 将标签ID转换为标签名称
const displayTags = computed(() => {
  return props.tags.map((tagId) => {
    const tag = tagMap.find((t) => t.id === tagId)
    return tag ? tag.name : tagId
  })
})

const emit = defineEmits(['close', 'confirm'])

const close = () => {
  emit('close')
}

const confirmSubmit = () => {
  emit('confirm')
}
</script>
