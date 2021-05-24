import { GETCOUNTDATA } from '../constant'

const initState = [{
  count: 0,
  category: ['暂无数据'],
  date: 0,
  account: '暂无数据',
  pay: true
}]
let allCount = JSON.parse(localStorage.getItem('allCount')) || [initState] // 获取所有账单数据

// 按需获取数据
const on_demand = (list, demand) => {
  let keys = Object.keys(demand)  // 获取到需求的项目的'键'数组
  if (keys.length === 0) {// 获取所有列表
    return list
  } else {
    return keys.reduce((pre, cur) => { // 将范围数组当成初始值扔入reduce
      return pre.filter(item => { // 用filter筛选符合本次demand[cur]要求的账单数组
        switch (typeof demand[cur]) { // 条件键值对的值demand[cur]，可以区分为两类
          case 'object': // 引用数据类型 这一类下也有两个子类
            if (typeof demand[cur][0] === 'number') { // count date 查询逻辑区域
              if (demand[cur][0] <= item[cur] && item[cur] <= demand[cur][1]) return item
            } else { // category 查询逻辑区域
              if (demand[cur][1]) {
                return item[cur].indexOf(demand[cur][1]) !== -1
              } else {
                return item[cur].indexOf(demand[cur][0]) !== -1
              }
            }
            break;
          default: // 基本数据类型 pay id member account 查询逻辑区域
            return item[cur] == demand[cur]
        }
      })
    }, list)
  }
}

// 判断state中的list，并返回相应的list数组
const distList = (item) => {
  let condition = {}
  let nowMsec = new Date().getTime()
  let timeStr = (msecNum) => {
    return {
      year: new Date(msecNum).getFullYear(),
      month: new Date(msecNum).getMonth(),
      day: new Date(msecNum).getDate()
    }
  }
  // 返回一个毫秒时间段数组，[time-segment,time],segment单位为天
  let targetMsec = (time, segment) => {
    let segTime = timeStr(time)
    // 获得当天00:00:00的毫秒数
    segTime = new Date(segTime.year, segTime.month, segTime.day)
    return [segTime - (segment - 1) * 86400000, time]
  }
  if (typeof item === 'object') {
    condition.date = item
    return on_demand(allCount, condition)
  }
  switch (item) {
    case 'all':
      return allCount
    case 'today':
      condition.date = targetMsec(nowMsec, 1)
      return on_demand(allCount, condition)
    case 'week':
      condition.date = targetMsec(nowMsec, 7)
      return on_demand(allCount, condition)
  }
}
// action.state的结构为：
/* state_example={
  list:'all',
  demand:{
    ······
    条件键值对
    ······
  }
} */
export default function countDate (preState = initState, action) {
  allCount = JSON.parse(localStorage.getItem('allCount')) || [initState]
  const { type, data } = action
  switch (type) {
    case GETCOUNTDATA:
      return [...on_demand(distList(data.list), data.demand)]
  }
  return preState
}