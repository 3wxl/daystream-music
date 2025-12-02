<template>
  <div class="flex gap-4 items-start mb-8">
    <div>
      <img :src="avatar" alt="我的头像" class="w-[44px] h-[44px] rounded-[38px] ml-2 flex-shrink-0 cursor-pointer" :id="userId">
    </div>
    <div style="width:calc(100% - 60px)">
      <div class="flex justify-between">
        <p class="font-bold text-[17px] text-white cursor-pointer hover:text-pink-400 mt-[6px]">{{ userName }}</p>
        <span class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500" v-if="!isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="17px"></IconFontSymbol>
        </span>
        <span class="text-[#e5e7eb] mr-1 cursor-pointer text-pink-500" v-if="isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="17px"></IconFontSymbol>
        </span>
      </div>
      <div class="mt-[14px]">
        <p class="text-white">{{ content }}</p>
      </div>
      <div class="mt-3 text-[#e5e7eb] text-[14px] flex gap-2">
        <span class="cursor-pointer hover:text-pink-400" @click="isSpradInput = !isSpradInput ;">{{ replyCount }}回复</span>
        ·
        <span>{{ time }}</span>
      </div>
      <div class="mt-1 text-[#a7a7a7] text-[14px] cursor-pointer" @click="isSpradSonComment = !isSpradSonComment">
        共 {{ commentCount }} 条回复,点击展开
      </div>
      <transition name="el-zoom-in-top">
        <div class="text-white mt-3" v-show="isSpradSonComment">
          <div class="flex w-full flex-col gap-1 mb-4">
            <div class="flex flex-shrink-0 w-full items-center">
              <img :src="avatar" alt="评论者头像" class="w-[30px] h-[30px] rounded-[50%] mr-2 cursor-pointer">
              <span class="text-[15px] text-[#fe65ce] mr-2 cursor-pointer">评论者昵称</span>
              <span class="text-white">
                回复 <span class="text-[#31A2D4] cursor-pointer">@被回复者昵称:</span>
              </span>
            </div>
            <p class="text-[15px] indent-[1.5rem] text-[#e5e7eb]">
              这是一个子评论的内容，表示对上面的评论进行回复。这是一个子评论的内容，表示对上面的评论进行回复。这是一个子评论的内容，表示对上面的评论进行回复。这是一个子评论的内容，表示对上面的评论进行回复。这是一个子评论的内容，表示对上面的评论进行回复。
            </p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[#c4c5c8] text-[13px]">2024-12-11 12:14</span>
                <span class="text-[13px] text-[#e5e7eb] cursor-pointer ml-3 hover:text-pink-500" @click="isSpradInput = !isSpradInput">
                  回复
                </span>
              </div>
              <div class="mr-1">
                <span class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500 text-[13px] ml-3">
                  12 <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
                </span>
              </div>
            </div>
          </div>
          <div class="flex w-full flex-col gap-1 mb-4">
            <div class="flex flex-shrink-0 w-full items-center">
              <img :src="avatar" alt="评论者头像" class="w-[30px] h-[30px] rounded-[50%] mr-2 cursor-pointer">
              <span class="text-[15px] text-[#fe65ce] mr-2 cursor-pointer">评论者昵称</span>
              <span class="text-white">
                回复 <span class="text-[#31A2D4] cursor-pointer">@被回复者昵称:</span>
              </span>
            </div>
            <p class="text-[15px] indent-[1.5rem] text-[#e5e7eb]">
              这是一个子评论的内容，表示对上面的评论进行回复。
            </p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[#c4c5c8] text-[13px]">2024-12-11 12:14</span>
                <span class="text-[13px] text-[#e5e7eb] cursor-pointer ml-3 hover:text-pink-500" @click="isSpradInput = !isSpradInput">
                  回复
                </span>
              </div>
              <div class="mr-1">
                <span class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500 text-[13px] ml-3">
                  12 <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
                </span>
              </div>
            </div>
          </div>
          <!-- 上面这一部分是子评论区，后续可改为组件 -->
        </div>
      </transition>
      <transition name="el-zoom-in-top">      <!-- 回复输入框 -->
        <div class="text-[#e5e7eb]" v-show="isSpradInput">
          <div class="flex-grow-1 rounded-[10px] p-[15px] border-[1px] border-gray-800 bg-[#212533]">
            <div class="">
              <textarea placeholder="回复 @AAA:" ref="commentInput" @input="updateWords" class="custom-scrollbar resize-none h-[4rem] w-full outline-none focus:outline-none text-[#e5e7eb]"></textarea>
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
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 数据
  let props = defineProps({
    commentObj: {
      type: Object,
      required: true,
      default: () => ({
        userId:'1',
        avatar: '../../../public/头像.png',
        userName: '白昼音流👑',
        likeCount: 0,
        replyCount: 0,
        time: '1小时前',
        content: '希望湾湾早日回归祖国怀抱😀',
        commentCount: 15,
        isLike:false
      })
    }
  })
  let {userId,avatar,userName,likeCount,replyCount,time,content,isLike,commentCount} = props.commentObj;
  let isSpradSonComment = ref(false);   // 是否展开子评论
  let isSpradInput = ref(false);        // 是否展开回复输入框
  let commentWords = ref(0);    // 你的输入评论字数
  let commentInput = ref(null);   // 你的评论输入框
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

<style scoped></style>
