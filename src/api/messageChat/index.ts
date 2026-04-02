import request from "@/utils/request";

// 获取所有未读消息数量
export function GetMessageCountAPI() {
  return request(
    `/api/notification/unread/count/all`,
    'get'
  )
}

// 获取点赞消息列表
export function GetLikeMessageListAPI(pageNum: number, pageSize: number) {
  return request(
    `/api/notification/list/like?pageNum=${pageNum}&pageSize=${pageSize}`,
    'get'
  )
}

// 获取评论消息列表
export function GetCommentMessageListAPI(pageNum: number, pageSize: number) {
  return request(
    `/api/notification/list/comment?pageNum=${pageNum}&pageSize=${pageSize}`,
    'get'
  )
}

// 获取粉丝消息列表
export function GetFollowerMessageListAPI(pageNum: number, pageSize: number) {
  return request(
    `/api/notification/list/follow?pageNum=${pageNum}&pageSize=${pageSize}`,
    'get'
  )
}
