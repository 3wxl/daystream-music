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
        <div class="animate-fade-in">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div
              v-for="(label, key) in qualityLabels"
              :key="key"
              class="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer relative"
              @click="triggerQualitySelect(key)"
            >
              <input
                type="file"
                :ref="(el) => (qualityRefs[key] = el)"
                class="hidden"
                accept=".mp3,.wav,.flac"
                @change="(e) => onQualityFileChange(key, e)"
              />
              <div v-if="!audioFiles[key]">
                <i class="fa fa-cloud-upload text-2xl text-gray-500 mb-1"></i>
                <p class="text-xs font-medium text-gray-300">{{ label }}</p>
                <p class="text-[10px] text-gray-500">点击上传</p>
              </div>
              <div v-else>
                <i class="fa fa-check-circle text-2xl text-green-500 mb-1"></i>
                <p class="text-[10px] text-white truncate px-2" :title="audioFiles[key].name">
                  {{ audioFiles[key].name }}
                </p>
                <button
                  @click.stop="audioFiles[key] = null"
                  class="text-[10px] text-red-400 mt-1 underline"
                >
                  移除
                </button>
              </div>
            </div>
          </div>

          <el-form
            ref="musicFormRef"
            :rules="musicUploadRule"
            :model="audioForm"
            label-position="top"
            size="large"
          >
            <el-form-item label="歌曲名" prop="musicName">
              <el-input
                v-model="audioForm.musicName"
                placeholder="给你的作品起个名字"
                class="dark-input"
              />
            </el-form-item>

            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="歌曲封面">
                <div class="flex items-center gap-4">
                  <div
                    class="w-20 h-20 rounded border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-pink-500/50"
                    @click="triggerCoverSelect"
                  >
                    <img
                      v-if="coverPreview"
                      :src="coverPreview"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="fa fa-plus text-gray-500"></i>
                  </div>
                  <input
                    type="file"
                    ref="coverInput"
                    class="hidden"
                    accept="image/*"
                    @change="onCoverFileChange"
                  />
                  <div class="text-xs text-gray-500">建议尺寸 500x500</div>
                </div>
              </el-form-item>

              <el-form-item label="是否 VIP 专属">
                <el-radio-group v-model="audioForm.isVip">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <el-form-item v-if="audioForm.isVip === 1" label="单价（音浪）" prop="price">
                <el-input
                  v-model="audioForm.price"
                  placeholder="输入所需音浪币"
                  class="dark-input"
                />
              </el-form-item>

              <el-form-item label="节奏 (BPM)" prop="bpm">
                <el-input-number
                  v-model="audioForm.bpm"
                  :min="1"
                  :max="300"
                  class="w-full dark-input"
                />
              </el-form-item>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="版权类型" prop="licenseType">
                <el-select
                  v-model="audioForm.licenseType"
                  placeholder="选择版权类型"
                  class="w-full"
                >
                  <el-option label="CC-BY (署名即可免费使用)" value="CC-BY" />
                  <el-option label="CC-BY-NC (署名 + 非商用)" value="CC-BY-NC" />
                  <el-option label="CC-BY-SA (相同方式共享)" value="CC-BY-SA" />
                  <el-option label="CC-BY-ND (禁止演绎)" value="CC-BY-ND" />
                </el-select>
              </el-form-item>

              <el-form-item label="所属专辑 (可选)" prop="albumId">
                <el-select
                  v-model="audioForm.albumId"
                  placeholder="选择所属专辑"
                  class="w-full"
                  clearable
                  :loading="loadingAlbums"
                >
                  <el-option
                    v-for="album in myAlbums"
                    :key="album.idStr || album.id"
                    :label="album.albumName || album.name"
                    :value="album.idStr || album.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="歌词文件 (LRC)">
              <div class="flex items-center gap-4">
                <div
                  class="flex-1 py-3 px-4 rounded-lg bg-white/5 border border-dashed border-gray-700 hover:border-pink-500/50 transition-all cursor-pointer flex items-center justify-between"
                  @click="triggerLyricSelect"
                >
                  <span class="text-sm" :class="lyricFile ? 'text-white' : 'text-gray-500'">
                    {{ lyricFile ? lyricFile.name : '点击上传 .lrc 格式歌词' }}
                  </span>
                  <i v-if="lyricFile" class="fa fa-check-circle text-green-500"></i>
                  <i v-else class="fa fa-upload text-gray-500"></i>
                </div>
                <input
                  type="file"
                  ref="lyricInput"
                  class="hidden"
                  accept=".lrc"
                  @change="onLyricFileChange"
                />
                <button
                  v-if="lyricFile"
                  @click.stop="lyricFile = null"
                  class="ml-2 px-2 py-1 text-[10px] bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  清除
                </button>
              </div>
            </el-form-item>

            <el-form-item label="音乐标签 (最多选择3个)" prop="tags">
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="tag in availableTags"
                  :key="tag.id"
                  @click="toggleTag(tag)"
                  class="px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all"
                  :class="
                    audioForm.tags.includes(tag.id)
                      ? 'bg-pink-600 border-pink-600 text-white'
                      : 'bg-white/5 border-gray-700 text-gray-400 hover:border-pink-500/50'
                  "
                >
                  {{ tag.tagName }}
                </div>
              </div>
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
            确认发布
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getMyAlbums, uploadMusic } from '@/api/music'
import { getAllTags } from '@/api/playlist'
import { useUploadtRules } from '@/utils/rules/upload'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const { musicUploadRule } = useUploadtRules()
const musicFormRef = ref<FormInstance>()
const route = useRoute()
const showUploadDialog = ref(false)

