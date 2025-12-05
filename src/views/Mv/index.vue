<template>
  <div class="mv-list-container">
    <div class="mv-grid">
      <MvCard
        v-for="mv in mvList"
        :key="mv.id"
        :img-url="mv.cover"
        :title="mv.title"
        :author="mv.artist"
        :duration="mv.duration"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MvCard from '@/components/MvCard.vue'
import { ref } from 'vue'

const mvList = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? 'Fire Loop' : 'Counting Sheep (Official Video)',
    artist: i % 2 === 0 ? 'HIGE DANdism' : 'SAFIA',
    duration: '04:36',
    cover: `https://picsum.photos/seed/mv${i}/640/360`,
  })),
)
</script>

<style lang="scss" scoped>
.mv-list-container {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

/* Scrollbar styling */
.mv-list-container::-webkit-scrollbar {
  width: 8px;
}
.mv-list-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.mv-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.mv-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .mv-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
