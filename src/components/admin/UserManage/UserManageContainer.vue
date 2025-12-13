<!-- 用户管理内容区 -->
<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">用户管理</span>
    <div class="flex mr-4">
      <button class="Btn" @click="isAddUser = true">
        <div class="sign">+</div>
        <div class="text">添加</div>
      </button>
      <AddUser v-model="isAddUser"/>
      <el-tooltip content="删除所选用户">
        <IconFontSymbol name="shanchu" class="font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol name="refresh" class="font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <el-table :data="userData" stripe >
      <el-table-column type="selection" width="55" align="center" class="ml-3"/>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <div class="flex justify-center">
            <img src="@/assets/头像.png" alt="头像" class="m-1 w-[45px] h-[45px] rounded-[40px] outline-1.5 outline-offset-1 outline-solid outline-[#619ca4]">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-[16px] text-black">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="200" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.emil }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template #default="scope">
          <span
            class="bg-[#c8f2d1] text-[#37D159] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
            v-show="scope.row.status"
          >启用</span>
          <span
            class="bg-[#ffd4cb] text-[#FF6746] rounded-[16px] py-1 px-[14px] border-[1px] border-solid border-transparent text-[11px] inline-block font-[700] text-center"
            v-show="!scope.row.status"
          >禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template #default="scope">
          <span class="line-clamp-1">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]" @click="isShowUpdate = true">
            <IconFontSymbol name="xiugai" size="18px"></IconFontSymbol>
            修改
          </span>
          <span class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]" @click="deleteUser">
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <AdminConfirm
      v-model="isShowDel"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除该用户？操作执行后将无法撤销。`"
    ></AdminConfirm>
    <UpdateUserData v-model="isShowUpdate"></UpdateUserData>
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :total="100"
        :default-page-size="7"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  // 添加用户
  let isAddUser = ref(false)      // 添加用户弹窗
  let isShowDel = ref(false)      // 删除用户弹窗
  let isShowUpdate = ref(false)   // 修改用户弹窗

  let props = defineProps<{userData:any}>()
  let emit = defineEmits([])
  function deleteUser(){
    isShowDel.value = true
  }

</script>

<style scoped>
/* From Uiverse.io by Yaya12085 */
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
