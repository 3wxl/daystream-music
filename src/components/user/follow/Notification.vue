<template>
  <teleport to="body">
    <div
      ref="notificationEl"
      class="fixed top-6 right-6 bg-[#121225] border border-[#cd3181] text-white px-5 py-3 rounded-xl shadow-xl shadow-[#cd3181]/10 z-50 transform translate-x-full transition-transform duration-500 ease-out flex items-center gap-2"
    >
      <i class="iconfont text-[#cd3181]">&#xe62b;</i>
      <span class="text">{{ message }}</span>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const notificationEl = ref<HTMLElement>()
const message = ref('')

const show = (msg: string) => {
  message.value = msg

  nextTick(() => {
    if (notificationEl.value) {
      notificationEl.value.style.transform = 'translateX(0)'

      setTimeout(() => {
        if (notificationEl.value) {
          notificationEl.value.style.transform = 'translateX(calc(100% + 2rem))'
        }
      }, 2500)
    }
  })
}

defineExpose({ show })
</script>

<style lang="scss" scoped></style>
