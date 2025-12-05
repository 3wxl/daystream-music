// 消息类型
export interface Message {
  id: number
  type: 'ai' | 'user'
  content: string
  timestamp: string
  avatar: string
  status?: '在线' | '离线'
  lyrics?: {
    title: string
    sections: Array<{
      type: string
      content: string
    }>
  }
  analysis?: {
    title: string
    points: string[]
  }
}

// 主题类型
export interface Theme {
  id: number
  title: string
  description: string
  icon: string
  iconCode: string
}

// 快捷短语类型
export interface QuickPhrase {
  id: number
  text: string
}

// 用户状态类型
export type UserStatus = '在线' | '离线' | '忙碌'

// 小贴士类型
export interface Tip {
  id: number
  title: string
  content: string
  icon: string
  color: string
  points: string[]
}

// 输入框状态
export interface InputState {
  value: string
  placeholder: string
  focused: boolean
}
