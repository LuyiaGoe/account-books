import React from 'react'
import style from './style.module.css'

export default function Index (props) {
  function log () {
  }
  return (
    <div>
      {props.children}
    </div>
  )
}
