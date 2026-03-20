import type { FormItemRule } from 'element-plus'

export const addUserRule: Record<string, FormItemRule[]> = {
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email:[
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/,
      message: '密码需8-20位，含大写字母、数字及特殊字符',
      trigger: 'blur',
    }
  ],
  introduction:[
    { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
  ]
}

export const updateCommentRule: Record<string, FormItemRule[]> = {
  content: [
    { required: true, message: '评论内容不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ]
}
