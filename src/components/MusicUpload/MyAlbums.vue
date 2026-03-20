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
    title="创建新专辑"
    width="500px"
    custom-class="dark-dialog"
  >
    <el-form 
    ref="createAlbumForm"
    :model="albumForm"
    :rules="albumUploadRule"
    label-position="top">
      <el-form-item label="专辑名称">
        <el-input placeholder="请输入专辑名称" class="dark-input" v-model="albumForm.albumName"/>
      </el-form-item>
      <el-form-item label="歌单封面" prop="coverFile">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload"
          v-model="albumForm.coverFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :rows="3" placeholder="介绍一下这张专辑..." class="dark-input" v-model="albumForm.introduction" />
      </el-form-item>
      <el-form-item label="专辑状态" prop="status">
        <el-radio-group v-model="albumForm.status">
          <el-radio value="1" size="large">上架</el-radio>
          <el-radio value="0" size="large">下架</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateAlbumDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateAlbum">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUploadtRules } from '@/utils/rules/upload'
import { useUserStore } from '@/stores/user'
import type { CheckboxValueType, FormInstance, UploadProps } from 'element-plus'
import { createAlbum ,getMyAlbum} from '@/api/album'

const imageUrl = ref('')
const loading = ref(false)
const showCreateAlbumDialog = ref(false)
const showManageAlbumDialog = ref(false)
const currentAlbumName = ref('')
const createAlbumForm = ref<FormInstance>()


const {albumUploadRule} = useUploadtRules()
const albumForm = reactive({
  albumName:'',
  introduction:'',
  coverFile:'',
  status:'1',
  musicianId:useUserStore().userInfo.id
})

const handleAvatarChange: UploadProps['onChange'] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  albumForm.coverFile = uploadFile.raw as any
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('专辑封面必须为JPG或PNG格式')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('专辑封面大小不能超过2MB')
    return false
  }
  return true
}

const songs = ref([
  { id: '1', title: 'Song A' },
  { id: '2', title: 'Song B' },
  { id: '3', title: 'Song C' },
])

const albums = ref([])

const manageAlbum = (album: any) => {
  currentAlbumName.value = album.title
  showManageAlbumDialog.value = true
}

const handleSetting = (album: any) => {
  console.log('Settings clicked', album)
}

const handleDelete = (album: any) => {
  console.log('Delete clicked', album)
}

// 获取专辑列表
const getAlbums = async () => {
  const res = await getMyAlbum(1,40)
  albums.value = res.data.records.flat()
  console.log(albums.value)
  loading.value = false
}

const handleCreateAlbum = async () => {
  if(!createAlbumForm.value) return
  await createAlbumForm.value.validate( async (valid) => {
    if(valid){
      loading.value = true
      try {
        const fd = new FormData()
        fd.append('albumName', albumForm.albumName)
        fd.append('introduction', albumForm.introduction)
        if(albumForm.coverFile){
          fd.append('coverFile', albumForm.coverFile)
        }
        fd.append('status', albumForm.status)
        fd.append('musicianId', albumForm.musicianId)

        await createAlbum(fd)
        ElMessage.success('创建专辑成功')
        showCreateAlbumDialog.value = false
        // 更新专辑列表
        getAlbums()
      } catch (error) {
         console.log(error, '创建歌单失败')
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
