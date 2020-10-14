import React from 'react'
import { Col, Row } from 'antd'
import _ from 'lodash'

import i18n from '../i18n'
import Logger from '../Logger'

const logger = Logger.getLogger('FormBuilder')

/**
 * 根据配置生成 filters 组件
 * @param field {Object} 字段的配置
 * @param tableName {String} 表明，用于查询 i18n 翻译
 * @param onTypecast {Function} 类型转换使用的函数
 * @param formType {String} 结合 field 判断当前 form 是否渲染 builder
 * @returns {ReactNode}
 */
const renderField = (field, {tableName, onTypecast, formType}) => {
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

  // 创建传入 input 的配置
  const inputComponentConfig = {
    name: name,
    // 默认使用 i18n 翻译，可通过 formConfig 中的 label 设置覆盖
    label: label || i18n.t(`activerecord.attributes.${tableName}.${name}`) || name,
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

/**
 * 包装 filters 为多行多列
 * @param fields {Object[]} 要显示的字段名数组
 * @param meta {Object} Form 配置信息
 * @returns {ReactNode[]}
 */
const renderLayout = (fields = [], {columns = 1, gutter = 0}) => {
  if (columns === 1) return fields;
  const rows = [];
  const colspan = 24 / columns

  for (let i = 0; i < fields.length; i += columns) {
    const cols = []
    for (let j = 0; j < columns; j += 1) {
      !_.isEmpty(fields[i + j]) && cols.push(
        <Col key={j} span={colspan.toString()}>
          {fields[i + j]}
        </Col>
      );
    }

    rows.push(
      <Row key={i} gutter={gutter}>
        {cols}
      </Row>
    );
  }

  return rows
}

export default function FormBuilder({fields = [], columns, gutter, ...restMeta}) {
  return (
    renderLayout(
      fields.map(field => renderField(field, restMeta)),
      {
        columns,
        gutter
      }
    )
  )
}
