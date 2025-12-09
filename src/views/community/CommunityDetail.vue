<template>
  <!-- 动态页详情 -->
  <div class="h-full overflow-y-auto custom-scrollbar layout-scrollbar" @scroll="handleScroll">
    <div class="bg-gradient-to-b from-gray-900 to-gray-950 w-full min-h-full p-5">
      <div class="ml-5 flex items-start relative">
        <div class="flex-grow-0 shrink-0 basis-[67%] mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-240 py-[15px] px-[30px]">
          <div class="">
            <h1 class="text-[#e5e7eb] font-[600] text-[36px]">{{dynamic.title}}</h1>
            <div class="my-3">
              <p class="text-[#bcbec2] text-[13px]">
                {{formatDateTime(dynamic.createTime)}} · {{dynamic.authorName}}
              </p>
            </div>
            <!--动态内容-->
            <div class="mt-[20px] text-white dynamic-detail-style" v-html="dynamic.content">
            </div>
            <div class="mt-4 border-t-[rgba(255,255,255,0.1)] border-t-[1px] pt-5">      <!-- 评论/数据详情 -->
              <div class="flex justify-center gap-40">
                <span v-if="!dynamic.isLike" @click="throttleLikeDynamic(dynamic.postId)" class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="点赞">
                  <IconFontSymbol name="icon" size="20px" class="mr-1 text-white"></IconFontSymbol>
                  <span class="text-white">{{ dynamic.postlikeCount }}</span>
                </span>
                <span v-if="dynamic.isLike" @click="throttleLikeDynamic(dynamic.postId)" class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="点赞">
                  <IconFontSymbol name="icon" size="20px" class="mr-1 text-pink-600"></IconFontSymbol>
                  <span class="text-pink-600">{{ dynamic.postlikeCount }}</span>
                </span>
                <span @click="commentInput.focus()" class="text-[white] px-[15px] py-[2px] rounded-[15px] cursor-pointer bg-pink-500/20 text-pink-200 shadow-lg border border-pink-400/60" title="评论">
                  <IconFontSymbol name="chakantiezihuifu" size="20px" color="white" class="mr-1 relative bottom-[1px]"></IconFontSymbol>
                  <span class="text-white">{{ dynamic.commentCount }}</span>
                </span>
              </div>
              <div class="mt-2">
                <h3 class="font-[600] text-[#e5e7eb] text-[25px]">评论 {{ dynamic.commentCount }}</h3>
                <div class="mt-4 flex gap-6 items-start">   <!-- 发表评论 -->
                  <div class="">
                    <img :src="dynamic.avatar" alt="头像" class="w-[50px] h-[50px] rounded-[38px] ml-2">
                  </div>
                  <div class="flex-grow-1 rounded-[10px] p-[15px] border-[1px] border-gray-800 bg-[#212533]">
                    <div class="">
                      <textarea :placeholder="dynamic.commentCount===0?'暂没有人评论，赶紧抢占沙发吧~':'发表评论热热场子'" ref="commentInput" @input="updateWords" class="custom-scrollbar resize-none h-[4rem] w-full outline-none focus:outline-none text-[#e5e7eb]"></textarea>
                    </div>
                    <div class="flex justify-between items-center">
                      <div class="ml-1">
                        <span class="text-[#e5e7eb] text-[15px]">{{ commentWords }} / 100</span>
                      </div>
                      <div class="mr-2">
                        <button @click="throttleCommentDynamic(dynamic.postId)" class="BtnPublish relative text-[#e5e7eb] px-[15px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
                          <IconFontSymbol name="review" size="16px" class="mr-1"></IconFontSymbol>
                          <span class="text-15px">评论</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-12">    <!-- 其他人的评论 -->
                  <CommentCard v-for="commentObj in commentList" :key="commentObj.commentId?commentObj.commentId:commentObj.id" :commentObj="commentObj"></CommentCard>
                  <div class="flex justify-center" v-if="hasMoreComment">
                    <div class="loader">
                      <span class="bar"></span>
                      <span class="bar"></span>
                      <span class="bar"></span>
                    </div>
                  </div>
                  <div class="my-2 text-center text-[#e5e7eb] text-[14px]" v-if="!hasMoreComment">
                    没有更多评论了~
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sticky top-[20px] self-start flex-grow-0 shrink-0 basis-[28%] ml-10 mb-4 duration-[.2s] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm w-100 p-[15px]">
          <!-- 右侧作者栏 -->
          <div class="flex flex-col items-center">
            <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
              <img
                :src="'http://39.96.214.163:9000/file/70567a01-09d0-443b-9d8a-bab6e5623967.png'"
                class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                @click="router.push('/User/PersonalCenter')"
              />
            </div>
            <p class="text-[#e5e7eb] text-[18px] font-[600] mt-2">{{ dynamic.authorName }}</p>
            <p class="text-[#bdbdbd] mt-[2px] text-[12px]">{{dynamic.introduction?dynamic.introduction:'这个人很懒，还没有填写简介  ε=( o｀ω′)ノ'}}</p>
            <div class="flex mt-6 text-[#e5e7eb] mb-2">
              <span>
                <span class="mr-[2px]">{{dynamic.followerCount}}</span>
                粉丝
              </span>
              <span class="mx-14">
                <span class="mr-[2px]">{{dynamic.authorLikeCount}}</span>
                点赞
              </span>
              <span>
                <span class="mr-[2px]">{{dynamic.followCount}}</span>
                关注
              </span>
            </div>
            <div class="mt-[10px] mb-4">
              <button @click="throttleFollow" v-if="!isAttent" class="BtnPublish relative text-[#e5e7eb] px-[20px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
                <IconFontSymbol name="tianjia" size="18px"></IconFontSymbol>
                关注
                <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
              </button>
              <button @click="throttleUnFollow" v-if="isAttent" class="BtnPublish relative text-[#e5e7eb] px-[20px] py-[5px] bg-gray-600 rounded-[10px] cursor-pointer hover:bg-gray-500 active:bg-gray-700 active:scale-95 duration-[0.3s]">
                <IconFontSymbol name="yiguanzhu" size="18px" class="relative top-[1px]"></IconFontSymbol>
                已关注
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { on } from 'events';
  import CommentCard from '@/components/community/CommentCard.vue';
  import {GetDynamicDetail} from '@/api/community/Dynamic';      // 获取动态详情
  import {GetDynamicComment,DynamicCommentRelease} from '@/api/community/Comment';      // 获取动态一级评论 ,发布评论
  import {Like,FollowOther,UnFollowOther} from '@/api/community/DynamicOperate';      // 点赞 关注和取消关注
  import { ElMessage } from 'element-plus'
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖

  // 数据
  let commentWords = ref(0);    // 你的输入评论字数
  let commentInput = ref(null);   // 你的评论输入框
  let router = useRouter();   // 路由实例
  let route = useRoute();
  let isAttent = ref(false);    // 是否已关注，后续从接口获取
  let commentList = reactive([    // 一级评论列表
  ])
  let lastCommentId = ref(null);    // 最后一条一级评论的id
  let hasMoreComment = ref(false);
  let isGetMore = ref(false)
  let dynamic = ref<any>({})
  let postId:string|string[] = route.query.postId;    // 当前动态的id
  // 方法
  function updateWords(event) {
    commentWords.value = event.target.value.length;
  }
  async function getNowDaynamic(){      // 获取当前动态详情
    let res = await GetDynamicDetail(postId);
    if(res.success){
      dynamic.value = res.data;
      isAttent.value = res.data.isFollow;
    }else{
      ElMessage({
        message: '获取动态详情失败',
        type: 'warning',
      })
    }
  }
  async function getDynamicComment(){      // 获取动态评论
    let data = {
      targetId:postId,
      targetType:4,
      size:10
    }
    if(lastCommentId.value)data.lastId = lastCommentId.value;
    let res = await GetDynamicComment(data);
    if(res.success){
      hasMoreComment.value = res.data.hasMore;
      lastCommentId.value = res.data.lastId;
      isGetMore.value = false
      for(let i=0;i<res.data.dateList.length;i++){
        commentList.push(res.data.dateList[i])
      }
    }else{
      ElMessage({
        message: '获取动态评论失败',
        type: 'warning',
      })
    }
  }
  let throttleLikeDynamic = throttle(async function likeDynamic(dynamicId:string){     // 点赞动态
    let submitData = {
      targetId:dynamicId,
      targetType:3
    }
    let likeRes = await Like(submitData)
    if(likeRes.success){
      dynamic.value.isLike = !dynamic.value.isLike;
      dynamic.value.postlikeCount = likeRes.data.likecount
      if(dynamic.value.isLike){
        dynamic.value.authorLikeCount ++
      }else{
        dynamic.value.authorLikeCount --
      }
    }else{
      ElMessage({
        message: '点赞失败',
        type: 'warning',
      })
    }
  },1500)
  let throttleCommentDynamic = throttle(async function commentDynamic(dynamicId:string){      // 评论动态
    let yourComment = commentInput.value.value
    if(yourComment === ''){
      ElMessage({
        message: '请输入评论内容',
        type: 'warning',
      })
      return
    }
    let commentRes = await DynamicCommentRelease({
      targetId: dynamicId,
      targetType: 4,
      content: yourComment
    })
    if(commentRes.success){
      ElMessage({
        message: '评论成功',
        type: 'success',
      })
      commentInput.value.value = ''
      commentWords.value = 0
      dynamic.value.commentCount ++
      commentList.unshift(commentRes.data.detailComment)
    }else{
      ElMessage({
        message: '评论失败',
        type: 'warning',
      })
    }
  },1500)
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
  let throttleFollow = throttle(async function(){      // 关注动态作者
    let res = await FollowOther(dynamic.value.authorId)
    if(res.success){
      ElMessage({
        message: '关注成功',
        type: 'success',
      })
      dynamic.value.followCount ++
      isAttent.value = true
    }else{
      ElMessage({
        message: '关注失败',
        type: 'warning',
      })
    }
  },1500)
  let throttleUnFollow = throttle(async function(){      // 取消关注动态作者
    let res = await UnFollowOther(dynamic.value.authorId)
    if(res.success){
      ElMessage({
        message: '取消关注成功',
        type: 'success',
      })
      dynamic.value.followCount --
      isAttent.value = false
    }else{
      ElMessage({
        message: '取消关注失败',
        type: 'warning',
      })
    }
  },1500)
  let handleScroll = throttle(function(e){
    if(e.target.scrollHeight - 200 <= e.target.scrollTop + e.target.clientHeight){
      if(!isGetMore.value && hasMoreComment.value){
        isGetMore.value = true
        getDynamicComment()
      }
    }
  },1000)
  onMounted(() => {
    watch(commentWords, (value) => {
      if (value > 100) {
        commentInput.value.value = commentInput.value.value.substring(0, 100);
        commentWords.value = 100;
      }
    })
    getNowDaynamic()    // 获取当前动态详情
    getDynamicComment()   // 获取当前动态的一级评论
  })

</script>

<style scoped lang="scss">
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

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
</style>
