<template>
  <div :to="to" class="cover-card" :class="[`variant-${variant}`]">
    <div class="image-wrapper">
      <img :src="imgUrl" :alt="title" loading="lazy" />
    </div>

    <div class="card-content">
      <slot></slot>
      <div v-if="showPlayButton" class="play-button"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

// 定义Props接口
interface Props {
  imgUrl: string
  title?: string
  to: RouteLocationRaw
  variant?: 'default' | 'album' | 'recommend' | 'artist' //变体类名，用于控制布局
  showPlayButton?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  title: '',
})
</script>

<style lang="scss" scoped>
.cover-card {
  display: block;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transform: translateZ(0); /* 开启硬件加速 */
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

    .image-wrapper img {
      transform: scale(1.08);
    }

    .play-button {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
}

.image-wrapper {
  position: absolute;
  inset: 0; /* top/left/right/bottom: 0 的简写 */
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更高级的缓动 */
  }
}

.content-layer {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
  color: white;

  /* 默认布局：内容在底部 */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* --- 变体样式控制布局 --- */
/* 每日推荐：内容从上到下 */
.variant-recommend .content-layer {
  justify-content: flex-start;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1));
}

/* 歌手：两端对齐 */
.variant-artist .content-layer {
  justify-content: space-between;
}

/* 歌单/专辑：默认其实就是左上，但为了保险起见，或者未来有特殊 padding */
.variant-album .content-layer {
  justify-content: flex-start;
  align-items: flex-start;
}

/* 播放按钮样式 (保持你原有的逻辑，稍作优化) */
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px); /* 大厂常用的磨砂玻璃感 */
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;

  &::after {
    content: '';
    border-style: solid;
    border-width: 8px 0 8px 14px;
    border-color: transparent transparent transparent #000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -50%); /* 视觉居中修正 */
  }
}
</style>
