<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">{{musicianType===0?'音乐人审核':musicianType===1?'已通过音乐人':'已驳回音乐人'}}</span>
    <div class="flex mr-8">
      <el-tooltip content="通过所选的音乐人申请" v-if="musicianType===0||musicianType===2">
        <IconFontSymbol name="quanbutongguo" @click="isShowSelectPass=true" class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-300 hover:text-[#529FFD] mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="驳回所选音乐人申请" v-if="musicianType===0">
        <IconFontSymbol name="quanbubohui" @click="isShowSelecetReject=true" class="text-[#666] font-700 relative top-[3px] cursor-pointer duration-300 hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <!-- <el-tooltip content="删除所选音乐人记录">
        <IconFontSymbol name="shanchu" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip> -->
      <el-tooltip content="刷新">
        <IconFontSymbol @click="emit('refresh')" name="refresh" class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>

  <div class="user-table w-full mt-4">
    <el-table v-if="musicianType===0" :data="musicianList_0" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" class="ml-3" />
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-[6px] object-cover">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="mr-3 active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showDetailFun(scope.row)"
          >
            <IconFontSymbol name="robot-3-line" size="18px"></IconFontSymbol>
            详情
          </span>
          <span
            class="mr-3 active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="nowPassId = scope.row.id; nowPassName = scope.row.nickname; isShowPass = true;"
          >
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="18px"></IconFontSymbol>
            通过
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="nowRejectId = scope.row.id; isShowRejectName=scope.row.nickname; isShowReject = true;"
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            驳回
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="musicianType===1" :data="musicianList_1" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-md object-cover">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入驻时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer text-[14px]"
            @click="showMusicianDetailFun(scope.row)"
          >
            <IconFontSymbol name="robot-3-line" size="18px"></IconFontSymbol>
            详情
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="musicianType===2" :data="musicianList_2" stripe @selection-change="handleSelectionChange2">
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center relative cursor-pointer">
            <img :src="scope.row.avatar" alt="头像" class="m-1 w-[50px] h-[50px] rounded-[6px] object-cover">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="艺名" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="240" align="center">
        <template #default="scope">
          <span class="line-clamp-2">{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250" align="center">
        <template #default="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="驳回时间" width="200" align="center">
        <template #default="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span class="text-[#529FFD] cursor-pointer" @click="showDetailFun(scope.row)">
            <IconFontSymbol name="robot-3-line" size="17px"></IconFontSymbol>
            详情
          </span>
          <span class="text-[#529FFD] cursor-pointer mx-2" @click="nowPassId=scope.row.id; nowPassName=scope.row.nickname; isShowPass=true;">
            <IconFontSymbol name="qianshoushenpitongguo-xianxing" size="17px"></IconFontSymbol>
            通过
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="total"
        :default-page-size="8"
        @current-change="(page) => emit('pageSkip',page)"
        @prev-click="(page) => emit('pageSkip',page)"
        @next-click="(page) => emit('pageSkip',page)"
      />
    </div>
  </div>
  <MusicianApplyCard
    v-model="showDetail"
    :musicianData="musicianData"
  >
  </MusicianApplyCard>
  <MusicianDetailCard
    v-model="showMusicianDetail"
    :musicianData="musicianData"
  >
  </MusicianDetailCard>
  <AdminConfirm
    v-model="isShowPass"
    width="470px"
    iconName="duigou"
    iconColor="rgb(118, 176, 253)"
    title="操作确认"
    :content="`是否通过--${nowPassName}--的音乐人申请？操作执行后可在音乐人列表中管理。`"
    @confirmClick="passMusician"
  ></AdminConfirm>
  <AdminConfirm
    v-model="isShowReject"
    width="470px"
    iconName="gongzuotai-dongtaishenhe"
    iconColor="#F72A33"
    title="操作确认"
    :content="`是否驳回--${isShowRejectName}--的音乐人认证申请？`"
    @confirmClick="rejectMusician"
  ></AdminConfirm>
  <AdminConfirm
    v-model="isShowSelectPass"
    width="470px"
    iconName="duigou"
    iconColor="rgb(118, 176, 253)"
    title="操作确认"
    :content="`是否通过选中的音乐人认证申请？通过后可在音乐人列表中管理。`"
    @confirmClick="passSelectMusician"
  ></AdminConfirm>
  <AdminConfirm
    v-model="isShowSelecetReject"
    width="470px"
    iconName="gongzuotai-dongtaishenhe"
    iconColor="#F72A33"
    title="操作确认"
    :content="`是否驳回选中的音乐人认证申请？`"
    @confirmClick="rejectSelectMusician"
  ></AdminConfirm>
  <AdminConfirm
    v-model="isShowSelecetPassReject"
    width="470px"
    iconName="gongzuotai-dongtaishenhe"
    iconColor="#F72A33"
    title="操作确认"
    :content="`是否通过选中的音乐人认证申请？`"
    @confirmClick="passRejectSelectMusician"
  ></AdminConfirm>
</template>

<script setup lang="ts">
  import {PassMusicianAuditApi,RejectMusicianAuditApi} from '@/api/Admin/musicianAudit'
  const props = defineProps({
    musicianType:{
      type: Number,
      default: 0
    },
    musicianList_0:{
      type: Array,
      default: []
    },
    musicianList_1:{
      type: Array,
      default: []
    },
    musicianList_2:{
      type: Array,
      default: []
    },
    total:{
      type: Number,
      default: 0
    },
  })
  const emit = defineEmits(['pageSkip', 'refresh'])
  // 数据

  let showDetail = ref(false)
  let showMusicianDetail = ref(false)
  let musicianData = ref({})
  let isShowPass = ref(false)           // 是否显示通过确认弹窗
  let nowPassId = ref('')             // 当前待通过的音乐人id
  let nowPassName = ref('')             // 当前待通过的音乐人名字
  let isShowReject = ref(false)         // 是否显示驳回确认弹窗
  let isShowRejectName = ref('')        // 当前待驳回的音乐人名字
  let nowRejectId = ref('')           // 当前待驳回的音乐人id
  let nowSelectIds:any = ref([])            // 当前选中的音乐人id列表
  let isShowSelectPass = ref(false)    // 是否显示批量通过确认弹窗
  let isShowSelecetReject = ref(false) // 是否显示批量驳回确认弹窗
  let isShowSelecetPassReject = ref(false) // 是否显示批量通过已驳回确认弹窗
  let passRejectedIds:any = ref([])           // 已驳回的音乐人被选中id列表


  // 方法
  function showDetailFun(obj:any){      // 对于未审核通过的音乐人，点击查看详情
    musicianData.value = obj
    showDetail.value = true
  }
  function showMusicianDetailFun(obj:any){      // 对于已审核通过的音乐人，点击查看详情
    musicianData.value = obj
    showMusicianDetail.value = true
  }
  async function passMusician(){       // 通过音乐人
    let res = await PassMusicianAuditApi([nowPassId.value])
    if(res.success){
      ElMessage.success('已通过该音乐人申请！')
      emit('refresh')
      isShowPass.value = false
    }else{
      ElMessage.error('通过失败，请稍后再试！')
      isShowPass.value = false
    }
  }
  async function rejectMusician(){       // 驳回音乐人
    let res = await RejectMusicianAuditApi([nowRejectId.value])
    if(res.success){
      ElMessage.success('已驳回该音乐人申请！')
      emit('refresh')
      isShowReject.value = false
    }else{
      ElMessage.error('驳回失败，请稍后再试！')
      isShowReject.value = false
    }
  }
  function handleSelectionChange(val:any){   // 选择框变化回调
    nowSelectIds.value = val.map((item:any)=>item.id)
  }
  function handleSelectionChange2(val:any){   // 已驳回列表选择框变化回调
    passRejectedIds.value = val.map((item:any)=>item.id)
  }
  async function passSelectMusician(){    // 批量通过音乐人
    if(nowSelectIds.value.length===0){
      ElMessage.warning('请先选择要通过的音乐人！')
      isShowSelectPass.value = false
      return
    }
    let res = await PassMusicianAuditApi(nowSelectIds.value)
    if(res.success){
      ElMessage.success('已通过所选音乐人申请！')
      emit('refresh')
      isShowSelectPass.value = false
    }else{
      ElMessage.error('通过失败，请稍后再试！')
      isShowPass.value = false
    }
  }
  async function passRejectSelectMusician(){
    if(passRejectedIds.value.length===0){
      ElMessage.warning('请先选择要通过的音乐人！')
      isShowSelectPass.value = false
      return
    }
    let res = await PassMusicianAuditApi(passRejectedIds.value)
    if(res.success){
      ElMessage.success('已通过所选音乐人申请！')
      emit('refresh')
      isShowSelectPass.value = false
    }else{
      ElMessage.error('通过失败，请稍后再试！')
      isShowPass.value = false
    }
  }
  async function rejectSelectMusician(){       // 批量驳回音乐人
    if(nowSelectIds.value.length===0){
      ElMessage.warning('请先选择要驳回的音乐人！')
      isShowSelecetReject.value = false
      return
    }
    let res = await RejectMusicianAuditApi(nowSelectIds.value)
    if(res.success){
      ElMessage.success('已驳回所选音乐人申请！')
      emit('refresh')
      isShowSelecetReject.value = false
    }else{
      ElMessage.error('驳回失败，请稍后再试！')
    }
  }
</script>

<style scoped>
::v-deep .admin-page .btn-prev{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-prev:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-prev .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .btn-next{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .btn-next:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .btn-next .el-icon{
    font-size: 16px;
    position: relative;
    left: 5px;
  }
  ::v-deep .admin-page .el-pager .number{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .number:hover{
    border-color: #0084ff;
  }
  ::v-deep .admin-page .el-pager .more{
    border: 1px solid #cecece;
    border-radius: 8px;
    color: #8e8e8e;
    background-color: rgb(255, 255, 255);
    font-family: Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif;
    width: 35px;
    height: 35px;
    text-align: center;
  }
  ::v-deep .admin-page .el-pager .more:hover{
    border-color: #0084ff;
  }
</style>
