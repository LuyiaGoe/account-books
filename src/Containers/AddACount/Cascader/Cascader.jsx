import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Card, Row, Col } from 'antd';
import style from './style.module.css'

// 添加动画的节流标识
let addAFlag = true

function Index () {
  let [state, setState] = useState(['', '', '一', '二', '三', '四', '五', '', ''])
  let rightCol = useRef(null)
  let leftCol = useRef(null)

  // 为节点ref添加滚动动作action
  let addAnimation = (ref, action) => {
    if ((!state[1] && action === style.animationDown) || (!state[3] && action === style.animationUp)) return null
    let name = ''
    // 级联选择器向下选取选项
    let chara = 1
    if (action === style.animationDown) {
      chara = -1
    }
    // 节流
    const throttle = () => {
      // 进行动画
      if (!ref) {
        name = leftCol.current.className
        leftCol.current.className += ` ${action}`
      } else {
        name = rightCol.current.className
        rightCol.current.className += ` ${action}`
      }
      // 删除动画并更改级联选择器中的被选择的内容
      setTimeout(() => {
        if (!ref) {
          leftCol.current.className = name
        } else {
          rightCol.current.className = name
        }
        edit(chara)
        addAFlag = true
      }, 280)
    }
    if (!addAFlag) return null
    addAFlag = false
    return (
      throttle()
    )
  }

  // 用于渲染级联选择器中的选项
  let arr = state.slice(0, 5)

  // 随着动画更改级联选择器选中的内容
  let edit = (chara) => {
    for (let i = 0; i < Math.abs(chara); i++) {
      if (chara === 0) return
      if (chara > 0) {
        let x = state.shift()
        setState([...state, x])
      } else if (chara === -1) {
        let x = state.pop()
        setState([x, ...state])
      }
    }
    arr = state.slice(0, 5)
    return (
      arr.map(item => {
        return <div key={Math.random() * Math.random()}>{item}</div>
      })
    )
  }
  return (
    <Card className={style.container} bordered>
      <Row className={style.row}>
        <Col span={12} className={style.col}>
          <div className={style.middle} ref={leftCol}>
            {edit(0)}
          </div>
        </Col>
        <Col span={12} className={style.col}>
          <div className={style.middle} ref={rightCol}>
            <div>1</div>
            <div>1s</div>
            <div>123</div>
            <div>1234</div>
            <div>12345</div>
          </div>
        </Col>
      </Row>
      <div className={style.line}></div>
      <div className={style.line2}></div>
      {/* 点击切换区域 */}
      <div onClick={() => addAnimation(1, style.animationUp)} className={style.switchDown} style={{ right: 0 }}></div>
      <div onClick={() => addAnimation(0, style.animationUp)} className={style.switchDown} style={{ left: 0 }}></div>
      <div onClick={() => addAnimation(1, style.animationDown)} className={style.switchTop} style={{ right: 0 }}></div>
      <div onClick={() => addAnimation(0, style.animationDown)} className={style.switchTop} style={{ left: 0 }}></div>
    </Card>
  )
}
export default connect(
)(Index)