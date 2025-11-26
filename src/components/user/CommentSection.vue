<template>
  <div class="comment-section">
    <div class="comment-input-box">
      <img src="https://picsum.photos/40/40?random=100" alt="用户头像" class="user-avatar" />
      <div class="input-with-btn flex-1">
        <div class="input-btn-container">
          <el-input
            v-model="newComment"
            type="textarea"
            placeholder="分享你的想法..."
            class="comment-input"
            :rows="3"
          ></el-input>
          <el-button
            class="submit-comment-btn"
            @click="submitComment"
            :disabled="!newComment.trim()"
            size="small"
          >
            发布评论
          </el-button>
        </div>
      </div>
    </div>

    <div class="comments-list">
      <div v-for="(comment, index) in comments" :key="index" class="comment-item">
        <div class="comment-header">
          <img :src="comment.avatar" alt="评论者头像" class="comment-avatar" />
          <div class="comment-meta">
            <div class="comment-author">{{ comment.author }}</div>
            <div class="comment-time">{{ comment.time }}</div>
          </div>
          <el-button class="more-comment-btn" icon="el-icon-more" circle size="small" />
        </div>

        <div class="comment-content">{{ comment.content }}</div>

        <div class="comment-actions">
          <div class="action-item action-item-like" @click="toggleLike(comment)">
            <i class="iconfont" :class="{ liked: comment.liked }">&#xe8c3;</i>
            <span :class="{ liked: comment.liked }">{{ comment.likes }}</span>
          </div>
          <div class="action-item" @click="replyComment(comment)">
            <i class="iconfont">&#xe663;</i>
            <span>回复</span>
          </div>
          <div
            class="action-item"
            v-if="comment.replies.length"
            @click="comment.showReplies = !comment.showReplies"
          >
            <i class="iconfont">{{ comment.showReplies ? '&#xe602;' : '&#xe603;' }}</i>
            <span>{{ comment.showReplies ? '收起' : `查看${comment.replies.length}条回复` }}</span>
          </div>
        </div>

        <div v-if="comment.showReplyInput" class="reply-input-box">
          <img src="https://picsum.photos/40/40?random=100" alt="用户头像" class="user-avatar" />
          <div class="input-with-btn flex-1">
            <div class="input-btn-container">
              <el-input
                v-model="replyContent"
                placeholder="回复 @{{ comment.author }}..."
                class="reply-input"
                ref="replyInputRef"
              ></el-input>
              <div class="reply-btn-group">
                <el-button
                  class="submit-reply-btn"
                  @click="submitReply(comment)"
                  :disabled="!replyContent.trim()"
                  size="small"
                >
                  回复
                </el-button>
                <el-button
                  class="cancel-reply-btn"
                  @click="comment.showReplyInput = false"
                  size="small"
                >
                  取消
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="comment.showReplies && comment.replies.length" class="replies-list">
          <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" class="reply-item">
            <img :src="reply.avatar" alt="回复者头像" class="reply-avatar" />
            <div class="reply-content-wrapper">
              <div class="reply-meta">
                <span class="reply-author">{{ reply.author }}</span>
                <span class="reply-to">@{{ comment.author }}</span>
                <span class="reply-time">{{ reply.time }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
              <div class="reply-actions">
                <div class="action-item action-item-like" @click="toggleLike(reply)">
                  <i class="iconfont" :class="{ liked: reply.liked }">&#xe8c3;</i>
                  <span :class="{ liked: reply.liked }">{{ reply.likes }}</span>
                </div>
                <div class="action-item" @click="replyComment(comment, reply)">
                  <i class="iconfont">&#xe663;</i>
                  <span>回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  avatar: string
  author: string
  time: string
  content: string
  likes: number
  liked: boolean
  replies: Reply[]
  showReplies: boolean
  showReplyInput: boolean
}

interface Reply {
  avatar: string
  author: string
  time: string
  content: string
  likes: number
  liked: boolean
}

