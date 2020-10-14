import {Form, Input, Select} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function UrlInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  const selectBefore = (
    <Form.Item
      key={`${name}-prefix`}
      name={`${name}-prefix`}
      initialValue='http://'
      noStyle
    >
      <Select>
        <Select.Option value="http://">http://</Select.Option>
        <Select.Option value="https://">https://</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <Input
      key={`${name}-input`}
      addonBefore={selectBefore}
      allowClear
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default function (props) {
  let {formOptions, ...restProps} = props

  formOptions = {
    // UrlInput 标签的默认值
    initialValue: `.com`,
    ...formOptions
  }

  const Url = withFormItem(UrlInput)

  return (
    <Url formOptions={formOptions} {...restProps}/>
  )
}