<template>
  <AdminConfirm
    v-model="isUpdateComment"
    width="750px"
    iconName="bianji"
    iconColor="#76B0FD"
    title="修改评论"
    :isCustom="true"
  >
    <div class="mt-6 relative">
      <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
        <div class="">
          <el-form
            :model="commentForm"
            ref="updateRef"
            :rules="updateCommentRule"
          >
            <div class="">
              <el-form-item
                label="评论内容"
                prop="content"
              >
                <el-input
                  v-model="commentForm.content"
                  placeholder="请输入内容"
                  resize="none"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  class="mt-2"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="flex justify-end gap-6">
          <button
            type="button"
            @click.prevent="updateComment"
          >
            保存
          </button>
          <button
            type="button"
            @click.prevent="isUpdateComment = false;commentForm.content=commentContent"
            class="cancel-btn mr-10"
          >
              取消
          </button>
        </div>
      </div>
      <div class="w-full h-full absolute top-0 left-0 bg-[rgba(255,255,255,0.15)] rounded-[8px] flex items-center justify-center" v-show="isUpdateLoading">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    </div>
  </AdminConfirm>
</template>

<script setup lang="ts">
  import {GetCommentDetailApi,updateCommentApi} from '@/api/Admin/communtiy/commentManage'      // 获取评论详情、修改评论
  import {updateCommentRule} from '@/utils/rules/admin/admin'
  let props = defineProps<{commentId:number,commentContent:string}>()
  let emit = defineEmits(['refresh'])

  let isUpdateComment = defineModel<boolean>()        // 添加用户弹窗是否显示
  let isUpdateLoading = ref(false)

  let commentForm = reactive({
    content:'',
  })
  let updateRef = ref(null)     // 修改评论表单实例

  watch(() => props.commentContent,(newVal)=>{
    commentForm.content = newVal
  })

  async function updateComment(){      // 修改评论
    updateRef.value.validate()
    .then(async()=>{
      isUpdateLoading.value = true
      try{
        let updateRes = await updateCommentApi({id:props.commentId,content:commentForm.content})
        if(updateRes.success){
          isUpdateComment.value = false
          ElMessage.success('修改成功')
          emit('refresh')
        }else{
          ElMessage.error('修改失败')
          isUpdateLoading.value = false
        }
        isUpdateLoading.value = false
      }
      catch(err){
        isUpdateLoading.value = false
      }
    })
    .catch(()=>{
      ElMessage.error('评论内容不能为空')
      isUpdateLoading.value = false
    })
  }

</script>

<style scoped lang="scss">
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
