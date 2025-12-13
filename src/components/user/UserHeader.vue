<template>
  <div class="user-header relative overflow-hidden rounded-xl group">
    <!-- 背景图区域 -->
    <div class="absolute inset-0 z-0 cursor-pointer" style="pointer-events: none">
      <img
        :src="bgPreview || userInfo.backgroundImage || 'https://picsum.photos/1200/300?random=30'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-rose-900/30 to-transparent"
      ></div>
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 px-6 py-10 md:py-16">
      <!-- 更换封面按钮 -->
      <div
        class="absolute right-4 top-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer hover:bg-black/70 z-30"
        @click="handleBgUpload"
      >
        <i class="iconfont" style="font-size: 1.725rem">&#xe601;</i>
        <span>更换封面</span>
      </div>

      <div class="flex flex-col md:flex-row gap-6 items-start md:items-end">
        <!-- 头像区域 -->
        <div class="relative cursor-pointer group/avatar" @click="handleAvatarUpload">
          <div
            class="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-lg"
            :class="[
              userInfo.onlineStatus ? 'online-avatar-container' : 'offline-avatar-container',
            ]"
          >
            <img
              :src="
                userInfo.avatar ||
                'http://39.96.214.163:9000/file/70567a01-09d0-443b-9d8a-bab6e5623967.png'
              "
              class="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              :class="[!userInfo.onlineStatus ? 'grayscale-30 opacity-90' : '']"
            />
          </div>

          <!-- 头像悬停遮罩 -->
          <div
            class="absolute inset-0 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
            :class="[userInfo.onlineStatus ? 'bg-[#FF2E93]/40' : 'bg-gray-500/40']"
          >
            <div
              class="w-13 h-13 backdrop-blur-sm p-2.5 rounded-full flex items-center justify-center"
              :class="[userInfo.onlineStatus ? 'bg-white/20' : 'bg-gray-300/20']"
            >
              <i
                class="iconfont transition-opacity"
                style="font-size: 25px"
                :class="[userInfo.onlineStatus ? 'opacity-70' : 'opacity-50']"
                >&#xe63b;</i
              >
            </div>
          </div>

          <!-- 在线状态指示器 -->
          <div class="absolute top-27 left-26 flex items-center gap-1">
            <div
              class="w-7 h-7 rounded-full border-4 shadow-md"
              :class="[
                userInfo.onlineStatus
                  ? ['bg-[#FF2E93]', 'border-rose-900/50', 'animate-pulse']
                  : ['bg-gray-400', 'border-gray-600/50', 'pulse-offline'],
              ]"
            ></div>
            <span
              class="opacity-0 group-hover/avatar:opacity-100 transition-opacity text-sm font-medium px-2 py-0.5 rounded whitespace-nowrap"
              :class="[
                userInfo.onlineStatus
                  ? 'text-white bg-[#FF2E93]/70'
                  : 'text-gray-300 bg-gray-700/70',
              ]"
            >
              {{ userInfo.onlineStatus ? '在线' : '离线' }}
            </span>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="flex-1 text-white">
          <div class="flex flex-wrap items-center gap-3 mb-2">
            <h2 class="text-2xl md:text-3xl font-bold">
              {{ userInfo.username || '未知用户' }}
            </h2>
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
            {{ userInfo.introduction || '暂无签名' }}
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
              @click="openEditDialog"
              class="bg-[#FF2E93]/20 hover:bg-[#FF2E93]/30 text-[#FF2E93] border-0 transition-all duration-300 hover:shadow-lg hover:shadow-[#FF2E93]/20"
            >
              <i class="iconfont mr-1">&#xe7e5;</i>
              编辑资料
            </el-button>
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6 mt-6 md:mt-10">
        <router-link to="/User/FollowList">
          <div
            class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
          >
            <div class="text-2xl md:text-3xl font-bold text-white">
              {{ userInfo.followCount || 0 }}
            </div>
            <div class="text-gray-300 text-xs md:text-sm mt-1">关注</div>
          </div>
        </router-link>
        <router-link to="/User/FollowerList">
          <div
            class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
          >
            <div class="text-2xl md:text-3xl font-bold text-white">
              {{ userInfo.fansCount || 0 }}
            </div>
            <div class="text-gray-300 text-xs md:text-sm mt-1">粉丝</div>
          </div>
        </router-link>
        <div
          v-if="userInfo.userRole === '音乐人'"
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">
            {{ userInfo.likeCount || 0 }}
          </div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">获赞</div>
        </div>
        <div
          v-if="userInfo.userRole === '音乐人'"
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer hidden md:block"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">{{ userInfo.playCount || 0 }}</div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">播放量</div>
        </div>
        <div
          v-if="userInfo.userRole === '音乐人'"
          class="stat-item text-center p-2 hover:scale-105 transition-all duration-300 hover:text-[#FFD1DC] cursor-pointer hidden md:block"
        >
          <div class="text-2xl md:text-3xl font-bold text-white">
            {{ userInfo.createdCount || 0 }}
          </div>
          <div class="text-gray-300 text-xs md:text-sm mt-1">作品</div>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <div v-if="showEditDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" @click="closeEditDialog"></div>
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
              @click="closeEditDialog"
            >
              <i class="iconfont">&#xe69e;</i>
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto overflow-y-auto max-h-[calc(85vh-4.5rem)] scrollbar-custom">
          <!-- 核心修改：添加 el-form 容器，绑定规则和 ref -->
          <el-form
            ref="editFormRef"
            :model="editForm"
            :rules="userInfoRules"
            label-width="80px"
            class="space-y-6"
          >
            <div class="space-y-4">
              <el-form-item label="昵称 " prop="name" style="margin-bottom: 25px">
                <input
                  type="text"
                  id="nickname"
                  class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                  v-model="editForm.name"
                />
              </el-form-item>
              <el-form-item label="签名" prop="signature" style="margin-bottom: 25px">
                <textarea
                  id="signature"
                  rows="3"
                  class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                  v-model="editForm.signature"
                  placeholder="选填，最多30个字"
                ></textarea>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone" style="margin-bottom: 25px">
                <input
                  type="text"
                  id="phone"
                  class="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FF2E93] transition-all"
                  v-model="editForm.phone"
                  placeholder="选填，11位有效手机号"
                />
              </el-form-item>
              <div>
                <label class="block text-sm text-[#8A8A8A] mb-1">性别</label>
                <div class="flex gap-6 py-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="男"
                      v-model="editForm.gender"
                    />
                    <span>男</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="女"
                      v-model="editForm.gender"
                    />
                    <span>女</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      class="accent-[#FF2E93]"
                      value="未知"
                      v-model="editForm.gender"
                    />
                    <span>未知</span>
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
                      >音浪数量</label
                    >
                    <input
                      type="number"
                      id="wallet_balance"
                      class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                      :value="editForm.walletBalance"
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
                      :value="editForm.vipExpireTime"
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
                    :value="editForm.createdTime"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">最后登录时间</label>
                  <input
                    type="text"
                    :value="editForm.lastLoginTime"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">最后签到时间</label>
                  <input
                    type="text"
                    :value="editForm.lastCheckinTime || '暂未签到'"
                    class="w-full bg-[#121212]/50 border border-white/5 rounded-lg px-4 py-2 text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#FF2E93]/50 transition-all"
                    readonly
                  />
                </div>
                <div>
                  <label class="block text-sm text-[#8A8A8A] mb-1">信息更新时间</label>
                  <input
                    type="text"
                    :value="editForm.updatedTime"
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
                @click="closeEditDialog"
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
          </el-form>
        </div>
        <div class="h-1 w-full bg-gradient-to-r from-[#FF2E93] via-[#d46ab5] to-[#b481bc]"></div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#FF2E93]/20 rounded-full blur-3xl"></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#D946EF]/20 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 隐藏的文件上传输入框 -->
    <input
      type="file"
      ref="avatarInput"
      style="position: absolute; top: -9999px; left: -9999px; opacity: 0"
      accept="image/jpeg,image/png"
      @change="handleFileUpload('avatar', $event)"
    />
    <input
      type="file"
      ref="bgInput"
      style="position: absolute; top: -9999px; left: -9999px; opacity: 0"
      accept="image/jpeg,image/png"
      @change="handleFileUpload('bg', $event)"
    />
  </div>
