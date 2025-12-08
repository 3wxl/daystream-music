import { reactive } from "vue"
import type {FormRules} from 'element-plus'
import { emailRule,passwordStrengthRule,captchaRule,nicknameRule } from "./base"

/**
 * @param formData 表单的数据对象 (Reactive)
 * @param pwdKey 表单中“密码”字段的键名，默认是 'password'
 */

export function useAuthRules(formData: Record<string, any>, pwdKey = 'password') {
  // 动态校验器
  const validateConfirmPwd = (rule: any, value: string, callback: any) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== formData[pwdKey]) {
      callback(new Error('两次输入密码不一致'))
    } else {
      callback()
    }
  }

  // 确认密码规则
  // 说明：确认密码 = [密码强度的所有规则] + [必须一致的规则]
  const confirmPwdRule = [
    ...passwordStrengthRule,
    { validator: validateConfirmPwd, trigger: 'blur' },
  ]

  // 登录规则
  const loginRules = reactive<FormRules>({
    email: emailRule,
    password: passwordStrengthRule,
    captcha: captchaRule,
  })

  // 注册规则
  const registerRules = reactive<FormRules>({
    email: emailRule,
    username: nicknameRule,
    captcha: captchaRule,
    password: passwordStrengthRule,
    newPassword: confirmPwdRule,
  })

  // 忘记密码规则
  const forgotRules = reactive<FormRules>({
    email: emailRule,
    captcha: captchaRule,
    password: passwordStrengthRule,
    newPassword: confirmPwdRule,
  })

  return {
    loginRules,
    registerRules,
    forgotRules,
  }
}

