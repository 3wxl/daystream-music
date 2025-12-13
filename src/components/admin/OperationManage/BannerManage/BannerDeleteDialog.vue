<template>
  <AdminConfirm
    title="删除轮播图"
    v-model="isDeleteDialogOpen"
    width="500px"
    :close-on-click-modal="false"
    isCustom=true
  >
    <p class="text-gray-700 indent-0.5">确定要删除这张轮播图吗？删除后会自动补充其他轮播图以保持4个展示。</p>
    <div class="mt-1 flex justify-end gap-5 px-10">
      <el-button @click="$emit('cancel')" class="w-[100px]">取消</el-button>
      <el-button
        type="danger"
        @click="$emit('confirm')"
        :loading="isDeleting"
      >
        确认删除
      </el-button>
    </div>
  </AdminConfirm>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import AdminConfirm from '@/components/admin/AdminConfirm.vue';

const props = defineProps({
  isDeleting: { type: Boolean, default: false }
});
let isDeleteDialogOpen = defineModel()

const emit = defineEmits([ 'confirm', 'cancel']);
</script>
