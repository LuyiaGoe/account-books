import React from 'react'
import style from './style.module.css'
import Slide from '../Slide/Slide'

export default function Index (props) {
  console.log(props);
  return (
    <div className={style.container}>
      <Slide></Slide>
    </div>
  )
}
