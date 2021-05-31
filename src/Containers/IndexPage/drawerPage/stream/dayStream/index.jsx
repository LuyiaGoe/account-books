import React, { Component } from 'react';
import style from './style.module.css'
import { connect } from 'react-redux'
// antd
import { Drawer, Modal, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons';
// components
import Pay from '../../../../AddACount/Pay/Pay';
// actions
import { getCountData } from '../../../../../redux/actions/countData';
import { deleteCount } from '../../../../../redux/actions/saveCount';
// reducer
import queryCountData from '../../../../../redux/reducers/countData';
import random from 'number-random';

class DaySteam extends Component {
  // 直接通过父组件传下来的时间段timeSeg查询目标账单清单
  state = {
    // 初始化时循环渲染的账单列表
    list: queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [this.props.timeSeg.start, this.props.timeSeg.end] } } }),
    // 编辑页面可视标识
    visible: false,
    // 被选中的账单
    selected: this.props.selected || [{ id: 0, pay: true }],
    // 删除窗口可视标志
    isModalVisible: false,
    // 刷新判断，这个是被修改的账单，关键信息是id，修改过后id将会变化，一个变化了的账单传入，就要刷新页面
    flash: { id: void (0) },
    // 辅助判断标识
    flag: false
  }
  static getDerivedStateFromProps (nextProps, preState) {
    const { selected, flash } = nextProps
    // list为空，没有账单时
    if (preState.list.length === 0) {
      return { ...preState, visible: false }
    }
    // 有编辑、删除改动的传入（flash不为null）
    if (flash && !preState.flag) {
      return { ...preState, list: queryCountData('', { type: 'getCountData', data: { list: 'all', demand: { date: [nextProps.timeSeg.start, nextProps.timeSeg.end] } } }), flag: true, visible: false }
    }
    // 传入账单有且仅有一个，且selected[0].id不等于0时，说明返回的是要编辑的账单,当全部账单只有一个时，也会通过这个判断，成为bug，加个flash判断条件
    if (selected.length === 1 && selected[0].id !== 0) {
      return { ...preState, selected: nextProps.selected, flag: false }
    }
    return { ...preState, flag: false }
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.flash === null) {
      return true
    }
    if (nextProps.flash && (nextState.flag || nextState.isModalVisible)) {
      return true
    }
    return false;
  }

  countId = 0
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
  // 确认删除
  handleOk = (e) => {
    e.stopPropagation();
    this.props.deleteCount(this.countId)
    this.setState({ ...this.state, isModalVisible: false })
  }
  // 取消删除
  handleCancel = (e) => {
    e.stopPropagation();
    this.setState({ ...this.state, isModalVisible: false })
  }
  isModalVisible = []
  // 渲染this.state.list每条数据
  renderList = () => {
    let keyArr = Object.keys(this.state.list)
    if (keyArr.length === 0) {
      return (
        <div className={style.row} style={{ cursor: 'default' }} onClick={(e) => { return e.stopPropagation() }}>
          <div style={{ marginLeft: '45%' }}>
            <span>{'暂无数据'}</span>
          </div>
        </div>
      )
    }
    return (
      keyArr.map(item => {
        const { id, category, account } = this.state.list[item]
        return (
          <div className={style.row} key={random(1, 10000, false)} data-key={id} onClick={(e) => { e.stopPropagation() }}>
            <div style={{ marginLeft: id ? '0' : '45%' }}>
              <span>{category ? category.split('>')[0] : '暂无数据'}</span>
              <span>{account}</span>
            </div>
          </div>
        )
      }))
  }
  // 查看、修改具体账单
  editCount = (e) => {
    if (e.target.className === 'ant-modal-footer' || e.target.className === 'ant-modal-title' || e.target.className === 'ant-modal-body' || e.target.innerHTML === '确定进行删除？') {
      e.stopPropagation()
      return null
    }
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
  onOpen = (e) => {
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
  a = 0
  render () {
    this.a++
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
            <Pay pay={this.state.selected.length ? this.state.selected[0].pay : true} count={this.state.selected}></Pay>
          </div>
        </Drawer>
        {/* 删除弹窗 */}
        <Modal title="警告" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} width={300}>
          <p>确定进行删除？</p>
        </Modal>

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    selected: state.countData,
    flash: state.saveCount
  }
}
export default connect(
  mapStateToProps,
  { getCountData, deleteCount }
)(DaySteam);
