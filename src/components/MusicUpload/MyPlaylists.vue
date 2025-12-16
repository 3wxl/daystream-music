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

    <div v-if="playlist.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="playlistItem in playlist" :key="playlistItem.id" class="group relative">
        <div
          class="aspect-square rounded-xl overflow-hidden bg-gray-800 mb-3 relative cursor-pointer"
        >
          <img
            :src="playlistItem.cover"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute top-2 right-2">
            <button
              class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-pink-500/80 transition-colors mr-2"
              @click.stop="openDetailDrawer(playlistItem)"
            >
              <i class="fa fa-cog text-xs"></i>
            </button>
            <button
              class="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <i
                class="fa fa-trash text-xs"
                @click.stop="handleDeletePlaylist(playlistItem.id)"
              ></i>
            </button>
          </div>
        </div>
        <h3 class="font-medium text-sm truncate">{{ playlistItem.name }}</h3>
      </div>
    </div>
    <el-empty v-else description="暂无歌单" :image-size="100"></el-empty>

    <!-- 详情抽屉 -->
    <PlaylistDetailDrawer v-model:visible="showDetailDrawer" :playlist-id="currentPlaylistId" />
  </div>

  <el-dialog
    v-model="showCreatePlaylistDialog"
    title="创建新歌单"
    width="500px"
    custom-class="dark-dialog"
  >
    <el-form
      ref="creatPlaylistRef"
      :model="playlistForm"
      :rules="playlistUploadRule"
      label-position="top"
    >
      <el-form-item label="歌单名称" prop="name">
        <el-input placeholder="请输入歌单名称" class="dark-input" v-model="playlistForm.name" />
      </el-form-item>
      <el-form-item label="歌单封面" prop="coverFile">
        <el-upload
          class="avatar-uploader"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :before-upload="beforeAvatarUpload"
          v-model="playlistForm.coverFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="歌单描述" prop="description">
        <el-input
          placeholder="请输入歌单描述"
          class="dark-input"
          v-model="playlistForm.description"
        />
      </el-form-item>
      <el-form-item label="歌单状态" prop="isPublic">
        <el-radio-group v-model="playlistForm.isPublic">
          <el-radio value="1" size="large">公开</el-radio>
          <el-radio value="0" size="large">私密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="歌单标签" prop="tagsIds">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group v-model="playlistForm.tagsIds" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="tag in tagsData" :key="tag.id" :label="tag.tagName" :value="tag.id">
            {{ tag.tagName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreatePlaylistDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePlaylist()" :disabled="loading"
          >创建</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { createPlaylist, deletePlaylist, getAllTags, getUserPlaylist } from '@/api/playlist'
import { useUploadtRules } from '@/utils/rules/upload'
import { Plus } from '@element-plus/icons-vue'
import type { CheckboxValueType, FormInstance, UploadProps } from 'element-plus'
import PlaylistDetailDrawer from './PlaylistDetailDrawer.vue'

const loading = ref(false)
const imageUrl = ref('')
const tagsData = ref<any[]>([])
const checkAll = ref(false)
const playlist = ref([])
const isIndeterminate = ref(true)
const creatPlaylistRef = ref<FormInstance>()
const showDetailDrawer = ref(false)
const currentPlaylistId = ref('')

const openDetailDrawer = (item: any) => {
  currentPlaylistId.value = item.id
  showDetailDrawer.value = true
}

const playlistForm = ref({
  name: '',
  description: '',
  coverFile: '',
  tagsIds: [] as string[],
  isPublic: '1',
})

const { playlistUploadRule } = useUploadtRules()

const handleAvatarChange: UploadProps['onChange'] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  playlistForm.value.coverFile = uploadFile.raw as any
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

const handleCheckAllChange = (val: CheckboxValueType) => {
  playlistForm.value.tagsIds = val ? tagsData.value.map((item) => item.id) : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === tagsData.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < tagsData.value.length
}

const showCreatePlaylistDialog = ref(false)

// 获取列表
const getPlaylistData = () => {
  loading.value = true
  getUserPlaylist(1, 40)
    .then((res) => {
      playlist.value = res.data.records.flat()
      console.log(playlist.value)
    })
    .finally(() => {
      loading.value = false
    })
}
const handleCreatePlaylist = async () => {
  if (!creatPlaylistRef.value) return
  await creatPlaylistRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const fd = new FormData()

        fd.append('name', playlistForm.value.name)
        fd.append('description', playlistForm.value.description)
        fd.append('isPublic', playlistForm.value.isPublic)
        // 添加文件对象
        if (playlistForm.value.coverFile) {
          fd.append('coverFile', playlistForm.value.coverFile)
        }
        // 处理tagIds数组
        if (playlistForm.value.tagsIds && playlistForm.value.tagsIds.length > 0) {
          playlistForm.value.tagsIds.forEach((tag) => {
            fd.append('tagIds', tag)
          })
        }

        await createPlaylist(fd)
        ElMessage.success('歌单创建成功')
        showCreatePlaylistDialog.value = false
        // 对歌单列表进行刷新处理
        getPlaylistData()
      } catch (error) {
        console.log(error, '创建歌单失败')
      }
    } else {
      ElMessage.warning('请检查表单填写是否完整')
    }
  })
}

const handleDeletePlaylist = (id: string) => {
  deletePlaylist(id).then((res) => {
    ElMessage.success('歌单删除成功')
    getPlaylistData()
  })
}

onMounted(() => {
  getAllTags().then((res) => {
    const flatList = Object.values(res.data).flat()
    console.log(flatList)
    tagsData.value = [...flatList]
    console.log(tagsData.value)
  })

  getPlaylistData()
})
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

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
