<template>
  <button
  :class="`text-[${color}];bg-[${backgroundColor}];w-[${width}];h-[${height}];`"
  class="rounded-[6px] outline-none "
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
  import { color } from 'echarts';
import { he } from 'element-plus/es/locale';
import { ref } from 'vue'
  let props = defineProps({
    text:{
      type: String,
      required: true
    },
    backgroundColor:{
      type: String,
      required: true
    },
    color:{
      type: String,
      required: true
    },
    width:{
      type: String,
      required: true
    },
    height:{
      type: String,
      required: true
    }
  })
</script>

