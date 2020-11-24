import React from "react";
import { Button } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

/**
 * 接受点击事件，快速生成刷新按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function(Object): React.ReactNode} React 组件
 */
export const renderRefreshAction = (onClickFn) =>
  (props) =>
    <Button
      key='refreshBtn'
      onClick={onClickFn}
      {...props}
    >
      <ReloadOutlined/>
    </Button>

/**
 * 接受点击事件，快速生成新建按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function(Object): React.ReactNode} React 组件
 */
export const renderNewAction = onClickFn =>
  (props) =>
    <Button
      key='newBtn'
      type="primary"
      onClick={onClickFn}
      {...props}
    >
      <PlusOutlined/>新建
    </Button>

/**
 * 接受点击事件，快速生成提交按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function(Object): React.ReactNode} React 组件
 */
export const renderSubmitAction = onClickFn =>
  (props) =>
    <Button
      key='submitBtn'
      type='primary'
      onClick={onClickFn}
      {...props}
    >
      提交
    </Button>

/**
 * 接受点击事件，快速生成返回按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function(Object): React.ReactNode} React 组件
 */
export const renderBackAction = onClickFn =>
  (props) =>
    <Button
      onClick={onClickFn}
      {...props}
    >
      返回
    </Button>
