import React from "react";
import { Button } from "antd";

/**
 * 接受点击事件，快速生成编辑按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({record?: Object}): JSX.ElementClass} React 组件，接受 record 参数
 */
export const renderEditAction = onClickFn =>
    ({record}) => (
    <Button
      key='editBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      className={'C-option'}
    >
      编辑
    </Button>
  )

/**
 * 接受点击事件，快速生成详情按钮
 * @param onClickFn {Function} 点击事件
 * @returns {function({record?: Object}): JSX.ElementClass} React 组件，接受 record 参数
 */
export const renderShowAction = onClickFn =>
  ({record}) => (
    <Button
      key='showBtn'
      type={'text'}
      onClick={onClickFn(record)}
      size='small'
      className={'C-option'}
    >
      详情
    </Button>
  )
