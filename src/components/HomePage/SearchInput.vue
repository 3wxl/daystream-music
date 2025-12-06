<template>
   <div class="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="心动"
            class="w-full px-4 py-2 pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
          />
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
</script>