import { notification } from "antd";
import _ from 'lodash'

import i18n from "../../utils/i18n";

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
   * @return {Object[]}
   */
  getInputsConfigFromRemote: (destination, source, tableName) => {
    const {
      // 远程获取表单字段类型
      [RESOURCE_TYPE_MAP]: inputMap = {},
      [BELONGS_TO]: belongsTo = {},
      [HAS_ONE]: hasOneCollection = {},
      [HAS_MANY]: hasManyCollection = {},
    } = destination
    const result = [...source]

    _.forEach(inputMap, (value, key) => {
      // 获取当前字段是否在前端已定义
      let index = _.findIndex(source, obj => obj.name === key)
      const i18nName = [i18nKey, tableName, key].filter(Boolean).join('.')
      let collection

      switch (value) {
      case BELONGS_TO:
        // 获取当前 belongs_to 的集合数据
        if (_.isEmpty(belongsTo[key])) return
        collection = belongsTo[key]

        const belongsToDefaultInputConfig = {
          name: key,
          as: 'select',
          rules: [{
            required: true,
            message: `必须填写所属${i18n.t(`${i18nName}`)}`
          }],
          collection: collection,
        }
        if (!_.isUndefined(result[index])) {
          // belongs_to 选择放在最前面
          result.unshift(belongsToDefaultInputConfig)
        } else {
          // collection 钩子
          if (_.isFunction(result[index].collection)) {
            belongsToDefaultInputConfig.collection = result[index].collection(belongsToDefaultInputConfig.collection)
          }
          // 获取前端已配置数据
          result[index] = _.defaultsDeep(result[index], belongsToDefaultInputConfig)
        }
        return
      case HAS_ONE:
        collection = _.cloneDeep(hasOneCollection[key])
        if (_.isEmpty(collection)) return
        // TODO 嵌套更新写入 input
        return
      case HAS_MANY:
        collection = _.cloneDeep(hasManyCollection[key])
        if (_.isEmpty(collection)) return
        // TODO 嵌套更新写入 input
        return
      default:
        const inputConfig = {
          name: key,
          type: value
        }
        if (!_.isUndefined(result[index])) {
          result.push(inputConfig)
        } else {
          // 获取前端已配置数据
          result[index] = _.defaultsDeep(result[index], inputConfig)
        }
      }
    })

    return result
  }
}
