import {Checkbox} from "antd";
import React from "react";

import {withCollection} from "./utils";

function CheckboxInput(props) {
  const {
    name,
    collection,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Checkbox.Group
      key={`${name}-input`}
      options={collection}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withCollection(CheckboxInput)
