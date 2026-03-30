import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'

export const useBannerStore = defineStore('banner', () => {
  // state
  let form = reactive({
    title:null,
    imageUrl:null,
    linkUrl:null,
    sortOrder:null,
    status:null,
    actionType:null,
    targetId:null,
    targetName:null   // 最后提交表单时去除
  })

  return{
    form
  }
})
