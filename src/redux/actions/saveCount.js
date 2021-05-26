// 用于保存新建的账单或者修改已有的账单，账单结构如下：
/* example = {
    // 账单id,为当时创建的时间
  id: Number,
    // 账单金额
  count: Number,
    // 账单是收入（false）还是支出（true）
  pay: Boolean,
    // 账单分类
  category: Array,
    // 账单账户
  account: String,
    // 账单日期
  date: Number,
    // 成员    非必须
  member: String,
    // 账单备注    非必须
  remark: String
} */
import { SAVECOUNT, EDITCOUNT, SAVEASTEMP, DELETECOUNT } from '../constant'

export const saveCount = data => ({ type: SAVECOUNT, data })
export const editCount = data => ({ type: EDITCOUNT, data })
export const saveAsTemp = data => ({ type: SAVEASTEMP, data })
export const deleteCount = data => ({ type: DELETECOUNT, data })