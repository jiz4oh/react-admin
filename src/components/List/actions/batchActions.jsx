import React from "react";
import _ from "lodash";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

/**
 * 接受点击事件，快速生成删除/批量删除按钮
 * @param onClick {Function} 点击事件
 * @param value {Object} 需要操作的记录
 * @param restProps
 * @returns {React.ReactNode}
 */
export const DeleteAction = ({ onClick, value, ...restProps }) =>
  <Button
    key='deleteBtn'
    type="primary"
    danger
    disabled={_.isEmpty(value)}
    onClick={onClick(value)}
    {...restProps}
  >
    <DeleteOutlined/>
    {
      !_.isEmpty(value) && value.length > 1
        ? '批量删除'
        : '删除'
    }
  </Button>

