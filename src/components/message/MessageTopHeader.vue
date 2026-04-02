<template>
  <header class="h-[50px] border-b-1 border-[#1f2d3d]">
    <div class="flex h-full px-10 items-center gap-4">
      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(1, '/message/likeMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300 realative"
          :class="getCurrentRouteIndex() === 1 ? 'text-pink-500' : ''"
        >
          点赞
          <span v-if="likeCount>0" class="absolute top-2 right-2 inline-block min-w-[15px] min-h-[15px] text-center line-clamp-1 rounded-[16px] p-[2px] text-white text-[11px]/[13px] bg-pink-600">
            {{ likeCount }}
          </span>
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 1 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(2, '/message/commentMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300 relative"
          :class="getCurrentRouteIndex() === 2 ? 'text-pink-500' : ''"
        >
          评论
          <span v-if="commentCount>0" class="absolute top-2 right-2 inline-block min-w-[15px] min-h-[15px] text-center line-clamp-1 rounded-[16px] p-[2px] text-white text-[11px]/[13px] bg-pink-600">
            {{ commentCount }}
          </span>
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 2 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(3, '/message/followerMessage')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300 relative"
          :class="getCurrentRouteIndex() === 3 ? 'text-pink-500' : ''"
        >
          我的粉丝
          <span v-if="followCount>0" class="absolute top-2 right-2 inline-block min-w-[15px] min-h-[15px] text-center line-clamp-1 rounded-[16px] p-[2px] text-white text-[11px]/[13px] bg-pink-600">
            {{ followCount }}
          </span>
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 3 ? 'w-full' : ''"
        ></div>
      </div>

      <div
        class="px-2 group cursor-pointer relative"
        @click="navigateTo(4, '/message/privateLetter')"
      >
        <div
          class="w-[100px] text-[16px] text-[#e5e7eb] flex items-center justify-center h-[48px] group-hover:text-pink-500 duration-300 relative"
          :class="getCurrentRouteIndex() === 4 ? 'text-pink-500' : ''"
        >
          私信
          <span v-if="privateMessageCount>0" class="absolute top-2 right-2 inline-block min-w-[15px] min-h-[15px] text-center line-clamp-1 rounded-[16px] p-[2px] text-white text-[11px]/[13px] bg-pink-600">
            {{ privateMessageCount }}
          </span>
        </div>
        <div
          class="h-[2px] w-0 bg-pink-500 group-hover:w-full duration-300"
          :class="getCurrentRouteIndex() === 4 ? 'w-full' : ''"
        ></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {GetMessageCountAPI} from "@/api/messageChat/index";     // 未读消息数量
import type {getMessageCountInterface} from "@/types/message";

const router = useRouter()
const route = useRoute()

let commentCount = ref(0);
let followCount = ref(0);
let likeCount = ref(0);
let privateMessageCount = ref(0);

// 根据当前路由路径确定应该激活的索引
const getCurrentRouteIndex = () => {
  const path = route.path
  if (path.includes('/message/likeMessage')) return 1
  if (path.includes('/message/commentMessage')) return 2
  if (path.includes('/message/followerMessage')) return 3
  if (path.includes('/message/privateLetter')) return 4
  return 1 // 默认返回第一个
}

// 导航函数
const navigateTo = (index: number, path: string) => {
  router.push(path)
}
async function getMessageCount(){
  let res : getMessageCountInterface = await GetMessageCountAPI() as getMessageCountInterface
  commentCount.value = res.data.commentCount
  followCount.value = res.data.followCount;
  likeCount.value = res.data.likeCount;
  privateMessageCount.value = res.data.privateMessageCount;
}
onMounted(()=>{
  getMessageCount()       // 初始化数量
})
</script>

<style scoped>
/* 可以添加一些额外的样式优化 */
</style>
