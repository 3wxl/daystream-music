import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'

export const useUserManageStore = defineStore('userManage', () => {
  // state
  let userSearchKeyWord = ref('')
  let userType = ref('1')

  return{
    userSearchKeyWord,
    userType,
    userData
  }
})
