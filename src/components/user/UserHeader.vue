<template>
  <div class="user-header relative overflow-hidden rounded-xl group">
    <div class="absolute inset-0 z-0 cursor-pointer" @click="handleBgUpload">
      <img
        :src="userInfo.bgImg || 'https://picsum.photos/1200/300?random=30'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-rose-900/30 to-transparent"
      ></div>

      <div
        class="absolute right-4 top-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
      >
        <i class="iconfont" style="font-size: 1.725rem">&#xe601;</i>
        <span>更换封面</span>
      </div>
    </div>

    <div class="relative z-10 px-6 py-10 md:py-16">
      <div class="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <div class="relative cursor-pointer group/avatar" @click="handleAvatarUpload">
          <div
            class="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white/20 overflow-hidden shadow-lg"
          >
            <img
              :src="
                userInfo.avatar ||
                'http://39.96.214.163:9000/file/70567a01-09d0-443b-9d8a-bab6e5623967.png'
              "
              class="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
            />
          </div>

          <div
            class="absolute inset-0 rounded-full bg-rose-900/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div
              class="w-13 h-13 bg-white/20 backdrop-blur-sm p-2.5 rounded-full flex items-center justify-center"
            >
              <i class="iconfont opacity-70" style="font-size: 25px">&#xe63b;</i>
            </div>
          </div>

          <div class="absolute top-27 left-26 flex items-center gap-1">
            <button
              class="w-7 h-7 rounded-full bg-[#FF2E93] border-4 border-rose-900/50 shadow-md"
            ></button>
            <span
              class="opacity-0 group-hover/avatar:opacity-100 transition-opacity text-white text-sm font-medium bg-black/60 px-2 py-0.5 rounded whitespace-nowrap"
            >
              在线
            </span>
          </div>
        </div>

        <div class="flex-1 text-white">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <h2 class="text-2xl md:text-3xl font-bold">{{ userInfo.name || '未知用户' }}</h2>
            <el-tag
              v-if="userInfo.isVip"
              class="vip-tag bg-[#ff2e93] border-0 text-white px-3 py-0.5"
              style="
                color: #ff2e93;
                background-color: rgb(255 207 230);
                border-color: rgb(255 162 207);
              "
            >
              <i class="iconfont">&#xe640;</i> 会员
            </el-tag>
          </div>

          <p class="text-gray-200 text-sm md:text-base mb-4 max-w-2xl">
            {{ userInfo.signature || '暂无签名' }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <el-button
              v-if="isOthersPage"
              :class="[
                'follow-btn border-0 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF2E93]/20',
                isFollowing
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  : 'bg-[#FFE6EF] hover:bg-[#FFD1DC] text-[#FF2E93]',
              ]"
              size="default"
              @click="handleFollow"
            >
              <i v-if="!isFollowing" class="iconfont mr-1">&#xe626;</i>
              <i v-if="isFollowing" class="iconfont mr-1">&#xe62b;</i>
              <span>{{ isFollowing ? '已关注' : '关注' }}</span>
            </el-button>

            <el-button
              v-else
              size="default"
              @click="showEditDialog = true"
              class="bg-[#FF2E93]/20 hover:bg-[#FF2E93]/30 text-[#FF2E93] border-0 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF2E93]/20"
            >
              <i class="iconfont mr-1">&#xe7e5;</i>
              编辑资料
            </el-button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6 mt-6 md:mt-10">
        <div
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">
            {{ userInfo.followCount || 0 }}
          </div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">关注</div>
        </div>
        <div
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">{{ userInfo.fansCount || 0 }}</div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">粉丝</div>
        </div>
        <div
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">
            {{ userInfo.likedCount || 0 }}
          </div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">获赞</div>
        </div>
        <div
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer hidden md:block"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">{{ userInfo.playCount || 0 }}</div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">播放量</div>
        </div>
        <div
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer hidden md:block"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">
            {{ userInfo.createdCount || 0 }}
          </div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">作品</div>
        </div>
      </div>
    </div>

    <div v-if="showEditDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        @click="showEditDialog = false"
      ></div>

      <div
        class="relative z-50 w-full max-w-2xl bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 max-h-160"
      >
        <div class="relative h-18 w-full">
          <div
            class="bg-[#121212] h-18 w-full px-6 py-4 flex justify-between items-center border-b border-white/10 absolute inset-0"
          >
            <div class="flex items-center gap-3">
              <img src="../../assets/logo.jpg" alt="" class="w-10 h-10 rounded-full" />
              <h2 class="text-xl font-semibold">编辑个人资料</h2>
            </div>
            <button
              class="text-[#8A8A8A] hover:text-white transition-colors"
              @click="showEditDialog = false"
            >
              <i class="iconfont">&#xe69e;</i>
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto overflow-y-auto max-h-[calc(85vh-4.5rem)] scrollbar-custom">
          <form class="space-y-6">
            <div class="space-y-4">
              <div>
                <label for="nickname" class="block text-sm text-[#8A8A8A] mb-1">昵称 *</label>
                <input
                  type="text"
                  id="nickname"
                  class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                  v-model="editForm.name"
                />
              </div>

              <div>
                <label for="signature" class="block text-sm text-[#8A8A8A] mb-1">签名</label>
                <textarea
                  id="signature"
                  rows="3"
                  class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                  v-model="editForm.signature"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm text-[#8A8A8A] mb-1">性别</label>
                <div class="flex gap-6 py-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="male"
                      v-model="editForm.gender"
                    />
                    <span>男</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="female"
                      v-model="editForm.gender"
                    />
                    <span>女</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="secret"
                      v-model="editForm.gender"
                    />
                    <span>保密</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <h3 class="text-lg font-medium mb-4">账户信息</h3>
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="wallet_balance" class="block text-sm text-[#8A8A8A] mb-1"
                      >账户余额 (元)</label
                    >
                    <input
                      type="number"
                      id="wallet_balance"
                      class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                      value="128.50"
                      step="0.01"
                      readonly
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="vip_expire_time" class="block text-sm text-[#8A8A8A] mb-1"
                      >VIP到期时间</label
                    >
                    <input
                      type="datetime-local"
                      id="vip_expire_time"
                      class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                      value="2024-12-31T23:59"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <h3 class="text-lg font-medium mb-4">系统信息</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">注册时间</label>
                  <input
                    type="text"
                    value="2023-05-18 14:30:25"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">最后登录时间</label>
                  <input
                    type="text"
                    value="2023-11-14 09:45:12"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">最后签到时间</label>
                  <input
                    type="text"
                    value="2023-11-13 20:15:33"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">信息更新时间</label>
                  <input
                    type="text"
                    value="2023-11-10 16:22:08"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                class="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                @click="showEditDialog = false"
              >
                取消
              </button>
              <button
                type="button"
                class="px-6 py-2 bg-gradient-to-r from-[#e2036f] to-[#b277bb] rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                @click="handleSaveEdit"
              >
                <span>保存修改</span>
                <i class="fa fa-check"></i>
              </button>
            </div>
          </form>
        </div>

        <div class="h-1 w-full bg-gradient-to-r from-[#FF2E93] via-[#d46ab5] to-[#b481bc]"></div>
      </div>
    </div>

    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#FF2E93]/20 rounded-full blur-3xl"></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D946EF]/20 rounded-full blur-3xl"
      ></div>
    </div>

    <input
      type="file"
      ref="avatarInput"
      class="hidden"
      accept="image/*"
      @change="handleFileUpload('avatar')"
    />
    <input
      type="file"
      ref="bgInput"
      class="hidden"
      accept="image/*"
      @change="handleFileUpload('bg')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      isVip: true,
      playCount: 125000,
      createdCount: 18,
      bgImg: '',
      avatar: '',
      name: '未知用户',
      signature: '',
      gender: 'secret',
    }),
  },
  isOthersPage: {
    type: Boolean,
    default: false,
  },
})

