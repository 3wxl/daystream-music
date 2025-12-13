<template>
  <div class="upload-landing min-h-screen">
    <div class="relative bg-[#1a0b2e] overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          class="absolute -top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-30 animate-blob"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-[#1a0b2e] to-transparent"
        ></div>

        <i
          class="fa fa-music absolute top-1/4 left-10 text-4xl text-purple-500/20 animate-blob"
          style="animation-delay: 0s"
        ></i>
        <i
          class="fa fa-microphone absolute top-1/3 right-20 text-5xl text-pink-500/20 animate-blob"
          style="animation-delay: 2s"
        ></i>
        <i
          class="fa fa-headphones absolute bottom-1/3 left-1/4 text-6xl text-blue-500/10 animate-blob"
          style="animation-delay: 4s"
        ></i>
        <i
          class="fa fa-play-circle absolute bottom-20 right-1/3 text-4xl text-white/10 animate-blob"
          style="animation-delay: 1s"
        ></i>
      </div>

      <div class="container mx-auto px-4 py-20 relative z-10 text-center">
        <h1
          class="text-5xl md:text-7xl font-black text-white italic tracking-wider mb-2 drop-shadow-lg"
        >
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600 animate-gradient-text"
            >音频投稿计划</span
          >
        </h1>
        <p class="text-xl text-purple-200 mb-12 font-light">每一次跟拍都有价值</p>

        <div class="flex justify-center gap-6">
          <button
            @click="showUploadDialog = true"
            class="px-10 py-4 bg-linear-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:-translate-y-1 animate-shine-pulse"
          >
            立即上传
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#1a0b2e] py-20 text-white relative z-10">
      <div class="container mx-auto px-4">
        <h2
          class="text-4xl font-bold text-center mb-16 tracking-wide relative inline-block left-1/2 -translate-x-1/2"
        >
          <span class="relative z-10">你可以获得什么?</span>
          <div class="absolute -bottom-2 left-0 w-full h-3 bg-purple-600/50 -skew-x-12"></div>
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="magic-card group">
            <div class="magic-content">
              <div
                class="icon-wrapper bg-purple-500/20 group-hover:bg-purple-500/40 text-purple-400"
              >
                <i class="fa fa-rmb text-3xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-3">现金结算</h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                活动入口上传音频获得增长播放量结算，收益实时可见，让创作变现更简单。
              </p>
            </div>
            <div class="magic-border"></div>
          </div>

          <div class="magic-card group">
            <div class="magic-content">
              <div class="icon-wrapper bg-pink-500/20 group-hover:bg-pink-500/40 text-pink-400">
                <i class="fa fa-fire text-3xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-3">资源位曝光</h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                优质音频及创作者，有机会获得首页Banner、活动页专题等S级资源位推荐。
              </p>
            </div>
            <div class="magic-border"></div>
          </div>

          <div class="magic-card group">
            <div class="magic-content">
              <div class="icon-wrapper bg-blue-500/20 group-hover:bg-blue-500/40 text-blue-400">
                <i class="fa fa-bullhorn text-3xl"></i>
              </div>
              <h3 class="text-2xl font-bold mb-3">官推曝光</h3>
              <p class="text-gray-400 text-sm leading-relaxed">
                活动方综合评估，为优质投稿提供官方抖音、微博等账号矩阵推广资源。
              </p>
            </div>
            <div class="magic-border"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#11051f] py-20 text-white">
      <div class="container mx-auto px-4">
        <h2
          class="text-4xl font-bold text-center mb-16 relative inline-block left-1/2 -translate-x-1/2"
        >
          <span class="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
            哪些音频更容易火?
          </span>
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="neon-card group">
            <div class="neon-icon text-purple-400 group-hover:text-purple-300">
              <i class="fa fa-sliders"></i>
            </div>
            <h4 class="font-bold text-lg mb-2">Remix</h4>
            <p class="text-gray-400 text-xs">DJ风格混音节奏感强</p>
            <div class="neon-glow bg-purple-500"></div>
          </div>
          <div class="neon-card group">
            <div class="neon-icon text-pink-400 group-hover:text-pink-300">
              <i class="fa fa-music"></i>
            </div>
            <h4 class="font-bold text-lg mb-2">音乐片段</h4>
            <p class="text-gray-400 text-xs">节奏卡点，乐器纯音乐</p>
            <div class="neon-glow bg-pink-500"></div>
          </div>
          <div class="neon-card group">
            <div class="neon-icon text-blue-400 group-hover:text-blue-300">
              <i class="fa fa-microphone"></i>
            </div>
            <h4 class="font-bold text-lg mb-2">口播</h4>
            <p class="text-gray-400 text-xs">含背景音乐的口播语录</p>
            <div class="neon-glow bg-blue-500"></div>
          </div>
          <div class="neon-card group">
            <div class="neon-icon text-green-400 group-hover:text-green-300">
              <i class="fa fa-headphones"></i>
            </div>
            <h4 class="font-bold text-lg mb-2">歌曲翻唱</h4>
            <p class="text-gray-400 text-xs">清唱形式，带伴奏翻唱</p>
            <div class="neon-glow bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1a0b2e] py-20 text-white text-center pb-32">
      <h2 class="text-3xl font-bold mb-10">活动规则</h2>
      <div
        class="max-w-4xl mx-auto text-left text-gray-300 space-y-4 leading-loose bg-white/5 p-10 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors backdrop-blur-sm"
      >
        <p class="flex items-start gap-3">
          <span class="text-purple-500 font-bold">01.</span>
          <span>作品要求：音频片段时长严格控制在60秒内，适配短视频创作，音质清晰无杂音。</span>
        </p>
        <p class="flex items-start gap-3">
          <span class="text-purple-500 font-bold">02.</span>
          <span>上传流程：点击本页面“立即上传”按钮，或者在创作中心选择上传入口。</span>
        </p>
        <p class="flex items-start gap-3">
          <span class="text-purple-500 font-bold">03.</span>
          <span>审核机制：提交后由专业团队审核，周期约为1-3个工作日，结果将通过站内信通知。</span>
        </p>
        <p class="flex items-start gap-3">
          <span class="text-purple-500 font-bold">04.</span>
          <span>版权说明：发布的内容均为个人原创或已获合法授权，严禁抄袭、搬运他人作品。</span>
        </p>
      </div>
    </div>

    <el-dialog
      v-model="showUploadDialog"
      title="发布作品"
      width="800px"
      custom-class="dark-dialog upload-dialog"
      :close-on-click-modal="false"
      align-center
    >
      <div class="p-4">
        <div class="flex gap-4 mb-6 justify-center">
          <button
            @click="uploadType = 'audio'"
            class="px-6 py-2 rounded-full font-medium transition-all text-sm"
            :class="
              uploadType === 'audio'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            "
          >
            发布音乐
          </button>
          <button
            @click="uploadType = 'mv'"
            class="px-6 py-2 rounded-full font-medium transition-all text-sm"
            :class="
              uploadType === 'mv'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            "
          >
            发布 MV
          </button>
        </div>

        <div v-if="uploadType === 'audio'" class="animate-fade-in">
          <div
            class="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer mb-6"
            @click="triggerFileSelect"
          >
            <div v-if="!hasFile">
              <i class="fa fa-cloud-upload text-4xl text-gray-500 mb-2"></i>
              <p class="text-sm font-medium text-gray-300">点击上传音频</p>
              <p class="text-xs text-gray-500 mt-1">支持 MP3, WAV (Max 50MB)</p>
            </div>
            <div v-else>
              <i class="fa fa-check-circle text-4xl text-green-500 mb-2"></i>
              <p class="text-white">已选择: demo_track.mp3</p>
              <button @click.stop="hasFile = false" class="text-xs text-red-400 mt-2 underline">
                移除
              </button>
            </div>
          </div>

          <el-form label-position="top" size="large">
            <el-form-item label="标题">
              <el-input placeholder="给你的作品起个名字" class="dark-input" />
            </el-form-item>
            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="封面">
                <el-input placeholder="封面图片链接" class="dark-input" />
              </el-form-item>
              <el-form-item label="流派">
                <el-select placeholder="选择风格" class="w-full">
                  <el-option label="流行" value="pop" />
                  <el-option label="说唱" value="rap" />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div v-else class="animate-fade-in">
          <div
            class="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer mb-6"
            @click="triggerMvSelect"
          >
            <div v-if="!hasMvFile">
              <i class="fa fa-video-camera text-4xl text-gray-500 mb-2"></i>
              <p class="text-sm font-medium text-gray-300">点击上传MV</p>
            </div>
            <div v-else>
              <i class="fa fa-check-circle text-4xl text-green-500 mb-2"></i>
              <p class="text-white">已选择: my_mv.mp4</p>
            </div>
          </div>
          <el-form label-position="top" size="large">
            <el-form-item label="MV标题">
              <el-input class="dark-input" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer flex justify-end gap-3">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button
            type="primary"
            class="bg-linear-to-r! from-purple-600! to-pink-600! border-none!"
            @click="handleUpload"
          >
            {{ uploadType === 'audio' ? '确认发布' : '开始上传' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const showUploadDialog = ref(false)
const uploadType = ref<'audio' | 'mv'>('audio')
const hasFile = ref(false)
const hasMvFile = ref(false)

const triggerFileSelect = () => {
  hasFile.value = true
}
const triggerMvSelect = () => {
  hasMvFile.value = true
}

const handleUpload = () => {
  ElMessage.success('模拟：上传成功，进入审核流程')
  showUploadDialog.value = false
  hasFile.value = false
  hasMvFile.value = false
}
</script>

<style scoped>
.magic-card {
  position: relative;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  transition: transform 0.3s ease;
  z-index: 1;
}

.magic-card:hover {
  transform: translateY(-10px);
}

.magic-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  background: #130a21; 
  border-radius: 15px; 
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.magic-border {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(transparent, transparent, transparent, #d946ef);
  animation: rotate 4s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.magic-card:hover .magic-border {
  opacity: 1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.magic-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.neon-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.neon-card:hover {
  background: rgba(255, 255, 255, 0.08); /* Lighter on hover */
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.neon-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.neon-card:hover .neon-icon {
  transform: scale(1.2);
}

.neon-glow {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 60px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.neon-card:hover .neon-glow {
  opacity: 0.4;
}

.upload-landing {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

:deep(.dark-dialog) {
  background: #1a1b1e;
  border: 1px solid #333;
  border-radius: 16px;
}
:deep(.el-dialog__title) {
  color: white;
}
:deep(.el-form-item__label) {
  color: #ccc;
}
:deep(.dark-input .el-input__wrapper) {
  background-color: #0f1014;
  box-shadow: 0 0 0 1px #333 inset;
}
:deep(.dark-input .el-input__inner) {
  color: white;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 10s infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient-text {
  background-size: 200% auto;
  animation: gradient-flow 3s linear infinite;
}

@keyframes shine-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(236, 72, 153, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  }
}
.animate-shine-pulse {
  animation: shine-pulse 2s infinite;
}
</style>


<route lang="yaml">
meta:
  layout: musician
</route>