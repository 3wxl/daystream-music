<template>
  <!-- to path应该指向MyList -->

    <router-link
      v-for="tag in tags"
      :key="tag.name"
      :to="tag.path"
      class="tag-item"
    >{{ tag.name }}
    </router-link>

</template>

<script lang="ts" setup>
defineProps({
  tags:{
    type:Object,
    required:true
  },
})

</script>

<style lang="scss" scoped>
.tag-item {
  display: inline-block;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  color: #e5e7eb; /* 浅灰色文字 */
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap; /* 防止文字换行 */
  flex-shrink: 0; /* 防止标签被压缩 */
  transition: all 0.2s ease;
}

.tag-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Vue Router 会自动给当前激活的链接添加 "router-link-active" 类 */
.tag-item.router-link-active {
  background-color: rgb(219, 39, 119); /* 粉色，与主题一致 */
  color: #ffffff;
  font-weight: bold;
}

</style>
