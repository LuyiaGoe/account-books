import React, { useEffect, useState, useRef } from 'react'
import globalContext from '../../globalContext'
import { Redirect, Switch } from 'react-router-dom';
import { Link, Route, useHistory } from 'react-router-dom'
import Head from '../Head/Head';
import IndexPage from '../IndexPage/IndexPage';
import List from '../List/List';
import AddACount from '../AddACount/AddACount';
import style from './style.module.css'
import { Layout, Menu, Button } from 'antd';
import { connect } from 'react-redux';
const { Sider, Content } = Layout;
const Provider = globalContext.Provider;
let mainAnimation = {}
function Index () {
  const mainRef = useRef(null)
  // 外推main动画
  const mainOut = () => {
    // mainRef.current.className += ` ${style.mainMoveOut}`
  }
  // 推回来main 动画
  const mainIn = () => {
    // mainRef.current.className += ` ${style.mainMoveIn}`
    // setTimeout(() => {
    //   mainRef.current.className = style.content
    // }, 100)
  }
  // 整合推动main的动画，准备放入Provider中送入子组件触发
  mainAnimation = {
    mainOut,
    mainIn
  }
  // 拿到history
  const [items, setData] = useState('/')
  const history = useHistory()
  // 副作用函数获得location信息
  useEffect(() => {
    // 组件第一次渲染会执行这个方法
    history.listen(historyLocation => {
      setData(historyLocation.pathname)
    })
  }, [history])

  const addACount = () => {
    history.push('/addACount')
  }

  return (
    <Provider value={mainAnimation}>
      <div className={style.container}>
        <Layout>
          {/* 侧边栏 */}
          <Sider className={style.side} style={{ position: 'fixed', height: '100%' }}>
            <Head style={{ position: 'fixed' }}></Head>
            <Menu
              defaultSelectedKeys={items}
              mode="inline"
              className={style.font}
            >
              <Menu.Item key="/" className={style.font}><Link to='/home'>我的首页</Link></Menu.Item>
              <Menu.Item key="/list" className={style.font}><Link to='/list'>流水清单</Link></Menu.Item>
              <Menu.Item key="11" className={style.font}>其他功能</Menu.Item>
            </Menu>
            <Button type='danger' className={style.addButoon} onClick={addACount}>记一笔</Button>
          </Sider>

          {/* 主页面 */}
          <Content className={style.content} ref={mainRef}>
            {/* 头部区域 */}
            <Switch>
              <Route path="/home" component={IndexPage} exact />
              <Route path="/list" component={List} />
              <Route path="/addACount" component={AddACount} />
              <Redirect to='/home' />
            </Switch>
          </Content>
        </Layout>
      </div >
    </Provider>
  )
}

export default connect()(Index)