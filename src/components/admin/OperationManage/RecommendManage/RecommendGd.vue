<template>
  <div class="">
    <div>
      <span class="text-[18px] font-700 ml-2">推荐歌单</span>
    </div>
    <div class="px-5">
      <!-- 容器 -->
      <div
        class="bg-white shadow-2xs rounded-[12px] p-3 flex gap-10 overflow-x-auto"
        ref="cardContainerRef"
      >
        <!-- 组件 -->
        <RecommendGdCard
          v-for="(item, index) in musicData"
          :key="`${item.data.id}-${index}`"
          :data="item.data"
          :index="index + 1"
          v-model="isActionDrawerOpen"
          @select="selectPlaylist"
        />
      </div>
    </div>
  </div>
  <el-drawer
    title="推荐歌单选择"
    v-model="isActionDrawerOpen"
    direction="rtl"
    size="50%"
    :close-on-click-modal="false"
  >
    <div class="h-full flex flex-col">
      <div class="flex-1 overflow-auto">
        <div>
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
              @row-click="selectGd"
              stripe
              :row-class-name="(row) => row.row.id === selectedPlaylist.id ? 'bg-blue-50' : ''"
            >
              <el-table-column label="歌单名称" prop="name" width="200"/>
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
      <!-- 底部按钮 -->
      <div class="mt-4 flex justify-between gap-3">
        <div class="text-[15px] text-[#666]">
          当前选择歌单：{{ selectedPlaylist.name }}
        </div>
        <div>
          <el-button @click="isActionDrawerOpen = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirmActionSetting"
            class="bg-blue-500 hover:bg-blue-600 text-white"
          >
            确认选择
          </el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
  // 导入
  import { reactive, ref, onMounted, onUnmounted } from 'vue';
  import RecommendGdCard from './RecommendComponents/RecommendGdCard.vue';
  import Sortable from 'sortablejs';
  import type { SortableEvent } from 'sortablejs';

  // ts 接口
  interface musicDataObjInterface {
    type: string;
    to: string;
    data: {
      id: string;
      imgUrl: string;
      description: string;
      songCount: string;
      singerName: string;
    };
  }
  interface selectedPlaylistInterface {
    id: string;
    name: string;
    songCount: string;
    createTime: string;
    description: string;
    singerName: string;
  }

  // 数据
  let isActionDrawerOpen = ref(false);      // 是否打开选择歌单的抽屉
  let playlistSearchKeyword = ref('')       // 歌单搜索关键字
  let nowGdId = ref('')
  let selectedPlaylist = reactive<selectedPlaylistInterface>({});
  const mockPlaylists = reactive([      // 静态可选歌单数据
    { id: 1, name: '华语流行精选', songCount: 30, createTime: '2025-10-01', description: '汇集当下最热门的华语流行歌曲',singerName: '林俊杰' },
    { id: 2, name: '经典老歌回顾', songCount: 45, createTime: '2025-09-15', description: '那些年我们一起听过的经典老歌',singerName: '林俊杰' },
    { id: 3, name: '轻音乐合集', songCount: 28, createTime: '2025-09-20', description: '放松心情的纯音乐精选',singerName: '林俊杰' },
    { id: 4, name: '摇滚精选', songCount: 36, createTime: '2025-10-05', description: '热血沸腾的摇滚歌曲集合' ,singerName: '林俊杰'},
    { id: 5, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' ,singerName: '林俊杰'},
    { id: 6, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' ,singerName: '林俊杰'},
    { id: 7, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选',singerName: '林俊杰' },
    { id: 8, name: '影视原声合集', songCount: 42, createTime: '2025-10-10', description: '热门影视剧主题曲、插曲精选' ,singerName: '林俊杰'},
  ]);
  const filteredPlaylists = computed(() => {
    if (!playlistSearchKeyword.value) return mockPlaylists;
    const keyword = playlistSearchKeyword.value.toLowerCase();
    return mockPlaylists.filter(playlist =>
      playlist.name.toLowerCase().includes(keyword) ||
      playlist.description.toLowerCase().includes(keyword)
    );
  });
  let musicData = reactive<musicDataObjInterface[]>([       // 推荐歌单数据
    {
      type: 'artist',
      to: '/list/artist-1001',
      data: {
        id: 'artist-1001',
        imgUrl: 'https://picsum.photos/seed/jjlin/400/400',
        description: '林俊杰',
        songCount: '128 首',
        singerName: '林俊杰',
      },
    },
    {
      type: 'artist',
      to: '/list/artist-1002',
      data: {
        id: 'artist-1002',
        imgUrl: 'https://picsum.photos/seed/jaychou/400/400',
        description: '周杰伦',
        songCount: '210 首',
        singerName: '周杰伦',
      },
    },
    {
      type: 'artist',
      to: '/list/artist-1003',
      data: {
        id: 'artist-1003',
        imgUrl: 'https://picsum.photos/seed/gem/400/400',
        description: 'G.E.M.邓紫棋',
        songCount: '92 首',
        singerName: 'G.E.M.邓紫棋',
      },
    },
    {
      type: 'artist',
      to: '/list/artist-1004',
      data: {
        id: 'artist-1004',
        imgUrl: 'https://picsum.photos/seed/eason/400/400',
        description: '陈奕迅',
        songCount: '175 首',
        singerName: '陈奕迅',
      },
    },
    {
      type: 'artist',
      to: '/list/artist-1005',
      data: {
        id: 'artist-1005',
        imgUrl: 'https://picsum.photos/seed/jjlin/400/400',
        description: '林俊杰',
        songCount: '128 首',
        singerName: '林俊杰',
      },
    },
  ]);

  // 方法
  function selectPlaylist(id) {      // 选择歌单
    isActionDrawerOpen.value = true;
    nowGdId.value = id
  }
  function selectGd(row){
    console.log(row)
    Object.assign(selectedPlaylist, row.row || row);
  }
  function confirmActionSetting() {      // 确认选择歌单
    if(!selectedPlaylist.id){
      ElMessage({
        message: '请选择一个歌单再进行替换',
        type: 'warning',
      })
      return
    }
    for(let i = 0; i < musicData.length; i++){
      if(musicData[i].data.id === nowGdId.value){
        musicData[i].data.id = selectedPlaylist.id+''
        musicData[i].data.songCount = selectedPlaylist.songCount + '首'
        musicData[i].data.description = selectedPlaylist.name
        musicData[i].data.singerName = selectedPlaylist.singerName
      }
    }
    Object.assign(selectedPlaylist, {});
    isActionDrawerOpen.value = false;
  }
  // 获取容器DOM
  const cardContainerRef = ref<HTMLDivElement | null>(null);
  // 存储sortable实例
  let sortableInstance: Sortable | null = null;

  // 初始化拖拽
  onMounted(() => {
    const container = cardContainerRef.value;
    if (!container) return;

    sortableInstance = new Sortable(container, {    // 第一个参数为容器DOM元素，第二个参数为配置对象）
      animation: 300,
      handle: '.card-drag-handle', // 仅允许点击设置图标触发拖拽
      ghostClass: 'card-ghost',       // 拖拽时添加的类名
      forceFallback: true,
      fallbackClass: 'card-fallback',
      onEnd: (evt: SortableEvent) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
          return;
        }

        const newMusicData = [...musicData];
        [newMusicData[oldIndex], newMusicData[newIndex]] = [newMusicData[newIndex], newMusicData[oldIndex]];

        musicData.splice(0, musicData.length, ...newMusicData);

        console.log(`卡片互换：位置${oldIndex + 1} ↔ 位置${newIndex + 1}`);
      },
    });
  });

  onUnmounted(() => {
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
  });
</script>

<style scoped>
.bg-white {
  min-width: max-content;
}

.card-ghost {
  width: 15%;
  aspect-square: 1;
  border-radius: 12px;
  background: #f0f9ff !important;
  border: 2px dashed #1890ff !important;
  opacity: 0.8;
  pointer-events: none;
}

.card-fallback {
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.3);
  opacity: 0.9;
}
::v-deep .gedanSelect .el-table__row{
  height: 70px;
}
::v-deep .admin-page .btn-prev{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-prev:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-prev .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .btn-next{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-next:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-next .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .el-pager .number{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .number:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .el-pager .more{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .more:hover{
    border-color: #0084ff;
  }
</style>
