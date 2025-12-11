<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">我的歌单</h2>
      <button
        @click="showCreatePlaylistDialog = true"
        class="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-500/10 transition-colors"
      >
        <i class="fa fa-plus mr-1"></i> 新建歌单
      </button>
    </div>

    <div v-if="playlists.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="playlist in playlists" :key="playlist.id" class="group relative">
        <div
          class="aspect-square rounded-xl overflow-hidden bg-gray-800 mb-3 relative cursor-pointer"
        >
          <img
            :src="playlist.cover"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute top-2 right-2">
            <button
              class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <i class="fa fa-trash text-xs"></i>
            </button>
          </div>
        </div>
        <h3 class="font-medium text-sm truncate">{{ playlist.title }}</h3>
      </div>
    </div>
    <el-empty v-else description="暂无歌单" :image-size="100"></el-empty>
  </div>

  <el-dialog
    v-model="showCreatePlaylistDialog"
    title="创建新歌单"
    width="500px"
    custom-class="dark-dialog"
    ref="creatPlaylistRef"
    :model="playlistForm"
    :rules="playlistRules"
  >
    <el-form label-position="top">
      <el-form-item label="歌单名称" prop="name">
        <el-input placeholder="请输入歌单名称" class="dark-input" />
      </el-form-item>
      <el-form-item label="歌单封面" prop="coverFile">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="歌单描述" prop="description">
        <el-input placeholder="请输入歌单描述" class="dark-input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreatePlaylistDialog = false">取消</el-button>
        <el-button type="primary" @click="showCreatePlaylistDialog = false">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
const imageUrl = ref('')


const handleAvatarChange: UploadProps['onChange'] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片必须为JPG或PNG格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过2MB')
    return false
  }
  return true
}



const showCreatePlaylistDialog = ref(false)

const playlists = ref([
  {
    id: '1',
    title: 'Favorites',
    cover: 'https://picsum.photos/302',
  },
])
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
