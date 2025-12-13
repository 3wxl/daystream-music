<template>
  <AlbumView :albumlist="albumlist" :musicList="musicList" />
</template>

<script lang="ts" setup>
import { getAlbumDetail } from '@/api/album'
import AlbumView from '@/components/AlbumView.vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted, ref,watch } from 'vue'

const albumlist = ref({})
const musicList = ref([])

const route = useRoute()
onMounted(async () => {
  try {
    const id = route.params.id
    const res = await getAlbumDetail(id)
    albumlist.value = res.data
    musicList.value = res.data.records
  } catch (err) {
    console.log(err)
    ElMessage.error('获取专辑详情失败')
  }
})

watch(() => route.params.id, (newVal) => {
  getAlbumDetail(newVal)
    .then((res) => {
      albumlist.value = res.data
      musicList.value = res.data.records
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('获取专辑详情失败')
    })
})
</script>
