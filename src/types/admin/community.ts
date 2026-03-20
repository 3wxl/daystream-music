export interface getCommentListType {        // 获取评论列表参数
  pageNum:number,
  pageSize:number,
  keyword?:string,
  type?:number
}

export interface xGetCommentListType {        // 获取评论列表时响应的类型
  success:boolean,
  errorMsg?:string,
  data:{
    records:Array<{
      id:number,
      userId:number,
      username:string,
      avatar:string,
      content:string,
      type:number,
      targetId:number,
      createdTime:string
    }>,
    total:number,
    size:number,
    current:number,
    pages:number
  }
  tota?:number,
  errCode?:string
}

export interface commentType {        // 评论列表单项数据type
  id:number,
  userId:number,
  username:string,
  avatar:string,
  content:string,
  type:number,
  targetId:number,
  createdTime:string
}
