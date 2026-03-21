<template>
  <div class="flex flex-col h-screen bg-gray-950">
    <!-- 顶部导航栏 -->
    <HeaderBar @show-history="handleShowHistory" @toggle-settings="toggleSettings" />
    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧聊天区域 -->
      <ChatContainer
        v-if="messages.length > 0"
        :messages="messages"
        :user-avatar="userAvatar"
        :ai-avatar="aiAvatar"
      />
      <!-- 右侧推荐主题区域 -->
      <RightSideBar
        :themes="recommendedThemes"
        :is-show="showRightSidebar"
        @select-theme="selectTheme"
      />
    </div>
    <!-- 输入区域 -->
    <MessageInput
      :input-value="inputValue"
      :quick-phrases="quickPhrases"
      :input-placeholder="inputPlaceholder"
      :is-loading="isCreatingSong"
      @send-message="handleSendMessage"
      @create-song="handleCreateSong"
    />
    <!-- 设置菜单 -->
    <SettingsMenu v-if="showSettings" @close="toggleSettings" />
  </div>
</template>

<script setup lang="ts">
import type { Theme, QuickPhrase, Message, UserStatus } from '@/types/lyricAssistant'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { aiChat, aiMusicCreate, createNewSession } from '@/api/aiChat'
import { getUserInfo } from '@/api/personalCenter'

// 会话状态管理
const sessionId = ref<string>('')
const message = ref<string>('')
const panelCollapsed = ref<boolean>(false)
const showSettings = ref<boolean>(false)
const showWelcome = ref<boolean>(true)
const userName = ref<string>('AI 作词助手')
const userStatus = ref<UserStatus>('在线')
const userAvatar = ref<string>('')
const isLoading = ref<boolean>(false)

// 添加缺失的变量
const aiAvatar = ref<string>('https://picsum.photos/id/1027/200') // AI 头像
const showRightSidebar = ref<boolean>(true) // 右侧边栏显示状态
const inputValue = ref<string>('') // 输入框内容
const isCreatingSong = ref<boolean>(false) // 创建歌曲加载状态

// 添加缺失的函数
const handleShowHistory = () => {
  // 显示历史记录的处理逻辑
  console.log('显示历史记录')
}

// 消息列表
const messages = ref<Message[]>([])

// 推荐主题数据
const recommendedThemes = ref<Theme[]>([
  {
    id: 1,
    title: '都市情感故事',
    description: '现代城市的爱恨情仇',
    icon: 'icon-heart',
    iconCode: '&#xe849;',
  },
  {
    id: 2,
    title: '旅行随笔',
    description: '旅途中的感悟与风景',
    icon: 'icon-travel',
    iconCode: '&#xe893;',
  },
  {
    id: 3,
    title: '青春回忆录',
    description: '校园时光的纯真年代',
    icon: 'icon-graduation',
    iconCode: '&#xe6a7;',
  },
  {
    id: 4,
    title: '梦想追逐',
    description: '追梦路上的坚持与成长',
    icon: 'icon-star',
    iconCode: '&#xe6b8;',
  },
])

// 快捷短语数据
const quickPhrases = ref<QuickPhrase[]>([
  { id: 1, text: '创作一首关于青春遗憾的流行歌曲' },
  { id: 2, text: '写一段温暖治愈的民谣歌词' },
  { id: 3, text: '创作电子舞曲风格的爱情歌词' },
  { id: 4, text: '以"大海"为主题创作一段歌词' },
])

// 计算属性：输入框占位符
const inputPlaceholder = computed<string>(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早安！想创作什么风格的歌词？'
  if (hour < 18) return '下午好！描述你的创作想法...'
  return '晚上好！上传参考歌词或描述场景...'
})

