import on_demand from './countData'

let ofs = {}
const initState = {
  count: 0,
  category: ['暂无数据'],
  date: 0,
  account: '暂无数据',
  pay: true
}
let allCount = JSON.parse(localStorage.getItem('allCount')) || [initState] // 获取所有账单数据

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
    case 'month':
      let thisMonthDays = timeStr(nowMsec).day
      condition.date = targetMsec(nowMsec, thisMonthDays)
      return on_demand(allCount, condition)
  }
}
// 收支计算
const revenue = (arr) => {
  return arr.reduce((pre, cur) => {
    if (cur.pay) {
      pre.pay += cur.count * 1
    } else {
      pre.income += cur.count * 1
    }
    return pre
  }, { pay: 0, income: 0 })
}
// 资产统计
const calcuAsset = (cate) => {
  return ofs[`${cate}Revenue`]['income'] - ofs[`${cate}Revenue`]['pay']
}

export default function getOFS (pre, dat) {
  // 支出列表
  console.log(dat);
  let data = dat || []
  ofs.payArr = data.filter(item => {
    return item['pay']
  })
  // 收入列表
  ofs.incomeArr = data.filter(item => {
    return !item['pay']
  })
  // 今天列表
  ofs.todayArr = distList('today')
  // 本周列表
  ofs.weekArr = distList('week')
  // 本月列表
  ofs.monthArr = distList('month')
  // 现金列表
  ofs.cashArr = on_demand(allCount, { account: '现金' })
  // 银行卡列表
  ofs.creditArr = on_demand(allCount, { account: '银行卡' })
  // 公交卡列表
  ofs.bushCardArr = on_demand(allCount, { account: '公交卡' })
  // 支付宝列表
  ofs.aliPayArr = on_demand(allCount, { account: '支付宝' })
  // 微信列表
  ofs.weChatArr = on_demand(allCount, { account: '微信' })
  // 今日收支
  ofs.todayRevenue = revenue(ofs.todayArr)
  // 本周收支
  ofs.weekRevenue = revenue(ofs.weekArr)
  // 本月收支
  ofs.monthRevenue = revenue(ofs.monthArr)
  // 现金收支
  ofs.cashRevenue = revenue(ofs.cashArr)
  // 银行卡收支
  ofs.creditRevenue = revenue(ofs.creditArr)
  // 公交卡收支
  ofs.bushCardRevenue = revenue(ofs.bushCardArr)
  // 支付宝收支
  ofs.aliPayRevenue = revenue(ofs.aliPayArr)
  // 微信收支
  ofs.weChatRevenue = revenue(ofs.weChatArr)
  // 现金资产
  ofs.cashAsset = calcuAsset('cash')
  // 银行卡资产
  ofs.creditAsset = calcuAsset('credit')
  // 公交卡资产
  ofs.bushCardAsset = calcuAsset('bushCard')
  // 支付宝资产
  ofs.aliPayAsset = calcuAsset('aliPay')
  // 微信资产
  ofs.weChatAsset = calcuAsset('weChat')
  // 资产
  ofs.sumAsset = 0
  for (let key in ofs) {
    if (key.indexOf('Asset') >= 0) {
      ofs.sumAsset += ofs[key]
    }
  }
  console.log('ofs', ofs);
  return data
}