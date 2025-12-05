<template>
  <AlbumView :playlist="playlist" :musicList="musicList" />
</template>

<script lang="ts" setup>
import { getPlayListDetail } from '@/api/playlist/getPlayListDetail'
import AlbumView from '@/components/AlbumView.vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted, ref,watch } from 'vue'

const playlist = ref({})
const musicList = ref([])

const route = useRoute()
onMounted(async () => {
  try {
    const id = route.params.id
    const res = await getPlayListDetail(id)
    playlist.value = res.data
    musicList.value = res.data.records
  } catch (err) {
    console.log(err)
    ElMessage.error('获取歌单详情失败')
  }
})

watch(() => route.params.id, (newVal) => {
  getPlayListDetail(newVal)
    .then((res) => {
      playlist.value = res.data
      musicList.value = res.data.records
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('获取歌单详情失败')
    })
})
</script>
