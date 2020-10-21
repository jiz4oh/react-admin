import React from "react";
import _ from "lodash";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

/**
 * 接受点击事件，快速生成删除/批量删除按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({records?: Object[]}): JSX.ElementClass} React 组件，接受 records 参数
 */
export const renderDeleteAction = onClickFn =>
  ({records}) =>
    <Button
      key='deleteBtn'
      type="primary"
      danger
      disabled={_.isEmpty(records)}
      onClick={onClickFn(records)}
    >
      <DeleteOutlined/>
      {
        !_.isEmpty(records) && records.length > 1
          ? '批量删除'
          : '删除'
      }
    </Button>
