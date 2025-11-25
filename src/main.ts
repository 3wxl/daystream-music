import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import '@/assets/tailwind.css'
import '@/assets/iconfont.css'
import * as echarts from 'echarts';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const app = createApp(App)

app.config.globalProperties.$echarts = echarts;

app.component('QuillEditor', QuillEditor)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')

