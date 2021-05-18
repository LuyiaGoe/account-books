import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import { Row, Col, Card, Progress } from 'antd'
import { connect } from 'react-redux'
import { RightOutlined } from '@ant-design/icons';

function Index () {
  const [data, setData] = useState()

  // 用来确定当前时间
  const fresh = () => {
    if (!data) {
      var day2 = new Date();
      day2.setTime(day2.getTime());
      setData({
        time: {
          year: day2.getFullYear(),
          month: (day2.getMonth() + 1).toString().length === 1 ? '0' + (day2.getMonth() + 1) : day2.getMonth() + 1,
          date: day2.getDate().length === 1 ? '0' + day2.getDate() : day2.getDate()
        }
      })
    }
  }
  useEffect(() => {
    fresh()
    console.log(data);
  })

  return (
    <div>
      {/* 头部区域 */}
      <div className={style.head}>
        <span className={style.big}>{data ? data.time.month : '0'}</span>
        <span>/{data ? data.time.year : '0'}</span>
        <div className={style.decorationBar}></div>
      </div>

      {/* 主题区域 */}
      <Card className={style.card}>

        {/* 本月统计卡片 */}
        <Row>
          {/* 左侧支出收入统计 */}
          <Col span={12} className={style.col}>
            <Col span={24} className={style.payOut}>
              <div>
                <p>本月支出：</p>
                <div style={{ width: 100 + '%', overflow: 'hidden' }}><p className={style.payCountSum}>￥???<RightOutlined className={style.icon} /></p></div>
              </div>
            </Col>
            <Col className={style.income}>
              <div className={style.betweenText}><span>本月收入：</span><span >￥???<RightOutlined className={style.icon} /></span></div>
              <div className={style.betweenText}><span>预算额度：</span><span >￥???<RightOutlined className={style.icon} /></span></div>
            </Col>
          </Col>

          {/* 右侧支出前三 */}
          <Col span={12} className={style.col}>
            <p>支出分类前3：</p>
            <div>
              <p className={style.showProgress}>???</p>
              <Progress percent={50} showInfo={false} size="small" percent={100} />
            </div>
            <div>
              <p className={style.showProgress}>???</p>
              <Progress percent={50} showInfo={false} size="small" percent={100} />
            </div>
            <div>
              <p className={style.showProgress}>???</p>
              <Progress percent={50} showInfo={false} size="small" percent={100} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 按间隔分类统计卡片 */}
      <Card className={style.card}>
        <Row>
          <Col span={12} className={style.col}>col-12</Col>
          <Col span={12} className={style.col}>col-12</Col>
        </Row>
      </Card>
    </div>
  )
}

export default connect(

)(Index)