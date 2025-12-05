<template>
  <div class="flex gap-4 items-start mb-8">
    <div>
      <img :src="avatar" alt="我的头像" class="w-[44px] h-[44px] rounded-[38px] ml-2 flex-shrink-0 cursor-pointer" :id="userId">
    </div>
    <div style="width:calc(100% - 60px)">
      <div class="flex justify-between">
        <p class="font-bold text-[17px] text-white cursor-pointer hover:text-pink-400 mt-[6px]">{{ username }}</p>
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500" v-if="!isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="17px"></IconFontSymbol>
        </span>
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer text-pink-500" v-if="isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="17px"></IconFontSymbol>
        </span>
      </div>
      <div class="mt-[14px]">
        <p class="text-white">{{ content }}</p>
      </div>
      <div class="mt-3 text-[#e5e7eb] text-[14px] flex gap-2">
        <span class="cursor-pointer hover:text-pink-400" @click="isSpradInput = !isSpradInput ;Object.assign(nowCommentData,commentObj)">{{ replyCount }}回复</span>
        ·
        <span>{{ formatDateTime(createdTime) }}</span>
      </div>
      <div class="mt-1 text-[#a7a7a7] text-[14px] cursor-pointer" v-if="childCount>0" @click="isSpradSonComment = !isSpradSonComment;spreadSonComment">
        共 {{ childCount }} 条回复,点击展开
      </div>
      <transition name="el-zoom-in-top">
        <div class="text-white mt-3" v-show="isSpradSonComment">
          <SonCommentCard v-for="sonComment in sonCommentList" :sonComment="sonComment" :key="sonComment.id" @replyComment="commentInputChange(sonComment)"/>
          <div class="-mt-4" v-if="hasMoreSonComment">
            <span class="text-[#e5e7eb] text-[14px] hover:text-pink-400 cursor-pointer duration-200" @click="getSonCommentList">展开查看更多子评论</span>
          </div>
          <div class="-mt-4" v-if="!hasMoreSonComment">
            <span class="text-[#e5e7eb] text-[14px]">没有更多子评论了</span>
          </div>
          <!-- 上面这一部分是子评论区 -->
        </div>
      </transition>
      <transition name="el-zoom-in-top">      <!-- 回复输入框 -->
        <div class="text-[#e5e7eb]" v-show="isSpradInput">
          <div class="flex-grow-1 rounded-[10px] p-[15px] border-[1px] border-gray-800 bg-[#212533]">
            <div class="">
              <textarea :placeholder="`回复 @${nowCommentData.username}`" ref="commentInput" @input="updateWords" class="custom-scrollbar resize-none h-[4rem] w-full outline-none focus:outline-none text-[#e5e7eb]"></textarea>
            </div>
            <div class="flex justify-between items-center">
              <div class="ml-1">
                <span class="text-[#e5e7eb] text-[15px]">{{ commentWords }} / 100</span>
              </div>
              <div class="mr-2">
                <button @click="replyComment(nowCommentData.id)" class="BtnPublish relative text-[#e5e7eb] px-[15px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
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
  import {GetReplyCommentList} from '@/api/community/GetReplyCommentList';    // 获取子评论列表
  import {ReplyComment} from '@/api/community/ReplyComment';    // 回复评论，即创建子评论
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖
  import {Like} from '@/api/community/Like';      // 点赞
  import SonCommentCard from './SonCommentCard.vue';      // 子评论组件
  // 数据
  let props = defineProps({
    commentObj: {
      type: Object,
      required: true,
    }
  })
  let {id,content,userId,username,avatar,createdTime,likeCount,isLike,isSelf,childCount} = toRefs(props.commentObj);
  let isSpradSonComment = ref(false);   // 是否展开子评论
  let isSpradInput = ref(false);        // 是否展开回复输入框
  let lastId = ref(null)      // 子评论列表的lastId
  let commentWords = ref(0);    // 你的输入评论字数
  let commentInput = ref(null);   // 你的评论输入框
  let nowCommentData = reactive({})   // 当前回复评论对象的数据,点击一级评论的评论按钮时将该一级评论的数据保存在这里，点击子评论时将子评论的数据保存在这里
  let sonCommentList = reactive([])    // 子评论列表
  let hasMoreSonComment = ref(false)      // 是否还有更多子评论
  // 方法
  function updateWords(event) {
    commentWords.value = event.target.value.length;
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
  async function getSonCommentList(){     // 获取子评论列表
    if(childCount.value==0)return;      // 如果没有子评论则返回
    let data:{parentId:string;size:number;lastId?:string} = {
      parentId:id.value,
      size:5
    }
    if(lastId)data.lastId = lastId.value;
    let res = await GetReplyCommentList(data);
    if(res.success){
      if(res.data==='后面没有数据了'){
        Object.assign(sonCommentList,[])
      }else{
        hasMoreSonComment.value = res.data.hasMore
        lastId.value = res.data.lastId
        for(let i = 0; i < res.data.dateList.length; i++){
          sonCommentList.push(res.data.dateList[i])
        }
      }
      return true
    }else{
      ElMessage({
        message: '获取子评论列表失败',
        type: 'warning',
      })
      return false
    }
  }
  function spreadSonComment(){    // 展开子评论
    if(getSonCommentList()){
    }
    return
  }
  function commentInputChange(sonComment){
    isSpradInput.value = true;
    Object.assign(nowCommentData,sonComment)
  }
  async function replyComment(commentId:string){     // 回复评论,即创建子评论
    let yourComment = commentInput.value.value
    let data = {
      parentId: commentId,
      content: yourComment
    }
    let res = await ReplyComment(data)
    if(res.success){
      ElMessage({
        message: '回复成功',
        type: 'success',
      })
      commentInput.value.value = ''
      commentWords.value = 0
      childCount.value++
      isSpradInput.value = false
      sonCommentList.unshift(res.data.detailReply)
    }else{
      ElMessage({
        message: '回复失败',
        type: 'warning',
      })
    }
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
  onMounted(() => {
    watch(commentWords, (value) => {
      if (value > 100) {
        commentInput.value.value = commentInput.value.value.substring(0, 100);
        commentWords.value = 100;
      }
    })
    getSonCommentList()
  })
</script>

<style scoped></style>
