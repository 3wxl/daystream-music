<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Daystream Music</h1>
        <p class="auth-subtitle">欢迎回来</p>
      </div>

      <div class="auth-tabs">
        <ElButton
          class="auth-tab"
          :class="{ active: currentView === 'login' }"
          @click="currentView = 'login'"
          text
        >
          登录
        </ElButton>
        <ElButton
          class="auth-tab"
          :class="{ active: currentView === 'register' }"
          @click="currentView = 'register'"
          text
        >
          注册
        </ElButton>
      </div>

      <div class="auth-content">
        <ElForm
          v-if="currentView === 'login'"
          ref="loginRef"
          :model="loginForm"
          :rules="loginRules"
          class="auth-form"
          label-position="top"
        >
          <ElFormItem label="邮箱" prop="email">
            <ElInput
              v-model="loginForm.email"
              type="email"
              class="form-input"
              placeholder="请输入邮箱"
            />
          </ElFormItem>

          <ElFormItem label="密码" prop="password">
            <ElInput
              v-model="loginForm.password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              show-password
            />
          </ElFormItem>

          <ElFormItem label="验证码" prop="captcha">
            <div class="form-input-group captcha-group">
              <ElInput v-model="loginForm.captcha" class="form-input" placeholder="请输入验证码" />
              <div class="captcha-wrapper" @click="changeCaptcha()">
                <div class="captcha-box">
                  <img :src="loginCaptchaUrl" alt="验证码" />
                </div>
                <span class="change-captcha-text">看不清换一张</span>
              </div>
            </div>
          </ElFormItem>

          <div class="form-actions">
            <ElButton type="text" class="forgot-password" @click="currentView = 'forgot'">
              忘记密码？
            </ElButton>
          </div>

          <div class="btn-group">
            <ElButton class="btn-primary" @click="handleLogin(loginRef)"> 登 录 </ElButton>

            <ElButton class="btn-secondary" @click="currentView = 'register'"> 立即注册 </ElButton>
          </div>
        </ElForm>

        <ElForm
          v-if="currentView === 'register'"
          ref="registerRef"
          :model="registerForm"
          :rules="registerRules"
          class="auth-form"
          label-position="top"
        >
          <ElFormItem label="昵称" prop="username">
            <ElInput v-model="registerForm.username" class="form-input" placeholder="请输入昵称" />
          </ElFormItem>

          <ElFormItem label="邮箱" prop="email">
            <ElInput v-model="registerForm.email" class="form-input" placeholder="请输入邮箱" />
          </ElFormItem>

          <ElFormItem label="密码" prop="password">
            <ElInput
              v-model="registerForm.password"
              type="password"
              class="form-input"
              placeholder="请输入密码"
              show-password
            />
          </ElFormItem>

          <ElFormItem label="确认密码" prop="newPassword">
            <ElInput
              v-model="registerForm.newPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入密码"
              show-password
            />
          </ElFormItem>

          <ElFormItem label="验证码" prop="captcha">
            <div class="form-input-group">
              <ElInput
                v-model="registerForm.captcha"
                class="form-input"
                placeholder="请输入验证码"
              />
              <ElButton
                class="btn-verify"
                :disabled="countdown > 0"
                @click="handleGetCode(registerForm, registerRef)"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </ElButton>
            </div>
          </ElFormItem>

          <ElButton class="btn-primary" @click="insertUser(registerRef)"> 注 册 </ElButton>
        </ElForm>

        <ElForm
          v-if="currentView === 'forgot'"
          ref="forgotRef"
          :model="forgotForm"
          :rules="forgotRules"
          class="auth-form"
          label-position="top"
        >
          <ElFormItem label="邮箱" prop="email">
            <ElInput v-model="forgotForm.email" class="form-input" placeholder="请输入邮箱" />
          </ElFormItem>

          <ElFormItem label="邮箱验证码" prop="captcha">
            <div class="form-input-group">
              <ElInput v-model="forgotForm.captcha" class="form-input" placeholder="请输入验证码" />
              <ElButton
                class="btn-verify"
                :disabled="countdown > 0"
                @click="handleGetCode(forgotForm, forgotRef)"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </ElButton>
            </div>
          </ElFormItem>

          <ElFormItem label="新密码" prop="newPassword">
            <ElInput
              v-model="forgotForm.password"
              type="password"
              class="form-input"
              placeholder="请输入新密码"
              show-password
            />
          </ElFormItem>

          <ElFormItem label="确认新密码" prop="confirmPassword">
            <ElInput
              v-model="forgotForm.newPassword"
              type="password"
              class="form-input"
              placeholder="请再次输入新密码"
              show-password
            />
          </ElFormItem>

          <ElButton class="btn-primary" @click="handleResetPassword(forgotRef)">
            重置密码
          </ElButton>

          <ElButton class="btn-back" @click="currentView = 'login'"> 返回登录 </ElButton>
        </ElForm>
      </div>

      <div class="auth-divider">
        <span class="divider-text">或使用其他方式登录</span>
      </div>

      <div class="auth-social">
        <ElButton class="social-btn" @click="showQQDialog = true" circle>
          <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.17 16.83c-1.9-.19-3.67-.98-5.08-2.31l1.41-1.41c1.2.81 2.5 1.31 3.87 1.48v-2.01c-1.44-.21-2.78-.93-3.87-1.95l1.41-1.41c1.31.97 2.73 1.54 4.46 1.54v-2h2v2c1.73 0 3.15-.57 4.46-1.54l1.41 1.41c-1.09 1.02-2.43 1.74-3.87 1.95v2.01c1.37-.17 2.67-.67 3.87-1.48l1.41 1.41c-1.41 1.33-3.18 2.12-5.08 2.31z"
            />
          </svg>
        </ElButton>
      </div>
    </div>

    <ElDialog
      v-model="showQQDialog"
      title="QQ快捷登录"
      class="qq-dialog-wrapper"
      :show-close="false"
      width="400px"
    >
      <div class="qq-dialog-content">
        <div class="qq-qrcode">
          <div class="qrcode-placeholder">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="#f3f4f6" />
              <rect x="20" y="20" width="40" height="40" fill="#000" />
              <rect x="140" y="20" width="40" height="40" fill="#000" />
              <rect x="20" y="140" width="40" height="40" fill="#000" />
              <rect x="60" y="60" width="80" height="80" fill="#000" />
              <rect x="80" y="80" width="40" height="40" fill="#f3f4f6" />
            </svg>
          </div>
        </div>
        <p class="qq-dialog-tip">请使用QQ扫码登录</p>
      </div>
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
import { setNewpassword } from '@/api/Auth/Forgot'
import { getCaptcha } from '@/api/Auth/Login'
import { getEmailCaptcha, registerUser } from '@/api/Auth/Register'
import { useUserStore } from '@/stores/user'
import { ForgotForm } from '@/types/Auth/forgot'
import { LoginForm } from '@/types/Auth/login'
import { RegisterForm } from '@/types/Auth/register'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const currentView = ref<'login' | 'register' | 'forgot'>('login')
const showQQDialog = ref(false)
const countdown = ref(0)

