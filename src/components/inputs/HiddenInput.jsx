import {Input} from "antd";
import React from "react";

import {withFormItem} from "./utils";

function HiddenInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Input
      key={`${name}-input`}
      size="default"
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default function (props) {
  let {formOptions, ...restProps} = props

  const Hidden = withFormItem(HiddenInput)
  formOptions = {hidden: true, ...formOptions}

  return (
    <Hidden
      formOptions={formOptions}
      {...restProps}
    />
  )
}