<template>
  <div class="flex items-center w-full mt-12">
    <el-input v-model="input"
    placeholder="请输入您想听的歌曲"
    :suffix-icon="Search"
    class="flex-1"
    />
     <el-button round class="ml-4">搜索</el-button>
     <el-button round>登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
const input = ref('')
</script>

<style lang="scss" scoped>
:deep(.el-input__wrapper){
  border-radius: 15px;
}

</style>
