import {TimePicker} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function TimeInput(props) {
  const {
    name,
    placeholder,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <TimePicker
      key={`${name}-input`}
      format="HH:mm:ss"
      placeholder={placeholder || '请选择时间'}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(TimeInput)