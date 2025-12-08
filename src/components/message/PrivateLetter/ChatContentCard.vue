<!-- 聊天内容区 -->
<template>
  <transition name="chat-in-ri" appear>
    <div v-if="type===1&&isSelf" class="flex">
      <div class="ml-auto relative mr-3 mt-4">
        <div class="bg-gradient-to-br from-pink-800/20 to-pink-900/20 rounded-2xl rounded-tr-none p-5 border border-white/10 shadow-xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <p class="text-white text-[15px]/[28px] leading-relaxed relative z-10 whitespace-pre-line max-w-[700px]">
            {{ content }}
          </p>
          <div class="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-pink-800/20 to-pink-900/20 border-r border-b border-white/10 transform -rotate-45"></div>
        </div>
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 justify-end mr-4">
          <IconFontSymbol name="shijian" size="17px"/>
          <span>{{ time }}</span>
        </div>
      </div>
      <div class="mr-5 w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-lg">
        <img class="w-full h-full rounded-[28px]" :src="sendUserAvatar" alt="">
      </div>
    </div>
  </transition>
  <transition name="chat-in-le" appear>
    <div v-if="type===1&&!isSelf" class="flex">
      <div class="ml-5 w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-lg">
        <img class="w-full h-full rounded-[28px]" :src="sendUserAvatar" alt="">
      </div>
      <div class="relative ml-3 mt-4">
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl rounded-tl-none p-5 border border-white/10 shadow-xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <p class="text-white text-[15px]/[28px] leading-relaxed relative z-10 whitespace-pre-line max-w-[700px]">
            {{ content }}
          </p>
          <div class="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 border-r border-b border-white/10 transform -rotate-45"></div>
        </div>
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 mr-4">
          <IconFontSymbol name="shijian" size="17px"/>
          <span>{{ time }}</span>
        </div>
      </div>
    </div>
  </transition>
  <transition name="chat-in-ri" appear>
    <div v-if="type===2&&isSelf" class="flex">
      <div class="ml-auto relative mr-3 mt-4">
        <img class="object-cover max-w-[700px] rounded-[12px]" :src="content" alt="图片">
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500 justify-end mr-4">
          <IconFontSymbol name="shijian" size="17px"/>
          <span>{{ time }}</span>
        </div>
      </div>
      <div class="mr-5 w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-lg">
        <img class="w-full h-full rounded-[28px]" :src="sendUserAvatar" alt="">
      </div>
    </div>
  </transition>
  <transition name="chat-in-le" appear>
    <div v-if="type===2&&!isSelf" class="flex">
      <div class="ml-5 w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-lg">
        <img class="w-full h-full rounded-[28px]" :src="sendUserAvatar" alt="">
      </div>
      <div class="relative ml-3 mt-4">
        <img class="object-cover max-w-[700px] rounded-[12px]" :src="content" alt="图片">
        <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <IconFontSymbol name="shijian" size="17px"/>
          <span>{{ time }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
  let props = defineProps({
    charItem:{
      type:Object,
      default:()=>{}
    }
  })
  let {id,type,isSelf,content,time,sendUserAvatar} = toRefs(props.charItem)
</script>

<style>
  .chat-in-le-enter-from{
    transform: translateX(-100px);
    opacity: 0;
  }
  .chat-in-le-enter-to{
    transform: translateX(0);
    opacity: 1;
  }
  .chat-in-le-enter-active{
    transition: all 0.8s cubic-bezier(.52,.09,.58,1.08);
  }
  .chat-in-ri-enter-from{
    transform: translateX(100px);
    opacity: 0;
  }
  .chat-in-ri-enter-to{
    transform: translateX(0);
    opacity: 1;
  }
  .chat-in-ri-enter-active{
    transition: all 0.8s cubic-bezier(.52,.09,.58,1.08);
  }
</style>
