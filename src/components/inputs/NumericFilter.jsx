import { Form, Input, InputNumber, Select } from "antd";
import React from "react";

import { PREDICATE } from './constants'

function NumericFilter({
                         name,
                         label,
                         rules,
                         extra,
                         placeholder,
                         inputOptions = {},
                         value,
                         onChange,
                         ...restProps
                       }) {
  return (
    <Form.Item
      key={name}
      label={label}
      labelCol={{ span: 8 }}
    >
      <Input.Group compact>
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
        <Form.Item
          key={name}
          name={name}
          rules={rules}
          extra={extra}
        >
          <InputNumber
            key={`${name}-filter`}
            size="default"
            allowClear
            placeholder={placeholder}
            formatter={Math.ceil}
            value={value}
            onChange={onChange}
            {...restProps}
            {...inputOptions}
          />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  )
}

export default NumericFilter
