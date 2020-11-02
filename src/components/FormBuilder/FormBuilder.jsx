import React from 'react'
import _ from 'lodash'

import i18n from '../../common/js/i18n'
import Logger from '../../common/js/Logger'
import {
  PolymorphicLayout
} from "../layouts";
import globalConfig from "../../config";

const logger = Logger.getLogger('Form')
const i18nKey = globalConfig.i18nKey

/**
 * 根据配置生成 filters 组件
 * @param field {Object} 字段的配置
 * @param tableName {string} 表明，用于 i18n
 * @param onTypecast {Function} 类型转换使用的函数
 * @param formType {String} 结合 field 判断当前 form 是否渲染 builder
 * @returns {ReactNode}
 */
const renderField = (field, {
  tableName,
  onTypecast,
  formType
}) => {
  const {
    name,
    label,
    type,
    as,
    form,
    input,
    ...rest
  } = field

  if (!_.isNil(input)) return input
  // 如果 field 指定了 form 类型，则只渲染指定类型，默认渲染所有
  if (_.isArray(form) && !form.includes(formType)) return
  if (_.isString(form) && form !== formType) return

  const i18nName = [i18nKey, tableName, name].filter(Boolean).join('.')
  // 创建传入 input 的配置
  const inputComponentConfig = {
    name: name,
    // 默认使用 i18n 翻译，可通过 formConfig 中的 label 设置覆盖
    label: label || i18n.t(`${i18nName}`) || name,
    ...rest
  }

  // 根据指定的 显示类型 选择 input 类型
  let InputComponent = onTypecast && onTypecast(name, type, as)

  if (!_.isFunction(InputComponent)) {
    // 未实现的 filters 不转换
    return logger.warn(`${InputComponent} 不是有效的 InputComponent，请检查配置`)
  }

  return <InputComponent
    key={`form-item-${name}`}
    {...inputComponentConfig}
  />
}

export default function ({
  fields = [],
  columns,
  gutter,
  ...restMeta
}) {
  return (
    <PolymorphicLayout columns={columns} gutter={gutter} >
      {fields.map(field => renderField(field, restMeta))}
    </PolymorphicLayout>
  )
}
