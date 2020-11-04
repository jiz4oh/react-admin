import {Checkbox} from "antd";
import React from "react";

import {withIn} from "./utils";

function CheckboxFilter({
                          name,
                          collection,
                          inputOptions = {},
                          value,
                          onChange,
                          ...restProps
                        }) {
  return (
    <Checkbox.Group
      key={`${name}-filter`}
      options={collection}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withIn(CheckboxFilter)
