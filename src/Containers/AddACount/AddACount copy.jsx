import React, { useEffect, useRef, useState, useRef } from 'react'
import { connect } from 'react-redux'
import style from './style.module.css'
import Pay from './Pay/Pay';
import Tag from './tag'
import globalContext from '../../globalContext'

import { Tabs, Drawer, Row, Col, Card, Button, Collapse } from 'antd';
import { RightOutlined, EditOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

const Provider = globalContext.Provider;

let mainAnimation = {}

const { TabPane } = Tabs;

function Index () {
  const mainRef = useRef(null)
  const [state, setState] = useState({ visible: false, pay: true, paylist: [{ id: 0 }], paylist: [{ id: 0 }], edit: false, tempVisible: false })
  let classn = style.handleHead
  useEffect(() => {
  }, [])
  // 外推main动画
  const mainOut = () => {
    mainRef.current.className += ` ${style.mainMoveOut}`
  }
  // 推回来main 动画
  const mainIn = () => {
    mainRef.current.className += ` ${style.mainMoveIn}`
    // return
    setTimeout(() => {
      mainRef.current.className = classn
    }, 100)
  }
  // 整合推动main的动画，准备放入Provider中送入子组件触发
  mainAnimation = {
    mainOut,
    mainIn
  }
  // 关闭模板页面
  const onClose = () => {
    setState({ ...state, visible: false })
  }
  // 打开模板
  const onOpen = () => {
    setState({ ...state, visible: true })
  }
  // 模板头部
  const title = () => {
    return <div className={style.title}>
      <span>记账模板</span>
      <span className={style.close} onClick={onClose}>×</span>
    </div>
  }
  // 模板展示区域
  const display = () => {
    let tempList = JSON.parse(localStorage.getItem('allTemp')) || []
    let count = tempList.length
    let flag = false
    if (count) {
      tempList.map(item => {
        if (item.pay === state.pay) { flag = true }
      })
    }
    if (!flag) {
      return (
        <div className={style.display}>
          <svg style={{ margin: '100px auto auto 50%', transform: 'translateX(-50%)' }} t="1622429951658" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2692" width="200" height="200"><path d="M131.25 147.4c-0.63 0.66-1.23 1.36-1.82 2a0.18 0.18 0 0 1-0.05 0.07l-0.15 0.25c1.28-1.41 1.9-2.15 2.08-2.42z" fill="#bfbfbf" p-id="2693"></path><path d="M927 615H731.93V178.58v-11.46a95.06 95.06 0 0 0-9.39-40.93c-12.54-26.8-40.1-43.25-68.85-45.93-3.27-0.3-6.52-0.28-9.8-0.28h-494.1a89.18 89.18 0 0 0-40.19 9.55c-29.6 14.71-45.3 46.93-45.3 78.95v676.39c0 6.89-0.34 13.94 0.43 20.8 1.61 14.22 5.33 28.18 13.58 40.13 8.08 11.71 18.4 22.23 31.29 28.62a88.76 88.76 0 0 0 40.19 9.58c30.7 0 61.4-0.12 92.09-0.18l171.71-0.35 163.63-0.32c23.71 0 47.42-0.15 71.12-0.14 46.28 0 92.56 0.24 138.83 0.36h18.78c6.77 0.46 13.58 0.59 20.38 0.59 42.84-0.3 81.25-21.08 106.52-55.23C949.8 865.84 957 837.57 957 809.39V645c0-16.25-13.75-30-30-30zM747.75 849.79l1 1.27c-0.52-0.52-1.05-1.12-1-1.27z m-79.31-698.53a1.78 1.78 0 0 0-0.24-0.5 1.06 1.06 0 0 1 0.24 0.5zM127.79 872.7a2.58 2.58 0 0 0 0.24 0.5 1.28 1.28 0 0 1-0.24-0.5zM646.3 883l-36.46 0.07-72 0.15-93.56 0.18-99.79 0.2-92.06 0.19-69.95 0.14c-11.16 0-22.33 0.09-33.5 0.06-1.31 0-2.61 0-3.92-0.1a56.76 56.76 0 0 1-5.71-1.57c-1.83-1-3.6-2-5.37-3.13-0.94-0.85-1.89-1.7-2.78-2.62-0.17-0.18-0.72-0.69-1.32-1.28-0.15-0.24-0.33-0.52-0.55-0.84a54.64 54.64 0 0 1-3.06-5.35 60.14 60.14 0 0 1-1.89-7c-0.45-6.85-0.13-13.82-0.13-20.64V191.93v-25.84c0-1.44 0-2.87 0.14-4.3a62.09 62.09 0 0 1 1.88-6.92 54.86 54.86 0 0 1 2.91-5.1l-1.44 1.56c0.56-0.6 1.1-1.24 1.64-1.88 0.91-1.35 2.25-2.66 1.88-2.1 0.88-0.9 1.8-1.74 2.73-2.58 1.75-1.11 3.51-2.15 5.33-3.11a56.76 56.76 0 0 1 5.71-1.57c5-0.29 10-0.11 15-0.11h428.39c19.77 0 39.56-0.16 59.33 0 1.13 0 2.26 0.05 3.39 0.11a56.34 56.34 0 0 1 5.69 1.56c1.83 1 3.6 2 5.37 3.13 0.95 0.85 1.89 1.71 2.78 2.62 0.18 0.19 0.72 0.69 1.33 1.28l0.54 0.84a54.64 54.64 0 0 1 3.06 5.35 61.21 61.21 0 0 1 1.87 6.87c0.3 4.9 0.15 9.86 0.15 14.76v402.56c0 19.43-0.39 38.91 0 58.33v0.8a26.51 26.51 0 0 0 0.22 3.34 28 28 0 0 0-0.22 3.44v112.45c0 14.26-0.06 28.52 0 42.77a146.35 146.35 0 0 0 26.26 82.92l-17.72-0.05c-11.39-0.06-22.78-0.06-34.17-0.06z m236.07-26.34q-2.89 3.45-6.07 6.64t-6.64 6.06c-0.81 0.58-1.63 1.16-2.46 1.72a100.77 100.77 0 0 1-13.44 7.56 105.35 105.35 0 0 1-17.86 4.88l-1.41 0.11a30.14 30.14 0 0 0-3-0.15l-27.22-0.08h-0.13a117.29 117.29 0 0 1-21.14-5.81 114.41 114.41 0 0 1-15-8.37c-1.23-0.82-2.43-1.67-3.63-2.53-2.72-2.31-5.39-4.66-7.92-7.19s-4.8-5-7-7.69c-0.77-1.09-1.55-2.16-2.29-3.27a114 114 0 0 1-8.74-15.59 117.69 117.69 0 0 1-5.78-21.1c-0.65-7.27-0.6-14.52-0.6-21.83V675H897v122.43c0 8.51 0.24 17.07-0.5 25.55a105.13 105.13 0 0 1-4.86 17.76 100.77 100.77 0 0 1-7.56 13.44c-0.55 0.82-1.14 1.64-1.71 2.46z" fill="#bfbfbf" p-id="2694"></path><path d="M248.12 384.32h300c15.69 0 30.72-13.8 30-30s-13.18-30-30-30h-300c-15.7 0-30.73 13.8-30 30s13.18 30 30 30zM248.12 542.56h300c15.69 0 30.72-13.8 30-30s-13.18-30-30-30h-300c-15.7 0-30.73 13.8-30 30s13.18 30 30 30zM248.12 700.56h110c15.69 0 30.72-13.8 30-30s-13.18-30-30-30h-110c-15.7 0-30.73 13.8-30 30s13.18 30 30 30z" fill="#bfbfbf" p-id="2695"></path></svg>
          <p style={{ textAlign: 'center', color: '#a1a5ab', fontSize: '30px' }}>无模板</p>
          <p style={{ textAlign: 'center', color: '#a1a5ab', fontSize: '30px' }}>请在记账界面添加模板</p>
        </div>
      )
    }
    let arr = tempList.map(item => {
      if (item.pay === state.pay) {
        return (
          <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card className={style.card}>
              <div className={style.tempContent} onClick={() => { selectTemp(item) }}>
                <div className={style.cardCate}>{item.category.split('>')[0]}</div>
                <div className={style.cardText}>
                  <div style={{ fontWeight: 600 }}>{item.tempName}</div>
                  <div style={{ color: state.pay ? '#56b78c' : '#e7918a' }}>￥{item.count}</div>
                </div>
              </div>
              <div style={{ display: !state.edit ? 'none' : 'block' }} className={style.deleteTemp}>--</div>
              <div style={{ display: !state.edit ? 'none' : 'flex' }} className={style.detail} onClick={() => { tempDetail(item) }}><RightOutlined /></div>
            </Card>
          </Col>
        )
      }
    })
    return (
      <Row gutter={16} className={`${style.display} templateDrawer`}>
        {arr}
      </Row>
    )
  }
  // 模板详细
  const tempDetail = (item) => {
  }
  // 选中模板
  const selectTemp = (item) => {
    let selected = item
    selected.id = 20210531
    if (state.pay) {
      setState({ ...state, visible: false, paylist: selected })
    } else {
      setState({ ...state, visible: false, incomelist: selected })
    }
  }
  // 复制起始
  // 编辑模板抽屉title
  const title = () => {
    return (
      <div className={style.temphead}>
        <span style={{ fontSize: '25px', fontWeight: 700, lineHeight: '46px' }}>{'编辑模板'}</span>
        <Button type="text" onClick={onCloseTemp} danger style={{ position: 'absolute', right: '10px', fontSize: '20px', color: 'brown' }}>
          关闭
        </Button>
      </div>
    )
  }
  // 关闭模板编辑区域
  const onCloseTemp = () => {
    setState({ ...state, tempVisible: false })
  }
  // 模板名称键入事件
  let tempInputRef = useRef(null)
  const tempKeyDown = (e) => {
    if (e.keyCode === 13) { conserveTemp() }
  }
  // 下拉区域
  const collapseList = () => {
    return (
      <Collapse accordion>
        <Panel header={classification()} key={'paycat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={props.pay ? payCat : incomeCat} change={receivePayCat}></Cascader>
        </Panel>
        <Panel header={account()} key={'account'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={AccountCat} change={receiveAccountCat}></Cascader>
        </Panel>
        <Panel header={date()} key={'datecat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <div className={style.site_calendar_demo_card}>
            <Calendar fullscreen={false} onChange={onPanelChange} ></Calendar>
          </div>
        </Panel>
        <Panel header={number()} key={'numbercat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={numberCat} change={receiveNumberCat}></Cascader>
        </Panel>
      </Collapse>
    )
  }
  // 复制结束
  return (
    <Provider value={mainAnimation}>
      <div ref={mainRef} className={style.handleHead}>
        {/* 头部区域 */}
        <div className={style.head}>
          <div onClick={onOpen}><Tag></Tag></div>
          <span style={{ fontSize: '25px', fontWeight: 700 }}>记账</span>
        </div>
        <div className={style.container}>
          {/* Tabs栏 */}
          <Tabs defaultActiveKey="payout" centered animated style={{ paddingTop: '80px', backgroundColor: 'rgb(248,248,248)' }}>
            <TabPane tab={<span onClick={() => { setState({ ...state, pay: true }) }} style={{ fontWeight: 400, fontSize: '20px' }}>支出</span>} key="payout">
              <Pay pay={true} count={[state.paylist]}></Pay>
            </TabPane>
            <TabPane tab={<span onClick={() => { setState({ ...state, pay: false }) }} style={{ fontWeight: 400, fontSize: '20px' }}>收入</span>} key="income">
              <Pay pay={false} count={[state.incomelist]}></Pay>
            </TabPane>
          </Tabs>
        </div>
      </div>
      {/* 模板抽屉区域 */}
      <Drawer
        title={title()}
        placement="bottom"
        closable={false}
        height={700}
        onClose={onClose}
        visible={state.visible}
        headerStyle={{ margin: 0, padding: 0 }}
      >
        <div className={style.drawerBody}>
          <span
            onClick={() => { setState({ ...state, edit: !state.edit }) }}
            style={{ border: '1px solid #9fa4aa', width: '60px', paddingLeft: '10px', display: 'inline-block', borderRadius: '5px', marginBottom: '5px', cursor: 'pointer' }}>
            <EditOutlined />{!state.edit ? '编辑' : '完成'}
          </span>
          {display()}
        </div>
      </Drawer>
      {/* 模板编辑区域 */}
      <Drawer
        title={title()}
        placement="right"
        closable={false}
        onClose={onCloseTemp}
        visible={state.tempVisible}
        width={'700px'}
        headerStyle={{ margin: 0, padding: 0 }}
        className={style.drawerBodyTemp}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ paddingLeft: '60px', paddingTop: '25px', color: 'gray', whiteSpace: 'nowrap' }}>模板名称</h1>
          <input className={style.remark} ref={tempInputRef} onKeyDown={tempKeyDown} style={{ textAlign: 'right', marginRight: '20px' }} placeholder='请输入模板名' type="text" />
        </div>
        {/* 改到这里了 */}
        {collapseList()}
        <Button type='danger' className={style.drawerButoon} onClick={conserveTemp}>保存</Button>
      </Drawer>
    </Provider>
  )
}

export default connect(
)(Index)
