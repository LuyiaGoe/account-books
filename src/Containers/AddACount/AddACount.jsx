import React, { useEffect, useState, useRef } from 'react'
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
    console.log('@@@', mainRef);
  }, [])
  // 外推main动画
  const mainOut = () => {
    mainRef.current.className += ` ${style.mainMoveOut}`
    console.log(mainRef);
  }
  // 推回来main 动画
  const mainIn = () => {
    mainRef.current.className += ` ${style.mainMoveIn}`
    console.log(mainRef);
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
      <div>
        <div ref={mainRef} className={style.container}>
          {/* 头部区域 */}
          <div className={style.head}>
            <Tag></Tag>

            <span style={{ fontSize: '25px', fontWeight: 700 }}>记账</span>
          </div>
          {/* Tabs栏 */}
          <Tabs defaultActiveKey="1" centered animated>
            <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>支出</span>} key="1">
              <Pay pay={true}></Pay>
            </TabPane>
            <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>收入</span>} key="2">
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
