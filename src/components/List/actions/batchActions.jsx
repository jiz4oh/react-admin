import React from "react";
import _ from "lodash";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

/**
 * 接受点击事件，快速生成删除/批量删除按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({value?: Object[]}): JSX.ElementClass} React 组件，接受 value 参数
 */
export const renderDeleteAction = onClickFn =>
  ({ value, ...restProps }) =>
    <Button
      key='deleteBtn'
      type="primary"
      danger
      disabled={_.isEmpty(value)}
      onClick={onClickFn(value)}
      {...restProps}
    >
      <DeleteOutlined/>
      {
        !_.isEmpty(value) && value.length > 1
          ? '批量删除'
          : '删除'
      }
    </Button>
