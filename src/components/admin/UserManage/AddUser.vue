<template>
  <AdminConfirm
    v-model="isAddUser"
    width="700px"
    iconName="yonghushuliang"
    iconColor="#76B0FD"
    title="添加用户"
    :isCustom="true"
  >
    <div class="px-2">
      <div class="flex mb-6 mt-2">
        <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
        <AdminInput v-model="newUserName" class="ml-2 mr-5" type="text" placeholder="新用户昵称" width="w-[230px]" label="昵称:"></AdminInput>
        <AdminInput v-model="newUserPassword" class="ml-2" type="text" placeholder="密码" width="w-[230px]" label="密码:"></AdminInput>
      </div>
      <div class="flex mb-6 items-center">
        <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
        <AdminInput v-model="newUserEmail" class="ml-2 mr-5" type="text" placeholder="新用户邮箱" width="w-[230px]" label="邮箱:"></AdminInput>
        <span class="mr-3 text-[16px] text-[#666] ml-2">状态:</span>
        <el-switch
          v-model="addStatus"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </div>
      <div class="flex items-start mb-2 mt-4">
        <label for="jj" class="mr-1 ml-[22px] text-[#666]">简介：</label>
        <textarea name="" id="jj" placeholder="新用户简介" class="h-25 custom-scrollbar resize-none w-100 z-11 outline-none border-[#666] bg-[#E9F0FE] hover:bg-[#e4ecfd] focus:bg-[#dee9ff] rounded-[8px] px-[15px] py-[8px] text-[15px] text-[#666]"></textarea>
      </div>
      <div class="flex justify-end gap-3 mt-8 mb-3">
        <el-button type="primary" class="w-[85px]" @click="addUser">
          <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
          添加
        </el-button>
        <el-button type="default" class="mr-5 w-[80px]" @click="isAddUser = false">取消</el-button>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  let isAddUser = defineModel<boolean>()        // 添加用户弹窗是否显示

  let newUserName = ref('')
  let newUserPassword = ref('')
  let newUserEmail = ref('')
  let addStatus = ref(true)

  function addUser(){         // 添加用户

  }
</script>

<style scoped>

</style>
