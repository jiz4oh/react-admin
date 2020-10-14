import {Form, Input, Select} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function PhoneInput(props) {
  const {
    name,
    placeholder,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  const selectBefore = (
    <Form.Item
      key={`${name}-prefix`}
      name={`${name}-prefix`}
      initialValue='86'
      noStyle
    >
      <Select className="select-before">
        <Select.Option value="86">+86</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <Input
      key={`${name}-input`}
      addonBefore={selectBefore}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default function (props) {
  let {rules = [], ...restProps} = props

  const Phone = withFormItem(PhoneInput)

  rules = [{
    pattern: /^1[3-9][0-9]{9}$/,
    message: '手机号格式不正确'
  }, ...rules]

  return (
    <Phone
      rules={rules}
      {...restProps}
    />
  )
}