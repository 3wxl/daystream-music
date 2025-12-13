<template>
  <div class="follow-tabs">
    <div
      class="flex justify-center gap-1 md:gap-2 max-w-sm w-full md:w-auto bg-[#121225] rounded-full p-1 border border-[rgba(205,49,129,0.1)]"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('tab-change', tab.id)"
        class="flex-1 py-2 px-4 rounded-full font-medium text-xs md:text-sm transition-all duration-400 relative"
        :class="{
          'text-white bg-gradient-to-r from-[#cd3181] to-[#ff8fab] shadow-lg shadow-[#cd3181]/20':
            activeTab === tab.id,
          'text-[#718096] hover:text-white hover:bg-white/5': activeTab !== tab.id,
        }"
      >
        <span class="flex items-center justify-center gap-1">
          <i class="iconfont text-xs md:text-xs" :class="tab.icon"></i>
          {{ tab.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: 'musicians' | 'users'
}>()

defineEmits<{
  'tab-change': [tab: 'musicians' | 'users']
}>()

const tabs = [
  { id: 'musicians' as const, label: '关注的歌手', icon: '&#xe7f2;' },
  { id: 'users' as const, label: '关注的用户', icon: '&#xe611;' },
]
</script>