const loginRef = ref<FormInstance>()
const registerRef = ref<FormInstance>()
const forgotRef = ref<FormInstance>()

// 登录逻辑区域
const router = useRouter()
const userStore = useUserStore()
const loginCaptchaUrl = ref('')
const captchaId = ref('')
const isloading = ref(false)

const loginForm = reactive<LoginForm & { captcha: string }>({
  email: '',
  password: '',
  captcha: '',
})

const loginRules = reactive<FormRules<LoginForm & { captcha: string }>>({
  email: [{ required: true, message: '请填写对应邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '填写密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 登录
// 后端连接上就是200 所以成功不能以这个为判断标准 要多判断一遍
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const LoginData = reactive({
        ...loginForm,
        captchaUUId: captchaId,
      })
      userStore
        .login(LoginData)
        .then(() => {
          formEl.resetFields()
          ElMessage.success('登录成功')
          router.push('/')
        })
        .catch((error) => {
          console.log(error)
          ElMessage.error('登录失败，请重试')
          changeCaptcha()
        })
    }
  })
}

// 图形验证码
onMounted(() => {
  changeCaptcha()
})

const changeCaptcha = () => {
  // 判断是否已经发送过请求了 发过来就为true
  if (isloading.value) return

  isloading.value = true
  getCaptcha()
    .then((res) => {
      loginCaptchaUrl.value = res.data.captchaBase64Image
      captchaId.value = res.data.captchaUUId
      console.log(res)
    })
    .catch((error) => {
      console.error('获取验证码失败', error)
      ElMessage.error('加载失败，请点击重试')
    })
    .finally(() => {
      isloading.value = false
    })
}

