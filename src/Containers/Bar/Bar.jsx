import React from 'react'
import style from './style.module.css'

export default function Index (props) {
  function log () {
    console.log(props);
  }
  return (
    <div>
      {log()}
      {props.children}
    </div>
  )
}
