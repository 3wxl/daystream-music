<template>
  <div class="w-full md:w-auto flex-1 md:max-w-xs">
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-400"
        :class="isFocused ? 'text-[#cd3181]' : 'text-[#64748b]'"
      >
        <i class="iconfont text-lg">
          {{ activeTab === 'musicians' ? '&#xe7f2;' : '&#xe611;' }}
        </i>
      </div>

      <input
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
        type="text"
        :placeholder="'搜索' + (activeTab === 'musicians' ? '歌手' : '用户') + '...'"
        class="w-full pl-12 pr-12 py-3 rounded-full bg-[#121225] border border-[rgba(205,49,129,0.1)] focus:border-[#cd3181] focus:ring-2 focus:ring-[#cd3181]/20 outline-none transition-all duration-500 text-sm placeholder:text-[#64748b] placeholder:transition-colors placeholder:focus:text-[#94a3b8] shadow-md shadow-black/10 focus:shadow-lg focus:shadow-[#cd3181]/5 transform focus:scale-[1.02] origin-center"
        :style="inputStyle"
      />

      <!-- 搜索按钮 -->
      <!-- <button
        @click="handleSearch"
        v-if="modelValue && modelValue.length > 0"
        class="absolute inset-y-0 right-10 flex items-center text-[#64748b] hover:text-[#cd3181] transition-colors duration-300"
        title="搜索"
      >
        <i class="iconfont text-lg">&#xe60c;</i>
      </button> -->

      <!-- 清除按钮 -->
      <button
        @click="handleClear"
        v-if="modelValue && modelValue.length > 0"
        class="absolute inset-y-0 right-10 flex items-center text-[#64748b] hover:text-[#cd3181] transition-colors duration-300 z-100"
        title="清除搜索"
      >
        <i class="iconfont text-lg">&#xe607;</i>
      </button>

      <!-- 搜索结果统计 -->
      <div
        v-if="modelValue && modelValue.length > 0 && resultCount >= 0"
        class="absolute top-full right-0 mt-2 text-xs text-[#94a3b8] pr-4 animate-fade-in"
      >
        找到 <span class="text-[#cd3181] font-medium">{{ resultCount }}</span> 个{{
          activeTab === 'musicians' ? '歌手' : '用户'
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  activeTab: 'musicians' | 'users'
  resultCount: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search-focus': [isFocused: boolean]
  'clear-search': []
  search: [] // 仅用于回车/点击搜索按钮时的动画触发
}>()

const isFocused = ref(false)

const inputStyle = computed(() => ({
  width: isFocused.value ? '100%' : '80%',
  margin: isFocused.value ? '0 0 0 auto' : '0 0 0 auto',
}))

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  console.log(value)
  emit('update:modelValue', value)
}

const handleFocus = () => {
  isFocused.value = true
  emit('search-focus', true)
}

const handleBlur = () => {
  isFocused.value = false
  emit('search-focus', false)
}

const handleSearch = () => {
  if (props.modelValue && props.modelValue.length > 0) {
    emit('search')
  }
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear-search')
}
</script>

<style lang="scss" scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
