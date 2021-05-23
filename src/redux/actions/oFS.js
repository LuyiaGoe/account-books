// 用于存储统计数据的对象，全称Object For Statistics
import { OFS } from '../constant'

export const getOfS = countList => ({ type: OFS, data: countList })
