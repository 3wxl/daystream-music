<template>
  <div class="flex flex-col h-screen bg-gray-950">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between p-4 border-b border-white/10">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold text-white">
          {{ currentMode === 'chat' ? 'AI 咨询' : 'AI 创作歌曲' }}
        </h1>
        <!-- 模式切换按钮 -->
        <div class="flex bg-gray-800 rounded-full p-1">
          <button
            @click="switchMode('chat')"
            class="px-4 py-1 rounded-full text-sm transition-all duration-300"
            :class="
              currentMode === 'chat' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'
            "
          >
            咨询
          </button>
          <button
            @click="switchMode('create')"
            class="px-4 py-1 rounded-full text-sm transition-all duration-300"
            :class="
              currentMode === 'create' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-white'
            "
          >
            创作歌曲
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="handleShowHistory" class="text-gray-400 hover:text-white transition-colors">
          历史记录
        </button>
        <button @click="toggleSettings" class="text-gray-400 hover:text-white transition-colors">
          设置
        </button>
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧聊天区域 -->
      <ChatContainer
        ref="chatContainerRef"
        v-if="messages.length > 0"
        :messages="messages"
        :user-avatar="userAvatar"
        :ai-avatar="aiAvatar"
        :is-loading="isStreaming"
        :show-welcome="showWelcome && messages.length === 0"
      />
      <!-- 右侧推荐主题区域 -->
      <RightSideBar
        :themes="recommendedThemes"
        :is-show="showRightSidebar && currentMode === 'create'"
        @select-theme="selectTheme"
      />
    </div>
    <!-- 输入区域 -->
    <MessageInput
      v-model="inputValue"
      :quick-phrases="currentMode === 'create' ? quickPhrases : []"
      :placeholder="inputPlaceholder"
      :is-loading="isCreatingSong || isStreaming"
      @send="handleSend"
      @use-quick-phrase="handleUseQuickPhrase"
    />
    <!-- 设置菜单 -->
    <SettingsMenu v-if="showSettings" @close="toggleSettings" />
  </div>
</template>

<script setup lang="ts">
import type { Theme, QuickPhrase, Message, UserStatus } from '@/types/lyricAssistant'
import { createNewSession, fetchStream } from '@/api/aiChat'
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
const isStreaming = ref<boolean>(false)
const chatContainerRef = ref<any>(null)
// 添加缺失的变量
const aiAvatar = ref<string>('https://picsum.photos/id/1027/200') // AI 头像
const showRightSidebar = ref<boolean>(true) // 右侧边栏显示状态
const inputValue = ref<string>('') // 输入框内容
const isCreatingSong = ref<boolean>(false) // 创建歌曲加载状态
// 模式切换状态
const currentMode = ref<'chat' | 'create'>('chat') // 默认进入咨询模式

// 添加缺失的函数
const handleShowHistory = () => {
  // 显示历史记录的处理逻辑
  console.log('显示历史记录')
  restartSession()
}

// 模式切换函数
const switchMode = (mode: 'chat' | 'create') => {
  currentMode.value = mode
  // 切换模式时可以选择是否清空消息列表
  // 如果需要清空，可以取消下面的注释
  // messages.value = []
  // showWelcome.value = true
}

// 计算属性：输入框占位符
const inputPlaceholder = computed<string>(() => {
  if (isStreaming.value) return 'AI正在回复中...'
  if (isCreatingSong.value) return 'AI正在创作中...'
  const hour = new Date().getHours()
  if (currentMode.value === 'chat') {
    if (hour < 12) return '早安！有什么音乐问题想咨询？'
    if (hour < 18) return '下午好！请问有什么可以帮到您？'
    return '晚上好！有什么音乐相关的问题吗？'
  } else {
    if (hour < 12) return '早安！想创作什么风格的歌词？'
    if (hour < 18) return '下午好！描述你的创作想法...'
    return '晚上好！上传参考歌词或描述场景...'
  }
})

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

