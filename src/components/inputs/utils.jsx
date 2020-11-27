import { Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import _ from "lodash";

import Logger from "../../utils/Logger";
import { PREDICATE, RANGE_FIELD } from "./constants";

const logger = Logger.getLogger('inputs');

const defaultType = 'string'

function upperCamelCase(str) {
  return _.upperFirst(_.camelCase(str))
}

/**
 * 自动判断 input 类型
 *
 * @param fieldName
 * @param type
 * @returns string
 */
const defaultInputType = (fieldName, type) => {
  switch (type) {
  case 'boolean':
    return 'boolean'
  case 'integer':
    return 'int'
    // 或式写法
  case 'float':
  case 'decimal':
    return 'float'
  case 'datetime':
  case 'timestamp':
    return 'datetime'
  case 'time':
    return 'time'
  case 'date':
    return 'date'
  default:
    return findInputTypeBy(fieldName) || defaultType
  }
}

/**
 * 根据 fieldName 自动推断类型
 *
 * @param fieldName
 *
 * @returns string
 */
const findInputTypeBy = (fieldName) => {
  if (fieldName.match(/id/)) return 'int'
  if (fieldName.match(/password/)) return 'password'
  if (fieldName.match(/country$/)) return 'country'
  if (fieldName.match(/time_zone/)) return 'time_zone'
  if (fieldName.match(/email/)) return 'email'
  if (fieldName.match(/^url$|^website$|_url$/)) return 'url'
  if (fieldName.match(/phone|fax/)) return 'phone'
  if (fieldName.match(/search/)) return 'search'
  if (fieldName.match(/color/)) return 'color'
  return defaultType
}

/**
 * 映射 input 类型
 * .e.g. 'string' => 'StringInput'
 * @param fieldName {String} 如果 type 未找到尝试使用 fieldName 推断
 * @param type {String} 根据 type 自动推断使用哪一个 input
 * @param as {String} 显式指定 input 类型，不再自动判断
 * @returns {React.FC}
 */
const renderInputBy = (fieldName, type, as = '') => {
  as = as || defaultInputType(fieldName, type)
  const inputName = upperCamelCase(as + '_input')
  let result
  try {
    result = require(`./${inputName}`).default
  } catch (e) {
    result = require(`./${upperCamelCase(`${defaultType}_input`)}`).default
    logger.warn('can not find input %s, use default instead', inputName);
  }
  return result
}

const defaultFilterType = (fieldName, type) => {
  switch (type) {
  case 'integer':
  case 'float':
  case 'decimal':
    return 'numeric'
  case 'datetime':
  case 'timestamp':
  case 'time':
  case 'date':
    return 'datetime_range'
  default:
    if (fieldName.match(/id/)) return 'numeric'
    if (fieldName.match(/money/)) return 'numeric'
    // 按照 rails 命名规则，时间通常命名为 created_at 等
    if (fieldName.match(/ed_at$/)) return 'datetime_range'
    return defaultType
  }
}

/**
 * 映射 filters 类型，根据名称查找当前目录下 Filter 后缀的文件导入
 * .e.g. 'string' => 'StringFilter'
 * @param fieldName {String} 如果 type 未找到尝试使用 fieldName 推断
 * @param type {String} 根据 type 自动推断使用哪一个 filters
 * @param as {String} 显式指定 filters 类型，不再自动判断
 * @returns {React.FC}
 */
const renderFilterBy = (fieldName, type, as = '') => {
  as = as || defaultFilterType(fieldName, type)
  const filterName = upperCamelCase(as + '_filter')
  let result
  try {
    result = require(`./${filterName}`).default
  } catch (e) {
    result = require(`./${upperCamelCase(`${defaultType}_filter`)}`).default
    logger.warn('can not find filters %s, use default instead', filterName);
  }
  return result
}

/**
 *
 * @param WrappedComponent {Function | Class} 给 input 包装 Form.Item
 * @param predicate {String} 用于搜索时给字段添加搜索条件，如 eq, gteq, lteq, in 等
 * @return {Function}
 */
function withFormItem(WrappedComponent, predicate = null) {
  /**
   * HOC 包裹 FormItem
   * @param name {String} form.item 的 key,
   * @param label {String} input 输入框前的 label 标签,
   * @param rules {Object[]} form 验证规则,
   * @param extra {String} 提示性标签,
   * @param widget {React.ReactNode} 自定义组件,
   * @param formOptions {Object} item 组件的属性,
   * @return {React.ReactNode} 返回修改后的组件
   */
  return function({
                    name,
                    label,
                    extra,
                    rules,
                    widget,
                    formOptions = {},
                    ...restProps
                  }) {
    logger.debug(`transform field ${JSON.stringify(restProps)} to ${WrappedComponent.name} component`);

    return widget || (
      <>
        {!!predicate && (
          <Form.Item
            key={`${name}${PREDICATE}`}
            name={`${name}${PREDICATE}`}
            initialValue={predicate}
            hidden={true}
          >
            <Input/>
          </Form.Item>
        )}
        <Form.Item
          key={name}
          name={name}
          label={label}
          rules={rules}
          extra={extra}
          labelCol={{ span: 8 }}
          {...formOptions}
        >
          <WrappedComponent name={name} {...restProps}/>
        </Form.Item>
      </>
    )
  }
}

/**
 * 选择框的 collection 如果是个函数，则从执行函数从后端获取 collection
 * @param fnOrArray {Function | Object[]} 函数或者数组
 * @param children {React.ReactComponentElement} input 组件
 * @param restProps {[]} 其他传入 input 组件的参数
 * @returns {JSX.Element}
 */
function SpinCollection({ collection: fnOrArray, children: CollectionInputComponent, ...restProps }) {
  const [spinning, setSpinning] = useState(!!_.isFunction(fnOrArray))
  const [collection, setCollection] = useState(fnOrArray)

  useEffect(
    () => {
      // 如果传入的是一个函数，执行并传入成功回调函数
      if (_.isFunction(fnOrArray)) {
        fnOrArray((res) => {
          setSpinning(false)
          setCollection(res)
        })
        const timeId = setTimeout(() => {
          // 2 秒之后网络请求尚未完毕
          if (!!spinning) {
            setSpinning(false)
            message.warn('您的网络不稳定，刷新后再试')
          }
        }, 2000)

        // 清除 effect
        return () => clearTimeout(timeId)
      }
    }, [fnOrArray, spinning]
  )

  return (
    <Spin spinning={spinning}>
      <CollectionInputComponent collection={collection} {...restProps}/>
    </Spin>
  )
}

function withCollection(WrappedComponent) {
  return function(props) {
    return (
      <SpinCollection {...props}>
        {withFormItem(WrappedComponent)}
      </SpinCollection>
    )
  }
}

function withEq(WrappedComponent) {
  return withFormItem(WrappedComponent, 'eq')
}

function withRange(WrappedComponent) {
  return withFormItem(WrappedComponent, RANGE_FIELD)
}

function withIn(WrappedComponent) {
  return function(props) {
    return (
      <SpinCollection {...props}>
        {withFormItem(WrappedComponent, 'in')}
      </SpinCollection>
    )
  }
}

export {
  renderInputBy,
  renderFilterBy,
  upperCamelCase,
  withFormItem,
  withCollection,
  withEq,
  withIn,
  withRange,
}
