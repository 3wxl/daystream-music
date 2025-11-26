<template>
  <div>
    <label for="admin-input" class="mr-3 text-[16px] text-[#666]" v-if="label">{{ label }}</label>
    <input
      id="admin-input"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      :class="width"
      class="z-11 outline-none border-[#666] bg-[#E9F0FE] hover:bg-[#e4ecfd] focus:bg-[#dee9ff] rounded-[8px] px-[15px] py-[8px] text-[15px] text-[#666] "
    >
    <IconFontSymbol class="z-11 relative right-[30px] top-[6px] cursor-pointer" v-if="rightIcon" :name="rightIcon" :size="rIconSize?rIconSize:'1rem'" :rIconColor="rIconColor?rIconColor:'#000000'"></IconFontSymbol>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import IconFontSymbol from '../IconFontSymbol.vue';
  let props = defineProps<{
    type?: string
    placeholder?: string
    value?: string
    width?: string
    label?: string
    rightIcon?: string
    rIconSize?: string
    rIconColor?: string
  }>()
  console.log(props)
</script>

