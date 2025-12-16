<template>
  <AdminConfirm
    v-model="isAddUser"
    width="780px"
    iconName="yonghushuliang"
    iconColor="#76B0FD"
    title="添加用户"
    :isCustom="true"
  >
    <div class="mt-6 relative">
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <el-form
          :model="addUserForm"
          ref="addUserRef"
          :rules="addUserRule"
        >
          <div class="flex mb-6">
            <el-form-item
              label="昵称:"
              label-width="80px"
              prop="username"
            >
              <el-input type="text" placeholder="请输入昵称" v-model="addUserForm.username"/>
            </el-form-item>
            <el-form-item
              label="邮箱:"
              label-width="100px"
              prop="email"
            >
              <el-input type="text" placeholder="请输入邮箱"  v-model="addUserForm.email"/>
            </el-form-item>
          </div>
          <div class="flex mb-6">
            <el-form-item
              label="密码:"
              label-width="80px"
              prop="password"
            >
              <el-input type="text" placeholder="请输入密码" v-model="addUserForm.password"/>
            </el-form-item>
            <el-form-item
              label="确认密码:"
              label-width="100px"
              prop="confirmPassword"
            >
              <el-input type="text" placeholder="请确认密码" v-model="addUserForm.confirmPassword"/>
            </el-form-item>
          </div>
          <div class="flex mb-6 border-b border-gray-200">
            <el-form-item
              label="简介:"
              label-width="80px"
              prop="introduction"
            >
              <el-input type="textarea" placeholder="请输入简介" v-model="addUserForm.introduction"/>
            </el-form-item>
          </div>
          <div class="flex justify-end gap-6">
            <button
              type="button"
              @click.prevent="addUser"
            >
                添加
            </button>
            <button
              type="button"
              @click.prevent="isAddUser = false"
              class="cancel-btn mr-10"
            >
                取消
            </button>
          </div>
        </el-form>
      </div>
      <div class="w-full h-full absolute top-0 left-0 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center" v-show="isAddLoading">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import {addUserRule} from '@/utils/rules/admin/admin'
  import {AddUser} from '@/api/Admin/userManage'
  let isAddUser = defineModel<boolean>()        // 添加用户弹窗是否显示
  let addUserRef = ref(null)
  let addUserForm = reactive({
    username:'',
    password:'',
    confirmPassword:'',
    email:'',
    introduction:''
  })
  let isAddLoading = ref(false)
  let emit = defineEmits(['addUser'])
  function addUser(){         // 添加用户
    isAddLoading.value = true
    addUserRef.value.validate()
    .then(async() => {
      try{
        let addUserRes = await AddUser(addUserForm)
        console.log(addUserRes)
        if(addUserRes.success){
          ElMessage({
            message: '添加成功',
            type: 'success',
          })
          isAddUser.value = false
          isAddLoading.value = false
          emit('addUser')
          clearForm()
        }else{
          isAddLoading.value = false
          ElMessage({
            message: '添加失败',
            type: 'warning',
          })
        }
      }
      catch(err){
        isAddLoading.value = false
        ElMessage({
          message: '添加用户失败',
          type: 'warning',
        })
      }
    })
    .catch(()=>{
      isAddLoading.value = false
      return false
    })
  }
  function clearForm(){
    addUserForm.confirmPassword = ''
    addUserForm.email = ''
    addUserForm.introduction = ''
    addUserForm.password = ''
    addUserForm.username = ''
  }
</script>

<style scoped>
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
