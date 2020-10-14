import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function SearchInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input.Search
      key={`${name}-input`}
      enterButton={true}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(SearchInput)