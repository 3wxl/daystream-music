<template>
  <div
    v-if="isVisible"
    class="fixed z-50 w-96 h-[70vh] bg-gray-900 rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
    :style="windowStyle"
  >
    <!-- 小窗头部 -->
    <div
      class="flex items-center justify-between p-4 border-b border-white/10 bg-gray-800/50 cursor-move"
      @mousedown="startDrag"
    >
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 class="text-white font-medium text-sm">AI 作词助手</h3>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="toggleMinimize"
          class="p-1 hover:bg-white/10 rounded transition-colors"
          title="最小化"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        <button
          @click="toggleFullscreen"
          class="p-1 hover:bg-white/10 rounded transition-colors"
          title="全屏"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
            />
          </svg>
        </button>
        <button
          @click="closeWindow"
          class="p-1 hover:bg-white/10 rounded transition-colors"
          title="关闭"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 小窗内容 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧聊天区域 -->
      <ChatContainer
        v-if="messages.length > 0"
        :messages="messages"
        :user-avatar="userAvatar"
        :ai-avatar="aiAvatar"
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
  </div>

  <!-- 最小化状态 -->
  <div
    v-else-if="isMinimized"
    class="fixed z-50 w-48 h-12 bg-gray-800 rounded-lg shadow-lg border border-white/20 flex items-center px-4 cursor-pointer"
    :style="{ left: windowPos.x + 'px', top: windowPos.y + 'px' }"
    @click="toggleMinimize"
  >
    <div class="flex items-center space-x-2 flex-1">
      <div
        class="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <span class="text-white text-xs truncate">AI 作词助手</span>
    </div>
    <button
      @click.stop="closeWindow"
      class="p-1 hover:bg-white/10 rounded transition-colors"
      title="关闭"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>

  <!-- 小窗按钮 -->
  <button
    v-else
    @click="openWindow"
    class="fixed z-50 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
    :style="buttonStyle"
    title="打开 AI 作词助手"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Theme, QuickPhrase, Message, UserStatus } from '@/types/lyricAssistant'
import { aiChat, aiMusicCreate, createNewSession } from '@/api/aiChat'
import { getUserInfo } from '@/api/personalCenter'
import ChatContainer from './chat/ChatContainer.vue'
import MessageInput from './MessageInput.vue'

// 小窗状态
const isVisible = ref(false)
const isMinimized = ref(false)
const isFullscreen = ref(false)
const windowPos = ref({ x: window.innerWidth - 400, y: 100 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// 会话状态管理
const sessionId = ref<string>('')
const message = ref<string>('')
const showSettings = ref<boolean>(false)
const showWelcome = ref<boolean>(true)
const userName = ref<string>('AI 作词助手')
const userStatus = ref<UserStatus>('在线')
const userAvatar = ref<string>('')
const isLoading = ref<boolean>(false)

// 组件状态
const aiAvatar = ref<string>('https://picsum.photos/id/1027/200') // AI 头像
const inputValue = ref<string>('') // 输入框内容
const isCreatingSong = ref<boolean>(false) // 创建歌曲加载状态

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

// 计算属性：窗口样式
const windowStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      left: '0px',
      top: '0px',
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
    }
  }
  return {
    left: windowPos.value.x + 'px',
    top: windowPos.value.y + 'px',
  }
})

// 计算属性：按钮样式
const buttonStyle = computed(() => {
  return {
    right: '20px',
    bottom: '100px',
  }
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
  console.log('AI作词助手小窗已加载')

  // 先获取用户信息
  fetchUserInfo()

  // 监听鼠标事件，用于拖拽
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})

// 页面卸载时清理
onUnmounted(() => {
  console.log('AI作词助手小窗已卸载，会话ID:', sessionId.value)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
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

// 处理发送消息
const handleSendMessage = (content: string): void => {
  message.value = content
  sendMessage()
}

// 打开小窗
const openWindow = () => {
  isVisible.value = true
  isMinimized.value = false
  // 如果没有会话，创建新会话
  if (!sessionId.value) {
    createNewSessionAndFetch()
  }
}

// 关闭小窗
const closeWindow = () => {
  isVisible.value = false
  isMinimized.value = false
  isFullscreen.value = false
}

// 切换最小化
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  isVisible.value = !isMinimized.value
}

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 开始拖拽
const startDrag = (e: MouseEvent) => {
  if (!isFullscreen.value) {
    isDragging.value = true
    dragOffset.value = {
      x: e.clientX - windowPos.value.x,
      y: e.clientY - windowPos.value.y,
    }
  }
}

// 鼠标移动事件
const onMouseMove = (e: MouseEvent) => {
  if (isDragging.value && !isFullscreen.value) {
    let newX = e.clientX - dragOffset.value.x
    let newY = e.clientY - dragOffset.value.y

    const maxX = window.innerWidth - 384 // 小窗宽度
    const maxY = window.innerHeight - 400 // 小窗高度

    newX = Math.max(10, Math.min(newX, maxX))
    newY = Math.max(10, Math.min(newY, maxY))

    windowPos.value = { x: newX, y: newY }
  }
}

// 鼠标释放事件
const onMouseUp = () => {
  isDragging.value = false
}
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Firefox 浏览器 */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
</style>
