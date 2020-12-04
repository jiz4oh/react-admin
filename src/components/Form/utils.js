import { notification } from "antd";
import _ from 'lodash'

import i18n from "@/utils/i18n";
import { belongsToInputConfigRender } from "@/components/Form/belongsToInputConfigRender";
import { hasOneInputConfigRender } from "@/components/Form/hasOneInputConfigRender";
import { hasManyInputConfigRender } from "@/components/Form/hasManyInputConfigRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const RESOURCE_TYPE_MAP = 'data_type'
const BELONGS_TO = 'belongs_to'
const HAS_ONE = 'has_one'
const HAS_MANY = 'has_many'
const COLLECTION = 'collection'

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
      [HAS_ONE]: hasOneFields = {},
      [HAS_MANY]: hasManyFields = {},
    } = destination

    return _.map(inputMap, (value, key) => {
      const definedInputConfig = _.find(source, obj => obj.name === key) || {}
      const label = i18n.t([i18nKey, tableName, key].filter(Boolean).join('.'))
      switch (value) {
      case BELONGS_TO:
        return belongsToInputConfigRender(key, definedInputConfig, label)
      case HAS_ONE:
        return hasOneInputConfigRender(key, definedInputConfig, hasOneFields[key])
      case HAS_MANY:
        return hasManyInputConfigRender(key, definedInputConfig, hasManyFields[key])
      default:
        // 合并前端已配置数据
        return _.defaultsDeep(definedInputConfig, {
          name: key,
          type: value
        })
      }
    })
  },
  /**
   * 将 COLLECTION 中的内容合并到 inputsConfig 中对应字段的 collection 属性中
   * @param inputsConfig {Object[]}
   * @param data {{COLLECTION: {}}}
   * @return {Object[]}
   */
  mergeCollection: (inputsConfig, data) => {
    const { [COLLECTION]: collections = {}}  = data
    return _.map(inputsConfig, inputConfig => {
      const collection = collections[inputConfig.name]
      // 如果 collection 中未有当前字段的设置则返回
      if (_.isNil(collection)) return inputConfig

      const result = _.cloneDeep(inputConfig)
      // collection 钩子
      if (_.isFunction(result.collection)) {
        result.collection = result.collection(collection)
      } else {
        result.collection = collection
      }

      return result
    })
  }
}
