import React, { Component } from 'react';
import style from './style.module.css'
import { connect } from 'react-redux'
// antd
import { Row, Col, Card, Progress, Drawer, Button } from 'antd'
// components
import Pay from '../../../../AddACount/Pay/Pay';
// actions
import { getCountData } from '../../../../../redux/actions/countData';

class DaySteam extends Component {
  state = {
    list: this.props.list,
    visible: false,
    selected: this.props.selected || [{ id: 0, pay: true }]
  }
  static getDerivedStateFromProps (nextProps, preState) {
    const { list, selected } = nextProps
    if (list !== preState.length) {
      return { ...nextProps, list: preState.list }
    }
    return null
  }
  // 渲染this.state.list每条数据
  renderList = () => {
    let keyArr = Object.keys(this.state.list)
    return (
      keyArr.map(item => {
        const { id, category, account, pay, count } = this.state.list[item]
        return (
          <div className={style.row} key={id} data-key={id}>
            <div>
              <span>{category.split('>')[0]}</span>
              <span>{account}</span>
            </div>
            <div style={{ color: !pay ? '#e17167' : '#56b78c' }}>￥{count}</div>
          </div>
        )
      }))
  }
  // 查看、修改具体账单
  editCount = (e) => {
    let id
    if (e.target.dataset.key) {
      id = e.target.dataset.key
    } else {
      if (e.target.parentNode.dataset.key) {
        id = e.target.parentNode.dataset.key
      } else {
        id = e.target.parentNode.parentNode.dataset.key
      }
    }
    this.props.getCountData({ list: 'all', demand: { id: id } })
    this.onOpen()
  }
  // 关闭抽屉
  onClose = (e) => {
    this.setState({ ...this.state, visible: false })
  }
  // 打开抽屉
  onOpen = () => {
    this.setState({ ...this.state, visible: true })
  }
  // 抽屉头部区域
  title = () => {
    return (
      <div className={style.head} style={{ display: 'flex', flexDirection: 'row-reverse', padding: 0, width: '700px' }}>
        <Button type="text" onClick={this.onClose} danger style={{ fontSize: '20px', color: 'brown', marginTop: '20px' }}>
          关闭
        </Button>
        <span className={style.headname}>编 辑</span>
      </div>
    )
  }

  render () {
    return (
      <div>
        {/* 展示区 */}
        <div className={style.container}>
          <div className={style.card} onClick={this.editCount}>
            {this.renderList()}
          </div>
        </div>
        {/* 抽屉区 */}
        <Drawer
          title={this.title()}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={'700px'}
          headerStyle={{ margin: 0, padding: 0 }}
          className={style.drawerBody}
          destroyOnClose={true}
        >
          <div style={{ paddingTop: '80px', width: '700px', transform: 'translateX(0)', overflow: 'auto', height: '100%' }}>
            <Pay pay={this.state.selected[0].pay} count={this.state.selected}></Pay>
          </div>
        </Drawer>

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return { selected: state.countData }
}
export default connect(
  mapStateToProps,
  { getCountData }
)(DaySteam);
