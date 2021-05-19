import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import style from './style.module.css'
import Cascader from '../Cascader/Cascader';
import { Collapse } from 'antd';

const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`
// 分类标签、属性及级联选择器
const classification = () => {
  return (
    <div>
      <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>分类</h1>
      <span>{ }</span>
    </div>
  )
}

// 账户标签、属性
const account = () => {
  return (
    <div>
      <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>账户</h1>
      <span></span>
    </div>
  )
}

// 日期
const date = () => {
  return (
    <div>
      <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>日期</h1>
      <span></span>
    </div>
  )
}
function Index (props) {
  return (
    <div>
      <div style={{ borderBottom: '1px solid rgb(248,248,248)', overflow: 'hidden' }}>
        <span className={style.count} style={{ color: props.pay ? 'green' : 'red' }}>￥123</span>
      </div>
      <Collapse accordion>
        <Panel header={classification()} key="1" showArrow={false} style={{ padding: '12px 00px' }}>
          <Cascader></Cascader>
        </Panel>
        <Panel header={account()} key="2" showArrow={false} style={{ padding: '12px 00px' }}>
          <p>{text}</p>
        </Panel>
        <Panel header={date()} key="3" showArrow={false} style={{ padding: '12px 00px' }}>
          <p>{text}</p>
        </Panel>
      </Collapse>
    </div>
  )
}
export default connect(
)(Index)