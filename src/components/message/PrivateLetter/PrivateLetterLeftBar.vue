<template>
  <div class="h-full overflow-y-auto custom-scrollbar overflow-hidden bg-[#121526]">
    <div class="flex items-center flex-1 w-[90%] mx-auto mt-2">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="input"
          type="text"
          placeholder="心动"
          class="text-[15px] w-full px-4 py-[6px] pl-10 bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full border border-gray-600 focus:outline-none focus:ring-1 focus:ring-pink-600 focus:border-transparent transition-all"
        />
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 text-[15px]"
        />
      </div>
    </div>
    <div class="mt-3">
      <p class="text-[12px] text-center text-gray-600">Messages</p>
      <ChatPartnerCard v-for="item,index in 5" :isActived="activedCharPartner===index" :key="index" :index="index" @updateActive="updateActive" @click="router.push(`/message/privateLetter/${index}`)"/>
      <p class="text-[14px] text-center text-gray-500">没有更多了~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import ChatPartnerCard from './ChatPartnerCard.vue'
  import {useRouter} from 'vue-router'

  let router = useRouter()
  let input = ref('')
  let activedCharPartner = ref(-1)

  function updateActive(index:number){
    activedCharPartner.value = index
  }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}
.slide-up-appear-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-up-appear-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-appear-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.flex-grow {
  flex-grow: 1;
}
</style>
