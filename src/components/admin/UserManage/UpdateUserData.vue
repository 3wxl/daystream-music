<template>
  <AdminConfirm
    v-model="isShowUpdate"
    width="700px"
    iconName="yonghushuliang"
    iconColor="#76B0FD"
    title="修改信息"
    :isCustom="true"
  >
    <div class="mt-6 relative">
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <span class="text-[14px] text-gray-500">基本信息：</span>
        <div class="flex items-center mb-3 mt-3 border-b pb-4 border-gray-200">
          <div class="group w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-white shadow-lg">
            <img ref="avatar" :src="userInfo.avatar" class="w-18 h-18 rounded-[44px] object-cover" alt="">
            <input ref="avatarSelect" type="file" class="hidden">
            <div
              @click="updateAvatar"
              class="cursor-pointer opacity-0 w-18 h-18 absolute top-0 left-0 bg-gray-500/50 rounded-[36px] duration-500 group-hover:opacity-100 flex items-center justify-center"
            >
              <IconFontSymbol name="qunfengtouxiang" size="30px" class="font-bold text-white"/>
            </div>
          </div>
          <div class="flex flex-col ml-3 gap-2">
            <div>
              <input type="text" class="text-2xl font-bold text-gray-900 text-[22px] outline-none" ref="newUsername" :value="userInfo.username">
            </div>
            <div>
              <span class="text-gray-500 text-[14px]">简介：</span>
              <input type="text" class="text-2xl w-[400px] text-gray-500 text-[14px] outline-none" ref="newIntroduction" :value="userInfo.introduction">
            </div>
            <span class="text-gray-500 text-[12px]">创建时间：{{ userInfo.createdTime }}</span>
          </div>
        </div>
        <div class="mt-3 px-2 border-b pb-3 border-gray-200">
          <div>
            <span class="text-gray-800 font-bold text-[20px]">邮箱：</span>
            <span class="text-gray-600 text-[15px] font-[400] outline-none w-[500px]">{{ userInfo.email }}</span>
          </div>
        </div>
        <div class="mt-3 px-2 mb-3 border-b pb-3 border-gray-200">
          <p class="text-gray-800 font-bold text-[18px]">
            性别：
            <lebel class="text-[14px] text-gray-500 font-[400] align-middle mr-2">未指定</lebel>
            <input type="radio" class="align-middle mr-4" name="gender" :checked="userInfo.gender===0" :value="0">
            <span class="text-[14px] text-gray-500 font-[400] align-middle mr-2">男</span>
            <input type="radio" class="align-middle mr-4" name="gender" :checked="userInfo.gender===1" :value="1">
            <span class="text-[14px] text-gray-500 font-[400] align-middle mr-2">女</span>
            <input type="radio" class="align-middle" name="gender" :checked="userInfo.gender===2" :value="2">
          </p>
        </div>
        <span class="text-[14px] text-gray-500">vip情况：</span>
        <div class="px-2 mb-3 mt-3 border-b pb-4 border-gray-200">
          <div>
            <span class="text-gray-800 font-bold text-[18px]">音流数：</span>
            <input type="text" class="text-gray-600 text-[15px] font-[400] outline-none w-[500px]" ref="newWalletBalance" :value="userInfo.walletBalance">
          </div>
          <div class="mt-2">
            <span class="mt-2 text-gray-800 font-bold text-[18px]">会员情况：</span>
            <lebel class="text-[14px] text-gray-500 font-[400] align-middle mr-2">会员</lebel>
            <input type="radio" class="align-middle mr-4" name="vip" :checked="userInfo.isVip" :value="0">
            <span class="text-[14px] text-gray-500 font-[400] align-middle mr-2">非会员</span>
            <input type="radio" class="align-middle mr-4" name="vip" :checked="!userInfo.isVip" :value="1">
          </div>
          <div class="mt-2">
            <span class="text-gray-800 font-bold text-[18px] mr-2">会员到期时间:</span>
            <el-date-picker
              v-model="vipEndTime"
              type="date"
              :placeholder="userInfo.vipExpireTime?formatDateToIsoLikeString(new Date(userInfo.vipExpireTime)):'暂不是vip或未指定截止时间'"
              @change = "vipEndTimeChange"
            />
          </div>
        </div>
        <div class="flex justify-end gap-6">
          <button
            type="button"
            @click.prevent="updateUser"
          >
            保存
          </button>
          <button
            type="button"
            @click.prevent="isShowUpdate = false"
            class="cancel-btn mr-10"
          >
              取消
          </button>
        </div>
      </div>
      <div class="w-full h-full absolute top-0 left-0 bg-[rgba(255,255,255,0.3)] rounded-[8px] flex items-center justify-center" v-show="isAddLoading||updateLoading">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import {updateImage} from '@/api/community/ImageOperate'
  import {UpdateUserAPI} from '@/api/Admin/userManage'
  let isShowUpdate = defineModel<boolean>()        // 添加用户弹窗是否显示
  let isAddLoading = ref(false)
  let props = defineProps<{
    userInfo:any,
    updateLoading:boolean,
    updateId:string
  }>()
  let emit = defineEmits(['refresh'])
  let avatarSelect:any = ref(null)
  let avatar:any = ref(null)
  let newAvatar:any = ref()                 // 记录更新的头像
  let newUsername:any = ref(null)           // 新用户名
  let newIntroduction:any = ref(null)       // 新简介
  let newWalletBalance:any = ref(null)      // 新钱包余额
  let vipEndTime:any = ref(props.userInfo.vipExpireTime)                // vip到期时间
  watch(() => props.userInfo.vipExpireTime, (newVal) => {
    vipEndTime.value = newVal
  })
  function updateAvatar(){                  // 选择头像
    avatarSelect.value.click()
    avatarSelect.value.onchange = function(){
      let reader = new FileReader()
      reader.onload = function(){
        avatar.value.src = reader.result
      }
      reader.readAsDataURL(avatarSelect.value.files[0])
      newAvatar.value = avatarSelect.value.files[0]
    }
  }
  async function updateUser(){        // 更新用户信息
    isAddLoading.value = true
    let updateInfo = reactive({     // 用户信息，更新时更新这里面的数据
      id: props.updateId,
      username: props.userInfo.username,
      avatar: props.userInfo.avatar,
      introduction: props.userInfo.introduction,
      gender: props.userInfo.gender,
      walletBalance: props.userInfo.walletBalance,
    })
    updateInfo.username = newUsername.value.value         // 获取最新的信息
    updateInfo.introduction = newIntroduction.value.value
    updateInfo.walletBalance = newWalletBalance.value.value
    let genders = document.getElementsByName('gender')
    for(let i = 0; i < genders.length; i++){          // 性别值
      if(genders[i].checked){
        updateInfo.gender = Number(genders[i].value)
      }
    }
    let isVips = document.getElementsByName('vip')        // vip
    for(let i = 0; i < isVips.length; i++){
      if(isVips[i].checked){
        if(Number(isVips[i].value) === 0){
          // updateInfo.isVip = true
          if(!vipEndTime.value){
            ElMessage.warning('请选择会员到期时间')
            isAddLoading.value = false
            return
          }
          updateInfo.vipExpireTime = formatDateToIsoLikeString(new Date(vipEndTime.value))
        }
      }
    }
    let avatarForm
    if(newAvatar.value){
      avatarForm = new FormData()
      avatarForm.append('file', newAvatar.value)
    }
    try{
      if(newAvatar.value){
        let avatarRes = await updateImage(avatarForm)
        if(!avatarRes.success){
          ElMessage.error('头像上传失败')
          return
        }
        updateInfo.avatar = avatarRes.data
      }
      let updateRes =  await UpdateUserAPI(updateInfo)
      if(updateRes.success){
        ElMessage.success('修改用户信息成功')
        isAddLoading.value = false
        isShowUpdate.value = false
        emit('refresh')
      }
    }
    catch(err){
      isAddLoading.value = false
      ElMessage.error('修改用户信息失败')
    }
  }
  function vipEndTimeChange(){      // vip到期时间改变时判断
    let isVips = document.getElementsByName('vip')        // vip
    for(let i = 0; i < isVips.length; i++){
      if(isVips[i].checked){
        if(Number(isVips[i].value) !== 0){
          ElMessage.warning('请先更改vip状态，再进行时间修改')
          isAddLoading.value = false
          vipEndTime.value = ''
          return
        }
      }
    }
    let targetTime = new Date(vipEndTime.value).getTime()
    if(targetTime < Date.now()){
      ElMessage.warning('到期时间不能早于当前时间')
      vipEndTime.value = new Date()
    }
  }
  function formatDateToIsoLikeString(date = new Date()) {       // 时间格式化
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
</script>

<style scoped>
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
