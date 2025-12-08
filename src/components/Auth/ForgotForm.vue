<template>
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

    <ElButton class="btn-primary" @click="handleResetPassword(forgotRef)"> 重置密码 </ElButton>

    <ElButton class="btn-back" @click="currentView = 'login'"> 返回登录 </ElButton>
  </ElForm>
</template>

<script lang="ts" setup>
import { setNewpassword } from '@/api/auth/Forgot'
import { countdown, handleGetCode } from '@/composables/useCountDown'
import type { ForgotForm } from '@/types/Auth'
import { useAuthRules } from '@/utils/rules/auth'
import type { FormInstance } from 'element-plus'

const currentView = defineModel<string>()
const forgotRef = ref<FormInstance>()

// 忘记密码逻辑区
// 基于后端请求数据定义的变量（未完全做到见名知意）
const forgotForm = reactive<ForgotForm>({
  email: '',
  captcha: '',
  newPassword: '', //再次确认的密码
  password: '', //设定的新密码
})

const { forgotRules } = useAuthRules(forgotForm)

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
        })
    } else {
      ElMessage.error('请正确填写数据')
      return
    }
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
    font-size: 0.75rem;
    padding-top: 0.25rem;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
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
  margin-left: 0 !important;

  &:hover {
    color: rgba(255, 255, 255, 0.9) !important;
    background: transparent !important;
  }
}
</style>
