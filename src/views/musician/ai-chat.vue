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

      <!-- 右侧历史对话区域 -->
      <RightSideBar
        :chatSessions="chatSessions"
        :is-show="showRightSidebar"
        :has-more="hasMore"
        :is-loading="isLoadingHistory"
        @load-more="handleLoadMore"
        @select-conversation="handleSelectConversation"
        @delete-conversation="handleDeleteConversation"
      />
    </div>

    <!-- 输入区域 -->
    <MessageInput
      v-model="inputValue"
      :quick-phrases="currentMode === 'create' ? quickPhrases : []"
      :placeholder="inputPlaceholder"
      :is-loading="isCreatingSong || isStreaming"
      @send="handleSend"
      @stop="stopGenerate"
      @use-quick-phrase="handleUseQuickPhrase"
    />
  </div>
</template>

<script setup lang="ts">
import type { Theme, QuickPhrase, Message, UserStatus, aiChatSession } from '@/types/lyricAssistant'
import {
  createNewSession,
  fetchStream,
  getSessionList,
  getMessages,
  deleteSession,
} from '@/api/aiChat'
import { getUserInfo } from '@/api/personalCenter'
import { ElMessage, ElMessageBox } from 'element-plus'

// 会话状态管理
const sessionId = ref<string>('')
const message = ref<string>('')
const panelCollapsed = ref<boolean>(false)
const showWelcome = ref<boolean>(true)
const userName = ref<string>('AI 作词助手')
const userStatus = ref<UserStatus>('在线')
const userAvatar = ref<string>('')
const isLoading = ref<boolean>(false)
const isStreaming = ref<boolean>(false)
const chatContainerRef = ref<any>(null)
const aiAvatar = ref<string>('https://picsum.photos/id/1027/200')
const showRightSidebar = ref<boolean>(true)
const inputValue = ref<string>('')
const isCreatingSong = ref<boolean>(false)
const currentMode = ref<'chat' | 'create'>('chat')
const chatSessions = ref<aiChatSession[]>([])

// 🔥 无限滚动相关状态
const isLoadingHistory = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 🔥 中断控制器
const abortController = ref<AbortController | null>(null)

// 🔥 停止生成
const stopGenerate = () => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }

  // 找到最新的AI消息并添加终止标记
  const latestAiMessage = [...messages.value].reverse().find((m) => m.type === 'ai')
  if (latestAiMessage) {
    if (latestAiMessage.content) {
      latestAiMessage.content += '\n\n⚠️ 已终止输出'
    } else if (latestAiMessage.lyrics) {
      if (latestAiMessage.lyrics.tips) {
        latestAiMessage.lyrics.tips += '\n\n⚠️ 已终止输出'
      } else {
        latestAiMessage.lyrics.tips = '⚠️ 已终止输出'
      }
    }
  }

  isStreaming.value = false
  isCreatingSong.value = false
  console.log('✅ 已停止AI生成')
}

// 添加缺失的函数
const handleShowHistory = () => {
  console.log('显示历史记录')
  restartSession()
}

