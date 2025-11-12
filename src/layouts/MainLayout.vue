<template>
  <div>


    <!-- <nav>
      <router-link to="/">首页 ( / )</router-link>
      <router-link to="/artist">歌手页 ( /artist )</router-link>
      <router-link to="/album">专辑页 ( /album )</router-link>
      <router-link to="/user">个人主页</router-link>
      <router-link to="/UserAuth">去登录页 ( /user-auth )</router-link>
      <hr />

    </nav> -->
    <div class="flex gap-2">
      <left-menu class="shrink-0"/>
      <div class="flex flex-col flex-1">
        <top-header />
        <main>
        <slot />
      </main>
      </div>


    </div>


  </div>
</template>

<style scoped>
.main-layout-shell {
  border: 5px solid blue;
  padding: 1rem;
  background-color: #e6f7ff;
}
</style>
