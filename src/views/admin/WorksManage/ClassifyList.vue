<template>
  <div class="w-full" style="height: calc(100vh - 100px);">
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <ClassifyListHeader/>
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <ClassifyListContainer/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ClassifyListHeader from "@/components/Admin/WorksManage/ClassifyManage/ClassifyListHeader.vue";
  import ClassifyListContainer from "@/components/Admin/WorksManage/ClassifyManage/ClassifyListContainer.vue";
</script>

<style scoped>
</style>
