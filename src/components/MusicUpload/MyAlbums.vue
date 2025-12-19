<template>
  <div class="animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">我的专辑</h2>
      <button
        @click="showCreateAlbumDialog = true"
        class="px-4 py-2 bg-linear-to-r from-pink-500 to-orange-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <i class="fa fa-plus mr-1"></i> 创建专辑
      </button>
    </div>

    <div v-if="albums.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div v-for="album in albums" :key="album.id" class="group relative">
        <div
          class="aspect-square rounded-xl overflow-hidden bg-gray-800 mb-3 relative cursor-pointer"
          @click="manageAlbum(album)"
        >
          <img
            :src="album.cover"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2"
          >
            <button
              class="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs hover:bg-white/30 transition-colors"
            >
              管理歌曲
            </button>
          </div>
        </div>
        <h3 class="font-medium text-sm truncate">{{ album.title }}</h3>
        <p class="text-xs text-gray-500">{{ album.songCount }} 首歌曲</p>
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
    <el-form label-position="top">
      <el-form-item label="专辑名称">
        <el-input placeholder="请输入专辑名称" class="dark-input" />
      </el-form-item>
      <el-form-item label="封面URL">
        <el-input placeholder="请输入封面链接" class="dark-input" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :rows="3" placeholder="介绍一下这张专辑..." class="dark-input" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateAlbumDialog = false">取消</el-button>
        <el-button type="primary" @click="showCreateAlbumDialog = false">创建</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const showCreateAlbumDialog = ref(false)
const showManageAlbumDialog = ref(false)
const currentAlbumName = ref('')

const songs = ref([
  { id: '1', title: 'Song A' },
  { id: '2', title: 'Song B' },
  { id: '3', title: 'Song C' },
])

const albums = ref([
  {
    id: '1',
    title: 'My Debut Album',
    cover: 'https://picsum.photos/300',
    songCount: 12,
  }, {
    id: '2',
    title: 'My Second Album',
    cover: 'https://picsum.photos/300',
    songCount: 12,
  },
])

const manageAlbum = (album: any) => {
  currentAlbumName.value = album.title
  showManageAlbumDialog.value = true
}
</script>
