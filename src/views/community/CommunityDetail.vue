<template>
  <!-- 动态页详情 -->
  <div class="bg-gradient-to-b from-gray-900 to-gray-950 w-full min-h-full p-5">
    <div class="ml-5 flex items-start">
      <div class="flex-grow-0 shrink-0 basis-[67%] mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-240 py-[15px] px-[30px]">
        <div class="">
          <h1 class="text-[#e5e7eb] font-[600] text-[36px]">我是一个普普通通的标题</h1>
          <div class="my-3">
            <p class="text-[#bcbec2] text-[13px]">
              2022-01-01 00:00:00 · 白昼音流
            </p>
          </div>
          <div class="mt-[20px] text-white">    <!-- 动态详情内容 -->
            <!-- 动态详细内容 ---->    <!-- 文本部分 -->
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px] text-[#ff5100]">
              #四个大人喜人第四赛段第一#
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              感谢大家抬爱啊啊啊啊啊！
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              [泪][泪][泪][努力][努力][努力]好开心！
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              我们一定会继续努力的！！
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              冲啊！！！！！！！！！！！！！！！
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px] text-[#55ff00]">
              #喜人奇妙夜# ​
            </p>
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              11月21日，中国常驻联合国代表傅聪致函联合国秘书长古特雷斯，就日本首相高市早苗涉华错误言行阐明中国政府立场。该函将作为联合国大会正式文件，向全体会员国散发。
            </p>
            <img src="../../../public/头像.png" alt="文章图片" class="mx-auto w-[80%] my-3 rounded-[16px] cursor-pointer">
            <p class="indent-[2em] break-words break-all text-[16px] my-[2px]">
              中国国际问题研究院副研究员苏晓晖表示，日本希望在亚太地区安全当中来提升自身的地位，同时推动大国竞争和战略博弈，在试图形成更强的阵营对抗。而在这个过程当中，所谓打“台湾牌”来实现日本的目标，甚至形成“多海联动”，就成了日本在政策方面的危险的态势。不过，高市早面的这番错误言论在日本国内也遭遇了强烈的反弹，很多人指向的是高市早苗此番言论背后的意图，以及对中日关系所造成的影响和日本承受的损失。
            </p>
          </div>
          <div class="mt-4 border-t-[rgba(255,255,255,0.1)] border-t-[1px] pt-5">      <!-- 评论/数据详情 -->
            <div class="flex justify-center gap-40">
              <span class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="点赞">
                <IconFontSymbol name="icon" size="20px" class="mr-1 text-white"></IconFontSymbol>
                <span class="text-white">11</span>
              </span>
              <!-- <span class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="点赞">
                <IconFontSymbol name="icon" size="20px" class="mr-1 text-pink-600"></IconFontSymbol>
                <span class="text-pink-600">11</span>
              </span> -->
              <span class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="评论">
                <IconFontSymbol name="chakantiezihuifu" size="20px" color="white" class="mr-1 relative bottom-[1px]"></IconFontSymbol>
                <span class="text-white">11</span>
              </span>
            </div>
            <div class="mt-2">
              <h3 class="font-[600] text-[#e5e7eb] text-[25px]">评论 15</h3>
              <div class="mt-4 flex gap-6 items-start">   <!-- 发表评论 -->
                <div class="">
                  <img src="../../../public/头像.png" alt="我的头像" class="w-[50px] h-[50px] rounded-[38px] ml-2">
                </div>
                <div class="flex-grow-1 rounded-[10px] p-[15px] border-[1px] border-gray-800 bg-[#212533]">
                  <div class="">
                    <textarea ref="commentInput" @input="updateWords" class="custom-scrollbar resize-none h-[4rem] w-full outline-none focus:outline-none text-[#e5e7eb]"></textarea>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="ml-1">
                      <span class="text-[#e5e7eb] text-[15px]">{{ commentWords }} / 100</span>
                    </div>
                    <div class="mr-2">
                      <button class="BtnPublish relative text-[#e5e7eb] px-[15px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
                        <IconFontSymbol name="review" size="16px" class="mr-1"></IconFontSymbol>
                        <span class="text-15px">评论</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-12">    <!-- 其他人的评论 -->
                <CommentCard v-for="commentObj in commentList" :key="commentObj.commentId" :commentObj="commentObj"></CommentCard>
              </div>
              <div class="mt-4 mb-2 text-center">
                <!-- <p class="text-[#d2d4d8] text-[15px]">暂无更多评论</p> -->
                <button class="text-[#e5e7eb] text-[15px] px-[9px] py-[6px] rounded-[10px] cursor-pointer border-gray-400 duration-300 hover:bg-pink-600 hover:border-pink-700">查看更多评论</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-grow-0 shrink-0 basis-[28%] ml-10 mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px]">
        <!-- 右侧作者栏 -->
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
          <div class="flex mt-6 text-[#e5e7eb] mb-2">
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
          <div class="mt-[10px] mb-4">
            <button @click="isAttent=!isAttent" v-if="!isAttent" class="BtnPublish relative text-[#e5e7eb] px-[20px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
              <IconFontSymbol name="tianjia" size="18px"></IconFontSymbol>
              关注
              <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
            </button>
            <button @click="isAttent=!isAttent" v-if="isAttent" class="BtnPublish relative text-[#e5e7eb] px-[20px] py-[5px] bg-gray-600 rounded-[10px] cursor-pointer hover:bg-gray-500 active:bg-gray-700 active:scale-95 duration-[0.3s]">
              <IconFontSymbol name="yiguanzhu" size="18px" class="relative top-[1px]"></IconFontSymbol>
              已关注
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { on } from 'events';
  import CommentCard from '@/components/community/CommentCard.vue';

  // 数据
  let commentWords = ref(0);    // 你的输入评论字数
  let commentInput = ref(null);   // 你的评论输入框
  let router = useRouter();   // 路由实例
  let isAttent = ref(false);    // 是否已关注，后续从接口获取
  let commentList = reactive([
    {
      authorId:'1',
      commentId:'1',
      avatar: '../../../public/头像.png',
      author: '白昼音流👑',
      linkCount: 0,
      replyCount: 0,
      time: '1小时前',
      content: '希望湾湾早日回归祖国怀抱😀',
      SonCommentCount: 2,
      isLike:false
    },
    {
      authorId:'2',
      commentId:'2',
      avatar: '../../../public/头像.png',
      author: '周杰伦',
      linkCount: '1w',
      replyCount: 454,
      time: '2小时前',
      content: '加油，中国加油！',
      SonCommentCount: 15,
      isLike:true
    },
    {
      authorId:'3',
      commentId:'3',
      avatar: '../../../public/头像.png',
      author: '爱吃鱼的猫',
      linkCount: 46,
      replyCount: 454,
      time: '1小时前',
      content: '支持祖国统一，反对台独分裂！',
      SonCommentCount: 15,
      isLike:false
    }
  ])
  // 方法
  function updateWords(event) {
    commentWords.value = event.target.value.length;
  }
  onMounted(() => {
    watch(commentWords, (value) => {
      if (value > 100) {
        commentInput.value.value = commentInput.value.value.substring(0, 100);
        commentWords.value = 100;
      }
    })
  })
</script>

<style scoped lang="scss">
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3); /* 滚动滑块颜色 */
  border-radius: 3px; /* 滚动滑块圆角 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* 隐藏滚动轨道 */
}

/* Firefox 浏览器 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.BtnPublish:hover{
  .BtnPing{
    animation: myButtonPing 1s ease-in-out infinite;
  }
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
</style>
