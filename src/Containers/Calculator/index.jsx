import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import style from './style.module.css'
import randomNum from 'number-random'
// 格式化数字
Number.prototype.numberFormat = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

class index extends Component {
  constructor(props) {
    super(props)
    this.numberArr = [1, 4, 7]
    this.calculator = []
    this.wrench = 0
    // 计算时显示正在手打的数值
    this.section = ''
    // 计算并输出值
    this.result = this.props.initialNum || 0
    // 数位
    this.order = 0
    // 计算器数组头部
    this.arrHead = this.calculator[0]
    // 计算器数组尾部是否为运算符
    this.arrPopIsOpe = false
  }
  componentDidUpdate () {
    this.arrHead = this.calculator[0]
    this.arrPopIsOpe = this.calculator[this.calculator.length - 1] === '-' || this.calculator[this.calculator.length - 1] === '+'
  }
  // 向父组件传值
  outPut = () => {
    if (this.props.outPut) {
      this.props.outPut(this.result)
    }
    if (this.result.toString().indexOf('.') !== -1) {  // 查看结果是否有小数点
      this.pointFlag = true  // 有就禁用下一次的小数点
    }
  }
  state = {
    // 计算器扳手wrench，碰到+、-时 +1 ，碰到 = 是为2，当为2时进行计算
    wrench: 0,
    // 计算器显示值
    display: this.props.initialNum,
    // 小数点flag
    pointFlag: false
  }
  getResult = () => {
    this.arrHead = this.calculator[0] // 获取计算器数组第一个元素，用于判断是否头部为运算符
    let copyArr = this.calculator
    if (this.arrHead === '-' || this.arrHead === '+') { // 判断头部是否为运算符
      copyArr.unshift(0) // 是就前置一个0
    }
    this.result = eval(copyArr.splice(0, copyArr.length).join(''))
    this.setState({ ...this.state, display: this.result })
    this.order = 0
    this.wrench = 0
    this.section = ''        // 切换并且下次输入数值为另一个新数
    this.outPut()
    this.pointFlag = false
  }
  // 获取到摁下值
  getValue = (e) => {
    if (e.target.toString() !== '[object HTMLSpanElement]' && e.target.toString() !== '[object HTMLButtonElement]') return
    // 获取值存入value
    let value = e.target.innerText
    // 根据输入值判断
    switch (value) {
      case 'C':   // 清除值，并初始化计算器
        this.setState({ ...this.state, display: 0 })
        this.calculator = []
        this.pointFlag = false
        this.wrench = 0
        this.section = ''
        this.order = 0
        break;
      case 'OK':   // 传出显示数值，并退出计算器
        this.result = this.state.display
        this.outPut()
        setTimeout(() => { //疑似一个bug，同步任务将不会更新父组件的金额，异步任务才行
          if (this.props.closeCalcu) this.props.closeCalcu()
        }, 0)
        break;
      case '=':   // 计算值，并将扳手归零
        let tail = this.calculator[this.calculator.length - 1]
        if (tail === '-' || tail === '+') { // 防止计算器中仅有一个数字和一个运算符
          this.calculator.push(0)         // 为此，在数组后面push一个0进去
        }
        this.getResult()
        this.calculator = [this.result]
        break;
      case '+':   // 加号运算
        this.calculator.push(value)  // 计算器数组中推入加号
        this.wrench++     // 扳手增1
        this.section = ''     // 加号会更新计算器下次输入时的显示值,但不会将值传给display渲染
        this.setState({ ...this.state })
        this.pointFlag = false
        this.order = 0
        break;
      case '-':   // 减号运算
        this.calculator.push(value)
        if (this.calculator.length) {  // 此处用于判断初始值为负的情况
          this.wrench++     // 不为初始值,扳手才加一
        }
        this.section = ''
        this.setState({ ...this.state })
        this.pointFlag = false
        this.order = 0
        break;
      case '.':
        if (!this.pointFlag) {   // 防止一个数字小数点该出现两次
          this.pointFlag = true  // 关闭标识防止添加两个小数点
          this.section += value
          if (this.section.length === 1) {
            this.section = 0 + value // 为初始值为小数的情况加上0这个字
          }
          if (!this.arrPopIsOpe) {
            this.calculator.pop()
          }
          this.calculator.push(this.section)
          this.setState({ ...this.state, display: this.section ? this.section : '0' })
        }
        break;
      default:
        if (this.order >= 9) { break; }//超过9位数则忽略
        this.section += value
        if (this.section[0] === '0' && value !== '0' && this.section.length <= 2) {  // 如果输入的运算数字第一位为0且不是小数的话，防止八进制错误
          this.section = value
          this.setState({ ...this.state, display: this.section })
          break;
        }
        this.order++
        if (this.calculator[0] === this.result.toString() && this.calculator[0] !== this.section && this.calculator.length === 1) {
          this.calculator = []
        }
        let popEl = this.calculator.pop()
        if (this.arrPopIsOpe) {  // 将section推入calculator前的判断,是运算符号的话要重新推回去
          this.calculator.push(popEl)
        }
        this.calculator.push(this.section)
        this.setState({ ...this.state, display: this.section ? this.section : '0' })
    }
    if (this.wrench >= 2) {     // 扳手触发运算
      let a = this.calculator.pop()  // 将计算器数组最后一个运算符弹出
      if (this.calculator[this.calculator.length - 1] === '-' || this.calculator[this.calculator.length - 1] === '+' && this.calculator.length === 2) {  // 如果弹出一个运算符以后，数组尾部还有一个运算符，则自加/自减
        let x = this.calculator.pop()
        this.calculator = [...this.calculator, x, ...this.calculator]
      }
      if (this.calculator.length === 1) return
      this.getResult()
      this.calculator = [this.result, a]  // 计算器数组根据结果重新初始化
      this.wrench = 1   // 扳手初始化为1，因为上一行传入了一个运算符
    }
  }
  render () {
    return (
      <div className={style.container} onClick={this.getValue} >
        <div className={style.display}>{(this.state.display * 1).numberFormat(2)}</div>
        <Row className={style.row}>
          <Col span={18} className={style.sonCol} >
            <Col span={24} className={style.grandCol} >
              <Button type='primary' style={{ background: 'linear-gradient(to bottom,#f2b452,#d78437)' }}>C</Button><Button type='primary'>0</Button><Button type='primary'>.</Button>
            </Col>
            {
              this.numberArr.map((item) => {
                return (
                  <Col span={24} className={style.grandCol} key={randomNum(0, 100000, true)}>
                    <Button type='primary'>{item}</Button><Button type='primary'>{item + 1}</Button><Button type='primary'>{item + 2}</Button>
                  </Col>
                )
              })
            }
          </Col>
          <Col span={6} className={style.functionButton}>
            <Button type='primary' className={style.indecrease} >+</Button>
            <Button type='primary' className={style.indecrease}>-</Button>
            <Button type='primary' className={style.resultBotton}>{this.wrench ? '=' : 'OK'}</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default index;