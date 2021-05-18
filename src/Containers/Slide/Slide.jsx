// 侧边栏
import React from 'react'
import style from './style.module.css'
import Head from '../Head/Head'
import Bar from '../Bar/Bar'
import 'antd/dist/antd.css'

export default function Index () {
  const [items] = React.useState(['我的首页', '记账功能', '更多功能'])
  return (
    <div className={style.container}>
      <Head style={{ marginBottom: 150 + 'px' }}></Head>
      {
        items.map(item => {
          return <Bar>{item}</Bar>
        })
      }
    </div>
  )
}
