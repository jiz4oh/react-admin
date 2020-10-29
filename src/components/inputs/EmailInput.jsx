import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function EmailInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input
      key={`${name}-input`}
      allowClear
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default function (props) {
  let {rules = [], ...restProps} = props

  const Email = withFormItem(EmailInput)

  rules = [{
    type: 'email',
    message: '请输入正确的邮箱地址'
  }, ...rules]

  return (
    <Email
      rules={rules}
      {...restProps}
    />
  )
}