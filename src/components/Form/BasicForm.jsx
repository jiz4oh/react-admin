import React, { useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Button, Form, Row, Space, Spin } from "antd";
import _ from 'lodash'

import "./BasicForm.scss"
import formUtils from "./utils"

// antd 校验成功后的回调
const finish = _validatedValues => formUtils.notifySuccess()

// antd 校验失败后的回调
const finishFailed = _err => formUtils.notifyError()

/**
 *
 * @param children {JSX.Element[]} 需要渲染的 input 组件数组
 * @param form {Object} Antd 的 FormInstance
 * @param className {String} 样式
 * @param initialValues {[]} 表单默认值
 * @param footer {(React.Component[] || JSX.Element)[]} form 表单底部组件列表
 * @param onChange {Function} 表单显示控制函数
 * @param value {Boolean} 是否显示表单加载中
 * @param staticContext {any} 接收该参数避免 react warning
 * @param restProps 其他传入 AntDesign 中的参数
 */
function BasicForm({
                     children,
                     form: antdFormInstance,
                     className,
                     initialValues = [],
                     footer,
                     onChange,
                     value,
                     staticContext,
                     ...restProps
                   }) {

  const history = useHistory()
  const [form] = Form.useForm(antdFormInstance)

  // 因为 initialValues 可能会被异步传入，所以需要在被更新时，设置表单
  useEffect(() => {
    _.forEach(initialValues, (value, key) => {
      // 如果用户已经修改了某个字段则不设置值
      !form.isFieldTouched(key) && form.setFieldsValue({ [key]: value })
    })
  }, [initialValues, form])

  const handleSubmit = useCallback(
    e => {
      _.isFunction(onChange) && onChange(true)
      const resetError = {}
      // 先清空错误信息
      _.forEach(form.getFieldsValue(), (value, key) => {
        resetError[key] = null
      })
      form.setFields(formUtils.renderAntdError(resetError))

      form.submit()
    },
    [form, onChange]
  )

  // 默认添加提交，返回按钮
  if (_.isUndefined(footer)) {
    footer = [
      <Button
        key='submitBtn'
        type='primary'
        onClick={handleSubmit}
      >
        提交
      </Button>,
      <Button
        key='goBackBtn'
        onClick={history.goBack}
      >
        返回
      </Button>
    ]
  }

  return (
    <div className={`basic-form ${className || ''}`}>
      <Spin spinning={value} delay={100}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={initialValues}
          onFinish={finish}
          onFinishFailed={finishFailed}
          scrollToFirstError
          {...restProps}
        >
          {children}
        </Form>
        {
          !_.isEmpty(footer) && (
            <Row
              align='middle'
              justify='center'
            >
              <Space>
                {footer.map((Action, index) =>
                  React.isValidElement(Action)
                    ? Action
                    : <Action key={Action.name || index}/>
                )}
              </Space>
            </Row>
          )
        }
      </Spin>
    </div>
  )
}

export default React.memo(BasicForm)
