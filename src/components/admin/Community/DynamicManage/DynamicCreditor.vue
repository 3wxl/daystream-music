<template>
  <div class="w-full h-full relative">
    <Editor
      ref="tinyRef"
      api-key="684qkcdrtr33aypozz8tuhzvsq7k4og17ner8tl30gu4away"
      v-model="DynamicData.content"
      :init="editorInit"
      placeholder="请输入内容（支持图片上传）"
    />
    <div class="w-full h-full mx-auto absolute top-0 left-0" v-show="loadingEl">
      <div class="flex justify-center" v-if="loadingEl">
        <div class="loader">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import {updateImage,DeleteImage} from '@/api/community/ImageOperate'
  import {ref} from 'vue'
  import Editor from '@tinymce/tinymce-vue';

  let DynamicData:any = defineModel()
  const tinyRef = ref(null)
  let loadingEl = ref(true)              // loading
  const editorInit = {
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
    init_instance_callback: function () {
      loadingEl.value = false; // 隐藏加载动画
    },
  }
</script>

<style scoped>
  /* 1. 修改编辑区边框和圆角（适配 #101626 背景） */
::v-deep(.tox-tinymce) {
  border: 1px solid white !important; /* 深色模式下的边框色（不刺眼） */
  border-radius: 12px !important; /* 圆角保持 */
  background-color: white !important; /* 强制编辑器背景与页面一致 */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* 2. 修改工具栏样式（深色模式适配） */
::v-deep(.tox-toolbar) {
  background-color: white !important; /* 工具栏背景（比编辑区略浅，分层明显） */
  border-bottom: 1px solid #cfd5dd !important; /* 工具栏底部边框（与编辑区边框呼应） */
}
::v-deep(.tox-editor-header) {
  background-color: white !important; /* 工具栏背景（比编辑区略浅，分层明显） */
}
/* 3. 修改工具栏按钮样式（默认/hover/激活状态 - 深色模式高对比度） */
/* 默认状态 */
::v-deep(.tox-tbtn) {
  color: black !important; /* 按钮图标默认颜色（浅灰，不刺眼） */
  border-radius: 4px !important; /* 按钮圆角优化 */
  background-color: white !important;
}
::v-deep(.tox-icon ){
  color: black !important;
}
/* hover 状态 */
::v-deep(.tox-tbtn:hover) {
  background-color: #c3ddfd !important; /* hover 背景（比工具栏深，突出交互） */
  color: black !important; /* hover 图标颜色（更亮） */
}
/* 激活状态（如选中加粗/列表等） */
::v-deep(.tox-tbtn--enabled),
::v-deep(.tox-toolbar__button:focus:not(.tox-toolbar__button--disabled)) {
  background-color: #c3ddfd !important; /* 激活背景（更深，明确选中） */
}
::v-deep(.tox-toolbar__group) {
  margin-right: 5px !important;
}

/* 6. 编辑区内容样式（文字/段落适配深色背景） */
::v-deep(.tox-edit-area__iframe) {
  background-color: white !important;
}
::v-deep(.tox-edit-area::after) {
  opacity: 0 !important;
}
::v-deep(.tox-edit-area::before) {
  opacity: 0 !important;
}

/* 7. 下拉菜单样式（如字体选择、颜色选择器 - 深色适配） */
::v-deep(.tox-menu) {
  background-color: white !important;
  border: 1px solid #9ea0a3 !important;
  border-radius: 6px !important;
}
::v-deep(.tox-menu__item) {
  color: black !important;
}
::v-deep(.tox-menu__item:hover) {
  background-color: white !important;
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
