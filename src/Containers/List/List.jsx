import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import style from './style.module.css'

import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import Year from '../IndexPage/drawerPage/stream/yearStream';
import getCountData from '../../redux/reducers/countData';
import random from 'number-random';

function Index (props) {
  let end = new Date(),
    year = end.getFullYear(),
    start = new Date(year, 0, 1) - 0
  end = new Date(year, 11, 31).getTime()
  let list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [start, end] } } })]

  const { flash } = props
  const [state, setState] = useState({ start, end, year, list })
  useEffect(() => {
    getStream()
  }, [flash, year])
  // 进入年清单
  const getStream = () => {
    let end = new Date(),
      year = end.getFullYear(),
      start = new Date(year, 0, 1) - 0
    setState({ ...state, start, end: end.getTime() })
  }
  let count = {
    balance: 0,
    income: 0,
    pay: 0
  }

  // 计算结余金额
  const sumCount = () => {
    count.balance = count.income = count.pay = 0
    const { list } = state
    if (list.length && list[0].pay) {
      list.map(item => {
        if (item.pay) {
          count.pay += item.count * 1
        } else {
          count.income += item.count * 1
        }
      })
    }
    count.balance = count.income - count.pay
    return (
      <div className={style.countHead}>
        <div className={style.count}><span style={{ textAlign: 'left', paddingLeft: '30px' }}>{count.balance.numberFormat(2)}</span><div style={{ textAlign: 'left', paddingLeft: '30px' }}>结余</div></div>
        <div className={style.count}><span style={{ textAlign: 'center' }}>{count.income.numberFormat(2)}</span><div style={{ textAlign: 'center' }}>收入</div></div>
        <div className={style.count}><span style={{ textAlign: 'right', paddingRight: '30px' }}>{count.pay.numberFormat(2)}</span><div style={{ textAlign: 'right', paddingRight: '30px' }}>支出</div></div>
      </div>
    )
  }

  const display = () => {
    if (state.year === new Date().getFullYear()) {
      return (
        <div className={style.displayArea}>
          <Year week={false} timeSeg={state} key={random(1, 10000, false)} ></Year>
        </div>
      )
    }
    return (
      <div className={style.displayArea}>
        <Year week={false} timeSeg={state} key={random(1, 10000, false)} ></Year>
      </div>
    )
  }

  // 翻页
  const turnPage = (value) => {
    switch (value) {
      case 'left':
        year = state.year - 1
        start = new Date(state.year - 1, 0, 1).getTime()
        end = new Date(state.year - 1, 11, 31, 12, 59, 59).getTime()
        break;
      case 'right':
        if (state.year === new Date().getFullYear()) return null
        year = state.year + 1
        start = new Date(state.year + 1, 0, 1).getTime()
        end = new Date(state.year + 1, 11, 31, 12, 59, 59).getTime()
        break
    }
    if (year === new Date().getFullYear()) {
      end = new Date().getTime()
    }
    list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [start, end] } } })]
    setState({ ...state, start, end, year, list })
  }

  return (
    <div className={style.container}>
      <div className={style.head}>
        <div className={style.headContent} >
          <span onClick={() => { turnPage('left') }} className={style.turning} ><LeftOutlined /></span>
          <span style={{ cursor: 'default', width: '140px', textAlign: 'center', display: 'inline-block' }}>{`${state.year}年流水`}</span>
          <span onClick={() => { turnPage('right') }} className={style.turning} style={{ color: state.year === 2021 ? '#cd9d4b' : '#a96c37', cursor: state.year === 2021 ? 'default' : 'pointer' }}><RightOutlined /></span>
        </div>
      </div>
      {/* 金额汇总区域 */}
      {sumCount()}
      {/* 展示区域 */}
      {display()}
    </div>
  )
}
export default connect(
  state => ({
    flash: state.saveCount
  })
)(Index)
