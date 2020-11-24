import React from "react";
import { Button } from "antd";

/**
 * 接受点击事件，快速生成编辑按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({value?: Object}): React.ReactNode} React 组件，接受 value 参数
 */
export const renderEditAction = onClickFn =>
  ({ value, ...restProps }) => (
    <Button
      key='editBtn'
      type={'text'}
      onClick={onClickFn(value)}
      size='small'
      {...restProps}
    >
      编辑
    </Button>
  )

/**
 * 接受点击事件，快速生成详情按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({value?: Object}): React.ReactNode} React 组件，接受 value 参数
 */
export const renderShowAction = onClickFn =>
  ({ value, ...restProps }) => (
    <Button
      key='showBtn'
      type={'text'}
      onClick={onClickFn(value)}
      size='small'
      {...restProps}
    >
      详情
    </Button>
  )
