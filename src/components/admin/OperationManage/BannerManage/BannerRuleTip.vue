<template>
  <div class="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 flex items-start gap-3">
    <IconFontSymbol name="jieshi" class="text-blue-500"></IconFontSymbol>
    <div>
      <h3 class="font-medium text-blue-800">轮播图展示规则</h3>
      <p class="text-sm text-blue-700 mt-1">
        系统将始终保持4个轮播图同时展示。当当前时间段的轮播图少于4个时，会自动从未来时间段的轮播图中补充；
        当超过4个时，将按创建时间排序，仅展示最新的4个。默认轮播图不可删除，仅可编辑。
      </p>
    </div>
  </div>
</template>

<script setup>
// 无逻辑，纯展示
</script>
