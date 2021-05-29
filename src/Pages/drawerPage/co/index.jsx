import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import style from './style.module.css'
// antd
import { DeleteOutlined } from '@ant-design/icons';
import { Collapse, Progress } from 'antd';
// actions
import getofs from '../../../redux/reducers/oFS';
import { getOFS } from '../../../redux/actions/oFS'
// import { getCountData } from '../../../redux/actions/countData';
import getCountData from '../../../redux/reducers/countData';
import { GETCOUNTDATA } from '../../../redux/constant'
// components
import Day from './stream/dayStream';
import Week from './stream/weekStream';
import Month from './stream/monthStream';
import random from 'number-random';
const { Panel } = Collapse;

class Stream extends Component {
  constructor(props) {
    super(props)
    this.state = { type: this.props.history.location.params.type }
    this.list = getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { account: this.state.type } } })
    this.assetsArr = {}
    this.start = 0
    this.end = new Date().getTime()
    this.arrKeys = []
    this.count = { balance: 0, income: 0, pay: 0 }
    this.state = { flash: null }
    this.flag = 0
  }
  static getDerivedStateFromProps (nextProps, preState) {
    if (nextProps.flash) {
      return { ...preState, flash: nextProps.flash }
    }
    return { ...preState }
  }
  // shouldComponentUpdate (nextProps, nextState) {
  //   // if (nextState.flash && this.flag !== nextState.flash.id) return true
  //   return false
  // }
  a = 0
  queryAssets = () => {
    this.flag = this.state.flash ? this.state.flash.id : 0
    if (!this.list.length || this.list.length === 1 && !this.list[0].id) return null
    this.list.map(item => {
      this.start = this.start < item.date ? this.start : item.date
      this.end = this.end > item.date ? this.end : item.date
      let year = new Date(item.date).getFullYear()
      let month = new Date(item.date).getMonth()

      if (this.assetsArr[`${year}.${month}`]) {
        this.assetsArr[`${year}.${month}`].add(item)
      } else {
        this.assetsArr[`${year}.${month}`] = new Set()
        this.assetsArr[`${year}.${month}`].add(item)
      }
    })
    this.arrKeys = Object.keys(this.assetsArr)
    if (this.arrKeys.length > 1) {
      this.arrKeys.sort((a, b) => {
        return b - a
      })
    }
  }
  // 删除账单
  deleteCount = (e) => {
    e.stopPropagation();
    this.countId = e.target.parentNode.parentNode.parentNode.dataset.key
    if (this.countId === undefined) {
      return null
    } else {
      this.setState({ ...this.state, isModalVisible: true })
    }
  }
  keys = ['di1', 'di2', 'di3', 'di4', 'di5', 'di6', 'di7', 'di8', 'di9', 'di10', 'di11']
  renderAssets = () => {
    this.queryAssets()
    return this.arrKeys.map((item1, index) => {
      // 取出一个月的count数据，为数组形式
      return (
        <Panel header={this.renderHead([...this.assetsArr[item1]])} key={this.keys[index]} showArrow={false} key={this.keys.index} >
          <Week week={false} timeSeg={[...this.assetsArr[item1]]}></Week>
        </Panel>
      )
    })
  }

  renderHead = (list) => {
    // 获取周-月-日
    let month = new Date(list[0].date).getMonth() + 1
    month = month < 10 ? '0' + month : month
    let year = new Date(list[0].date).getFullYear()
    let dayEnd = new Date(year, month, 1).getTime() - 1
    dayEnd = new Date(dayEnd).getDate()
    // 获取收支、结余
    let compute = {
      sum: 0,
      pay: 0,
      income: 0
    }
    list.length === 0 ? list = [{ pay: true, count: 0 }] : list = list
    if (list.length) {
      list.reduce((pre, cur) => {
        if (cur.pay) {
          pre.pay += cur.count * 1
        } else {
          pre.income += cur.count * 1
        }
        return pre
      }, compute)
    }
    compute.sum = compute.income - compute.pay
    return (
      <div className={style.collapsHead}>
        <div style={{ width: '120px', display: 'flex', justifyContent: 'center', height: '60px', paddingTop: '10px' }}>
          <div >
            <div>
              <span style={{ fontSize: '25px', color: 'black', fontWeight: 600 }}>{month}</span>
              <span style={{ fontSize: '10px', color: '#787979' }}>/{year}</span>
            </div>
            <div style={{ marginTop: '-10px', fontSize: '10px', color: '#787979' }}>{`${month}.01-${month}.${dayEnd}`}</div>
          </div>
        </div>
        <div className={`${style.headDisplay} monthBalance`} >
          <div style={{ visibility: list[0].id ? 'visible' : 'hidden' }}>
            <div style={{ color: '#e06c62', display: 'flex', flexDirection: 'column' }}>
              <span>流入 {compute.income}</span>
              <Progress percent={compute.income ? compute.income / this.count.income * 100 : 5} showInfo={false} size="small" strokeColor='#e06c62' />
            </div>
            <div style={{ color: '#56b78c', display: 'flex', flexDirection: 'column', marginTop: '15px' }}>
              <span>流出 {compute.pay}</span>
              <Progress percent={compute.pay ? compute.pay / this.count.pay * 100 : 5} showInfo={false} size="small" strokeColor='#56b78c' />
            </div>
          </div>
          <div className='balanceA'>
            <div style={{ color: '#787979', textAlign: 'right' }}>结余</div>
            <div style={{ color: 'black', fontWeight: 400, fontSize: '20px', marginTop: '-10px', textAlign: 'right' }}>{compute.sum.numberFormat(2)}</div>
            <Progress percent={compute.sum <= 0 ? 95 : compute.sum >= this.count.sum ? 0 : 1 - compute.sum / this.count.sum * 100} showInfo={false} size="small" strokeColor='rgb(209, 209, 209)' trailColor={'#787979'} />
          </div>
        </div>
      </div>
    )
  }
  // 计算结余金额
  sumCount = () => {
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { account: this.type } } })]
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
        <div className={style.count}><span style={{ textAlign: 'left' }}>{this.count.balance.numberFormat(2)}</span><div style={{ textAlign: 'left' }}>账户余额</div></div>
        <div className={style.count}><span style={{ textAlign: 'center' }}>{this.count.income.numberFormat(2)}</span><div style={{ textAlign: 'center' }}>流入总额</div></div>
        <div className={style.count}><span style={{ textAlign: 'right' }}>{this.count.pay.numberFormat(2)}</span><div style={{ textAlign: 'right' }}>流出总额</div></div>
      </div>
    )
  }

  render () {
    return (
      <div>
        {/* 金额汇总区域 */}
        {this.sumCount()}
        {/* 内容区域 */}
        <Collapse accordion className='site_collapse_custom_collapse' style={{ display: 'block', paddingTop: '120px' }}>
          {this.renderAssets()}
        </Collapse>
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
