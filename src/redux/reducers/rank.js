import { RANK } from '../constant'

// action模板
/* action.data{
  order:false,
  rank: 'juniorcategory/secondarycategory/account/member/', // 非必须
  category:'date/payCount/incomeCount'  //必须属性，说明是按照什么升降排序的
} */

// 排序函数
Array.prototype.mySort = function (cate, order) {
  let list = this
  if (cate.indexOf('pay') >= 0 || cate.indexOf('income') >= 0) {
    cate = 'count'
  }
  list.sort((a, b) => {
    if (order) {
      return a[cate] - b[cate]
    } else {
      return b[cate] - a[cate]
    }
  })
}
// 项目分类统计
const rankSort = (list, n, data) => {  // n为分级，1为juniorcategory，2位secondarycategory     data为传入order升降序做准备
  list = list.reduce((pre, cur) => {  // 统计每个分类下的账单，返回一个对象
    let x = cur.category.split('>')[n - 1]
    if (pre[x]) {
      pre[x].push(cur)
    } else {
      pre[x] = [cur]
    }
    return pre
  }, {})
  let arr = []
  for (let key in list) {  // 返回一个数组，数组元素是对象，每个对象是一个分类的集合
    let a = {
      name: key,
      obj: list[key],
      sum: list[key].reduce((pre, cur) => {
        return pre + cur.count * 1
      }, 0)
    }
    arr.push(a)
  }
  arr.mySort('sum', data.demand.order)
  return arr
}
// account member分类统计
const amrankSort = (list, data) => {
  list = list.reduce((pre, cur) => {  // 统计每个分类下的账单，返回一个对象
    if (pre[cur[data.demand.rank]]) {
      pre[cur[data.demand.rank]].push(cur)
    } else {
      pre[cur[data.demand.rank]] = [cur]
    }
    return pre
  }, {})
  let arr = []
  for (let key in list) {  // 返回一个数组，数组元素是对象，每个对象是一个分类的集合
    let a = {
      name: key,
      obj: list[key],
      sum: list[key].reduce((pre, cur) => {
        return pre + cur.count * 1
      }, 0)
    }
    arr.push(a)
  }
  arr.mySort('sum', data.demand.order)
  return arr
}

export default function rank (preState = [], action) {
  const { type, data } = action
  if (type === RANK) {
    let { list } = data
    if (data.list === 'all') {  // 不传入具体的list，而是给个all，就是从所有账单中找
      list = JSON.parse(localStorage.getItem('allCount')) || []
    }
    let cat = data.demand.category
    switch (cat) {
      case 'date':  // 日期排序
        list.mySort(cat, data.demand.order)
        break
      case 'payCount':  // 支出排序
        list = list.filter(item => {   // 摘出所有的支出账单
          return item.pay
        })
        list.mySort(cat, data.demand.order)  // 然后按order进行排序
        break
      case 'incomeCount':  // 收入排序
        list = list.filter(item => {    // 同上
          return !item.pay
        })
        list.mySort(cat, data.demand.order)
        break
    }
    switch (data.demand.rank) {
      case 'juniorcategory':  // 一级分类排序
        list = rankSort(list, 1, data)
        break
      case 'secondarycategory':  // 二级分类排序
        list = rankSort(list, 2, data)
        break
      default:
        list = amrankSort(list, data)
        break
    }
    return [...list]
  }
  return preState
}