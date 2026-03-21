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


// 评论举报内容
export interface getReportListType {        // 获取举报评论列表参数
  pageNum:number,
  pageSize:number,
  key?:string,
  status?:number,
  reason?:number
}

export interface xGetReportListType {        // 获取评论列表时响应的类型
  success:boolean,
  errorMsg?:string,
  data:{
    records:Array<{
      id:number,
      reporterId:string,
      reporterName:string,
      reportContent:string,
      targetId:string,
      targetContent:string,
      reason:string,
      createdTime:string,
      status:number
    }>,
    total:number,
    size:number,
    current:number,
    pages:number
  }
  tota?:number,
  errCode?:string
}

export interface reportType {        // 评论列表单项数据type
  id:number,
  reporterId:string,
  reporterName:string,
  reportContent:string,
  targetId:string,
  targetContent:string,
  reason:string,
  createdTime:string,
  status:number
}
