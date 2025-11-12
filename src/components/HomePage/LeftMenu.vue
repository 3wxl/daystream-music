<template>
  <div class="flex flex-col">
    <span class="mt-2 mb-2">Daystream</span>
    <div class="avatar">
      <el-avatar :size="50" :src="circleUrl" @click="changeCollapse()"/>
  </div>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :router ="router"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="/">
      <el-icon><House /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/artist">
      <el-icon><View /></el-icon>
      <template #title>歌手</template>
    </el-menu-item>
    <el-menu-item index="album">
      <el-icon><Tickets /></el-icon>
      <template #title>专辑</template>
    </el-menu-item>
    <el-menu-item index="/user">
      <el-icon><User /></el-icon>
      <template #title>个人</template>
    </el-menu-item>
     <el-menu-item index="/UserAuth">
      <el-icon><setting /></el-icon>
      <template #title>登录</template>
    </el-menu-item>
  </el-menu>
  </div>
</template>

<script lang="ts" setup>
import circleUrl from '@/assets/logo.jpg'
import { ref } from 'vue'
import {
  House,
  User,
  Tickets,
  View,
  Setting,
} from '@element-plus/icons-vue'


const router = ref(true)
const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeCollapse = () => {
  return isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
:deep(.avatar){
  margin-left: 10px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
}

.el-icon svg{
  width: 24px;
  height: 24px;
  font-size: 24px;
}

::v-deep .el-menu-item {
  margin-bottom: 14px;
 }

 .el-menu--horizontal {
  --el-menu-horizontal-height: 150px;
}
</style>




