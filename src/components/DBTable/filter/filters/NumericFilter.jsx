import {Form, Input, Select} from "antd";
import React, {useMemo} from "react";

import {withFormItem} from "./utils";
import {PREDICATE} from '../constants'

const selectBefore = name => (
  <Form.Item
    key={`${name}${PREDICATE}`}
    name={`${name}${PREDICATE}`}
    initialValue='eq'
    noStyle
  >
    <Select>
      <Select.Option value="eq">等于</Select.Option>
      <Select.Option value="gteq">大于</Select.Option>
      <Select.Option value="lteq">小于</Select.Option>
    </Select>
  </Form.Item>
)

function NumericFilter({
                         name,
                         placeholder,
                         inputOptions = {},
                         value,
                         onChange,
                         ...restProps
                       }) {
  return (
    <Input
      key={`${name}-filter`}
      size="default"
      addonBefore={useMemo(() => selectBefore(name), [name])}
      allowClear
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(NumericFilter)