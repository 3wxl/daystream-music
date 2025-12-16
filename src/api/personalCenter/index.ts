import request from '@/utils/request'
import type {
  UserInfoVO,
  UpdateUserInfoParams,
  GetMyLikeSongsResponse,
  GetMyLikeSongsParams,
  LikeRecordParams,
  LikeRecordResponse,
  CreatePlaylistReq,
  PlaylistPageResp,
  CollectPlaylistReq,
  CollectPlaylistResp,
  CreatePlaylistResp,
  PlaylistVO,
  CreatePlaylistParams,
  WeeklyDailyListenResp,
  WeeklyTagRatioResp,
  PlaylistDetailResponse,
  PlaylistDetailParams,
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
  // 构建FormData（兼容文件和普通参数）
  const formData = new FormData()

  // 普通参数
  if (params.username) formData.append('username', params.username)
  if (params.gender !== undefined) formData.append('gender', params.gender.toString())
  if (params.introduction) formData.append('introduction', params.introduction)
  if (params.phone) formData.append('phone', params.phone)

  // 文件参数
  if (params.avatarFile) formData.append('avatarFile', params.avatarFile)
  if (params.backgroundImageFile) formData.append('backgroundImageFile', params.backgroundImageFile)

  return request(
    '/user/home/updateUserInfo',
    'POST',
    formData, // 提交FormData
    {
      showLoading: false,
      returnFullResponse: false,
      headers: {
        'Content-Type': 'multipart/form-data', // 必须指定
      },
    },
  )
}

export const getMyLikeSongs = (params: GetMyLikeSongsParams) => {
  return request<GetMyLikeSongsResponse['data']>('/user/home/getMyLikeSongs', 'POST', { ...params })
}

/**
 * 点赞/取消点赞接口
 * @param params 点赞参数
 * @returns 操作结果
 */
export const likeRecord = (params: LikeRecordParams) => {
  return request<LikeRecordResponse>(
    '/userbase/likerecord', // 后端接口地址
    'POST', // 请求方法
    { ...params }, // JSON请求体
    {
      showLoading: false, // 不显示全局加载动画（按钮本地loading）
      returnFullResponse: false, // 只返回data部分
    },
  )
}
export const getCollectPlaylists = async (
  params: CollectPlaylistReq,
): Promise<CollectPlaylistResp> => {
  return request<PlaylistPageResp>(
    '/user/home/getMyCollectSongLists', // 接口路径正确，保留
    'POST', // 关键：改为POST（支持Body参数）
    { ...params }, // Body参数（request.ts会自动放在data里）
    {
      showLoading: true,
      noToken: false,
    },
  )
}
/**
 * 获取创建的歌单（页码分页，按创建时间降序）
 * @param params 分页参数
 */
export const getCreatePlaylists = async (
  params: CreatePlaylistReq,
): Promise<CreatePlaylistResp> => {
  return request<PlaylistPageResp>(
    '/playlist/query-my-playlist-by-time', // url
    'GET', // method
    { ...params }, // submitData（GET请求会自动转为params）
    {
      showLoading: true, // 开启加载动画
      noToken: false, // 需要携带token
    },
  )
}

export const cancelCollectPlaylist = (targetId: string | number) => {
  return request<{
    success: boolean
    errorMsg?: string
    data?: {
      isCollection: boolean
      collectCount: number
      msg: string
    }
  }>(
    '/userbase/collect',
    'post',
    {
      targetId: String(targetId), // 确保是字符串
      targetType: 1, // 1-歌单
    },
    {
      showLoading: false,
    },
  )
}

export const deleteCreatePlaylist = (playListId: string | number) => {
  return request<{
    success: boolean
    errorMsg?: string
    data: null
  }>(
    '/playlist/playList/delete-playList',
    'get',
    { playListId },
    {
      showLoading: false,
    },
  )
}
export const createPlaylistApi = (formData: FormData): Promise<{ data: PlaylistVO }> => {
  return request<PlaylistVO>('/playlist/api/play-list/create-play-list', 'POST', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const getWeeklyDailyListenCount = () => {
  return request<WeeklyDailyListenResp>('/user/home/getDailyListenData', 'GET', undefined, {
    showLoading: false,
    returnFullResponse: false,
  })
}

export const getWeeklyTagRatio = () => {
  return request<WeeklyTagRatioResp>('/user/home/getWeeklyTagRatio', 'GET', undefined, {
    showLoading: false,
    returnFullResponse: false,
  })
}
export const getMyCollectAlbums = (params: { pageNum: number; pageSize?: number }) => {
  return request(
    '/user/home/getMyCollectAlbums', // url
    'POST', // method
    { ...params }, // submitData
    {
      showLoading: true,
      noToken: false,
    },
  )
}
export const collectAlbum = (targetId: string | number, targetType: 1 | 2 = 2) => {
  return request<{
    success: boolean
    errorMsg?: string
    data?: {
      isCollection: boolean // false=已取消收藏，true=已收藏
      collectCount: number // 最新收藏数
      msg: string // 状态提示
    }
    errCode?: string
  }>(
    '/userbase/collect', // 后端收藏/取消收藏接口
    'POST', // 请求方法
    {
      targetId: String(targetId), // 确保转为字符串（后端要求）
      targetType: targetType, // 2=专辑（1=歌单）
    },
    {
      showLoading: false, // 不显示全局loading（按钮本地处理）
      returnFullResponse: false,
    },
  )
}
export const updatePlaylistApi = (
  formData: FormData,
): Promise<{ success: boolean; errorMsg?: string }> => {
  return request<{ success: boolean; errorMsg?: string }>(
    '/playlist/playList/update-playList', // 修改歌单接口地址
    'POST', // 请求方法
    formData, // FormData格式
    {
      headers: {
        'Content-Type': 'multipart/form-data', // 必须指定
      },
      showLoading: true, // 显示加载动画
    },
  )
}
export const getPlaylistDetail = (params: PlaylistDetailParams) => {
  const { playlistId, ...queryParams } = params
  return request<PlaylistDetailResponse['data']>(
    `/playlist/detail/${playlistId}`, // 路径参数：歌单ID
    'GET', // 请求方法
    undefined, // GET无请求体
    {
      showLoading: true,
      returnFullResponse: false,
      params: queryParams, // 查询参数：pageNum/pageSize
    },
  )
}
