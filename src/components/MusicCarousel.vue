<template>
        <el-carousel :interval="4000" type="card" height="320px" class="custom-carousel">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="carousel-item-content" :class="`carousel-bg-${item}`">
            <div class="glass-overlay">
              <h3 class="text-2xl font-bold text-white mb-2">Daydream Music</h3>
              <p class="text-white/80">探索无限音乐可能</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
</template>

<style lang="scss" scoped>
.custom-carousel {
  :deep(.el-carousel__item) {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    transition: transform 0.4s ease-in-out;
  }

  :deep(.el-carousel__mask) {
    background-color: #0b0f1b;
    opacity: 0.6;
  }
}

.carousel-item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
}

.glass-overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  padding: 20px 40px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-bg-1 {
  background-image: linear-gradient(135deg, #ff69b4 0%, #4b0082 100%);
}
.carousel-bg-2 {
  background-image: linear-gradient(135deg, #000000 0%, #ff1493 100%);
}
.carousel-bg-3 {
  background-image: linear-gradient(135deg, #191970 0%, #c71585 100%);
}
.carousel-bg-4 {
  background-image: linear-gradient(135deg, #800080 0%, #ffc0cb 100%);
}
</style>