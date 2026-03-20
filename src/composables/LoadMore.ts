import { ref } from 'vue'

export function useLoadMore(apiFunc: Function) {
  const loading = ref(false)
  const noMore = ref(false)
  const listData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(40)

  const isError = ref(false)

  const loadData = async (params: any = null, isReset = false) => {
    if (loading.value) return
    if (noMore.value && !isReset) return
    if (isError.value && !isReset) return

    loading.value = true

    if (isReset) {
      isError.value = false
      currentPage.value = 1
      noMore.value = false
      listData.value = []
    }

    try {
      let res
      if (params) {
        res = await apiFunc(params, currentPage.value, pageSize.value)
      } else {
        res = await apiFunc(currentPage.value, pageSize.value)
      }
      const newData = res.data.records || []

      if (isReset) {
        listData.value = [...newData]
      } else {
        listData.value.push(...newData)
      }

      if (newData.length < pageSize.value) {
        noMore.value = true
      } else {
        currentPage.value++
      }
      isError.value = false
    } catch (err) {
      console.log(err)
      isError.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    noMore,
    listData,
    loadData,
    isError,
  }
}
