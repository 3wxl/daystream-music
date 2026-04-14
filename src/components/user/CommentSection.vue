<template>
  <div class="comment-section">
    <!-- 发表评论输入框 -->
    <div class="comment-input-box">
      <img :src="userAvatar" alt="用户头像" class="user-avatar" />
      <div class="input-with-btn flex-1">
        <div class="input-btn-container">
          <el-input
            v-model="newComment"
            type="textarea"
            placeholder="分享你的想法..."
            class="comment-input"
            :rows="3"
            :disabled="loading"
          ></el-input>
          <el-button
            class="submit-comment-btn"
            @click="submitComment"
            :disabled="!newComment.trim() || loading"
            size="small"
          >
            {{ loading ? '发布中...' : '发布评论' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loadingComments" class="loading-container py-8 text-center">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 无评论状态 -->
    <div v-else-if="comments.length === 0" class="empty-comments py-8 text-center text-gray-500">
      <el-empty description="暂无评论，快来发表第一条评论吧～" />
    </div>

    <!-- 评论列表 -->
    <div v-else class="comments-list">
      <div v-for="(comment, index) in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <img :src="comment.avatar" alt="评论者头像" class="comment-avatar" />
          <div class="comment-meta">
            <div class="comment-author">{{ comment.username }}</div>
            <div class="comment-time">{{ formatTime(comment.createdTime) }}</div>
          </div>
          <!-- 更多操作：删除/举报 -->
          <el-dropdown @command="(command) => handleCommentCommand(command, comment)">
            <i class="iconfont">&#xe73a;</i>
            <template #dropdown>
              <el-dropdown-menu class="custom-dark-dropdown">
                <el-dropdown-item v-if="comment.isSelf" command="delete">删除</el-dropdown-item>
                <el-dropdown-item command="report">举报</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="comment-content">{{ comment.content }}</div>

        <div class="comment-actions">
          <div class="action-item action-item-like" @click="toggleLike(comment)">
            <i class="iconfont" :class="{ liked: comment.isLike }">&#xe8c3;</i>
            <span :class="{ liked: comment.isLike }">{{ comment.likeCount }}</span>
          </div>
          <div class="action-item" @click="replyComments(comment)">
            <i class="iconfont">&#xe663;</i>
            <span>回复</span>
          </div>
          <div
            class="action-item"
            v-if="comment.childCount > 0"
            @click="toggleShowReplies(comment)"
          >
            <i class="iconfont">{{ comment.showReplies ? '&#xe602;' : '&#xe603;' }}</i>
            <span>{{ comment.showReplies ? '收起' : `查看${comment.childCount}条回复` }}</span>
          </div>
        </div>

        <!-- 回复输入框 -->
        <div v-if="comment.showReplyInput" class="reply-input-box">
          <img :src="userAvatar" alt="用户头像" class="user-avatar" />
          <div class="input-with-btn flex-1">
            <div class="input-btn-container">
              <el-input
                v-model="comment.replyContent"
                :placeholder="'回复 @' + (comment.username || '用户') + '...'"
                class="reply-input"
                ref="replyInputRef"
                :disabled="loading"
              ></el-input>
              <div class="reply-btn-group">
                <el-button
                  class="submit-reply-btn"
                  @click="submitReply(comment)"
                  :disabled="!comment.replyContent.trim() || loading"
                  size="small"
                >
                  {{ loading ? '回复中...' : '回复' }}
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

        <!-- 子评论列表 -->
        <div v-if="comment.showReplies" class="replies-list">
          <!-- 子评论加载状态 -->
          <div v-if="comment.loadingReplies" class="py-4 text-center">
            <el-skeleton :rows="2" animated />
          </div>

          <!-- 子评论列表 -->
          <div
            v-else
            v-for="(reply, replyIndex) in comment.replies"
            :key="reply.id"
            class="reply-item"
          >
            <img :src="reply.avatar" alt="回复者头像" class="reply-avatar" />
            <div class="reply-content-wrapper">
              <div class="reply-meta">
                <span class="reply-author">{{ reply.username }}</span>
                <span class="reply-to">@{{ comment.username }}</span>
                <span class="reply-time">{{ formatTime(reply.createdTime) }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
              <div class="reply-actions">
                <div class="action-item action-item-like" @click="toggleLike(reply)">
                  <i class="iconfont" :class="{ liked: reply.isLike }">&#xe8c3;</i>
                  <span :class="{ liked: reply.isLike }">{{ reply.likeCount }}</span>
                </div>
                <div class="action-item" @click="replyComments(comment, reply)">
                  <i class="iconfont">&#xe663;</i>
                  <span>回复</span>
                </div>
                <!-- 子评论更多操作 -->
                <el-dropdown @command="(cmd) => handleReplyCommand(cmd, comment, reply)">
                  <i class="iconfont more-reply-btn">&#xe73a;</i>
                  <template #dropdown>
                    <el-dropdown-menu class="custom-dark-dropdown">
                      <el-dropdown-item v-if="reply.isSelf" command="delete">删除</el-dropdown-item>
                      <el-dropdown-item command="report">举报</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 举报弹窗组件 -->
    <ReportDialog
      v-model:visible="reportDialogVisible"
      :target-id="currentReportTargetId"
      :target-type="currentReportTargetType"
      @close="handleReportDialogClose"
      @success="handleReportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type {
  ReleaseCommentParams,
  GetParentCommentParams,
  GetReplyCommentParams,
  ReplyCommentParams,
  DeleteCommentParams,
  ReportCommentParams,
} from '@/types/comment/index'
import {
  releaseComment,
  getParentCommentList,
  getReplyCommentList,
  replyComment,
  deleteComment,
  reportComment,
} from '@/api/comment'
import { getUserInfo, likeRecord } from '@/api/personalCenter/index'
import { ElMessage } from 'element-plus'

// 接收父组件传递的参数
const props = defineProps<{
  targetId: string // 歌单ID
  targetType: number // 固定为2（歌单类型）
}>()

// ========== 核心状态定义 ==========
// 用户信息（头像）
const userAvatar = ref('https://picsum.photos/40/40?random=100')

// 举报弹窗相关
const reportDialogVisible = ref(false)
const currentReportTargetId = ref('')
const currentReportTargetType = ref(2)

// 加载状态
const loading = ref(false)
const loadingComments = ref(false)

// 发表评论输入框
const newComment = ref('')

// 父评论列表类型定义
interface CommentItem {
  id: string | number
  avatar: string
  username: string
  createdTime: string
  content: string
  likeCount: number
  isLike: boolean
  isSelf: boolean
  childCount: number
  showReplies: boolean
  showReplyInput: boolean
  replyContent: string
  loadingReplies: boolean
  replies: ReplyItem[]
  lastId: string | null
  hasMoreReplies: boolean
}

// 子评论类型定义
interface ReplyItem {
  id: string | number
  avatar: string
  username: string
  createdTime: string
  content: string
  likeCount: number
  isLike: boolean
  isSelf: boolean
  replyUserId: number
  replyUsername: string
}

const comments = ref<CommentItem[]>([])

// ========== 核心方法 ==========
// 获取用户信息
const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.data?.avatar) {
      userAvatar.value = res.data.avatar
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 格式化时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return '未知时间'
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now.getTime() - time.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  return `${Math.floor(diff / day)}天前`
}

// 加载父评论列表
const loadParentComments = async (lastId: string | null = null) => {
  loadingComments.value = true
  try {
    const params: GetParentCommentParams = {
      targetId: props.targetId,
      targetType: props.targetType,
      lastId,
      size: 10,
    }
    const res = await getParentCommentList(params)
    console.log('加载父评论列表:', res)
    if (res.success && res.data?.dateList) {
      const newComments = res.data.dateList.map((item) => ({
        id: item.id,
        avatar: item.avatar || 'https://picsum.photos/40/40?random=100',
        username: item.username,
        createdTime: item.createdTime,
        content: item.content,
        likeCount: item.likeCount,
        isLike: item.isLike,
        isSelf: item.isSelf,
        childCount: item.childCount,
        showReplies: false,
        showReplyInput: false,
        replyContent: '',
        loadingReplies: false,
        replies: [],
        lastId: null,
        hasMoreReplies: res.data.hasMore,
      }))

      if (lastId) {
        comments.value = [...comments.value, ...newComments]
      } else {
        comments.value = newComments
      }
    }
  } catch (error) {
    console.error('加载评论失败:', error)
    ElMessage.error('加载评论失败，请稍后重试')
  } finally {
    loadingComments.value = false
  }
}

// 加载子评论列表
const loadReplyComments = async (comment: CommentItem) => {
  if (comment.loadingReplies || !comment.id) return

  comment.loadingReplies = true
  try {
    const params: GetReplyCommentParams = {
      parentId: comment.id.toString(),
      lastId: comment.lastId,
      size: 10,
    }
    const res = await getReplyCommentList(params)
    console.log('加载回复评论列表:', res)
    if (res.success && res.data?.dateList) {
      const newReplies = res.data.dateList.map((item) => ({
        id: item.id,
        avatar: item.avatar || 'https://picsum.photos/40/40?random=100',
        username: item.username,
        createdTime: item.createdTime,
        content: item.content,
        likeCount: item.likeCount,
        isLike: item.isLike,
        isSelf: item.isSelf,
        replyUserId: item.replyUserId,
        replyUsername: item.replyUsername,
      }))

      if (comment.lastId) {
        comment.replies = [...comment.replies, ...newReplies]
      } else {
        comment.replies = newReplies
      }

      comment.lastId = res.data.lastId
      comment.hasMoreReplies = res.data.hasMore
    }
  } catch (error) {
    console.error('加载回复失败:', error)
    ElMessage.error('加载回复失败，请稍后重试')
  } finally {
    comment.loadingReplies = false
  }
}

// 发表评论
const submitComment = async () => {
  if (!newComment.value.trim()) return

  loading.value = true
  try {
    const params: ReleaseCommentParams = {
      targetId: props.targetId,
      targetType: props.targetType,
      content: newComment.value.trim(),
    }
    const res = await releaseComment(params)
    console.log('发布评论:', res)
    if (res.success) {
      ElMessage.success('评论发布成功！')
      newComment.value = ''
      loadParentComments()
    }
  } catch (error) {
    console.error('发布评论失败:', error)
    ElMessage.error('发布评论失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 回复评论
const replyComments = (comment: CommentItem, reply?: ReplyItem) => {
  comment.showReplyInput = true
  comment.replyContent = reply ? `@${reply.username} ` : ''

  nextTick(() => {
    const replyInput = document.querySelector(
      `.reply-input[placeholder="回复 @${comment.username}..."]`,
    )
    if (replyInput) (replyInput as HTMLInputElement).focus()
  })
}

// 提交回复
const submitReply = async (comment: CommentItem) => {
  if (!comment.replyContent.trim() || !comment.id) return

  loading.value = true
  try {
    const params: ReplyCommentParams = {
      parentId: comment.id.toString(),
      content: comment.replyContent.trim(),
    }
    const res = await replyComment(params)
    console.log('回复评论:', res)
    if (res.success) {
      ElMessage.success('回复成功！')
      comment.showReplyInput = false
      comment.replyContent = ''
      comment.lastId = null
      loadReplyComments(comment)
      comment.childCount += 1
    }
  } catch (error) {
    console.error('回复失败:', error)
    ElMessage.error('回复失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 切换显示/隐藏子评论
const toggleShowReplies = async (comment: CommentItem) => {
  comment.showReplies = !comment.showReplies
  if (comment.showReplies && comment.replies.length === 0) {
    await loadReplyComments(comment)
  }
}

// 点赞/取消点赞
const toggleLike = async (item: CommentItem | ReplyItem) => {
  try {
    const res = await likeRecord({
      targetId: String(item.id),
      targetType: 2, // 评论点赞类型为2
    })
    console.log('点赞/取消点赞:', res)
    if (res.success) {
      // 使用类型断言或进行字段名转换
      const data = res.data as any

      // 更新本地状态
      item.isLike = data.islike ? 1 : 0
      if (data.likecount !== undefined) {
        item.likeCount = data.likecount
      }
    } else {
      ElMessage.error(res.errorMsg || '操作失败，请重试')
    }
  } catch (error) {
    console.error('点赞/取消点赞失败:', error)
    ElMessage.error('网络异常，操作失败')
  }
}

// 处理父评论更多操作（删除/举报）
const handleCommentCommand = async (command: string, comment: CommentItem) => {
  if (command === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      const res = await deleteComment(Number(comment.id))
      console.log('删除评论:', res)
      if (res.success) {
        ElMessage.success('删除成功！')
        comments.value = comments.value.filter((item) => item.id !== comment.id)
      }
    } catch (error) {
      if (error !== 'cancel' && !(error instanceof Error && error.message === 'cancel')) {
        console.error('删除评论失败:', error)
        ElMessage.error('删除失败，请稍后重试')
      }
    }
  } else if (command === 'report') {
    // 打开举报弹窗
    handleReport(comment.id.toString(), 2)
  }
}

// 处理子评论更多操作（删除/举报）
const handleReplyCommand = async (command: string, comment: CommentItem, reply: ReplyItem) => {
  console.log('触发回复操作：', { command, commentId: reply.id, reply })

  if (command === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除这条回复吗？', '提示', {
        type: 'warning',
      })
      console.log(reply.id)
      const params: DeleteCommentParams = {
        commentId: reply.id as string | number,
      }
      console.log('删除参数：', params)
      const res = await deleteComment(params)
      console.log('删除回复:', res)
      if (res.success) {
        ElMessage.success('删除成功！')
        comment.replies = comment.replies.filter((item) => item.id !== reply.id)
        comment.childCount -= 1
      }
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'cancel') {
        console.error('删除回复失败：', error)
        ElMessage.error('删除失败，请稍后重试')
      }
    }
  } else if (command === 'report') {
    // 打开举报弹窗
    handleReport(reply.id.toString(), 2)
  }
}

// 举报弹窗相关方法
const handleReport = (targetId: string, targetType: number = 2) => {
  currentReportTargetId.value = targetId
  currentReportTargetType.value = targetType
  reportDialogVisible.value = true
}

const handleReportDialogClose = () => {
  reportDialogVisible.value = false
}

const handleReportSuccess = () => {}

// ========== 初始化 & 监听 ==========
onMounted(async () => {
  await loadUserInfo()
  await loadParentComments()
})

watch([() => props.targetId, () => props.targetType], () => {
  loadParentComments()
})
</script>

<style lang="scss" scoped>
// 基础样式
.loading-container {
  width: 100%;
}

.empty-comments {
  color: #94a3b8;
}

.more-reply-btn {
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  margin: auto;
  &:hover {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    color: #cd3181;
  }
}

.comment-time,
.reply-time {
  font-size: 12px;
  color: #94a3b8;
}

// 评论区整体样式
.comment-section {
  background-color: #0a0a14;
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

// 发表评论输入框
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

// 样式穿透：评论输入框
:deep(.comment-input .el-textarea__inner) {
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

:deep(.comment-input .el-textarea__inner::placeholder) {
  color: #94a3b8;
}

:deep(.comment-input .el-textarea__inner.is-focus) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

// 发布评论按钮
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 94, 149, 0.4);
    background-color: #c52075 !important;
  }

  &:disabled {
    background-color: #52213a !important;
    box-shadow: none;
    cursor: not-allowed;
    color: #94a3b8 !important;
  }
}

// 回复输入框
.reply-input-box {
  display: flex;
  gap: 12px;
  padding-left: 52px;
  margin-top: 8px;
  align-items: flex-start;
}

:deep(.reply-input .el-input__inner) {
  background-color: transparent !important;
  border: none !important;
  color: #f8fafc;
  padding: 14px;
  padding-right: 150px;
  font-size: 14px;
  caret-color: #cd3181;
  border-radius: 6px !important;
}

:deep(.reply-input .el-input__inner::placeholder) {
  color: #94a3b8;
}

:deep(.reply-input .el-input__wrapper) {
  border: none !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}

// 回复按钮组
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

  &:disabled {
    background-color: #52213a !important;
    box-shadow: none;
    color: #94a3b8 !important;
  }
}

