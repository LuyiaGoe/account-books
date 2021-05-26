import { SAVECOUNT, EDITCOUNT, SAVEASTEMP, DELETECOUNT } from '../constant'
import randomNum from 'number-random'
// 数据格式如下
// data = {
//   id: 0,
//   count: 0,
//   pay: true,
//   category: ['暂无数据'],
//   account: ' ',
//   date: (new Date()).getTime(),
//   member: '(无成员)',
//   remark: ''
// }

export default function saveCountReducer (preState, action) {
  let allCount = JSON.parse(localStorage.getItem('allCount')) // 获取本地存储的账单
  const { type, data } = action
  switch (type) {
    case SAVECOUNT:
      if (!allCount) {                                              // 如果没有，则直接将新账单以数组形式存入
        localStorage.setItem('allCount', JSON.stringify([data]))
      } else {
        allCount = [...allCount, data]                               // 有则加入旧数组
        localStorage.setItem('allCount', JSON.stringify(allCount))
      }
      return null
    case SAVEASTEMP:
      let allTemp = JSON.parse(localStorage.getItem('allTemp')) // 获取本地存储的账单
      if (!allTemp) {                                              // 如果没有，则直接将新账单以数组形式存入
        localStorage.setItem('allTemp', JSON.stringify([data]))
      } else {
        allTemp = [...allTemp, data]                               // 有则加入旧数组
        localStorage.setItem('allTemp', JSON.stringify(allTemp))
      }
      return null
    case EDITCOUNT:
      let editCount = {}
      let target = [...allCount.map(item => {
        if (item.id === data.id) {
          data.id = new Date().getTime()
          editCount = item = { ...data }
        }
        return item
      })]
      localStorage.setItem('allCount', JSON.stringify(target))
      return editCount
    case DELETECOUNT:
      let deleteCount = {}
      let deleted = allCount.filter(item => {
        if (item.id !== data * 1) {
          deleteCount = { ...item }
        }
        return item.id !== data * 1
      })
      localStorage.setItem('allCount', JSON.stringify(deleted))
      return { ...deleteCount }
  }
  return null
}