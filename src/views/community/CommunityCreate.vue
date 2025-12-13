<template>
  <!-- 发布动态页面 -->
  <div class="bg-gradient-to-b from-gray-900 to-gray-950 w-full min-h-full p-5">
    <div class="w-full flex items-start gap-8">
      <div class="flex-grow-0 shrink-0 basis-[67%] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm p-[15px]">
        <div class="px-4 flex items-center border-b-gray-400/40 border-b-1 pb-1">
          <input v-model="title" ref="titleInput" type="text" class="text-[#e5e7eb] font-bold text-[26px] py-[5px] focus:outline-none w-[90%]" placeholder="请输入标题">
          <p class="text-[#e5e7eb] text-[15px] w-[10%] text-center">{{titleNum}}/100</p>
        </div>
        <div class="h-[700px] mt-2 relative">
          <div class="w-[250px] mx-auto relative top-30" v-show="loadingEl">
            <div class="flex justify-center" v-if="loadingEl">
              <div class="loader">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
              </div>
            </div>
          </div>
          <Editor
          ref="tinyRef"
          api-key="684qkcdrtr33aypozz8tuhzvsq7k4og17ner8tl30gu4away"
          v-model="editorContent"
          :init="editorInit"
          placeholder="请输入内容（支持图片上传）"
          />
        </div>
        <div class="mt-1 text-[14px] text-[rgba(208,209,212,0.6)]">
          封面由插入的图片决定..
        </div>
      </div>
      <div class="flex-grow-0 shrink-0 basis-[28%] bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden shadow-lg backdrop-blur-sm p-[15px]">
        <div class="flex flex-col items-center">
          <div class="w-30 h-30 md:w-30 md:h-30 rounded-full border-4 border-white/20 overflow-hidden shadow-lg">
            <img
              :src="'userInfo.avatar'"
              class="cursor-pointer w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              @click="router.push('/User/PersonalCenter')"
            />
          </div>
          <p class="text-[#e5e7eb] text-[18px] font-[600] mt-2">{{userInfo.username}}</p>
          <p class="text-[#bdbdbd] mt-[2px] text-[12px]">{{userInfo.introduction}}</p>
          <div class="flex mt-6 text-[#e5e7eb] mb-2">
            <span>
              <span class="mr-[2px]">{{userInfo.fansCount}}</span>
              粉丝
            </span>
            <span class="mx-14">
              <span class="mr-[2px]">{{ userInfo.likeCount }}</span>
              点赞
            </span>
            <span>
              <span class="mr-[2px]">{{userInfo.followCount}}</span>
              关注
            </span>
          </div>
          <div class="mt-[10px]">
            <button @click="saveDraft" class="mr-7 BtnPublish relative text-[#e5e7eb] px-[25px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
              <IconFontSymbol name="baocun" size="18px"></IconFontSymbol>
              保存
              <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
            </button>
            <button @click="release" class="BtnPublish relative text-[#e5e7eb] px-[25px] py-[5px] bg-pink-600 rounded-[10px] cursor-pointer hover:bg-pink-500 active:bg-pink-700 active:scale-95 duration-[0.3s]">
              <IconFontSymbol name="dongtai" size="18px"></IconFontSymbol>
              发布
              <div class="BtnPing absolute top-0 left-0 w-full h-full bg-pink-600 -z-1 rounded-[10px] "></div>
            </button>
          </div>
        </div>
        <div class="px-2 pt-2 mt-3 border-t-1 border-t-gray-200/20">
          <p class="text-[#e5e7eb] font-[600] text-[20px] text-center">草稿列表</p>
          <div class="overflow-y-auto mt-2 rounded-[8px] bg-[#121727] w-full max-h-60 flex flex-col gap-2 p-2">
            <div class="w-full h-full flex justify-center items-center flex-col" v-if="drafts.length === 0">
              <IconFontSymbol name="gongzuotai-dongtaishenhe" class="text-[#e5e7eb]" size="60px"></IconFontSymbol>
              <p class="text-[#e5e7eb] text-[16px]">暂无草稿</p>
            </div>
            <div class="w-full px-4 py-1 rounded-[8px] hover:bg-[#0e111c] flex" v-if="drafts.length > 0" v-for="(draft, index) in drafts" :key="index" >
              <div class="w-2 relative">
                <span class="absolute top-[10px] left-0 inline-block w-[4px] h-[4px] rounded-[50%] bg-white"></span>
              </div>
              <div style="width:calc(100% - 16px);">
                <p class="text-[#e5e7eb] text-[18px] max-w-full line-clamp-1 text-ellipsis font-[600]">{{ draft.title }}</p>
                <div class="flex justify-between mt-[2px]">
                  <p class="text-[#e5e7eb] text-[12px]">{{ draft.date }}</p>
                  <span class="text-[#e5e7eb] text-[12px]">
                    {{ draft.wordCount }}字
                  </span>
                </div>
                <div class="flex justify-end mt-1">
                  <span @click="deleteDraft(draft.title)" class=" px-[5px] rounded-[10px] hover:text-red-700 hover:bg-red-200/20 group cursor-pointer">
                    <el-tooltip content="删除草稿" placement="bottom">
                      <IconFontSymbol name="shanchu" class="text-[#e5e7eb] group-hover:text-red-500"></IconFontSymbol>
                    </el-tooltip>
                  </span>
                  <span @click="applyDraft(draft.title)" class="ml-2 px-[5px] rounded-[10px] hover:text-red-700 hover:bg-red-200/20 group cursor-pointer">
                    <el-tooltip content="应用草稿" placement="bottom">
                      <IconFontSymbol name="bianji" class="text-[#e5e7eb] group-hover:text-sky-500"></IconFontSymbol>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Editor from '@tinymce/tinymce-vue';
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import {updateImage,DeleteImage} from '@/api/community/ImageOperate'
  import {ReleaseDynamic} from '@/api/community/Dynamic'   // 发布动态
  import { ElMessage } from 'element-plus'
  import { getUserInfo } from '@/api/personalCenter/index'
  let router = useRouter()
  // 双向绑定
  const editorContent = ref('请输入内容（支持图片上传）')
  let title = ref('')
  let userInfo = ref({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     })
  const tinyRef = ref(null)
  const uploadedImages = reactive([])      // 上传的图片列表
  let usedImages = reactive([])       // 使用的图片列表
  let loadingEl = ref(true)             // loading

  const editorInit = {
    skin: 'oxide-dark',
    height: '100%',
    width: '100%',
    menubar: false,
    statusbar: false,

    toolbar: [
      'undo redo | formatselect | bold italic | fontsize forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    ],
     plugins:
      'advlist autolink lists link image advimage imagetools charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount fontsize',

    paste_as_text: false,
    paste_preprocess: (plugin, args) => {
      let content = args.content
      content = content.replace(/<style[\s\S]*?<\/style>/gi, '')
      content = content.replace(/<xml>[\s\S]*?<\/xml>/gi, '')
      args.content = content
    },

    file_picker_callback: async (callback, value, meta) => {
    if (meta.filetype === 'image') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')
        try {
          const res = await updateImage(formData)
          const data = res
          if (data.success && data.data) {
            uploadedImages.push(data.data)
            callback(data.data, { alt: file.name })
          }
        } catch (err) {
          console.error('图片上传失败：', err)
        }
      }
      input.click()
    }
  },
    images_max_file_size: '5MB',  // 最大文件大小（默认2MB）
    images_upload_credentials: true,  // 上传时携带 Cookie/Token（跨域时需开启）
    content_style: `
      html::-webkit-scrollbar {
        width: 6px; /* 滚动条宽度 */
      }
      html::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3); /* 滚动滑块颜色 */
        border-radius: 3px; /* 滚动滑块圆角 */
      }
      html::-webkit-scrollbar-track {
        background: transparent; /* 隐藏滚动轨道 */
      }
      /* 全局字体和行高 */
      body {
        font-size: 16px;
        line-height: 1.2; /* 行高（提升可读性） */
        color: #e5e7eb; /* 文字颜色 */
        margin: 10px; /* 编辑区内边距 */
      }
      /* 标题样式 */
      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #e5e7eb;
        margin: 20px 0 10px;
      }
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #e5e7eb;
        margin: 18px 0 8px;
      }
      /* 段落样式 */
      p {
        margin: 10px 0;
        font-size: 15px;
        text-break: break-word;
        word-break: break-all;
      }
      /* 列表样式 */
      ul, ol {
        margin: 10px 0 10px 20px;
        padding-left: 10px;
      }
      ul li {
        list-style-type: disc;
        margin: 5px 0;
      }
      /* 链接样式 */
      a {
        color: #e5e7eb;
        text-decoration: underline;
      }
      a:hover {
        color: #e5e7eb;
      }
      /* 表格样式 */
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
      }
      table td, table th {
        border: 1px solid #e5e7eb;
        padding: 8px 12px;
        text-align: left;
      }
      table th {
        background-color: #f9fafb;
        font-weight: 600;
      }
    `,
    init_instance_callback: function () {
      loadingEl.value = true; // 隐藏加载动画
    },
  }
  const getContent = () => {      // 获取编辑器内容
    return editorContent.value
  }
  const getContent2 = () => {     // 获取编辑器内容，并去除html标签
    return editorContent.value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
  function extractImgSrcByReg(html:string) {     // 这里是获取一个hmtl片段里面的图片的src组成的数组
    if (!html || typeof html !== 'string') return [];
    const imgSrcReg = /<img[^>]+src\s*=\s*["']([^"']*)["'][^>]*>/gi;
    const srcList = [];
    let match;
    let count = 0;
    while ((match = imgSrcReg.exec(html)) !== null && count < 5) {
      const src = match[1];
      if (src) {
        srcList.push(src);
        count++;
      }
    }
    return [...new Set(srcList)];
  }
  // onBeforeUnmount(async () => {
  //   usedImages = extractImgSrcByReg(getContent())
  //   const deleteImages = uploadedImages.filter(item => !usedImages.includes(item))
  //   if (deleteImages.length === 0) return
  //   const deletePromises = deleteImages.map(imgUrl => DeleteImage(imgUrl))
  //   try {
  //     const results = await Promise.all(deletePromises)
  //     results.forEach((res, index) => {
  //       if (!res.success) {
  //         console.log('图片删除失败:', deleteImages[index])
  //       } else {
  //         console.log('图片删除成功:', deleteImages[index])
  //       }
  //     })
  //   } catch (error) {
  //     console.log('批量删除图片时发生错误:', error)
  //   }
  // })

  // 发布动态
  async function release(){   // 发布动态的函数
    if(judge()){
      let dy_title = title.value
      let dy_content = getContent()
      let dy_images = extractImgSrcByReg(dy_content)
      let data = {
        title: dy_title,
        content: dy_content,
        images: dy_images,
      }
      let res = await ReleaseDynamic(data)
      if(res.success){
        ElMessage({
          message: '发布成功',
          type: 'success',
        })
        title.value = ''
        editorContent.value = ''
        titleNum.value = 0
        Object.assign(usedImages,[])
        Object.assign(uploadedImages,[])
      }else{
        ElMessage({
          message: '发布失败',
          type: 'error',
        })
      }
    }
  }
  function judge(){
    if(title.value.trim()=== ''){
      ElMessage({
        message: '动态标题不能为空',
        type: 'warning',
      })
      return false
    }else if(getContent2().trim() === ''){
      ElMessage({
        message: '动态内容不能为空',
        type: 'warning',
      })
      return false
    }else{
      return true
    }
  }

  // 文章数据
  let titleNum = ref(0)
  let titleInput = ref(null)
  onMounted(() => {
    titleInput.value.addEventListener('input', function () {
      titleNum.value = this.value.length
      if (titleNum.value > 100) {
        titleNum.value = 100
        this.value = this.value.substring(0, 100);
      }
    })
    getUser()
  })
  async function getUser(){
    let userInfoRes = await getUserInfo()
    console.log(userInfoRes)
    if(userInfoRes.success){
      userInfo.value = userInfoRes.data
    }else{
      console.log('获取用户信息失败')
    }
  }
  // 草稿箱
  let drafts = reactive(JSON.parse(localStorage.getItem('drafts')) ? JSON.parse(localStorage.getItem('drafts')) : [])
  function saveDraft(){
    let content = getContent()
    let date = new Date().toLocaleString()
    let wordCount = getContent2().length + title.value.length
    let isHave = false
    if(title.value.trim() === ''){
      ElMessage({
        message: '保存时动态标题不能为空',
        type: 'warning',
      })
      return
    }else if(content.trim() === ''){
      ElMessage({
        message: '保存时动态内容不能为空',
        type: 'warning',
      })
      return
    }
    for(let i = 0; i < drafts.length; i++){
      if(drafts[i].title == title.value){
        drafts[i].content = content
        drafts[i].date = date
        drafts[i].wordCount = wordCount
        isHave = true
      }
    }
    if(!isHave){
      drafts.push({
        title: title.value,
        content: content,
        date: date,
        wordCount: wordCount
      })
      ElMessage({
        message: '保存本地成功',
        type: 'success',
      })
    }
    localStorage.setItem('drafts', JSON.stringify(drafts));
  }
  function deleteDraft(title){
    for(let i = 0; i < drafts.length; i++){
      if(drafts[i].title == title){
        drafts.splice(i, 1)
        break
      }
    }
    localStorage.setItem('drafts', JSON.stringify(drafts));
  }
  function applyDraft(ApplyTitle){
    for(let i = 0; i < drafts.length; i++){
      if(drafts[i].title == ApplyTitle){
        title.value = drafts[i].title
        editorContent.value = drafts[i].content
        break
      }
    }
  }
</script>

<style scoped lang="scss">
/* 1. 修改编辑区边框和圆角（适配 #101626 背景） */
::v-deep(.tox-tinymce) {
  border: 1px solid #111727 !important; /* 深色模式下的边框色（不刺眼） */
  border-radius: 8px !important; /* 圆角保持 */
  background-color: #111727 !important; /* 强制编辑器背景与页面一致 */
}

/* 2. 修改工具栏样式（深色模式适配） */
::v-deep(.tox-toolbar) {
  background-color: #111727 !important; /* 工具栏背景（比编辑区略浅，分层明显） */
  border-bottom: 1px solid #334155 !important; /* 工具栏底部边框（与编辑区边框呼应） */
}
::v-deep(.tox-editor-header) {
  background-color: #111727 !important; /* 工具栏背景（比编辑区略浅，分层明显） */
}
/* 3. 修改工具栏按钮样式（默认/hover/激活状态 - 深色模式高对比度） */
/* 默认状态 */
::v-deep(.tox-tbtn) {
  color: #cbd5e1 !important; /* 按钮图标默认颜色（浅灰，不刺眼） */
  border-radius: 4px !important; /* 按钮圆角优化 */
  background-color: #111727 !important;
}
/* hover 状态 */
::v-deep(.tox-tbtn:hover) {
  background-color: #334155 !important; /* hover 背景（比工具栏深，突出交互） */
  color: #f1f5f9 !important; /* hover 图标颜色（更亮） */
}
/* 激活状态（如选中加粗/列表等） */
::v-deep(.tox-tbtn--enabled),
::v-deep(.tox-toolbar__button:focus:not(.tox-toolbar__button--disabled)) {
  background-color: #354154 !important; /* 激活背景（更深，明确选中） */
}
::v-deep(.tox-toolbar__group) {
  margin-right: 5px !important;
}

/* 6. 编辑区内容样式（文字/段落适配深色背景） */
::v-deep(.tox-edit-area__iframe) {
  background-color: #111727 !important;
}
::v-deep(.tox-edit-area::after) {
  opacity: 0 !important;
}
::v-deep(.tox-edit-area::before) {
  opacity: 0 !important;
}

/* 7. 下拉菜单样式（如字体选择、颜色选择器 - 深色适配） */
::v-deep(.tox-menu) {
  background-color: #1e293b !important;
  border: 1px solid #334155 !important;
  border-radius: 6px !important;
}
::v-deep(.tox-menu__item) {
  color: #e2e8f0 !important;
}
::v-deep(.tox-menu__item:hover) {
  background-color: #334155 !important;
  color: #ffffff !important;
}

/* 8. 弹窗样式（如图片上传、链接编辑 - 深色适配） */
::v-deep(.tox-dialog) {
  background-color: #1e293b !important;
  border: 1px solid #334155 !important;
  border-radius: 8px !important;
}
::v-deep(.tox-dialog-header) {
  border-bottom: 1px solid #334155 !important;
  color: #e2e8f0 !important;
}
::v-deep(.tox-dialog-body) {
  color: #e2e8f0 !important;
}
::v-deep(.tox-input) {
  background-color: #101626 !important;
  border: 1px solid #334155 !important;
  color: #e2e8f0 !important;
  border-radius: 4px !important;
}
::v-deep(.tox-input:focus) {
  border-color: #60a5fa !important;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3) !important;
}

/* 9. 占位符样式（输入内容提示文字） */
::v-deep(.tox-placeholder) {
  color: #94a3b8 !important; /* 占位符颜色（浅灰，不突出） */
  opacity: 1 !important;
}

  .loader {
  display: flex;
  align-items: center;
}

.bar {
  display: inline-block;
  width: 3px;
  height: 15px;
  background-color: rgba(255, 255, 255, .5);
  border-radius: 10px;
  animation: scale-up4 1s linear infinite;
}

.bar:nth-child(2) {
  height: 28px;
  margin: 0 5px;
  animation-delay: .25s;
}

.bar:nth-child(3) {
  animation-delay: .5s;
}

@keyframes scale-up4 {
  20% {
    background-color: #ffff;
    transform: scaleY(1.5);
  }
  40% {
    transform: scaleY(1);
  }
}
</style>