const comments = ref<Comment[]>([
  {
    avatar: 'https://picsum.photos/40/40?random=1',
    author: '晚风告白',
    time: '2小时前',
    content: '这个歌单太对味了！每首都是宝藏，循环一整天了',
    likes: 28,
    liked: false,
    replies: [
      {
        avatar: 'https://picsum.photos/40/40?random=2',
        author: '问安200824',
        time: '1小时前',
        content: '谢谢喜欢～都是我精挑细选的',
        likes: 8,
        liked: false,
      },
      {
        avatar: 'https://picsum.photos/40/40?random=3',
        author: '星河入梦',
        time: '30分钟前',
        content: '求更多类似的歌！太戳我了',
        likes: 3,
        liked: false,
      },
    ],
    showReplies: true,
    showReplyInput: false,
  },
  {
    avatar: 'https://picsum.photos/40/40?random=4',
    author: '人间理想',
    time: '5小时前',
    content: '爱错这首歌真的百听不厌，王力宏的唱功绝了',
    likes: 15,
    liked: true,
    replies: [
      {
        avatar: 'https://picsum.photos/40/40?random=5',
        author: '音乐收藏家',
        time: '4小时前',
        content: '同意！这首的编曲也超棒',
        likes: 5,
        liked: false,
      },
    ],
    showReplies: false,
    showReplyInput: false,
  },
])

const newComment = ref('')
const replyContent = ref('')
const replyInputRef = ref<any>(null)

const submitComment = () => {
  if (!newComment.value.trim()) return

  const newCommentObj: Comment = {
    avatar: 'https://picsum.photos/40/40?random=100',
    author: '我',
    time: '刚刚',
    content: newComment.value,
    likes: 0,
    liked: false,
    replies: [],
    showReplies: false,
    showReplyInput: false,
  }

  comments.value.unshift(newCommentObj)
  newComment.value = ''
}

const replyComment = (comment: Comment, reply?: Reply) => {
  comment.showReplyInput = true
  if (reply) {
    replyContent.value = `@${reply.author} `
  } else {
    replyContent.value = ''
  }

  nextTick(() => {
    replyInputRef.value?.focus()
  })
}

const submitReply = (comment: Comment) => {
  if (!replyContent.value.trim()) return

  const newReply: Reply = {
    avatar: 'https://picsum.photos/40/40?random=100',
    author: '我',
    time: '刚刚',
    content: replyContent.value,
    likes: 0,
    liked: false,
  }

  comment.replies.push(newReply)
  comment.showReplyInput = false
  comment.showReplies = true
  replyContent.value = ''
}

const toggleLike = (item: Comment | Reply) => {
  if (item.liked) {
    item.likes--
  } else {
    item.likes++
  }
  item.liked = !item.liked
}
</script>

<style lang="scss" scoped>
.comment-section {
  background-color: #0a0a14;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.comment-input-box {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(255, 94, 149, 0.3);
}

.input-btn-container {
  position: relative;
  width: 100%;
  border: 1px solid rgba(255, 94, 149, 0.3);
  border-radius: 8px !important;
  overflow: hidden;
  background: linear-gradient(145deg, #141424 0%, #0f0f1a 100%);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
.input-btn-container:focus-within {
  border-color: #cd3181;
  box-shadow: 0 0 0 2px rgba(255, 94, 149, 0.2);
}
::v-deep .comment-input .el-textarea__inner {
  background-color: transparent !important;
  border: none !important;
  color: #f8fafc;
  padding: 16px;
  resize: none;
  padding-right: 110px;
  font-size: 15px;
  line-height: 1.6;
  caret-color: #cd3181;
}

::v-deep .comment-input .el-textarea__inner::placeholder {
  color: #94a3b8;
}

.submit-comment-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: #cd3181 !important;
  border: none !important;
  color: #0a0a14 !important;
  border-radius: 6px;
  padding: 4px 14px !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 94, 149, 0.3);
  transition: all 0.2s ease;
}

