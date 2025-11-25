<template>
  <div class="mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm p-[15px]">
    <div class="flex justify-between">
      <div class="flex">
        <div class="w-[60px] h-[60px] rounded-[50%] relative group">
          <el-avatar :src="avatar" :size="60"></el-avatar>
          <div class="group-hover:opacity-100 opacity-0 cursor-pointer duration-[.2s] w-full h-full rounded-[50%] bg-[rgba(0,0,0,.1)] absolute top-0 left-0"></div>
        </div>
        <div class="flex flex-col ml-4">
          <span class="font-bold text-[17px] text-white cursor-pointer hover:text-pink-400 mt-1">{{author}}</span>
          <div class="mt-2 text-[12px] text-[#e5e7eb]">
            <span class="mr-2">{{time}}</span>
            <span>{{identity}}</span>
          </div>
        </div>
      </div>
      <div class="mt-[10px] mr-4">
        <span class="text-[#cfcfcf] text-[14px] border-[1.3px] border-[#e5e7eb] rounded-[16px] hover:bg-[rgba(255,255,255,.1)] px-2 py-1 cursor-pointer">
          <IconFontSymbol name="tianjia" size="14px"></IconFontSymbol>
          关注
        </span>
        <!-- <span class="text-[#cfcfcf] text-[14px] border-[1.3px] border-[#e5e7eb] rounded-[16px] hover:bg-[rgba(255,255,255,.1)] px-2 py-1 cursor-pointer">
          已关注
        </span> -->
      </div>
    </div>
    <div class="pl-[30px] font-[700] text-[24px] mt-[20px] text-white cursor-pointer hover:text-pink-400 duration-[0.2s]" @click="router.push('/community/communityDetail')">
      {{title}}
    </div>
    <div class="mt-[8px] text-white cursor-pointer hover:text-pink-400 duration-[0.2s]" @click="router.push('/community/communityDetail')" v-html="content">

    </div>
    <div class="flex gap-4 px-6 flex-wrap mt-2 mb-3">     <!-- 图片部分 -->
      <div class="w-[16%] aspect-square rounded-[10px] overflow-hidden" v-if="images.length > 1" v-for="imgUrl in images" :key="imgUrl">
        <img :src="imgUrl" alt="" @click="router.push('/community/communityDetail')" class="cursor-pointer duration-[0.5s] w-full h-full rounded-[10px] hover:scale-[1.1] object-cover">
      </div>
      <div class="w-[70%] rounded-[10px] overflow-hidden" v-if="images.length === 1" v-for="imgUrl in images" :key="imgUrl">
        <img :src="imgUrl" alt="" @click="router.push('/community/communityDetail')" class="cursor-pointer duration-[0.5s] w-full h-full rounded-[10px] hover:scale-[1.05] object-cover">
      </div>
    </div>
    <div class="px-10 pt-3 flex justify-end">       <!-- 点赞评论部分 -->
      <span class="mr-10 cursor-pointer group" @click="router.push('/community/communityDetail')">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="评论"
          placement="bottom"
        >
          <IconFontSymbol name="chakantiezihuifu" class="text-white font-[700] group-hover:text-pink-400" size="20px"></IconFontSymbol>
        </el-tooltip>
        <span class="text-[white] text-[14px] ml-1 group-hover:text-pink-400">11050</span>
      </span>
      <span class="cursor-pointer group">
        <el-tooltip
          class="box-item"
          effect="dark"
          content="点赞"
          placement="bottom"
        >
          <IconFontSymbol name="icon" class="text-white group-hover:text-pink-400" size="20px"></IconFontSymbol>
        </el-tooltip>
        <span class="text-[white] text-[14px] ml-1 group-hover:text-pink-400">11050</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {useRouter} from "vue-router";
  const router = useRouter();
  let props = defineProps({
    dynamic: {
      type: Object,
      required: true,
      default: () => ({
        authorId: '',
        avatar: '',
        author: '',
        time: '',
        identity: '',
        title: '',
        content: ''
      })
    }
  })
  let {authorId, avatar, author, time, identity, title, content} = props.dynamic;
  function extractImgSrcByReg(html) {     // 这里是获取一个hmtl片段里面的图片的src组成的数组
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
  function removeImgTags(html) {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/<img[^>]*>/gi, '');
  }
  let images = extractImgSrcByReg(content);
  content = removeImgTags(content);
</script>

<style scoped></style>
