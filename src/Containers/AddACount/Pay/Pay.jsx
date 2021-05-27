import React, { useEffect, useState, useRef, useContext } from 'react'
import { connect } from 'react-redux'
import style from './style.module.css'
import Cascader from '../Cascader/Cascader';
import Calculator from '../../Calculator';
import { Collapse, Calendar, Button, Drawer, notification } from 'antd';
import globalContext from '../../../globalContext';
// 这是 redux 的 action，此处依序引入的是：保存当前账单、作为模板保存
import { saveCount, saveAsTemp, editCount } from '../../../redux/actions/saveCount';

const { Panel } = Collapse;

// 支出分类
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
  '其他杂项': ['其他支出', '意外丢失', '烂账损失']
}
// 收入分类
let incomeCat = {
  '职业收入': ['工资收入', '利息收入', '加班收入', '奖金收入', '投资收入', '兼职收入'],
  '其他收入': ['礼金收入', '中奖收入', '意外来钱', '经营所得']
}
// 账户分类
let AccountCat = {
  '现金': ['现金'],
  '虚拟账户': ['银行卡', '公交卡', '支付宝', '微信']
}
// 成员分类
let numberCat = {
  '(无成员)': ['(无成员)'],
  '家人': ['本人', '老公', '老婆', '子女', '父母', '家庭公用'],
  '其他': ['亲戚', '朋友', '同学', '同事', '其他']
}
// 初始值
let initialState = {
  category: '请选择分类',
  account: '请选择账户',
  date: new Date().getTime(),
  member: '(无成员)',
  tempVisible: false,
  calcuVisible: false,
  count: 0
}

