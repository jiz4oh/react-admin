import {DatePicker} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function DateInput(props) {

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
      format="YYYY-MM-DD"
      placeholder={placeholder|| '请选择日期'}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(DateInput)