</template>

<script setup lang="ts">
// 1. 导入必要依赖
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import type { UserInfoVO, EditForm } from '@/types/personalCenter/index'
import { useUserInfoRules } from '@/utils/rules/updateInfo'

// 2. 定义Props
const props = defineProps<{
  userInfo: UserInfoVO
  isOthersPage: boolean
}>()

// 3. 定义Emits
const emit = defineEmits<{
  'update-user-info': [editForm: EditForm]
  'upload-avatar': [file: File]
  'upload-bg': [file: File]
}>()

// 4. 响应式数据
const isFollowing = ref(false)
const showEditDialog = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const bgInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const bgPreview = ref<string | null>(null)

// 5. 表单相关
const editFormRef = ref<InstanceType<typeof ElForm> | null>(null)
// 初始化表单（仅做声明，实际值在打开弹窗时赋值）
const editForm = ref<EditForm>({} as EditForm)
// 缓存原始数据（关键：用于关闭弹窗时重置）
let originFormData: EditForm = {} as EditForm

// 6. 获取表单校验规则
const { userInfoRules } = useUserInfoRules(editForm.value)

// 7. 打开弹窗方法（关键：缓存原始数据 + 初始化表单）
const openEditDialog = () => {
  // 缓存当前最新的用户信息作为原始数据
  originFormData = {
    name: props.userInfo.username || '未知用户',
    signature: props.userInfo.introduction || '',
    gender: props.userInfo.gender || '未知',
    phone: props.userInfo.phone || '',
    walletBalance: props.userInfo.walletBalance || 0,
    lastCheckinTime: props.userInfo.lastCheckinTime?.replace('T', ' ') || '',
    lastLoginTime: props.userInfo.lastLoginTime?.replace('T', ' ') || '',
    updatedTime: props.userInfo.updatedTime?.replace('T', ' ') || '',
    createdTime: props.userInfo.createdTime?.replace('T', ' ') || '',
    vipExpireTime: props.userInfo.vipExpireTime?.replace('T', ' ') || '',
  }
  // 初始化表单为原始数据
  editForm.value = { ...originFormData }
  // 打开弹窗
  showEditDialog.value = true
}

