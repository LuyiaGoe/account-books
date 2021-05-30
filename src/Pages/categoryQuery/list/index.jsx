import React from 'react';

import Day from './dayStream';

let year = new Date().getFullYear()
const index = (props) => {
  let list = props.list
  const display = () => {
    return list.map(item => {
      return <Day list={item}></Day>
    })
  }
  return (
    <div>
      {display()}
    </div>
  );
}

export default index;
