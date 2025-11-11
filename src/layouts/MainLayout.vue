<template>
  <div class="main-layout-shell">
    <h1>🎵 MAIN LAYOUT (前台布局)</h1>
    <p>这个布局应该有音乐播放器和前台导航。</p>
    <nav>
      <router-link to="/">首页 ( / )</router-link>
      <router-link to="/artist">歌手页 ( /artist )</router-link>
      <router-link to="/album">专辑页 ( /album )</router-link>
      <router-link to="/user">个人主页</router-link>
      <router-link to="/UserAuth">去登录页 ( /user-auth )</router-link>
      <hr />

    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main-layout-shell {
  border: 5px solid blue;
  padding: 1rem;
  background-color: #e6f7ff;
}
</style>
