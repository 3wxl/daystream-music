<!-- 用户管理内容区 -->
<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">用户管理</span>
    <div class="flex mr-4">
      <button class="Btn" @click="isAddUser = true">
        <div class="sign">+</div>
        <div class="text">添加</div>
      </button>
      <AddUser
        v-model="isAddUser"
        @addUser="addUser"
      />
      <el-tooltip content="删除所选用户">
        <IconFontSymbol @click="isShowDelList=true" name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol @click="refresh" name="refresh" class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <transition name="ttb" appear>
      <el-table :data="userData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" class="ml-3"/>
        <el-table-column label="头像" width="130" align="center">
          <template #default="scope">
            <div class="flex justify-center">
              <img :src="scope.row.avatar" alt="头像" class="object-cover m-1 w-[45px] h-[45px] rounded-[40px] outline-1.5 outline-offset-1 outline-solid outline-[#619ca4]">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template #default="scope">
            <span class="line-clamp-1 text-[16px] text-black">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="200" align="center">
          <template #default="scope">
            <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="120">
          <template #default="scope">
            <span
              class="cursor-pointer bg-[#c8f2d1] text-[#37D159] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
              v-show="scope.row.status==='1'"
              @click="banUser(scope.row.id)"
            >启用</span>
            <span
              class="cursor-pointer bg-[#ffd4cb] text-[#FF6746] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
              v-show="scope.row.status==='0'"
              @click="banUser(scope.row.id)"
            >禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template #default="scope">
            <span class="line-clamp-1">{{ scope.row.createdTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template #default="scope">
            <span
              class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
              @click="updateUserInfo(scope.row.id);updateId = scope.row.id;"
            >
              <IconFontSymbol name="xiugai" size="18px"></IconFontSymbol>
              修改
            </span>
            <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]" @click="isShowDel=true;nowId=scope.row.id">
              <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
    </transition>
    <AdminConfirm
      v-model="isShowDel"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除该用户？操作执行后将无法撤销。`"
      @confirmClick="DeleteUserFun"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isShowDelList"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除所选用户？操作执行后将无法撤销。`"
      @confirmClick="deleteSelect"
    ></AdminConfirm>
    <UpdateUserData
      v-model="isShowUpdate"
      :userInfo="nowUserInfo"
      :updateLoading="updateLoading"
      :updateId="updateId"
      @refresh="refresh"
    ></UpdateUserData>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="total"
        :default-page-size="8"
        @current-change="pageSkip"
        @prev-click="preSkip"
        @next-click="nextSkip"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {GetUserInfo,DeleteUser,BanUser,DeleteUsersApi} from '@/api/Admin/userManage'        // 获取用户信息、删除用户、封禁解封用户、批量删除用户
  import Message from '@/views/message.vue';
  // 添加用户
  let isAddUser = ref(false)      // 添加用户弹窗
  let isShowDel = ref(false)      // 删除用户弹窗
  let isShowUpdate = ref(false)   // 修改用户弹窗
  let isShowDelList = ref(false)  // 批量删除用户弹窗

  let props = defineProps<{userData:any,total:number}>()
  let emit = defineEmits(['prePage', 'nextPage','clickPage','addUser','refresh','deleteUser','deleteUsers'])

  let nowUserInfo = ref({
    avatar:'',
    createdTime:'',
    email:'',
    gender:'',
    id:1,
    introduction:'',
    role:'',
    username:'',
    vipExpireTime:'',
    walletBalance:0
  })
  let updateLoading = ref(true)
  let nowId = ref('')       // 当前可能选择的用户的id,删除的时候使用
  let updateId = ref('')    // 当前修改用户的Id
  let deleteUsers = reactive([])      // 批量删除用户

  async function updateUserInfo(id:string){               // 修改用户信息,这里仅作获取信息传递给对应修改用户信息组件
    updateLoading.value = true
    isShowUpdate.value = true
    let userInfo:any = await GetUserInfo(id)        // 第一步先获取该用户的信息
    if(userInfo.success){
      nowUserInfo.value = userInfo.data
      updateLoading.value = false
    }else{
      updateLoading.value = false
      isShowUpdate.value = false
      return
    }
  }
  async function DeleteUserFun(){         // 删除用户
    try{
      let deleteRes = await DeleteUser(nowId.value)
      if(deleteRes.success){
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        isShowDel.value = false
        emit('deleteUser')
      }else{
        ElMessage({
          message: '删除失败',
          type: 'error',
        })
      }
    }
    catch(err){
      Message.error('删除失败')
    }
  }
  async function banUser(userId:string){      // 封禁解封用户
    let banRes = await BanUser(Number(userId))
    if(banRes.success){
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
      emit('refresh')
    }else{
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
  }
  function handleSelectionChange(selection: any[]){
    deleteUsers.splice(0)
    selection.forEach(item => {
      deleteUsers.push(item.id)
    })
  }
  async function deleteSelect(){      // 删除所选用户
    if(deleteUsers.length === 0){
      ElMessage({
        message: '请选择要删除的用户',
        type: 'warning',
      })
      isShowDelList.value = false
      return
    }
    let deleteRes = await DeleteUsersApi(deleteUsers)
    if(deleteRes.success){
      ElMessage({
        message: '批量删除成功',
        type: 'success',
      })
      emit('deleteUsers',deleteUsers.length)
    }else{
      ElMessage({
        message: '操作失败',
        type: 'error',
      })
    }
    isShowDelList.value=false
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
  function addUser(){
    emit('addUser')
  }
  function refresh(){
    emit('refresh')
  }

</script>

<style scoped>
.ttb-leave-from{
  opacity: 0;
  translate: translateY(-10px);
}
.ttb-leave-to{
  opacity: 1;
  translate: translateY(0);
}
.ttb-leave-active{
  transition: 0.5s;
}
.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 38px;
  height: 36px;
  border-radius: calc(45px/2);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: .3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background: linear-gradient(144deg,#529FFD,#529FFD 50%,#417FCA);
  margin-right: 20px;
}

/* plus sign */
.sign {
  width: 100%;
  font-size: 1.5em;
  color: white;
  transition-duration: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  bottom: 2px;
}
/* text */
.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 15px;
  font-weight: 500;
  transition-duration: .3s;
}
/* hover effect on button width */
.Btn:hover {
  width: 115px;
  transition-duration: .3s;
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: .3s;
  padding-left: 15px;
}
/* hover effect button's text */
.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: .3s;
  padding-right: 15px;
}
/* button click effect*/
.Btn:active {
  transform: translate(2px ,2px);
}
</style>
