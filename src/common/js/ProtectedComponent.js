import React from 'react'
import {Redirect, useLocation} from 'react-router-dom'
import PropTypes from "prop-types";

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

  for (let i = 0; i < rules.length; i++) {
    const {
      require,
      onFail = p => <Redirect to="/404"/>
    } = rules[i]

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