.submit-comment-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 94, 149, 0.4);
  background-color: #c52075 !important;
}

.submit-comment-btn:disabled {
  background-color: #52213a !important;
  box-shadow: none;
  cursor: not-allowed;
  color: #94a3b8 !important;
}

.reply-input-box {
  display: flex;
  gap: 12px;
  padding-left: 52px;
  margin-top: 8px;
  align-items: flex-start;
}

::v-deep .reply-input .el-input__inner {
  background-color: transparent !important;
  border: none !important;
  color: #f8fafc;
  padding: 14px;
  padding-right: 150px;
  font-size: 14px;
  caret-color: #cd3181;
  border-radius: 6px !important;
}

::v-deep .reply-input .el-input__inner::placeholder {
  color: #94a3b8;
}

.reply-btn-group {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
}

.submit-reply-btn {
  background-color: #cd3181 !important;
  border: none !important;
  color: #0a0a14 !important;
  padding: 2px 12px !important;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(255, 94, 149, 0.2);
  font-weight: 500;
}

.submit-reply-btn:disabled {
  background-color: #52213a !important;
  box-shadow: none;
  color: #94a3b8 !important;
}

.cancel-reply-btn {
  background-color: transparent !important;
  border: 1px solid rgba(255, 94, 149, 0.3) !important;
  color: #f8fafc !important;
  padding: 2px 12px !important;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.cancel-reply-btn:hover {
  border-color: #cd3181 !important;
  color: #cd3181 !important;
  background-color: rgba(255, 94, 149, 0.05);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 94, 149, 0.2);
}

.comment-meta {
  flex: 1;
}

.comment-author {
  color: #fff;
  font-weight: 500;
  margin-bottom: 4px;
}

.comment-time {
  color: #94a3b8;
  font-size: 12px;
}

.more-comment-btn {
  background-color: transparent !important;
  color: #94a3b8 !important;
  border: none !important;
  transition: color 0.2s ease;
}

.more-comment-btn:hover {
  color: #cd3181 !important;
}

.comment-content {
  color: #f1f5f9;
  line-height: 1.7;
  padding-left: 52px;
  font-size: 15px;
}

.comment-actions {
  display: flex;
  gap: 20px;
  padding-left: 52px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-item:hover {
  color: #00f0ff;
}
.action-item-like:hover {
  color: #e33745;
}

.action-item .iconfont {
  font-size: 16px;
}

.action-item .liked {
  color: #fc3d4a;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 52px;
  margin-top: 8px;
}

.reply-item {
  display: flex;
  gap: 12px;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.reply-content-wrapper {
  flex: 1;
  background-color: #1a1a30;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 94, 149, 0.1);
  transition: border-color 0.2s ease;
}

.reply-content-wrapper:hover {
  border-color: rgba(255, 94, 149, 0.3);
}

.reply-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-author {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.reply-to {
  color: #cd3181;
  font-size: 14px;
}

.reply-time {
  color: #94a3b8;
  font-size: 12px;
  margin-left: auto;
}

.reply-content {
  color: #f1f5f9;
  line-height: 1.5;
  font-size: 14px;
  margin-bottom: 8px;
}

.reply-actions {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .comment-content,
  .comment-actions,
  .reply-input-box,
  .replies-list {
    padding-left: 0;
  }

  .reply-item {
    flex-direction: column;
    gap: 8px;
  }

  .reply-content-wrapper {
    padding: 10px;
  }

  .submit-comment-btn {
    padding: 2px 8px !important;
    font-size: 12px !important;
  }
  .reply-btn-group {
    gap: 4px;
  }

  .submit-reply-btn,
  .cancel-reply-btn {
    padding: 1px 8px !important;
    font-size: 11px !important;
  }
}
::v-deep .comment-input .el-textarea__inner.is-focus {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
::v-deep .comment-input .el-textarea__inner {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
::v-deep .reply-input .el-input__wrapper {
  border: none !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}
</style>
