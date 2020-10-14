import React, {useState, useMemo} from 'react';

import img from './img/404.png';
import './index.scss'
import {defaultLayout} from "../../layouts";

function NotFound({layout: Layout = defaultLayout}) {
  const [animated, setAnimated] = useState('')

  const onEnter = useMemo(() => setAnimated('hinge'),[])

  const result = (
    <div
      className="G-center"
      style={{height: '100%', background: '#ececec', overflow: 'hidden'}}
    >
      <img
        src={img}
        alt="404"
        className={`animated swing ${animated}`}
        onMouseEnter={onEnter}
      />
    </div>
  )

  return (
    Layout ? <Layout children={result}/> : result
  );
}

export default NotFound;