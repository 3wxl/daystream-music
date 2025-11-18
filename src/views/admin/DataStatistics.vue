<!-- /admin的页面 -->
<template>
  <div class="w-full">
    <div class="flex gap-8 flex-wrap max-[1600px]:gap-6">
      <UserNumDataCard></UserNumDataCard>
      <MusicianNumDataCard></MusicianNumDataCard>
      <SongsNumDataCard></SongsNumDataCard>
      <PlayListNumDataCard></PlayListNumDataCard>
    </div>
  </div>
  <div class="w-full mt-6 flex gap-8 max-[1600px]:gap-6">   <!-- flex-wrap关闭 -->
    <div class="flex-1">
      <SongsTypeAssign></SongsTypeAssign>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-3">
        <div class="shadow-md hover:-translate-y-[2px] duration-[0.3s] border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
          <div class="flex w-full">
            <div class="flex flex-col text-center ml-6">
              <div>
                <el-avatar :size="70"/>
              </div>
              <span class="text-[15px]">admin</span>
              <p class="text-[12px] text-[#666] whitespace-nowrap">上次登录时间：<span>2025-11-04</span></p>
            </div>
            <div class="ml-8 min-w-[170px]">
              <p class="text-15px text-[#888] font-[600]">
                代办事项：
              </p>
              <div class="ml-5 mt-2 text-[14px] text-[#525252]">
                <p>
                  <span class="inline-block px-[8px] py-[2px] rounded-[8px] text-white bg-[#3DD288]">1</span> 待审核歌曲:
                  <span class="ml-3" v-num-transform="210">0</span>
                </p>
                <p class=" my-3">
                  <span class="inline-block px-[8px] py-[2px] rounded-[8px] text-white bg-[#FAA184]">2</span> 待审核音乐人:
                  <span class="ml-3" v-num-transform="51">0</span>
                </p>
                <p>
                  <span class="inline-block px-[8px] py-[2px] rounded-[8px] text-white bg-[#72E0E0]">3</span> 待审核动态:
                  <span class="ml-3" v-num-transform="241">0</span>
                </p>
              </div>
            </div>
            <div class="ml-10 flex-1">
              <MyRecord></MyRecord>
            </div>
          </div>
        </div>
        <div class="shadow-md hover:-translate-y-[2px] duration-[0.3s] border-[#e4e7ed] bg-white rounded-[10px] p-[15px]">
          <p class="text-[14px] font-[600] text-[#868686]">日活曲线</p>
          <div class="mt-2 w-full h-[400px]">
            <DailyLife></DailyLife>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import UserNumDataCard from '@/components/admin/DataStatistics/UserNumDataCard.vue'
  import MusicianNumDataCard from '@/components/admin/DataStatistics/MusicianNumDataCard.vue'
  import SongsNumDataCard from '@/components/admin/DataStatistics/SongsNumDataCard.vue'
  import PlayListNumDataCard from '@/components/admin/DataStatistics/PlayListNumDataCard.vue'
  import SongsTypeAssign from '@/components/admin/DataStatistics/SongsTypeAssign.vue'
  import MyRecord from '@/components/admin/DataStatistics/MyRecord.vue'
  import DailyLife from '@/components/admin/DataStatistics/DailyLife.vue'
  function NumAutoPlusAnimation(targetEle, options) {
        options = options || {};
        let $this = targetEle,
            time = options.time || $this.data('time'), //总时间--毫秒为单位
            finalNum = options.num || $this.data('value'), //要显示的真实数值
            regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度
            step = finalNum / (time / regulator), /*每30ms增加的数值--*/
            count = 0, //计数器
            initial = 400;
        let timer = setInterval(function () {
            count = count + step;
            if (count >= finalNum) {
                clearInterval(timer);
                count = finalNum;
            }
            let t = Math.floor(count);
            if (t == initial) return;
            initial = t;
            $this.innerHTML = initial;
        }, 30);
    }
  const vNumTransform = {
    mounted(el,binding) {
      let options = {
        time: 2500,
        num: binding.value,
        regulator: 100,
      }
      NumAutoPlusAnimation(el, options)
    },
  }

</script>

<style scoped>

</style>





