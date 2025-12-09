<template>
  <ElForm
    v-if="currentView === 'login'"
    ref="loginRef"
    :model="loginForm"
    :rules="loginRules"
    class="auth-form"
    label-position="top"
  >
    <ElFormItem label="邮箱" prop="email">
      <ElInput v-model="loginForm.email" type="email" class="form-input" placeholder="请输入邮箱" />
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
</template>

<script lang="ts" setup>
import { getCaptcha } from '@/api/auth/Login'
import { useUserStore } from '@/stores/user'
import type { LoginForm } from '@/types/Auth'
import { useAuthRules } from '@/utils/rules/auth'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

const currentView = defineModel<string>()
const loginRef = ref<FormInstance>()
const loginForm = reactive<LoginForm & { captcha: string }>({
  email: '',
  password: '',
  captcha: '',
})

const { loginRules } = useAuthRules(loginForm)

// 登录逻辑区域
const router = useRouter()
const userStore = useUserStore()
const loginCaptchaUrl = ref('')
const captchaId = ref('')
const isloading = ref(false)

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
    })
    .finally(() => {
      isloading.value = false
    })
}
</script>

<style lang="scss" scoped>
@import '@/styles/auth.scss';

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

.btn-group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;

  .el-button {
    flex: 1;
    width: auto;
  }
}
</style>