const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.custom-scrollbar')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}
// 创建新会话的函数
const createNewSessionAndFetch = async (): Promise<void> => {
  isLoading.value = true

  try {
    // 1. 创建新会话
    const newSessionId = await createNewSession()
    sessionId.value = newSessionId
    console.log('创建新会话成功，会话ID:', newSessionId)

    // 2. 创建临时AI消息用于流式显示欢迎消息
    const tempMessageId = Date.now()
    let streamingContent = ''
    isStreaming.value = true

    const welcomeMessage: Message = {
      id: tempMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: aiAvatar.value,
      status: '在线',
    }

    messages.value = [welcomeMessage]

    // 根据当前模式发送不同的初始消息
    const initialMessage = currentMode.value === 'chat' ? '你是谁' : '我想创作一首歌曲'

    await fetchStream(
      currentMode.value === 'chat' ? '/ai/chat' : '/ai/music/create',
      {
        memoryId: sessionId.value,
        [currentMode.value === 'chat' ? 'message' : 'request']: initialMessage,
      },
      // 收到数据块时的回调
      (data: string) => {
        console.log('收到欢迎消息数据块:', data)
        streamingContent += data
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          scrollToBottom()
        }
      },
      // 错误回调
      (error: Error) => {
        console.error('获取AI欢迎消息失败:', error)
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          if (currentMode.value === 'chat') {
            messages.value[index].content =
              '你好呀～我是白昼音流音乐平台的专属AI助手，是懂音乐、有温度的问答伙伴哦！✨\n\n无论是想了解音乐知识，还是需要帮助操作平台功能，我都会尽力为你解答～\n\n希望对你有帮助～有疑问随时喊我呀～'
          } else {
            messages.value[index].content =
              '你好呀～我是白昼音流音乐平台的专属AI创作助手！✨\n\n我可以帮你创作各种风格的歌曲和歌词，只需告诉我你的创作想法、风格偏好或参考歌曲，我就会为你生成独特的音乐作品～\n\n准备好开始创作了吗？'
          }
        }
        isStreaming.value = false
      },
      // 完成回调
      () => {
        console.log('欢迎消息加载完成')
        isStreaming.value = false
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }
      },
    )
    showWelcome.value = true
  } catch (error) {
    console.error('创建会话失败:', error)
    const defaultWelcomeMessage: Message = {
      id: 1,
      type: 'ai',
      content:
        currentMode.value === 'chat'
          ? '你好呀～我是白昼音流音乐平台的专属AI助手，是懂音乐、有温度的问答伙伴哦！✨\n\n无论是想了解音乐知识，还是需要帮助操作平台功能，我都会尽力为你解答～\n\n希望对你有帮助～有疑问随时喊我呀～'
          : '你好呀～我是白昼音流音乐平台的专属AI创作助手！✨\n\n我可以帮你创作各种风格的歌曲和歌词，只需告诉我你的创作想法、风格偏好或参考歌曲，我就会为你生成独特的音乐作品～\n\n准备好开始创作了吗？',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: aiAvatar.value,
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

// 发送消息函数 - 使用流式响应
const sendMessage = async (content: string): Promise<void> => {
  if (!content.trim() || isStreaming.value || isCreatingSong.value) return

  // 添加用户消息到列表
  const newMessage: Message = {
    id: Date.now(),
    type: 'user',
    content: content.trim(),
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: userAvatar.value,
  }

  messages.value.push(newMessage)
  const userInput = content.trim()
  showWelcome.value = false

  // 创建临时AI消息用于流式显示
  const tempMessageId = Date.now() + 1
  let streamingContent = ''
  isStreaming.value = true

  const aiTempMessage: Message = {
    id: tempMessageId,
    type: 'ai',
    content: 'AI助手正在全力为您解答中...',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: aiAvatar.value,
    status: '在线',
  }
  messages.value.push(aiTempMessage)

  try {
    // 检查是否有会话ID，如果没有则创建
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    // 使用流式请求
    await fetchStream(
      '/ai/chat',
      {
        memoryId: sessionId.value,
        message: userInput,
      },
      // 收到数据块时的回调
      (data: string) => {
        console.log('收到AI回复数据块:', data)
        streamingContent += data
        // 更新临时消息的内容
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          // 自动滚动到底部
          scrollToBottom()
        }
      },
      // 错误回调
      (error: Error) => {
        console.error('AI咨询请求失败:', error)
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = '很抱歉，我暂时无法为您提供帮助，请稍后再试。'
        }
        isStreaming.value = false
      },
      // 完成回调
      () => {
        console.log('AI回复完成')
        isStreaming.value = false
        // 更新最终时间戳
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }
      },
    )
  } catch (error) {
    console.error('发送消息失败:', error)
    const index = messages.value.findIndex((m) => m.id === tempMessageId)
    if (index !== -1) {
      messages.value[index].content = '很抱歉，我暂时无法为您提供帮助，请稍后再试。'
    }
    isStreaming.value = false
  }
}

