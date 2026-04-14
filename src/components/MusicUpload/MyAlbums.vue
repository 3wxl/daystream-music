<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">我的专辑</h2>
      <button
        @click="showCreateAlbumDialog = true"
        class="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg text-sm font-medium hover:bg-pink-500/10 transition-colors"
      >
        <i class="fa fa-plus mr-1"></i> 新建专辑
      </button>
    </div>

    <div v-if="albums.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="album in albums" :key="album.id" class="group relative">
        <div
          class="aspect-square rounded-xl overflow-hidden bg-gray-800 mb-3 relative cursor-pointer"
          @click="handleManageSongs(album)"
        >
          <img
            :src="album.coverUrl"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="w-8 h-8 rounded-full bg-black/50 items-center justify-center hover:bg-pink-500/80 transition-colors mr-2 inline-flex"
              @click.stop="handleSetting(album)"
            >
              <i class="fa fa-cog text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-full bg-black/50 items-center justify-center hover:bg-red-500/80 transition-colors inline-flex"
              @click.stop="handleDelete(album)"
            >
              <i class="fa fa-trash text-xs"></i>
            </button>
          </div>
        </div>
        <h3 class="font-medium text-sm truncate">{{ album.albumName }}</h3>
        <p class="text-xs text-gray-500">{{ album.musicCount }} 首歌曲</p>
      </div>
    </div>
    <el-empty v-else description="暂无专辑" :image-size="100"></el-empty>
  </div>

  <el-dialog
    v-model="showCreateAlbumDialog"
    :title="albumForm.id ? '编辑专辑' : '创建新专辑'"
    width="500px"
    class="dark-dialog"
  >
    <el-form 
      ref="createAlbumForm"
      :model="albumForm"
      :rules="albumUploadRule"
      label-position="top">
      <el-form-item label="专辑名称" prop="albumName">
        <el-input placeholder="请输入专辑名称" class="dark-input" v-model="albumForm.albumName"/>
      </el-form-item>
      <el-form-item label="专辑封面" prop="coverFile">
        <el-upload
          class="avatar-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><i class="fa fa-plus"></i></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="简介" prop="introduction">
        <el-input type="textarea" :rows="3" placeholder="介绍一下这张专辑..." class="dark-input" v-model="albumForm.introduction" />
      </el-form-item>
      <el-form-item label="发布日期" prop="releaseDate">
        <el-date-picker
          v-model="albumForm.releaseDate"
          type="date"
          placeholder="选择发布日期"
          class="dark-input w-full"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="专辑状态" prop="status">
        <el-radio-group v-model="albumForm.status">
          <el-radio :value="1" size="large">上架</el-radio>
          <el-radio :value="0" size="large">下架</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateAlbumDialog = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSaveAlbum">
          {{ albumForm.id ? '保存修改' : '立即创建' }}
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 歌曲关联管理弹窗 -->
  <el-dialog
    v-model="showManageSongsDialog"
    :title="`管理专辑曲目 - ${currentAlbum.albumName}`"
    width="650px"
    class="dark-dialog"
  >
    <div class="mb-4">
      <p class="text-sm text-gray-400 mb-3">勾选歌曲并点击“确认绑定”将其关联到此专辑</p>
      <div class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        <div v-if="userSongs.length > 0" class="space-y-2">
          <div
            v-for="song in userSongs"
            :key="song.id"
            class="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
          >
            <div class="flex items-center gap-3">
              <el-checkbox v-model="selectedSongIds" :label="song.id">
                <div class="flex items-center gap-3 ml-2">
                  <img :src="song.coverUrl" class="w-10 h-10 rounded object-cover" />
                  <div>
                    <p class="text-sm font-medium text-white">{{ song.musicName }}</p>
                    <p class="text-xs text-gray-500">{{ song.albumName || '未关联专辑' }}</p>
                  </div>
                </div>
              </el-checkbox>
            </div>
            <!-- 移除按钮样式预留 -->
            <button 
              class="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
              title="暂不支持移除功能"
            >
              移除预览
            </button>
          </div>
        </div>
        <el-empty v-else description="暂无可选歌曲" :image-size="60"></el-empty>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <span class="text-xs text-gray-500">已选择 {{ selectedSongIds.length }} 首歌曲</span>
        <div class="flex gap-3">
          <el-button @click="showManageSongsDialog = false">关闭</el-button>
          <el-button 
            type="primary" 
            :loading="binding" 
            :disabled="selectedSongIds.length === 0"
            @click="handleBindSongs"
          >
            确认绑定
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useUploadtRules } from '@/utils/rules/upload'
import { useUserStore } from '@/stores/user'
import type { FormInstance, UploadProps } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createAlbum, getMyAlbum, updateAlbum, bindSongsToAlbum, deleteAlbum } from '@/api/album'
import { getMyMusicList } from '@/api/music'

