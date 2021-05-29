import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import style from './style.module.css'
// antd
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
// actions
import getCountData from '../../../../redux/reducers/countData';
import getofs from '../../../../redux/reducers/oFS';
import { getOFS } from '../../../../redux/actions/oFS'
// components
import Day from './dayStream';
import Week from './weekStream';
import Month from './monthStream';
import Year from './yearStream';

class Stream extends Component {
  constructor(props) {
    super(props)
    this.type = this.props.history.location.params.type
    this.balance = JSON.parse(localStorage.getItem('balance')) || 0
    this.bal = this.props.ofs.monthRevenue.pay
    this.now = new Date().getTime()
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [this.props.location.params.start, this.props.location.params.end] } } })]
  }
  state = {
    start: this.props.location.params.start,
    end: this.props.location.params.end,
    year: new Date(this.props.location.params.end).getFullYear(),
    // 中断更新用，当flash的ID与这个不同，就不渲染页面
    id: 2021,
    // 辅助标识
    flag: false,
  }
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
      return true
    } else {
      if (nextState.id) {
        return true
      }
    }
    return false
  }
  count = {
    balance: 0,
    income: 0,
    pay: 0
  }
  // 计算结余金额
  sumCount = () => {
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [this.state.start, this.state.end] } } })]
    this.bal = getofs('', { type: 'getOFS', data: this.list }).monthRevenue.pay
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
    return (
      <div className={style.head}>
        <div className={style.count}><span>{this.count.balance.numberFormat(2)}</span><div style={{ textAlign: 'left' }}>结余</div></div>
        <div className={style.count}><span>{this.count.income.numberFormat(2)}</span><div style={{ textAlign: 'center' }}>收入</div></div>
        <div className={style.count}><span>{this.count.pay.numberFormat(2)}</span><div style={{ textAlign: 'right' }}>支出</div></div>
      </div>
    )
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
  showHead = () => {
    switch (this.type) {
      case 'day':
        return <span className={style.headContent}>{`今天${new Date(this.state.end).getMonth() + 1}月${new Date(this.state.end).getDate()}日`}</span>
      case 'week':
        return this.headTitle()
      case 'month':
        return this.headTitle()
      case 'year':
        return this.headTitle()
    }
  }
  headTitle = () => {
    let title = ''
    switch (this.type) {
      case 'week':
        title = `${new Date(this.state.start).getFullYear()}年${new Date(this.state.start).getMonth() + 1}月${new Date(this.state.start).getDate()}日 - ${new Date(this.state.end).getMonth() + 1}月${new Date(this.state.end).getDate()}日`
        break
      case 'month':
        title = `${new Date(this.state.start).getFullYear()}年${new Date(this.state.start).getMonth() + 1}月流水`
        break
      case 'year':
        title = `${new Date(this.state.start).getFullYear()}年流水`
        break

      default:
        break;
    }
    return (
      <div className={style.headContent}>
        <span onClick={() => { this.turnPage('left') }} className={style.turning} ><LeftOutlined /></span>
        <span style={{ width: '250px', display: 'inline-block', textAlign: 'center' }}>{title}</span>
        <span onClick={() => { this.turnPage('right') }} className={style.turning}><RightOutlined /></span>
      </div>
    )
  }
  // 翻页
  turnPage = (value) => {
    let { year, start, end } = this.state
    let startArr = {
      year: new Date(start).getFullYear(),
      month: new Date(start).getMonth(),
      date: new Date(start).getDate()
    }
    switch (value) {
      // 左翻页
      case 'left':
        switch (this.type) {
          // 周翻页
          case 'week':
            start -= 86400000 * 7
            end -= 86400000 * 7
            break;
          // 月翻页
          case 'month':
            end = start - 1
            start = new Date(startArr.year, startArr.month - 1, 1).getTime()
            break
          // 年翻页
          case 'year':
            end = new Date(year, 0, 1).getTime() - 1
            year = this.state.year - 1
            start = new Date(year, 0, 1).getTime()
            break
          default:
            break;
        }
        break;
      // 右翻页
      case 'right':
        switch (this.type) {
          // 周翻页
          case 'week':
            start += 86400000 * 7
            end += 86400000 * 7
            break;
          // 月翻页
          case 'month':
            start = new Date(startArr.year, startArr.month + 1, 1).getTime()
            end = new Date(startArr.year, startArr.month + 2, 1).getTime() - 1
            break
          // 年翻页
          case 'year':
            year = this.state.year + 1
            start = new Date(year, 0, 1).getTime()
            end = new Date(year + 1, 0, 1).getTime() - 1
            break
          default:
            break;
        }
        break
    }
    let list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { date: [start, end] } } })]
    this.setState({ ...this.state, start, end, year, list })
  }
  render () {
    return (
      <div className={style.container}>
        {/* 标题区域 */}
        <div className={style.title} >
          {this.showHead()}
        </div>
        {/* 主体区域 */}
        <div style={{ overflow: 'auto' }}>
          {/* 金额汇总区域 */}
          {this.sumCount()}
          {/* 展示区 */}
          <div className={style.stream}>
            {this.display()}
          </div>
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
)(withRouter(Stream));
