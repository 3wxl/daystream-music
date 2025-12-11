<template>
   <div class="animate-fade-in">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">我的歌曲</h2>
            <router-link
              to="/musician/Upload"
              class="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm font-medium transition-colors"
            >
              上传新歌
            </router-link>
          </div>

          <div v-if="songs.length > 0" class="grid gap-4">
            <div
              v-for="song in songs"
              :key="song.id"
              class="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5 hover:border-pink-500/30 transition-all group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden">
                  <img v-if="song.cover" :src="song.cover" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                    <i class="fa fa-music"></i>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-white group-hover:text-pink-400 transition-colors">
                    {{ song.title }}
                  </h3>
                  <p class="text-xs text-gray-500">2023/12/01</p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <el-dropdown trigger="click">
                  <span class="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors">
                    <i class="fa fa-ellipsis-h text-gray-400"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu class="bg-[#222] border-gray-700">
                      <el-dropdown-item>添加到专辑</el-dropdown-item>
                      <el-dropdown-item>添加到歌单</el-dropdown-item>
                      <el-dropdown-item divided class="text-red-500">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无上传歌曲" :image-size="100"></el-empty>
        </div>
</template>

<script lang="ts" setup>
const songs = ref([
  {
    id: '1',
    title: 'Example Song 1',
    cover: 'https://picsum.photos/200',
  },
  {
    id: '2',
    title: 'Example Song 2',
    cover: 'https://picsum.photos/201',
  },
])

</script>

<style scoped>

</style>