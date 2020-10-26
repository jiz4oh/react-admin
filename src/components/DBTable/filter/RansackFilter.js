import React from "react";
import { Button, Col, Form, Row } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import _ from 'lodash'
import PropTypes from "prop-types";

import './index.scss'
import FormBuilder from "../../../common/js/builder/FormBuilder";
import { renderFilterBy } from "./index";
import { PREDICATE, RANGE_FIELD } from './constants'

import Logger from "../../../common/js/Logger";

const logger = Logger.getLogger('RansackFilter')

/**
 *
 * @param model {Object} 传入 FormBuilder
 * @param fields {Object[]} 查询条件的字段
 * @param onQuery {Function} 查询按钮的回调函数，接受参数为 filters 组织的数据
 * @param onRest {Function} 重置条件的回调函数
 */
class RansackFilter extends React.PureComponent {
  formRef = React.createRef()

  // 点击查询按钮
  handleClickQuery = () => {
    if (_.isNil(this.props.onQuery)) return

    const fieldsValue = this.formRef.current.getFieldsValue()
    const data = {}

    // 构建查询数据
    _.forEach(fieldsValue, (value, name) => {
      // 不将谓语字段添加到查询中
      if (name.endsWith(PREDICATE) || _.isNil(value)) return

      // 获取当前字段的谓语
      let predicate = fieldsValue[`${name}${PREDICATE}`] || 'eq'
      if (predicate === RANGE_FIELD) {
        // 当是 range 字段时，value 对应的是一个数组或者 undefined
        if (_.isArray(value)) return
        name = name.split('-')[0]
        data[`q[${name}_gteq]`] = value[0]
        data[`q[${name}_lteq]`] = value[1]
      } else {
        data[`q[${name}_${predicate}]`] = value
      }
    })

    this.props.onQuery(data)
  }

  // 点击清除条件按钮
  handleClickReset = () => {
    logger.debug('清除搜索条件')
    this.formRef.current.resetFields()
    this.props.onRest && this.props.onRest()
  }

  render() {
    const meta = {
      model: this.props.model,
      columns: 3,
      fields: this.props.fields,
      onTypecast: renderFilterBy,
      formType: 'filter'
    }
    return (
      <div className='M-filter-container'>
        <Form ref={this.formRef}>
          {FormBuilder(meta)}
        </Form>

        <Row>
          <Col span={12} offset={12}
               style={{textAlign: 'right'}}
          >
            <Button onClick={this.handleClickQuery} type="primary">
              <SearchOutlined/>查询
            </Button>
            <Button onClick={this.handleClickReset}>
              <DeleteOutlined/>清除条件
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

RansackFilter.propTypes = {
  model: PropTypes.shape({
                           name: PropTypes.string.isRequired,
                           i18nKey: PropTypes.string,
                         }),
  fields: PropTypes.array,
};

export default RansackFilter
