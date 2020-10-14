import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function TextInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input.TextArea
      key={`${name}-input`}
      allowClear
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(TextInput)