import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { nicknameRule, phoneRule, introRule } from './base'

export function useUserInfoRules(formData: Record<string, any> = {}) {
  const phoneRules = [...phoneRule]
  const userInfoRules = reactive<FormRules>({
    name: nicknameRule,
    phone: phoneRules,
    signature: introRule,
  })

  return {
    userInfoRules,
  }
}
