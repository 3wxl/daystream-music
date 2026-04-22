<template>
  <el-drawer
    title="点击行为设置"
    v-model="visible"
    direction="rtl"
    size="45%"
    :close-on-click-modal="true"
  >
    <div class="h-full flex flex-col">
      <el-tabs v-model="activeTab" type="card" class="mb-4">
        <el-tab-pane label="链接设置" name="link" />
        <el-tab-pane label="音乐选择" name="music" />
        <el-tab-pane label="歌单选择" name="playlist" />
        <el-tab-pane label="秒杀活动" name="activity" />
      </el-tabs>

      <div class="flex-1 overflow-auto">
        <!-- 链接设置 -->
        <div v-if="activeTab === 'link'">
          <el-form-item label="跳转链接" class="mb-4">
            <AdminInput
              v-model="form.linkUrl"
              placeholder="请输入完整链接地址（http:// 或 https:// 开头）"
              class="w-full"
              width="100%"
            ></AdminInput>
            <p class="text-xs text-gray-500 mt-1">示例：https://www.example.com</p>
          </el-form-item>
          <!-- <el-form-item label="打开方式">
            <el-radio-group v-model="form.linkTarget">
              <el-radio label="_blank">新窗口打开</el-radio>
              <el-radio label="_self">当前窗口打开</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </div>

        <!-- 音乐选择 -->
        <div v-if="activeTab === 'music'">
          <div class="mb-4">
            <AdminInput
              v-model="musicSearchKeyword"
              placeholder="搜索音乐名称或歌手"
              prefix="&#xe65c;"
              width="100%"
              type="url"
            ></AdminInput>
          </div>
          <div class="rounded-md overflow-hidden">
            <el-table
              :data="filteredMusics"
              height="590"
              @row-click="selectMusic"
              :row-class-name="(row) => (row.id === form.musicId ? 'bg-blue-50' : '')"
              stripe
            >
              <el-table-column label="音乐封面" width="130" align="center">
                <template #default="scope">
                  <div class="group flex justify-center relative cursor-pointer">
                    <img :src="avatarUrl" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[6px]" />
                    <div
                      class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100"
                    >
                      <IconFontSymbol
                        name="bofang"
                        class="text-[white] relative top-[10px]"
                        size="20px"
                      ></IconFontSymbol>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="音乐名称" prop="name" width="200" />
              <el-table-column label="歌手" prop="singer" width="150" />
              <el-table-column label="专辑" prop="album" />
              <el-table-column label="时长" prop="duration" width="100" />
            </el-table>
            <div class="admin-page mt-2 mb-4 flex justify-end mr-12">
              <el-pagination
                background
                layout="prev, pager, next ,jumper"
                :total="100"
                :default-page-size="8"
              />
            </div>
          </div>
        </div>

        <!-- 歌单选择 -->
        <div v-if="activeTab === 'playlist'">
          <div class="mb-4">
            <AdminInput
              v-model="playlistSearchKeyword"
              placeholder="搜索歌单名称"
              prefix="&#xe65c;"
              width="100%"
            ></AdminInput>
          </div>
          <div class="rounded-md overflow-hidden h-[calc(100%-40px)] gedanSelect">
            <el-table
              :data="filteredPlaylists"
              :height="600"
              @row-click="selectPlaylist"
              :row-class-name="(row) => (row.id === form.playlistId ? 'bg-blue-50' : '')"
              stripe
            >
              <el-table-column label="歌单名称" prop="name" width="200" />
              <el-table-column label="歌曲数量" prop="songCount" width="100" />
              <el-table-column label="创建时间" prop="createTime" width="180" />
              <el-table-column label="描述" prop="description" />
            </el-table>
            <div class="admin-page mt-2 mb-4 flex justify-end mr-12">
              <el-pagination
                background
                layout="prev, pager, next ,jumper"
                :total="100"
                :default-page-size="8"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          class="bg-blue-500 hover:bg-blue-600 text-white"
        >
          确认选择
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import avatarUrl from '@/assets/头像.png'
import { ref, watch, computed, defineProps, defineModel } from 'vue'
import { useBannerStore } from '@/stores/admin/banner'
let visible = defineModel()
let form = useBannerStore()?.form

let activeTab = ref('link') // 当前激活的标签页
let Data = ref(null) // 列表数据

watch(
  () => form.actionType,
  (newVal) => {
    // 仅作更新抽屉标头
    if (newVal === 4) activeTab.value = 'link'
    else if (newVal === 2) activeTab.value = 'music'
    else if (newVal === 1) activeTab.value = 'playlist'
    else if (newVal === 3) activeTab.value = 'activity'
  },
  { immediate: true },
)
watch(activeTab, (newVal) => {
  // 更新表单
  if (newVal === 'link') {
    changeActionType(4)
  } else if (newVal === 'music') {
    changeActionType(2)
  } else if (newVal === 'playlist') {
    changeActionType(1)
  } else if (newVal === 'activity') {
    changeActionType(3)
  }
})
// 事件处理
function handleCancel() {
  visible.value = false
}
function changeActionType(val) {
  form.actionType = val
}
onMounted(() => {})
</script>

<style scoped>
:deep(.el-table__row.bg-blue-50) {
  background-color: #eff6ff !important;
}
:deep(.el-table__row.bg-blue-50:hover > td) {
  background-color: #eff6ff !important;
}
:deep(.gedanSelect .el-table__row) {
  height: 70px;
}
::v-deep(.el-table__row) {
  height: 60px;
}
::v-deep .admin-page .btn-prev {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-prev:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-prev .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .btn-next {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .btn-next:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .btn-next .el-icon {
  font-size: 16px;
  position: relative;
  left: 5px;
}
::v-deep .admin-page .el-pager .number {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .number:hover {
  border-color: #0084ff;
}
::v-deep .admin-page .el-pager .more {
  border: 1px solid #cecece;
  border-radius: 8px;
  color: #8e8e8e;
  background-color: rgb(255, 255, 255);
  font-family:
    Microsoft Yahei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif;
  width: 35px;
  height: 35px;
  text-align: center;
}
::v-deep .admin-page .el-pager .more:hover {
  border-color: #0084ff;
}
</style>
