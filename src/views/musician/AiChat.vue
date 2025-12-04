<template>
  <div
    class="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 overflow-hidden"
  >
    <HeaderBar
      :user-name="userName"
      :user-status="userStatus"
      @show-history="showHistory"
      @toggle-settings="toggleSettings"
    />
    <main class="flex-1 flex overflow-hidden relative">
      <div class="absolute inset-0 pointer-events-none opacity-5">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        ></div>
      </div>
      <ChatContainer
        :messages="messages"
        :show-welcome="showWelcome"
        @send-message="handleSendMessage"
        @play-lyric="playLyric"
        @continue-creation="continueCreation"
        @preview-song="previewSong"
        @save-lyrics="saveLyrics"
      />
      <RightSideBar
        :themes="recommendedThemes"
        :panel-collapsed="panelCollapsed"
        @toggle-panel="togglePanel"
        @select-theme="selectTheme"
        @start-quick-creation="startQuickCreation"
      />
    </main>
    <MessageInput
      v-model="message"
      :placeholder="inputPlaceholder"
      :quick-phrases="quickPhrases"
      @send="sendMessage"
      @attach-file="attachFile"
      @use-quick-phrase="useQuickPhrase"
    />
    <SettingsMenu
      v-if="showSettings"
      @clear-history="clearHistory"
      @export-data="exportData"
      @toggle-theme="toggleTheme"
      @close="closeSettings"
    />
  </div>
</template>

<script setup lang="ts">
import type { Theme, QuickPhrase, Message, UserStatus } from '@/types/lyricAssistant'
const message = ref<string>('')
const panelCollapsed = ref<boolean>(false)
const showSettings = ref<boolean>(false)
const showWelcome = ref<boolean>(true)
const userName = ref<string>('AI 作词助手')
const userStatus = ref<UserStatus>('在线')
const messages = ref<Message[]>([
  {
    id: 1,
    type: 'ai',
    content:
      '你好！我是AI作词助手，擅长创作各种风格的歌词。你可以告诉我想要的主题、情感、风格，或者上传参考歌词，我会帮你创作出精彩的歌词作品！',
    timestamp: '刚刚',
    avatar: 'https://picsum.photos/id/237/200',
    status: '在线',
  },
  {
    id: 2,
    type: 'user',
    content:
      '请创作一段歌词，内容以"久别重逢的珍视与离别时的极致拉扯"，诠释"相见时难别亦难"的怅然与不舍，主打"暖中带涩、甜里藏痛"的情感递进。',
    timestamp: '今天 14:32',
    avatar: 'https://picsum.photos/id/64/200',
  },
  {
    id: 3,
    type: 'ai',
    content: '这是为您创作的歌词...',
    timestamp: '今天 14:35',
    avatar: 'https://picsum.photos/id/237/200',
    status: '在线',
    lyrics: {
      title: '咖啡凉透之前',
      sections: [
        {
          type: '主歌',
          content: '那杯咖啡还温热着回忆的柔\n久别重逢在你眼底的春秋',
        },
        {
          type: '副歌',
          content: '在咖啡凉透之前拥抱你所有\n任苦涩沉底甜蜜浮游',
        },
      ],
    },
    analysis: {
      title: '创作思路分析',
      points: [
        '主题："久别重逢的珍视"与"离别时拉扯"，需要体现"暖中带涩、甜里藏痛"的情感层次',
        '意象选择：以咖啡为核心隐喻，温热甘甜对应重逢，沉淀苦涩对应离别',
        '韵律设计：由求辙(ou/iu)押韵，营造悠扬而忧郁的氛围',
      ],
    },
  },
])

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
    description: '校园时光的纯真岁月',
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

const quickPhrases = ref<QuickPhrase[]>([
  { id: 1, text: '创作一首关于青春遗憾的流行歌曲' },
  { id: 2, text: '写一段温暖治愈的民谣歌词' },
  { id: 3, text: '创作电子舞曲风格的爱情歌词' },
  { id: 4, text: '以"大海"为主题创作一段歌词' },
])
const inputPlaceholder = computed<string>(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早安！想创作什么风格的歌词？'
  if (hour < 18) return '下午好！描述你的创作想法...'
  return '晚上好！上传参考歌词或描述场景...'
})
const sendMessage = (): void => {
  if (!message.value.trim()) return

  const newMessage: Message = {
    id: messages.value.length + 1,
    type: 'user',
    content: message.value,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://picsum.photos/id/64/200',
  }

  messages.value.push(newMessage)
  message.value = ''
  setTimeout(() => {
    const aiResponse: Message = {
      id: messages.value.length + 1,
      type: 'ai',
      content: '我正在为您创作歌词，请稍等...',
      timestamp: '刚刚',
      avatar: 'https://picsum.photos/id/237/200',
      status: '在线',
    }
    messages.value.push(aiResponse)
  }, 1000)
}

const handleSendMessage = (content: string): void => {
  message.value = content
  sendMessage()
}
const continueCreation = (): void => {
  console.log('继续创作')
  message.value = '请继续完善刚才的歌词创作...'
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

const showHistory = (): void => {
  console.log('显示对话历史')
  alert('对话历史功能开发中...')
}

const toggleSettings = (): void => {
  showSettings.value = !showSettings.value
}

const closeSettings = (): void => {
  showSettings.value = false
}

const togglePanel = (): void => {
  panelCollapsed.value = !panelCollapsed.value
}

const startQuickCreation = (): void => {
  console.log('开始快速创作')
  message.value = '请为我创作一首新歌...'
}

const selectTheme = (theme: Theme): void => {
  console.log('选择主题:', theme)
  message.value = `创作一段关于"${theme.title}"的歌词：${theme.description}`
}

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

const useQuickPhrase = (phrase: QuickPhrase): void => {
  message.value = phrase.text
}

const clearHistory = (): void => {
  if (confirm('确定要清空所有对话记录吗？')) {
    console.log('清空对话历史')
    messages.value = []
    alert('对话历史已清空')
  }
}

const exportData = (): void => {
  console.log('导出数据')
  const data = {
    messages: messages.value,
    themes: recommendedThemes.value,
    quickPhrases: quickPhrases.value,
    exportTime: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-lyric-data-${new Date().getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const toggleTheme = (): void => {
  console.log('切换主题')
  alert('主题切换功能开发中...')
}

onMounted(() => {
  console.log('AI作词助手界面已加载')
})

onUnmounted(() => {
  console.log('AI作词助手界面已卸载')
})
</script>

<style scoped></style>
<route lang="yaml">
meta:
  layout: empty
</route>
