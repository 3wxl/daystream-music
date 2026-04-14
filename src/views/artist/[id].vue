<template>
  <div class="playlist-detail-page">
    <!-- 头部信息 -->
    <div class="playlist-header">
      <div class="container">
        <div class="header-content">
          <div class="playlist-cover group">
            <img
              :src="artistDetail?.avatar || DEFAULT_AVATAR"
              alt="头像"
              class="cover-img transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div class="playlist-info">
            <h1 class="playlist-title tracking-wide">{{ artistDetail?.stageName || '未知歌手' }}</h1>
            <div class="playlist-meta">
              <span class="create-time text-xs text-gray-400">
                粉丝数: {{ artistDetail?.fansCount || 0 }}
              </span>
            </div>
            
            <div class="text-sm text-gray-300 mt-2 mb-4 line-clamp-3 overflow-hidden">
              简介: {{ artistDetail?.introduction || '暂无个人简介' }}
            </div>

            <div class="action-buttons gap-3 mt-4">
              <el-button
                class="play-all-btn"
                type="primary"
                size="large"
                @click="handlePlayAll"
                :disabled="!musicList || musicList.length === 0"
              >
                <i class="iconfont">&#xe623;</i>
                播放全部歌曲
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 横向导航与内容 -->
    <div class="container main-content">
      <div class="custom-tabs">
        <div class="tabs-nav flex justify-between items-center">
          <div class="flex justify-between items-center">
            <div
              v-for="tab in tabs"
              :key="tab.name"
              :class="['tab-nav-item', { active: activeTab === tab.name }]"
              @click="activeTab = tab.name"
            >
              {{ tab.label }}
            </div>
          </div>
        </div>

        <div class="tabs-content">
          <!-- 歌曲 Tab -->
          <div v-if="activeTab === 'songs'" class="tab-pane">
            <div v-if="loadingSongs" class="py-12 text-center text-gray-400">
              <i class="iconfont animate-spin">&#xe623;</i> 加载中...
            </div>
            <div v-else-if="!musicList || musicList.length === 0" class="py-12 text-center">
              <el-empty description="暂无歌曲" class="text-gray-500" />
            </div>
            <div v-else>
              <LikedSongs :likedSongs="musicList" />
            </div>
          </div>

          <!-- 专辑 Tab -->
          <div v-if="activeTab === 'albums'" class="tab-pane">
            <div v-if="loadingAlbums" class="py-12 text-center text-gray-400">
              <i class="iconfont animate-spin">&#xe623;</i> 加载中...
            </div>
            <div v-else-if="!albumList || albumList.length === 0" class="py-12 text-center">
              <el-empty description="暂无专辑" class="text-gray-500" />
            </div>
            <div v-else class="main-cards pt-4">
              <MusicCard
                v-for="item in albumList"
                :key="item.id"
                :imgUrl="item.coverUrl || DEFAULT_AVATAR"
                :to="{ name: 'album-detailPage-id', params: { id: item.id } }"
                variant="album"
              >
                <h2 class="text-base font-bold text-white truncate">{{ item.albumName }}</h2>
                <p class="text-xs text-gray-400 mt-1 truncate">{{ item.releaseDate }}</p>
              </MusicCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import LikedSongs from '@/components/user/LikedSongs.vue'
import MusicCard from '@/components/MusicCard.vue'
import { getMusicianDetail, getMusicianMusic, getOtherAlbum } from '@/api/artist'
import { usePlayerStore } from '@/stores/player'

const DEFAULT_AVATAR = 'https://picsum.photos/300/300?random=1'

const route = useRoute()
const playerStore = usePlayerStore()

const musicianId = ref(route.params.id as string)
const artistDetail = ref<any>({})
const musicList = ref<any[]>([])
const albumList = ref<any[]>([])

const loadingSongs = ref(false)
const loadingAlbums = ref(false)

