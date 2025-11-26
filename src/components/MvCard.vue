<template>
  <div class="mv-card">
    <div
      v-for="mv in mvList"
      :key="mv.id"
      class="mv-card__item"
    >
      <div class="mv-card__thumb">
        <img :src="mv.cover" :alt="mv.title" />
        <div class="mv-card__overlay">
          <button class="mv-card__play">
            ▶
          </button>
          <span class="mv-card__duration">{{ mv.duration }}</span>
        </div>
      </div>
      <div class="mv-card__info">
        <p class="mv-card__title">{{ mv.title }}</p>
        <p class="mv-card__meta">
          {{ mv.artist }} · {{ mv.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import coverImage from '../assets/image.png';

const mvList = [
  {
    id: 1,
    title: '《快乐大本营》20200418期精彩回顾',
    artist: '快乐家族',
    date: '2020-04-18',
    duration: '04:36',
    cover: coverImage
  },
  {
    id: 2,
    title: '《快乐大本营》舞台精选',
    artist: '快乐家族',
    date: '2020-05-02',
    duration: '03:58',
    cover: coverImage
  }
];
</script>

<style lang="scss" scoped>
.mv-card {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  padding: 20px;
  border-radius: 12px;
}

.mv-card__item {
  background: #0f0f0f;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.6);
  }
}

.mv-card__thumb {
  position: relative;
  width: 100%;
  padding-top: 56%;
  background: #1a1a1a;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mv-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.9));
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;

  .mv-card__play {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .mv-card__duration {
    color: #ccc;
    font-size: 12px;
    letter-spacing: 0.5px;
  }
}

.mv-card__thumb:hover .mv-card__overlay {
  opacity: 1;
}

.mv-card__info {
  padding: 14px 16px 18px;
  color: #e3e3e3;
}

.mv-card__title {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 6px;
  color: #f5f5f5;
}

.mv-card__meta {
  font-size: 12px;
  color: #8a8a8a;
}
</style>
