<template>
  <keep-alive>
    <el-container class="bg-gradient-to-b from-gray-900 to-gray-950 w-full min-h-full">
      <el-header class="border-b-[1px] border-[#1f2d3d] flex items-center">
        <div class="relative">
          <input
              v-model="input"
              type="text"
              placeholder="搜索动态或用户"
              class="w-[200px] px-4 py-[6px] pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
              />
          <Search @click="searchDynamic" class="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div class="ml-1 w-100-200">
          <el-scrollbar class="w-full">
            <span v-for="musician in musicians" :key="musician.id"
              class="cursor-pointer inline-block duration-[0.2s] mx-2 text-[#e5e7eb] text-[14px] py-2 px-4 bg-[rgba(255,255,255,0.1)] rounded-[20px] hover:bg-[rgba(255,255,255,0.15)]"
              :class="activedId==musician.id?'bg-pink-600 hover:bg-pink-700':''"
              @click="activedId=musician.id"
            >
              {{musician.name}}
            </span>
            <span
              class="cursor-pointer inline-block duration-[0.2s] mx-2 text-[#e5e7eb] text-[14px] py-2 px-4 bg-[rgba(255,255,255,0.1)] rounded-[20px] hover:bg-[rgba(255,255,255,0.15)]">
              <IconFontSymbol name="sandian"></IconFontSymbol>
            </span>
          </el-scrollbar>
        </div>
      </el-header>
      <el-container>
        <el-main>
          <div @scroll="handleScroll" class="ml-5 flex relative items-start overflow-y-auto" style="height: calc(100vh - 174px)">
            <div class="flex-grow-0 shrink-0 basis-[67%]">
              <community-display v-for="(dynamic, index) in dymamicList" :key="index" :dynamic="dynamic"></community-display>
              <div class="flex justify-center" v-if="hasMore && !isSearch">
                <div class="loader">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
              </div>
              <div class="my-2 text-center text-[#e5e7eb] text-[14px]" v-if="!hasMore && !isSearch && !isSearchNull">
                没有更多动态了~
              </div>
              <div class="w-[250px] mx-auto relative top-30" v-show="isSearch">
                <DynamicLoading/>
              </div>
              <div v-if="isSearchNull" class="w-[300px] mx-auto relative top-30">
                <DynamicNull :searchContent="searchContentNull"/>
              </div>
            </div>
            <div class="flex-grow-0 shrink-0 basis-[28%] ml-10 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px] sticky top-0 self-start">
              <div class="flex flex-col items-center">
                <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
                  <img
                    :src="userInfo.avatar"
                    class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    @click="router.push('/User/PersonalCenter')"
                  />
                </div>
                <p class="text-[#e5e7eb] text-[18px] font-[600] mt-2">{{userInfo.username}}</p>
                <p class="text-[#bdbdbd] mt-[2px] text-[12px]">{{userInfo.introduction?userInfo.introduction:'这个人很懒，还没有填写简介 ε=( o｀ω′)ノ'}}</p>
                <div class="mt-[10px]">
                  <button @click="router.push('/community/communityCreate')" class="BtnPublish relative text-[#e5e7eb] px-[15px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
                    <IconFontSymbol name="dongtai" size="18px"></IconFontSymbol>
                    发布动态
                    <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
                  </button>
                </div>
                <div class="flex mt-6 text-[#e5e7eb] mb-10">
                  <span>
                    <span class="mr-[2px]">{{userInfo.fansCount}}</span>
                    粉丝
                  </span>
                  <span class="mx-14">
                    <span class="mr-[2px]">{{userInfo.likeCount}}</span>
                    点赞
                  </span>
                  <span>
                    <span class="mr-[2px]">{{userInfo.followCount}}</span>
                    关注
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </keep-alive>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import communityDisplay from '../../components/community/CommunityDisplay.vue'
  import {getDynamicList} from '@/api/community/Dynamic'
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖
  import DynamicLoading from '@/components/community/DynamicLoading.vue'    // 动态加载组件
  import DynamicNull from '@/components/community/DynamicNull.vue'      // 当搜索动态内容为空时展示组件
  import { getUserInfo } from '@/api/personalCenter/index'

  // 数据
  let input = ref('')
  let oldInput = ''     // 旧输入,用于比较是否改变
  let musicians = reactive([
    {
      name:'全部',
      id:0
    },
    {
      name:'张杰',
      id:1
    },
    {
      name:'张学友',
      id:2
    },
    {
      name:'周杰伦',
      id:3
    },
    {
      name:'林俊杰',
      id:4
    },
    {
      name:'王力宏',
      id:5
    },
    {
      name:'atif',
      id:6
    },
    {
      name:'张杰',
      id:7
    },
    {
      name:'张学友',
      id:8
    },
    {
      name:'周杰伦',
      id:9
    },
    {
      name:'林俊杰',
      id:10
    },
    {
      name:'王力宏',
      id:11
    },
    {
      name:'atif',
      id:12
    },{
      name:'张杰',
      id:13
    },
    {
      name:'张学友',
      id:14
    },
    {
      name:'周杰伦',
      id:15
    },
    {
      name:'林俊杰',
      id:16
    },
    {
      name:'王力宏',
      id:17
    },
    {
      name:'atif',
      id:18
    },{
      name:'张杰',
      id:19
    },
    {
      name:'张学友',
      id:20
    },
    {
      name:'周杰伦',
      id:21
    },
    {
      name:'林俊杰',
      id:22
    },
    {
      name:'王力宏',
      id:23
    },
    {
      name:'atif',
      id:24
    },
  ])
  let dymamicList = reactive([
  ])
  let activedId = ref(0)
  let router = useRouter()
  let isGetMore = ref(false)
  let isSearch = ref(false)     // 是否搜索
  let isSearchNull = ref(false)   // 是否当前关键词动态为空
  let searchContentNull = ref('')   // 当搜索内容不存在时的提示
  let submitData = reactive({     // 获取动态列表的参数
    "userId": null,
    "keyword": input.value.trim(),
    "lastId": null,
    "pageSize": 10
  })
  let hasMore = ref(true)     // 是否还有更多数据
  let userInfo = ref({})

  // 方法
  async function getUser(){
    let userInfoRes = await getUserInfo()
    console.log(userInfoRes)
    if(userInfoRes.success){
      userInfo.value = userInfoRes.data
    }else{
      console.log('获取用户信息失败')
    }
  }
  async function getDynamic() {     // 获取动态列表
    isSearchNull.value = false
    if(hasMore){
      if(input.value.trim()!==oldInput){
        isSearch.value = true
        dymamicList.splice(0, dymamicList.length);
        oldInput = input.value.trim()
        submitData.lastId = null
        submitData.keyword = input.value.trim()
      }
      let dynamicList = await getDynamicList(submitData)
      console.log(dynamicList)
      isSearch.value = false
      if(dynamicList.data==='未查询到数据'){
        isSearchNull.value = true      // 搜索无结果
        searchContentNull.value = input.value.trim()
      }
      hasMore.value = dynamicList.data.hasMore
      submitData.lastId = dynamicList.data.lastId
      for(let i = 0; i < dynamicList.data.dateList.length; i++){
        dymamicList.push(dynamicList.data.dateList[i])
      }
      isGetMore.value = false
    }
  }
  let handleScroll = throttle(function(e){
    if(e.target.scrollHeight - 200 <= e.target.scrollTop + e.target.clientHeight){
      if(!isGetMore.value && hasMore.value){
        isGetMore.value = true
        getDynamic()
      }
    }
  },1000)
  let searchDynamic = debounce(function(){
    let searchContent = input.value.trim()
    if(searchContent === oldInput)return
    getDynamic()
  },800)
  onMounted(() => {
    getDynamic()
    getUser()
  })
