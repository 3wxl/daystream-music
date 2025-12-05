<template>
  <div class="flex items-start gap-4 animate-slide-in-left">
    <div class="relative flex-shrink-0">
      <div class="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center shadow-lg">
        <i class="iconfont icon-ai text-white">&#xe7a2;</i>
      </div>
      <div
        class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"
      ></div>
    </div>
    <div class="flex-1 max-w-3xl">
      <div class="relative">
        <!-- AI欢迎消息 -->
        <div
          class="bg-pink-400/10 rounded-2xl rounded-tl-none p-5 border border-pink-400/20 shadow-xl"
        >
          <p class="leading-relaxed text-gray-300">
            {{ welcomeMessage }}
          </p>
        </div>
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 ml-4">
          <i class="iconfont icon-time">&#xe61e;</i>
          <span>刚刚</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  welcomeMessage: string
  avatar?: string
}

withDefaults(defineProps<Props>(), {
  welcomeMessage:
    '你好！我是AI作词助手，擅长创作各种风格的歌词。你可以告诉我想要的主题、情感、风格，或者上传参考歌词，我会帮你创作出精彩的歌词作品！',
  avatar: 'https://picsum.photos/id/237/200',
})
</script>
