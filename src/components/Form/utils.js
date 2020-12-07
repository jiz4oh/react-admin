import { notification } from "antd";
import _ from 'lodash'

import i18n from "@/utils/i18n";
import { belongsToInputConfigRender } from "@/components/Form/belongsToInputConfigRender";
import { hasOneInputConfigRender } from "@/components/Form/hasOneInputConfigRender";
import { hasManyInputConfigRender } from "@/components/Form/hasManyInputConfigRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const DATA_TYPE_MAP = process.env.REACT_APP_FORM_DATA_TYPE_KEY
const BELONGS_TO = process.env.REACT_APP_FORM_BELONGS_TO_KEY
const HAS_ONE = process.env.REACT_APP_FORM_HAS_ONE_KEY
const HAS_MANY = process.env.REACT_APP_FORM_HAS_MANY_KEY
const COLLECTION = process.env.REACT_APP_FORM_COLLECTION_KEY

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
      [DATA_TYPE_MAP]: dataTypeMap = {},
      [HAS_ONE]: hasOneFields = {},
      [HAS_MANY]: hasManyFields = {},
    } = destination

    return _.map(dataTypeMap, (value, key) => {
      const definedInputConfig = _.find(source, obj => obj.name === key) || {}
      const label = i18n.t([i18nKey, tableName, key].filter(Boolean).join('.'))
      switch (value) {
      case BELONGS_TO:
        return _.defaultsDeep(value,{name: key}, belongsToInputConfigRender(definedInputConfig, label))
      case HAS_ONE:
        return _.defaultsDeep(value,{name: key}, hasOneInputConfigRender(definedInputConfig, hasOneFields[key]))
      case HAS_MANY:
        return _.defaultsDeep(value,{name: key}, hasManyInputConfigRender(definedInputConfig, hasManyFields[key]))
      default:
        // 合并前端已配置数据，后端传入时必须是个对象
        return _.defaultsDeep(value, definedInputConfig)
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
