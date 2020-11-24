import React from "react";
import { Button } from "antd";

/**
 * 接受点击事件，快速生成编辑按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({record?: Object}): React.ReactNode} React 组件，接受 record 参数
 */
export const renderEditAction = onClickFn =>
  ({ record, ...restProps }) => (
    <Button
      key='editBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      {...restProps}
    >
      编辑
    </Button>
  )

/**
 * 接受点击事件，快速生成详情按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({record?: Object}): React.ReactNode} React 组件，接受 record 参数
 */
export const renderShowAction = onClickFn =>
  ({ record, ...restProps }) => (
    <Button
      key='showBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      {...restProps}
    >
      详情
    </Button>
  )
