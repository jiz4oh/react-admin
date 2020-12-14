import React from "react";
import { Button } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

/**
 * 接受点击事件，快速生成刷新按钮
 * @returns {React.ReactNode}
 */
export const RefreshAction = (props) =>
  <Button
    key='refreshBtn'
    {...props}
  >
    <ReloadOutlined/>
  </Button>

/**
 * 接受点击事件，快速生成新建按钮
 * @returns {React.ReactNode} React 组件
 */
export const NewAction = (props) =>
  <Button
    key='newBtn'
    type="primary"
    {...props}
  >
    <PlusOutlined/>新建
  </Button>
