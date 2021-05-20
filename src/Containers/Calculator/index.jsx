import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col } from 'antd';
import style from './style.module.css'

function Index (props) {
  let numberArr = [1, 4, 7]
  let [state, setState] = useState(props.calcu)
  return (
    <div className={style.container}>
      <div className={style.display}>￥{state}</div>
      <Row style={{ margin: 'auto 20px' }}>
        <Col span={18} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button type='primary' style={{ background: 'linear-gradient(to bottom,#f2b452,#d78437)' }}>C</Button><Button type='primary'>0</Button><Button type='primary'>.</Button>
          </Col>
          {
            numberArr.map((item) => {
              return (
                <Col span={24} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Button type='primary'>{item}</Button><Button type='primary'>{item + 1}</Button><Button type='primary'>{item + 2}</Button>
                </Col>
              )
            })
          }
        </Col>
        <Col span={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Button type='primary' style={{ background: '#909fb7' }}>+</Button>
          <Button type='primary' style={{ background: '#909fb7' }}>-</Button>
          <Button type='primary' className={style.resultBotton}>=</Button>
        </Col>
      </Row>
    </div>
  )
}
export default connect(
)(Index)