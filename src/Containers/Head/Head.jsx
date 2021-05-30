import React from 'react'
import style from './style.module.css'

export default function Index (props) {
  const { children } = props
  const title = () => {
    if (props.children) return props.children
    return null
  }
  return (
    <div className={style.main}>
      <div className={style.title}>
        {title()}
      </div>
    </div>
  )
}
