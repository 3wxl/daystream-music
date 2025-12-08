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
        <!-- 登录 -->
        <LoginForm v-model="currentView" />
        <!-- 注册 -->
        <RegisterForm v-model="currentView" />
        <!-- 找回密码 -->
        <ForgotForm v-model="currentView" />
      </div>

      <div class="auth-divider">
        <span class="divider-text">或使用其他方式登录</span>
      </div>

      <div class="auth-social">
        <div class="qq-circle-btn" @click="handleQQLogin">
          <img :src="qqIcon" alt="QQ Login" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import qqIcon from '@/assets/qq.png'
import ForgotForm from '@/components/Auth/ForgotForm.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import RegisterForm from '@/components/Auth/RegisterForm.vue'
import { ref } from 'vue'

const currentView = ref<'login' | 'register' | 'forgot'>('login')

const handleQQLogin = () => {
  window.location.href =
    'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=102818237&response_type=token&scope=all&redirect_uri=https%3A%2F%2Fwww.histweilai.top%2FUserAuth'
}
</script>

<style lang="scss" scoped>
.auth-wrapper {
  min-height: 100vh;
  background-color: #050505; /* Deep static black */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  background-image: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%);
}

.auth-container {
  width: 100%;
  max-width: 440px;
  background: rgba(20, 20, 25, 0.9); /* Higher opacity for static look */
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 1;
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

.qq-circle-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(44, 183, 245, 0.4);
    border-color: #2cb7f5;
  }
}
</style>

<route lang="yaml">
meta:
  layout: auth
</route>