// 创建新会话的函数
const createNewSessionAndFetch = async (): Promise<void> => {
  isLoading.value = true

  try {
    // 1. 创建新会话
    const newSessionId = await createNewSession()
    sessionId.value = newSessionId
    console.log('创建新会话成功，会话ID:', newSessionId)

    // 2. 调用AI咨询接口，询问"你是谁"
    const response = await aiChat({
      memoryId: sessionId.value,
      message: '你是谁',
    })

    // 构建AI欢迎消息
    const welcomeMessage: Message = {
      id: 1,
      type: 'ai',
      content: response.join('\n'),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }

    // 添加到消息列表
    messages.value = [welcomeMessage]

    // 3. 更新欢迎消息显示状态
    showWelcome.value = true
  } catch (error) {
    console.error('创建会话或获取AI欢迎消息失败:', error)

    const defaultWelcomeMessage: Message = {
      id: 1,
      type: 'ai',
      content:
        '你好呀～我是白昼音流音乐平台的专属AI助手，是懂音乐、有温度的问答伙伴哦！✨\n\n无论是想了解音乐知识，还是需要帮助操作平台功能，我都会尽力为你解答～\n\n希望对你有帮助～有疑问随时喊我呀～',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }

    messages.value = [defaultWelcomeMessage]
    showWelcome.value = true
  } finally {
    isLoading.value = false
  }
}

// 获取用户信息的函数
const fetchUserInfo = async (): Promise<void> => {
  try {
    const userInfo = await getUserInfo()
    console.log('获取到的用户信息:', userInfo)
    userName.value = userInfo.data?.username || '用户'
    userStatus.value = userInfo.data?.onlineStatus === 1 ? '在线' : '离线'
    userAvatar.value = userInfo.data?.avatar || 'https://picsum.photos/id/64/200'
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 页面初始化
onMounted(() => {
  console.log('AI作词助手界面已加载')

  // 先获取用户信息
  fetchUserInfo()

  // 创建新会话并获取AI欢迎消息
  createNewSessionAndFetch()
})

// 发送消息函数
const sendMessage = async (): Promise<void> => {
  if (!message.value.trim()) return

  // 添加用户消息到列表
  const newMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: message.value,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: userAvatar.value,
  }

  messages.value.push(newMessage)
  const userInput = message.value
  message.value = ''
  showWelcome.value = false

  // 添加AI正在思考的消息
  const thinkingMessage: Message = {
    id: messages.value.length + 1,
    type: 'ai',
    content: '我正在思考，请稍等...',
    timestamp: '刚刚',
    avatar: 'https://picsum.photos/id/237/200',
    status: '在线',
  }
  messages.value.push(thinkingMessage)

  try {
    // 检查是否有会话ID，如果没有则创建
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    // 调用AI咨询接口，传入会话ID
    const response = await aiChat({
      memoryId: sessionId.value,
      message: userInput,
    })

    // 移除思考消息
    messages.value = messages.value.filter((msg) => msg.id !== thinkingMessage.id)

    // 添加AI响应消息
    const aiResponse: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: response.join('\n'),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }
    messages.value.push(aiResponse)
  } catch (error) {
    // 移除思考消息
    messages.value = messages.value.filter((msg) => msg.id !== thinkingMessage.id)

    // 添加错误消息
    const errorMessage: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: '很抱歉，我暂时无法为您提供帮助，请稍后再试。',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }
    messages.value.push(errorMessage)
    console.error('AI咨询请求失败:', error)
  }
}

// 创作歌曲函数
const createSong = async (request: string): Promise<void> => {
  // 添加用户消息到列表
  const newMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: request,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: userAvatar.value,
  }

  messages.value.push(newMessage)
  showWelcome.value = false

  // 添加AI正在创作的消息
  const thinkingMessage: Message = {
    id: messages.value.length + 1,
    type: 'ai',
    content: '我正在为您创作歌曲，请稍等...',
    timestamp: '刚刚',
    avatar: 'https://picsum.photos/id/237/200',
    status: '在线',
  }
  messages.value.push(thinkingMessage)

  try {
    // 检查是否有会话ID，如果没有则创建
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    // 调用AI创作歌曲接口，传入会话ID
    const response = await aiMusicCreate({
      memoryId: sessionId.value,
      request,
    })
    console.log('创作歌曲接口返回:', response)
    // 移除思考消息
    messages.value = messages.value.filter((msg) => msg.id !== thinkingMessage.id)

    // 添加AI创作结果消息
    const aiResponse: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: response.join('\n'),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
      // 这里可以根据实际返回的歌词结构进行解析
      lyrics: {
        title: 'AI创作歌曲',
        sections: [
          {
            type: '主歌',
            content: response[0] || '',
          },
          {
            type: '副歌',
            content: response[1] || '',
          },
        ],
      },
    }
    messages.value.push(aiResponse)
  } catch (error) {
    // 移除思考消息
    messages.value = messages.value.filter((msg) => msg.id !== thinkingMessage.id)

    // 添加错误消息
    const errorMessage: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: '很抱歉，歌曲创作失败，请稍后再试。',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }
    messages.value.push(errorMessage)
    console.error('AI创作歌曲请求失败:', error)
  }
}