// 注册逻辑区域
const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  newPassword: '',
  captcha: '',
})

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致！'))
  } else {
    callback()
  }
}

const registerRules = reactive<FormRules<RegisterForm>>({
  username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请填写对应邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    },
  ],
  newPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    },
    { validator: validatePass, trigger: 'blur' },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const insertUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    registerUser(registerForm)
      .then(() => {
        formEl.resetFields()
        ElMessage.success('注册成功，请登录')
        currentView.value = 'login'
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error('网络连接异常，请稍后重试')
      })
  } catch (error) {
    console.log('表单校验未通过', error)
    return false
  }
}

// 忘记密码逻辑区

// 基于后端请求数据定义的变量（未完全做到见名知意）
const forgotForm = reactive<ForgotForm>({
  email: '',
  captcha: '',
  newPassword: '', //再次确认的密码
  password: '', //设定的新密码
})

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== forgotForm.password) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    callback()
  }
}

const forgotRules = reactive<FormRules<ForgotForm>>({
  email: [{ required: true, message: '请填写对应邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    },
  ],
  newPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    },
    { validator: validatePass2, trigger: 'blur' },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

// 忘记密码 先找到自己的表单 然后检验rules通过没有 通过了就发请求呗
const handleResetPassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      setNewpassword(forgotForm)
        .then(() => {
          formEl.resetFields()
          ElMessage.success('设置密码成功，请登录')
          currentView.value = 'login'
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error('设置新密码失败，请重试')
        })
    } else {
      ElMessage.error('请正确填写数据')
      return
    }
  })
}

// 验证码逻辑
interface EmailForm {
  email: string
  [key: string]: any
}

const handleGetCode = async (formData: EmailForm, formRef: FormInstance | undefined) => {
  // 1.防抖处理，不可重复获取
  if (countdown.value > 0) return

  // 2.检验表单
  if (!formRef) return

  try {
    // 4.单独校验email格式
    await formRef.validateField('email')
    // 5.调用验证码接口
    await getEmailCaptcha(formData.email)
    ElMessage.success('验证码已发送')

    // 6.倒计时逻辑
    countdown.value = 60

    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.log(error, '校验失败，或者验证码发送不成功')
  }
}
</script>

<style lang="scss" scoped>
.auth-wrapper {
  min-height: 100vh;
  background-color: #0b0f1b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-image: radial-gradient(circle at top right, rgba(236, 72, 153, 0.18), transparent 45%);
}

.auth-container {
  width: 100%;
  max-width: 440px;
  background: rgba(15, 23, 42, 0.65);
  border-radius: 1.75rem;
  padding: 2.5rem;
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(120deg, #ec4899, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.auth-tab {
  flex: 1;
  padding: 0.75rem 0;
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  background: transparent !important;
  border: none !important;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  width: 100%;

  &.active {
    color: #ec4899 !important;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(120deg, #ec4899, #f97316);
    }
  }

  &:hover:not(.active) {
    color: rgba(255, 255, 255, 0.8) !important;
    background: transparent !important;
  }
}

