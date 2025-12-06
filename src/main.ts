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

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.config.globalProperties.$echarts = echarts

app.component('QuillEditor', QuillEditor)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
