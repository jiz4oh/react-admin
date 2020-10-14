import {Select} from "antd";
import React from "react";

import {withIn} from "./utils";

function SelectFilter({
                        name,
                        collection,
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

export default withIn(SelectFilter)