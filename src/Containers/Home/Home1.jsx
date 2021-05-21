import React, { useEffect, useState } from 'react'
import { Link, Route, useHistory } from 'react-router-dom'
import Head from '../Head/Head';
import IndexPage from '../IndexPage/IndexPage';
import List from '../List/List';
import style from './style.module.css'
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

export default function Index () {
  // 拿到history
  const [state, setData] = useState({
    collapsed: false,
  })
  const history = useHistory()
  // 副作用钩子
  useEffect(() => {
    // 组件第一次渲染会执行这个方法
    history.listen(historyLocation => {
      setData(historyLocation.pathname)
    })
  }, [history])

  const toggle = () => {
    setData({
      collapsed: !state.collapsed,
    });
  };

  return (
    <div className={style.container}>
      <Layout>
        <Sider className={`${style.side}`}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />} className={`${style.font}`}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" className={`${style.font}`} icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" className={`${style.font}`} icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0, backgroundColor: 'orange' }}>
            {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger white',
              onClick: toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </div >
  )
}