// 8. 关闭弹窗方法（关键：重置表单 + 关闭弹窗）
const closeEditDialog = () => {
  // 重置表单为原始数据
  editForm.value = { ...originFormData }
  // 清空表单校验提示（可选）
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
  // 关闭弹窗
  showEditDialog.value = false
}

// 9. 表单保存（带校验）
const handleSaveEdit = async () => {
  if (!editFormRef.value) return

  try {
    // 触发表单校验
    await editFormRef.value.validate()
    // 校验通过，派发事件
    emit('update-user-info', { ...editForm.value })
    // 保存成功后，更新原始数据（下次打开弹窗时用最新的已保存数据）
    originFormData = { ...editForm.value }
    closeEditDialog() // 保存成功后关闭弹窗
    ElMessage.success('资料修改成功')
  } catch (error) {
    // 校验失败，提示错误
    ElMessage.error('表单填写有误，请检查昵称/手机号/签名格式')
    console.error('表单校验失败:', error)
  }
}

// 10. 监听用户信息变化（父组件数据更新时，同步原始数据）
watch(
  () => props.userInfo,
  (newVal) => {
    // 如果弹窗未打开，更新原始数据；如果弹窗已打开，不修改（避免干扰用户编辑）
    if (!showEditDialog.value) {
      originFormData = {
        name: newVal.username || '未知用户',
        signature: newVal.introduction || '',
        gender: newVal.gender || '未知',
        phone: newVal.phone || '',
        walletBalance: newVal.walletBalance || 0,
        lastCheckinTime: newVal.lastCheckinTime?.replace('T', ' ') || '',
        lastLoginTime: newVal.lastLoginTime?.replace('T', ' ') || '',
        updatedTime: newVal.updatedTime?.replace('T', ' ') || '',
        createdTime: newVal.createdTime?.replace('T', ' ') || '',
        vipExpireTime: newVal.vipExpireTime?.replace('T', ' ') || '',
      }
    }
    // 预览图同步（非核心）
    avatarPreview.value = null
    bgPreview.value = null
  },
  { deep: true, immediate: true }, // immediate: true 确保初始化时执行
)

