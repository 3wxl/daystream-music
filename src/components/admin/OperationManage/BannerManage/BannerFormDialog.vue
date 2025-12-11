<template>
  <AdminConfirm
    :title="isEditMode ? (form.isDefault ? '编辑默认轮播图' : '编辑轮播图') : '添加轮播图'"
    v-model="isDialogOpen"
    width="600px"
    :close-on-click-modal="false"
    isCustom=true
  >
    <el-form
      :model="form"
      :rules="formRules"
      ref="formRef"
      label-width="100px"
      class="space-y-4"
    >
      <el-form-item label="轮播图名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入轮播图名称" class="w-full" />
      </el-form-item>
      <el-form-item label="轮播图图片" prop="imageUrl">
        <div class="flex flex-col gap-2">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :on-change="handleImageChange"
            list-type="picture-card"
            :file-list="uploadFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="text-xs text-gray-500">支持 JPG、PNG 格式，建议尺寸 1920×500px</p>
        </div>
        <div v-if="form.imageUrl" class="mt-3 w-full h-40 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
          <img :src="form.imageUrl" alt="预览图" class="max-w-full max-h-full object-contain" />
        </div>
      </el-form-item>
      <el-form-item label="点击交互" prop="clickType">
        <el-select
          v-model="form.clickType"
          placeholder="选择点击后行为"
          class="w-full"
          @change="handleClickTypeChange"
        >
          <el-option key=" " label="无" value=""></el-option>
          <el-option key="link" label="跳转链接" value="link"></el-option>
          <el-option key="music" label="播放音乐" value="music"></el-option>
          <el-option key="playlist" label="播放歌单" value="playlist"></el-option>
        </el-select>
        <div class="mt-2">
          <el-button
            type="text"
            @click="$emit('openActionDrawer')"
            v-if="form.clickType"
            class="text-blue-500 p-0 h-auto"
          >
            <el-icon size="14" class="mr-1"><Setting /></el-icon>
            {{ form.clickType === 'link' ? '设置链接' : form.clickType === 'music' ? '选择音乐' : '选择歌单' }}
          </el-button>
          <div v-if="form.clickType && (form.linkUrl || form.musicId || form.playlistId)" class="text-sm text-gray-600 mt-1">
            当前设置:
            <span class="font-medium">
              {{ form.clickType === 'link' ? form.linkUrl : form.clickType === 'music' ? form.musicName : form.playlistName }}
            </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" class="w-full" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" class="w-full" />
      </el-form-item>
      <el-form-item label="展示规则提示">
        <div class="bg-gray-50 p-3 rounded-md text-sm">
          <p class="text-gray-600">
            系统将自动维持4个轮播图同时展示。您设置的时间段仅用于优先级排序，
            最终展示数量由系统自动调节。
          </p>
        </div>
      </el-form-item>
    </el-form>
    <div class="mt-1 flex justify-center gap-12">
      <el-button @click="handleClose" class="w-25">取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        :loading="isSubmitting"
        class="bg-blue-500 hover:bg-blue-600 text-white w-25"
      >
        确认
      </el-button>
    </div>
  </AdminConfirm>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Setting } from '@element-plus/icons-vue';
import AdminConfirm from '@/components/admin/AdminConfirm.vue';

const props = defineProps({
  isEditMode: { type: Boolean, required: true },
  form: { type: Object, required: true },
  formRules: { type: Object, required: true },
  mockMusics: { type: Array, required: true },
  mockPlaylists: { type: Array, required: true }
});
let isDialogOpen = defineModel()
const emit = defineEmits(['submit', 'close', 'openActionDrawer']);

const formRef = ref(null);
const uploadFileList = ref([]);
const isSubmitting = ref(false);

// 监听form变化，同步上传文件列表
watch(() => props.form.imageUrl, (newVal) => {
  if (newVal) uploadFileList.value = [{ url: newVal }];
}, { immediate: true });

const handleImageChange = (uploadFile) => {
  props.form.imageUrl = uploadFile.url;
  uploadFileList.value = [uploadFile];
};

const handleClickTypeChange = (value) => {
  if (value !== 'link') props.form.linkUrl = '';
  if (value !== 'music') {
    props.form.musicId = '';
    props.form.musicName = '';
  }
  if (value !== 'playlist') {
    props.form.playlistId = '';
    props.form.playlistName = '';
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit('submit', props.form);
  } catch (error) {
    ElMessage.error('表单验证失败，请检查填写内容');
  }
};

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>
