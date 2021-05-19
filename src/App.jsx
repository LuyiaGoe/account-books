import React, { Component } from 'react'
import Home from './Containers/Home/Home'
import { withRouter } from 'react-router-dom'
import './global.css'

class App extends Component {
  render () {
    return (
      <div>
        <Home></Home>
      </div>
    )
  }
}

export default withRouter(App)
