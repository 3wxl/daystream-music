import { getlistByTags } from "@/api/playlist/ByTags"
import { ref } from "vue"

export function useLoadMore() {
  const loading = ref(false)
  const noMore = ref(false)
  const listData = ref([])
  const currentPage = ref(1)
  const pageSize = ref(40)

  const loadData = async(tags:any, isReset = false) => {
    if(loading.value) return
    if(noMore.value && !isReset) return

    loading.value = true

    if(isReset){
      currentPage.value = 1
      noMore.vaule = false
      listData.value = []
    }

    try{
      const res = await getlistByTags(tags,currentPage.value,pageSize.value)
      const newData = res.data.records || []

        if(isReset){
          listData.value = [...newData]
        }else{
          listData.value.push(...newData)
        }

        if(newData.length < pageSize.value){
          noMore.value = true
        } else {
          currentPage.value++
        }

    }catch(err){
      console.log(err)
    }finally{
      loading.value = false
    }
  }

  return {
  loading,
  noMore,
  listData,
  loadData,
  }
}

