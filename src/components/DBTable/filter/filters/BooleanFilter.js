import {Select} from "antd";
import React from "react";

import {withEq} from "./utils";

const collection = [
  {
    value: true,
    label: '是'
  },
  {
    value: false,
    label: '否'
  }
]

/**
 * 与 BooleanInput 的区别在于，会有三种选项，是、否、不选（全部）
 */
function BooleanFilter({
                        name,
                        placeholder,
                        inputOptions = {},
                        labelInValue = false,
                        value,
                        onChange,
                        ...restProps
                      }) {
  return (
    <Select
      key={`${name}-filter`}
      allowClear
      placeholder={placeholder || '请选择'}
      size="default"
      showSearch
      labelInValue={labelInValue}
      options={collection}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withEq(BooleanFilter)