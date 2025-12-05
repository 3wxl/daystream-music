<template>
  <div class="custom-wrapper h-[320px] w-[260px] text-pink-300 font-sans perspective-[800px]">
    <div
      class="profile-card w-full h-full bg-black rounded-[2rem] relative transition-transform duration-1500 transform-style-preserve-3d"
    >
      <!-- =======================
           正面
      ======================== -->
      <div
        class="card-front h-full w-full rounded-[2rem] shadow-[0px_0px_12px_6px_rgba(255,113,151)] absolute backface-hidden flex flex-col items-center justify-center gap-3 px-4"
      >
        <!-- 头像（不再上移） -->
        <img
          :src="avatar"
          class="h-24 w-24 rounded-full object-cover border-4 border-pink-300 shadow-lg"
        />

        <!-- 名字 -->
        <p class="text-[24px] font-bold text-pink-200">{{ name }}</p>

        <!-- 标签 -->
        <p class="text-base opacity-80 text-pink-300">{{ tag }}</p>

        <!-- 简短介绍 -->
        <p class="text-sm text-center max-w-[180px] opacity-70 leading-tight text-pink-300">
          {{ shortDesc }}
        </p>
      </div>

      <!-- =======================
           背面
      ======================== -->
      <div
        class="card-back h-full w-full rounded-[2rem] shadow-[0px_0px_12px_6px_rgba(255,182,193,0.8)] absolute backface-hidden flex flex-col items-center justify-start gap-3 bg-black transform rotate-x-180 rotate-z-180 p-6 text-pink-300"
      >
        <!-- 标题 -->
        <p class="text-[22px] font-bold mt-2 text-pink-200">{{ backTitle }}</p>

        <!-- 详细介绍 -->
        <p class="text-sm text-center opacity-80 leading-snug text-pink-300 px-1">
          {{ description }}
        </p>

        <!-- 粉色分隔线 -->
        <div class="w-1/2 h-[1px] bg-pink-400 my-1 opacity-50"></div>

        <!-- 调整后的图片：更靠上、居中、变小 -->
        <div class="icons flex flex-row gap-5 mt-1">
          <img
            src="../../assets/微信图片_20251129094823_15_2.jpg.png"
            alt=""
            class="translate-y-[-6px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: '夜色音乐人' },
  tag: { type: String, default: 'Electronic / Indie Pop' },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80',
  },
  shortDesc: {
    type: String,
    default: '来自夜色城市的电子独立音乐人',
  },
  description: {
    type: String,
    default:
      '夜色电子独立音乐人，作品融合合成器与城市氛围。代表作《Midnight Echo》《Lost in Light》。擅长编曲、制作、混音。',
  },
  backTitle: { type: String, default: '关于我' },
})
</script>

<style lang="scss" scoped>
.custom-wrapper {
  perspective: 800px;
}
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-x-180 {
  transform: rotateX(180deg);
}
.rotate-z-180 {
  transform: rotateZ(-180deg);
}
.custom-wrapper:hover > .profile-card {
  cursor: pointer;
  transform: rotateX(180deg) rotateZ(-180deg);
}
.card-back {
  transform: rotateX(180deg) rotateZ(-180deg);
}
</style>
