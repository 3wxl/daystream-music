<template>
  <div class="min-h-screen text-white flex flex-col items-center py-16 px-4">
    <!-- 标题区域保持不变 -->
    <div class="text-center mb-16 max-w-5xl">
      <h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4 relative inline-block">
        在白昼音流 遇见亿万听众
        <span class="absolute -bottom-2 left-0 w-full h-0.5 bg-[#E60076]"></span>
      </h1>
      <p class="text-gray-500 text-lg mt-6">覆盖白昼音流产品平台流量，让每位音乐人都有听众</p>
    </div>

    <!-- 特性卡片区域：icon 属性改为 Iconfont 的图标名 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
      <MusicProCard
        icon="shuidi"
        title="获得亿级曝光"
        description="每首歌都会经过抖音算法推荐获得冷启动流量，数据表现优秀的歌曲，可进入抖音顶级宣推计划"
        :index="0"
      />

      <MusicProCard
        icon="yonghu"
        title="收获属于你的粉丝"
        description="专为音乐人打造的宣推工具，帮助你找到你的听众"
        :index="1"
      />

      <MusicProCard
        icon="diqiu"
        title="作品被全世界听到"
        description="自主发行全球超200+国家和地区，涵盖全面的播放渠道"
        :index="2"
      />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
