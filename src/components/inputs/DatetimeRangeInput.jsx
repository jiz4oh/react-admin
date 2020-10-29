import React from "react";
import {DatePicker} from "antd";

import {withFormItem} from "./utils";

function DatetimeRangeInput(props) {
  const {
    name,
    label,
    placeholderBegin,
    placeholderEnd,
    inputOptions = {},
    value,
    onChange,
    ...restProps
  } = props

  return (
    <DatePicker.RangePicker
      key={`${name}-input`}
      allowEmpty={[true, true]}
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      placeholder={[placeholderBegin || '开始日期', placeholderEnd || '结束日期']}
      value={value}
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(DatetimeRangeInput)