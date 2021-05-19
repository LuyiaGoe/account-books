import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import style from './style.module.css'
import Pay from './Pay/Pay';
import Tag from './tag'

import { Tabs } from 'antd';


const { TabPane } = Tabs;
function callback (key) {
  console.log(key);
}
function Index () {
  return (
    <div>
      {/* 头部区域 */}
      <div className={style.head}>
        <Tag></Tag>

        <span style={{ fontSize: '25px', fontWeight: 700 }}>记账</span>
      </div>
      {/* Tabs栏 */}
      <Tabs defaultActiveKey="1" onChange={callback} style={{ marginTop: '80px ' }} centered animated>
        <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>支出</span>} key="1">
          <Pay pay={true}></Pay>
        </TabPane>
        <TabPane tab={<span style={{ fontWeight: 400, fontSize: '20px' }}>收入</span>} key="2">
          <Pay pay={false}></Pay>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(
)(Index)
