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
import Day from '../../../Containers/IndexPage/drawerPage/stream/dayStream';
import Week from '../../../Containers/IndexPage/drawerPage/stream/weekStream';
import Month from '../../../Containers/IndexPage/drawerPage/stream/monthStream';
import Year from '../../../Containers/IndexPage/drawerPage/stream/yearStream';
import random from 'number-random';
const { Panel } = Collapse;

class Stream extends Component {
  constructor(props) {
    super(props)
    this.type = this.props.location.params.type
    this.list = getCountData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { account: this.type } } })
    this.assetsArr = {}
    this.start = 0
    this.end = new Date().getTime()
    this.arrKeys = []
  }
  a = 0
  queryAssets = () => {
    if (!this.list.length || this.list.length === 1 && !this.list[0].id) return null
    this.list.map(item => {
      this.start = this.start < item.date ? this.start : item.date
      this.end = this.end > item.date ? this.end : item.date
      let year = new Date(item.date).getFullYear()
      let month = new Date(item.date).getMonth()
      if (this.assetsArr[`${year}.${month}`]) {
        this.assetsArr[`${year}.${month}`].push(item)
      } else {
        this.assetsArr[`${year}.${month}`] = [item]
      }
      let s = new Set(this.assetsArr[`${year}.${month}`])
      this.assetsArr[`${year}.${month}`] = Array.from(s)
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
  renderAssets = () => {
    this.queryAssets()
    return this.arrKeys.map((item1, index) => {
      // 取出一个月的count数据，为数组形式
      return (<Panel header={`this.renderHead()`} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
        {this.assetsArr[item1].map(item => {
          this.a++
          const { id, category, account, pay, count } = item
          console.log(item);
          // return <div>123</div>
          return (<div>
            {this.a}
            <div className={style.row} key={random(1, 10000, false)} data-key={id} >
              <div style={{ marginLeft: id ? '0' : '45%' }}>
                <span>{category ? category.split('>')[0] : '暂无数据'}</span>
                <span>{account}</span>
              </div>
              <div style={{ color: !pay ? '#e17167' : '#56b78c', display: id ? 'block' : 'none' }}>￥{count}</div>
              <div style={{ position: 'absolute', right: '25px', paddingTop: '14px', width: '20px', height: '20px' }} onClick={this.deleteCount}>
                <DeleteOutlined />
              </div>
            </div>
          </div>
          )
        })}
      </Panel>)
    })
  }
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
        <Collapse accordion className='site_collapse_custom_collapse' style={{ display: 'block' }}>
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
