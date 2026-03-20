<template>
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
        v-model="localBio"
        placeholder="例如：独立音乐人，擅长流行和R&B风格。曾发行多张专辑，致力于创作触动人心的音乐..."
        rows="6"
        class="w-full bg-white border border-gray-300 rounded-xl p-4 focus:border-purple-400 focus:ring-3 focus:ring-purple-100 focus:outline-none transition-all resize-none placeholder-gray-400"
        maxlength="500"
        @input="handleInput"
      ></textarea>
      <div
        class="absolute bottom-3 right-3 text-sm text-gray-500 bg-white/80 px-2 py-1 rounded flex items-center space-x-1"
      >
        <i class="iconfont icon-edit text-gray-400 text-xs">&#xe7e5;</i>
        <span>{{ localBio.length }}/500</span>
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
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'input'])

const localBio = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localBio.value = newValue
})

watch(localBio, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  emit('input')
}
</script>
