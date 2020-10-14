import {Checkbox} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import React from "react";

import {withFormItem} from "./utils";

function BooleanInput(props) {
  const {
    name,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <Checkbox
      key={`${name}-input`}
      checkedChildren={<CheckOutlined/>}
      unCheckedChildren={<CloseOutlined/>}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(BooleanInput)