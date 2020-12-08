import _ from "lodash";
import i18n from "@/utils/i18n";
import { belongsToInputConfigRender } from "./belongsToInputConfigRender";
import { hasOneInputConfigRender } from "./hasOneInputConfigRender";
import { hasManyInputConfigRender } from "./hasManyInputConfigRender";

const i18nKey = process.env.REACT_APP_I18N_KEY
const DATA_TYPE_MAP = process.env.REACT_APP_FORM_DATA_TYPE_KEY
const BELONGS_TO = process.env.REACT_APP_FORM_BELONGS_TO_KEY
const HAS_ONE = process.env.REACT_APP_FORM_HAS_ONE_KEY
const HAS_MANY = process.env.REACT_APP_FORM_HAS_MANY_KEY

/**
 *
 * @param destination {Object} 远程下发的数据
 * @param source {Object[]} 前端定义的 input 结构
 * @param tableName {string} 用于 i18n
 * @return {Object[]} return new InputsConfig
 */
export function mergeInputsConfig(destination, source, tableName) {
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
      return _.defaultsDeep(value, { name: key }, belongsToInputConfigRender(definedInputConfig, label))
    case HAS_ONE:
      return _.defaultsDeep(value, { name: key }, hasOneInputConfigRender(definedInputConfig, hasOneFields[key]))
    case HAS_MANY:
      return _.defaultsDeep(value, { name: key }, hasManyInputConfigRender(definedInputConfig, hasManyFields[key]))
    default:
      // 合并前端已配置数据，后端传入时必须是个对象
      return _.defaultsDeep(value, definedInputConfig)
    }
  })
}
