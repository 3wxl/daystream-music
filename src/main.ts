import '@/assets/iconfont.css'
import '@/assets/tailwind.css'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import * as echarts from 'echarts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './router/permission'
import { useFlashSaleReminderStore } from './stores/flashSaleReminder'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.config.globalProperties.$echarts = echarts

app.component('QuillEditor', QuillEditor)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 全局初始化提醒服务（关键修复）
const reminderStore = useFlashSaleReminderStore()
reminderStore.initReminderService() // 调用新增的初始化方法

// 绑定应用卸载事件：仅在页面关闭/刷新时停止轮询
window.addEventListener('beforeunload', () => {
  reminderStore.destroyReminderService()
})

app.mount('#app')
