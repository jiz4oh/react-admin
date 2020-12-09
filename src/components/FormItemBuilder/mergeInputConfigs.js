import _ from "lodash";
import i18n from "@/utils/i18n";
import { belongsToInputConfigRender } from "./belongsToInputConfigRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const INPUT_CONFIG_MAP = process.env.REACT_APP_FORM_DATA_TYPE_KEY
const BELONGS_TO = process.env.REACT_APP_FORM_BELONGS_TO_KEY
const HAS_ONE = process.env.REACT_APP_FORM_HAS_ONE_KEY
const HAS_MANY = process.env.REACT_APP_FORM_HAS_MANY_KEY
const COLLECTION = process.env.REACT_APP_FORM_COLLECTION_KEY

/**
 *
 * @param destination {Object}
 * @param source {Object[]} 前端定义的 input 结构
 * @param tableName {string} 用于 i18n
 * @return {Object[]} return new InputConfigs
 */
export function mergeInputConfigs(destination, source, tableName) {
  // 远程获取表单字段类型
  const { [INPUT_CONFIG_MAP]: inputConfigs = [] } = destination
  const result = _.cloneDeep(source)

  _.forEach(inputConfigs, inputConfig => {
    const name = inputConfig.name
    const label = i18n.t([i18nKey, tableName, name].filter(Boolean).join('.'))
    // 查找当前 input 是否在前端定义
    const index = _.findIndex(result, obj => obj.name === name)

    const definedInputConfig = result[index]

    const mergedInputConfig = mergeCollection(mergeInputConfig(inputConfig, definedInputConfig, {
      name, label, tableName
    }), inputConfig)

    index === -1 ?
      result.push(mergedInputConfig) :
      result[index] = mergedInputConfig
  })

  return result
}

/**
 *
 * @param destination {Object}
 * @param source {Object}
 * @returns {Object}
 */
function mergeInputConfig(destination, source, {
  name, label, tableName
}) {
  switch (destination.type) {
  case HAS_ONE:
  case HAS_MANY:
    // 递归合并 inputConfig
    return _.defaultsDeep({
      [INPUT_CONFIG_MAP]: mergeInputConfigs(destination, source[INPUT_CONFIG_MAP] || [], tableName)
    }, source, destination)
  case BELONGS_TO:
    return _.defaultsDeep(
      { name },
      belongsToInputConfigRender(destination, source, name, label)
    )
  default:
    // 合并前端已配置数据，后端传入时必须是个对象
    return _.defaultsDeep(destination, source)
  }
}

/**
 *
 * @param destination {Object} 原始未合并 collection 前的 inputConfig
 * @param source {Object} 需要合并的 inputConfig
 * @returns {Object}
 */
function mergeCollection(destination, source) {
  const collection = source[COLLECTION]
  // 如果 collection 中未有当前字段的设置则返回
  if (_.isEmpty(collection)) return destination

  // collection 钩子
  if (_.isFunction(destination.collection)) {
    destination.collection = destination.collection(collection)
  } else {
    destination.collection = collection
  }

  return destination
}
