<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">动态管理</span>
    <div class="flex mr-8">
      <el-tooltip content="删除所选动态">
        <IconFontSymbol
          name="shanchu"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"
          @click="isShowDelList=true"
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
    <el-table
      :data="dynamicList"
      @selection-change="selectDynamicList"
      stripe
    >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="标题" width="260" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1 cursor-pointer text-[15px] hover:text-[#529FFD] duration-300" @click="openInNewTab(`/admin/communityManage/dynamicManageDetail?id=${scope.row.id}`)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="260" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1 cursor-pointer hover:text-[#529FFD] duration-300" @click="openInNewTab(`/admin/communityManage/dynamicManageDetail?id=${scope.row.id}`)">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="160" align="center" class="relative">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.authorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center" class="relative">
        <template #default="scope">
          <span
            class="cursor-pointer bg-[#c8f2d1] text-[#37D159] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
            v-show="scope.row.postStatus===0"
            @click="banDynamic(scope.row.id)"
          >启用</span>
          <span
            class="cursor-pointer bg-[#ffd4cb] text-[#FF6746] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
            v-show="scope.row.postStatus===2"
            @click="banDynamic(scope.row.id)"
          >禁用</span>
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
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="isUpdateDynamic=true;nowUpdateId = scope.row.id"
          >
            <IconFontSymbol name="xiugai" size="18px"></IconFontSymbol>
            编辑
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="nowDeleteDynamicId=scope.row.id;isShowDeleteDynamic=true"
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <AdminConfirm
      v-model="isShowDeleteDynamic"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除该动态？操作执行后将无法撤销。`"
      @confirmClick="deleteDynamic"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowDelList"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除所选动态？操作执行后将无法撤销。`"
      @confirmClick="deleteDynamicList"
    ></AdminConfirm>
    <UpdateDynamic
      v-model="isUpdateDynamic"
      :id="nowUpdateId"
    ></UpdateDynamic>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
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
  import {DeleteDynamicApi,DeleteDynamicListApi,UpdateDynamicStateApi} from '@/api/Admin/communtiy/dynamicManage'      // 删除动态,批量删除动态,修改动态状态
  import { handleCurrentChange } from 'element-plus/es/components/tree/src/model/util.mjs';
  import UpdateDynamic from '@/components/Admin/Community/DynamicManage/UpdateDynamic.vue'

  let props = defineProps<{
    dynamicList: any[],
    total: number
  }>()
  let emit = defineEmits(['prePage', 'nextPage', 'clickPage','refresh','credit','deleteDynamic','deleteDynamicList'])
  let router = useRouter();
  let isShowDeleteDynamic = ref(false)        // 删除动态弹窗显示状态
  let nowDeleteDynamicId = ref('')
  let isShowDelList = ref(false)
  let nowDeleteDynamicListId = reactive([])   // 批量删除动态id
  let isUpdateDynamic = ref(false)            // 修改动态弹窗显示状态
  let nowUpdateId:any = ref(-1)                   // 修改动态的id

  async function deleteDynamic(){       // 删除单个动态
    let deleteRes = await DeleteDynamicApi(nowDeleteDynamicId.value)
    if(deleteRes.success){
      ElMessage.success('删除成功')
      isShowDeleteDynamic.value = false
      emit('deleteDynamic')
    }else{
      ElMessage.error('删除失败')
    }
  }
  async function deleteDynamicList(){         // 批量删除动态
    if(nowDeleteDynamicListId.length===0){
      ElMessage.error('请选择要删除的动态')
      isShowDelList.value = false
      return
    }
    let deleteRes = await DeleteDynamicListApi([...nowDeleteDynamicListId])
    if(deleteRes.success){
      ElMessage.success('删除成功')
      isShowDelList.value = false
      emit('deleteDynamicList',nowDeleteDynamicListId.length)
    }else{
      ElMessage.error('删除失败')
    }
  }
  function selectDynamicList(val:any[]){
    nowDeleteDynamicListId.splice(0)
    val.forEach(item => {
      nowDeleteDynamicListId.push(item.id)
    })
  }
  async function banDynamic(id:string){
    let banRes = await UpdateDynamicStateApi(id)
    if(banRes.success){
      ElMessage.success('操作成功')
      emit('credit')
    }else{
      ElMessage.error('操作失败')
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
</script>

<style scoped>

</style>
