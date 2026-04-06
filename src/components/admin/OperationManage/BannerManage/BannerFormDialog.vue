<template>
  <AdminConfirm
    :title="isEditMode ? '编辑轮播图': '添加轮播图'"
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
      <el-form-item label="轮播图名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入轮播图名称" class="w-full" />
      </el-form-item>
      <el-form-item label="权重" prop="sortOrder">
        <el-input-number
          v-model="form.sortOrder"
          :min="0"
          :max="999"
          controls-position="right"
          class="w-[200px]!"
          placeholder="请输入权重值（0-999）"
        />
        <p class="text-xs text-gray-500 mt-1 ml-2">权重值越高，展示优先级越高</p>
      </el-form-item>
      <el-form-item label="轮播图图片">
        <div class="flex flex-col gap-2">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleRemove"
            list-type="picture-card"
            :file-list="uploadFileList"
            :limit="1"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
          >
            <i class="iconfont icon-icon1"></i>
          </el-upload>
          <p class="text-xs text-gray-500">支持 JPG、PNG 格式，建议尺寸 1920×500px</p>
        </div>
        <div v-if="imgFileUrl" class="mt-3 w-full h-40 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
          <img :src="imgFileUrl" alt="预览图" class="max-w-full max-h-full object-contain" />
        </div>
      </el-form-item>
      <el-form-item label="点击交互" prop="actionType">
        <el-select
          v-model="form.actionType"
          placeholder="选择点击后行为"
          class="w-full"
          @change="handleClickTypeChange"
        >
          <el-option key="0" label="无" :value="0"></el-option>
          <el-option key="4" label="跳转链接" :value="4"></el-option>
          <el-option key="2" label="跳转歌曲" :value="2"></el-option>
          <el-option key="1" label="跳转歌单" :value="1"></el-option>
          <el-option key="3" label="跳转秒杀活动" :value="3"></el-option>
        </el-select>
        <div class="mt-2">
          <el-button
            type="text"
            @click="$emit('openActionDrawer')"
            v-if="form.actionType!='0'&&form.actionType!=null"
            class="text-blue-500 p-0 h-auto"
          >
            <el-icon size="14" class="mr-1"><Setting /></el-icon>
            {{ clickType[form.actionType] }}
          </el-button>

          <div v-if="form.actionType && (form.linkUrl || form.musicId || form.playlistId)" class="text-sm text-gray-600 mt-1">
            当前设置:
            <span class="font-medium">
              {{ form.actionType === 4 ? form.linkUrl : form.targetNameName }}
            </span>
          </div>

        </div>
      </el-form-item>
      <el-form-item label="展示规则提示">
        <div class="bg-gray-50 p-3 rounded-md text-sm">
          <p class="text-gray-600">
            权重设置最高的前四个轮播图会显示在首页轮播图区域。
          </p>
        </div>
      </el-form-item>
    </el-form>
    <div class="mt-1 flex justify-center gap-12">
      <el-button @click="$emit('close')" class="w-25">取消</el-button>
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
import { ref, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {useBannerStore} from '@/stores/admin/banner'
import {updateImage} from '@/api/community/ImageOperate'
import {AddBannerAPI,UpdateBannerAPI} from '@/api/Admin/operation/banner'

// 数据
const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false
  },
  mockMusics: {
    type: Array,
    default: () => []
  },
  mockPlaylists: {
    type: Array,
    default: () => []
  }
});
let form = useBannerStore()?.form;
let clickType = {
  0: '无',
  4: '跳转链接',
  2: '跳转歌曲',
  1: '跳转歌单',
  3: '跳转秒杀活动'
}
let isUpdateImg = ref(false);    // 是否修改了图片

const modelValue = defineModel();

const emit = defineEmits(['submit', 'close', 'openActionDrawer','refreshList']);

const isDialogOpen = computed({
  get() {
    return modelValue.value;
  },
  set(value) {
    modelValue.value = value;
  }
});


// 存储上传的文件
let imgFile;
const imgFileUrl = ref(null);
const uploadFileList = ref([]);
const isSubmitting = ref(false);
watch(
  () => form.imageUrl,
  (newImageUrl) => {
    imgFileUrl.value = newImageUrl || null;
    if (newImageUrl) {
      uploadFileList.value = [{
        name: 'current-image',
        url: newImageUrl
      }];
    } else {
      uploadFileList.value = [];
    }
  },
  { immediate: true }
);

const handleImageChange = (file, fileList) => {       //
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
  if (!allowedTypes.includes(file.raw.type)) {
    ElMessage.error('只能上传图片文件！');
    if (fileList.length > 0) {
      fileList.pop();
    }
    return;
  }
  isUpdateImg.value = true;
  imgFile = file.raw;
  // 读取文件并更新预览
  const reader = new FileReader();
  reader.onload = (e) => {
    imgFileUrl.value = e.target.result;
  };

  reader.readAsDataURL(file.raw);
};

// 处理文件移除
const handleRemove = () => {
  form.imageUrl = '';
  if (imgFile) {
    URL.revokeObjectURL(imgFile.value); // 清理内存
  }
  imgFile = null;
  uploadFileList.value = [];
};

// 点击类型变化处理
const handleClickTypeChange = (value) => {
  // 初始化相关字段
  if (!value) {
    form.linkUrl = '';
    form.musicId = null;
    form.musicName = '';
    form.playlistId = null;
    form.playlistName = '';
  }
};

// 提交
async function handleSubmit(){
  if(!imgFile&&isUpdateImg.value){
    ElMessage.error('请上传图片！');
    return;
  }
  if(!form.title || !form.sortOrder || form.actionType === null){
    ElMessage.error('请填写完整表单！');
    return;
  }
  let subForm = toRaw(useBannerStore().form);
  if(isUpdateImg.value){
    let formData = new FormData();
    formData.append('file', imgFile);
    let imgUpdateRes = await updateImage(formData);
    subForm.imageUrl = imgUpdateRes.data;
  }else{
    subForm.imageUrl = form.imageUrl;
  }
  subForm.status = 0;
  if(props.isEditMode){
    delete subForm.targetName
    let res = await UpdateBannerAPI(subForm)
    if(res.success){
      ElMessage.success('修改成功！');
      emit('refreshList')
      emit('close');
    }else{
      ElMessage.error('修改失败！');
    }
  }else{
    delete subForm.targetName
    delete subForm.id
    let addRes = await AddBannerAPI(subForm)
    if(addRes.success){
      ElMessage.success('添加成功！');
      emit('refreshList')
      emit('close');
    }else{
      ElMessage.error('添加失败！');
    }
  }
}
</script>