</script>

<style scoped lang="scss">
  ::v-deep .el-scrollbar__view{
    white-space: nowrap;
  }
  .w-100-200{
    width: calc(100% - 200px);
  }
  @keyframes myButtonPing{
    0%{
      background-color: #DF0077;
      opacity: 1;
      scale: 1;
    }
    70%{
      background-color: #DF0077;
      opacity: 0.4;
      scale: 1.2;
    }
    100%{
      background-color: #DF0077;
      opacity: 0;
      scale: 1.2;
    }
  }
  .BtnPublish:hover{
    .BtnPing{
      animation: myButtonPing 1s ease-in-out infinite;
    }
  }
  .layout-scrollbar{

  }
  .loader {
  display: flex;
  align-items: center;
}

.bar {
  display: inline-block;
  width: 3px;
  height: 15px;
  background-color: rgba(255, 255, 255, .5);
  border-radius: 10px;
  animation: scale-up4 1s linear infinite;
}

.bar:nth-child(2) {
  height: 28px;
  margin: 0 5px;
  animation-delay: .25s;
}

.bar:nth-child(3) {
  animation-delay: .5s;
}

@keyframes scale-up4 {
  20% {
    background-color: #ffff;
    transform: scaleY(1.5);
  }
  40% {
    transform: scaleY(1);
  }
}
</style>