// 11. 上传相关方法
const handleAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleBgUpload = () => {
  bgInput.value?.click()
}

const handleFileUpload = (type: 'avatar' | 'bg', e: Event) => {
  const input = type === 'avatar' ? avatarInput.value : bgInput.value
  if (!input?.files?.length) return

  const file = input.files![0]
  if (!file) return

  // 文件格式校验
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  if (!isImage) {
    ElMessage.error('仅支持JPG、PNG、GIF格式的图片')
    return
  }

  // 生成本地预览
  if (type === 'avatar') {
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
    avatarPreview.value = URL.createObjectURL(file)
  } else {
    if (bgPreview.value) URL.revokeObjectURL(bgPreview.value)
    bgPreview.value = URL.createObjectURL(file)
  }

  // 派发上传事件
  if (type === 'avatar') {
    emit('upload-avatar', file)
  } else {
    emit('upload-bg', file)
  }
  // 清空input，支持重复选择
  input.value = ''
}

// 12. 关注/取消关注
const handleFollow = () => {
  isFollowing.value = !isFollowing.value
}

// 13. 生命周期
onMounted(() => {
  // 监听弹窗显示/隐藏，控制body滚动
  watch(showEditDialog, (value) => {
    document.body.style.overflow = value ? 'hidden' : ''
  })
})

onUnmounted(() => {
  // 释放预览URL，避免内存泄漏
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  if (bgPreview.value) URL.revokeObjectURL(bgPreview.value)
})
</script>

<style lang="scss" scoped>
// 在线状态头像容器
.online-avatar-container {
  border: 4px solid rgba(255, 46, 147, 0.5);
  animation: pulse-online 3s infinite;

  &:hover {
    border-color: rgba(255, 46, 147, 0.8);
  }
}

// 离线状态头像容器
.offline-avatar-container {
  border: 4px solid rgba(156, 163, 175, 0.5);
  animation: pulse-offline 3s infinite;

  &:hover {
    border-color: rgba(156, 163, 175, 0.8);
  }
}

// 在线状态呼吸动画
@keyframes pulse-online {
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

// 离线状态呼吸动画
@keyframes pulse-offline {
  0% {
    box-shadow: 0 0 0 0 rgba(156, 163, 175, 0.3);
    transform: scale(0.98);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(156, 163, 175, 0.1);
    transform: scale(1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(156, 163, 175, 0);
    transform: scale(0.98);
  }
}

// 离线状态指示灯动画
.pulse-offline {
  animation: pulse-offline-light 2s ease-in-out infinite;
}

@keyframes pulse-offline-light {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
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

// 表单错误提示样式（可选）
::v-deep .el-form-item__error {
  color: #ff2e93;
  font-size: 12px;
  margin-top: 6px;
  margin-left: 4px;
}

::v-deep .el-form-item--error .el-input__inner {
  border-color: #ff2e93;
  box-shadow: 0 0 0 1px #ff2e93;
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
    border-color: #ff2e93;
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
