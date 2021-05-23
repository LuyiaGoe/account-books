import { GETCOUNTDATA } from '../constant'

// 做到按需获取数据，需求的格式为：
/* demand_example={
  pay:Boolean, // 查支出或者收入
  category:['一级选择器'[,'二级选择器']], // 为一个一级分类区段，或具体到二级分类区段
  date:[Number,Number], // 为一个时间段或一个时间点
  id:Number, // 具体查某一单
  member:String, // 查成员
  count: [Number,Number] // 查金额
  account: String // 查账户
} */

export const getCountData = demand => ({ type: GETCOUNTDATA, data: demand })