// 模式切换函数
const switchMode = async (mode: 'chat' | 'create') => {
  currentMode.value = mode
  // 🔥 切换模式时重置分页并重新加载会话列表
  currentPage.value = 1
  hasMore.value = true
  chatSessions.value = []
  await getSessionLists()
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
    const newSessionId = await createNewSession()
    sessionId.value = newSessionId
    console.log('创建新会话成功，会话ID:', newSessionId)

    const tempMessageId = Date.now()
    let streamingContent = ''
    isStreaming.value = true

    const welcomeMessage: Message = {
      id: tempMessageId,
      type: 'ai',
      content: '请耐心等待...',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: aiAvatar.value,
      status: '在线',
    }

    messages.value = [welcomeMessage]

    const initialMessage = currentMode.value === 'chat' ? '你是谁' : '我想创作一首歌曲'

    abortController.value = new AbortController()

    await fetchStream(
      currentMode.value === 'chat' ? '/ai/chat' : '/ai/music/create',
      {
        memoryId: sessionId.value,
        [currentMode.value === 'chat' ? 'message' : 'request']: initialMessage,
      },
      (data: string) => {
        streamingContent += data
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          scrollToBottom()
        }
      },
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
      abortController.value.signal,
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

// 获取用户信息
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

// 🔥 获取会话列表（支持分页）
const getSessionLists = async (isLoadMore = false): Promise<void> => {
  let sessionType = ''

  try {
    const response = await getSessionList({
      sessionType: '1',
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    })

    if (response && Array.isArray(response)) {
      const newSessions = response.map((session) => ({
        id: session.id || session.sessionId || '',
        title: session.title || '未命名对话',
        createTime: session.createTime || session.createdAt || new Date().toISOString(),
        updateTime: session.updateTime || session.updatedAt || new Date().toISOString(),
      }))

      if (isLoadMore) {
        chatSessions.value = [...chatSessions.value, ...newSessions]
      } else {
        chatSessions.value = newSessions
      }

      // 判断是否还有更多数据
      hasMore.value = newSessions.length === pageSize.value

      console.log('会话列表加载成功:', {
        currentPage: currentPage.value,
        count: chatSessions.value.length,
        hasMore: hasMore.value,
        isLoadMore: isLoadMore,
      })
    } else {
      if (!isLoadMore) {
        chatSessions.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    if (!isLoadMore) {
      chatSessions.value = []
    }
    ElMessage.error('获取历史对话失败')
  } finally {
    isLoadingHistory.value = false
  }
}

// 🔥 处理加载更多
const handleLoadMore = async () => {
  if (isLoadingHistory.value || !hasMore.value) {
    console.log('跳过加载：', {
      isLoading: isLoadingHistory.value,
      hasMore: hasMore.value,
    })
    return
  }

  console.log('加载更多历史对话...', {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
  })

  isLoadingHistory.value = true
  currentPage.value++
  await getSessionLists(true)
}

// 🔥 处理选择会话
const handleSelectConversation = async (conversation: aiChatSession) => {
  console.log('选择会话:', conversation)

  try {
    isLoading.value = true
    // 调用API获取会话消息记录
    const messagesData = await getMessages({
      memoryId: conversation.id,
      pageNum: 1,
      pageSize: 50,
    })
    console.log('获取会话消息记录成功:', messagesData)
    // 清空当前消息列表
    messages.value = []

    // 添加获取到的消息到消息列表
    if (messagesData && Array.isArray(messagesData)) {
      messages.value = messagesData
        .reverse()
        .slice(1)
        .map((msg, index) => ({
          id: index + 1,
          type: msg.messageType == '1' ? 'user' : 'ai',
          content: msg.content || '',
          timestamp:
            msg.sendTime ||
            new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          avatar: msg.sessionType === '1' ? userAvatar.value : aiAvatar.value,
          status: '在线',
        }))
    }

    // 更新sessionId
    sessionId.value = conversation.id
    showWelcome.value = false
    scrollToBottom()
  } catch (error) {
    console.error('加载会话消息失败:', error)
    ElMessage.error('加载对话失败')
  } finally {
    isLoading.value = false
  }
}

// 🔥 处理删除会话
const handleDeleteConversation = async (conversationId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个对话吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 调用删除会话的API
    const success = await deleteSession(conversationId)
    console.log('删除会话结果:', { conversationId, success })
    if (success) {
      // 从列表中移除
      chatSessions.value = chatSessions.value.filter((s) => s.id !== conversationId)

      // 如果当前正在查看的会话被删除，创建新会话
      if (sessionId.value === conversationId) {
        messages.value = []
        sessionId.value = ''
        showWelcome.value = true
        // 创建新会话
        await createNewSessionAndFetch()
      }

      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除会话失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 发送消息
const sendMessage = async (content: string): Promise<void> => {
  if (!content.trim() || isStreaming.value || isCreatingSong.value) return

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
  scrollToBottom()

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
  scrollToBottom()

  try {
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    abortController.value = new AbortController()

    await fetchStream(
      '/ai/chat',
      {
        memoryId: sessionId.value,
        message: userInput,
      },
      (data: string) => {
        streamingContent += data
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          scrollToBottom()
        }
      },
      (error: Error) => {
        if (error.name === 'AbortError') {
          console.log('✅ AI咨询请求已被用户中止')
          isStreaming.value = false
          return
        }
        console.error('AI咨询请求失败:', error)
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = '很抱歉，我暂时无法为您提供帮助，请稍后再试。'
        }
        isStreaming.value = false
      },
      () => {
        console.log('AI回复完成')
        isStreaming.value = false
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].timestamp = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }
      },
      abortController.value.signal,
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

// 创作歌曲
const createSong = async (request: string): Promise<void> => {
  if (!request.trim() || isCreatingSong.value || isStreaming.value) return

  const newMessage: Message = {
    id: Date.now(),
    type: 'user',
    content: request,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: userAvatar.value,
  }
  messages.value.push(newMessage)
  showWelcome.value = false
  scrollToBottom()

  const tempMessageId = Date.now() + 1
  let streamingContent = ''
  isCreatingSong.value = true

  const aiTempMessage: Message = {
    id: tempMessageId,
    type: 'ai',
    content: '🎵 AI 正在为你创作歌曲，请稍候...',
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: aiAvatar.value,
    status: '在线',
  }
  messages.value.push(aiTempMessage)
  scrollToBottom()

  try {
    if (!sessionId.value) {
      sessionId.value = await createNewSession()
    }

    abortController.value = new AbortController()

    await fetchStream(
      '/ai/music/create',
      {
        memoryId: sessionId.value,
        message: request,
      },
      (data: string) => {
        streamingContent += data
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index !== -1) {
          messages.value[index].content = streamingContent
          scrollToBottom()
        }
      },
      (error: Error) => {
        if (error.name === 'AbortError') {
          console.log('✅ 创作请求已被用户中止')
          isCreatingSong.value = false
          return
        }
        console.error('创作失败', error)
        const idx = messages.value.findIndex((m) => m.id === tempMessageId)
        if (idx !== -1) {
          messages.value[idx].content = '创作失败，请重试'
        }
        isCreatingSong.value = false
      },
      () => {
        console.log('✅ 创作完成，开始解析')
        const index = messages.value.findIndex((m) => m.id === tempMessageId)
        if (index === -1) {
          isCreatingSong.value = false
          return
        }

        const parsed = parseFinalSong(streamingContent)

        const isQuestionMessage =
          parsed.sections.length === 0 &&
          (parsed.title === '未命名歌曲' ||
            streamingContent.includes('？') ||
            streamingContent.includes('确认') ||
            streamingContent.includes('需要先'))

        if (isQuestionMessage) {
          messages.value[index] = {
            ...messages.value[index],
            content: streamingContent,
            lyrics: undefined,
            timestamp: new Date().toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
        } else {
          messages.value[index] = {
            ...messages.value[index],
            content: '',
            lyrics: parsed,
            timestamp: new Date().toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
        }

        isCreatingSong.value = false
        scrollToBottom()
      },
      abortController.value.signal,
    )
  } catch (error) {
    console.error('创作异常', error)
    const idx = messages.value.findIndex((m) => m.id === tempMessageId)
    if (idx !== -1) messages.value[idx].content = '创作失败'
    isCreatingSong.value = false
  }
}

const parseFinalSong = (text: string) => {
  let title = '未命名歌曲'
  let style = '抒情流行'
  let content = text
  let idea = ''

  const ideaPos = content.lastIndexOf('创作思路：')
  if (ideaPos !== -1) {
    idea = content.slice(ideaPos + 5).trim()
    content = content.slice(0, ideaPos).trim()
  }

  const styleMatch = content.match(/曲风[：:](.*?)(?=主歌|$)/)
  if (styleMatch) {
    style = styleMatch[1].trim()
    content = content.replace(styleMatch[0], '').trim()
  }

  const styleIndex = content.indexOf('曲风：')
  if (styleIndex > 0) {
    title = content.slice(0, styleIndex).trim()
    content = content.slice(styleIndex).trim()
  } else {
    const geIndex = content.indexOf('主歌：')
    if (geIndex > 0) {
      title = content.slice(0, geIndex).trim()
    }
  }

  const sections = []
  const regex = /(主歌|副歌|桥段)[：:]([\s\S]*?)(?=主歌|副歌|桥段|$)/g

  let match
  while ((match = regex.exec(content)) !== null) {
    const type = match[1].trim()
    let text = match[2].trim()
    text = text.replace(/\\n/g, '</br>')
    sections.push({ type, content: text })
  }

  return {
    title: title || '未命名歌曲',
    style: style || '抒情流行',
    sections,
    tips: idea,
  }
}

const handleCreateSong = (request: string = ''): void => {
  const songRequest = request || '请为我创作一首新歌...'
  console.log('创作歌曲请求:', songRequest)
  createSong(songRequest)
}

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

const handleUseQuickPhrase = (phrase: QuickPhrase): void => {
  inputValue.value = phrase.text
  handleSend()
}

const restartSession = async (): Promise<void> => {
  if (messages.value.length > 1 && !confirm('确定要开始新的会话吗？当前对话历史将被清空。')) {
    return
  }

  messages.value = []
  isLoading.value = true

  try {
    await createNewSessionAndFetch()
  } catch (error) {
    console.error('重新开始会话失败:', error)
    isLoading.value = false
  }
}

const continueCreation = (): void => {
  console.log('继续创作')
  createSong('请继续完善刚才的歌词创作...')
}

const startQuickCreation = (): void => {
  console.log('开始快速创作')
  createSong('请为我创作一首新歌...')
}

const selectTheme = (theme: Theme): void => {
  console.log('选择主题:', theme)
  createSong(`创作一段关于"${theme.title}"的歌词：${theme.description}`)
}

const previewSong = (): void => {
  console.log('试听歌曲')
  alert('即将播放歌曲预览...')
}

const saveLyrics = (): void => {
  console.log('保存歌词')
  alert('歌词已保存到本地')
}

const playLyric = (section: string): void => {
  console.log('播放歌词片段:', section)
}

const togglePanel = (): void => {
  panelCollapsed.value = !panelCollapsed.value
}

const clearHistory = (): void => {
  restartSession()
}

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

const toggleTheme = (): void => {
  console.log('切换主题')
  alert('主题切换功能开发中...')
}

// 生命周期
onMounted(() => {
  fetchUserInfo()
  createNewSessionAndFetch()
  getSessionLists()
})

onUnmounted(() => {
  abortController.value?.abort()
  console.log('AI作词助手界面已卸载，会话ID:', sessionId.value)
})
</script>

<style scoped></style>

<route lang="yaml">
meta:
  layout: empty
</route>
