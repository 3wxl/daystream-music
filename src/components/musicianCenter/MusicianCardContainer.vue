<template>
  <div class="w-full flex flex-col items-center pt-10 pb-16 min-h-screen">
    <!-- 主标题 -->
    <h1 class="text-[48px] font-bold text-[#f983c2] tracking-wide drop-shadow">
      打造音乐人专属卡片
    </h1>

    <!-- 副标题 -->
    <p class="text-[#f879b8] text-sm mt-2 opacity-80">
      我们愿和你一起拥抱音乐世界，让好音乐在白昼音流持续发酵
    </p>

    <!-- 卡片区域 -->
    <div class="w-full flex flex-row justify-center gap-20 p-6 mt-10">
      <MusicianCard
        v-for="musician in musicians"
        :key="musician.id"
        :name="musician.stageName"
        :tag="musician.representativeWork || '音乐人'"
        :avatar="musician.avatar"
        :shortDesc="'来自白昼音流的音乐人'"
        :description="musician.introduction || '暂无详细介绍'"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  musicians: {
    type: Array,
    default: () => [],
  },
})
</script>
