import { SAVECOUNT, EDITCOUNT, SAVEASTEMP } from '../constant'

const initState = {
  id: 0,
  count: 0,
  pay: true,
  category: ['暂无数据'],
  account: ' ',
  date: (new Date()).getTime(),
  member: '(无成员)',
  remark: ''
}

export default function saveCountReducer (preState = initState, action) {
  const { type, data } = action
  switch (type) {
    case SAVECOUNT:
      let allCount = JSON.parse(localStorage.getItem('allCount')) // 获取本地存储的账单
      if (!allCount) {                                              // 如果没有，则直接将新账单以数组形式存入
        localStorage.setItem('allCount', JSON.stringify([data]))
      } else {
        allCount = [...allCount, data]                               // 有则加入旧数组
        localStorage.setItem('allCount', JSON.stringify(allCount))
      }
      break;
    case SAVEASTEMP:
      let allTemp = JSON.parse(localStorage.getItem('allTemp')) // 获取本地存储的账单
      if (!allTemp) {                                              // 如果没有，则直接将新账单以数组形式存入
        localStorage.setItem('allTemp', JSON.stringify([data]))
      } else {
        allTemp = [...allTemp, data]                               // 有则加入旧数组
        localStorage.setItem('allTemp', JSON.stringify(allTemp))
      }
      break;
  }
  return null
}