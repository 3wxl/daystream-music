import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'

export const useClassifyManageStore = defineStore('classify', () => {
  // state
  let keyword = ref('')
  let type = ref('0')         // 类型：0-歌曲 1-歌单
  let classifyList_0 = reactive([
    {id:1,name:'全部',count:0,introduction:'简介'},
    {id:2,name:'华语',count:0,introduction:'简介'},
    {id:3,name:'欧美',count:0,introduction:'简介'},
    {id:4,name:'日本',count:0,introduction:'简介'},
    {id:5,name:'韩国',count:0,introduction:'简介'},
    {id:6,name:'其他',count:0,introduction:'简介'},
    {id:1,name:'全部',count:0,introduction:'简介'},
    {id:2,name:'华语',count:0,introduction:'简介'},
    {id:3,name:'欧美',count:0,introduction:'简介'},
    {id:4,name:'日本',count:0,introduction:'简介'},
    {id:5,name:'韩国',count:0,introduction:'简介'},
    {id:6,name:'其他',count:0,introduction:'简介'},
  ])
  let classifyList_1 = reactive([
    {id:1,name:'全部',count:0,introduction:'简介'},
    {id:2,name:'华语',count:0,introduction:'简介'},
    {id:3,name:'欧美',count:0,introduction:'简介'},
    {id:4,name:'日本',count:0,introduction:'简介'},
    {id:5,name:'韩国',count:0,introduction:'简介'},
    {id:6,name:'其他',count:0,introduction:'简介'},
    {id:1,name:'全部',count:0,introduction:'简介'},
    {id:2,name:'华语',count:0,introduction:'简介'},
    {id:3,name:'欧美',count:0,introduction:'简介'},
    {id:4,name:'日本',count:0,introduction:'简介'},
    {id:5,name:'韩国',count:0,introduction:'简介'},
    {id:6,name:'其他',count:0,introduction:'简介'},
  ])
  return{
    keyword,
    type,
    classifyList_0,
    classifyList_1
  }
})
