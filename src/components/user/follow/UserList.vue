<template>
  <div class="user-list-container space-y-4">
    <FollowItem
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :index="index"
      :search-query="searchQuery"
      @click="() => $emit('item-click', item.id)"
      @unfollow="() => $emit('unfollow', item.id)"
    />
  </div>
</template>

<script setup lang="ts">
const { searchQuery } = defineProps<{
  items: any[]
  loading: boolean
  searchQuery: string
}>()

console.log(searchQuery)
defineEmits<{
  'item-click': [id: number]
  unfollow: [id: number]
}>()
</script>
