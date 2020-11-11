import { notification } from "antd";
import _ from 'lodash'

import i18n from "../../common/js/i18n";
import globalConfig from "../../config";

const i18nKey = globalConfig.i18nKey

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
   * @param data {Object} 远程下发的数据
   * @param inputsConfig {Object[]} 前端定义的 input 结构
   * @param tableName {string} 用于 i18n
   * @return {Object[]}
   */
  getInputsConfigFromRemote: (data, inputsConfig, tableName) => {
    // 远程获取表单字段类型
    const inputMap = data['resource_type']
    const belongsToCollection = _.cloneDeep(data['belongs_to']) || {}
    const hasOneCollection = _.cloneDeep(data['has_one']) || {}
    const hasManyCollection = _.cloneDeep(data['has_many']) || {}
    const result = [...inputsConfig]
    _.forEach(inputMap, (value, key) => {
      // 获取当前字段是否在前端已定义
      let index = _.findIndex(inputsConfig, obj => obj.name === key)
      let collection = []

      switch (value) {
        case 'belongs_to':
          // 获取当前 belongs_to 的集合数据
          collection = _.cloneDeep(belongsToCollection[key])
          if (_.isEmpty(collection)) return
          const i18nName = [i18nKey, tableName, key].filter(Boolean).join('.')

          const belongsToDefaultInputConfig = {
            name: key,
            as: 'select',
            rules: [{
              required: true,
              message: `必须填写所属${i18n.t(`${i18nName}`)}`
            }],
            collection: collection,
          }
          if (index === -1) {
            // belongs_to 选择放在最前面
            result.unshift(belongsToDefaultInputConfig)
          } else {
            // 获取前端已配置数据
            result[index] = _.defaultsDeep(_.cloneDeep(inputsConfig[index]), belongsToDefaultInputConfig)
          }
          return
        case 'has_one':
          collection = _.cloneDeep(hasOneCollection[key])
          if (_.isEmpty(collection)) return
          // TODO 嵌套更新写入 input
          return
        case 'has_many':
          collection = _.cloneDeep(hasManyCollection[key])
          if (_.isEmpty(collection)) return
          // TODO 嵌套更新写入 input
          return
        default:
          const inputConfig = {
            name: key,
            type: value
          }
          if (index === -1) {
            result.push(inputConfig)
          } else {
            // 获取前端已配置数据
            result[index] = _.defaultsDeep(_.cloneDeep(inputsConfig[index]), inputConfig)
          }
      }
    })

    return result
  }
}