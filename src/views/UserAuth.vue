<template>
  <!--
    主容器：
    - min-h-screen: 确保容器至少占满整个屏幕高度
    - bg-neutral-900: 使用一个非常深的灰色作为页面背景 (来自你设计稿的风格)
    - text-white: 默认文字为白色
    - flex items-center justify-center: 垂直和水平居中
    - p-4: 在手机上保留一些内边距
  -->
  <div class="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
    <!--
      表单卡片：
      - w-full max-w-md: 在手机上占满宽度，但在桌面上最大宽度为 md (中等)
      - bg-neutral-800: 卡片背景色，比页面背景稍亮
      - rounded-lg: 大圆角
      - shadow-lg: 轻微的阴影增加层次感
      - p-8 md:p-10: 较大的内边距
    -->
    <div class="w-full max-w-md bg-neutral-800 rounded-lg shadow-lg p-8 md:p-10">
      <!-- 1. 顶部 Logo 和标题 -->
      <div class="text-center mb-8">
        <!-- 你可以在这里替换成你的 Logo SVG -->
        <h1 class="text-3xl font-bold text-[#ff2e93]">Daystream Music</h1>
        <p class="text-neutral-400 mt-2">欢迎回来</p>
      </div>

      <!-- 2. 登录 / 注册 切换标签 -->
      <div class="flex mb-6">
        <button
          @click="isLoginMode = true"
          :class="[
            'w-1/2 py-3 text-center font-semibold rounded-t-lg transition-colors',
            isLoginMode
              ? 'text-white border-b-2 border-[#ff2e93]'
              : 'text-neutral-400 hover:text-white',
          ]"
        >
          登录
        </button>
        <button
          @click="isLoginMode = false"
          :class="[
            'w-1/2 py-3 text-center font-semibold rounded-t-lg transition-colors',
            !isLoginMode
              ? 'text-white border-b-2 border-[#ff2e93]'
              : 'text-neutral-400 hover:text-white',
          ]"
        >
          注册
        </button>
      </div>

      <!-- 3. 表单区域 -->
      <div>
        <!-- 登录表单 -->
        <form v-if="isLoginMode" @submit.prevent="handleLogin" class="space-y-6">
          <!-- 邮箱/手机号 -->
          <div>
            <label for="login-email" class="block text-sm font-medium text-neutral-300 mb-2">
              邮箱或手机号
            </label>
            <input
              type="text"
              id="login-email"
              v-model="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- 密码 -->
          <div>
            <label for="login-password" class="block text-sm font-medium text-neutral-300 mb-2">
              密码
            </label>
            <input
              type="password"
              id="login-password"
              v-model="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- 忘记密码 -->
          <div class="text-right">
            <a href="#" class="text-sm text-[#ff2e93] hover:text-purple-300 transition-colors">
              忘记密码？
            </a>
          </div>

          <!-- 登录按钮 -->
          <div>
            <button
              type="submit"
              class="w-full bg-[#ff2e93] hover:bg-[#ff2e93] text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
            >
              登 录
            </button>
          </div>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="space-y-6">
          <!-- 用户名 -->
          <div>
            <label for="reg-username" class="block text-sm font-medium text-neutral-300 mb-2">
              用户名
            </label>
            <input
              type="text"
              id="reg-username"
              v-model="username"
              placeholder="设置你的昵称"
              class="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- 邮箱/手机号 -->
          <div>
            <label for="reg-email" class="block text-sm font-medium text-neutral-300 mb-2">
              邮箱或手机号
            </label>
            <input
              type="text"
              id="reg-email"
              v-model="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- 密码 -->
          <div>
            <label for="reg-password" class="block text-sm font-medium text-neutral-300 mb-2">
              设置密码
            </label>
            <input
              type="password"
              id="reg-password"
              v-model="password"
              placeholder="至少8位字符"
              class="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <!-- 注册按钮 -->
          <div>
            <button
              type="submit"
              class="w-full bg-[#ff2e93] hover:bg-[#ff2e93] text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
            >
              注 册
            </button>
          </div>
        </form>

        <!-- 4. 第三方登录 (可选) -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-neutral-600"></span>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-neutral-800 text-neutral-400"> 或使用其他方式登录 </span>
            </div>
          </div>

          <div class="mt-6 flex justify-center space-x-4">
            <!-- 示例图标 (你可以替换成 SVG 或 FontAwesome) -->
            <button
              class="w-12 h-12 flex items-center justify-center bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors"
            >
              <!-- 微信图标 (示例) -->
              <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm... (省略路径)"
                />
              </svg>
            </button>
            <button
              class="w-12 h-12 flex items-center justify-center bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors"
            >
              <!-- QQ图标 (示例) -->
              <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm... (省略路径)"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue' // 控制是显示登录还是注册表单
const isLoginMode = ref(true)

// 表单数据
const username = ref('')
const email = ref('')
const password = ref('')

// 登录处理函数
const handleLogin = () => {
  if (!email.value || !password.value) {
    ElMessage({
      message: '请填写所有登录信息',
      type: 'warning',
    })
    return
  }
  console.log('登录中...', { email: email.value, password: password.value })
  // 调用登录 API
  // ...
}

// 注册处理函数
const handleRegister = () => {
  if (!username.value || !email.value || !password.value) {
    ElMessage({
      message: '请填写所有注册信息',
      type: 'warning',
    })
    return
  }
  console.log('注册中...', {
    username: username.value,
    email: email.value,
    password: password.value,
  })
  // 调用注册 API
  // ...
}
</script>

<route lang="yaml">
meta:
  layout: auth
</route>

<style scoped></style>

<route lang="yaml">
meta:
  layout: auth
</route>
