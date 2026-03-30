import { reactive } from "vue";
import type { FormRules,FormItemRule } from "element-plus";
import { lengthRule, requiredRule } from "./base";

export function useUploadtRules(){
  // 标签数量校验
  const validateTags = (rule: any, value: string[], callback: any) => {
    if (value.length === 0) {
      callback(new Error('至少选择一个标签'))
    } else if (value.length > 3) {
      callback(new Error('最多选择三个文件'))
    } else {
      callback()
    }
  }

  // 通用：输入框
  const inputRule: FormItemRule[] = [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { validator: lengthRule(15), trigger: 'blur' },
  ]

  // 描述框
  const descriptionRule: FormItemRule[] = [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { validator: lengthRule(50), trigger: 'blur' },
  ]

  const fileRule: FormItemRule[] = [
    { required: true, message: '请上传文件', trigger: 'blur' },
  ]
  const tagsRule: FormItemRule[] = [
    { required: true, message: '请选择标签', trigger: 'blur' },
    { validator: validateTags, trigger: 'blur' },
  ]

  const playlistUploadRule: FormRules = reactive({
    name: inputRule,
    description: descriptionRule,
    coverFile: fileRule,
    tagsIds: tagsRule,
  })

  const albumUploadRule: FormRules = reactive({
    albumName:inputRule,
    introduction:descriptionRule,
    coverFile:fileRule,
    musicianId:requiredRule('请输入音乐人ID'),
  })

  // 音乐人中心音乐上传规则
  const musicUploadRule: FormRules = reactive({
    musicName: inputRule,
    bpm: [{ required: true, message: '请输入BPM', trigger: 'blur' }],
    licenseType: [{ required: true, message: '请选择版权类型', trigger: 'change' }],
    price: [{ message: '请输入价格', trigger: 'blur' }], // 价格校验逻辑可在组件内更灵活处理，或此处保持基础
  })
 // 音乐人中心mv上传规则 
  const mvUploadRule: FormRules = reactive({
    title: inputRule,
    description: descriptionRule,
  })

  return {
    playlistUploadRule,
    albumUploadRule,
    musicUploadRule,
    mvUploadRule
  }
}




 



