import {Form, message, Spin} from "antd";
import React, {useEffect, useState} from "react";
import _ from "lodash";

import Logger from "../../../../common/js/Logger";
import {PREDICATE, RANGE_FIELD} from '../constants'

const logger = Logger.getLogger('filter');

const defaultType = 'string'

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

const upperCamelCase = function (str) {
  return _.upperFirst(_.camelCase(str))
}

/**
 * 映射 filters 类型
 *
 * @param fieldName {String} 如果 type 未找到尝试使用 fieldName 推断
 * @param type {String} 根据 type 自动推断使用哪一个 filters
 * @param as {String} 显式指定 filters 类型，不再自动判断
 *
 * @returns function
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
function withFormItem(WrappedComponent, predicate = '') {
  /**
   * input 基类
   *
   * @param name {String} form.item 的 key,
   * @param label {String} input 输入框前的 label 标签,
   * @param extra {String} 提示性标签,
   * @param rules {{}[]} form 验证规则,
   * @param colOptions {{}} col 组件的属性,
   * @param formOptions {{}} item 组件的属性,
   *
   * @return {Component} 返回修改后的组件
   *
   */
  return function ({
                     name,
                     label,
                     extra,
                     rules,
                     formOptions = {},
                     ...restProps
                   }) {
    logger.debug(`transform field ${JSON.stringify(restProps)} to ${WrappedComponent.name} component`);

    return (
      <>
        {!!predicate && <Form.Item key={`${name}${PREDICATE}`}
                                   name={`${name}${PREDICATE}`}
                                   initialValue={predicate}
                                   hidden={true}/>}
        <Form.Item
          key={name}
          name={name}
          label={label}
          rules={rules}
          extra={extra}
          labelCol={{span: 8}}
          {...formOptions}
        >
          <WrappedComponent name={name} {...restProps}/>
        </Form.Item>
      </>
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
  return function ({collection: preCollection, ...resetProps}) {
    const [spinning, setSpinning] = useState(_.isFunction(preCollection))
    const [collection, setCollection] = useState(preCollection)

    useEffect(
      () => {
        // 如果传入的是一个函数，执行并传入成功回调函数
        if (_.isFunction(preCollection)) {
          preCollection(
            (res) => {
              setSpinning(false)
              setCollection(res)
            }
          )
        }
      }, [preCollection]
    );

    useEffect(
      () => {
        const timeId = setTimeout(() => {
          // 2 秒之后网络请求尚未完毕
          if (_.isFunction(preCollection) && !!spinning) {
            setSpinning(false)
            message.warn('您的网络不稳定，刷新后再试')
          }
        }, 2000)

        // 清除 effect
        return () => clearTimeout(timeId)
      }, [preCollection, spinning]
    );

    !_.isArray(preCollection) && !_.isFunction(preCollection) && logger.error(`${WrappedComponent.name} 未正确传入 collection，支持 Array 及 Function`)

    const collectionInput = withFormItem(WrappedComponent, 'in')({
      ...resetProps,
      collection
    })

    return spinning
      ? <Spin>
        {collectionInput}
      </Spin>
      : collectionInput
  }
}

export {withFormItem, withIn, withEq, withRange, renderFilterBy}