import { createStore, applyMiddleware } from 'redux'

//引入redux-thunk，用于支持异步action
import thunk from 'redux-thunk'
//引入汇总之后的reducer
import reducer from './reducers'


export default createStore(reducer, applyMiddleware(thunk))