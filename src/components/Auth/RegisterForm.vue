<template>
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
        <ElInput v-model="registerForm.captcha" class="form-input" placeholder="请输入验证码" />
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
</template>

<script lang="ts" setup>
import { registerUser } from '@/api/auth'
import { countdown, handleGetCode } from '@/composables/useCountDown'
import type { RegisterForm } from '@/types/Auth'
import { useAuthRules } from '@/utils/rules/auth'
import type { FormInstance } from 'element-plus'

const currentView = defineModel<string>()

const registerRef = ref<FormInstance>()
// 注册逻辑区域
const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  newPassword: '',
  captcha: '',
})

const { registerRules } = useAuthRules(registerForm)

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
      })
  } catch (error) {
    console.log('表单校验未通过', error)
    return false
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/auth.scss';

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
</style>
