import React, { Component } from 'react';
import Calculator from '../../../Calculator';
import style from './style.module.css'

class DrawerCalculator extends Component {
  state = {
    balance: JSON.parse(localStorage.getItem('balance')) || 0
  }
  componentDidMount () {
  }
  closeCalcu = () => {
    localStorage.setItem('balance', JSON.stringify(this.state.result))
    this.setState({ ...this.state, balance: this.state.result })
  }
  outPut = (value) => {
    this.setState({ ...this.state, result: value })
  }


  render () {
    return (
      <div className={style.container}>
        <Calculator initialNum={JSON.parse(localStorage.getItem('balance')) || 0} closeCalcu={this.closeCalcu} outPut={this.outPut}></Calculator>
      </div>
    );
  }
}

export default DrawerCalculator;
