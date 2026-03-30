<template>
  <div class="absolute w-full h-full z-10 top-0 right-0" v-show="isShowManage">
    <div class="absolute w-full h-full z-10" @click="isShowManage=false"></div>
    <!-- 动画侧边栏 -->
    <Transition appear>
      <div
        v-show="isShowManage"
        class="sidebar"
      >
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  const isShowManage = defineModel()
</script>

<style lang="scss" scoped>
/* 基础样式 */
.sidebar {
  position: absolute;
  z-index: 11;
  height: 100%;
  top: 0;
  right: 0;
  background: #101828;
  border-left: 1px solid #1b2536;
  transition: width 0.3s ease;
}

/* 进入前：宽度0 */
.v-enter-from {
  width: 0;
}
/* 进入后：宽度350px */
.v-enter-to {
  width: 350px;
}

/* 离开前：宽度350px */
.v-leave-from {
  width: 350px;
}
/* 离开后：宽度0 */
.v-leave-to {
  width: 0;
}

/* 过渡激活 */
.v-enter-active,
.v-leave-active {
  transition: width 0.3s ease;
}
</style>
