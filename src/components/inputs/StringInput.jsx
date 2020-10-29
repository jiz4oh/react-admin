import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function StringInput(props) {
  const {
    name,
    placeholder,
    addonBefore,
    addonAfter,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input
      key={`${name}-input`}
      size="default"
      allowClear
      placeholder={placeholder}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(StringInput)