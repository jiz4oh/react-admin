import _ from "lodash";
import i18n from "@/utils/i18n";
import { belongsToInputConfigRender } from "./belongsToInputConfigRender";
import { hasOneInputConfigRender } from "./hasOneInputConfigRender";
import { hasManyInputConfigRender } from "./hasManyInputConfigRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const INPUT_CONFIG_MAP = process.env.REACT_APP_FORM_DATA_TYPE_KEY
const BELONGS_TO = process.env.REACT_APP_FORM_BELONGS_TO_KEY
const HAS_ONE = process.env.REACT_APP_FORM_HAS_ONE_KEY
const HAS_MANY = process.env.REACT_APP_FORM_HAS_MANY_KEY

/**
 *
 * @param destination {Object}
 * @param source {Object}
 * @returns {Object}
 */
function mergeInputConfig(destination, source, key, label) {
  switch (destination.type) {
  case BELONGS_TO:
    return _.defaultsDeep(
      { name: key },
      belongsToInputConfigRender(destination, source, key, label)
    )
  case HAS_ONE:
    return _.defaultsDeep(
      { name: key },
      hasOneInputConfigRender(destination, source, key, label)
    )
  case HAS_MANY:
    return _.defaultsDeep(
      { name: key },
      hasManyInputConfigRender(destination, source, key, label)
    )
  default:
    // 合并前端已配置数据，后端传入时必须是个对象
    return _.defaultsDeep(destination, source)
  }
}

/**
 *
 * @param destination {Object}
 * @param source {Object[]} 前端定义的 input 结构
 * @param tableName {string} 用于 i18n
 * @return {Object[]} return new InputConfigs
 */
export function mergeInputConfigs(destination, source, tableName) {
  // 远程获取表单字段类型
  const { [INPUT_CONFIG_MAP]: inputConfigMap = {} } = destination
  const result = _.cloneDeep(source)

  _.forEach(inputConfigMap, (inputConfig, key) => {
    const index = _.findIndex(result, obj => obj.name === key)

    const definedInputConfig = result[index]
    const label = i18n.t([i18nKey, tableName, key].filter(Boolean).join('.'))

    const mergedInputConfig = mergeInputConfig(inputConfig, definedInputConfig, key, label)
    !_.isNil(index) ? result[index] = mergedInputConfig : result.push(mergedInputConfig)
  })

  return result
}
