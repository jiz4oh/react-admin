import React from "react";
import {DatePicker} from "antd";

import {withRange} from "./utils";

function DatetimeRangeFilter({
                               name,
                               label,
                               placeholderBegin,
                               placeholderEnd,
                               inputOptions = {},
                               value,
                               onChange,
                               ...restProps
                             }) {
  return (
    <DatePicker.RangePicker
      key={`${name}-filter`}
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

export default withRange(DatetimeRangeFilter)