const tabs = [
  { name: 'songs', label: '歌曲' },
  { name: 'albums', label: '专辑' },
]
const activeTab = ref('songs')

const loadInfo = async () => {
  if (!musicianId.value) return
  try {
    const res: any = await getMusicianDetail(musicianId.value)
    if (res.success && res.data) {
      artistDetail.value = res.data
      
      // 有了详情后，加载该用户 (musicianId) 的歌曲和专辑
      if (res.data.userId) {
        loadSongs(res.data.userId)
        loadAlbums(res.data.userId)
      }
    } else {
      ElMessage.error(res.errorMsg || '获取歌手详情失败')
    }
  } catch (e) {
    console.error('歌手详情失败', e)
  }
}

const loadSongs = async (musicianId: number) => {
  loadingSongs.value = true
  try {
    const res: any = await getMusicianMusic(musicianId, 1, 50)
    if (res.success && res.data && res.data.records) {
      // 1. 彻底打平多维数组
      let list = res.data.records.flat(Infinity)

      // 2. 转换数据以适配 LikedSongs 组件（该组件接收audioList 为 ['高清', '无损'] 形式的字符串数组，而非对象数组）
      const qualityMap: Record<number, string> = {
        1: '标准',
        2: '高清',
        3: '无损',
        4: '空间音频'
      }

      list = list.map((song: any) => {
        let formattedAudioList: string[] = []
        if (Array.isArray(song.audioList)) {
          formattedAudioList = song.audioList.map((audio: any) => {
            if (typeof audio === 'string') return audio
            return qualityMap[audio.qualityType] || '标准'
          })
        }
        return {
          ...song,
          audioList: formattedAudioList
        }
      })

      musicList.value = list
    }
  } catch (e) {
    console.error('加载歌曲失败', e)
  } finally {
    loadingSongs.value = false
  }
}

const loadAlbums = async (userId: number) => {
  loadingAlbums.value = true
  try {
    const res: any = await getOtherAlbum(userId, 1, 50)
    if (res.success && res.data && res.data.records) {
      albumList.value = res.data.records
    }
  } catch (e) {
    console.error('加载专辑失败', e)
  } finally {
    loadingAlbums.value = false
  }
}

const handlePlayAll = async () => {
  if (musicList.value.length === 0) {
    ElMessage.warning('暂无歌曲')
    return
  }
  await playerStore.playSong(musicList.value[0], musicList.value)
  ElMessage.success('开始播放歌手名下全部歌曲')
}

onMounted(() => {
  loadInfo()
})
</script>

<style lang="scss" scoped>
.playlist-detail-page {
  background-color: #0f0f1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.playlist-header {
  background: linear-gradient(135deg, #121225 0%, #1a1a30 100%);
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 153, 204, 0.1);
}

.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  gap: 30px;
  align-items: center;
}

.playlist-cover {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%; /* 歌手一般用圆形头像 */
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 153, 204, 0.15);
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.playlist-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.playlist-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 15px;
}

.play-all-btn {
  background-color: #e74fa0 !important;
  border-color: #e74fa0 !important;
  color: #fff !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(255, 153, 204, 0.3) !important;
  border-radius: 9999px;
}

.play-all-btn:hover {
  background-color: #e63493 !important;
  border-color: #e63493 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(255, 153, 204, 0.4) !important;
}

.main-content {
  padding: 30px 0;
}

.custom-tabs {
  margin-top: 10px;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid rgba(255, 153, 204, 0.1);
  padding-bottom: 2px;
}

.tab-nav-item {
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-right: 8px;
  font-size: 16px;
}

.tab-nav-item:hover:not(.active) {
  color: #e0e0e0;
}

.tab-nav-item.active {
  color: #cd3181;
  font-weight: 500;
}

.tab-nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #cd3181;
  border-radius: 2px;
}

.tabs-content {
  padding-top: 20px;
  min-height: 400px;
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.main-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: main
</route>
