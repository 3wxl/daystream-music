<template>
  <div class="min-h-screen shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] relative z-1">
    <!-- 头部操作区 -->
    <BannerHeader
      @openAddDialog="openAddDialog"
      @refreshData="refreshData"
      @preview="isPreview = true"
    />

    <!-- 展示规则提示 -->
    <BannerRuleTip />

    <!-- 当前展示的轮播图 -->
    <BannerDisplayList
      :banners="banners"
      :clickTypeText="clickTypeText"
      :formatDate="formatDate"
      :clickType="clickType"
    />

    <!-- 轮播图表格列表 -->
    <BannerListTable
      :formatDate="formatDate"
      :BannerList="BannerList"
      :searchKeyword="searchKeyword"
      :total="total"
      @prePage="skipPage"
      @nextPage="skipPage"
      @clickPage="skipPage"
      @searchChange="searchChange"
      :page="page"
      @refreshList="refreshList"
    />

    <!-- 预览组件 -->
    <BannerPreview v-model="isPreview" :clickType="clickType" :bannerData="banners"></BannerPreview>

    <!-- 一些其它组件挂载 -->
    <BannerFormDialog
      v-model="isDialogOpen"
      :isEditMode="isEditMode"
      :mockMusics="mockMusics"
      :mockPlaylists="mockPlaylists"
      @close="closeDialog"
      @openActionDrawer="isActionDrawerOpen = true"
      v-if="isDialogOpen"
      @refreshList="refreshList"
    />

    <BannerActionDrawer
      v-model="isActionDrawerOpen"
      :mockMusics="mockPlaylists"
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

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

// 导入子组件
import BannerHeader from '@/components/admin/OperationManage/BannerManage/BannerHeader.vue';
import BannerRuleTip from '@/components/admin/OperationManage/BannerManage/BannerRuleTip.vue';
import BannerListTable from '@/components/admin/OperationManage/BannerManage/BannerListTable.vue';
import BannerDisplayList from '@/components/admin/OperationManage/BannerManage/BannerDisplayList.vue';
import BannerFormDialog from '@/components/admin/OperationManage/BannerManage/BannerFormDialog.vue';
import BannerActionDrawer from '@/components/admin/OperationManage/BannerManage/BannerActionDrawer.vue';
import BannerDeleteDialog from '@/components/admin/OperationManage/BannerManage/BannerDeleteDialog.vue';
import BannerPreview from '@/components/admin/OperationManage/BannerPreview.vue';
import {useBannerStore} from '@/stores/admin/banner'
import {GetBannerListAPI,SearchBannerListAPI} from '@/api/Admin/operation/banner';
import { pa } from 'element-plus/es/locale';

let { form } = useBannerStore();
// 模拟数据
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

const mockPlaylists = ref([
  { id: 1, name: '华语流行精选', songCount: 30, createTime: '2025-10-01', description: '汇集当下最热门的华语流行歌曲' },
  { id: 2, name: '经典老歌回顾', songCount: 45, createTime: '2025-09-15', description: '那些年我们一起听过的经典老歌' },
  { id: 3, name: '轻音乐合集', songCount: 28, createTime: '2025-09-20', description: '放松心情的纯音乐精选' },
  { id: 4, name: '摇滚精选', songCount: 36, createTime: '2025-10-05', description: '热血沸腾的摇滚歌曲集合' },
  { id: 5, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' },
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
const banners = ref([]);                  // 当前展示的轮播图数据
const BannerList = reactive([])           // 轮播图列表数据
const filteredBanners = reactive([]);     // 根据搜索过滤后的轮播图列表
const total = ref(0);                      // 轮播图总数
const page = ref(1);                       // 当前页码


const clickType = {
  0:'无点击行为',
  1:'跳转到歌单',
  2:'跳转到歌曲',
  3:'跳转到秒杀活动',
  4:'链接跳转',
}
const clickTypeText = {
  0:'无',
  1:'歌单',
  2:'歌曲',
  3:'活动',
  4:'链接',
}

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
function resetForm(){       // 重置表单数据
  form.title = null;
  form.imageUrl = null;
  form.linkUrl = null;
  form.sortOrder = null;
  form.status = null;
  form.actionType = null;
  form.targetId = null;
  form.targetName = null;
}

// 方法
async function getDisplayBanners(){           // 获取当前展示的四个轮播图
  let disBanRes = await GetBannerListAPI(1,4);
  banners.value = disBanRes.data.records;
}
async function getBannerList(pageNum,pageSize,keyword){         // 获取轮播图列表
  let banRes = await SearchBannerListAPI(pageNum,pageSize,keyword);
  BannerList.splice(0,BannerList.length,...banRes.data.records);
  total.value = banRes.data.total;
  page.value = pageNum;
}

function skipPage(page:number){
  getBannerList(page,8,searchKeyword.value)
}
function refreshList(){
  getBannerList(page.value,8,searchKeyword.value)
}

function searchChange(keyword:string){
  searchKeyword.value = keyword;
  getBannerList(1,8,searchKeyword.value)
}
// 事件处理
function openAddDialog(){         // 打开添加轮播图对话框
  isDialogOpen.value = true;
  isEditMode.value = false;
}

function closeDialog(){           // 关闭对话框
  resetForm()
  isDialogOpen.value = false;
}

// 初始化
onMounted(()=>{
  getDisplayBanners();
  getBannerList(1,8,'')
})

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