function Index (props) {
  let Consumer = useContext(globalContext)
  let [state, setState] = useState(initialState)
  // 传送数据用的对象：
  let info = {
    id: 0,
    count: 0,
    category: '',
    account: '',
    date: '',
    member: '',
    remark: ''
  }
  useEffect(() => {
    if (props.count && props.count[0].id) {
      setState({ ...props.count[0] })
    }
  }, [props])
  // 接收到级联传来的支出分类
  const receivePayCat = (data) => {
    info.category = `${data[0]} > ${data[1]}`
    setState({ ...state, category: info.category })
  }
  // 接收到级联传来的账户分类
  const receiveAccountCat = (data) => {
    info.account = `${data[1]}`
    setState({ ...state, account: info.account })
  }
  // 接收到级联传来的成员分类
  const receiveNumberCat = (data) => {
    info.member = `${data[1]}`
    setState({ ...state, member: info.member })
  }
  // 接收到日历的日期
  const onPanelChange = (data) => {
    info.date = data._d
    setState({ ...state, date: data._d })
  }
  // 分类标签、属性及级联选择器
  const classification = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>分类</h1>
        <span style={{ fontSize: '20px' }}>{state.category}</span>
      </div>
    )
  }

  // 账户标签、属性
  const account = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>账户</h1>
        <span style={{ fontSize: '20px' }}>{state.account}</span>
      </div>
    )
  }

  // 日期
  const date = () => {
    let str = `${new Date(state.date).getFullYear()}年 ${new Date(state.date).getMonth() + 1}月 ${new Date(state.date).getDate()}日`
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>日期</h1>
        <span style={{ fontSize: '20px' }}>{str}</span>
      </div>
    )
  }
  // 成员
  const number = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: ' 0px', padding: '0px 50px', color: 'gray' }}>成员</h1>
        <span style={{ fontSize: '20px' }}>{state.member}</span>
      </div>
    )
  }
  // 键入事件
  let inputRef = useRef(null)
  const keyDown = (e) => {
    if (e.target.id === 'input' && e.keyCode === 13) {
      conserve(2)
    }
  }
  // 模板名称键入事件
  let tempInputRef = useRef(null)
  const tempKeyDown = (e) => {
    if (e.keyCode === 13) { conserveTemp() }
  }
  // 保存模板
  const conserveTemp = () => {
    const deepClone = (obj) => {    // 简易深拷贝函数
      if (typeof obj !== 'object' || obj === null) {
        return obj
      }
      let result
      if (Array.isArray(obj)) {
        result = []
      } else {
        result = {}
      }
      for (let key in obj) {
        result[key] = deepClone(obj[key])
      }
      return result
    }
    conserve(1)
    if (!tempInputRef.current.value) {
      notification['error']({
        message: '请填写模板名称'
      });
      return null
    }
    let cloneObj = deepClone(info)  // 拷贝info
    cloneObj.tempName = tempInputRef.current.value
    props.saveAsTemp(cloneObj)
    onClose()
  }
  // 下拉区域
  const collapseList = () => {
    return (
      <Collapse accordion>
        <Panel header={classification()} key={'paycat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={props.pay ? payCat : incomeCat} change={receivePayCat}></Cascader>
        </Panel>
        <Panel header={account()} key={'account'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={AccountCat} change={receiveAccountCat}></Cascader>
        </Panel>
        <Panel header={date()} key={'datecat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <div className={style.site_calendar_demo_card}>
            <Calendar fullscreen={false} onChange={onPanelChange} ></Calendar>
          </div>
        </Panel>
        <Panel header={number()} key={'numbercat'} showArrow={false} style={{ padding: '12px 30px 12px 0' }}>
          <Cascader obj={numberCat} change={receiveNumberCat}></Cascader>
        </Panel>
      </Collapse>
    )
  }
  // 保存
  const conserve = (s) => {
    if (!verification()) {
      return null
    }
    info.id = state.id ? state.id : (new Date()).getTime()
    info.count = state.count
    info.category = state.category
    info.account = state.account
    info.date = new Date(state.date).getTime()
    info.member = state.member
    info.remark = inputRef.current.value
    info.pay = props.pay
    if (s.toString() === '[object Object]' || s === 2) {
      if (state.id) {
        props.editCount(info)
      } else {
        props.saveCount(info)
      }
    }
  }
  // 保存为模板
  const conserveAsTemp = () => {
    setState({ ...state, tempVisible: true })
    Consumer.mainOut()
  }
  // 验证填单
  const verification = () => {
    if (state.category === '请选择分类') {
      notification['error']({
        message: '请选择分类'
      })
      return false
    } else if (state.account === '请选择账户') {
      notification['error']({
        message: '请选择账户'
      })
      return false
    }
    return true
  }
  // 关闭抽屉
  const onClose = () => {
    setState({ ...state, tempVisible: false })
    Consumer.mainIn()
  }
  // 抽屉头部区域
  const title = () => {
    return (
      <div className={style.head}>
        <span style={{ fontSize: '25px', fontWeight: 700, lineHeight: '46px' }}>{state.calcuVisible ? '' : '编辑模板'}</span>
        <Button type="text" onClick={
          () => {
            if (state.tempVisible) return onClose()
            else return closeCalcu()
          }
        } danger style={{ position: 'absolute', right: '10px', fontSize: '20px', color: 'brown' }}>
          关闭
        </Button>
      </div>
    )
  }
  // 打开计算器
  const openCalcu = () => {
    setState({ ...state, calcuVisible: true })
    Consumer.mainOut()
  }
  // 关闭计算器
  const closeCalcu = () => {
    setState({ ...state, calcuVisible: false })
    Consumer.mainIn()
  }
  // 计算器传出值
  const outPut = (value) => {
    setState({ ...state, count: value })
  }
  return (
    <div className={style.container}>
      <div style={{ borderBottom: '1px solid rgb(248,248,248)', overflow: 'hidden', backgroundColor: 'rgb(248,248,248)', cursor: 'pointer' }} onClick={openCalcu}>
        <span className={style.count} style={{ color: props.pay ? 'green' : 'red' }}>￥{state.count}</span>
      </div>
      {/* 下拉菜单区域 */}
      {collapseList()}
      <div style={{ width: '100%', borderBottom: '1px solid rgb(217,217,217)', padding: '1px' }}>
        <input className={style.remark} onKeyDown={keyDown} ref={inputRef} placeholder='备注...' type="text" id='input' />
      </div>
      <div className={style.bottonContainer}>
        <Button type='danger' className={style.conserveButoon} onClick={conserve}>保存</Button>
        <Button type='danger' className={style.conserveAsTempButoon} style={{ display: state.id ? 'none' : 'block' }} onClick={conserveAsTemp}>保存为模板</Button>
      </div>
      {/* 模板抽屉区域 */}
      <Drawer
        title={title()}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={state.tempVisible}
        width={'700px'}
        headerStyle={{ margin: 0, padding: 0 }}
        className={style.drawerBody}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ paddingLeft: '60px', paddingTop: '25px', color: 'gray', whiteSpace: 'nowrap' }}>模板名称</h1>
          <input className={style.remark} ref={tempInputRef} onKeyDown={tempKeyDown} style={{ textAlign: 'right', marginRight: '20px' }} placeholder='请输入模板名' type="text" />
        </div>
        {collapseList()}
        <Button type='danger' className={style.drawerButoon} onClick={conserveTemp}>保存</Button>
      </Drawer>
      <Drawer
        title={title()}
        placement="right"
        closable={false}
        onClose={closeCalcu}
        visible={state.calcuVisible}
        width={'700px'}
        headerStyle={{ margin: 0, padding: 0 }}
        className={style.drawerBody}
      >
        <Calculator initialNum={state.count} closeCalcu={closeCalcu} outPut={outPut}></Calculator>
      </Drawer>

    </div>
  )
}
export default connect(
  state => ({

  }),
  { saveCount, saveAsTemp, editCount }
)(Index)