import { useLocation } from 'react-router-dom'
import PropTypes from "prop-types";

/**
 * 访问子组件需要权限
 * @param children {ReactNode} 需要访问的子组件
 * @param rules {Object[]} 所有权限校验规则
 * @param rules.require {Function} 权限校验规则
 * @param rules.onFail {Function} 校验失败的失败回调
 * @param globalOnFail {Function} 全局默认校验失败回调
 * @returns {*} 验证成功返回子组件，不成功则执行失败回调
 */
const Protected = ({ children, rules, onFail: globalOnFail }) => {
  const location = useLocation()

  for (const rule of rules) {
    const { require, onFail = globalOnFail } = rule
    if (!(require({ location }))) {
      // 如果验证不通过，执行失败回调
      return onFail({ location })
    }
  }

  return children
}

Protected.propTypes = {
  rules: PropTypes.array.isRequired,
}

export default Protected
