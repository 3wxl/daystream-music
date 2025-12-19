<template>
  <!-- <button v-if="hasGet" class="absolute top-12 z-100 right-[36%] flex items-center cursor-pointer px-[10px] py-[2px] hover:bg-[#f5f5f5] rounded-md shadow-md/5" @click="router.back()">
    <IconFontSymbol name="fanhui" size="20px" class="relative top-[1px]"></IconFontSymbol>
    <span class="ml-1 text-[16px] font-[500]">返回</span>
  </button> -->
  <div class="flex items-start relative" style="height: calc(100vh - 174px)">
    <div class="min-h-[333px] bg-white flex-grow-0 shrink-0 basis-[67%] mb-4 duration-[.2s] rounded-xl  overflow-hidden shadow-lg backdrop-blur-sm w-240 py-[15px] px-[30px] pb-10">
      <div class="">
        <h1 class="text-[black] font-[600] text-[36px]" v-if="hasGet">{{ dynamic.title }}</h1>
        <div class="my-3">
          <p class="text-[#666] text-[13px]" v-if="hasGet">
            {{ formatDateTime(dynamic.createTime) }} · {{dynamic.authorName}}
          </p>
        </div>
        <div class="mt-[20px] text-black dynamic-detail-style" v-html="dynamic.content" v-if="hasGet "></div>
      </div>
    </div>
    <div class="bg-white flex-grow-0 shrink-0 w-[28%] sticky top-0 self-start ml-10 mb-4 duration-[.2s] rounded-xl overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px]">
      <!-- 右侧作者栏 -->
      <div class="flex flex-col items-center">
        <p class="text-[14px] text-[#666] self-start">作者:</p>
        <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
          <img
            :src="dynamic.avatar"
            class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            @click="router.push('/User/PersonalCenter')"
            v-if="hasGet"
          />
        </div>
        <p class="text-[black] text-[18px] font-[600] mt-2" v-if="hasGet">{{dynamic.authorName}}</p>
        <p class="text-[#666] mt-[2px] text-[12px]" v-if="hasGet">{{dynamic.introduction}}</p>
        <div class="flex mt-6 text-[#666] mb-2" v-if="hasGet">
          <span>
            <span class="mr-[2px]">{{dynamic.followCount}}</span>
            粉丝
          </span>
          <span class="mx-14">
            <span class="mr-[2px]">{{ dynamic.postlikeCount }}</span>
            点赞
          </span>
          <span>
            <span class="mr-[2px]">{{ dynamic.followerCount }}</span>
            关注
          </span>
        </div>
        <div class="flex mt-3 gap-7 flex-col">        <!-- 审核按钮 -->
          <button class="danger-btn" style="background-color: #ff4d4f;">
            <IconFontSymbol name="shanchu" size="16px" class="mr-1">
            </IconFontSymbol>
            删除
          </button>
        </div>
      </div>
    </div>
    <div v-show="!hasGet" class="w-full h-full absolute top-0 left-0 z-10 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useRoute,useRouter} from 'vue-router'
  import {GetDynamicDetail} from '@/api/community/Dynamic'
  import {formatDateTime} from '@/utils/timeToolFun';     // 时间格式化
  let route = useRoute();
  let router = useRouter();
  let dynamic = ref();
  let hasGet = ref(false);      // 是否已获取动态详情
  let dynamicId = ref(route.query.id);    // 当前动态id
  async function getNowDaynamic(){      // 获取当前动态详情
    hasGet.value = false
    let res = await GetDynamicDetail(dynamicId.value as string);
    if(res.success){
      dynamic.value = res.data;
      hasGet.value = true
    }else{
      ElMessage({
        message: '获取动态详情失败',
        type: 'warning',
      })
    }
  }
  onMounted(()=>{
    getNowDaynamic();
  })
</script>

<style scoped lang="scss">
  svg {
  width:5em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
  }

  circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
  }

  @keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
  }
  .dynamic-detail-style{
    ::v-deep(p){
      text-indent: 2rem;
      font-size: 16px;
      margin:2px 0;
    }
    ::v-deep(img){
      max-height: 800px;
      object-fit: cover;
      border-radius: 16px;
      cursor: pointer;
      margin: 12px 0;
    }
  }
  .danger-btn {
    border: none;
    color: #fff;
    background-image: linear-gradient(30deg, rgb(255, 37, 37), rgb(247, 214, 106));
    border-radius: 20px;
    background-size: 100% auto;
    font-family: inherit;
    font-size: 17px;
    padding: 0.4em 1.3em;
    cursor: pointer;
  }

  .danger-btn:hover {
    background-position: right center;
    background-size: 200% auto;
    -webkit-animation: pulse 2s infinite;
    animation: pulse513 1.5s infinite;
  }

  @keyframes pulse513 {
    0% {
      box-shadow: 0 0 0 0 #f81c1c66;
    }

    70% {
      box-shadow: 0 0 0 10px rgb(218 103 68 / 0%);
    }

    100% {
      box-shadow: 0 0 0 0 rgb(218 103 68 / 0%);
    }
  }
</style>
