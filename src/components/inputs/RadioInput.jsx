import {Radio} from "antd";
import React from "react";

import './index.scss'
import {withCollection} from "./utils";

function RadioInput(props) {
  const {
    name,
    collection,
    inputOptions = {},
    vertical,
    value,
    onChange,
    ...restProps
  } = props

  // 配置是否水平显示，默认横排
  if (!!(vertical)) {
    inputOptions['className'] = 'C-radio-input'
  }

  return (
    <Radio.Group
      key={`${name}-input`}
      options={collection}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withCollection(RadioInput)