.auth-content {
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  :deep(.el-form-item) {
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :deep(.el-form-item__label) {
    font-size: 0.9rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    padding: 0;
    margin-bottom: 0;
    line-height: 1.5;
  }

  :deep(.el-form-item__error) {
    color: #fb7185;
    font-size: 0.75rem;
    padding-top: 0.25rem;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

.form-input {
  width: 100%;

  :deep(.el-input__wrapper) {
    padding: 0.75rem 1rem;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 0.75rem;
    box-shadow: none;
    transition: all 0.3s;
    min-height: 48px;

    &:hover {
      box-shadow: none;
    }

    &.is-focus {
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }
  }

  :deep(.el-input__inner) {
    color: white;
    font-size: 0.95rem;
    line-height: 1.5;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.form-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;

  .form-input {
    flex: 1;
  }

  .btn-verify {
    height: auto;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.captcha-group {
  align-items: flex-start;
}

.captcha-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.captcha-box {
  width: 120px;
  height: 48px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.change-captcha-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #ec4899;
  }
}

.btn-verify {
  padding: 0.75rem 1.25rem;
  background: rgba(236, 72, 153, 0.2) !important;
  border: 1px solid rgba(236, 72, 153, 0.4) !important;
  border-radius: 0.75rem;
  color: #ec4899 !important;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  min-height: 48px;

  &:hover:not(:disabled) {
    background: rgba(236, 72, 153, 0.3) !important;
    border-color: #ec4899 !important;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.5rem;
}

.forgot-password {
  font-size: 0.85rem;
  color: #fb7185 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  height: auto !important;

  &:hover {
    color: #fecaca !important;
    background: transparent !important;
  }
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(120deg, #ec4899, #f97316) !important;
  border: none !important;
  border-radius: 0.75rem;
  color: #0f172a !important;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(236, 72, 153, 0.4);
    background: linear-gradient(120deg, #ec4899, #f97316) !important;
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-secondary {
  width: 100%;
  padding: 0.875rem;
  background: transparent !important;
  border: 1px solid rgba(236, 72, 153, 0.4) !important;
  border-radius: 0.75rem;
  color: #ec4899 !important;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(236, 72, 153, 0.1) !important;
    border-color: #ec4899 !important;
    color: #ec4899 !important;
  }
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.btn-back {
  width: 100%;
  padding: 0.875rem;
  background: transparent !important;
  border: none !important;
  border-radius: 0.75rem;
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: rgba(255, 255, 255, 0.9) !important;
    background: transparent !important;
  }
}

.auth-divider {
  position: relative;
  margin: 1.5rem 0;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(148, 163, 184, 0.15);
  }
}

.divider-text {
  position: relative;
  padding: 0 1rem;
  background: rgba(15, 23, 42, 0.65);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.auth-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid rgba(148, 163, 184, 0.2) !important;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0 !important;

  &:hover {
    background: rgba(236, 72, 153, 0.1) !important;
    border-color: #ec4899 !important;
    transform: translateY(-2px);
  }
}

.social-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
}

.qq-dialog-wrapper {
  :deep(.el-overlay) {
    backdrop-filter: blur(4px);
  }

  :deep(.el-dialog) {
    background: rgba(15, 23, 42, 0.95);
    border-radius: 1.5rem;
    border: 1px solid rgba(148, 163, 184, 0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  :deep(.el-dialog__header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.15);
    margin-right: 0;
  }

  :deep(.el-dialog__title) {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
  }

  :deep(.el-dialog__headerbtn) {
    width: 2rem;
    height: 2rem;
    top: 1.5rem;
    right: 1.5rem;

    .el-dialog__close {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.5rem;
      transition: color 0.3s;

      &:hover {
        color: white;
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }
}

.qq-dialog-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.qq-qrcode {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.qrcode-placeholder {
  width: 100%;
  height: 100%;
}

.qq-dialog-tip {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
}
</style>

<route lang="yaml">
meta:
  layout: auth
</route>
