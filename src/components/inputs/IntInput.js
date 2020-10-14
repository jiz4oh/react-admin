import {InputNumber} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function IntInput(props) {
  const {
    name,
    max,
    min,
    placeholder,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <InputNumber
      key={`${name}-input`}
      size="default"
      max={max}
      min={min}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(IntInput)