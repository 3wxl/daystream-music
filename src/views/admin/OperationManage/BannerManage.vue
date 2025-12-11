<template>
  <div class="min-h-screen shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
    <!-- 头部操作区 -->
    <BannerHeader
      @openAddDialog="openAddDialog"
      @refreshData="refreshData"
      @preview="isPreview = true"
      :searchKeyword="searchKeyword"
      @searchChange="searchKeyword = $event"
    />

    <!-- 展示规则提示 -->
    <BannerRuleTip />

    <!-- 轮播图表格列表 -->
    <BannerListTable
      :filteredBanners="filteredBanners"
      :formatDate="formatDate"
      :isActive="isActive"
      :isCurrentlyDisplayed="isCurrentlyDisplayed"
      :getClickTypeText="getClickTypeText"
      :getClickTypeTagType="getClickTypeTagType"
    />

    <!-- 当前展示的轮播图 -->
    <BannerDisplayList
      :currentDisplayBanners="currentDisplayBanners"
      :formatDate="formatDate"
      :currentDisplayUpdateTime="currentDisplayUpdateTime"
      :getClickTypeText="getClickTypeText"
      :getClickTypeTagType="getClickTypeTagType"
    />

    <!-- 所有轮播图卡片列表 -->
    <BannerAllList
      :filteredBanners="filteredBanners"
      @openEditDialog="openEditDialog"
      @handleDelete="handleDelete"
      :formatDate="formatDate"
      :isActive="isActive"
      :isCurrentlyDisplayed="isCurrentlyDisplayed"
      :getClickTypeText="getClickTypeText"
      :getClickTypeTagType="getClickTypeTagType"
    />

    <!-- 预览组件 -->
    <BannerPreview v-model="isPreview" :bannerData="currentDisplayBanners"></BannerPreview>

    <!-- 一些其它组件挂载 -->
    <BannerFormDialog
      v-model="isDialogOpen"
      :isEditMode="isEditMode"
      :form="form"
      :formRules="formRules"
      :mockMusics="mockMusics"
      :mockPlaylists="mockPlaylists"
      @submit="submitForm"
      @close="closeDialog"
      @openActionDrawer="isActionDrawerOpen = true"
    />

    <BannerActionDrawer
      v-model="isActionDrawerOpen"
      :form="form"
      :mockMusics="mockMusics"
      :mockPlaylists="mockPlaylists"
      @confirm="confirmActionSetting"
    />

    <BannerDeleteDialog
      v-model="isDeleteDialogOpen"
      :isDeleting="isDeleting"
      @confirm="confirmDelete"
      @cancel="isDeleteDialogOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

// 导入子组件
import BannerHeader from '@/components/admin/OperationManage/BannerManage/BannerHeader.vue';
import BannerRuleTip from '@/components/admin/OperationManage/BannerManage/BannerRuleTip.vue';
import BannerListTable from '@/components/admin/OperationManage/BannerManage/BannerListTable.vue';
import BannerDisplayList from '@/components/admin/OperationManage/BannerManage/BannerDisplayList.vue';
import BannerAllList from '@/components/admin/OperationManage/BannerManage/BannerAllList.vue';
import BannerFormDialog from '@/components/admin/OperationManage/BannerManage/BannerFormDialog.vue';
import BannerActionDrawer from '@/components/admin/OperationManage/BannerManage/BannerActionDrawer.vue';
import BannerDeleteDialog from '@/components/admin/OperationManage/BannerManage/BannerDeleteDialog.vue';
import BannerPreview from '@/components/admin/OperationManage/BannerPreview.vue';

// 模拟数据
  // 模拟音乐数据
const mockMusics = ref([
  { id: 1, name: '晴天', singer: '周杰伦', album: '叶惠美', duration: '4:29', url: 'music/1.mp3' },
  { id: 2, name: '七里香', singer: '周杰伦', album: '七里香', duration: '4:59', url: 'music/2.mp3' },
  { id: 3, name: '告白气球', singer: '周杰伦', album: '周杰伦的床边故事', duration: '3:35', url: 'music/3.mp3' },
  { id: 4, name: '小幸运', singer: '田馥甄', album: '我的少女时代 电影原声带', duration: '4:04', url: 'music/4.mp3' },
  { id: 5, name: '光年之外', singer: '邓紫棋', album: '光年之外', duration: '3:59', url: 'music/5.mp3' },
  { id: 6, name: '起风了', singer: '买辣椒也用券', album: '起风了', duration: '5:23', url: 'music/6.mp3' },
  { id: 7, name: '水星记', singer: '郭顶', album: '飞行器的执行周期', duration: '5:25', url: 'music/7.mp3' },
  { id: 8, name: '消愁', singer: '毛不易', album: '平凡的一天', duration: '5:13', url: 'music/8.mp3' },
]);
  // 模拟歌单数据
