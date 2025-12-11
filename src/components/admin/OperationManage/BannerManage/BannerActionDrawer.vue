<template>
  <el-drawer
    title="点击行为设置"
    v-model="visible"
    direction="rtl"
    size="50%"
    :close-on-click-modal="false"
  >
    <div class="h-full flex flex-col">
      <el-tabs v-model="activeTab" type="card" class="mb-4">
        <el-tab-pane label="链接设置" name="link" v-if="form.clickType === 'link' || form.clickType === ''" />
        <el-tab-pane label="音乐选择" name="music" v-if="form.clickType === 'music' || form.clickType === ''" />
        <el-tab-pane label="歌单选择" name="playlist" v-if="form.clickType === 'playlist' || form.clickType === ''" />
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
          <el-form-item label="打开方式">
            <el-radio-group v-model="form.linkTarget">
              <el-radio label="_blank">新窗口打开</el-radio>
              <el-radio label="_self">当前窗口打开</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 音乐选择 -->
        <div v-if="activeTab === 'music'">
          <div class="mb-4">
            <AdminInput
              v-model="musicSearchKeyword"
              placeholder="搜索音乐名称或歌手"
              prefix="&#xe65c;"
              width="100%"
            ></AdminInput>
          </div>
          <div class="rounded-md overflow-hidden">
            <el-table
              :data="filteredMusics"
              height="590"
              @row-click="selectMusic"
              :row-class-name="(row) => row.id === form.musicId ? 'bg-blue-50' : ''"
              stripe
            >
              <el-table-column label="音乐封面" width="130" align="center">
                <template #default="scope">
                  <div class="group flex justify-center relative cursor-pointer">
                    <img src="../../../../public/头像.png" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[6px]">
                    <div class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100">
                      <IconFontSymbol name="bofang" class="text-[white] relative top-[10px]" size="20px"></IconFontSymbol>
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
              <el-pagination background layout="prev, pager, next ,jumper" :total="100" :default-page-size="8" />
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
              :row-class-name="(row) => row.id === form.playlistId ? 'bg-blue-50' : ''"
              stripe
            >
              <el-table-column label="歌单名称" prop="name" width="200"/>
              <el-table-column label="歌曲数量" prop="songCount" width="100" />
              <el-table-column label="创建时间" prop="createTime" width="180" />
              <el-table-column label="描述" prop="description" />
            </el-table>
            <div class="admin-page mt-2 mb-4 flex justify-end mr-12">
              <el-pagination background layout="prev, pager, next ,jumper" :total="100" :default-page-size="8" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" class="bg-blue-500 hover:bg-blue-600 text-white">
          确认选择
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import AdminInput from '@/components/admin/AdminInput.vue';

// 1. 接收父组件传递的 modelValue（控制抽屉显隐）
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  form: { type: Object, required: true },
  mockMusics: { type: Array, required: true },
  mockPlaylists: { type: Array, required: true }
});

// 2. 定义事件（更新 modelValue + 确认事件）
const emit = defineEmits(['update:modelValue', 'confirm']);

// 3. 核心修复：定义内部响应式变量，同步 props.modelValue
const visible = ref(props.modelValue);

// 4. 监听内部 visible 变化，同步给父组件
watch(visible, (newVal) => {
  emit('update:modelValue', newVal);
});

// 5. 监听父组件 modelValue 变化，同步到内部 visible（双向同步）
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal;
});

// 其他原有逻辑
const activeTab = ref('link');
const musicSearchKeyword = ref('');
const playlistSearchKeyword = ref('');

// 过滤音乐/歌单
const filteredMusics = computed(() => {
  if (!musicSearchKeyword.value) return props.mockMusics;
  const keyword = musicSearchKeyword.value.toLowerCase();
  return props.mockMusics.filter(m =>
    m.name.toLowerCase().includes(keyword) ||
    m.singer.toLowerCase().includes(keyword) ||
    m.album.toLowerCase().includes(keyword)
  );
});

const filteredPlaylists = computed(() => {
  if (!playlistSearchKeyword.value) return props.mockPlaylists;
  const keyword = playlistSearchKeyword.value.toLowerCase();
  return props.mockPlaylists.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.description.toLowerCase().includes(keyword)
  );
});

// 监听点击类型切换tab
watch(() => props.form.clickType, (newVal) => {
  if (newVal) activeTab.value = newVal;
}, { immediate: true });

// 选择音乐/歌单
const selectMusic = (music) => {
  props.form.musicId = music.id;
  props.form.musicName = music.name;
};

const selectPlaylist = (playlist) => {
  props.form.playlistId = playlist.id;
  props.form.playlistName = playlist.name;
};

// 确认/取消
const handleConfirm = () => {
  if (props.form.clickType === 'link' && !props.form.linkUrl) {
    return ElMessage.warning('请输入跳转链接');
  }
  if (props.form.clickType === 'music' && !props.form.musicId) {
    return ElMessage.warning('请选择音乐');
  }
  if (props.form.clickType === 'playlist' && !props.form.playlistId) {
    return ElMessage.warning('请选择歌单');
  }
  emit('confirm', props.form);
  visible.value = false; // 确认后关闭抽屉
};

const handleCancel = () => {
  visible.value = false; // 取消后关闭抽屉
};
</script>

<style scoped>
:deep(.el-table__row.bg-blue-50) { background-color: #eff6ff !important; }
:deep(.el-table__row.bg-blue-50:hover > td) { background-color: #eff6ff !important; }
:deep(.gedanSelect .el-table__row) { height: 70px; }
</style>
