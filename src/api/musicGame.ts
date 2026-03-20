// src/api/musicGame.ts
/**
 * 网易云音乐API封装（前端直连，免费）
 */
interface Song {
  id: number | string
  name: string
  singer: string
  lyric: string[]
  audioUrl: string
  difficulty: 'easy' | 'medium' | 'hard'
}
// 1. 获取歌曲详情（含歌名、歌手）
export const getSongDetail = async (songIds: string[]) => {
  try {
    const res = await fetch(`/music-api/api/song/detail/?ids=[${songIds.join(',')}]`)
    const data = await res.json()
    if (data.songs && data.songs.length) {
      console.log(data)
      return data.songs.map((song: any) => ({
        id: song.id,
        name: song.name,
        singer: song.ar.map((a: any) => a.name).join(','),
        audioUrl: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
        // 随机分配难度（也可根据歌曲热度/流行度自定义）
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      }))
    }
    return []
  } catch (error) {
    console.error('获取歌曲详情失败：', error)
    return []
  }
}

// 2. 获取歌曲歌词（解析纯文本，去掉时间戳）
export const getSongLyric = async (songId: string) => {
  try {
    const res = await fetch(`/music-api/api/song/lyric?id=${songId}&lv=1&kv=1&tv=-1`)
    const data = await res.json()
    console.log(data)
    if (data.lrc && data.lrc.lyric) {
      // 解析歌词：去掉时间戳 + 过滤空行 + 保留完整句子
      const lyricLines = data.lrc.lyric
        .split('\n')
        .map((line: string) => {
          // 去掉 [00:00.00] 格式的时间戳
          const pureLine = line.replace(/\[.*?\]/g, '').trim()
          // 过滤纯空格/空行、只保留长度≥5的有效歌词（避免无意义的语气词）
          return pureLine.length >= 5 ? pureLine : ''
        })
        .filter(Boolean) // 去掉空字符串

      // 只保留前10句（避免歌词过长）
      return lyricLines.slice(0, 10)
    }
    return []
  } catch (error) {
    console.error(`获取歌曲${songId}歌词失败：`, error)
    return []
  }
}

// 3. 获取热门歌曲列表（用于初始化歌曲库）
export const getHotSongs = async (limit = 20): Promise<Song[]> => {
  try {
    const res = await fetch(`/music-api/api/playlist/detail?id=3778678`)
    const data = await res.json()
    console.log(data)
    if (data.result && data.result.tracks) {
      const songIds = data.result.tracks.slice(0, limit).map((track: any) => track.id)
      const songDetails = await getSongDetail(songIds)

      const songsWithLyric = await Promise.all(
        songDetails.map(async (song: any) => {
          const lyric = await getSongLyric(song.id.toString())
          return {
            ...song,
            lyric,
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as
              | 'easy'
              | 'medium'
              | 'hard',
          }
        }),
      )

      return songsWithLyric.filter((song) => song.lyric.length >= 4)
    }
    return []
  } catch (error) {
    console.error('获取热门歌曲失败：', error)
    return []
  }
}
