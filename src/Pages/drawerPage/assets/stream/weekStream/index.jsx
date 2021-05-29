import React, { Component } from 'react';
import { connect } from 'react-redux'
import style from './style.module.css'
import Day from '../dayStream';
import randomNum from 'number-random';

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      end: this.props.timeSeg.end,
      start: this.props.timeSeg.start
    }
    this.timeSeg = this.props.timeSeg
    this.list = []
    this.sflag = 0
  }
  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { timeSeg } = nextProps
  //   if (start !== preState.start) {
  //     return { ...preState, start, end }
  //   }
  //   return { ...preState }
  // }
  shouldComponentUpdate (nextProps, nextState) {
    // if (nextProps.saveCount) return true
    // if (this.sflag !== nextState.start) return true
    return true
  }
  flag = true
  // 渲染每一天数据
  weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  renderDays = () => {
    let id = this.timeSeg.map(item => {
      return item.id
    })
    id = id.slice(0, id.length / 2)
    this.list = this.timeSeg.slice(0, id.length)
    return (
      this.list.map(item => {
        this.flag = true
        // 查询是否存在数据，不存在就不渲染
        this.flag = false
        // 存在就渲染
        return (
          <div className={style.detail} key={item.id}>
            {/* 主体展示区域 */}
            <Day timeSeg={item}></Day>
          </div>
        )
      })
    )
  }
  render () {
    return (
      <div className={style.container} >
        <div className={style.dayContain} style={{ marginTop: this.props.week ? '-70px' : '0px' }} key={randomNum(100, 10000, true)} >
          <span className={style.dateWeek}>
            <span className={style.dateSec}>{new Date(this.timeSeg[0].date).getDate()}</span>
            <span className={style.weekSec}>{this.weekStr[new Date(this.timeSeg[0].date).getDay()]}</span>
          </span>
          {this.renderDays()}
        </ div>
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
