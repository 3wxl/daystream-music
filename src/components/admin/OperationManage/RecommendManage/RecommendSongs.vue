<template>
  <div class="">
    <div class="text-[18px] font-700 ml-2">
      <span>推荐歌曲</span>
    </div>
    <div class="px-5 my-2">
      <div class="w-full flex flex-wrap gap-x-[3%] gap-y-1 bg-white" ref="cardContainerRef">
        <div class="h-[55px] basis-[30%] rounded-[12px]" v-for="recommendSong,index in recommendSongsList" :key="`${recommendSong.id}-${index}`">
          <RecommendSongsCard @select="updateRecommend" :recommendSong="recommendSong" :index="index"/>
        </div>
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
              placeholder="搜索音乐名称或歌手"
              prefix="&#xe65c;"
              width="100%"
            ></AdminInput>
          </div>
          <div class="rounded-md overflow-hidden">
            <el-table
              :data="filteredPlaylists"
              height="590"
              @row-click="selectSong"
              stripe
            >
              <el-table-column label="音乐名称" width="130" align="center">
                <template #default="scope">
                  <div class="group flex justify-center relative cursor-pointer">
                    <img :src="scope.row.cover" alt="封面" class="m-1 w-[45px] h-[45px] rounded-[6px]">
                    <div class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100">
                      <IconFontSymbol name="bofang" class="text-[white] relative top-[10px]" size="20px"></IconFontSymbol>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="音乐名称" prop="name" width="200" align="center"/>
              <el-table-column label="歌手" prop="author" width="150" align="center"/>
              <el-table-column label="类型" align="center">
                <template #default="scope">
                  <span v-for="type,index in scope.row.type" :key="index" class="text-[14px] px-[8px] py-[3px] rounded-[8px] bg-[#EDF3F9] mx-1 text-[#529FFD]">{{ type }}</span>
                </template>
              </el-table-column>
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
          当前选择歌曲：{{ nowSelectSong.name }}
        </div>
        <div>
          <el-button @click="isActionDrawerOpen = false;Object.assign(nowSelectSong, {})">取消</el-button>
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
  import RecommendSongsCard from './RecommendComponents/RecommendSongsCard.vue'
  import Sortable from 'sortablejs';
  import type { SortableEvent } from 'sortablejs';
  // ts

  // 数据
  let songsList = reactive([      // 歌曲列表
    {
      id:'1',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'豆豆',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05',
    },
    {
      id:'2',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'3',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'4',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'5',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'6',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'7',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'8',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
  ])
  let recommendSongsList = reactive([   // 推荐歌单
    {
      id:'1',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'2',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'3',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'4',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'5',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'6',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'7',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'8',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'9',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'10',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'11',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'12',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'13',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'14',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'15',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'16',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'17',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'18',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'19',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'20',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'21',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'22',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'23',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'24',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'25',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'26',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'27',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'28',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'29',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
    {
      id:'30',
      cover:'https://picsum.photos/seed/jjlin/400/400',
      name:'七里香',
      author:'张杰',
      type:['华语','古风'],
      createTime:'2022-05-05'
    },
  ])
  let isActionDrawerOpen = ref(false)
  let playlistSearchKeyword = ref('')
  let filteredPlaylists = computed(() => {
    return songsList.filter((playlist) => {
      return playlist.name.includes(playlistSearchKeyword.value)
    })
  })
  let nowId = ref('')   // 当前进行更改的推荐歌曲id
  let nowSelectSong = ref('')   // 当前选择的歌曲列表里面的歌曲，可以用来替换推荐歌曲
  const cardContainerRef = ref<HTMLDivElement | null>(null);      // 歌曲容器
  let sortableInstance: Sortable | null = null;
  //方法
  function updateRecommend(id){
    isActionDrawerOpen.value = true
    nowId.value = id
  }
  function selectSong(song){
    nowSelectSong.value = song
  }
  function confirmActionSetting(){
    if(!nowSelectSong.id){

    }
    for(let i = 0; i < recommendSongsList.length; i++){
      if(recommendSongsList[i].id == nowId.value){
        Object.assign(recommendSongsList[i], nowSelectSong.value)
        isActionDrawerOpen.value = false
        Object.assign(nowSelectSong, {})
        return
      }
    }
  }


  // 初始化拖拽
  onMounted(() => {
    const container = cardContainerRef.value;
    if (!container) return;

    sortableInstance = new Sortable(container, {
      animation: 300,
      handle: '.move-card',
      filter: '.no-drag',
      ghostClass: 'card-ghost',
      forceFallback: true,
      fallbackClass: 'card-fallback',
      onEnd: (evt: SortableEvent) => {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
          return;
        }
        const newRecommendSongs = [...recommendSongsList];
        [newRecommendSongs[oldIndex], newRecommendSongs[newIndex]] =
        [newRecommendSongs[newIndex], newRecommendSongs[oldIndex]];

        recommendSongsList.splice(0, recommendSongsList.length, ...newRecommendSongs);
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
}

.card-ghost {
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
