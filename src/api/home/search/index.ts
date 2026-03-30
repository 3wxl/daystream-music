import request from '@/utils/request'

// 获取热搜榜单内容
export const getSearchHotList = () => {
  return request('/user/search/hot','GET')
}

//获取实时搜索建议
export const getSearchSuggestion = (input:string) => {
  return request('/user/search/suggest','GET',{input:input})
}