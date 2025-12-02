<template>
  <div class="flex items-start gap-4">
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
        <!-- AI思考过程 -->
        <div
          v-if="message.analysis"
          class="bg-pink-400/10 rounded-2xl rounded-tl-none p-5 border border-pink-400/20 shadow-xl mb-4 backdrop-blur-sm"
        >
          <div class="flex items-start gap-3 mb-4">
            <div
              class="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0"
            >
              <i class="iconfont icon-ai text-white text-sm">&#xe7a2;</i>
            </div>
            <div class="flex-1">
              <h4 class="text-pink-300 font-medium mb-2">{{ message.analysis.title }}</h4>
              <div class="space-y-3 text-sm">
                <div
                  v-for="(point, index) in message.analysis.points"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <div class="w-2 h-2 rounded-full bg-pink-400 mt-1.5 flex-shrink-0"></div>
                  <p class="text-gray-300">{{ point }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成的歌词 -->
        <div
          v-if="message.lyrics"
          class="bg-pink-400/15 rounded-2xl rounded-tl-none p-5 border border-pink-400/30 shadow-xl backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0"
              >
                <i class="iconfont icon-music text-white">&#xe6e0;</i>
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ message.lyrics.title }}</h3>
                <p class="text-pink-300 text-sm">AI 词曲创作 · 源自你的灵感</p>
              </div>
            </div>

            <!-- 歌词节选 -->
            <div class="space-y-3 text-gray-300">
              <div
                v-for="section in message.lyrics.sections"
                :key="section.type"
                @click="$emit('play-lyric', section.type)"
                class="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div class="flex items-start gap-3">
                  <div class="text-pink-300 text-sm font-mono opacity-70 group-hover:opacity-100">
                    [{{ section.type }}]
                  </div>
                  <p class="leading-relaxed whitespace-pre-line">{{ section.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 普通消息内容 -->
        <div
          v-else
          class="bg-pink-400/10 rounded-2xl rounded-tl-none p-5 border border-pink-400/20 shadow-xl"
        >
          <p class="leading-relaxed text-gray-300 whitespace-pre-line">{{ message.content }}</p>
        </div>

        <!-- 操作按钮 -->
        <!-- <div v-if="message.lyrics" class="flex items-center gap-3 mt-4">
          <button
            @click="$emit('continue-creation')"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-pink-400/20 border border-white/10 transition-all group"
          >
            <i class="iconfont icon-edit text-gray-400 group-hover:text-pink-300 transition-colors"
              >&#xe615;</i
            >
            <span class="text-sm">继续创作</span>
          </button>
          <button
            @click="$emit('preview-song')"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-400 hover:bg-pink-500 transition-all text-white"
          >
            <i class="iconfont icon-play">&#xe634;</i>
            <span class="text-sm">试听歌曲</span>
          </button>
          <button
            @click="$emit('save-lyrics')"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-pink-400/20 border border-white/10 transition-all group"
          >
            <i class="iconfont icon-download text-gray-400 group-hover:text-pink-300">&#xe600;</i>
            <span class="text-sm">保存歌词</span>
          </button>
        </div> -->

        <!-- 时间戳 -->
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 ml-4">
          <i class="iconfont icon-time">&#xe61e;</i>
          <span>{{ message.timestamp }} · AI 生成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/lyric-assistant'

interface Props {
  message: Message
}

interface Emits {
  (e: 'play-lyric', section: string): void
  (e: 'continue-creation'): void
  (e: 'preview-song'): void
  (e: 'save-lyrics'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
