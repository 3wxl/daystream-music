import request from '@/utils/request'

export function getAllTags() {
  return request('/playlist/all-tags', 'get')
}

export function getPlayListDetail(id: string,pageSize: string,pageNum: string) {
  return request(
    `/playlist/detail/${id}`, 
    'get',
    {
      pageSize,
      pageNum,
    }
  )
}

export function getlistByTags(currentTag: string[], pageNum: string, pageSize: string) {
  return request('/playlist/by-tags', 'post', {
    tags: currentTag,
    pageNum,
    pageSize,
  })
}

// 获取用户歌单
export function getUserPlaylist(pageNum: string, pageSize: string) {
  return request('/playlist/query-my-playlist-by-collect', 'get', {
    pageNum,
    pageSize,
  })
}

// 创建歌单
export function createPlaylist(data: any) {
  return request('/playlist/api/play-list/create-play-list', 'post', data)
}

// 删除歌单
export function deletePlaylist(playListId: string) {
  return request('/playlist/playList/delete-playList', 'get', {
    playListId,
  })
}

// 批量将歌曲添加到歌单
export function addMusicToPlaylist(data:any) {
  return request('/playlist/batch-add-song-to-playlist','post',data)
}