// 音频上传表单
const audioForm = reactive({
  musicName: '',
  isVip: 0,
  price: '',
  bpm: 120,
  licenseType: 'CC-BY',
  albumId: '',
  tags: [] as any[],
})

const qualityLabels: Record<string, string> = {
  standard: '标清音质',
  highDefinition: '高清音质',
  lossless: '无损',
  spatialAudio: '空间音频',
}

const audioFiles = reactive<Record<string, File | null>>({
  standard: null,
  highDefinition: null,
  lossless: null,
  spatialAudio: null,
})

const qualityRefs = reactive<Record<string, any>>({})

const coverInput = ref<HTMLInputElement | null>(null)
const lyricInput = ref<HTMLInputElement | null>(null)
const coverFile = ref<File | null>(null)
const lyricFile = ref<File | null>(null)
const coverPreview = ref('')

onMounted(() => {
  if (route.query.type === 'audio') {
    showUploadDialog.value = true
  }
  fetchTags()
  fetchAlbums()
})

const fetchTags = async () => {
  try {
    const res = await getAllTags()
    if (res.success && res.data) {
      // 提取扁平化的标签列表
      availableTags.value = Object.values(res.data).flat()
    }
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

const fetchAlbums = async () => {
  loadingAlbums.value = true
  try {
    const res = await getMyAlbums(1,40)
    if (res.success && res.data) {
      myAlbums.value = res.data.records
    }
  } catch (error) {
    console.error('获取专辑失败:', error)
  } finally {
    loadingAlbums.value = false
  }
}

const availableTags = ref<any[]>([])
const myAlbums = ref<any[]>([])
const loadingAlbums = ref(false)

const toggleTag = (tag: any) => {
  const index = audioForm.tags.indexOf(tag.id)
  if (index > -1) {
    audioForm.tags.splice(index, 1)
  } else {
    if (audioForm.tags.length >= 3) {
      return ElMessage.warning('最多只能选择 3 个标签')
    }
    audioForm.tags.push(tag.id)
  }
}

const triggerQualitySelect = (key: string) => {
  qualityRefs[key]?.click()
}

const onQualityFileChange = (key: string, e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    audioFiles[key] = files[0]
  }
}

// 移除旧的单文件处理逻辑

const triggerCoverSelect = () => {
  coverInput.value?.click()
}

const onCoverFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    coverFile.value = files[0]
    coverPreview.value = URL.createObjectURL(files[0])
  }
}

const triggerLyricSelect = () => {
  lyricInput.value?.click()
}

const onLyricFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    lyricFile.value = files[0]
  }
}

const handleUpload = async () => {
  // 检查是否至少选择了一个音质
  const selectedQualities = Object.keys(audioFiles).filter(key => audioFiles[key] !== null)
  if (selectedQualities.length === 0) {
    return ElMessage.warning('请至少选择一种音质的音频文件')
  }

  if (!coverFile.value) {
    ElMessage.warning('请选择歌曲封面')
    return
  }
  if (!lyricFile.value) {
    ElMessage.warning('请上传 LRC 歌词文件')
    return
  }

  // 开始元数据校验
  if (!musicFormRef.value) return
  const valid = await musicFormRef.value.validate().catch(() => false)
  if (!valid) {
    return ElMessage.warning('请补全表单必填信息')
  }

  try {
    const formData = new FormData()

    // 构造元数据 musicDTO
    const musicMetadata = {
      musicName: audioForm.musicName,
      albumId: audioForm.albumId || null, // 不强制转 Number，避免大数精度丢失
      bpm: Number(audioForm.bpm),
      licenseType: audioForm.licenseType,
      isVip: Number(audioForm.isVip),
      price: Number(audioForm.price || 0),
      tags: audioForm.tags,
    }

    // 调试输出
    console.log('musicDTO:', JSON.stringify(musicMetadata))

    // 文档中指定musicDTO为json格式
    const musicJsonBlob = new Blob([JSON.stringify(musicMetadata)],
    {type:'application/json'}
  )
    formData.append('musicDTO', musicJsonBlob)

    // 3. 追加所有选中的音质文件
    selectedQualities.forEach((key) => {
      if (audioFiles[key]) {
        formData.append(key, audioFiles[key] as File)
      }
    })

    // 4. 歌词部分
    if (lyricFile.value) {
      formData.append('lyric', lyricFile.value)
    }
 box

    const res = await uploadMusic(formData)
    if (res.success) {
      ElMessage.success('上传成功，进入审核流程')
      showUploadDialog.value = false
      // 重置所有文件和表单
      Object.keys(audioFiles).forEach(key => audioFiles[key] = null)
      coverFile.value = null
      coverPreview.value = ''
      lyricFile.value = null
      Object.assign(audioForm, {
        musicName: '',
        isVip: 0,
        price: '',
        bpm: 120,
        licenseType: 'CC-BY',
        albumId: '',
        tags: [],
      })
    }
  } catch (error) {
    console.error('Upload failed:', error)
    ElMessage.error('上传音频文件音质不符')
  }
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
