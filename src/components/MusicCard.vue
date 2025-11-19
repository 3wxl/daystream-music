<template>
  <!--为了调试 还未routerlink 此处的to需要补全路径 应该指向List下的id页面同时这个应该占满全屏 -->
  <div :to="to" :class="['card',`card-${type}`]" :key="data.id">
     <img :src="data.imgUrl" :alt="data.alt" class="card-image">
            <div class="card-content">

                <div  v-if="type == 'recommend'">
                  <h3 class="title">每日推荐</h3>
                <ul class="song-list">
                    <li class="song-list-item" v-for="list in data.list" :key="list.id">{{ list.songName }}</li>
                </ul>
                <span class="album-title">{{ data.title }}</span>
                </div>

                <div v-else-if="type == 'album'">
                  <h2 class="album-main-title">{{ data.albumTitle }}</h2>
                </div>

                  <div v-else>
                  <span class="song-count">{{ data.songCount }}</span>
                  <span class="artist-name">{{ data.singerName }}</span>

                  <div class="play-button"></div>
                </div>
            </div>
          </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
defineProps({
  type:{
    type:String,
    required:true,
  },
  data:{
    type:Object,
    required: true,
  },
  // to对象传入的数据可能是组件的id值，但是在自动路由下需要补全路径
  to:{
    type: [String,Object]  as  PropType<RouteLocationRaw>,
    required:true
  }
  })


</script>

<style lang="scss" scoped>
/* * 1. 基础卡片样式 (所有卡片的公共部分)
         */
.card {
  /* 布局和尺寸 */
  display: block; /* a标签默认为inline，需要改为block */
  position: relative; /* 子元素定位的锚点 */
  aspect-ratio: 1 / 1; /* 保持1:1的正方形 */
  width: 100%;

  /* 视觉 */
  border-radius: 16px; /* 圆角 */
  overflow: hidden; /* 保证图片和内容不会超出圆角 */
  cursor: pointer;
  text-decoration: none; /* 去除a标签的下划线 */
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  /* 动画 */
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 卡片背景图 (所有卡片通用) */
.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保证图片铺满不变形 */
  z-index: 1;
  transition: transform 0.3s ease; /* hover时缩放 */
}

.card:hover .card-image {
  transform: scale(1.05); /* hover时图片轻微放大 */
}

/* 卡片内容容器 (所有卡片通用) */
.card-content {
  position: relative; /* 必须在图片之上 */
  z-index: 2; /* 确保内容在图片上层 */
  width: 100%;
  height: 100%;
  padding: 18px;
  box-sizing: border-box; /* 让padding不影响宽高 */

  /* 渐变遮罩，让白色文字更清晰 */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
}

/* * 2. 变体一：每日推荐 (G.E.M.)
         */
.card-recommend .card-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 内容从顶部开始 */
}

.card-recommend .title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.card-recommend .song-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-recommend .song-list-item {
  font-size: 16px;
  margin-bottom: 8px;
  /* 防止文字过长 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-recommend .album-title {
  position: absolute;
  bottom: 18px;
  left: 18px;
  font-size: 14px;
  font-weight: bold;
}

/* * 3. 变体二：歌单/专辑 (HEART MAID)
         */
.card-album .card-content {
  display: flex;
  align-items: flex-start; /* 水平居左 */
  justify-content: flex-start; /* 垂直居上 */
}

.card-album .album-main-title {
  font-size: 36px;
  font-weight: 900; /* 粗体 */
  margin: 0;
}

.card-album .album-main-title {
  opacity: 0;
  font-size: 36px;
  font-weight: 900; /* 粗体 */
  margin: 0;
}

/* * 4. 变体三：歌手 (林俊杰) - 带Hover效果
         */
.card-artist .card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 关键：让两个元素一个在顶一个在底 */
  align-items: stretch;
}

.card-artist .song-count {
  font-size: 20px;
  font-weight: bold;
  align-self: flex-start; /* 左上角 */
}

.card-artist .artist-name {
  font-size: 18px;
  font-weight: bold;
  align-self: flex-end; /* 右下角 */
}

/* 播放按钮 - 默认隐藏 (来自视频) */
.card-artist .play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 居中 */

  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%; /* 圆形 */

  /* flex居中画一个播放小三角 */
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0; /* 默认透明 */
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 播放小三角 */
.card-artist .play-button::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 0 10px 16px;
  border-color: transparent transparent transparent #333;
  margin-left: 3px; /* 修正视觉中心 */
}

/* 鼠标悬停时，显示播放按钮 */
.card:hover .play-button {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1); /* 出现时稍微放大 */
}

.card:hover .album-main-title {
  opacity: 1;
}

</style>
