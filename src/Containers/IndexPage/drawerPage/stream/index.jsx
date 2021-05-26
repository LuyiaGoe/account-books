import React, { Component } from 'react';
import { connect } from 'react-redux'
import style from './style.module.css'
import { Progress } from 'antd';
// actions
import getCountData from '../../../../redux/reducers/countData';
import { getOFS } from '../../../../redux/actions/oFS'
// components
import Day from './dayStream';
import Week from './weekStream';
import Month from './monthStream';
import Year from './yearStream';

class Stream extends Component {
  constructor(props) {
    super(props)
    this.type = this.props.location.state.type
    this.balance = JSON.parse(localStorage.getItem('balance')) || 0
    this.bal = this.props.ofs.monthRevenue.pay
  }
  state = {
    start: this.props.location.state.start,
    end: this.props.location.state.end,
    // 中断更新用，当flash的ID与这个不同，就不渲染页面
    id: 2021,
    // 辅助标识
    flag: false
  }
  list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [this.props.location.state.start, this.props.location.state.end] } } })]
  static getDerivedStateFromProps (nextProps, preState) {
    const { flash } = nextProps
    if (flash && flash.id !== preState.id) {
      return { ...preState, id: flash.id, flag: true }
    }
    return { ...preState, flag: false }
  }
  shouldComponentUpdate (nextProps, nextState) {
    const { flash } = nextProps
    const { flag } = nextState
    if (flash) {
      if (!flag) {
        return false
      }
      this.sumCount()
      return true
    } else {
      if (nextState.id) {
        this.sumCount()
        return true
      }
    }
    return false
  }
  componentDidMount () {
    this.sumCount()
  }
  count = {
    balance: 0,
    income: 0,
    pay: 0
  }
  // 计算结余金额
  sumCount = () => {
    this.count.balance = this.count.income = this.count.pay = 0
    if (this.list.length && this.list[0].pay) {
      this.list.map(item => {
        if (item.pay) {
          this.count.pay += item.count * 1
        } else {
          this.count.income += item.count * 1
        }
      })
    }
    this.count.balance = this.count.income - this.count.pay
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [this.props.location.state.start, this.props.location.state.end] } } })]
  }
  // 展示区
  display = () => {
    switch (this.type) {
      case 'day':
        return <Day timeSeg={this.state} />
      case 'week':
        return <Week week={true} timeSeg={this.state} />
      case 'month':
        return (
          <div>
            {/* 预算 */}
            <div className={style.progress}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>本月预算 {(this.balance * 1).numberFormat(2)}</span>
                <span>余额 <span style={{ color: '#e37e00', fontWeight: 500 }}>{(this.balance - this.bal).numberFormat(2)}</span></span>
              </div>
              <div className='balanceProgress'>
                <Progress percent={this.balance && this.balance * 1 > 0 ? (1 - this.bal / this.balance) * 100 : 0} showInfo={false} size="small" strokeColor='orange' />
              </div>
            </div>
            <Month week={true} timeSeg={this.state} />
          </div>
        )
      case 'year':
        return <Year timeSeg={this.state} />
      default:
        break;
    }
  }
  render () {
    this.sumCount()

    return (
      <div className={style.container}>
        {/* 金额汇总区域 */}
        <div className={style.head}>
          <div className={style.count}><span>{this.count.balance.numberFormat(2)}</span><div style={{ textAlign: 'left' }}>结余</div></div>
          <div className={style.count}><span>{this.count.income.numberFormat(2)}</span><div style={{ textAlign: 'center' }}>收入</div></div>
          <div className={style.count}><span>{this.count.pay.numberFormat(2)}</span><div style={{ textAlign: 'right' }}>支出</div></div>
        </div>
        {/* 展示区 */}
        <div className={style.stream}>
          {this.display()}
        </div>
      </div>
    )
  }
}

// 放外面观察传入容器组件的数值用
const mapStatetoProps = (state) => {
  return {
    countData: state.countData || [],
    flash: state.saveCount,
    ofs: state.ofs
  }
}

export default connect(
  mapStatetoProps,
  { getOFS }
)(Stream);
