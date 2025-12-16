export interface getListSubmitData {        // 获取用户列表参数
  pageNum:number,
  pageSize:number,
  key?:string,
  status?:number
}

export interface xGetListSubmitData {        // 响应获取用户列表
  data:{
    current:number,
    pages:number,
    records:Array<{
      avatar:string,
      createdTime:string,
      email:string,
      id:string,
      role:number,
      status:string,
      username:string
    }>,
    size:number,
    total:number
  },
  errCode?:number,
  errMsg?:string,
  success?:boolean,
  total?:string
}
