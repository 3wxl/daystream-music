<template>
  <AdminConfirm
    v-model="isShowUpdate"
    width="700px"
    iconName="yonghushuliang"
    iconColor="#76B0FD"
    title="修改信息"
    :isCustom="true"
  >
    <div class="px-2">
      <div class="flex mb-6 mt-2">
        <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
        <AdminInput v-model="UserName" class="ml-2 mr-5" type="text" placeholder="用户昵称" value="" width="w-[230px]" label="昵称:"></AdminInput>
        <AdminInput v-model="UserPassword" class="ml-2" type="text" placeholder="密码" value="Aa12345!" width="w-[230px]" label="密码:"></AdminInput>
      </div>
      <div class="flex mb-6 items-center">
        <IconFontSymbol name="xiaohuatuijianxuanzhong" color="red" size="18px"></IconFontSymbol>
        <AdminInput v-model="UserEmail" class="ml-2 mr-5" type="text" placeholder="用户邮箱" value="" width="w-[230px]" label="邮箱:"></AdminInput>
        <span class="mr-3 text-[16px] text-[#666] ml-2">状态:</span>
        <el-switch
          v-model="addStatus"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
      </div>
      <div class="flex items-start mb-2 mt-4">
        <label for="jj" class="mr-1 ml-[22px] text-[#666]">简介：</label>
        <textarea name="" id="jj" placeholder="用户简介" class="h-25 custom-scrollbar resize-none w-100 z-11 outline-none border-[#666] bg-[#E9F0FE] hover:bg-[#e4ecfd] focus:bg-[#dee9ff] rounded-[8px] px-[15px] py-[8px] text-[15px] text-[#666]"></textarea>
      </div>
      <div class="flex justify-end gap-3 mt-8 mb-3">
        <el-button type="primary" class="w-[85px]" @click="updateUser">
          <IconFontSymbol name="tianjia" class="mr-1"></IconFontSymbol>
          保存
        </el-button>
        <el-button type="default" class="mr-5 w-[80px]" @click="isShowUpdate = false">取消</el-button>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  let isShowUpdate = defineModel<boolean>()        // 添加用户弹窗是否显示

  let UserName = ref('')
  let UserPassword = ref('')
  let UserEmail = ref('')
  let addStatus = ref(true)
  function updateUser(){

  }
</script>

<style scoped>

</style>
