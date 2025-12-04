import { playlistAllTag, type FilterGroup } from "@/types/playlist/AllTag";

export function transformFilterGroups(backendData: any) {
  const filterGroups: FilterGroup[] = []
  for(const [key,list] of Object.entries(backendData)){
    const groupName = playlistAllTag[key]
    if(!groupName) continue
    if(!Array.isArray(list)) continue
    const group: FilterGroup = {
      key:groupName,
      name: groupName,
      options: list.map((item: any) => ({
        label: item.tagName,
        value: item.id,
      }))
    }
    filterGroups.push(group)

  }
  return filterGroups
}