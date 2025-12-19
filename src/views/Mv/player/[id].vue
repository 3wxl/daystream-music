<template>
  <div class="h-full overflow-y-auto bg-[#0b0f1b] text-white p-6">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      <!-- 播放器 -->
      <div class="flex-1 min-w-0">
        <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
          <video
            v-if="mvUrl"
            :src="mvUrl"
            controls
            autoplay
            class="w-full h-full"
            ref="videoRef"
          ></video>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            加载中...
          </div>

          <!-- 清晰度选择 -->
          <div
            class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            v-if="qualityList.length > 0"
          >
            <el-dropdown @command="handleQualityChange">
              <span
                class="el-dropdown-link bg-black/50 px-3 py-1 rounded text-white cursor-pointer hover:bg-black/70"
              >
                {{ currentQualityLabel }} <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="q in qualityList"
                    :key="q.qualityType"
                    :command="q.qualityType"
                  >
                    {{ q.qualityType }}P
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- MV信息 -->
        <div class="mt-4">
          <h1 class="text-2xl font-bold mb-2">{{ mvDetail.name }}</h1>
          <div class="flex items-center text-gray-400 text-sm gap-4 mb-4">
            <span
              class="text-pink-500 cursor-pointer hover:underline"
              @click="goArtist(mvDetail.artistId)"
            >
              {{ mvDetail.artistName }}
            </span>
            <span>发布时间: {{ mvDetail.publishTime }}</span>
            <span>播放次数: {{ mvDetail.playCount }}</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
            {{ mvDetail.desc || '暂无简介' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getMvDetail } from '@/api/mv'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const mvId = ref(route.params.id as string)

const mvUrl = ref('')
const mvDetail = ref<any>({})
const simiMvs = ref<any[]>([])
const currentQuality = ref<number>(0) // 0 means not set, will hold resolution like 1080, 720
const qualityList = computed(() => mvDetail.value.qualityList || [])

const currentQualityLabel = computed(() => {
  return (
    qualityList.value.find((q: any) => q.qualityType === currentQuality.value)?.qualityType + 'P' ||
    '自动'
  )
})

const loadMvData = async () => {
  if (!mvId.value) return

  try {
    // 1. 获取详情（现在包含播放地址列表）
    const detailRes = await getMvDetail(mvId.value)
    if (detailRes.data) {
      // 根据用户提供的结构
      mvDetail.value = detailRes.data.data || detailRes.data

      // 加载时自动选择最高画质
      if (qualityList.value.length > 0) {
        // 简单的找个画质最高的
        const best = qualityList.value.reduce((prev: any, current: any) =>
          prev.qualityType > current.qualityType ? prev : current,
        )
        setQuality(best)
      } else if (mvDetail.value.mvUrl) {
        // 如果没有清晰度列表，但有直接的播放链接，就用这个
        mvUrl.value = mvDetail.value.mvUrl
      }
    }

    // 2. 获取相似MV (已移除)
  } catch (error) {
    console.error(error)
    ElMessage.error('加载MV数据失败')
  }
}

const setQuality = (q: any) => {
  currentQuality.value = q.qualityType
  mvUrl.value = q.mvUrl
}

const handleQualityChange = (qType: number) => {
  const target = qualityList.value.find((item: any) => item.qualityType === qType)
  if (target) {
    setQuality(target)
  }
}

const changeMv = (id: string | number) => {
  router.push(`/mv/player/${id}`)
}

const goArtist = (id: number) => {
  // router.push(`/artist/${id}`)
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      mvId.value = newId as string
      loadMvData()
    }
  },
)

onMounted(() => {
  loadMvData()
})
</script>

<style scoped>
/* Custom Scrollbar for the page if needed */
</style>
