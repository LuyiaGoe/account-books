import React, { useEffect, useState } from 'react'
import { Link, Route, useHistory } from 'react-router-dom'
import Head from '../Head/Head';
import IndexPage from '../IndexPage/IndexPage';
import List from '../List/List';
import style from './style.module.css'
import { Layout, Menu, Button } from 'antd';
const { Sider, Content } = Layout;

export default function Index () {
  // 拿到history
  const [items, setData] = useState('/')
  const history = useHistory()
  // 副作用钩子
  useEffect(() => {
    // 组件第一次渲染会执行这个方法
    history.listen(historyLocation => {
      setData(historyLocation.pathname)
    })
  }, [history])

  return (
    <div className={style.container}>
      <Layout>
        {/* 侧边栏 */}
        <Sider className={style.side}>
          <Head></Head>
          <Menu
            defaultSelectedKeys={items}
            mode="inline"
            className={style.font}
          >
            <Menu.Item key="/" className={style.font}><Link to='/'>我的首页</Link></Menu.Item>
            <Menu.Item key="/list" className={style.font}><Link to='/list'>流水清单</Link></Menu.Item>
            <Menu.Item key="11" className={style.font}>其他功能</Menu.Item>
          </Menu>
          <Button type='danger' className={style.addButoon}>记一笔</Button>
        </Sider>

        {/* 主页面 */}
        <Content className={style.content}>
          <Route path="/" component={IndexPage} exact />
          <Route path="/list" component={List} />
          {/* <Redirect from='/' to='/home' exact /> */}
        </Content>
      </Layout>
    </div >
  )
}
