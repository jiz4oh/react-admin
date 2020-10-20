import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import { Form, Row, Space, Spin } from "antd";
import _ from 'lodash'

import formUtils from './utils'
import Logger from "../../../common/js/Logger";
import { renderBackAction, renderSubmitAction } from "../actions";

const logger = Logger.getLogger('form')

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param type {String} 当前 form 的类型，用于 field 中指定 form 渲染
 * @param children {ReactNode[]} 需要渲染的组件数组
 * @param form {Object} Antd 的 FormInstance
 * @param onFinish {Function} Antd 前端校验成功后的操作
 * @param onFinishFailed {Function} Antd 前端校验失败后的操作
 * @param fields {Object[]} form 表单字段，children 字段优先
 * @param isCloseForm {Boolean} 是否显示加载中，防抖
 * @param initialValues {[]} 表单默认值
 * @param footer {Function[]} form 表单底部组件列表
 */
function BasicForm({
                     model,
                     type,
                     children,
                     form,
                     fields = [],
                     onFinish,
                     onFinishFailed,
                     isCloseForm,
                     initialValues = [],
                     footer,
                   }) {

  const history = useHistory()
  const [spinning, setSpinning] = useState(false)
  useEffect(() => setSpinning(!!isCloseForm), [isCloseForm])

  const handleSubmit = useCallback(
    e => {
      setSpinning(true)
      const resetError = {}
      // 先清空错误信息
      _.forEach(form.getFieldsValue(), (value, key) => {
        resetError[key] = null
      })
      form.setFields(formUtils.renderAntdError(resetError))

      form.submit()
    },
    [form]
  )

  useEffect(() => {
    // 因为 initialValues 可能会被异步传入，所以需要在被更新时，设置表单
    _.forEach(initialValues, (value, key) => {
      // 如果用户已经修改了某个字段则不设置值
      !form.isFieldTouched(key) && form.setFieldsValue({[key]: value})
    })
  }, [initialValues, form])

  // antd 校验成功后的回调
  const finish = useCallback(validatedValues => {
    setSpinning(false)

    if (_.isFunction(onFinish)) {
      return onFinish(validatedValues)
    } else {
      formUtils.notifySuccess()
    }
  }, [onFinish])

  // antd 校验失败后的回调
  const finishFailed = useCallback(err => {
    setSpinning(false)

    if (_.isFunction(onFinishFailed)) {
      return onFinishFailed(err)
    } else {
      formUtils.notifyError()
      logger.debug(err)
    }
  }, [onFinishFailed])

  // 默认添加提交，返回按钮
  if (_.isUndefined(footer)) {
    footer = [renderSubmitAction(handleSubmit), renderBackAction(history.goBack)]
  }

  return (
    <Spin spinning={spinning} delay={100}>
      <Form
        form={form}
        labelCol={{span: 8}}
        wrapperCol={{span: 8}}
        initialValues={initialValues}
        onFinish={finish}
        onFinishFailed={finishFailed}
        scrollToFirstError
      >
        {children || formUtils.getInputs(model, type, fields)}
        {
          !_.isEmpty(footer) && (
            <Row
              align='middle'
              justify='center'
            >
              <Space>
                {
                  footer.map(
                    (Action, index) => <Action key={Action.name || index}/>
                  )
                }
              </Space>
            </Row>
          )
        }
      </Form>
    </Spin>
  )
}

export default React.memo(BasicForm)
