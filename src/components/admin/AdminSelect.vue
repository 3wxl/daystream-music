<template>
  <div class="flex h-full">
    <span class="mr-3 text-[16px]/8 text-[#666] shrink-0">{{ label }}:</span>
    <el-select v-model="typeVal" placeholder="请选择" class="w-[200px]  shrink-0">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
  let props = defineProps<{
    label: string;
    options: {
      label: string;
      value: string;
    }[];
  }>();
  let typeVal = defineModel<string>({ required: true });
</script>

