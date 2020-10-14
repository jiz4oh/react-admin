import {DatePicker} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function DatetimeInput(props) {
  const {
    name,
    placeholder,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <DatePicker
      key={`${name}-input`}
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={placeholder || '请选择日期'}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(DatetimeInput)