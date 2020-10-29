import {Select} from "antd";
import React from "react";

import {collectionWrapper} from "./utils";

const MultiSelectInput = (props) => {
  let {
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
      mode='multiple'
      placeholder={placeholder || '请选择'}
      size="default"
      options={collection}
      labelInValue={labelInValue}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default collectionWrapper(MultiSelectInput)