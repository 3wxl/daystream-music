<template>
  <div class="flex justify-between">
    <span class="text-[18px] font-700 ml-2">评论管理</span>
    <div class="flex mr-8">
      <el-tooltip content="删除所选评论">
        <IconFontSymbol
          name="shanchu"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-red-700 mr-4"
          @click="isDeleteArr=true"
        ></IconFontSymbol>
      </el-tooltip>
      <el-tooltip content="刷新">
        <IconFontSymbol
          name="refresh"
          class="text-[#666] font-700 relative top-[3px] cursor-pointer hover:text-[#529FFD] mr-2"
          @click="emit('refresh')"
        ></IconFontSymbol>
      </el-tooltip>
    </div>
  </div>
  <div class="user-table w-full mt-4">
    <el-table
      :data="commentDataList"
      stripe
      @selection-change="handeleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" class="ml-3" />
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <!-- <img :src="scope.row.avatar" alt="用户头像"> -->
          <div class="flex justify-center">
            <img
              :src="scope.row.avatar"
              alt="头像"
              class="m-1 w-[45px] h-[45px] rounded-[40px] outline-1.5 outline-offset-1 outline-solid outline-[#619ca4]"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="170" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论" width="250" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="type === 1 ? '评论歌曲' : type === 2 ? '评论歌单' : type === 3 ? '评论专辑' : '评论动态'"
        width="320"
        align="center"
      >
        <template #default="scope">
          <span class="line-clamp-1 text-[15px] text-black">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="200" align="center">
        <template #default="scope">
          <span class="line-clamp-1 text-[15px] text-black">{{ formatDateTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#bfdcff] inline-block bg-[#e0eeff] text-[#529FFD] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="
              isUpdateComment=true;
              nowUpdateCommentId=scope.row.id;
              nowUpdateCommentContent=scope.row.content
            "
          >
            <IconFontSymbol name="xiugai" size="18px"></IconFontSymbol>
            修改
          </span>
          <span
            class="active:scale-[0.97] duration-150 hover:shadow-xl hover:shadow-[#ffbfbf] inline-block bg-[#ffe0e0] text-[#fd5252] py-[3px] rounded-[20px] px-[12px] cursor-pointer mr-4 text-[15px]"
            @click="nowDeleteCommentId=scope.row.id;isDelete=true"
          >
            <IconFontSymbol name="bohui" size="15px"></IconFontSymbol>
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <AdminConfirm
      v-model="isDelete"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除该评论？操作执行后将无法撤销。`"
      @confirmClick="DeleteCommentFun"
    ></AdminConfirm>
    <AdminConfirm
      v-model="isDeleteArr"
      width="470px"
      iconName="gongzuotai-dongtaishenhe"
      iconColor="#F72A33"
      title="操作确认"
      :content="`是否删除所选评论？操作执行后将无法撤销。`"
      @confirmClick="DeleteCommentSelectFun"
    ></AdminConfirm>
    <UpdateComment
      v-model="isUpdateComment"
      :commentId="nowUpdateCommentId"
      :commentContent="nowUpdateCommentContent"
      @refresh="refresh"
    />
    <div class="admin-page mt-8 mb-4 flex justify-end mr-12">
      <el-pagination
        background
        layout="prev, pager, next ,jumper"
        :default-page-size="8"
        :total="total"
        @current-change="pageSkip"
        @prev-click="preSkip"
        @next-click="nextSkip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AdminConfirm from '@/components/Admin/AdminConfirm.vue'
  import UpdateComment from '@/components/Admin/Community/CommunityCommentManage/UpdateComment.vue'
  import {formatDateTime} from '@/utils/timeToolFun'
  import {deleteCommentApi} from '@/api/Admin/communtiy/commentManage'      // 删除评论

  let props = defineProps<{commentDataList:any,type:number,isLoading:boolean,total:number}>()
  let emit = defineEmits(['prePage', 'nextPage','clickPage','deleteComment','deleteComments','refresh'])

  let isDelete = ref(false)         // 删除评论弹窗
  let nowDeleteCommentId = ref(0)   // 当前要删除的评论id
  let isDeleteArr = ref(false)      // 删除所选评论弹窗
  let nowDeleteCommentIdArr:any = reactive([]) // 当前要删除的评论id数组
  let isUpdateComment = ref(false)    // 修改评论弹窗
  let nowUpdateCommentId = ref(0)     // 当前要修改的评论id
  let nowUpdateCommentContent = ref('')   // 当前要修改的评论内容
  async function DeleteCommentFun(){         //删除评论
    let deleteRes = await deleteCommentApi([nowDeleteCommentId.value])
    if(deleteRes.success){
      isDelete.value = false
      ElMessage.success('删除成功')
      emit('deleteComment')
    }else{
      isDelete.value = false
      ElMessage.error('删除失败')
    }
  }
  async function DeleteCommentSelectFun(){    // 删除所选评论
    if(nowDeleteCommentIdArr.length === 0){
      ElMessage.error('请选择要删除的评论')
      return
    }
    let deleteRes = await deleteCommentApi([...nowDeleteCommentIdArr])
    if(deleteRes.success){
      isDeleteArr.value = false
      ElMessage.success('删除成功')
      emit('deleteComments',nowDeleteCommentIdArr.length)
    }else{
      isDelete.value = false
      ElMessage.error('删除失败')
    }
  }
  function handeleSelectionChange(val:any){   // 获取所选评论id
    nowDeleteCommentIdArr.splice(0)
    val.forEach(item => {
      nowDeleteCommentIdArr.push(item.id)
    })
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
  onMounted(()=>{
    document.querySelector('.el-pagination__goto').textContent='跳转'
  })
</script>

<style scoped>

</style>
