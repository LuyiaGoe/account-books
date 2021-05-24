import React, { Component } from 'react';
import { connect } from 'react-redux'
import style from './style.module.css'
// actions
import { getCountData } from '../../../../redux/actions/countData';
// components
import Day from './dayStream';

class Stream extends Component {
  state = {
    list: []
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.countData.length !== prevState.list.length) {
      return ({ list: [...nextProps.countData] })
    }
    return null
  }
  componentDidMount () {
    getCountData({ list: 'all', demand: {} })
  }
  render () {
    return (
      <div className={style.container}>
        {/* 金额汇总区域 */}
        <div className={style.head}>
          <div className={style.count}><span>0.00</span><div style={{ textAlign: 'left' }}>结余</div></div>
          <div className={style.count}><span>0.00</span><div style={{ textAlign: 'center' }}>收入</div></div>
          <div className={style.count}><span>0.00</span><div style={{ textAlign: 'right' }}>支出</div></div>
        </div>
        {/* 展示区 */}
        <div className={style.stream}>
          <Day list={this.state.list}></Day>
        </div>
      </div>
    )
  }
}

// 放外面观察传入容器组件的数值用
const mapStatetoProps = (state) => {
  return {
    countData: state.countData || []
  }
}

export default connect(
  mapStatetoProps,
  { getCountData }
)(Stream);
