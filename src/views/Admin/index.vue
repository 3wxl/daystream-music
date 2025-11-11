<template>
  <!-- 作用：后台的layout -->
  <el-container class="admin-container">
    <el-aside width="230px">
      <el-scrollbar height="100vh" class="bg-[#314050]">
        <el-menu mode="vertical" class="admin-menu" default-active="1" background-color="#314050" text-color="rgb(168,177,194)" active-text-color="white">
          <el-menu-item index="1">
            <IconFontSymbol name="shuju"></IconFontSymbol>
            <span>数据</span>
          </el-menu-item>
          <el-menu-item index="2">
            <IconFontSymbol name="shuju"></IconFontSymbol>
            <span>用户管理</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <IconFontSymbol name="shuju"></IconFontSymbol>
              <span>歌曲管理</span>
            </template>
            <el-menu-item index="3-1">歌曲列表</el-menu-item>
            <el-menu-item index="3-2">歌曲审核</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <IconFontSymbol name="shuju"></IconFontSymbol>
              <span>音乐人管理</span>
            </template>
            <el-menu-item index="4-1">音乐人列表</el-menu-item>
            <el-menu-item index="4-2">音乐人审核</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <IconFontSymbol name="shuju"></IconFontSymbol>
              <span>运营管理</span>
            </template>
            <el-menu-item index="5-1">轮播图</el-menu-item>
            <el-menu-item index="5-2">热搜列表</el-menu-item>
            <el-menu-item index="5-3">首页推荐位</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="6">
            <IconFontSymbol name="shuju"></IconFontSymbol>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>

      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
  import IconFontSymbol from '@/components/IconFontSymbol.vue'
</script>

<style scoped>
  ::v-deep .admin-menu .el-menu-item,
  ::v-deep .admin-menu .el-sub-menu__title {
    border-radius: 6px;
    margin: 0 4px;
  }
  ::v-deep .admin-menu{
    --el-menu-active-font-weight: 700;
  }
  /* 1. 一级菜单项激活时：图标颜色 */
  ::v-deep .el-menu-item.is-active .iconfont {
    color: white;
  }

  /* 2. 子菜单标题激活时：图标颜色 */
  ::v-deep .el-sub-menu.is-active .is-opened .iconfont {
    color: white;
  }

  /* 3. 子菜单项激活时：图标颜色 */
  ::v-deep .el-sub-menu .el-menu .el-menu-item.is-active .iconfont {
    color: white;
  }

  /* 可选：未激活时的默认颜色（按需调整） */
  ::v-deep .el-menu-item .iconfont,
  ::v-deep .el-sub-menu__title .iconfont {
    color: rgb(168,177,194); /* 默认灰色 */
  }
</style>
