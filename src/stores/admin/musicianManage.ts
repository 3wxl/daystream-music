import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'

export const useMusicianManageStore = defineStore('musicianManage', () => {
  // state
  let keyword = ref('')
  let type = ref('1')         // 音乐人类型：0-待审核 1-已通过 2-未通过
  let musicianList_0 = reactive([
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    },
  ])
  let musicianList_1 = reactive([
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      joinTime:'2023-05-01 10:00:00',
    },
  ])
  let musicianList_2 = reactive([
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
    {
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      rejectTime:'2023-05-01 10:00:00',
    },
  ])

  // 方法
  function add(){
    musicianList_0.push({
      id:1,
      name:'蔡徐坤',
      avatar:'https://picsum.photos/200/300',
      email:'cai@163.com',
      introduction:'我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人我是一个音乐人',
      applyTime:'2023-05-01 10:00:00',
    })
  }

  return {
    keyword,
    type,
    musicianList_0,
    musicianList_1,
    musicianList_2,
    add
  }
})
