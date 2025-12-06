<template>
  <el-container class="h-full">
    <el-aside width="330px">
      <PrivateLetterLeftBar/>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import PrivateLetterLeftBar from "@/components/message/PrivateLetter/PrivateLetterLeftBar.vue";
</script>

<style scoped>
  .el-main{
    padding:0
  }
</style>
