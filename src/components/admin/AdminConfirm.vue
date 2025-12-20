<template>
  <teleport :to="Teleport">
    <transition name="mask-fade">
      <div
        v-if="isShow"
        class="w-[100vw] h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.15)] flex justify-center items-center z-[10]"
        @click="isShow=false"
      >
        <transition name="dialog-fade" appear>
          <div
            v-show="isShow"
            :style="`width: ${width}`"
            class="min-h-10 rounded-[14px] bg-white p-[15px] px-[20px] shadow-lg"
            @click.stop
          >
            <div class="flex items-center">
              <IconFontSymbol :name="iconName" :color="iconColor" class="font-[600]" :size="iconSize"></IconFontSymbol>
              <span class="ml-2 font-[600] text-[20px]">{{ title }}</span>
            </div>
            <div class="mt-3">
              <p class="px-2" v-if="!isCustom">{{ content }}</p>
              <slot v-if="isCustom"></slot>
            </div>
            <div class="my-5" v-if="!isCustom">
              <div class="flex justify-end gap-5 mt-10">
                <button
                  type="button"
                  @click="isShow=false"
                  class="cancel-btn"
                >
                  取消
                </button>
                <button
                  type="button"
                  class="mr-14"
                  @click="emit('confirmClick')"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    required: false,
    default: '450px'
  },
  Teleport: {
    type: String,
    required: false,
    default: 'body',
  },
  iconName: {
    type: String,
    required: false
  },
  iconColor: {
    type: String,
    required: false,
    default: '#3991FD'
  },
  iconSize: {
    type: Number,
    required: false,
    default: 20
  },
  title: {
    type: String,
    required: false
  },
  isCustom: {
    type: Boolean,
    required: false,
    default: false
  },
  content: {
    type: String,
    required: false,
    default: 'prop:content没有使用'
  }
});
let emit = defineEmits(['confirmClick'])
const isShow = defineModel<boolean>({ required: true });
</script>

<style scoped>
/* 遮罩过渡：淡入淡出 */
.mask-fade-enter-from,
.mask-fade-leave-to {
  opacity: 0;
}
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.3s ease; /* 关键：过渡激活类，指定动画时长和缓动 */
}

/* 弹窗过渡：淡入淡出 + 缩放 */
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.95); /* 初始/结束状态：缩小且透明 */
}
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* 平滑的缓动曲线 */
}
button {
    padding: 5px 30px;
    border: 0;
    border-radius: 100px;
    background-color: #2ba8fb;
    color: #ffffff;
    font-weight: 700;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    font-size: 15px;
    cursor: pointer;
  }

  button:hover {
    background-color: #6fc5ff;
    box-shadow: 0 0 20px #6fc5ff50;
    transform: scale(1.05);
  }

  button:active {
    background-color: #3d94cf;
    transition: all 0.25s;
    -webkit-transition: all 0.25s;
    box-shadow: none;
    transform: scale(0.98);
  }
  .cancel-btn{
    background-color: #909399;
  }
  .cancel-btn:hover{
    background-color: #B1B3B8;
  }
  .cancel-btn:active{
    background-color: rgb(123, 125, 131);
  }
</style>
