import on_demand from './countData'
import { OFS } from '../constant'
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
  let condition = { type: 'getCountData', data: { demand: {}, list: 'all' } }
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
  switch (item) {
    case 'today':
      condition.data.demand.date = targetMsec(nowMsec, 1)
      return on_demand([], condition)
    case 'week':
      condition.data.demand.date = targetMsec(nowMsec, 7)
      return on_demand([], condition)
    case 'month':
      let thisMonthDays = timeStr(nowMsec).day
      condition.data.demand.date = targetMsec(nowMsec, thisMonthDays)
      return on_demand([], condition)
    case 'year':
      let thisYear = timeStr(nowMsec).year
      condition.date = targetMsec(nowMsec, thisYear)
      return on_demand(allCount, condition)
  }
}
// 收支计算
const revenue = (list) => {
  let arr = list || []
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
const calcuAsset = (ofs, cate) => {
  return ofs[`${cate}Revenue`]['income'] - ofs[`${cate}Revenue`]['pay']
}

export default function getOFS (pre = [null], action) {
  let ofs = {}
  const { type, data } = action
  // 支出列表
  if (type === OFS) {
    let list = data || []
    ofs.payArr = list.filter(item => {
      return item['pay']
    })
    // 收入列表
    ofs.incomeArr = list.filter(item => {
      return !item['pay']
    })
    // 今天列表
    ofs.todayArr = distList('today')
    // 本周列表
    ofs.weekArr = distList('week')
    // 本月列表
    ofs.monthArr = distList('month')
    // 本年列表
    ofs.yearArr = distList('year')
    // 现金列表
    ofs.cashArr = on_demand(allCount, { type: 'getCountData', data: { demand: { account: '现金' }, list: 'all' } })
    // 银行卡列表
    ofs.creditArr = on_demand(allCount, { type: 'getCountData', data: { demand: { account: '银行卡' }, list: 'all' } })
    // 公交卡列表
    ofs.bushCardArr = on_demand(allCount, { type: 'getCountData', data: { demand: { account: '公交卡' }, list: 'all' } })
    // 支付宝列表
    ofs.aliPayArr = on_demand(allCount, { type: 'getCountData', data: { demand: { account: '支付宝' }, list: 'all' } })
    // 微信列表
    ofs.weChatArr = on_demand(allCount, { type: 'getCountData', data: { demand: { account: '微信' }, list: 'all' } })
    // 今日收支
    ofs.todayRevenue = revenue(ofs.todayArr)
    // 本周收支
    ofs.weekRevenue = revenue(ofs.weekArr)
    // 本月收支
    ofs.monthRevenue = revenue(ofs.monthArr)
    // 今年收支
    ofs.yearRevenue = revenue(ofs.yearArr)
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
    ofs.cashAsset = calcuAsset(ofs, 'cash')
    // 银行卡资产
    ofs.creditAsset = calcuAsset(ofs, 'credit')
    // 公交卡资产
    ofs.bushCardAsset = calcuAsset(ofs, 'bushCard')
    // 支付宝资产
    ofs.aliPayAsset = calcuAsset(ofs, 'aliPay')
    // 微信资产
    ofs.weChatAsset = calcuAsset(ofs, 'weChat')
    // 资产
    ofs.sumAsset = ofs.cashAsset + ofs.creditAsset + ofs.bushCardAsset + ofs.aliPayAsset + ofs.weChatAsset
    // 虚拟资产
    ofs.virtualAsset = ofs.sumAsset - ofs.cashAsset
    return ofs
  }
  return pre
}