<template>
  <!-- 作用：后台的layout -->
  <el-container>
    <le-aside>

    </le-aside>
    <el-container>
      <le-header>

      </le-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import IconFontSymbol from '@/components/IconFontSymbol.vue'
</script>

<style scoped>

</style>
