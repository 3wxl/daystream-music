<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">动态审核</span>
    <div class="flex mr-8">
      <el-tooltip content="通过所选的动态" v-if="state===0">
        <IconFontSymbol
          name="quanbutongguo"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-[0.3s] hover:text-[#529FFD] mr-4"
          @click="isShowReviewList = true"
        ></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="驳回所选动态" v-if="state===0">
        <IconFontSymbol
          name="quanbubohui"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"
          @click="isShowReviewListR = true"
        ></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="删除所选动态" v-if="state===1 || state === 2">
        <IconFontSymbol
          name="shanchu"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"
          @click="isShowDelList = true"
        ></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol
          name="refresh"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"
          @click="refresh"
        ></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <div class="h-[666px] bg-white rounded-[10px] flex items-center justify-center flex-col" v-show="dynamicList.length===0">
      <el-empty description="暂无数据" :image-size="200"/>
    </div>
    <el-table
      :data="dynamicList"
      stripe
      @selection-change="selectDynamicList"
      v-show="dynamicList.length!==0"
    >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="标题" width="280" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1 cursor-pointer text-[15px] hover:text-[#529FFD] duration-300" @click="openInNewTab(`/admin/communityManage/dynamicReviewDetail?id=${scope.row.id}`)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="280" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1 cursor-pointer hover:text-[#529FFD] duration-300" @click="openInNewTab(`/admin/communityManage/dynamicReviewDetail?id=${scope.row.id}`)">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="170" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.authorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="140" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发布时间" width="200" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.date }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="flex items-center justify-center gap-2">
            <span
              class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
              @click="isShowReview = true;nowPassId = scope.row.id"
              v-if="state===0"
            >
              <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="18px"></IconFontSymbol>
              通过
            </span>
            <span
              class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
              @click="isShowReject = true;nowPassId = scope.row.id"
              v-if="state===0"
            >
              <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
              驳回
            </span>
            <span
              class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
              @click="isShowDel = true;nowPassId = scope.row.id"
              v-if="state===1 || state === 2"
            >
              <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
              删除
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <AdminConfirm
      v-model="isShowReview"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#529FFD"
      title="操作确认"
      :content="`是否审核通过该动态？`"
      @confirmClick="passDynamic"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowReject"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否审核驳回该动态？`"
      @confirmClick="rejectDynamic"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowReviewList"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#529FFD"
      title="操作确认"
      :content="`是否审核通过所选动态？`"
      @confirmClick="passDynamicList"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowReviewListR"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#529FFD"
      title="操作确认"
      :content="`是否审核驳回所选动态？`"
      @confirmClick="rejectDynamicList"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowDel"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#529FFD"
      title="操作确认"
      :content="`是否删除该动态？`"
      @confirmClick="deleteDynamic"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowDelList"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#529FFD"
      title="操作确认"
      :content="`是否删除所选动态？`"
      @confirmClick="deleteDynamicList"
    ></AdminConfirm>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12" v-show="dynamicList.length!==0">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="total"
        :default-page-size="8"
        @current-change="pageSkip"
        @prev-click="preSkip"
        @next-click="nextSkip"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type {dynamicRevType} from "@/types/admin/dynamic"
  import {PassBatchApi,RejectBatchBatchApi} from "@/api/Admin/communtiy/dynamicReview";       // 批量通过动态\驳回动态
  import {DeleteDynamicListApi} from "@/api/Admin/communtiy/dynamicManage";       // 批量删除动态
  import { useRouter } from "vue-router";
  let router = useRouter()
  let props = defineProps<{
    dynamicList:Array<dynamicRevType>,
    total:number,
    state:number
  }>()
  let emit = defineEmits(['prePage', 'nextPage', 'clickPage','refresh_T','refresh'])

  let isShowReview = ref(false)
  let nowPassId = ref('')         // 当前点击的动态id
  let isShowReject = ref(false)     // 驳回动态
  let dynamicListId:string[] = []
  let isShowReviewList = ref(false) // 批量通过动态
  let isShowReviewListR = ref(false)  // 批量驳回动态
  let isShowDel = ref(false)      // 删除动态
  let isShowDelList = ref(false)  // 批量删除动态

  async function passDynamic(){       // 通过动态
    let res = await PassBatchApi([nowPassId.value])
    if(res.success){
      ElMessage.success('操作成功')
      isShowReview.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowReview.value = false
    }
  }
  async function rejectDynamic(){       // 驳回动态
    let res = await RejectBatchBatchApi([nowPassId.value])
    if(res.success){
      ElMessage.success('操作成功')
      isShowReject.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowReject.value = false
    }
  }
  async function passDynamicList(){       // 批量通过动态
    if(dynamicListId.length===0){
      ElMessage.error('请选择要操作的动态')
      isShowReviewList.value = false
      return
    }
    let res = await PassBatchApi([...dynamicListId])
    if(res.success){
      ElMessage.success('操作成功')
      isShowReviewList.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowReviewList.value = false
    }
  }
  async function rejectDynamicList(){       // 批量驳回动态
    if(dynamicListId.length===0){
      ElMessage.error('请选择要操作的动态')
      isShowReviewListR.value = false
      return
    }
    let res = await RejectBatchBatchApi([...dynamicListId])
    if(res.success){
      ElMessage.success('操作成功')
      isShowReviewListR.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowReviewListR.value = false
    }
  }
  function selectDynamicList(val:any[]){       // 批量操作动态
    dynamicListId.splice(0)       // 清空数组
    val.forEach(item => {
      dynamicListId.push(item.id)
    })
  }
  async function deleteDynamic(){       // 删除动态
    let res = await DeleteDynamicListApi([nowPassId.value])
    if(res.success){
      ElMessage.success('删除成功')
      isShowDel.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowDel.value = false
    }
  }
  async function deleteDynamicList(){       // 批量删除动态
    if(dynamicListId.length===0){
      ElMessage.error('请选择要删除的动态')
      isShowDel.value = false
      return
    }
    let res = await DeleteDynamicListApi([...dynamicListId])
    if(res.success){
      ElMessage.success('删除成功')
      isShowDel.value = false
      emit('refresh_T')
    }else{
      ElMessage.error('操作失败')
      isShowDel.value = false
    }
  }
  function preSkip(page:number){
    emit('prePage', page)
  }
  function nextSkip(page:number){
    emit('nextPage', page)
  }
  function pageSkip(page:number){
    emit('clickPage', page)
  }
  function refresh(){
    emit('refresh')
  }
  function openInNewTab(url: string) {      // 跳转
    window.open(url, '_blank');
  }
  onMounted(() => {
    document.querySelector('.el-pagination__goto').textContent = '跳转'
  })
</script>

<style scoped>

</style>