.cancel-reply-btn {
  background-color: transparent !important;
  border: 1px solid rgba(255, 94, 149, 0.3) !important;
  color: #f8fafc !important;
  padding: 2px 12px !important;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cd3181 !important;
    color: #cd3181 !important;
    background-color: rgba(255, 94, 149, 0.05);
  }
}

// 评论列表
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

  &:last-child {
    border-bottom: none;
  }
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

// 更多操作按钮
.more-comment-btn {
  background-color: transparent !important;
  color: #94a3b8 !important;
  border: none !important;
  transition: color 0.2s ease;

  &:hover {
    color: #cd3181 !important;
  }
}

// 评论内容
.comment-content {
  color: #f1f5f9;
  line-height: 1.7;
  padding-left: 52px;
  font-size: 15px;
}

// 评论操作区
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

  &:hover {
    color: #00f0ff;
  }

  &.action-item-like:hover {
    color: #e33745;
  }

  .iconfont {
    font-size: 16px;
  }

  .liked {
    color: #fc3d4a;
  }
}

// 子评论列表
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

  &:hover {
    border-color: rgba(255, 94, 149, 0.3);
  }
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

// 深色下拉菜单样式
:deep(.custom-dark-dropdown) {
  background-color: #000 !important;
  border: 1px solid #333 !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.8) !important;
}

:deep(.custom-dark-dropdown .el-dropdown-item) {
  background-color: transparent !important;
  color: #e5e5e5 !important;
  padding: 0 20px !important;
  height: 36px !important;
  line-height: 36px !important;
}

:deep(.custom-dark-dropdown .el-dropdown-item:hover) {
  background-color: #333 !important;
  color: #ffffff !important;
}

:deep(.custom-dark-dropdown .el-dropdown-item.is-disabled) {
  color: #666 !important;
  cursor: not-allowed;
}

// 响应式适配
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
</style>
