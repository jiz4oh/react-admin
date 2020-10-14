import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function PasswordInput(props) {
  const {
    name,
    placeholder,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input.Password
      key={`${name}-input`}
      placeholder={placeholder || '请输入密码'}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(PasswordInput)