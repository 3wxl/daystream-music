<template>
  <div class="mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm p-[15px]">
    <div class="flex justify-between">
      <div class="flex">
        <div class="w-[60px] h-[60px] rounded-[50%] relative group">
          <el-avatar :src="avatar" :size="60"></el-avatar>
          <div class="group-hover:opacity-100 opacity-0 cursor-pointer duration-[.2s] w-full h-full rounded-[50%] bg-[rgba(0,0,0,.1)] absolute top-0 left-0"></div>
        </div>
        <div class="flex flex-col ml-4">
          <span class="font-bold text-[17px] text-white cursor-pointer hover:text-pink-400 mt-1">{{userName}}</span>
          <div class="mt-2 text-[12px] text-[#e5e7eb]">
            <span class="mr-2">{{createTime}}</span>
            <!-- <span>{{introduction}}</span> -->
          </div>
        </div>
      </div>
      <div class="mt-[10px] mr-4">
        <span @click="throttleFollow" v-show="!isFollow" class="text-[#cfcfcf] text-[14px] border-[1.3px] border-[#e5e7eb] rounded-[16px] hover:bg-[rgba(255,255,255,.1)] px-2 py-1 cursor-pointer">
          <IconFontSymbol name="tianjia" size="14px"></IconFontSymbol>
          关注
        </span>
        <span @click="throttleUnFollow" v-show="isFollow" class="text-[#cfcfcf] text-[14px] border-[1.3px] border-[#e5e7eb] rounded-[16px] hover:bg-[rgba(255,255,255,.1)] px-2 py-1 cursor-pointer">
          已关注
        </span>
      </div>
    </div>
    <div class="pl-[30px] font-[700] text-[24px] mt-[20px] text-white cursor-pointer hover:text-pink-400 duration-[0.2s]" @click="openDynamicDetail(`/community/communityDetail?postId=${postId}`)">
      {{title}}
    </div>
    <div class="content-p mt-[8px] text-white cursor-pointer hover:text-pink-400 duration-[0.2s]" @click="openDynamicDetail(`/community/communityDetail?postId=${postId}`)" v-html="content">

    </div>
    <div class="flex gap-4 px-6 flex-wrap mt-2 mb-3">     <!-- 图片部分 -->
      <div class="w-[16%] aspect-square rounded-[10px] overflow-hidden" v-if="images.length > 1" v-for="imgUrl in images" :key="imgUrl">
        <img :src="imgUrl" alt="" @click="openDynamicDetail(`/community/communityDetail?postId=${postId}`)" class="cursor-pointer duration-[0.5s] w-full h-full rounded-[10px] hover:scale-[1.1] object-cover">
      </div>
      <div class="w-[70%] rounded-[10px] overflow-hidden" v-if="images.length === 1" v-for="imgUrl in images" :key="imgUrl">
        <img :src="imgUrl" alt="" @click="openDynamicDetail(`/community/communityDetail?postId=${postId}`)" class="max-h-[700px] object-cover cursor-pointer duration-[0.5s] w-full h-full rounded-[10px] hover:scale-[1.05] object-cover">
      </div>
    </div>
    <div class="px-10 pt-3 flex justify-end">       <!-- 点赞评论部分 -->
      <span class="mr-10 cursor-pointer group" @click="openDynamicDetail(`/community/communityDetail?postId=${postId}`)">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="评论"
          placement="bottom"
        >
          <IconFontSymbol name="chakantiezihuifu" class="text-white font-[700] group-hover:text-pink-400" size="20px"></IconFontSymbol>
        </el-tooltip>
        <span class="text-[white] text-[14px] ml-1 group-hover:text-pink-400">{{commentCount}}</span>
      </span>
      <span class="cursor-pointer group" >
        <el-tooltip
          class="box-item"
          effect="dark"
          content="点赞"
          placement="bottom"
        ><!--:style="`color:${isLike?'#DE5DA8':'white'}`"-->
          <IconFontSymbol name="icon" class="group-hover:text-pink-400" :class="isLike?'text-pink-400':'text-white'"  @click="throttleLikeDynamic(postId)" size="20px"></IconFontSymbol>
        </el-tooltip>
        <span class="text-[14px] ml-1 group-hover:text-pink-400" :class="isLike?'text-pink-400':'text-white'" @click="throttleLikeDynamic(postId)" >{{likeCount}}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useRouter} from "vue-router";
  import {FollowOther,UnFollowOther,Like} from '@/api/community/DynamicOperate';    // 关注和取消关注,点赞
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖

  // 数据
  const router = useRouter();
  let props = defineProps({
    dynamic: {
      type: Object,
      required: true,
      default: () => ({
        userId: '',
        avatar: '',
        userName: '',
        createTime: '',
        introduction: '',
        title: '',
        content: '',
        commentCount: 0,
        likeCount: 0,
        isLike: false,
        isFollow:false,
        postId:''
      })
    }
  })
  let {content} = props.dynamic
  let {userId,postId, avatar, userName, createTime, introduction, title,commentCount,likeCount,isLike,isFollow} = toRefs(props.dynamic);
  createTime.value = formatDateTime(createTime.value);

  // 方法
  function extractImgSrcByReg(html:string) {     // 这里是获取一个hmtl片段里面的图片的src组成的数组
    if (!html || typeof html !== 'string') return [];
    const imgSrcReg = /<img[^>]+src\s*=\s*["']([^"']*)["'][^>]*>/gi;
    const srcList = [];
    let match;
    let count = 0;
    while ((match = imgSrcReg.exec(html)) !== null && count < 5) {
      const src = match[1];
      if (src) {
        srcList.push(src);
        count++;
      }
    }
    return [...new Set(srcList)];
  }
  function limitHtmlWordCount(html:string, maxCount:number) {
    if (!html || typeof html !== 'string') return '';
    if (maxCount <= 0) return '';
    const pureText = html.replace(/<[^>]+>/g, '');
    if (pureText.length <= maxCount) {
      return html;
    }
    let remainingCount = maxCount;
    let resultHtml = '';
    const pTagReg = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    let isTruncated = false;
    while ((match = pTagReg.exec(html)) !== null && !isTruncated) {
      const pTagStart = match[0].split('>')[0] + '>';
      const pContent = match[1];
      const pPureText = pContent.replace(/<[^>]+>/g, '');
      if (pPureText.length <= remainingCount) {
        resultHtml += pTagStart + pContent + '</p>';
        remainingCount -= pPureText.length;
      } else {
        let truncatedContent = '';
        let currentContent = pContent;
        let currentRemaining = remainingCount;
        for (let i = 0; i < currentContent.length && currentRemaining > 0; i++) {
          const char = currentContent[i];
          if (char === '<') {
            const tagEndIndex = currentContent.indexOf('>', i);
            if (tagEndIndex !== -1) {
              truncatedContent += currentContent.substring(i, tagEndIndex + 1);
              i = tagEndIndex; // 跳过标签内容
            } else {
              truncatedContent += char;
            }
          } else {
            truncatedContent += char;
            currentRemaining--;
          }
        }
        if (!truncatedContent.endsWith('>') && currentRemaining <= 0) {
          truncatedContent += '...';
        }
        resultHtml += pTagStart + truncatedContent + '</p>';
        isTruncated = true;
      }
    }
    return resultHtml;
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
  function removeImgTags(html:string) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/<img[^>]*>/gi, '');
  }
  let images = extractImgSrcByReg(content);
  content = limitHtmlWordCount(removeImgTags(content), 300);    // 限制内容字数为300字，防止内容过长
  let throttleFollow = throttle(async function(){      // 关注动态作者
    let res = await FollowOther(userId.value)
    if(res.success){
      ElMessage({
        message: '关注成功',
        type: 'success',
      })
      isFollow.value = true
    }else{
      ElMessage({
        message: '关注失败',
        type: 'warning',
      })
    }
  },1500)
  let throttleUnFollow = throttle(async function(){      // 取消关注动态作者
    let res = await UnFollowOther(userId.value)
    if(res.success){
      ElMessage({
        message: '取消关注成功',
        type: 'success',
      })
      isFollow.value = false
    }else{
      ElMessage({
        message: '取消关注失败',
        type: 'warning',
      })
    }
  },1500)
  let throttleLikeDynamic = throttle(async function likeDynamic(dynamicId:string){     // 点赞动态
    let submitData = {
      targetId:dynamicId,
      targetType:3
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
  function openDynamicDetail(path:string) {
    window.open(path,'_blank')
  }
</script>

<style scoped lang="scss">
.content-p {
  ::v-deep(p) {
    text-indent: 2rem;
  }
  ::v-deep(img){
    max-height: 800px;
    object-fit: cover;
  }
}
</style>
