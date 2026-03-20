<template>
  <AdminConfirm
    v-model="isUpdateDynamic"
    width="1100px"
    iconName="bianji"
    iconColor="#76B0FD"
    title="修改动态"
    :isCustom="true"
  >
    <div class="mt-6 relative">
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <div class="border-b border-gray-200 pb-4">
          <span class="text-[18px] font-[700] px-4 py-1 rounded-[18px] bg-[#CBF2D2] text-[#37D159]">标题:</span>
          <div class="relative">
            <input type="text" class="outline-none mt-3 w-[90%] text-[16px] px-2 py-1" placeholder="标题" v-model="DynamicData.title" @input="changeWords">
            <span class="absolute top-4 text-[14px] text-gray-500 right-0">{{ titleWords }} / 100</span>
          </div>
          <span class="text-red-500 text-[12px] hidden" ref="titleNull">标题内容不能为空</span>
          <span class="text-red-500 text-[12px] hidden">标题字数不能超过100字</span>
        </div>
        <div class="border-b border-gray-200 pb-4 mt-4">
          <span class="text-[18px] font-[700] px-4 py-1 rounded-[18px] bg-[#CBF2D2] text-[#37D159]">内容区:</span>
          <div class="w-full h-[500px] mt-4">
            <DynamicCreditor
              v-model="DynamicData"
            />
          </div>
        </div>
        <div class="flex justify-end gap-6 mt-4">
          <button
            type="button"
            @click.prevent="updateDynamic"
          >
            保存
          </button>
          <button
            type="button"
            @click.prevent="isUpdateDynamic = false;"
            class="cancel-btn mr-10"
          >
            取消
          </button>
        </div>
      </div>
      <div class="w-full h-full absolute top-0 left-0 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center" v-show="isUpdateLoading">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import DynamicCreditor from "@/components/Admin/Community/DynamicManage/DynamicCreditor.vue"
  import {GetDynamicDetailApi,UpdateDynamicDataApi} from '@/api/Admin/communtiy/dynamicManage'
  let props = defineProps<{
    id:any
  }>()

  let isUpdateDynamic = defineModel<boolean>()        // 添加用户弹窗是否显示
  let isUpdateLoading = ref(false)
  let titleNull = ref(null)
  let DynamicData = ref({      // 修改后的动态详情
    title:'',
    content:'',
  })
  let nowId = ref('')
  let titleWords = ref(0)
  watch(()=>props.id,async(newVal)=>{
    if(typeof newVal === 'string'){
      let detailRes:any = await GetDynamicDetailApi(newVal)
      if(detailRes.success){
        nowId.value = newVal
        DynamicData.value.title = detailRes.data.title
        DynamicData.value.content = detailRes.data.content
        titleWords.value = detailRes.data.title.length
      }else{
        isUpdateDynamic.value = false
        ElMessage.error('获取该动态详情失败')
      }
    }
  })
  async function updateDynamic(){
    if(DynamicData.value.title===''){
      titleNull.value.style.display = 'block'
      return
    }
    let data = {
      id:nowId.value,
      title:DynamicData.value.title,
      content:DynamicData.value.content,
    }
    let updateRes:any = await UpdateDynamicDataApi(data)
    if(updateRes.success){
      ElMessage.success('修改动态成功')
      isUpdateDynamic.value = false
    }else{
      ElMessage.error('修改动态失败')
    }
  }
  function changeWords(){
    titleWords.value = DynamicData.value.title.length
    if(titleWords.value > 100){
      titleWords.value = 100
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep(.el-input__wrapper){
    border-radius: 8px;
    padding: 4px 15px;
  }
  ::v-deep(.el-input__wrapper:hover){
    outline: none;
    border-color: rgba(234,76,137,0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
  }
  ::v-deep(.is-focus){
    outline: none;
    border-color: rgba(234,76,137,0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
  }
  ::v-deep(.el-input__inner){
    width: 210px;
  }
  ::v-deep(.el-textarea__inner){
    width: 580px;
    height: 100px;
    resize: none;
    border-radius: 8px;
  }
  ::v-deep(.el-textarea__inner:hover){
    outline: none;
    border-color: rgba(234,76,137,0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
    transition: 0.3s;
  }
  button {
    padding: 7px 35px;
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
</style>
