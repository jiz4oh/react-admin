import {InputNumber} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function FloatInput(props) {
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
      step={0.01}
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

export default withFormItem(FloatInput)