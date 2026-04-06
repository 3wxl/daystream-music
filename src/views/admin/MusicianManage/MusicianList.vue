<template>
  <div class="w-full" style="height: calc(100vh - 100px);">
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
      <MusicianListHeader
        @searchHandle="searchHandle"
      />
    </div>
    <div class="shadow-md/4 border-[#e4e7ed] bg-white rounded-[10px] p-[15px] mt-3">
      <MusicianListContainer
        :musicianType="musicianType"
        :musicianList_0="musicianList_0"
        :musicianList_1="musicianList_1"
        :musicianList_2="musicianList_2"
        :total="total"
        @pageSkip="pageSkip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {GetMusicianAuditListApi} from "@/api/Admin/musicianAudit"
  // 数据
  let musicianType = ref(0)   // 当前审核音乐人的类型 ：0-待审核 1-通过 2-拒绝
  let keyword = ref('')       // 搜索关键词
  let musicianList_0 = ref([])  // 待审核音乐人列表
  let musicianList_1 = ref([])  // 通过审核音乐人列表
  let musicianList_2 = ref([])  // 驳回的审核音乐人列表
  let total = ref(0)            // 音乐人总数
  let page = ref(1)             // 当前页码
  // 方法回调
  function searchHandle(val:[number,string]){     // 搜索回调
    musicianType.value = val[0]
    keyword.value = val[1]
    getMusicianList()
  }
  async function getMusicianList(){               // 获取音乐人列表
    let rel:any = await GetMusicianAuditListApi({pageNum:page.value,pageSize:8,status:musicianType.value,key:keyword.value});
    total.value = rel.data.total
    page.value = rel.data.current
    if(rel.success){
      if(musicianType.value===0){
        musicianList_0.value = rel.data.records
      }else if(musicianType.value===1){
        musicianList_1.value = rel.data.records
      }else if(musicianType.value===2){
        musicianList_2.value = rel.data.records
      }
    }
  }
  function pageSkip(pageNum:number){              // 分页回调
    page.value = pageNum
    getMusicianList()
  }
  onMounted(async ()=>{
    getMusicianList()
  })
</script>

<style scoped>
</style>
