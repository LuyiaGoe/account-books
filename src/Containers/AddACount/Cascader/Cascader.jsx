import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Card, Row, Col, message } from 'antd';
import style from './style.module.css'
import randomNum from 'number-random'

// 添加动画的节流标识
let addAFlag = true


function Index (props) {
  let [state, setState] = useState({ ...props.obj, 'selectedLeft': 0, 'selectedRight': 0 })
  let rightCol = useRef(null)
  let leftCol = useRef(null)
  useEffect(() => {
    let output = []
    output[0] = arr[state.selectedLeft + 2]
    output[1] = arrr[state.selectedRight + 2]
    props.change(output)
  }, [state.selectedLeft, state.selectedRight])
  // 用于渲染级联选择器中的选项
  let all = []
  let arr = Array(2), arrr = Array(2)
  for (let i in state) {
    all.push(i)
  }
  arr = [...arr, ...all.slice(0, all.length - 2), ...arr]
  arrr = [...arrr, ...state[arr[state.selectedLeft + 2]]]


  let arra = arr.slice(state.selectedLeft, state.selectedLeft + 5)
  let arrb = arrr.slice(state.selectedRight, state.selectedRight + 5)


  // 随着动画更改级联选择器选中的内容
  let edit = (chara, ref) => {
    // 更改目标数组
    let targetArr = []
    // 通过ref判断是翻左边的还是右边的
    if (ref === leftCol) {
      // 通过chara判断级联选择器是上翻还是下翻
      for (let i = 0; i < Math.abs(chara); i++) {
        // 等于0不动
        if (chara === 0) return
        setState({ ...state, 'selectedLeft': state.selectedLeft + chara, 'selectedRight': 0 })
      }
      targetArr = arr.slice(state.selectedLeft, state.selectedLeft + 5)
    } else {
      for (let i = 0; i < Math.abs(chara); i++) {
        // 等于0不动
        if (chara === 0) return
        setState({ ...state, 'selectedRight': state.selectedRight + chara })
      }
      targetArr = arrr.slice(state.selectedRight, state.selectedRight + 5)
    }
    return (
      targetArr.map(item => {
        return <div key={randomNum(100, 10000, true)}>{item}</div>
      })
    )
  }


  // 为节点ref添加滚动动作action
  let addAnimation = (ref, action) => {
    if ((!arra[1] && action === style.animationDown && ref === 0) || (!arra[3] && action === style.animationUp && ref === 0) || (!arrb[1] && action === style.animationDown && ref === 1) || (!arrb[3] && action === style.animationUp && ref === 1)) {
      message.warning('已经到头啦', 0.5)
      return null
    }
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
          edit(chara, leftCol)
        } else {
          rightCol.current.className = name
          edit(chara, rightCol)
        }
        addAFlag = true
      }, 280)
    }
    if (!addAFlag) return null
    addAFlag = false
    return (
      throttle()
    )
  }


  return (
    <Card className={style.container} bordered>
      <Row className={style.row}>
        <Col span={12} className={style.col}>
          <div className={style.middle} ref={leftCol}>
            {edit(0, leftCol)}
          </div>
        </Col>
        <Col span={12} className={style.col}>
          <div className={style.middle} ref={rightCol}>
            {edit(0, rightCol)}
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