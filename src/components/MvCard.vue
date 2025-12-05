<template>
  <div class="mv-card">
    <div class="mv-card__thumb">
      <img :src="imgUrl" :alt="title" loading="lazy" />
      <div class="mv-card__overlay">
        <button class="mv-card__play">
          <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <span class="mv-card__duration">{{ duration }}</span>
      </div>
    </div>
    <div class="mv-card__info">
      <h3 class="mv-card__title" :title="title">{{ title }}</h3>
      <p class="mv-card__author">{{ author }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  imgUrl: string
  title: string
  author: string
  duration: string
}>()
</script>

<style lang="scss" scoped>
.mv-card {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(30, 30, 35, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(40, 40, 45, 0.8);

    .mv-card__thumb {
      img {
        transform: scale(1.08);
      }

      .mv-card__overlay {
        opacity: 1;
        backdrop-filter: blur(2px);
      }

      .mv-card__play {
        transform: scale(1);
        opacity: 1;
      }
    }

    .mv-card__title {
      color: #fff;
    }
  }
}

.mv-card__thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 16px; // Match card border radius for inner content

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.mv-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.mv-card__play {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  .play-icon {
    width: 28px;
    height: 28px;
    margin-left: 4px; // Optical adjustment
  }

  &:hover {
    background: #ec4899; // Pink accent color
    border-color: #ec4899;
    transform: scale(1.1) !important;
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
  }
}

.mv-card__duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.mv-card__info {
  padding: 16px;
}

.mv-card__title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.mv-card__author {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ec4899;
  }
}
</style>
