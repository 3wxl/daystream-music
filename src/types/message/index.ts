export interface getMessageCountInterface {       // 所有未读消息响应的type
  data:{
    commentCount:number,
    followCount:number,
    likeCount:number,
    privateMessageCount:number
  },
  errCode:any,
  errorMsg:string,
  success:boolean,
  total:number
}

export interface GetLikeMessageListInterface {       // 点赞消息列表响应的type
  data:[GetLikeMessageListDataInterface],
  errCode:any,
  errorMsg:string,
  success:boolean,
  total:number
}
export interface GetLikeMessageListDataInterface{
  id:number,
  fromUserId:number,
  fromUserName:string,
  fromUserAvatar:string,
  type:number,
  content:string,
  targetId:number,
  targetType:number,
  targetName:string,
  targetContent:string,
  isRead:number,
  createTime:string,
  readTime:string
}

export interface GetCommentMessageListInterface{        // 评论消息列表响应的type
  data:[GetCommentMessageListDataInterface],
  errCode:any,
  errorMsg:string,
  success:boolean,
  total:number
}
export interface GetCommentMessageListDataInterface{
  id:number,
  fromUserId:number,
  fromUserName:string,
  fromUserAvatar:string,
  type:number,
  content:string,
  targetId:number,
  targetType:number,
  targetName:string,
  targetContent:string,
  isRead:number,
  createTime:string,
  readTime:string
}

export interface GetFollowerMessageListInterface{        // 粉丝消息列表响应的type
  data:[GetFollowerMessageListDataInterface],
  errCode:any,
  errorMsg:string,
  success:boolean,
  total:number
}
export interface GetFollowerMessageListDataInterface{
  id:number,
  fromUserId:number,
  fromUserName:string,
  fromUserAvatar:string,
  type:number,
  content:string,
  targetId:number,
  targetType:number,
  targetName:string,
  targetContent:string,
  isRead:number,
  createTime:string,
  readTime:string
}
