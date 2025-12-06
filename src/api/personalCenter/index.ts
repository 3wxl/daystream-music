import request from '@/utils/request'
import type {
  UserInfoVO,
  UpdateUserInfoParams,
  UploadImageResponse,
  PageRespListMusicVO,
} from '@/types/personalCenter/index'

export const getUserInfo = () => {
  return request<UserInfoVO>(
    '/user/home/getUserInfo', // url
    'GET', // method
    undefined, // submitData (GET无请求体)
    {
      showLoading: true, // 显示加载动画
      returnFullResponse: false, // 只返回data部分
    },
  )
}

/**
 * 修改个人信息
 * @param params 修改的用户信息参数
 * @returns 操作结果
 */
/**
 * 修改个人信息
 * @param params 修改的用户信息参数
 * @returns 操作结果
 */
export const updateUserInfo = (params: UpdateUserInfoParams) => {
  return request(
    '/user/home/updateUserInfo', // url
    'POST', // method
    { ...params }, // submitData: 使用对象展开转换为普通对象
    {
      showLoading: true,
      returnFullResponse: false,
    },
  )
}

/**
 * 上传图片（头像/背景图）
 * @param file 图片文件
 * @param type 类型：avatar/bg
 * @returns 图片地址
 */
export const uploadImage = (file: File, type: 'avatar' | 'bg') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  return request<UploadImageResponse>(
    '/user/upload/image', // url
    'POST', // method
    formData, // submitData
    {
      showLoading: true,
      returnFullResponse: false,
      // 覆盖默认headers，适配form-data
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
// export const getMyLikeSongs = (params: { pageNum: number; pageSize: number }) => {
//   console.log('API 调用参数:', params)
//   console.log('参数类型:', typeof params)
//   console.log('JSON 序列化:', JSON.stringify(params))

//   return request<PageRespListMusicVO>(
//     '/user/home/getMyLikeSongs', // 接口URL
//     'GET', // 改为 POST 方法
//     params, // POST 请求体参数
//     {
//       showLoading: true, // 开启加载中动画
//       returnFullResponse: false, // 仅返回data部分
//       // 可以指定 content-type，不过 request 工具应该会默认处理
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     },
//   )
// }

// /**
//  * 点赞/取消点赞歌曲
//  * @param data { songId: 歌曲ID, isLiked: 是否点赞 }
//  * @returns Promise<Data<null>>
//  */
// export const likeSong = (data: { songId: number; isLiked: boolean }) => {
//   return request<null>(
//     '/user/home/likeSong', // 假设的点赞接口，按实际调整
//     'POST', // 点赞接口建议用POST
//     data, // POST请求体参数
//     {
//       showLoading: false, // 点赞操作无需加载动画
//       returnFullResponse: false,
//     },
//   )
// }
