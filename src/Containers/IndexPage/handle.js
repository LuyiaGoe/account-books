let ofs = {}
const initState = {
  count: 0,
  category: ['暂无数据'],
  date: 0,
  account: '暂无数据',
  pay: true
}
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
  return []
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
    case 'month':
      let thisMonthDays = timeStr(nowMsec).day
      condition.date = targetMsec(nowMsec, thisMonthDays)
      return on_demand(allCount, condition)
    case 'year':
      let thisYear = timeStr(nowMsec).year
      condition.date = targetMsec(nowMsec, thisYear)
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

export default function handle (dat) {
  // 支出列表
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
  // 本年列表
  ofs.yearArr = distList('year')
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
  ofs.sumAsset = ofs.cashAsset + ofs.creditAsset + ofs.bushCardAsset + ofs.aliPayAsset + ofs.weChatAsset
  // 虚拟资产
  ofs.virtualAsset = ofs.sumAsset - ofs.cashAsset
  return ofs
}