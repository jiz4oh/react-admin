import React, { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from "prop-types";
import { Button, Result } from "antd";

/**
 * 访问子组件需要权限
 * @param {ReactNode} children 需要访问的子组件
 * @param {Object[]} rules - 所有权限校验规则
 * @param {Function} rules.require 权限校验规则
 * @param {Function} rules.onFail 校验失败的失败回调
 * @returns {*} 验证成功返回子组件，不成功则执行失败回调
 */
const ProtectedComponent = ({children, rules}) => {
  const location = useLocation()
  const history = useHistory()
  const defaultFailFn = useCallback(p => (
    <Result
      status="403"
      title={"403"}
      subTitle={"对不起，您没有权限访问该页面"}
      extra={
        <>
          <Button type="primary" onClick={() => history.push('/dashboard')}>
            返回控制面板
          </Button>
          <Button onClick={() => history.goBack()}>
            返回上一页
          </Button>
        </>
      }
    />
    // eslint-disable-next-line
  ), [])

  for (let i = 0; i < rules.length; i++) {
    const {require, onFail = defaultFailFn} = rules[i]

    if (!(require({location}))) {
      // 如果验证不通过，执行失败回调
      return onFail({location})
    }
  }

  return children
}

ProtectedComponent.propTypes = {
  rules: PropTypes.array.isRequired,
}

export default ProtectedComponent