// 创作歌曲函数 - 使用流式响应
const createSong = async (request: string): Promise<void> => {
  if (!request.trim() || isCreatingSong.value || isStreaming.value) return

  // 添加用户消息到列表
  const newMessage: Message = {
    id: Date.now(),
    type: 'user',
    content: request,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: userAvatar.value,
  }

  messages.value.push(newMessage)
  showWelcome.value = false

  // 创建临时AI消息用于流式显示
  const tempMessageId = Date.now() + 1
  let streamingContent = ''
  isCreatingSong.value = true

  const aiTempMessage: Message = {
    id: tempMessageId,
    type: 'ai',
    content: 'AI助手正在全力为您解答中...',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: aiAvatar.value,
    status: '在线',
  }
  messages.value.push(aiTempMessage)

  try {
    // 检查是否有会话ID，如果没有则创建
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    // 使用流式请求
    await fetchStream(
      '/ai/music/create',
      {
        memoryId: sessionId.value,
        request: request,
      },
      // 收到数据块时的回调
      (data: string) => {
        console.log('收到数据块：', data)
        streamingContent += data
        // 更新临时消息的内容
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          scrollToBottom()
        }
      },
      // 错误回调
      (error: Error) => {
        console.error('AI创作歌曲请求失败:', error)
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = '很抱歉，歌曲创作失败，请稍后再试。'
        }
        isCreatingSong.value = false
      },
      // 完成回调
      () => {
        console.log('AI创作完成')
        // 解析歌词结构
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          const lines = streamingContent.split('\n').filter((line) => line.trim())
          messages.value[index].lyrics = {
            title: 'AI创作歌曲',
            sections: [
              {
                type: '主歌',
                content: lines[0] || '',
              },
              {
                type: '副歌',
                content: lines[1] || '',
              },
            ],
          }
          messages.value[index].timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }
        isCreatingSong.value = false
      },
    )
  } catch (error) {
    console.error('创作歌曲失败:', error)
    const index = messages.value.findIndex((m) => m.id === tempMessageId)
    if (index !== -1) {
      messages.value[index].content = '很抱歉，歌曲创作失败，请稍后再试。'
    }
    isCreatingSong.value = false
  }
}

// 处理创建歌曲
const handleCreateSong = (request: string = ''): void => {
  // 如果没有提供请求内容，使用默认提示
  const songRequest = request || '请为我创作一首新歌...'
  createSong(songRequest)
}

// 处理发送消息
const handleSend = (): void => {
  if (inputValue.value.trim()) {
    if (currentMode.value === 'chat') {
      sendMessage(inputValue.value)
    } else {
      handleCreateSong(inputValue.value)
    }
    inputValue.value = ''
  }
}

// 处理使用快捷短语
const handleUseQuickPhrase = (phrase: QuickPhrase): void => {
  inputValue.value = phrase.text
  handleSend()
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
