<template>
  <teleport :to="Teleport">
    <transition name="leave">
      <div v-show="isShow" class="w-[100vw] h-[100vh] fixed top-0 left-0 bg-[rgba(0,0,0,0.12)] flex justify-center items-center z-[9999]" @click="isShow=false">
        <transition name="el-zoom-in-top" appear>
          <div v-show="isShow" :style="`width: ${width}`" class="min-h-10 rounded-[14px] bg-white p-[15px] px-[20px]" @click.stop>
            <div class="flex items-center">
              <IconFontSymbol :name="iconName" :color="iconColor" class="font-[600]" :size="iconSize"></IconFontSymbol>
              <span class="ml-2 font-[600] text-[20px]">{{ title }}</span>
            </div>
            <div class="mt-3">
              <p class="px-2" v-if="!isCustom">{{ content }}</p>
              <slot v-if="isCustom"></slot>
            </div>
            <div class="my-5" v-if="!isCustom">    <!-- 操作区 -->
              <div class="flex justify-end gap-10">
                <el-button @click="isShow=false" class="w-[90px]">
                  <span class="text-[15px]">取消</span>
                </el-button>
                <el-button type="primary" @click="isShow=false" class="mr-4 w-[90px]">
                  <span class="text-[15px]">确定</span>
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { setTimeout } from 'timers/promises';

  let props = defineProps({
    width:{
      type: String,
      required: false,
      default: '450px'
    },
    Teleport:{
      type: String,
      required: false,
      default: 'body',
    },
    iconName:{
      type: String,
      required: true
    },
    iconColor:{
      type: String,
      required: false,
      default: '#3991FD'
    },
    iconSize:{
      type: Number,
      required: false,
      default: '20px'
    },
    title:{
      type: String,
      required: true
    },
    isCustom:{
      type: Boolean,
      required: false,
      default: false
    },
    content:{
      type: String,
      required: false,
      default: 'prop:content没有使用'
    }
  });
  let isShow = defineModel<boolean>({ required: true });
</script>

<style scoped>
  .dialog-fade-enter-active {
    animation: test 0.3s;
  }

  .dialog-fade-leave-active {
    animation: test 0.3s reverse;
  }
  @keyframes test{
    from{
        opacity: 0;
        transform: translateX(-100%);
    }
    to{
        opacity: 1;
        transform: translateX(0);
    }
  }
  .leave-leave{
    transition: all 0.3s;
    opacity: 1;
  }
  .leave-leave-to{
    opacity: 0;
  }
</style>