const userStore = useUserStore()
const imageUrl = ref('')
const loading = ref(false)
const binding = ref(false)
const showCreateAlbumDialog = ref(false)
const showManageSongsDialog = ref(false)
const userSongs = ref<any[]>([])
const selectedSongIds = ref<number[]>([])
const createAlbumForm = ref<FormInstance>()
const currentAlbum = ref<any>({})

const { albumUploadRule } = useUploadtRules()
const albumForm = reactive<any>({
  id: undefined,
  albumName: '',
  introduction: '',
  coverFile: '',
  status: 1,
  releaseDate: '',
  musicianId: userStore.userInfo.id
})

const resetForm = () => {
  albumForm.id = undefined
  albumForm.albumName = ''
  albumForm.introduction = ''
  albumForm.coverFile = ''
  albumForm.status = 1
  albumForm.releaseDate = ''
  imageUrl.value = ''
}

const handleAvatarChange: UploadProps['onChange'] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  albumForm.coverFile = uploadFile.raw as any
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('专辑封面必须为JPG or PNG格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('专辑封面大小不能超过2MB')
    return false
  }
  return true
}

const albums = ref<any[]>([])

const handleSetting = (album: any) => {
  resetForm()
  albumForm.id = album.id
  albumForm.albumName = album.albumName
  albumForm.introduction = album.introduction
  albumForm.status = album.status
  albumForm.releaseDate = album.releaseDate
  imageUrl.value = album.coverUrl
  showCreateAlbumDialog.value = true
}

const handleDelete = (album: any) => {
  ElMessageBox.confirm(`确定要删除专辑《${album.albumName}》吗？此操作不可逆。`, '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'error',
  }).then(async () => {
    try {
      const res = await deleteAlbum(album.id)
      if (res.success) {
        ElMessage.success('专辑删除成功')
        getAlbums()
      }
    } catch (e) {}
  })
}

const handleManageSongs = async (album: any) => {
  currentAlbum.value = album
  selectedSongIds.value = []
  showManageSongsDialog.value = true
  
  try {
    const res = await getMyMusicList(userStore.userInfo.id, 1, 100)
    if (res.success && res.data?.records) {
      userSongs.value = res.data.records.flat()
    }
  } catch (e) {}
}

const handleBindSongs = async () => {
  if (selectedSongIds.value.length === 0) return
  binding.value = true
  try {
    const res = await bindSongsToAlbum(currentAlbum.value.id, selectedSongIds.value)
    if (res.success) {
      ElMessage.success('歌曲关联成功')
      showManageSongsDialog.value = false
      getAlbums()
    }
  } catch (e) {
  } finally {
    binding.value = false
  }
}

const getAlbums = async () => {
  loading.value = true
  try {
    const res: any = await getMyAlbum(userStore.userInfo.id, '1', '40')
    if (res.success && res.data?.records) {
      albums.value = res.data.records.flat()
    }
  } catch (error) {
    console.error('获取专辑失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSaveAlbum = async () => {
  if (!createAlbumForm.value) return
  await createAlbumForm.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const fd = new FormData()
        if (albumForm.id) fd.append('id', String(albumForm.id))
        fd.append('albumName', albumForm.albumName)
        fd.append('introduction', albumForm.introduction || '')
        if (albumForm.coverFile) {
          fd.append('coverFile', albumForm.coverFile)
        }
        fd.append('status', String(albumForm.status))
        fd.append('musicianId', String(albumForm.musicianId))
        if (albumForm.releaseDate) fd.append('releaseDate', albumForm.releaseDate)

        const action = albumForm.id ? updateAlbum : createAlbum
        const res = await action(fd)
        if (res.success) {
          ElMessage.success(albumForm.id ? '更新专辑成功' : '创建专辑成功')
          showCreateAlbumDialog.value = false
          getAlbums()
        }
      } catch (error) {
        console.log(error, '操作专辑失败')
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.error('请填写完整信息')
    }
  })
}

onMounted(() => {
  getAlbums()
})
</script>
