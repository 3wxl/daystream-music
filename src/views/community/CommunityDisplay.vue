<template>
  <el-container class="bg-gradient-to-b from-gray-900 to-gray-950 w-full min-h-full">
    <el-header class="border-b-[1px] border-[#1f2d3d] flex items-center">
      <div class="relative">
        <input
            v-model="input"
            type="text"
            placeholder="搜索动态或用户"
            class="w-[200px] px-4 py-[6px] pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all"
          />
        <Search class="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
        <div class="ml-5 flex relative items-start overflow-y-auto" style="height: calc(100vh - 174px)">
          <div class="flex-grow-0 shrink-0 basis-[67%]">
            <community-display v-for="(dynamic, index) in dymamicList" :key="index" :dynamic="dynamic"></community-display>
          </div>
          <div class="flex-grow-0 shrink-0 basis-[28%] ml-10 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px] sticky top-0 self-start">
            <div class="flex flex-col items-center">
              <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
                <img
                  :src="'http://39.96.214.163:9000/file/70567a01-09d0-443b-9d8a-bab6e5623967.png'"
                  class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  @click="router.push('/User/PersonalCenter')"
                />
              </div>
              <p class="text-[#e5e7eb] text-[18px] font-[600] mt-2">蔡徐坤</p>
              <p class="text-[#bdbdbd] mt-[2px] text-[12px]">坤坤音乐创作者</p>
              <div class="mt-[10px]">
                <button @click="router.push('/community/communityCreate')" class="BtnPublish relative text-[#e5e7eb] px-[15px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
                  <IconFontSymbol name="dongtai" size="18px"></IconFontSymbol>
                  发布动态
                  <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
                </button>
              </div>
              <div class="flex mt-6 text-[#e5e7eb] mb-10">
                <span>
                  <span class="mr-[2px]">111</span>
                  粉丝
                </span>
                <span class="mx-14">
                  <span class="mr-[2px]">111</span>
                  点赞
                </span>
                <span>
                  <span class="mr-[2px]">111</span>
                  关注
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import communityDisplay from '../../components/community/CommunityDisplay.vue'
  import {getDynamicList} from '@/api/community/GetDynamicList'
  let input = ref('')
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

  let submitData = reactive({     // 获取动态列表的参数
    "userId": null,
    "keyword": input,
    "lastId": null,
    "pageSize": 10
  })
  let hasMore = ref(true)     // 是否还有更多数据
  // 方法
  async function getDynamic() {
    if(hasMore){
      let dynamicList = await getDynamicList(submitData)
      console.log(dynamicList)
      hasMore = dynamicList.data.hasMore
      submitData.lastId = dynamicList.data.lastId
      for(let i = 0; i < dynamicList.data.dateList.length; i++){
        dymamicList.push(dynamicList.data.dateList[i])
      }
    }
  }

  onMounted(() => {
    getDynamic()
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
</style>
