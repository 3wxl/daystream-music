<!-- 聊天内容区 -->
<template>
  <div class="relative h-full w-full">
    <div ref="chatContentScroll" class="w-full overflow-hidden overflow-y-auto custom-scrollbar flex flex-col-reverse py-[10px]" style="height: calc(100% - 143px);">
      <ChatContentCard v-for="charItem in chatList" :key="charItem.id" :charItem="charItem"></ChatContentCard>
      <p class="text-[14px] text-[#e5e7eb] text-center">没有更多内容了</p>
    </div>
    <!-- 底部输入框 -->
    <div class="absolute bottom-0 left-0 w-full px-[10px] bg-gray-800/70 border border-white/10 rounded-2xl">
      <textarea v-model="words" placeholder="请输入聊天内容~" class="h-20 text-[white] w-full  py-3 pb-2 px-2 text-sm focus:outline-none focus:border-pink-400/50 resize-none transition-all duration-300 placeholder-gray-500 backdrop-blur-sm group-hover:border-pink-400/40" id=""></textarea>
      <div class="mb-4 flex justify-between items-center">
        <span class="text-[15px] text-[#e5e7eb] ml-3">0/200</span>
        <div>
          <IconFontSymbol name="icon1" class="mr-5 text-[#e5e7eb] cursor-pointer hover:text-pink-500 duration-300" size="24px"/>
          <button type="button" class="button w-[100px] h-[40px]" :class="words===''?'cursor-not-allowed':'cursor-pointer'">
            <span class="fold"></span>
            <div class="points_wrapper">
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
              <i class="point"></i>
            </div>
            <span class="inner">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              >
                <polyline
                  points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
                ></polyline>
              </svg>发送</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  let props = defineProps(['id'])     // 私聊Id,用于获取该私聊的聊天记录等信息
  let words = ref('')
  let chatList = reactive([     // 当id变换的时候更新
    {
      id:1,
      type:1,   // 1:文字  2:图片
      isSelf:true,    // 是否是自己发送的
      content:'我发送的内容',
      time:'2022-03-01 12:00:00',
      sendUserAvatar:'https://picsum.photos/200/300'     // 发送者头像
    },
    {
      id:2,
      type:1,   // 1:文字  2:图片
      isSelf:false,    // 是否是自己发送的
      content:'发送内容',
      time:'2022-03-01 12:00:00',
      sendUserAvatar:'https://picsum.photos/200/300'     // 发送者头像
    },
    {
      id:3,
      type:2,   // 1:文字  2:图片
      isSelf:true,    // 是否是自己发送的
      content:'https://picsum.photos/200/300',
      time:'2022-03-01 12:00:00',
      sendUserAvatar:'https://picsum.photos/200/300'     // 发送者头像
    },
    {
      id:4,
      type:2,   // 1:文字  2:图片
      isSelf:false,    // 是否是自己发送的
      content:'https://picsum.photos/200/300',
      time:'2022-03-01 12:00:00',
      sendUserAvatar:'https://picsum.photos/200/300'     // 发送者头像
    }
  ])
  let chatContentScroll = ref(null)   // 聊天内容区滚动

  function scrollToBottom() {   // 滚动到最底部
    chatContentScroll.value.scrollTop = chatContentScroll.value.scrollHeight
  }
  onMounted(()=>{
    scrollToBottom()
  })
</script>

<style>
/* From Uiverse.io by ilkhoeri */
.button {
  --h-button: 48px;
  --w-button: 102px;
  --round: 0.75rem;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.25s ease;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
  border-radius: var(--round);
  border: none;
  outline: none;
  padding: 12px 18px;
}
.button::before,
.button::after {
  content: "";
  position: absolute;
  inset: var(--space);
  transition: all 0.5s ease-in-out;
  border-radius: calc(var(--round) - var(--space));
  z-index: 0;
}
.button::before {
  --space: 1px;
  background: linear-gradient(
    177.95deg,
    rgba(255, 255, 255, 0.19) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.button::after {
  --space: 2px;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
}
.button:active {
  transform: scale(0.95);
}

.fold {
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  height: 1rem;
  width: 1rem;
  display: inline-block;
  transition: all 0.5s ease-in-out;
  background: radial-gradient(
    100% 75% at 55%,
    rgba(223, 113, 255, 0.8) 0%,
    rgba(223, 113, 255, 0) 100%
  );
  box-shadow: 0 0 3px black;
  border-bottom-left-radius: 0.5rem;
  border-top-right-radius: var(--round);
}
.fold::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 150%;
  height: 150%;
  transform: rotate(45deg) translateX(0%) translateY(-18px);
  background-color: #e8e8e8;
  pointer-events: none;
}
.button:hover .fold {
  margin-top: -1rem;
  margin-right: -1rem;
}

.points_wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.points_wrapper .point {
  bottom: -10px;
  position: absolute;
  animation: floating-points infinite ease-in-out;
  pointer-events: none;
  width: 2px;
  height: 2px;
  background-color: #fff;
  border-radius: 9999px;
}
@keyframes floating-points {
  0% {
    transform: translateY(0);
  }
  85% {
    opacity: 0;
  }
  100% {
    transform: translateY(-55px);
    opacity: 0;
  }
}
.points_wrapper .point:nth-child(1) {
  left: 10%;
  opacity: 1;
  animation-duration: 2.35s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(2) {
  left: 30%;
  opacity: 0.7;
  animation-duration: 2.5s;
  animation-delay: 0.5s;
}
.points_wrapper .point:nth-child(3) {
  left: 25%;
  opacity: 0.8;
  animation-duration: 2.2s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(4) {
  left: 44%;
  opacity: 0.6;
  animation-duration: 2.05s;
}
.points_wrapper .point:nth-child(5) {
  left: 50%;
  opacity: 1;
  animation-duration: 1.9s;
}
.points_wrapper .point:nth-child(6) {
  left: 75%;
  opacity: 0.5;
  animation-duration: 1.5s;
  animation-delay: 1.5s;
}
.points_wrapper .point:nth-child(7) {
  left: 88%;
  opacity: 0.9;
  animation-duration: 2.2s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(8) {
  left: 58%;
  opacity: 0.8;
  animation-duration: 2.25s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(9) {
  left: 98%;
  opacity: 0.6;
  animation-duration: 2.6s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(10) {
  left: 65%;
  opacity: 1;
  animation-duration: 2.5s;
  animation-delay: 0.2s;
}

.inner {
  z-index: 2;
  gap: 6px;
  position: relative;
  width: 100%;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s ease-in-out;
}

.inner svg.icon {
  width: 18px;
  height: 18px;
  transition: fill 0.1s linear;
}

.button:focus svg.icon {
  fill: white;
}
.button:hover svg.icon {
  fill: transparent;
  animation:
    dasharray 1s linear forwards,
    filled 0.1s linear forwards 0.95s;
}
@keyframes dasharray {
  from {
    stroke-dasharray: 0 0 0 0;
  }
  to {
    stroke-dasharray: 68 68 0 0;
  }
}
@keyframes filled {
  to {
    fill: white;
  }
}

</style>
