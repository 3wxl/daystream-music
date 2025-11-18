<template>
  <div class="flex h-full">
    <span class="mr-3 text-[16px]/8 text-[#666] shrink-0">{{ label }}:</span>
    <el-select v-model="value" placeholder="请选择" class="w-[200px]  shrink-0">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
  import { ref,reactive} from 'vue'
  let value = ref('')
  let options = reactive([
    { value: '1', label: '启用' },
    { value: '0', label: '禁用' }
  ])
  let label = ref('状态')
</script>

