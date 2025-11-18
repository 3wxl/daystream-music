<template>
  <!-- 作用：后台的layout -->
  <el-container class="admin-container">
    <el-aside width="220px">
      <el-scrollbar height="100vh" class="bg-linear-to-tr from-[#58768a] to-[#544464] shadow-xl/20 shadow-[#A070EE]">
        <div class="w-full my-4">
          <img class="w-full h-[80px] object-contain" src="@/assets/logo_0.png" alt="" >
          <p class="bg-clip-text text-center font-[700] text-[20px] bg-linear-to-r from-[#EC369F] to-[#AE4AFE] text-transparent">Daystream Music</p>
        </div>
        <el-menu mode="vertical" class="admin-menu" default-active="1" background-color="transparent" text-color="rgb(168,177,194)" active-text-color="white">
          <el-menu-item index="1" @click="router.push('/admin/dataStatistics')">
            <IconFontSymbol name="shouye" class="mr-1"></IconFontSymbol>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2" @click="router.push('/admin/userManage')">
            <IconFontSymbol name="yonghu" class="mr-1"></IconFontSymbol>
            <span>用户管理</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <IconFontSymbol name="yinle" class="mr-1"></IconFontSymbol>
              <span>作品管理</span>
            </template>
            <el-menu-item index="3-1" @click="router.push('/admin/worksManage/songsList')">
              <IconFontSymbol name="bofangqi_shouyegequliebiao_" size="18px"></IconFontSymbol>
              <span>歌曲列表</span>
            </el-menu-item>
            <el-menu-item index="3-2" @click="router.push('/admin/worksManage/songsReview')">
              <IconFontSymbol name="file-music" class="mr-1"></IconFontSymbol>
              <span>歌曲审核</span>
            </el-menu-item>
            <el-menu-item index="3-3"  @click="router.push('/admin/worksManage/mvList')">
              <IconFontSymbol name="songbook_mv" size="18px"  class="mr-1"></IconFontSymbol>
              <span>MV列表</span>
            </el-menu-item>
            <el-menu-item index="3-4" @click="router.push('/admin/worksManage/mvReview')">
              <IconFontSymbol name="shenhe" class="mr-1"></IconFontSymbol>
              <span>MV审核</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <IconFontSymbol name="yinleren" class="mr-1"></IconFontSymbol>
              <span>音乐人管理</span>
            </template>
            <el-menu-item index="4-1">
              <IconFontSymbol name="liebiao" size="15px" class="mr-1"></IconFontSymbol>
              <span>音乐人列表</span>
            </el-menu-item>
            <el-menu-item index="4-2">
              <IconFontSymbol name="shenhe" class="mr-1"></IconFontSymbol>
              <span>音乐人审核</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <IconFontSymbol name="yunyingguanli" class="mr-1"></IconFontSymbol>
              <span>运营管理</span>
            </template>
            <el-menu-item index="5-1">
              <IconFontSymbol name="lunbotuguanli" class="mr-1"></IconFontSymbol>
              <span>轮播图</span>
            </el-menu-item>
            <el-menu-item index="5-2">
              <IconFontSymbol name="resou" class="mr-1"></IconFontSymbol>
              <span>热搜列表</span>
            </el-menu-item>
            <el-menu-item index="5-3">
              <IconFontSymbol name="shouyetuijianwei" class="mr-1"></IconFontSymbol>
              <span>首页推荐位</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <IconFontSymbol name="yunyingguanli" class="mr-1"></IconFontSymbol>
              <span>社区管理</span>
            </template>
            <el-menu-item index="6-1">
              <IconFontSymbol name="lunbotuguanli" class="mr-1"></IconFontSymbol>
              <span>评论管理</span>
            </el-menu-item>
            <el-menu-item index="6-2">
              <IconFontSymbol name="lunbotuguanli" class="mr-1"></IconFontSymbol>
              <span>动态管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="7">
            <IconFontSymbol name="tuichudenglu" class="mr-1"></IconFontSymbol>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <div class="h-[60px] bg-white">
          <el-row class="h-full w-full">
            <el-col :span="4" :offset="10">
              <p class="text-[15px]/[60px] line-clamp-1">您好<span class="text-[13px] text-[#529FFD]">admin</span>,欢迎登录！</p>
            </el-col>
            <el-col :span="4" :offset="6">
              <el-row class="h-full w-full text-base/[60px]">
                <el-col :span="8">
                  <span class="cursor-pointer hover:text-[#529FFD] duration-[0.3s] max-[1347px]:text-[13px]">
                    <IconFontSymbol name="a-shezhi-shucaidanshezhi-copy" class="mr-1"></IconFontSymbol>
                    <span>设置</span>
                  </span>
                </el-col>
                <el-col :span="16">
                  <div class="h-full flex gap-[10px] text-[15px]/[60px] cursor-pointer">
                    <el-avatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" :size="36" class="my-[12px]"/>
                    <span class="inline-block h-[60px] max-w-[60px] text-ellipsis line-clamp-1">admin</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-header>
      <el-main class="bg-[#E8EFF7]">
        <slot />
      </el-main>
    </el-container>
  </el-container>
  <!-- <div class="absolute z-10 bottom-0 left-[250px]">
    <img src="../../public/animals.webp" alt="" class="w-[400px]">
  </div> -->
</template>

<script setup>
  import {useRouter } from 'vue-router'
  let router = useRouter()
</script>

<style scoped>
  ::v-deep .admin-menu .el-menu-item,
  ::v-deep .admin-menu .el-sub-menu__title {
    border-radius: 6px;
    margin: 0 8px;
    height: 50px;
  }
  ::v-deep .admin-menu .el-menu-item.is-active {      /* 调整激活时的背景颜色 */
    background-image: linear-gradient(to right,#6d8af2,#bf60ef);
  }
  ::v-deep .admin-menu{
    --el-menu-active-font-weight: 700;
  }
  /* 1. 一级菜单项激活时：图标颜色 */
  ::v-deep .admin-menu .el-menu-item.is-active .iconfont {
    color: white;
  }

  /* 3. 子菜单项激活时：图标颜色 */
  ::v-deep .admin-menu .el-sub-menu .el-menu .el-menu-item.is-active .iconfont {
    color: white;
  }

  /* 可选：未激活时的默认颜色（按需调整） */
  ::v-deep .admin-menu .el-menu-item .iconfont,
  ::v-deep .admin-menu .el-sub-menu__title .iconfont {
    color: rgb(168,177,194); /* 默认灰色 */
  }

  .el-tooltip__trigger:focus-visible {    /** 去除 focus 样式 */
    outline: none;
  }
</style>


