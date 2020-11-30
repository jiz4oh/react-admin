import {InputNumber} from "antd";
import React from "react";

import {withFormItem} from "./utils";

const positive = value => Math.ceil(value)

function PositiveIntInput(props) {
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
      min={min || 0}
      formatter={positive}
      placeholder={placeholder}
      value={value || 0}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(PositiveIntInput)
