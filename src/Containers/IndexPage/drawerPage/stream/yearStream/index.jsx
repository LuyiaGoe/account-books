import React from 'react'
import style from './style.module.css'
import { connect } from 'react-redux'
import Month from '../monthStream';
import queryCountData from '../../../../../redux/reducers/countData';
import { Collapse, Progress } from 'antd';
import randomNum from 'number-random'
import { getOFS } from '../../../../../redux/actions/oFS'

const { Panel } = Collapse;

class index extends React.Component {
  constructor(props) {
    getOFS(JSON.parse(localStorage.getItem('allCount')) || [])
    super(props)
    this.state = {
      list: queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [this.props.timeSeg.start, this.props.timeSeg.end] } } }),
      end: this.props.timeSeg.end,
      start: this.props.timeSeg.start,
      sumCount: {
        sum: 0,
        income: 0,
        pay: 0
      },
      // 刷新判断，这个是被修改的账单，关键信息是id，修改过后id将会变化，一个变化了的账单传入，就要刷新页面
      flash: {
        id: void (0)
      },
      // 辅助判断标识
      flag: false
    }
    this.timeSeg = []
    this.displayTime = false
  }

  static getDerivedStateFromProps (nextProps, preState) {
    let { start, end } = nextProps.timeSeg
    let { start: sstart } = preState
    if (start !== sstart) {
      return { ...preState, start, end, displayTime: true }
    }
    if (nextProps.flash && nextProps.flash.id !== preState.flash.id) {
      return { ...preState, flash: nextProps.flash, flag: true }
    }
    return { ...preState, flag: false, displayTime: false }
  }
  shouldComponentUpdate (nextProps, nextState) {
    let { displayTime } = nextState
    if (displayTime) {
      return true
    }
    if (nextProps.flash && nextState.flag) {
      return true
    }
    return false;
  }
  // 对时间按星期划分
  splitAsWeek = () => {
    // 找到该月的第一天与最后一天最后一刻的毫秒数
    let s = this.state.start
    let e = this.state.end
    e = new Date(e).getMonth() + 1
    e = new Date(new Date(s).getFullYear(), e, 1)
    e = new Date(e.getTime() - 1)
    let y = new Date(e).getFullYear()
    let m = new Date(e).getMonth()
    // 按月进行划分
    let i = 0
    while (i <= m) {
      this.timeSeg[i] = { start: new Date(y, m - i, 1).getTime(), end: new Date(y, m + 1 - i, 1).getTime() - 1 }
      i++
    }
    return this.renderWeeks()
  }
  // 渲染每月数据
  renderWeeks = () => {
    return this.timeSeg.map((item, index) => {
      let list = this.queryMonth(item) || []
      list.map(item => {
        if (item.pay) {
          let number = this.state.sumCount.pay + item.count * 1
          this.setState({ ...this.state, sumCount: { ...this.state.sumCount, pay: number } })
        } else {
          let number = this.state.sumCount.income + item.count * 1
          this.setState({ ...this.state, sumCount: { ...this.state.sumCount, income: number } })
        }
      })
      this.state.sumCount.sum = this.state.sumCount.income - this.state.sumCount.pay
      if (!list.length) {
        return (<Panel header={this.renderHead(list, item, index)} key={randomNum(100, 10000, true)} showArrow={false} >
          <div style={{ paddingTop: '20px', marginLeft: '45%', height: '70px', alignItems: 'center', fontSize: '18px', borderBottom: '1px solid #efefef' }}>
            <span>{'暂无数据'}</span>
          </div>
        </Panel>)
      }
      let key = randomNum(1, 10000, false)
      return (
        <Panel header={this.renderHead(list, item, index)} key={key} showArrow={false} >
          <Month week={false} timeSeg={item} ></Month>
        </Panel>
      )
    })
  }
  // 查询每月的数据
  queryMonth = (obj) => {
    let list = queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [obj.start, obj.end] } } })
    return list
  }

  // 月结余头部
  renderHead = (list, item, index) => {
    // 获取周-月-日
    let month = new Date(item.start).getMonth() + 1
    let dayStart = new Date(item.start).getDate()
    let dayEnd = new Date(item.end).getDate()
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
        <div style={{ width: '120px', display: 'flex', justifyContent: 'center', height: '60px', paddingTop: '4px' }}>
          <div >
            <div>
              <span style={{ fontSize: '25px', color: 'black', fontWeight: 600 }}>{this.timeSeg.length - index}</span>
              <span style={{ fontSize: '10px', color: '#787979' }}>月</span>
            </div>
            <div style={{ marginTop: '-10px', fontSize: '10px', color: '#787979' }}>{`${month}.1-${month}.${dayEnd}`}</div>
          </div>
        </div>
        <div className={`${style.headDisplay} monthBalance`} >
          <div style={{ visibility: list[0].id ? 'visible' : 'hidden' }}>
            <div style={{ color: '#e06c62', display: 'flex', flexDirection: 'column' }}>
              <span>收 {compute.income}</span>
              <Progress percent={compute.income ? compute.income / this.state.sumCount.income * 100 : 5} showInfo={false} size="small" strokeColor='#e06c62' />
            </div>
            <div style={{ color: '#56b78c', display: 'flex', flexDirection: 'column' }}>
              <span>支 {compute.pay}</span>
              <Progress percent={compute.pay ? compute.pay / this.state.sumCount.pay * 100 : 5} showInfo={false} size="small" strokeColor='#56b78c' />
            </div>
          </div>
          <div className='balanceA'>
            <div style={{ color: '#787979' }}>结余</div>
            <div style={{ color: 'black', fontWeight: 400, fontSize: '20px', marginTop: '-10px' }}>{compute.sum.numberFormat(2)}</div>
            <Progress percent={compute.sum <= 0 ? 95 : compute.sum >= this.state.sumCount.sum ? 0 : 1 - compute.sum / this.state.sumCount.sum * 100} showInfo={false} size="small" strokeColor='rgb(209, 209, 209)' />
          </div>
        </div>
      </div>
    )
  }
  render () {
    return (
      <div>
        <Collapse accordion className='site_collapse_custom_collapse'>
          {this.splitAsWeek()}
        </Collapse>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      flash: state.saveCount,
      ofs: state.ofs
    }
  }, { getOFS }
)(index);
