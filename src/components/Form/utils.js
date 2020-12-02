import { notification } from "antd";
import _ from 'lodash'

import i18n from "@/utils/i18n";
import { belongsToRender } from "@/components/Form/belongsToRender";
import { hasOneRender } from "@/components/Form/hasOneRender";
import { hasManyRender } from "@/components/Form/hasManyRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const RESOURCE_TYPE_MAP = 'data_type'
const BELONGS_TO = 'belongs_to'
const HAS_ONE = 'has_one'
const HAS_MANY = 'has_many'

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

  /**
   *
   * @param destination {Object} 远程下发的数据
   * @param source {Object[]} 前端定义的 input 结构
   * @param tableName {string} 用于 i18n
   * @return {Object[]} return new InputsConfig
   */
  mergeInputsConfig: (destination, source, tableName) => {
    const {
      // 远程获取表单字段类型
      [RESOURCE_TYPE_MAP]: inputMap = {},
      [BELONGS_TO]: belongsToCollection = {},
      [HAS_ONE]: hasOneCollection = {},
      [HAS_MANY]: hasManyCollection = {},
    } = destination

    return _.map(inputMap, (value, key) => {
      const definedInputConfig = _.find(source, obj => obj.name === key) || {}
      const label = i18n.t([i18nKey, tableName, key].filter(Boolean).join('.'))
      switch (value) {
      case BELONGS_TO:
        return belongsToRender(key, definedInputConfig, belongsToCollection[key], label)
      case HAS_ONE:
        return hasOneRender(key, definedInputConfig, hasOneCollection[key], label)
      case HAS_MANY:
        return hasManyRender(key, definedInputConfig, hasManyCollection[key], label)
      default:
        // 合并前端已配置数据
        return _.defaultsDeep(definedInputConfig, {
          name: key,
          type: value
        })
      }
    })
  }
}
