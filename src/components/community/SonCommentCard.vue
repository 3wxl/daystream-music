<template>
  <div class="flex w-full flex-col gap-1 mb-5">
    <div class="flex flex-shrink-0 w-full items-center">
      <img :src="avatar" alt="评论者头像" class="w-[30px] h-[30px] rounded-[50%] mr-2 cursor-pointer">
      <span class="text-[15px] text-[#fe65ce] mr-2 cursor-pointer">{{ username }}</span>
      <span class="text-white">
        回复 <span class="text-[#31A2D4] cursor-pointer">@{{replyUsername}}:</span>
      </span>
    </div>
    <p class="text-[15px] indent-[1.5rem] text-[#e5e7eb]">
      {{ content }}
    </p>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-[#c4c5c8] text-[13px]">{{ formatDateTime(createdTime) }}</span>
        <span class="text-[13px] text-[#e5e7eb] cursor-pointer ml-3 hover:text-pink-500" @click="inputSpread">
          回复
        </span>
      </div>
      <div class="mr-1">
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500 text-[13px] ml-3" v-if="!isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
        </span>
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer text-pink-500" v-if="isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖
  import {Like} from '@/api/community/Like';      // 点赞
  // ts
  // 数据
  let props = defineProps(['sonComment'])
  let {avatar,content,createdTime,id,isLike,isSelf,likeCount,replyUserId,replyUsername,userId,username} = toRefs(props.sonComment)
  let emit = defineEmits(['replyComment'])
  // 方法
  function inputSpread(){
    emit('replyComment')
  }
  function formatDateTime(dateString: string): string {     // 时间格式化
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  let throttleLikeComment = throttle(async function likeDynamic(commentId:string){     // 点赞评论
    let submitData = {
      targetId:commentId,
      targetType:2
    }
    let likeRes = await Like(submitData)
    if(likeRes.success){
      isLike.value = !isLike.value;
      likeCount.value = likeRes.data.likecount
    }else{
      ElMessage({
        message: '点赞失败',
        type: 'warning',
      })
    }
  },1500)
</script>

<style scoped>

</style>
