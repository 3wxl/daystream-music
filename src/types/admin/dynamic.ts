// 社区管理部分需要的类型定义

export interface getDynamicListType {        // 获取动态列表参数
  pageNum:number,
  pageSize:number,
  key?:string,
  role?:number
}

export interface xGetDynamicListType {        // 获取动态列表时的响应类型
  success:boolean,
  errorMsg?:string,
  data:{
    records:Array<{
      id:number,
      authorId:string,
      authorName:string,
      authorAvatar:string,
      role:string,
      title:string,
      content:string,
      postStatus:number
    }>,
    total:number,
    size:number,
    current:number,
    pages:number
  },
  total?:number,
  errCode?:string
}

export interface dynamicType {        // 动态列表单项数据type
  id:number,
  authorId:string,
  authorName:string,
  authorAvatar:string,
  role:string,
  title:string,
  content:string,
  postStatus:number
}

// 动态审核部分
 export interface getDynRevListSubmitData {        // 获取动态列表参数
  pageNum:number,
  pageSize:number,
  key?:string,
  role?:number,
  status?:number
}

export interface xGetDynRevListType {        // 获取动态审核列表时的响应类型
  success:boolean,
  errorMsg?:string,
  data:{
    records:Array<{
      id:number,
      authorId:string,
      authorName:string,
      authorAvatar:string,
      role:string,
      title:string,
      content:string,
      postStatus:number
    }>,
    total:number,
    size:number,
    current:number,
    pages:number
  },
  total?:number,
  errCode?:string
}

export interface dynamicRevType {        // 动态列表审核单项数据type
  id:number,
  authorId:string,
  authorName:string,
  authorAvatar:string,
  role:string,
  title:string,
  content:string,
  postStatus:number
}
