import request, { type Data } from '@/utils/request'
import type {
  ReleaseCommentParams,
  GetParentCommentParams,
  GetReplyCommentParams,
  ReplyCommentParams,
  DeleteCommentParams,
  ReportCommentParams,
  ReleaseCommentResponse,
  GetParentCommentResponse,
  GetReplyCommentResponse,
  ReplyCommentResponse,
} from '@/types/comment'
export const releaseComment = (
  params: ReleaseCommentParams,
): Promise<Data<ReleaseCommentResponse>> => {
  return request('/comment/releaseComment', 'POST', { ...params }, { showLoading: true })
}

// 获取父评论列表
export const getParentCommentList = (
  params: GetParentCommentParams,
): Promise<Data<GetParentCommentResponse>> => {
  return request('/comment/getCommentList', 'POST', { ...params }, { showLoading: false })
}

// 获取子评论列表
export const getReplyCommentList = (
  params: GetReplyCommentParams,
): Promise<Data<GetReplyCommentResponse>> => {
  return request('/comment/getReplyCommentList', 'POST', { ...params }, { showLoading: false })
}

// 回复评论
export const replyComment = (params: ReplyCommentParams): Promise<Data<ReplyCommentResponse>> => {
  return request('/comment/replyComment', 'POST', { ...params }, { showLoading: true })
}

// 删除评论
export const deleteComment = (params: DeleteCommentParams): Promise<Data<null>> => {
  return request('/comment/deleteComment', 'DELETE', { ...params }, { showLoading: true })
}

// 举报评论
export const reportComment = (params: ReportCommentParams): Promise<Data<null>> => {
  return request('/comment/report', 'POST', { ...params }, { showLoading: true })
}
