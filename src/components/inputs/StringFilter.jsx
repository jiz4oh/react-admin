import { Form, Input, Select } from "antd";
import React from "react";

import { PREDICATE } from './constants'

function StringFilter({
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
          initialValue='cont'
          noStyle
        >
          <Select>
            <Select.Option value="cont">包含</Select.Option>
            <Select.Option value="eq">等于</Select.Option>
            <Select.Option value="start">开头</Select.Option>
            <Select.Option value="end">完于</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          key={name}
          name={name}
          rules={rules}
          extra={extra}
        >
          <Input
            key={`${name}-filter`}
            size="default"
            allowClear
            placeholder={placeholder}
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

export default StringFilter
