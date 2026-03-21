<template>
  <div class="space-y-4">
    <label class="block text-lg font-semibold text-gray-900">
      <span class="flex items-center space-x-2">
        <span>音乐人标签</span>
        <span
          class="text-xs bg-gradient-to-r from-purple-200 to-pink-400 text-white px-2 py-1 rounded-full"
          >必填</span
        >
      </span>
      <span class="text-sm text-gray-500 block mt-1">选择您的音乐风格标签，可多选</span>
    </label>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="tag in tags"
        :key="tag.id"
        type="button"
        @click="toggleTag(tag.id)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2"
        :class="{
          'bg-gradient-to-r from-purple-200 to-pink-400 text-white shadow-md':
            selectedTags.includes(tag.id),
          'bg-gray-100 text-gray-700 hover:bg-gray-200': !selectedTags.includes(tag.id),
        }"
      >
        <span>{{ tag.name }}</span>
        <i v-if="selectedTags.includes(tag.id)" class="iconfont text-sm">&#xe646;</i>
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm flex items-center space-x-2">
      <i class="iconfont text-red-500 text-base">&#xe64a;</i>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: '',
  },
})

// 定义emit
const emit = defineEmits(['update:modelValue'])

// 标签数据
const tags = [
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

// 选中的标签
const selectedTags = ref([...props.modelValue])

// 监听props变化，更新本地状态
watch(
  () => props.modelValue,
  (newVal) => {
    // 只有当值实际不同时才更新，避免无限循环
    if (JSON.stringify(newVal) !== JSON.stringify(selectedTags.value)) {
      selectedTags.value = [...newVal]
    }
  },
)

// 监听本地状态变化，更新props
watch(selectedTags, (newVal) => {
  // 只有当值实际不同时才更新，避免无限循环
  if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', newVal)
  }
})

// 切换标签选择状态
const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    // 使用filter创建新数组，避免修改原数组
    selectedTags.value = selectedTags.value.filter((id) => id !== tagId)
  } else {
    // 使用扩展运算符创建新数组，避免修改原数组
    selectedTags.value = [...selectedTags.value, tagId]
  }
}
</script>
