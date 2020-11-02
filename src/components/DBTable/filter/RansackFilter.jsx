import React from "react";
import { Button, Col, Form, Row } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import _ from 'lodash'
import PropTypes from "prop-types";

import './index.scss'
import {FormBuilder} from "../../FormBuilder";
import { renderFilterBy } from "./index";
import { PREDICATE, RANGE_FIELD } from './constants'

import Logger from "../../../common/js/Logger";

const logger = Logger.getLogger('RansackFilter')

/**
 *
 * @param tableName {string} 用于 i18n
 * @param fields {Object[]} 查询条件的字段
 * @param onQuery {Function} 查询按钮的回调函数，接受参数为 filters 组织的数据
 * @param onRest {Function} 重置条件的回调函数
 */
class RansackFilter extends React.PureComponent {
  static propTypes = {
    tableName: PropTypes.string,
    fields: PropTypes.array,
    onQuery: PropTypes.func,
    onRest: PropTypes.func,
  };

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
        if (_.isEmpty(value)) return
        name = name.split('-')[0]
        data[`q[${name}_gteq]`] = value[0]
        data[`q[${name}_lteq]`] = value[1]
      } else {
        data[`q[${name}_${predicate}]`] = value
      }
    })

    this.props.onQuery(_.cloneDeep(data))
  }

  // 点击清除条件按钮
  handleClickReset = () => {
    logger.debug('清除搜索条件')
    this.formRef.current.resetFields()
    this.props.onRest && this.props.onRest()
  }

  render() {
    const {tableName, fields} = this.props
    return (
      <div className='M-filter-container'>
        <Form ref={this.formRef}>
          <FormBuilder
            tableName={tableName}
            fields={fields}
            columns={3}
            onTypecast={renderFilterBy}
            formType={'filter'}
          />
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

export default RansackFilter