// 处理创建歌曲
const handleCreateSong = (request: string = ''): void => {
  // 如果没有提供请求内容，使用默认提示
  const songRequest = request || '请为我创作一首新歌...'
  isCreatingSong.value = true

  // 调用createSong函数并在完成后设置加载状态为false
  createSong(songRequest).finally(() => {
    isCreatingSong.value = false
  })
}

// 重新开始会话的函数
const restartSession = async (): Promise<void> => {
  if (messages.value.length > 1 && !confirm('确定要开始新的会话吗？当前对话历史将被清空。')) {
    return
  }

  // 清空消息列表
  messages.value = []

  // 显示加载状态
  isLoading.value = true

  try {
    // 创建新会话并获取AI欢迎消息
    await createNewSessionAndFetch()
  } catch (error) {
    console.error('重新开始会话失败:', error)
    isLoading.value = false
  }
}

// 继续创作
const continueCreation = (): void => {
  console.log('继续创作')
  createSong('请继续完善刚才的歌词创作...')
}

// 开始快速创作
const startQuickCreation = (): void => {
  console.log('开始快速创作')
  createSong('请为我创作一首新歌...')
}

// 选择主题
const selectTheme = (theme: Theme): void => {
  console.log('选择主题:', theme)
  createSong(`创作一段关于"${theme.title}"的歌词：${theme.description}`)
}

// 处理发送消息
const handleSendMessage = (content: string): void => {
  message.value = content
  sendMessage()
}

// 试听歌曲
const previewSong = (): void => {
  console.log('试听歌曲')
  alert('即将播放歌曲预览...')
}

// 保存歌词
const saveLyrics = (): void => {
  console.log('保存歌词')
  alert('歌词已保存到本地')
}

// 播放歌词片段
const playLyric = (section: string): void => {
  console.log('播放歌词片段:', section)
}

// 显示历史（重新开始会话）
const showHistory = (): void => {
  restartSession()
}

// 切换设置菜单
const toggleSettings = (): void => {
  showSettings.value = !showSettings.value
}

// 关闭设置菜单
const closeSettings = (): void => {
  showSettings.value = false
}

// 切换面板
const togglePanel = (): void => {
  panelCollapsed.value = !panelCollapsed.value
}

// 清空历史（重新开始会话）
const clearHistory = (): void => {
  restartSession()
}

// 附加文件
const attachFile = (): void => {
  console.log('附加文件')
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.txt,.doc,.docx,.mp3,.wav'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      console.log('选择文件:', file.name)
      message.value = `已选择文件: ${file.name}\n`
    }
  }
  input.click()
}

// 使用快捷短语
const useQuickPhrase = (phrase: QuickPhrase): void => {
  message.value = phrase.text
}

// 导出数据
const exportData = (): void => {
  console.log('导出数据')
  const data = {
    sessionId: sessionId.value,
    messages: messages.value,
    themes: recommendedThemes.value,
    quickPhrases: quickPhrases.value,
    exportTime: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-lyric-session-${sessionId.value || 'new'}-${new Date().getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 切换主题
const toggleTheme = (): void => {
  console.log('切换主题')
  alert('主题切换功能开发中...')
}

// 页面卸载时清理
onUnmounted(() => {
  console.log('AI作词助手界面已卸载，会话ID:', sessionId.value)
})
</script>

<style scoped></style>
<route lang="yaml">
meta:
  layout: empty
</route>
