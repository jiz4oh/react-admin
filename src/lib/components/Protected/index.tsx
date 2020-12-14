import {useLocation} from 'react-router-dom'
import {Location} from "history"

export type onFailFunc<T> = (location: Location) => T;

export interface rule<T> {
  require: (location: Location) => boolean;
  onFail?: onFailFunc<T>;
}

export interface Props<T> {
  rules: rule<T>[];
  children: T;
  onFail: onFailFunc<T>;
}

/**
 * 访问子组件需要权限
 * @param children {ReactNode} 需要访问的子组件
 * @param rules {Object[]} 所有权限校验规则
 * @param rules.require {Function} 权限校验规则
 * @param rules.onFail {Function} 校验失败的失败回调
 * @param globalOnFail {Function} 全局默认校验失败回调
 */
function Protected<T>({children, rules, onFail: globalOnFail}: Props<T>): T{
  const location = useLocation()

  for (const rule of rules) {
    const {require, onFail = globalOnFail} = rule
    if (!(require(location))) {
      // 如果验证不通过，执行失败回调
      return onFail(location)
    }
  }

  return children
}

export default Protected
