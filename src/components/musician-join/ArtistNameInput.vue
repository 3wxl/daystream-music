<template>
  <div class="space-y-4">
    <label class="block text-lg font-semibold text-gray-900">
      <span>艺人名称</span>
      <span class="text-sm text-gray-500 block mt-1">
        请输入您的艺人名称，用于在平台上展示
      </span>
    </label>

    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <i class="iconfont icon-user text-gray-400 text-xl">&#xe788;</i>
      </div>

      <input
        v-model="localArtistName"
        type="text"
        placeholder="请输入艺人名称"
        class="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:border-purple-400 focus:ring-3 focus:ring-purple-100 focus:outline-none transition-all placeholder-gray-400"
        :class="{
          'border-red-400 focus:border-red-400 focus:ring-red-100': error,
        }"
        maxlength="30"
        @input="handleInput"
      />

      <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
        {{ localArtistName.length }}/30
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-sm flex items-center space-x-2">
      <i class="iconfont icon-warning text-red-500 text-base">&#xe61c;</i>
      <span>{{ error }}</span>
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        class="bg-gray-50 rounded-lg p-3 text-center border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
        @click="handleSampleClick('Taylor Swift')"
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
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'input'])

const localArtistName = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localArtistName.value = newValue
})

watch(localArtistName, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleInput = () => {
  emit('input')
}

const handleSampleClick = (sampleName) => {
  localArtistName.value = sampleName
  emit('update:modelValue', sampleName)
}
</script>
