<template>
  <div
    v-for="item in items"
    :key="item.title"
    class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 bg-gray-900
           hover:bg-purple-900/40 dark:hover:bg-purple-900/40"
  >
    <div class="flex items-center flex-grow min-w-0">
      <img :src="item.imgUrl" alt="Album Cover" class="w-12 h-12 rounded-md object-cover mr-3 flex-shrink-0" />
      <div class="flex flex-col truncate">
        <span class="text-base font-medium text-gray-100 truncate">{{ item.title }}</span>
        <span class="text-sm text-gray-500 truncate">{{ item.artist }}</span>
      </div>
    </div>

    <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300
               hover:bg-gray-600 transition-colors duration-200"
        aria-label="Like"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="0"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </button>

      <button
        class="w-8 h-8 flex items-center justify-center rounded-full bg-pink-600 text-white
               hover:bg-pink-500 transition-colors duration-200"
        aria-label="Play"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="0"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  items:{
    type:Object
  }
})
</script>

<style lang="scss" scoped>


</style>
