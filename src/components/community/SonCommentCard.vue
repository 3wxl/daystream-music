<template>
  <div class="flex w-full flex-col gap-1 mb-5">
    <div class="flex flex-shrink-0 w-full items-center">
      <img :src="avatar" alt="评论者头像" class="w-[30px] h-[30px] rounded-[50%] mr-2 cursor-pointer">
      <span class="text-[15px] text-[#fe65ce] mr-2 cursor-pointer">{{ username }}</span>
      <span class="text-white">
        回复 <span class="text-[#31A2D4] cursor-pointer">@{{replyUsername}}:</span>
      </span>
    </div>
    <p class="text-[15px] indent-[1.5rem] text-[#e5e7eb]">
      {{ content }}
    </p>
    <div class="flex items-center justify-between">
      <div>
        <span class="text-[#c4c5c8] text-[13px]">{{ formatDateTime(createdTime) }}</span>
        <span class="text-[13px] text-[#e5e7eb] cursor-pointer ml-3 hover:text-pink-500" @click="inputSpread">
          回复
        </span>
      </div>
      <div class="mr-1">
        <span class="text-gray-300/30 mr-1 cursor-pointer hover:text-pink-500 mr-1 duration-300" @click="isShowReport = true">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="举报该评论"
            placement="top"
          >
            <IconFontSymbol name="jinggao-L" size="15px"></IconFontSymbol>
          </el-tooltip>
        </span>
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer hover:text-pink-500 text-[13px] ml-3" v-if="!isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
        </span>
        <span @click="throttleLikeComment(id)" class="text-[#e5e7eb] mr-1 cursor-pointer text-[13px] text-pink-500" v-if="isLike">
          {{ likeCount }} <IconFontSymbol name="icon" size="14px"></IconFontSymbol>
        </span>
      </div>
    </div>
  </div>
  <PopupFont title="举报评论" :id="id" v-model="isShowReport">
    <p class="text-[14px] text-gray-400 mb-3">举报评论：{{ content }}</p>
    <el-form v-model="reportForm" :rules="reportRule" ref="ruleFormRef">
      <el-form-item>
        <el-radio-group v-model="reportForm.reason">
          <el-radio :value="1">色情低俗</el-radio>
          <el-radio :value="2">违法信息</el-radio>
          <el-radio :value="3">人身攻击</el-radio>
          <el-radio :value="4">广告</el-radio>
          <el-radio :value="5">侵权</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <textarea v-model="reportForm.reportContent" placeholder="请输入举报理由"
          class="duration-200 resize-none w-full h-[8rem] text-[#e5e7eb] px-2 py-1 outline-1 outline-gray-200/20 focus:outline-pink-500 focus:outline-2 rounded-[8px]"
        >
        </textarea>
      </el-form-item>
      <el-form-item>
        <button type="button" class="ml-100 cursor-pointer mr-8 px-4 py-1 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors" @click="isShowReport=false">取消</button>
        <button type="submit" class="cursor-pointer px-4 py-1 bg-gradient-to-r from-[#e2036f] to-[#b277bb] rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2" @click.prevent="submitReport">提交举报</button>
      </el-form-item>
    </el-form>
  </PopupFont>
</template>

<script setup lang="ts">
  import {debounce,throttle} from '@/utils/debounceThrottle';     // 节流防抖
  import {Like} from '@/api/community/DynamicOperate';      // 点赞
  import {reportRule} from '@/rules/community/report'                          // 举报规则
  import {Report} from '@/api/community/Report';                               // 举报
  // ts
  // 数据
  let props = defineProps(['sonComment'])
  let {avatar,content,createdTime,id,isLike,isSelf,likeCount,replyUserId,replyUsername,userId,username} = toRefs(props.sonComment)
  let emit = defineEmits(['replyComment'])
  let isShowReport = ref(false);
  let reportForm = reactive({
    targetId:id.value,
    targetType:2,
    reason:1,
    reportContent:''
  })
  let ruleFormRef = ref(null);
  // 方法
  function inputSpread(){
    emit('replyComment')
  }
  function formatDateTime(dateString: string): string {     // 时间格式化
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  let throttleLikeComment = throttle(async function likeDynamic(commentId:string){     // 点赞评论
    let submitData = {
      targetId:commentId,
      targetType:2
    }
    let likeRes = await Like(submitData)
    if(likeRes.success){
      isLike.value = !isLike.value;
      likeCount.value = likeRes.data.likecount
    }else{
      ElMessage({
        message: '点赞失败',
        type: 'warning',
      })
    }
  },1500)
  let submitReport = throttle(async function(){     // 提交举报
    try {
      await ruleFormRef.value.validate()
      let reportRes = await Report(reportForm)
      if(reportRes.success){
        ElMessage({
          message: '举报成功',
          type: 'success',
        })
        reportForm.reason = 1
        reportForm.reportContent = ''
        isShowReport.value = false
      }else{
        ElMessage({
          message: '举报失败',
          type: 'warning',
        })
      }
    } catch (error) {
      ElMessage({
        message: '请填写完整的举报信息',
        type: 'warning',
      })
      return false
    }
  },1500)
</script>

<style scoped>

</style>
