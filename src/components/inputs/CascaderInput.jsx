import {Cascader} from "antd";
import React from "react";

import {collectionWrapper} from "./utils";

function CascaderInput(props) {
  const {
    name,
    collection,
    placeholder,
    changeOnSelect,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Cascader
      key={`${name}-input`}
      options={collection}
      expandTrigger="hover"
      // 为 true 时允许只选择父级
      changeOnSelect={changeOnSelect}
      placeholder={placeholder || '请选择'}
      size="default"
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default collectionWrapper(CascaderInput)