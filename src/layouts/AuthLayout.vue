<template>
  <div class="auth-layout-shell">
    <h1>🔒 AUTH LAYOUT (登录布局)</h1>
    <p>这个布局是空白的，没有导航和播放器。</p>
    <main>
      <slot />
      <hr />
      <router-link to="/">返回首页 ( / )</router-link>
    </main>
  </div>
</template>

<style scoped>
.auth-layout-shell {
  border: 5px solid green;
  padding: 1rem;
  background-color: #f6ffed;
  max-width: 500px;
  margin: 4rem auto;
}
</style>
