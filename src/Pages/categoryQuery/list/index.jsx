import React from 'react';
import style from './style.module.css';
import Day from './dayStream';
import random from 'number-random';

let year = new Date().getFullYear()
const Index = (props) => {
  let list = props.list.length ? props.list : [{ date: 0 }]
  let obj = {}
  let keys = Object.keys(obj)
  let day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  // 将props传入的list按照日期进行分类，装入obj中，并且更新好obj的键名keys
  const classify = () => {
    list.map(item => {
      let year = new Date(item.date).getFullYear(),
        month = new Date(item.date).getMonth(),
        date = new Date(item.date).getDate()
      if (keys.indexOf(`${year}.${month}.${date}`) < 0) {
        obj[`${year}.${month}.${date}`] = [item]
      } else {
        obj[`${year}.${month}.${date}`].push(item)
      }
      keys = Object.keys(obj)
    })
  }
  const display = () => {
    classify()
    return (
      keys.map(item => {
        let arr = item.split('.')
        return (
          <div key={`${arr[0]}年${arr[1]}月${arr[2]}日`}>
            <div className={style.head}>
              <div style={{ display: year === arr[0] * 1 ? 'none' : 'block', marginRight: '20px' }}>{arr[0]}年</div>
              <div style={{ marginRight: '20px' }}>{`${arr[1] * 1 + 1}月${arr[2]}日`}</div>
              <div style={{ marginRight: '20px' }}>{day[new Date(arr[0], arr[1], arr[2]).getDay()]}</div>
            </div>
            {
              obj[item].map(item => {
                return <Day list={item}></Day>
              })
            }
          </div>
        )
      })
    )
  }
  return (
    <div>
      {display()}
    </div>
  );
}

export default Index;
