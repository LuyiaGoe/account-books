import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import style from './style.module.css'
import Pay from './Pay/Pay';
import Tag from './tag'
import globalContext from '../../globalContext'

import { Tabs } from 'antd';

const Provider = globalContext.Provider;

let mainAnimation = {}

const { TabPane } = Tabs;

function Index () {
  const mainRef = useRef(null)
  let classn = ''
  useEffect(() => {
    classn = mainRef.current.className
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
  return (
    <Provider value={mainAnimation}>
      <div ref={mainRef} className={style.handleHead}>
        {/* 头部区域 */}
        <div className={style.head}>
          <Tag></Tag>
          <span style={{ fontSize: '25px', fontWeight: 700 }}>记账</span>
        </div>
        <div className={style.container}>
          {/* Tabs栏 */}
          <Tabs defaultActiveKey="payout" centered animated style={{ paddingTop: '80px', backgroundColor: 'rgb(248,248,248)' }}>
            <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>支出</span>} key="payout">
              <Pay pay={true}></Pay>
            </TabPane>
            <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>收入</span>} key="income">
              <Pay pay={false}></Pay>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Provider>
  )
}

export default connect(
)(Index)
