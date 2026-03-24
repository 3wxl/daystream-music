<!-- 被举报评论的详情：举报人信息、被举报人信息、举报内容、举报时间、举报结果、举报内容来源 -->
<template>
  <AdminConfirm
    v-model="showReportDetail"
    width="700px"
    iconName="dongtaiguanli"
    iconColor="#76B0FD"
    title="举报详情"
    :isCustom="true"
  >
    <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
      <span class="text-[14px] text-gray-500">举报人信息：</span>
      <div class="flex items-center mb-3 mt-3 border-b pb-3 border-gray-200">
        <div class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-lg">
          <img :src="reportDetail.reporterAvatar" class="w-18 h-18 rounded-[44px]" alt="">
        </div>
        <div class="flex flex-col ml-3 gap-2">
          <span class="text-2xl font-bold text-gray-900">{{ reportDetail.reporterName }}</span>
          <span class="text-gray-500 text-[14px]">举报日期 : {{ reportDetail.createdTime }}</span>
        </div>
      </div>
      <span class="text-[14px] text-gray-500">举报内容：</span>
      <div class="mb-3 mt-3 border-b pb-3 border-gray-200">
        <div class="">
          <p class="ml-2 text-[13px] text-gray-500 mb-1">类型：</p>
          <el-radio-group v-model="reportTypeT" disabled>
            <el-radio value="1">色情低俗</el-radio>
            <el-radio value="2">违法信息</el-radio>
            <el-radio value="3">人身攻击</el-radio>
            <el-radio value="4">广告</el-radio>
            <el-radio value="5">侵权</el-radio>
          </el-radio-group>
        </div>
        <div class="mt-1">
          <p class="ml-2 text-[13px] text-gray-500">理由：</p>
          <p class="bg-pink-200/10 text-black text-[14px] line-clamp-4 indent-3 px-2 py-1 rounded-[8px] shadow-sm shadow-pink-300/20">{{ reportDetail.reportContent }}</p>
        </div>
      </div>
      <span class="text-[14px] text-gray-500">举报来源：</span>
      <div class="mb-3 mt-3 border-b pb-3 border-gray-200">
        <div class="">
          <p class="ml-2 text-[13px] text-gray-500 mb-1">类型：</p>
          <el-radio-group v-model="reportDetail.source" disabled>
            <el-radio :value="1">音乐</el-radio>
            <el-radio :value="2">歌单</el-radio>
            <el-radio :value="3">专辑</el-radio>
            <el-radio :value="4">动态</el-radio>
            <el-radio :value="5">mv</el-radio>
          </el-radio-group>
        </div>
        <div class="">
          <p class="ml-2 text-[13px] text-gray-500 mb-1">来源详情：</p>
          <div class="bg-pink-200/10 rounded-[10px] shadow-sm shadow-pink-400/10 p-[15px] hover:-translate-y-[1px] duration-300">
            <span class="text-[14px] text-pink-400">动态:</span>
            <p class="text-[15px] font-[700] text-gray-700 hover:text-pink-400 indent-1 duration-300 cursor-pointer">{{ reportDetail.title }}</p>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-4 pt-4">
        <button
          class="cursor-pointer px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
          @click="showReportDetail = false"
        >
          <IconFontSymbol name="fanhui1"/>
          <span>返回</span>
        </button>
      </div>
    </div>
    <div class="w-full h-full absolute top-0 left-0 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center" v-show="isUpdateLoading">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import {GetReportDetailApi} from '@/api/Admin/communtiy/commentReport'        // 获取举报详情
  let isUpdateLoading = ref(false)
  let showReportDetail = defineModel()
  let props = defineProps<{
    id:string,
    reportType:string
  }>()
  let reportTypeT = ref(props.reportType)
  let reportDetail = ref<any>({})
  watch(()=>props.id,async()=>{
    isUpdateLoading.value = true
    let detailRes:any = await GetReportDetailApi(props.id)
    if(detailRes.success){
      isUpdateLoading.value = false
      reportDetail.value = detailRes.data
    }else{
      ElMessage.error('获取该动态详情失败')
    }
  })
  watch(()=>props.reportType,(val)=>{
    reportTypeT.value = props.reportType
  })
</script>

<style scoped>
svg {
  width:5em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
  }

  circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
  }

  @keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
  }

  @keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
  }
  ::v-deep(.el-radio__inner::after){
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: #EF329A !important;
  }
</style>
