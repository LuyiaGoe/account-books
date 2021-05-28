import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import { connect } from 'react-redux'
import randomNum from 'number-random'
import { Switch, Link, Route, useHistory } from 'react-router-dom';
// antd
import { Row, Col, Card, Progress, Drawer } from 'antd'
import { RightOutlined } from '@ant-design/icons';
// actions
import { getCountData } from '../../redux/actions/countData';
import { numberFormat } from '../../redux/actions/numberFomat';
import { rank } from '../../redux/actions/rank';
import { getOFS } from '../../redux/actions/oFS';
// components
import Calculator from './drawerPage/setBalance';
import Stream from './drawerPage/stream';
import Assets from '../../Pages/drawerPage/assets';

// 对付hash路由bug的临时标识
let a = 0

function Index (props) {
  let kap = [{ name: '暂无数据', sum: 0, color: 'gray' }, { name: '暂无数据', sum: 0, color: 'gray' }, { name: '暂无数据', sum: 0, color: 'gray' }]
  let balance = JSON.parse(localStorage.getItem('balance')) || 0
  const [data, setData] = useState({ visible: false })
  // 用来确定当前时间以及获取redux传来的countData
  const fresh = () => {
    if (!data.time || (new Date().getTime() - data.msec) > 1000) {
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let time = {
        time: {
          year: day2.getFullYear(),
          month: (day2.getMonth() + 1).toString().length === 1 ? '0' + (day2.getMonth() + 1) : day2.getMonth() + 1,
          date: day2.getDate().length === 1 ? '0' + day2.getDate() : day2.getDate(),
          msec: new Date().getTime()
        }
      }
      setData(time)
    }
  }

  const history = useHistory()
  // 用副作用函数更替时间
  useEffect(() => {
    props.getCountData({ list: 'all', demand: {} })
    props.getOFS(props.countData)
    props.numberFormat('all')
    props.rank({ list: 'all', demand: { rank: 'juniorcategory', category: 'payCount' } })
    fresh()
  }, [data])
  // 最近一单
  const recentCount = () => {
    let text = '还没有记过帐'
    let recentText = props.numFor.todayArr.length !== 0 ? props.numFor.todayArr[props.numFor.todayArr.length - 1].category.split('>')[0] : ''
    let recentCount = props.numFor.todayArr.length !== 0 ? props.numFor.todayArr[props.numFor.todayArr.length - 1].count : ''
    recentText = `最近一笔 ${recentText} ${recentCount}`
    text = props.numFor.todayArr.length === 0 ? text : recentText
    return text
  }
  // 显示时间
  const displayTime = (time) => {
    if (data.time) {
      const { year, month, date } = data.time
      const now = new Date(year, month * 1 - 1, date).getTime()
      let last = 0
      if (time === 'week') {
        last = now - 86400000 * 6
        last = new Date(last)
        return (`    ${last.getMonth() + 1}月${last.getDate()}日 - ${month * 1}月${date}日`)
      } else {
        last = new Date(year, (month * 1 + 1)).getTime() - 86400000
        last = new Date(last)
        return (`     ${last.getMonth()}月1日 - ${last.getMonth()}月${last.getDate()}日`)
      }
    }
  }
  // 分类前三
  const getRankList = () => {
    let list = props.getRank.slice(0, 3).filter(item => {
      return item.sum !== 0
    })
    kap = [...list, ...kap].slice(0, 3)
    kap[0].color = '#e4211b'
    kap[1].color = '#d0558c'
    kap[2].color = '#8f57ae'
    return (
      kap.map(item => {
        let percent = item.sum / kap[0].sum * 100 ? item.sum / kap[0].sum * 100 : 0
        let textColor = item.sum ? '#5f5f5f' : '#d2d2d0'
        return (
          <div key={randomNum(1, 150000, true)}>
            <p className={style.showProgress} style={{ color: textColor, fontWeight: 550 }}>{item.name}{item.sum ? item.sum.numberFormat(2) : ''}</p>
            <Progress percent={50} showInfo={false} size="small" key={randomNum(0, 10000000, true)} percent={percent} strokeColor={item.color} />
          </div>
        )
      })
    )
  }
  // 拉开对应抽屉，进入二级页面
  const drawerOut = (e) => {
    if (e === 'e') {
      return getStream('month')
    }
    onOpen()
  }
  // 打开抽屉
  const onOpen = () => {
    setData({ ...data, visible: true })
  }
  // 关闭抽屉
  const onClose = () => {
    props.history.go(-1)  // 不能省略
    // window.location.reload()
    setData({ ...data, visible: false })
  }
  // 抽屉头部区域
  const title = () => {
    if (!data.visible && !a) {
      a++
      return props.history.push('/home')
    }
    return (
      <div className={style.head} style={{ display: 'flex', flexDirection: 'row-reverse', padding: 0, width: '700px', zIndex: 0 }}>
      </div>
    )
  }
  // 左侧支出统计
  const leftSide = () => {
    let list = props.numFor
    return (
      <Col span={12} className={style.col}>
        <Col span={24} className={style.payOut}>
          <div>
            <p>本月支出：</p>
            <div style={{ width: 100 + '%', overflow: 'hidden' }}><p className={style.payCountSum}>￥{list ? list.monthRevenue.pay : 0}<RightOutlined className={style.icon} /></p></div>
          </div>
        </Col>
        <Col className={style.income}>
          <div className={style.betweenText} onClick={() => { drawerOut('e') }}><span>本月收入：</span><span >￥{list ? list.monthRevenue.income : 0}<RightOutlined className={style.icon} /></span></div>
          <Link className={style.betweenText} to='/home/setBalance' onClick={drawerOut}><span >预算额度：</span><span >￥{(balance - (list.monthRevenue.pay ? list.monthRevenue.pay.replace(/,/g, '') : 0)).numberFormat(2)}<RightOutlined className={style.icon} /></span></Link>
        </Col>
      </Col>

    )
  }
  // 按时间进入流水页面Stream
  const getStream = (value) => {
    let end = new Date(),
      date = end.getDate(),
      month = end.getMonth(),
      year = end.getFullYear(),
      start = 0
    switch (value) {
      case 'day':
        start = new Date(year, month, date) - 0
        break;
      case 'week':
        start = new Date(year, month, date) - 6 * 86400000
        break;
      case 'month':
        start = new Date(year, month, 1) - 0
        break
      case 'year':
        start = new Date(year, 0, 1) - 0
        break
    }
    setData({ ...data, visible: true })
    history.push({ pathname: '/home/stream', params: { type: value, start, end: end.getTime() } })
  }
  // 跳转入资产页面Asset
  const assetsPage = (value) => {
    console.log(value);
    switch (value) {
      case 'cash':
        value = '现金'
        break;
      case 'bank':
        value = '银行卡'
        break;
      case 'busCard':
        value = '公交卡'
        break
      case 'alipay':
        value = '支付宝'
        break
      case 'weChat':
        value = '微信'
        break
    }
    setData({ ...data, visible: true })
    history.push({ pathname: '/home/assets', params: { type: value } })
  }
  return (
    <div className={style.container} >
      {/* 头部区域 */}
      <div className={style.head}>
        <span className={style.big}>{data.time ? data.time.month : '0'}</span>
        <span>/{data.time ? data.time.year : '0'}</span>
        <div className={style.decorationBar}></div>
      </div>

      {/* 主体区域 */}
      <Card className={style.card} style={{ marginTop: '80px' }}>

        {/* 本月统计卡片 */}
        <Row>
          {/* 左侧支出收入统计 */}
          {leftSide()}
          {/* 右侧支出前三 */}
          <Col span={12} className={style.col}>
            <p>支出分类前 3：</p>
            {getRankList()}
          </Col>
        </Row>
      </Card>

      {/* 按间隔分类统计卡片 */}
      <Card className={style.card}>
        <Row>
          {/* 今天 */}
          <Col span={24} className={style.col} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => { getStream('day') }}>
            <Col span={24} id={'classify'}>
              <svg style={{ float: 'left', marginTop: 6 + 'px', marginRight: '15px' }} t="1621386037074" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8490" width="40" height="40"><path d="M408.222897 789.115586v-35.345655h217.15862v34.886621h33.474207V388.378483h-283.68331v400.737103h33.050483z m217.15862-237.779862h-217.15862v-130.824827h217.15862v130.824827z m0 170.301793h-217.15862v-138.169379h217.15862v138.169379z" p-id="8491"></path><path d="M917.645241 144.772414a70.62069 70.62069 0 0 1 70.62069 70.620689v681.489656a70.62069 70.62069 0 0 1-70.62069 70.620689H94.384552a70.62069 70.62069 0 0 1-70.62069-70.620689V215.393103a70.62069 70.62069 0 0 1 70.62069-70.620689h823.260689z m0 45.903448H94.384552a24.717241 24.717241 0 0 0-24.50538 21.362759l-0.211862 3.354482v681.489656a24.717241 24.717241 0 0 0 21.362759 24.505379l3.354483 0.211862h823.260689a24.717241 24.717241 0 0 0 24.50538-21.362759l0.211862-3.354482V215.393103a24.717241 24.717241 0 0 0-21.362759-24.505379l-3.354483-0.211862z" p-id="8492"></path><path d="M312.214069 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656276 3.389793l-0.247172-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724zM691.023448 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656275 3.389793l-0.247173-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724z" p-id="8493"></path></svg>
              <div className={style.classify}>
                <span>
                  <b style={{ color: 'black', fontWeight: '800', fontSize: '24px', lineHeight: '62px' }}>今天</b>&nbsp;&nbsp;
                  {recentCount()}
                </span>
                <span style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={style.lamination}>
                    <span>{props.numFor ? props.numFor.todayRevenue.income : 0}</span>
                    <span>{props.numFor ? props.numFor.todayRevenue.pay : 0}</span>
                  </span>
                  <RightOutlined className={style.calendarArray} style={{ color: 'gray' }} />
                </span>
              </div>
            </Col>
          </Col>

          {/* 这周 */}
          <Col span={24} className={style.col} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => { getStream('week') }}>
            <Col span={24} id={'classify'}>
              <svg style={{ float: 'left', marginTop: 6 + 'px', marginRight: '15px' }} t="1621385995771" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7592" width="40" height="40"><path d="M332.976552 790.49269c30.260966-56.002207 45.903448-129.447724 46.786207-219.418483V419.133793h278.174896v320.406069c0 11.934897-6.426483 18.361379-19.279448 18.361379-17.902345 0-37.181793-0.459034-57.838345-1.377103l8.721655 31.214345h59.215449c27.542069 0 41.772138-12.393931 41.772137-36.722759v-362.637241H346.747586v185.449931c-0.918069 78.494897-13.771034 143.218759-38.558896 194.171586l24.787862 22.49269z m298.372414-217.123311v-28.919172h-97.809656v-45.444414h82.626207v-27.542069h-82.626207v-38.099862h-32.132413v38.099862h-83.544276v27.542069H501.406897v45.444414h-97.315311v28.919172h227.222069z m-22.951725 149.186207v-114.299586h-185.485241v114.299586h185.449931z m-31.708689-28.919172h-121.644138v-57.379311h121.644138v57.379311z" p-id="7593"></path><path d="M917.645241 144.772414a70.62069 70.62069 0 0 1 70.62069 70.620689v681.489656a70.62069 70.62069 0 0 1-70.62069 70.620689H94.384552a70.62069 70.62069 0 0 1-70.62069-70.620689V215.393103a70.62069 70.62069 0 0 1 70.62069-70.620689h823.260689z m0 45.903448H94.384552a24.717241 24.717241 0 0 0-24.50538 21.362759l-0.211862 3.354482v681.489656a24.717241 24.717241 0 0 0 21.362759 24.505379l3.354483 0.211862h823.260689a24.717241 24.717241 0 0 0 24.50538-21.362759l0.211862-3.354482V215.393103a24.717241 24.717241 0 0 0-21.362759-24.505379l-3.354483-0.211862z" p-id="7594"></path><path d="M312.214069 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656276 3.389793l-0.247172-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724zM691.023448 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656275 3.389793l-0.247173-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724z" p-id="7595"></path></svg>
              <div className={style.classify}>
                <span>
                  <b style={{ color: 'black', fontWeight: '800', fontSize: '24px', lineHeight: '62px' }}>本周</b>
                  {displayTime('week')}
                </span>
                <span style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={style.lamination}>
                    <span>{props.numFor ? props.numFor.weekRevenue.income : 0}</span>
                    <span>{props.numFor ? props.numFor.weekRevenue.pay : 0}</span>
                  </span>
                  <RightOutlined className={style.calendarArray} style={{ color: 'gray' }} />
                </span>
              </div>
            </Col>
          </Col>

          {/* 本月 */}
          <Col span={24} className={style.col} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => { getStream('month') }}>
            <Col span={24} id={'classify'}>
              <svg style={{ float: 'left', marginTop: 6 + 'px', marginRight: '15px' }} t="1621385953741" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6738" width="40" height="40"><path d="M371.959172 792.328828c29.837241-39.017931 47.315862-88.134621 52.788966-147.809104h197.843862v91.347862c0 13.312-5.508414 20.197517-16.066207 20.197517-17.44331 0-36.722759-0.918069-57.838345-1.836137l9.18069 32.591448h59.215448c25.705931 0 39.017931-13.312 39.017931-39.476966V388.378483h-263.026758v224.008827c-0.918069 63.346759-16.066207 115.67669-46.362483 156.989793l25.246896 22.951725z m250.632828-291.945931h-195.972414v-80.331035h195.972414v80.331035z m0 113.381517h-195.972414v-82.626207h195.972414v82.626207z" p-id="6739"></path><path d="M917.645241 144.772414a70.62069 70.62069 0 0 1 70.62069 70.620689v681.489656a70.62069 70.62069 0 0 1-70.62069 70.620689H94.384552a70.62069 70.62069 0 0 1-70.62069-70.620689V215.393103a70.62069 70.62069 0 0 1 70.62069-70.620689h823.260689z m0 45.903448H94.384552a24.717241 24.717241 0 0 0-24.50538 21.362759l-0.211862 3.354482v681.489656a24.717241 24.717241 0 0 0 21.362759 24.505379l3.354483 0.211862h823.260689a24.717241 24.717241 0 0 0 24.50538-21.362759l0.211862-3.354482V215.393103a24.717241 24.717241 0 0 0-21.362759-24.505379l-3.354483-0.211862z" p-id="6740"></path><path d="M312.214069 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656276 3.389793l-0.247172-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724zM691.023448 31.249655a22.951724 22.951724 0 0 1 22.704552 19.561931l0.247172 3.389793v180.824276a22.951724 22.951724 0 0 1-45.656275 3.389793l-0.247173-3.389793v-180.788965a22.951724 22.951724 0 0 1 22.951724-22.951724z" p-id="6741"></path></svg>
              <div className={style.classify}>
                <span>
                  <b style={{ color: 'black', fontWeight: '800', fontSize: '24px', lineHeight: '62px' }}>{data.time ? data.time.month : 0}月</b>
                  {displayTime('month')}
                </span>
                <span style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={style.lamination}>
                    <span>{props.numFor ? props.numFor.monthRevenue.income : 0}</span>
                    <span>{props.numFor ? props.numFor.monthRevenue.pay : 0}</span>
                  </span>
                  <RightOutlined className={style.calendarArray} style={{ color: 'gray' }} />
                </span>
              </div>
            </Col>
          </Col>

          {/* 今年 */}
          <Col span={24} className={style.col} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => { getStream('year') }}>
            <Col span={24} id={'classify'}>
              <svg style={{ float: 'left', marginTop: 6 + 'px', marginRight: '15px' }} t="1621385903669" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5695" width="40" height="40"><path d="M715.702857 32.365714a23.771429 23.771429 0 0 1 23.515429 20.260572l0.256 3.510857V149.942857l210.944 0.036572a73.142857 73.142857 0 0 1 73.142857 73.142857v705.828571a73.142857 73.142857 0 0 1-73.142857 73.142857H97.755429a73.142857 73.142857 0 0 1-73.142858-73.142857V223.085714a73.142857 73.142857 0 0 1 73.142858-73.142857h201.837714V56.100571a23.771429 23.771429 0 0 1 47.286857-3.510857l0.256 3.510857V149.942857h344.795429V56.137143a23.771429 23.771429 0 0 1 23.771428-23.771429zM299.593143 197.485714l-201.874286 0.036572a25.6 25.6 0 0 0-25.344 22.125714l-0.219428 3.474286v705.828571a25.6 25.6 0 0 0 22.125714 25.380572l3.474286 0.219428h852.662857a25.6 25.6 0 0 0 25.380571-22.125714l0.219429-3.474286V223.085714a25.6 25.6 0 0 0-22.125715-25.380571l-3.474285-0.219429H739.474286v45.933715a23.771429 23.771429 0 0 1-47.286857 3.510857l-0.256-3.510857V197.485714H347.136v45.970286a23.771429 23.771429 0 0 1-47.286857 3.510857l-0.256-3.510857V197.485714z m112.274286 181.504l35.657142 6.656c-5.229714 18.066286-11.410286 34.706286-18.066285 50.870857h295.241143v33.28h-149.284572v76.068572h132.644572v32.804571h-132.644572v102.692572h164.498286v33.28h-164.498286v106.020571h-34.706286V714.605714H321.097143v-33.28h78.445714v-135.497143h141.202286v-76.068571h-127.890286a285.805714 285.805714 0 0 1-75.117714 84.626286l-22.820572-28.525715c48.018286-36.132571 80.347429-85.101714 96.987429-146.907428z m128.841142 199.68H433.737143v102.692572h106.971428v-102.692572z" p-id="5696"></path></svg>
              <div className={style.classify}>
                <span>
                  <b style={{ color: 'black', fontWeight: '800', fontSize: '24px', lineHeight: '62px' }}>今年</b>&nbsp;&nbsp;{data.time ? data.time.year : 2021}年</span>
                <span style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className={style.lamination}>
                    <span>{props.numFor.yearArr.length !== 0 ? props.numFor.yearRevenue.income : '0.00'}</span>
                    <span>{props.numFor.yearArr.length !== 0 ? props.numFor.yearRevenue.pay : '0.00'}</span>
                  </span>
                  <RightOutlined className={style.calendarArray} style={{ color: 'gray' }} />
                </span>
              </div>
            </Col>
          </Col>

        </Row>
      </Card>

      {/* 资产 */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        {/* 现金账户 */}
        <Row>
          <Col span={24} style={{ borderBottom: '1px solid rgb(248,248,248)', fontSize: '25px', fontWeight: '700', paddingBottom: '15px', paddingLeft: '-40px' }}>
            <span>总资产：</span>
            <span style={{ float: 'right', textAlign: 'right' }}>￥{props.numFor ? props.numFor.sumAsset : 0}</span>
          </Col>
          <Col span={24} className={style.assetsCard} >
            <Col span={24} className={style.classify} style={{ lineHeight: '30px', borderBottom: 0 }}>
              <div className={style.stickBlock}></div>
              <span style={{ color: '#777e88', fontWeight: '600' }}>现金账户</span>
              <span style={{ color: '#777e88', fontWeight: '600' }}>￥{props.numFor ? props.numFor.cashAsset : 0}</span>
            </Col>
            {/* 详情 */}
            <Col onClick={() => { assetsPage('cash') }} style={{ cursor: 'pointer' }}>
              <div className={style.classify} style={{ borderBottom: 0 }}>
                <span style={{ color: 'black', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  现金
                </span>
                <span style={{ color: '#e17066', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  ￥{props.numFor ? props.numFor.cashAsset : 0}
                </span>
              </div>
            </Col>
          </Col>
        </Row>
      </Card>

      {/* 虚拟账户 */}
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        <Row>
          <Col span={24} className={style.assetsCard}>
            <Col span={24} className={style.classify} style={{ lineHeight: '30px', borderBottom: 0 }}>
              <div className={style.stickBlock} style={{ backgroundColor: 'brown' }}></div>
              <span style={{ color: '#777e88', fontWeight: '600' }}>虚拟账户</span>
              <span style={{ color: '#777e88', fontWeight: '600' }}>￥{props.numFor ? props.numFor.virtualAsset : 0}</span>
            </Col>
            {/* 详情 */}
            <Col onClick={() => { assetsPage('bank') }} style={{ cursor: 'pointer' }}>
              <div className={style.classify} style={{ paddingBottom: '15px' }}>
                <span style={{ color: 'black', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  银行卡
                </span>
                <span style={{ color: '#e17066', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  ￥{props.numFor ? props.numFor.creditAsset : 0}
                </span>
              </div>
            </Col>
            <Col onClick={() => { assetsPage('busCard') }} style={{ cursor: 'pointer' }}>
              <div className={style.classify} style={{ paddingBottom: '15px' }}>
                <span style={{ color: 'black', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  公交卡
                </span>
                <span style={{ color: '#e17066', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  ￥{props.numFor ? props.numFor.bushCardAsset : 0}
                </span>
              </div>
            </Col>
            <Col onClick={() => { assetsPage('alipay') }} style={{ cursor: 'pointer' }}>
              <div className={style.classify} style={{ paddingBottom: '15px' }}>
                <span style={{ color: 'black', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  支付宝
                </span>
                <span style={{ color: '#e17066', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  ￥{props.numFor ? props.numFor.aliPayAsset : 0}
                </span>
              </div>
            </Col>
            <Col onClick={() => { assetsPage('weChat') }} style={{ cursor: 'pointer' }}>
              <div className={style.classify} style={{ borderBottom: 0 }}>
                <span style={{ color: 'black', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  微信
                </span>
                <span style={{ color: '#e17066', fontWeight: '400', fontSize: '20px', marginTop: '15px' }}>
                  ￥{props.numFor ? props.numFor.weChatAsset : 0}
                </span>
              </div>
            </Col>
          </Col>
        </Row>
      </Card>
      {/* 模板抽屉区域 */}
      <Drawer
        title={title()}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={data.visible}
        width={'700px'}
        headerStyle={{ margin: 0, padding: 0 }}
        className={style.drawerBody}
        destroyOnClose={true}
      >
        <div style={{ paddingTop: '80px', width: '700px', transform: 'translateX(0)', overflow: 'auto', height: '100%' }}>
          <Switch>
            <Route path='/home/setBalance' component={Calculator} />
            <Route path='/home/stream' component={Stream} />
            <Route path='/home/assets' component={Assets} />
          </Switch>
        </div>
      </Drawer>

    </div >
  )
}
const mapStateForProps = (state) => {
  return {
    countData: state.countData,
    numFor: state.numFor,
    getRank: state.getRank,
    ofs: state.ofs
  }
}

export default connect(
  mapStateForProps,
  { getCountData, numberFormat, rank, getOFS }
)(Index)