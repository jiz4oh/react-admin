import React from "react";
import { Button } from "antd";

/**
 * 接受点击事件，快速生成编辑按钮
 * @param onClick {Function} 点击事件
 * @param value {Object} 需要操作的记录
 * @param restProps
 * @returns {React.ReactNode}
 */
export const EditAction = ({ onClick, value, ...restProps }) =>
  <Button
    key='editBtn'
    type={'text'}
    onClick={onClick(value)}
    size='small'
    {...restProps}
  >
    编辑
  </Button>


/**
 * 接受点击事件，快速生成详情按钮
 * @param onClick {Function} 点击事件
 * @param value {Object} 需要操作的记录
 * @param restProps
 * @returns {React.ReactNode}
 */
export const ShowAction = ({ onClick, value, ...restProps }) =>
  <Button
    key='showBtn'
    type={'text'}
    onClick={onClick(value)}
    size='small'
    {...restProps}
  >
    详情
  </Button>


