export const playlistAllTag: Record<string, string> = {
  genreTags: '流派',
  instrumentTags: '乐器',
  moodTags: '心情',
  sceneTags: '场景',
}

export interface FilterGroup {
  key: string
  name: string
  options: FilterOption[]
}

export interface FilterOption {
  label: string
  value: string
}