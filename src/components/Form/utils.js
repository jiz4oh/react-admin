import { notification } from "antd";
import _ from 'lodash'

export default {
  notifySuccess: (operationName = '操作') => {
    notification.success({
      message: `${operationName}成功`,
      description: `成功${operationName}1条数据`,
      duration: 3,
    })
  },

  notifyError: (operationName = '操作') => {
    notification.error({
      message: `${operationName}失败`,
      description: `请检查您的输入`,
      duration: 3,
    })
  },

  renderAntdError(errorMap = {}) {
    // 创建 antd 的 error 格式
    let errors = []
    _.forEach(errorMap, (value, key) =>
      errors.push({
        name: key,
        errors: value
      }))

    return errors
  },
}
