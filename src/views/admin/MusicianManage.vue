<script setup lang="ts">
</script>

<template>
  <transition name="admin-container" appear>
    <router-view></router-view>
  </transition>
</template>

<style scoped>
  .admin-container-enter-from{
    opacity: 0;
    transform: translateX(-40px);
  }
  .admin-container-enter-to {
    opacity: 1;
    transform: translateX(0);
  }
  .admin-container-leave-from{
    opacity: 1;
    transform: translateX(0);
  }
  .admin-container-leave-to{
    opacity: 0;
    transform: translateX(40px);
  }
  .admin-container-enter-active, .admin-container-leave-active {
    transition: all 0.5s ease;
  }
</style>
