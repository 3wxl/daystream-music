<template>
  <el-table :data="formatSongsList" stripe >
    <el-table-column type="selection" width="55" align="center" class="ml-3"/>
    <el-table-column label="封面" width="130" align="center">
      <template #default="scope">
        <!-- <img :src="scope.row.avatar" alt="用户头像"> -->
        <div class="group flex justify-center relative cursor-pointer">
          <img :src="scope.row.coverUrl" alt="封面" class="m-1 w-[45px] h-[45px] rounded-[6px]">
          <div
            @click="handlePlaySong(scope.row)"
            class="w-[45px] h-[45px] rounded-[6px] absolute m-1 bg-[rgba(0,0,0,0.5)] duration-[0.3s] opacity-0 group-hover:opacity-100">
            <IconFontSymbol name="bofang" class="text-[white] relative top-[10px]" size="20px"></IconFontSymbol>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="歌名" width="180" align="center" class="relative">
      <template #default="scope">
        <span class="line-clamp-1">{{ scope.row.musicName }}</span>
        <span class="absolute left-[77px] text-[10px]/[16px] font-[600] rounded-[4px] px-[4px] py-[0px] bg-[#3278EA] text-[white]">原创</span>
      </template>
    </el-table-column>
    <el-table-column label="歌手" width="180" align="center">
      <template #default="scope">
        <span class="line-clamp-1">{{ scope.row.musicianName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="vip" width="60" align="center">
      <template #default="scope">
        <span v-if="scope.isVip==1" class="px-[3px] border-[1.5px] rounded-[6px] border-[#3278EA] text-[13px] text-[#3278EA]">vip</span>
        <span v-if="scope.isVip!=1" class="px-[3px] border-[1.5px] rounded-[6px] border-[#3278EA] text-[12px] text-[#3278EA]">免费</span>
      </template>
    </el-table-column>
    <el-table-column label="专辑" width="180" align="center">
      <template #default="scope">
        <span class="">{{ scope.row.albumName }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="歌曲" width="180" align="center">
      <template #default="scope">
        <span v-for="type,index in scope.row.type" :key="index" class="text-[14px] px-[8px] py-[3px] rounded-[8px] bg-[#EDF3F9] mx-1 text-[#529FFD]">{{ type }}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="申请日期" width="180" align="center">
      <template #default="scope">
        <span class="line-clamp-1">{{ formatDateTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <div class="flex items-center justify-center gap-4">
          <!-- <span class="py-[3px] px-[6px] rounded-full bg-[#3278EA] cursor-pointer" >
            <el-tooltip content="播放/暂停">
              <IconFontSymbol name="bofang" size="18px" color="white"></IconFontSymbol>
            </el-tooltip>
          </span> -->
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click=""
          >
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="18px"></IconFontSymbol>
            通过
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click=""
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            驳回
          </span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import {formatDateTime} from "@/utils/timeToolFun"
  import { usePlayerStore } from '@/stores/player'        // 引入播放器store
  import type { MusicVO } from '@/types/personalCenter'
  const props = defineProps({
    songsList: {
      type: Array,
      default: () => []
    },
    statusType:{
      type: Number,
      default: 0
    }
  })
  const formatSongsList:any = ref([])
  const formatDuration = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  watch(()=>props.songsList,(newVal,oldVal)=>{
    formatSongsList.value = []
    props.songsList.forEach((item:any)=>{
      let newItem:any = {}
      newItem.id = item.id
      newItem.musicName = item.musicName
      newItem.albumId = item.albumId
      newItem.albumName = item.albumName
      newItem.musicianId = item.musicianId
      newItem.musicianName = item.musicianName
      newItem.coverUrl = item.coverUrl
      newItem.duration = formatDuration(item.duration)
      newItem.bpm = item.bpm
      newItem.isVip = item.isVip
      newItem.isLiked = item.isLiked
      newItem.likeCount = item.likeCount
      newItem.commentCount = item.commentCount
      newItem.createTime = item.createTime
      newItem.audioList = []
      if(item.audioList){
        item.audioList.forEach((itme2:any)=>{
          newItem.audioList.push(itme2.qualityType==1?'标准':(itme2.qualityType==2?'高清':(itme2.qualityType==3?'无损':'空间音频')))
        })
      }
      formatSongsList.value.push(newItem)
    })
  },{
    deep:true,
    immediate:true
  })
  const playerStore = usePlayerStore() // 初始化播放状态
  const handlePlaySong = async (song: MusicVO) => {
    try {
      if(props.statusType!==1){
        ElMessage.warning('未通过审核的歌曲暂不支持播放哦~')
        return
      }
      await playerStore.playSong(song)
    } catch (error) {
      ElMessage.error('播放失败，请重试')
    }
  }
  onMounted(()=>{

  })
</script>

<style>

</style>
