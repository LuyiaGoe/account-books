import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import style from './style.module.css'
// antd
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Collapse, Progress } from 'antd';
// actions
import getCountData from '../../../../redux/reducers/countData';
import getofs from '../../../../redux/reducers/oFS';
import { getOFS } from '../../../../redux/actions/oFS'
// components
import Day from './dayStream';
import Week from './weekStream';
import Month from './monthStream';
import Year from './yearStream';
const { Panel } = Collapse;

class Stream extends Component {
  constructor(props) {
    super(props)
    this.type = this.props.history.location.params.type
    this.balance = JSON.parse(localStorage.getItem('balance')) || 0
    this.bal = this.props.ofs.monthRevenue.pay
    this.now = new Date().getTime()
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { account: this.props.history.location.params.type } } })]
  }
  state = {
    type: this.props.history.location.params.type,
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
    this.list = [...getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { account: this.state.type, date: [this.state.start, this.state.end] } } })]
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
  headTitle = () => {
    return (
      <div className={style.headContent}>
        <span style={{ width: '250px', display: 'inline-block', textAlign: 'center' }}>{this.state.type}</span>
      </div>
    )
  }
  renderHead = () => {
    let time = new Date(),
      month = time.getMonth() + 1,
      year = time.getFullYear(),
      lastMonth = new Date(year, month, 1).getTime() - 1,
      lastDate = new Date(lastMonth).getDate()
    month = month < 10 ? '0' + month : month
    return (
      <div className={style.collapsHead}>
        <div style={{ width: '120px', display: 'flex', justifyContent: 'center', height: '60px', paddingTop: '10px' }}>
          <div >
            <div>
              <span style={{ fontSize: '25px', color: 'black', fontWeight: 600 }}>{month}</span>
              <span style={{ fontSize: '10px', color: '#787979' }}>/{year}</span>
            </div>
            <div style={{ marginTop: '-10px', fontSize: '10px', color: '#787979' }}>{`${month}.1-${month}.${lastDate}`}</div>
          </div>
        </div>
        <div className={`${style.headDisplay} monthBalance`} >
          <div>
          </div>
          <div className='balanceA'>
            <div style={{ color: '#787979', textAlign: 'right' }}>结余</div>
            <div style={{ color: 'black', textAlign: 'right', fontWeight: 400, fontSize: '20px', marginTop: '-10px' }}>0.00</div>
            <Progress percent={95} showInfo={false} size="small" strokeColor='rgb(209, 209, 209)' trailColor={'#787979'} />
          </div>
        </div>
      </div>

    )
  }
  render () {
    return (
      <div className={style.container}>
        {/* 标题区域 */}
        <div className={style.title} >
          {this.headTitle()}
        </div>
        {/* 主体区域 */}
        <div style={{ overflow: 'auto' }}>
          {/* 金额汇总区域 */}
          {this.sumCount()}
          {/* 展示区 */}
          <div className={style.stream}>
            <Collapse style={{ border: 'none', display: this.list.length ? 'none' : 'block' }} accordion defaultActiveKey={['abc']}>
              <Panel header={this.renderHead()} showArrow={false} key='abc'>
                <div style={{ paddingTop: '20px', marginLeft: '45%', height: '70px', alignItems: 'center', fontSize: '18px', borderBottom: '1px solid #efefef' }}>
                  <span>{'暂无数据'}</span>
                </div>
              </Panel>
            </Collapse>
            <Year timeSeg={this.state} type={this.type} />
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
