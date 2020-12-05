import React from 'react'
import _ from 'lodash'

import PolymorphicGrid from "@/lib/components/PolymorphicGrid";
import i18n from '@/utils/i18n'
import Logger from '@/utils/Logger'

const logger = Logger.getLogger('Form')
const i18nKey = process.env.REACT_APP_I18N_KEY

/**
 * 根据 inputConfig 生成相应的组件
 * @param name {string} 名字，用于自动推断类型，提交表单等
 * @param label {string} 标签，如果未指定，则由 i18n 翻译 name
 * @param type {string} 字段类型，推断组件，如 'integer' 在 form 中为 IntInput，在 filter 中为 NumericFilter
 * @param as {string} input类型，绕过推断，强制指定组件，如 'select'
 * @param form {[] | string} 配合 formType 指定当前字段生效的范围
 * @param input {React.ReactNode} 强制使用组件
 * @param restProps {{}} 其他传入组件的参数
 * @param tableName {string} 表名，用于 i18n
 * @param onTypecast {function} 通过 inputConfig 生成 input 组件的函数
 * @param formType {string} 结合 field 判断当前 form 是否渲染
 */
const renderField = ({
                       name,
                       label,
                       type,
                       as,
                       form,
                       input,
                       ...restProps
                     },
                     {
                       tableName,
                       onTypecast,
                       formType
                     }) => {
  if (!_.isNil(input)) return input
  // 如果 field 指定了 form 类型，则只渲染指定类型，默认渲染所有
  if (_.isArray(form) && !form.includes(formType)) return
  if (_.isString(form) && form !== formType) return

  // 根据指定的 显示类型 选择 input 类型
  let InputComponent = onTypecast && onTypecast(name, type, as)

  if (!_.isFunction(InputComponent)) {
    // 未实现的组件不转换
    logger.warn(`${InputComponent} 不是有效的 InputComponent，请检查配置`)
    return
  }

  const i18nName = [i18nKey, tableName, name].filter(Boolean).join('.')
  return <InputComponent
    key={`form-item-${name}`}
    name={name}
    label={label || i18n.t(`${i18nName}`) || name}
    {...restProps}
  />
}

export default function({
                          fields = [],
                          columns,
                          gutter,
                          ...formMeta
                        }) {
  return (
    <PolymorphicGrid columns={columns} gutter={gutter}>
      {fields.map(field => renderField(field, formMeta)).filter(Boolean)}
    </PolymorphicGrid>
  )
}
