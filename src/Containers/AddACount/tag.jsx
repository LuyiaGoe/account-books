import React from 'react'
import { connect } from 'react-redux'
import style from './tagstyle.module.css'

function Index () {
  return (
    <div className={style.container}>
      <div className={style.head}>
        <svg t="1621392769784" className={style.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14745" width="40" height="40">
          <path d="M576.4 203.3c46.7 90.9 118.6 145.5 215.7 163.9 97.1 18.4 111.5 64.9 43.3 139.5s-95.6 162.9-82.3 265.2c13.2 102.3-24.6 131-113.4 86.2s-177.7-44.8-266.6 0-126.6 16-113.4-86.2c13.2-102.3-14.2-190.7-82.4-265.2-68.2-74.6-53.7-121.1 43.3-139.5 97.1-18.4 169-73 215.7-163.9 46.6-90.9 93.4-90.9 140.1 0z" p-id="14746" fill="#a52a2a"></path>
        </svg>
        <div style={{ color: 'brown', fontSize: '15px' }}>记账模板</div>
      </div>
      <div className={style.left}></div>
      <div className={style.right}></div>
    </div>
  )
}

export default connect(
)(Index)
