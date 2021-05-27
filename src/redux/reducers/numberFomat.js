import { NUMFOR } from '../constant'
import getOFS from './oFS'
// 将数字格式化为金额
// c表示保留几位小数
// d小数点位置的符号,可以正常地设置为'.',也可以自定义
// t千分位符号
const initState = {
  todayArr: [],
  // 今天列表
  todayArr: [],
  // 本周列表
  weekArr: [],
  // 本月列表
  monthArr: [],
  // 本年列表
  yearArr: [],
  // 现金列表
  cashArr: [],
  // 银行卡列表
  creditArr: [],
  // 公交卡列表
  bushCardArr: [],
  // 支付宝列表
  aliPayArr: [],
  // 微信列表
  weChatArr: [],
  // 今日收支
  todayRevenue: 0,
  // 本周收支
  weekRevenue: 0,
  // 本月收支
  monthRevenue: 0,
  // 今年收支
  yearRevenue: 0,
  // 现金收支
  cashRevenue: { pay: "0.00", income: "0.00" },
  // 银行卡收支
  creditRevenue: { pay: "0.00", income: "0.00" },
  // 公交卡收支
  bushCardRevenue: { pay: "0.00", income: "0.00" },
  // 支付宝收支
  aliPayRevenue: { pay: "0.00", income: "0.00" },
  // 微信收支
  weChatRevenue: { pay: "0.00", income: "0.00" },
  // 现金资产
  cashAsset: 0,
  // 银行卡资产
  creditAsset: 0,
  // 公交卡资产
  bushCardAsset: 0,
  // 支付宝资产
  aliPayAsset: 0,
  // 微信资产
  weChatAsset: 0,
  // 资产
  sumAsset: 0,
  // 虚拟资产
  virtualAsset: 0,
}
Number.prototype.numberFormat = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

export default function numberFormat (pre = initState, action) {
  let { type, data } = action
  if (type === NUMFOR) {
    if (data === 'all') {
      let allCount = JSON.parse(localStorage.getItem('allCount')) || [] // 获取所有账单数据
      data = getOFS('', { type: 'getOFS', data: allCount })
    }
    const deepClone = (obj, flag = false) => {  // 深度遍历对象，遍历时检查并格式化金额，返回一个格式化好的对象
      if (typeof obj !== 'object' || obj === null) {
        if (flag) {
          let number = obj * 1
          return number.numberFormat(2)
        } else {
          return obj
        }
      }
      if (Array.isArray(obj)) {
        var clone = []
      } else {
        var clone = {}
      }
      for (let key in obj) {
        if (key.indexOf('Asset') >= 0 || key === 'pay' || key === 'income' || key === 'count') {
          clone[key] = deepClone(obj[key], true)
        } else {
          clone[key] = deepClone(obj[key], false)
        }
      }
      return clone
    }
    return { ...pre, ...deepClone(data, false) }
  }
  return pre
}
