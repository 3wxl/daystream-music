import request from '@/utils/request'
// 举报API
export function Report(submitData:{targetId:string,targetType:number,reason:number,reportContent:string}) {
  return request(
    '/comment/report',
    'post',
    submitData
  )
}

