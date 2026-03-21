export interface ReleaseCommentParams {
  targetId: string
  targetType: number
  content: string
}

// 发表评论返回数据类型
export interface ReleaseCommentResponse {
  msg: string
  targetCommentCount: number
  detailComment: {
    id: string | number
    content: string
    userId: number
    username: string
    avatar: string
    createdTime: string
    likeCount: number
    isLike: boolean
    isSelf: boolean
    childCount: number
  }
}

// 获取父评论列表参数
export interface GetParentCommentParams {
  targetId: string
  targetType: number
  lastId?: string | null
  size?: number
}

// 获取父评论列表返回数据类型
export interface GetParentCommentResponse {
  dateList: Array<{
    id: string | number
    content: string
    userId: number
    username: string
    avatar: string
    createdTime: string
    likeCount: number
    isLike: boolean
    isSelf: boolean
    childCount: number
  }>
  hasMore: boolean
  lastId: string
}

// 获取子评论列表参数
export interface GetReplyCommentParams {
  parentId: string
  lastId?: string | null
  size?: number
}

// 获取子评论列表返回数据类型
export interface GetReplyCommentResponse {
  dateList: Array<{
    id: string | number
    content: string
    userId: number
    username: string
    avatar: string
    createdTime: string
    likeCount: number
    isLike: boolean
    isSelf: boolean
    replyUserId: number
    replyUsername: string
  }>
  hasMore: boolean
  lastId: string
}

// 回复评论参数
export interface ReplyCommentParams {
  parentId: string
  content: string
}

// 回复评论返回数据类型
export interface ReplyCommentResponse {
  msg: string
  targetCommentCount: number
  parentCommentReplyCount: number
  detailReply: {
    id: string | number
    content: string
    userId: number
    username: string
    avatar: string
    createdTime: string
    likeCount: number
    isLike: boolean | null
    isSelf: boolean | null
    replyUserId: number
    replyUsername: string
  }
}

// 删除评论参数
export interface DeleteCommentParams {
  commentId: string | number
}

// 举报评论参数
export interface ReportCommentParams {
  targetId: string
  targetType: number
  reason: number
  reportContent: string
}
