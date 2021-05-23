/* 
  该文件用于汇总所有的reducer为一个总的reducer
*/
//引入combineReducers，用于汇总多个reducer
import { combineReducers } from 'redux'
// 引入为存储账单、更改账单服务的reducer
import saveCount from './saveCount'
import countData from './countData'
import ofs from './oFS'
import numFor from './numberFomat'
import getRank from './rank'


//汇总所有的reducer变为一个总的reducer
export default combineReducers({
  saveCount,
  countData,
  ofs,
  numFor,
  getRank
})
