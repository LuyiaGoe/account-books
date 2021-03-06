import React, { Component } from 'react';
import { connect } from 'react-redux'
import style from './style.module.css'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Day from '../dayStream';
import queryCountData from '../../../../../redux/reducers/countData';
import randomNum from 'number-random';

class index extends Component {
  constructor(props) {
    super(props)
    this.type = this.props.type
    this.state = {
      list: queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { account: this.type, date: [this.props.timeSeg.start, this.props.timeSeg.end] } } }),
      end: this.props.timeSeg.end,
      start: this.props.timeSeg.start
    }
    this.timeSeg = []
    this.sflag = 0
  }
  static getDerivedStateFromProps (nextProps, preState) {
    const { timeSeg: { start, end } } = nextProps
    if (start !== preState.start) {
      return { ...preState, start, end }
    }
    return { ...preState }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.saveCount) return true
    if (this.sflag !== nextState.start) return true
    return false
  }
  // 对时间进行按天分段
  splitAsDay = () => {
    this.sflag = this.state.start
    let s = this.state.start
    let e = this.state.end
    for (let i = 0; i < 7; i++) {
      this.timeSeg[i] = { start: s, end: s + 86400000 }
      s += 86400000
    }
    return this.renderDays()
  }
  // 查找每一天是否有数据
  queryDay = (arr) => {
    let list = queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [arr.start, arr.end] } } })
    return list
  }
  flag = true
  // 渲染每一天数据
  renderDays = () => {
    let weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return (
      this.timeSeg.map(item => {
        this.flag = true
        let list = this.queryDay(item) || []
        let sumCount = {
          sum: 0,
          income: 0,
          pay: 0
        }
        // 查询是否存在数据，不存在就不渲染
        if (!list.length) return null
        this.flag = false
        list.map(item => {
          if (item.pay) {
            sumCount.pay += item.count * 1
          } else {
            sumCount.income += item.count * 1
          }
        })
        sumCount.sum = sumCount.income - sumCount.pay
        // 存在就渲染
        return (
          <div className={style.dayContain} style={{ marginTop: this.props.week ? '-70px' : '0px' }} key={randomNum(100, 10000, true)} >
            <span className={style.dateWeek}>
              <span className={style.dateSec}>{new Date(item.start).getDate()}</span>
              <span className={style.weekSec}>{weekStr[new Date(item.start).getDay()]}</span>
            </span>
            <div className={style.detail}>
              <div className={style.headBar} style={{ display: this.props.week ? 'flex' : 'none' }}>
                <div>
                  <PlusCircleOutlined />
                  <span className={style.sumCount}>&nbsp;&nbsp;{sumCount.income.numberFormat(2)}</span>
                </div>
                <div>
                  <MinusCircleOutlined />
                  <span className={style.sumCount}>&nbsp;&nbsp;{sumCount.pay.numberFormat(2)}</span>
                </div>
                <div>
                  <svg t="1621922884268" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2525" width="18" height="18">
                    <path d="M512 955.733333c-98.679467 0-183.995733-35.259733-253.559467-104.840533S153.6 696.0128 153.6 597.333333s35.2768-183.995733 104.840533-253.559466c43.4688-43.4688 92.996267-73.5744 148.002134-90.0608l-80.366934-160.750934A17.066667 17.066667 0 0 1 341.333333 68.266667h341.333334a17.032533 17.032533 0 0 1 15.274666 24.695466l-80.3328 160.6656c54.8864 16.469333 104.3968 46.609067 147.968 90.146134C835.140267 413.3376 870.4 498.653867 870.4 597.333333s-35.259733 183.978667-104.840533 253.559467S610.679467 955.733333 512 955.733333z m0.426667-686.421333a16.964267 16.964267 0 0 1-10.24 3.7376c-84.9408 2.133333-158.8224 34.065067-219.613867 94.856533C219.648 430.848 187.733333 508.040533 187.733333 597.333333s31.914667 166.485333 94.839467 229.4272C345.514667 889.7024 422.7072 921.6 512 921.6s166.485333-31.8976 229.4272-94.839467C804.369067 763.818667 836.266667 686.626133 836.266667 597.333333s-31.8976-166.485333-94.839467-229.4272C680.618667 307.114667 607.010133 275.2 522.666667 273.066667a16.930133 16.930133 0 0 1-10.24-3.754667zM368.9472 102.4l71.492267 143.0016a370.961067 370.961067 0 0 1 60.8768-6.4512 15.36 15.36 0 0 1 11.1104 3.7376 16.042667 16.042667 0 0 1 11.093333-3.7376c20.616533 0.512 40.6528 2.645333 60.074667 6.365867L655.0528 102.4H368.9472z" p-id="2526" fill="#8a8a8a"></path><path d="M512.853333 838.826667a34.133333 34.133333 0 0 1-34.133333-34.133334v-7.2192c-19.114667-5.495467-36.334933-15.854933-51.438933-30.941866-22.272-22.272-33.9456-49.629867-34.747734-81.322667a34.1504 34.1504 0 0 1 33.28-34.9696c18.688-1.092267 34.5088 14.4384 34.9696 33.262933 0.341333 13.9776 5.034667 25.019733 14.762667 34.747734 10.6496 10.666667 22.510933 15.616 37.307733 15.616 13.4144 0 24.32-4.829867 34.3552-15.2064 11.1616-10.820267 15.991467-22.016 15.991467-35.9936 0-14.216533-4.949333-25.8048-15.598933-36.4544-10.069333-10.069333-20.8384-14.7456-33.8944-14.7456h-2.56c-24.763733 0-47.189333-6.980267-66.6624-20.7872a155.921067 155.921067 0 0 1-17.186134-14.779734C404.224 572.8256 392.533333 544.904533 392.533333 512.853333c0-33.2288 11.554133-61.5936 34.3552-85.162666 15.394133-14.916267 32.392533-25.002667 50.978134-30.429867v-7.287467a34.133333 34.133333 0 0 1 68.266666 0v7.287467c18.517333 5.410133 35.1744 15.445333 49.749334 30.020267 22.801067 22.784 34.781867 50.141867 35.566933 81.288533a34.1504 34.1504 0 0 1-33.245867 35.003733l-0.887466 0.017067a34.116267 34.116267 0 0 1-34.0992-33.262933c-0.3584-13.4144-5.307733-24.456533-15.598934-34.747734C537.531733 465.476267 526.2336 460.8 512 460.8c-14.455467 0-26.1632 4.8128-36.846933 15.1552C465.6128 485.8368 460.8 497.544533 460.8 512c0 14.506667 4.676267 25.531733 14.7456 35.584 2.8672 2.8672 5.956267 5.546667 9.147733 7.936 7.168 5.0688 15.8208 7.68 26.453334 7.68h2.56c31.488 0 59.118933 11.707733 82.176 34.7648C619.485867 621.568 631.466667 650.069333 631.466667 682.666667c0 32.3584-12.4416 61.508267-35.9936 84.2752a114.039467 114.039467 0 0 1-48.4864 30.122666v7.645867a34.133333 34.133333 0 0 1-34.133334 34.116267zM682.666667 290.133333H341.333333a34.133333 34.133333 0 0 1 0-68.266666h341.333334a34.133333 34.133333 0 0 1 0 68.266666z" p-id="2527" fill="#8a8a8a">
                    </path>
                  </svg>
                  <span className={style.sumCount}>&nbsp;&nbsp;{sumCount.sum.numberFormat(2)}</span>
                </div>
              </div>
              {/* 主体展示区域 */}
              <div>
                <Day timeSeg={item} type={this.type}></Day>
              </div>
            </div>
          </ div>
        )
      })
    )
  }
  render () {
    return (
      <div className={style.container} >
        {this.splitAsDay()}
        <div style={{ display: this.props.week ? 'flex' : 'none', marginLeft: '45%', height: '70px', alignItems: 'center', fontSize: '18px', borderBottom: '1px solid #efefef' }}>
          <span>暂无数据</span>
        </div>
      </div>
    );
  }
}
const mapState = (state) => {
  return {
    flash: state.saveCount
  }
}
export default connect(
  mapState
)(index);
