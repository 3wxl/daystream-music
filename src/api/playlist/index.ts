import request from '@/utils/request'

export function getAllTags() {
  return request('/playlist/all-tags', 'get')
}

export function getPlayListDetail(id: string) {
  return request(`/playlist/detail/${id}`, 'get')
}

export function getlistByTags(currentTag: string[], pageNum: string, pageSize: string) {
  return request('/playlist/by-tags', 'post', {
    tags: currentTag,
    pageNum,
    pageSize,
  })
}

// 获取用户歌单
export function getUserPlaylist(userId: string, pageNum: string, pageSize: string) {
  return request('/playlist/query-my-playlist-by-collect', 'get', {
    userId,
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
export function addMusicToPlaylist(data: any) {
  return request('/playlist/batch-add-song-to-playlist', 'post', data,{isParams:true})
}

// 批量将歌曲从歌单中删除
export function deleteMusicsFromPlaylist(data: any) {
  return request('/playlist/batch-remove-song-from-playlist', 'post', data, { isParams: true })
}

// 分页查询指定歌单的歌曲
export function querySongsByPlaylist(playlistId: string, pageNum: number, pageSize: number) {
  return request('/playlist/query-songs-by-playlist', 'get', {
    playlistId,
    pageNum,
    pageSize,
  })
}

// 将歌曲从指定歌单删除
export function deleteMusicFromPlaylist(data: any) {
  return request('/playlist/batch-remove-song-from-playlist', 'post', data, { isParams: true })
}

// 将单曲添加到歌单
export function addSongToPlaylist(data: { playlistId: string | number; songId: string | number }) {
  return request('/playlist/add-song-to-playlist', 'post', data, { isParams: true })
}