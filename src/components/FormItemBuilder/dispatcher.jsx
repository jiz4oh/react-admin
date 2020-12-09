import _ from "lodash";
import i18n from "@/utils/i18n";
import Logger from "@/utils/Logger";
import defaultInputHandler from "./defaultInputHandler";
import hasManyInputHandler from "./hasManyInputHandler";

const logger = Logger.getLogger('Form')
const i18nKey = process.env.REACT_APP_I18N_KEY
const HAS_ONE = process.env.REACT_APP_FORM_HAS_ONE_KEY
const HAS_MANY = process.env.REACT_APP_FORM_HAS_MANY_KEY

/**
 * 根据 inputConfig 生成相应的组件
 * @param config {Object}
 * @param config.name {string} 名字，用于自动推断类型，提交表单等
 * @param config.label {string} 标签，如果未指定，则由 i18n 翻译 name
 * @param config.type {string} 字段类型，推断组件，如 'integer' 在 form 中为 IntInput，在 filter 中为 NumericFilter
 * @param config.as {string} input类型，绕过推断，强制指定组件，如 'select'
 * @param config.form {[] | string} 配合 formType 指定当前字段生效的范围
 * @param config.input {React.ReactNode} 强制使用组件
 * @param config.[INPUT_CONFIG_MAP] {Object[]} has_many, has_one 时使用
 * @param config.restProps {{}} 其他传入组件的参数
 * @param meta {Object}
 * @param meta.tableName {string} 表名，用于 i18n
 * @param meta.onTypecast {function} 通过 inputConfig 生成 input 组件的函数
 * @param meta.formType {string} 结合 field 判断当前 form 是否渲染
 */
export default (config, meta) => {
  let { name, label, type, form, input, collection } = config
  const { tableName, onTypecast, formType } = meta
  if (!_.isNil(input)) return input
  // 如果 field 指定了 form 类型，则只渲染指定类型，默认渲染所有
  if (_.isArray(form) && !form.includes(formType)) return
  if (_.isString(form) && form !== formType) return
  if (!_.isFunction(onTypecast)) {
    logger.warn("无效的 onTypecast")
    return
  }

  // 处理 name
  name = Array.isArray(name) ? _.last(name) : name
  const i18nName = [i18nKey, tableName, name].filter(Boolean).join('.')
  // 处理 Label
  label = label || i18n.t(`${i18nName}`) || name

  const newConfig = { ...config, name, label }
  switch (type) {
  case HAS_ONE:
  case HAS_MANY:
    return collection ?
      defaultInputHandler(newConfig, meta) :
      hasManyInputHandler(newConfig, meta)
  default:
    return defaultInputHandler(newConfig, meta)
  }
}
