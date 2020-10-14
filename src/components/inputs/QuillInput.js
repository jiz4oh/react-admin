import React from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import {withFormItem} from "./utils";

function QuillInput(props) {
  let {
    name,
    label,
    extra,
    rules,
    formOptions,
    inputOptions = {},
    // quill 编辑器初始值不能使用 antd 默认值
    value = '',
    onChange,
    ...restProps
  } = props

  return (
    <ReactQuill
      key={`${name}-input`}
      theme={'snow'}
      value={value}
      // 不能使用 antd 的 onChange
      onChange={onChange}
      {...restProps}
      {...inputOptions}
    />
  )
}

export default withFormItem(QuillInput)