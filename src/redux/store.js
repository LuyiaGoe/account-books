import { createStore, applyMiddleware, combineReducers } from 'redux'

import numberChange from './reducer'

import thunk from 'redux-thunk'

const allReducer = combineReducers({
  count1: numberChange
})

export default createStore(allReducer, applyMiddleware(thunk))