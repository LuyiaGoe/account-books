import React from 'react'
import style from './style.module.css'
import { connect } from 'react-redux'
import Week from '../weekStream';
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
    this.sflag = 0
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { timeSeg: { start, end } } = nextProps
    if (nextProps.flash && nextProps.flash.id !== preState.flash.id) {
      return { ...preState, flash: nextProps.flash, flag: true }
    }
    if (start !== preState.start) {
      return { ...preState, start, end }
    }
    return { ...preState, flag: false }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.flash && nextState.flag) {
      return true
    }
    if (this.sflag !== nextState.start) return true
    return false;
  }
  // 对时间按星期划分
  splitAsWeek = () => {
    this.sflag = this.state.start
    // 找到该月的第一天与最后一天最后一刻的毫秒数
    let s = this.state.start
    let e = this.state.end
    e = new Date(e).getMonth() + 1
    e = new Date(new Date(s).getFullYear(), e, 1)
    e = new Date(e.getTime() - 1)
    // 按周进行划分
    let i = 0
    while (s < e) {
      this.timeSeg[i] = { start: e - 86400000 * 7, end: e }
      e = this.timeSeg[i].start
      i++
    }
    this.timeSeg[--i].start = new Date(new Date(s).getFullYear(), new Date(s).getMonth(), 1).getTime()
    this.timeSeg[0].end = this.timeSeg[0].end.getTime()
    return this.renderWeeks()
  }
  // 渲染每周数据
  keys = ['1zhou', '2zhou', '3zhou', '4zhou', '5zhou']
  renderWeeks = () => {
    return this.timeSeg.map((item, index) => {
      let list = this.queryWeek(item) || []
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
      return (
        <Panel header={this.renderHead(list, item, index)} key={this.keys[index]} showArrow={false} >
          <Week week={this.props.week} timeSeg={item}></Week>
        </Panel>
      )
    })
  }

  // 按月划分
  splitAsMonth = () => {
    // 找到该月的第一天与最后一天最后一刻的毫秒数
    let s = this.state.start
    let e = this.state.end
    e = new Date(e).getMonth() + 1
    e = new Date(new Date(s).getFullYear(), e, 1)
    e = new Date(e.getTime() - 1)
    // 按周进行划分
    let i = 0
    while (s < e) {
      this.timeSeg[i] = { start: e - 86400000 * 7, end: e }
      e = this.timeSeg[i].start
      i++
    }
    this.timeSeg[--i].start = new Date(new Date(s).getFullYear(), new Date(s).getMonth(), 1).getTime()
    this.timeSeg[0].end = this.timeSeg[0].end.getTime()
    return this.renderMonth()
  }
  // 渲染月数据
  renderMonth = () => {
    return this.timeSeg.map((item) => {
      let list = this.queryWeek(item) || []
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
      return (
        <Week week={this.props.week} timeSeg={item} key={randomNum(1, 10000, true)}></Week>
      )
    })
  }


  // 查询账单数据
  queryWeek = (obj) => {
    let list = queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [obj.start, obj.end] } } })
    return list
  }

  // 周结余头部
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
        <div style={{ width: '120px', display: 'flex', justifyContent: 'center', height: '60px', paddingTop: '10px' }}>
          <div >
            <div>
              <span style={{ fontSize: '25px', color: 'black', fontWeight: 600 }}>{this.timeSeg.length - index}</span>
              <span style={{ fontSize: '10px', color: '#787979' }}>周</span>
            </div>
            <div style={{ marginTop: '-10px', fontSize: '10px', color: '#787979' }}>{`${month}.${dayStart}-${month}.${dayEnd}`}</div>
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
            <Progress percent={compute.sum <= 0 ? 95 : compute.sum >= this.state.sumCount.sum ? 0 : 1 - compute.sum / this.state.sumCount.sum * 100} showInfo={false} size="small" strokeColor='rgb(209, 209, 209)' trailColor={'#787979'} />
          </div>
        </div>
      </div>
    )
  }
  render () {
    return (
      <div>
        <Collapse accordion defaultActiveKey={[this.keys[0]]} className='site_collapse_custom_collapse' style={{ display: this.props.week ? 'block' : 'none' }}>
          {this.splitAsWeek()}
        </Collapse>
        <div style={{ display: !this.props.week ? 'block' : 'none' }}>
          {this.splitAsMonth()}
        </div>
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
