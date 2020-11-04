import {Select} from "antd";
import React from "react";

import {withCollection} from "./utils";

function SelectInput(props) {
  const {
    name,
    collection,
    placeholder,
    inputOptions = {},
    labelInValue = false,
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Select
      key={`${name}-input`}
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

export default withCollection(SelectInput)