const isFollowing = ref(false)
const showEditDialog = ref(false)
const isMobile = ref(false)
const avatarInput = ref<HTMLInputElement>(null)
const bgInput = ref<HTMLInputElement>(null)

const editForm = ref({
  name: props.userInfo.name,
  signature: props.userInfo.signature,
  gender: props.userInfo.gender,
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  watch(showEditDialog, (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

const handleAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleBgUpload = () => {
  bgInput.value?.click()
}

const handleFileUpload = (type: 'avatar' | 'bg', e?: Event) => {
  const input = type === 'avatar' ? avatarInput.value : bgInput.value
  if (!input?.files?.length) return

  const file = input.files![0]
  const reader = new FileReader()
  reader.onload = (event) => {
    console.log(`上传${type}文件:`, file)
    if (type === 'avatar') {
    } else {
    }
  }
  reader.readAsDataURL(file)

  input.value = ''
}

const handleFollow = () => {
  isFollowing.value = !isFollowing.value
}

const handleSaveEdit = () => {
  console.log('保存编辑内容:', editForm.value)
  showEditDialog.value = false
}
</script>

<style scoped>
.user-header .rounded-full:not(.vip-tag) {
  animation: pulse1 3s infinite;
}
@keyframes pulse1 {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 46, 147, 0.4);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(255, 46, 147, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 46, 147, 0);
  }
}
.edit-dialog {
  --el-dialog-title-color: #333;
  --el-input-border-color: #ffcce0;
  --el-input-focus-border-color: #ff2e93;
}

.stat-item {
  position: relative;
  overflow: hidden;
}

.stat-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff2e93;
  transition: width 0.3s ease;
}

.stat-item:hover::after {
  width: 100%;
}

::v-deep .follow-btn {
  background-color: transparent !important;
  color: inherit !important;
}

::v-deep .follow-btn.bg-\[\#FFE6EF\] {
  background-color: #ffe6ef !important;
  color: #ff2e93 !important;
}

::v-deep .follow-btn.bg-\[\#FFE6EF\]:hover {
  background-color: #ffd1dc !important;
}

::v-deep .follow-btn.bg-gray-100 {
  background-color: #f3f4f6 !important;
  color: #4b5563 !important;
}

::v-deep .follow-btn.bg-gray-100:hover {
  background-color: #e5e7eb !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fixed > div:last-child {
  animation: fadeIn 0.3s ease-out forwards;
}

@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
  .gradient-border {
    position: relative;
    border-radius: 0.75rem;
    z-index: 0;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 0.85rem;
    background: linear-gradient(135deg, #ff2e93, #d946ef);
    z-index: -1;
    animation: rotate 6s linear infinite;
  }
  .text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: linear-gradient(135deg, #ff2e93, #d946ef);
  }
  .input-focus {
    outline: none;
  }

  .input-focus:focus {
    border-color: #ff2e93; /* primary */
    box-shadow: 0 0 0 1px #ff2e93;
  }
  @keyframes rotate {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  .animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
  }
}
.scrollbar-custom::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
  transition: background 0.3s;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.scrollbar-custom::-webkit-scrollbar-thumb:active {
  background: #aaa;
}
</style>