const mockPlaylists = ref([
  { id: 1, name: '华语流行精选', songCount: 30, createTime: '2025-10-01', description: '汇集当下最热门的华语流行歌曲' },
  { id: 2, name: '经典老歌回顾', songCount: 45, createTime: '2025-09-15', description: '那些年我们一起听过的经典老歌' },
  { id: 3, name: '轻音乐合集', songCount: 28, createTime: '2025-09-20', description: '放松心情的纯音乐精选' },
  { id: 4, name: '摇滚精选', songCount: 36, createTime: '2025-10-05', description: '热血沸腾的摇滚歌曲集合' },
  { id: 5, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 6, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 7, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
  { id: 8, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
]);

// 当前轮播图数据
const banners = ref([
  {
    id: 0,
    name: '默认轮播图',
    imageUrl: 'https://picsum.photos/id/1005/1920/500',
    startTime: new Date('2025-01-01 00:00:00'),
    endTime: new Date('2030-12-31 23:59:59'),
    isDefault: true,
    clickType: 'link',
    linkUrl: 'https://www.example.com',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 1,
    name: '首页顶部轮播1',
    imageUrl: 'https://picsum.photos/id/237/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'link',
    linkUrl: 'https://www.example.com/promotion',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 2,
    name: '首页顶部轮播2',
    imageUrl: 'https://picsum.photos/id/238/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'music',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: 3,
    musicName: '告白气球',
    playlistId: '',
    playlistName: ''
  },
  {
    id: 3,
    name: '首页顶部轮播3',
    imageUrl: 'https://picsum.photos/id/239/1920/500',
    startTime: new Date('2025-11-28 00:00:00'),
    endTime: new Date('2025-12-05 23:59:59'),
    isDefault: false,
    clickType: 'playlist',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: 1,
    playlistName: '华语流行精选'
  }
]);

// 状态管理
const searchKeyword = ref('');            // 搜索关键字
const isDialogOpen = ref(false);          // 是否显示表单对话框
const isDeleteDialogOpen = ref(false);    // 是否显示删除对话框
const isActionDrawerOpen = ref(false);    // 是否显示操作抽屉
const isEditMode = ref(false);            // 当前操作是编辑还是添加
const isSubmitting = ref(false);          // 是否正在提交表单
const isDeleting = ref(false);            // 是否正在删除
const isPreview = ref(false);             // 是否正在预览
const deleteId = ref(null);               // 当前正在删除的轮播图ID
const currentDisplayUpdateTime = ref(new Date());

// 表单数据
const form = ref({
  id: '',
  name: '',
  imageUrl: '',
  startTime: new Date(),
  endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
  isDefault: false,
  clickType: '',
  linkUrl: '',
  linkTarget: '_blank',
  musicId: '',
  musicName: '',
  playlistId: '',
  playlistName: ''
});

// 表单校验规则
const formRules = ref({
  name: [
    { required: true, message: '请输入轮播图名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  imageUrl: [
    { required: true, message: '请上传轮播图', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (form.value.startTime && new Date(value) <= new Date(form.value.startTime)) {
          callback(new Error('结束时间必须晚于开始时间'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  clickType: [{ required: false, message: '请选择点击类型', trigger: 'change' }],
  linkUrl: [
    {
      required: (() => form.value.clickType === 'link'),
      message: '请输入跳转链接',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (form.value.clickType === 'link' && value) {
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
          if (!urlRegex.test(value)) {
            callback(new Error('请输入有效的链接地址'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    }
  ],
  musicId: [
    {
      required: (() => form.value.clickType === 'music'),
      message: '请选择音乐',
      trigger: 'change'
    }
  ],
  playlistId: [
    {
      required: (() => form.value.clickType === 'playlist'),
      message: '请选择歌单',
      trigger: 'change'
    }
  ]
});

// 计算属性
const filteredBanners = computed(() => {
  if (!searchKeyword.value) return banners.value;
  const keyword = searchKeyword.value.toLowerCase();
  return banners.value.filter(banner => banner.name.toLowerCase().includes(keyword));
});

const currentDisplayBanners = computed(() => {
  const now = new Date();
  const allBanners = [...banners.value];
  const defaultBanner = allBanners.find(b => b.isDefault) || null;
  const activeBanners = allBanners.filter(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    return start <= now && end >= now;
  });

  let displayBanners = [...activeBanners];
  if (displayBanners.length < 4) {
    const futureBanners = allBanners.filter(b => {
      const start = new Date(b.startTime);
      return start > now && !displayBanners.some(d => d.id === b.id);
    });
    futureBanners.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const needCount = 4 - displayBanners.length;
    displayBanners = [...displayBanners, ...futureBanners.slice(0, needCount)];
  }

  if (displayBanners.length < 4 && defaultBanner && !displayBanners.some(b => b.isDefault)) {
    displayBanners.push(defaultBanner);
    while (displayBanners.length < 4) {
      displayBanners.push({
        ...defaultBanner,
        id: `default_${displayBanners.length}`,
        name: `默认轮播图(${displayBanners.length})`
      });
    }
  }

  if (displayBanners.length > 4) {
    displayBanners.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return 1;
      if (!a.isDefault && b.isDefault) return -1;
      return b.id - a.id;
    });
    displayBanners = displayBanners.slice(0, 4);
  }

  return displayBanners;
});

// 生命周期 & 监听
onMounted(() => {
  updateCurrentDisplayBanners();
  watch(banners, updateCurrentDisplayBanners, { deep: true });
  setInterval(updateCurrentDisplayBanners, 3600000);
});

// 工具方法
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const isActive = (banner) => {
  const now = new Date();
  return new Date(banner.startTime) <= now && new Date(banner.endTime) >= now;
};

const isCurrentlyDisplayed = (banner) => {
  return currentDisplayBanners.value.some(d => d.id === banner.id || (d.isDefault && banner.isDefault));
};

const getClickTypeText = (type) => {
  switch(type) {
    case 'link': return '跳转链接';
    case 'music': return '播放音乐';
    case 'playlist': return '播放歌单';
    default: return '无';
  }
};

const getClickTypeTagType = (type) => {
  switch(type) {
    case 'link': return 'primary';
    case 'music': return 'success';
    case 'playlist': return 'warning';
    default: return 'default';
  }
};

const updateCurrentDisplayBanners = () => {
  currentDisplayUpdateTime.value = new Date();
  nextTick(() => ElMessage.success('当前展示轮播图已更新'));
};

// 业务方法
const openAddDialog = () => {
  isEditMode.value = false;
  form.value = {
    id: '',
    name: '',
    imageUrl: '',
    startTime: new Date(),
    endTime: new Date(new Date().setDate(new Date().getDate() + 7)),
    isDefault: false,
    clickType: '',
    linkUrl: '',
    linkTarget: '_blank',
    musicId: '',
    musicName: '',
    playlistId: '',
    playlistName: ''
  };
  isDialogOpen.value = true;
};

const openEditDialog = (banner) => {
  isEditMode.value = true;
  form.value = { ...banner };
  isDialogOpen.value = true;
};

const closeDialog = () => {
  isDialogOpen.value = false;
};

const submitForm = async (formData) => {
  try {
    isSubmitting.value = true;
    if (isEditMode.value) {
      const index = banners.value.findIndex(b => b.id === formData.id);
      if (index !== -1) {
        banners.value[index] = { ...formData };
        ElMessage.success(`${formData.isDefault ? '默认' : ''}轮播图编辑成功`);
      }
    } else {
      const customCount = banners.value.filter(b => !b.isDefault).length;
      if (customCount >= 20) {
        ElMessage.error('自定义轮播图数量已达上限');
        isSubmitting.value = false;
        return;
      }
      const newBanner = { ...formData, id: Date.now(), isDefault: false };
      banners.value.push(newBanner);
      ElMessage.success('轮播图添加成功');
    }
    isDialogOpen.value = false;
  } catch (error) {
    ElMessage.error('提交失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = (id) => {
  const banner = banners.value.find(b => b.id === id);
  if (banner?.isDefault) return ElMessage.error('默认轮播图不可删除');
  deleteId.value = id;
  isDeleteDialogOpen.value = true;
};

const confirmDelete = () => {
  try {
    isDeleting.value = true;
    banners.value = banners.value.filter(b => b.id !== deleteId.value);
    ElMessage.success('轮播图删除成功');
    isDeleteDialogOpen.value = false;
  } catch (error) {
    ElMessage.error('删除失败');
  } finally {
    isDeleting.value = false;
  }
};

const confirmActionSetting = (formData) => {
  form.value = { ...form.value, ...formData };
  isActionDrawerOpen.value = false;
  ElMessage.success('点击行为设置成功');
};

const refreshData = () => {
  updateCurrentDisplayBanners();
  ElMessage.success('数据已刷新');
};
</script>

<style scoped>
/* 全局样式 */
:deep(.el-dialog),:deep(.el-card),:deep(.el-table),:deep(.el-drawer),:deep(.el-tag) {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 滚动条样式 */
:deep(::-webkit-scrollbar) { width: 6px; height: 6px; }
:deep(::-webkit-scrollbar-track) { background: #f1f1f1; border-radius: 3px; }
:deep(::-webkit-scrollbar-thumb) { background: #c1c1c1; border-radius: 3px; }
:deep(::-webkit-scrollbar-thumb:hover) { background: #a8a8a8; }
</style>
