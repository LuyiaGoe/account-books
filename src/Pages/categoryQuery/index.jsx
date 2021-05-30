import React, { Component } from 'react';
import { connect } from 'react-redux'
import style from './style.module.css'
// antd
import { Popover, DatePicker, Card } from 'antd';
// action
import { getCountData } from '../../redux/actions/countData';
import getData from '../../redux/reducers/countData';
// component
import Head from '../../Containers/Head/Head';
import List from './list';

import random from 'number-random';
const { RangePicker } = DatePicker;

// 分类
let payCat = {
  '衣服饰品': ['衣服帽子', '鞋帽包包', '化妆饰品'],
  '食品酒水': ['早午晚餐', '烟酒茶', '水果零食'],
  '居家物业': ['日常用品', '水电煤气', '房租', '物业管理', '维修保养'],
  '行车交通': ['公共交通', '打车租车', '私家车费用'],
  '交流通讯': ['座机费', '手机费', '上网费', '邮寄费'],
  '休闲娱乐': ['运动健身', '腐败聚会', '休闲玩乐', '宠物宝贝', '旅游度假'],
  '学习进修': ['书报杂志', '培训进修', '数码装备'],
  '人情往来': ['送礼请客', '孝敬家长', '换人钱物', '慈善捐助'],
  '医疗保健': ['药品费', '保健费', '美容费', '治疗费'],
  '金融保险': ['银行手续', '投资亏损', '按揭还款', '消费税收', '利息支出', '赔偿罚款'],
  '其他杂项': ['其他支出', '意外丢失', '烂账损失'],
  '职业收入': ['工资收入', '利息收入', '加班收入', '奖金收入', '投资收入', '兼职收入'],
  '其他收入': ['礼金收入', '中奖收入', '意外来钱', '经营所得']
}
// 账户分类
let accountCat = {
  '现金': ['现金'],
  '虚拟账户': ['银行卡', '公交卡', '支付宝', '微信']
}
// 成员分类
let numberCat = {
  '(无成员)': ['(无成员)'],
  '家人': ['本人', '老公', '老婆', '子女', '父母', '家庭公用'],
  '其他': ['亲戚', '朋友', '同学', '同事', '其他']
}
let year = new Date().getFullYear()
let init = {
  start: new Date(year, 0, 1).getTime(),
  end: new Date(year, 11, 31).getTime(),
  popCat: 'none',
  account: '所有',
  category: ['所有'],
  member: '所有'
}
class index extends Component {
  constructor(props) {
    super(props)
    this.state = { ...init, query: false, list: [] }
    this.list = []
    this.obj = { category: this.state.category, account: this.state.account, member: this.state.member, date: [this.state.start, this.state.end] }
  }
  static getDerivedStateFromProps (np, ps) {
    const { countData } = np
    if (countData.length && countData[0].id) {
      return { ...ps }
    }
    return { ...ps }
  }
  shouldComponentUpdate (np, ns) {
    // if (!np.flash) return false
    this.list = getData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { ...this.obj } } })
    return true
  }
  // 弹出框头部
  text = () => {
    if (this.state.popCat === 'none') {
      return (
        <div className={style.popoverHead}>
          <span className={style.popoverTitle}>流水筛选</span>
          <span className={style.confirm} onClick={this.confirmQuery}>确定筛选</span>
        </div>
      )
    } else {
      return (
        <div className={style.popoverHead}>
          <span className={style.popoverTitle}>{this.state.popCat}筛选</span>
          <span className={style.goback} onClick={() => { this.setState({ ...this.state, popCat: 'none' }) }}><b>&lt;</b>流水筛选</span>
        </div>
      )
    }
  }
  // 确认筛选
  confirmQuery = () => {
    this.obj = { category: this.state.category, account: this.state.account, member: this.state.member, date: [this.state.start, this.state.end] }
    if (this.state.category[0] === '所有') {
      delete this.obj.category
    }
    if (this.state.account === '所有') {
      delete this.obj.account
    }
    if (this.state.member === '所有') {
      delete this.obj.member
    }
    this.list = getData('getCountData', { type: 'getCountData', data: { list: 'all', demand: { ...this.obj } } })
    const { start, end } = this.state
    let s = new Date(start),
      e = new Date(end),
      str = `${s.getFullYear()}年${s.getMonth() + 1}月${s.getDate()}日~${e.getFullYear()}年${e.getMonth() + 1}月${e.getDate()}日`
    this.setState({ ...this.state, query: true, title: str, list: this.list, visible: false })
  }
  // 弹出框主体
  content = () => {
    if (this.state.popCat === 'none') {
      return (
        <div className={`${style.popoverContent} pop`}>
          <Card className={style.card}>
            <RangePicker style={{ width: 500 }} bordered={false} onCalendarChange={(value, str) => (this.dateChange(value, str))} />
          </Card>
          <Card className={style.card}>
            {this.popSelect()}
          </Card>
        </div>
      )
    } else {
      let arr = []
      let allFlag
      if (this.state.popCat === '分类') {
        let keys = Object.keys(payCat)
        return (
          <div className={`${style.popoverContent} pop`}>
            <Card className={style.card}>
              <div className={style.option} style={{ height: '30px', lineHeight: '30px' }} onClick={() => { this.select('所有') }}>
                <div>所有</div>
                <div style={{ marginTop: '5px' }}>
                  <svg style={{ display: this.state.category[0] === '所有' ? 'block' : 'none' }} t="1622363644700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2412" width="20" height="20"><path d="M341.6 780.1c39.5-88.9 82.1-174.6 127.8-257.4 45.7-82.6 94.7-161 147.3-235.3 52.6-74.3 92.8-125.1 120.4-152.7s46.8-43.7 57.5-48.4c10.6-4.7 34-9.6 70.3-14.7s61.1-7.7 74.6-7.7c8.5 0 12.9 3.3 12.9 9.8 0 4.1-1.5 8.1-4.6 11.9-3 3.9-11.9 12.4-26.5 25.3-73.7 68.6-154.8 169.6-243.1 303.4C589.8 548.2 516 688.6 456.5 835.8c-24.1 58.8-40.5 94-49.5 105.8-9 12.3-37.3 18.3-84.9 18.3-34.2 0-54.7-3.5-61.4-10.4s-20.2-25.8-40.7-56.8c-33.4-51.6-72-100.5-115.4-146.4-22-23.1-32.9-40.7-32.9-52.5 0-16.2 11.9-32.8 36-49.8 23.9-16.9 43.8-25.3 59.7-25.3 20.3 0 45.3 11.2 74.9 33.5 29.6 22.9 62.7 65.4 99.3 127.9z" p-id="2413"></path></svg>
                </div>
              </div>
            </Card>
            <Card className={style.card}>
              {keys.map(item => {
                return <div className={style.option} key={random(1, 10000, false)} onClick={() => { this.select(item) }}>
                  <div>{item}</div>
                  <div className={style.svg}>
                    <svg style={{ display: this.state.category[0] === item ? 'block' : 'none' }} t="1622363644700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2412" width="20" height="20"><path d="M341.6 780.1c39.5-88.9 82.1-174.6 127.8-257.4 45.7-82.6 94.7-161 147.3-235.3 52.6-74.3 92.8-125.1 120.4-152.7s46.8-43.7 57.5-48.4c10.6-4.7 34-9.6 70.3-14.7s61.1-7.7 74.6-7.7c8.5 0 12.9 3.3 12.9 9.8 0 4.1-1.5 8.1-4.6 11.9-3 3.9-11.9 12.4-26.5 25.3-73.7 68.6-154.8 169.6-243.1 303.4C589.8 548.2 516 688.6 456.5 835.8c-24.1 58.8-40.5 94-49.5 105.8-9 12.3-37.3 18.3-84.9 18.3-34.2 0-54.7-3.5-61.4-10.4s-20.2-25.8-40.7-56.8c-33.4-51.6-72-100.5-115.4-146.4-22-23.1-32.9-40.7-32.9-52.5 0-16.2 11.9-32.8 36-49.8 23.9-16.9 43.8-25.3 59.7-25.3 20.3 0 45.3 11.2 74.9 33.5 29.6 22.9 62.7 65.4 99.3 127.9z" p-id="2413"></path></svg>
                  </div>
                </div>
              })}
            </Card >
          </div>
        )
      } else if (this.state.popCat === '账户') {
        allFlag = this.state.account === '所有'
        for (let key in accountCat) {
          arr = [...arr, ...accountCat[key]]
        }
      } else {
        allFlag = this.state.member === '所有'
        for (let key in numberCat) {
          arr = [...arr, ...numberCat[key]]
        }
      }
      return (
        <div className={`${style.popoverContent} pop`} key={random(1, 10000, true)}>
          <Card className={style.card}>
            <div className={style.option} style={{ height: '30px', lineHeight: '30px' }} onClick={() => { this.select('所有') }}>
              <div>所有</div>
              <div style={{ marginTop: '5px' }}>
                <svg t="1622363644700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2412" width="20" height="20" style={{ display: allFlag ? 'block' : 'none' }}><path d="M341.6 780.1c39.5-88.9 82.1-174.6 127.8-257.4 45.7-82.6 94.7-161 147.3-235.3 52.6-74.3 92.8-125.1 120.4-152.7s46.8-43.7 57.5-48.4c10.6-4.7 34-9.6 70.3-14.7s61.1-7.7 74.6-7.7c8.5 0 12.9 3.3 12.9 9.8 0 4.1-1.5 8.1-4.6 11.9-3 3.9-11.9 12.4-26.5 25.3-73.7 68.6-154.8 169.6-243.1 303.4C589.8 548.2 516 688.6 456.5 835.8c-24.1 58.8-40.5 94-49.5 105.8-9 12.3-37.3 18.3-84.9 18.3-34.2 0-54.7-3.5-61.4-10.4s-20.2-25.8-40.7-56.8c-33.4-51.6-72-100.5-115.4-146.4-22-23.1-32.9-40.7-32.9-52.5 0-16.2 11.9-32.8 36-49.8 23.9-16.9 43.8-25.3 59.7-25.3 20.3 0 45.3 11.2 74.9 33.5 29.6 22.9 62.7 65.4 99.3 127.9z" p-id="2413"></path></svg>
              </div>
            </div>
          </Card>
          <Card className={style.card}>
            {arr.map(item => {
              let { account, member } = this.state
              let flag = account === item || member === item
              return <div className={style.option} key={random(1, 10000, true)} onClick={() => { this.select(item) }}>
                <div>{item}</div>
                <div className={style.svg}>
                  <svg t="1622363644700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2412" width="20" height="20" style={{ display: flag ? 'block' : 'none' }}><path d="M341.6 780.1c39.5-88.9 82.1-174.6 127.8-257.4 45.7-82.6 94.7-161 147.3-235.3 52.6-74.3 92.8-125.1 120.4-152.7s46.8-43.7 57.5-48.4c10.6-4.7 34-9.6 70.3-14.7s61.1-7.7 74.6-7.7c8.5 0 12.9 3.3 12.9 9.8 0 4.1-1.5 8.1-4.6 11.9-3 3.9-11.9 12.4-26.5 25.3-73.7 68.6-154.8 169.6-243.1 303.4C589.8 548.2 516 688.6 456.5 835.8c-24.1 58.8-40.5 94-49.5 105.8-9 12.3-37.3 18.3-84.9 18.3-34.2 0-54.7-3.5-61.4-10.4s-20.2-25.8-40.7-56.8c-33.4-51.6-72-100.5-115.4-146.4-22-23.1-32.9-40.7-32.9-52.5 0-16.2 11.9-32.8 36-49.8 23.9-16.9 43.8-25.3 59.7-25.3 20.3 0 45.3 11.2 74.9 33.5 29.6 22.9 62.7 65.4 99.3 127.9z" p-id="2413"></path></svg></div>
              </div>
            })}
          </Card>
        </ div>
      )
    }
  }
  // 选中分类
  select = (value) => {
    switch (this.state.popCat) {
      case '分类':
        this.setState({ ...this.state, category: [value] })
        break;
      case '账户':
        this.setState({ ...this.state, account: value })
        break
      case '成员':
        this.setState({ ...this.state, member: value })
        break
      default:
        break;
    }
  }
  // 分类弹窗
  popSelect = () => {
    let all = ['分类', '账户', '成员']
    let tag = ['category', 'account', 'member']
    return all.map((item, index) => {
      let text = ''
      if (typeof this.state[tag[index]] === 'object') {
        text = this.state[tag[index]][0]
      } else {
        text = this.state[tag[index]]
      }
      return <div
        key={random(1, 10000, true)}
        onClick={() => { this.setState({ ...this.state, popCat: item }) }}
        className={style.option}>
        <div>{item}</div>
        <div>
          {text}
        </div>
      </div>
    })
  }
  // 日期变动
  dateChange = (value, dateStr) => {
    let strStart = dateStr[0] ? dateStr[0].split('-') : [2000, 1, 1],
      strEnd = dateStr[1] ? dateStr[1].split('-') : [2021, 12, 31],
      start = new Date(strStart[0], strStart[1] - 1, strStart[2]).getTime(),
      end = new Date(strEnd[0], strEnd[1] - 1, strEnd[2]).getTime() + 86400000
    this.setState({ ...this.state, start, end })
  }
  // 页面标题
  title = (str) => {
    if (str) {
      return str
    }
    return '分类筛选'
  }
  // 账单合计
  count = {}
  sumCount = () => {
    this.count = { pay: 0, income: 0 }
    this.list.map(item => {
      if (item.pay) {
        this.count.pay += item.count * 1
      } else {
        this.count.income += item.count * 1
      }
    })
  }
  render () {
    return (
      <div className={`${style.container} categoryPage`}>
        <Head>{this.title(this.state.title)}</Head>
        <div className={`${style.popover} pop`}>
          <Popover
            placement="bottomRight"
            title={this.text}
            content={this.content()}
            trigger="click"
            visible={this.state.visible}
            onVisibleChange={() => { this.setState({ ...this.state, visible: !this.state.visible, ...init }) }}>
            <svg onClick={() => { this.setState({ ...this.state, visible: !this.state.visible, popCat: 'none' }) }} t="1622337328088" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1766" width="40" height="40"><path d="M908.463327 147.752498c0 16.859603-13.667703 30.528209-30.528209 30.528209H146.06428c-16.860506 0-30.528209-13.668305-30.528209-30.528209 0-16.860205 13.667703-30.528209 30.528209-30.528209h731.871139c16.860205-0.000301 30.527908 13.668004 30.527908 30.528209z" fill="#515151" p-id="1767"></path><path d="M378.958601 433.856395c-13.178216 10.516142-28.081377 13.753197-33.286615 7.230016L119.713568 157.924855c-5.205239-6.522579 1.258638-20.336586 14.436853-30.852728 13.178216-10.515841 28.081979-13.752595 33.286916-7.229715l225.958418 283.161556c5.205239 6.523181-1.258638 20.335984-14.437154 30.852427zM647.418692 433.856395c13.178517 10.516142 28.081678 13.753197 33.286314 7.230016l225.958719-283.161556c5.204637-6.522579-1.258337-20.336586-14.436853-30.852728-13.178517-10.515841-28.081678-13.752595-33.286917-7.229715l-225.958117 283.161556c-5.205239 6.523181 1.258939 20.335984 14.436854 30.852427z" fill="#515151" p-id="1768"></path><path d="M661.709241 907.526499c-16.859904 0-30.527607-8.959176-30.527607-20.010563V407.810633c0-11.051085 13.667703-20.010261 30.527607-20.010261 16.861108 0 30.528209 8.959176 30.528209 20.010261v479.705605c0 11.051085-13.668305 20.010261-30.528209 20.010261zM363.251971 654.744439c-16.859603 0-30.528209-4.48004-30.528209-10.004679v-239.852803c0-5.525543 13.668606-10.00498 30.528209-10.00498 16.860506 0 30.528209 4.479437 30.528209 10.00498v239.852803c0 5.524941-13.668606 10.004679-30.528209 10.004679z" fill="#515151" p-id="1769"></path><path d="M533.538929 804.625873c-11.921686 11.921987-24.754612 18.419579-28.661174 14.512113l-169.6027-169.6027c-3.907165-3.907165 2.590126-16.739188 14.512113-28.660873 11.922288-11.922288 24.754009-18.41988 28.661475-14.511511l169.601797 169.602098c3.907767 3.907165-2.589825 16.738887-14.511511 28.660873z" fill="#515151" p-id="1770"></path></svg>
          </Popover>
        </div>

        <div className={style.body}>
          <div className={style.blank} style={{ display: this.state.query ? 'none' : 'block' }} onClick={() => { this.setState({ ...this.state, visible: true }) }}>
            <svg t="1622336332779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="896" width="200" height="200"><path d="M622.2 64H64v832h511.8v-64H128V128h416v227h224v36l-0.1 184.4h64L832 391v-86.8L622.2 64zM608 145l127.5 146H608V145z" fill="#727272" p-id="897"></path><path d="M832 768V640h-64v128H640v64h128v128h64V832h128v-64z" fill="#669E8B" p-id="898"></path></svg>
            <div>添加筛选</div>
          </div>
          <div style={{ display: this.state.query ? 'block' : 'none', padding: '5px 0px' }}>
            <div className={style.countHead}>
              {this.sumCount()}
              <div>合计收入：<span>￥{this.count.income}</span></div>
              <div>合计支出：<span>￥{this.count.pay}</span></div>
            </div>
            <List list={this.list}></List>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    countData: state.countData,
    flash: state.saveCount
  }),
  { getCountData }
)(index);
