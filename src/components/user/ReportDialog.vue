<template>
  <el-dialog
    v-model="props.visible"
    title="举报评论"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 举报原因选择 -->
      <el-form-item label="举报原因" prop="reason">
        <el-select v-model="form.reason" placeholder="请选择举报原因" style="width: 100%">
          <el-option label="1-色情低俗" value="1" />
          <el-option label="2-违法信息" value="2" />
          <el-option label="3-人身攻击" value="3" />
          <el-option label="4-广告推广" value="4" />
          <el-option label="5-侵权内容" value="5" />
        </el-select>
      </el-form-item>

      <!-- 详细举报说明 -->
      <el-form-item label="详细说明（选填）">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          placeholder="请描述具体的举报问题（非必填）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading"> 提交举报 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElButton,
  ElDialog,
} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { ReportCommentParams } from '@/types/comment/index'
import { reportComment } from '@/api/comment'

// 定义组件Props
const props = defineProps<{
  visible: boolean // 控制弹窗显示/隐藏
  targetId: string // 举报目标ID（评论/回复ID）
  targetType: number // 举报目标类型（固定为2）
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'close'): void // 弹窗关闭事件
  (e: 'success'): void // 举报成功事件
}>()

// 表单相关
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({
  reason: '', // 举报原因（1-5）
  content: '', // 详细举报内容
})

// 表单校验规则
const rules = reactive<FormRules>({
  reason: [{ required: true, message: '请选择举报原因', trigger: 'change' }],
})

// 取消举报
const handleCancel = () => {
  emit('close')
  // 重置表单
  formRef.value?.resetFields()
  form.content = ''
}

// 提交举报
const handleSubmit = async () => {
  if (!formRef.value) return

  // 表单校验
  try {
    await formRef.value.validate()
    loading.value = true

    // 构造举报参数
    const params: ReportCommentParams = {
      targetId: props.targetId,
      targetType: props.targetType,
      reason: Number(form.reason),
      reportContent: form.content.trim() || `举报原因：${form.reason}`,
    }

    // 调用举报接口
    const res = await reportComment(params)
    console.log(res)
    if (res.success) {
      ElMessage.success('举报提交成功，我们会尽快处理！')
      emit('success')
      handleCancel() // 提交成功后关闭弹窗
    } else {
      ElMessage.error(`举报失败：${res.errCode || '服务器异常'}`)
    }
  } catch (error) {
    // 表单校验失败或接口报错
    if (error instanceof Error) {
      console.error('举报提交失败：', error)
      ElMessage.error('举报提交失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 弹窗打开时重置表单
onMounted(() => {
  if (props.visible) {
    formRef.value?.resetFields()
  }
})
</script>

<style scoped lang="scss">
// 组件内样式优化
.el-dialog {
  --el-dialog-background-color: #fff;
  --el-dialog-title-color: #333;
  --el-dialog-font-size: 14px;
}

.el-form {
  margin-top: 10px;
}

.el-form-item {
  margin-bottom: 16px;
}

.el-textarea {
  --el-textarea-bg-color: #f9f9f9;
}
</style>
