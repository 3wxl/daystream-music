import type { FormItemRule } from 'element-plus'

// 通用：必填
export const requiredRule = (msg: string): FormItemRule[] => [
  { required: true, message: msg, trigger: 'blur' }
]

// 通用：邮箱格式
export const emailRule:FormItemRule[] = [
  { required: true, message: '请填写对应邮箱', trigger: 'blur' },
  { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
]

// 通用：密码强度
export const passwordStrengthRule:FormItemRule[] = [
  { required: true, message: '请输入密码', trigger: 'blur' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/,
    message: '密码需8-20位，含大写字母、数字及特殊字符',
    trigger: 'blur',
  },
]

// 通用：验证码
export const captchaRule:FormItemRule[] = [
  { required: true, message: '请输入验证码', trigger: 'blur' }
]

//通用：昵称
export const nicknameRule: FormItemRule[] = [
  { required: true, message: '请输入昵称', trigger: 'blur' },
  {
    pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,16}$/,
    message: '昵称格式错误：只能包含汉字、字母、数字、下划线，长度2-16位',
    trigger: 'blur',
  },
]
// 长度校验
export const lengthRule = (count: number) => {
    return (rule:any,value:string,callback:any) => {
     if(!value || value.trim().length === 0){
      callback(new Error('请输入内容，文本内容不能为空或全是空格'))
     }else if(value.trim().length>count){
      callback(new Error(`文本内容长度不能超过${count}位`))
     }else{
      callback()
     }
    }
  }
