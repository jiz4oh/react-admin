import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Row, Space, Spin } from "antd";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import PropTypes from "prop-types";

import Logger from "../../utils/Logger";
import formUtils from './utils'
import { renderInputBy } from "../inputs";
import { FormItemBuilder } from "../FormItemBuilder";

const logger = Logger.getLogger('form')
const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false

/**
 *
 * @param name {String} 表名，用于搜索 i18n
 * @param form {Object} Antd 的 FormInstance
 * @param fields {Object[]} form 表单字段
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param pk {Number} 发送给后端的主键
 * @param onFinish {Function} 前后端同时验证成功回调
 * @param onFinishFailed {Function} 前端或后端验证失败回调
 * @param restProps
 */
function GenericForm({
                       name = '',
                       get,
                       post,
                       form: antdFormInstance,
                       pk,
                       fields = [],
                       remote = defaultIsRemote,
                       onFinish,
                       onFinishFailed,
                       ...restProps
                     }) {
  const [form] = Form.useForm(antdFormInstance)
  const history = useHistory()
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(!!pk && remote)
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (!_.isFunction(get)) return logger.warn('未传入有效 get 方法')

    logger.debug(`从后端获取${pk ? '编辑' : '新建'}表单数据。。。`)

    get({
      pk,
      showErrorMessage: true,
      onSuccess: data => {
        pk && setInitValues(data['data'])
        pk && closeForm(false)
        remote && setInputsConfig(formUtils.getInputsConfigFromRemote(data, inputsConfig, name))
      },
      onFail: () => pk && closeForm(false)
    })
    // eslint-disable-next-line
  }, [get, pk])

  const handleFinishFailed = useCallback(data => {
    closeForm(false)
    if (_.isFunction(onFinishFailed)) return onFinishFailed()
    return formUtils.notifyError(pk ? '更新' : '创建')
  }, [onFinishFailed, pk])

  const handleFinish = useCallback(validatedValues => {
    const onSuccess = () => {
      closeForm(false)
      if (_.isFunction(onFinish)) return onFinish(validatedValues)
      return formUtils.notifySuccess(pk ? '更新' : '创建')
    }

    const onFail = data => {
      handleFinishFailed(data)
      form.setFields(formUtils.renderAntdError(data.error))
    }

    if (!_.isFunction(post)) return logger.warn('未传入有效 post 方法')

    return post({
      pk,
      data: validatedValues,
      onSuccess,
      onFail,
    })
    // 前端校验不通过
  }, [post, pk, form, handleFinishFailed, onFinish])

  const handleSubmit = useCallback(
    e => {
      closeForm(true)
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

  return (
    <div className={'basic-form'}>
      <Spin spinning={isCloseForm} delay={100}>
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={initValues}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          scrollToFirstError
          {...restProps}
        >
          <FormItemBuilder
            name={name}
            fields={fields}
            onTypecast={renderInputBy}
            formType={'edit'}
          />
        </Form>
        <Row
          align='middle'
          justify='center'
        >
          <Space>
            <Button
              key='submitBtn'
              type='primary'
              onClick={handleSubmit}
            >
              提交
            </Button>,
            <Button
              onClick={history.goBack}
            >
              返回
            </Button>
          </Space>
        </Row>
      </Spin>
    </div>
  )
}

GenericForm.propTypes = {
  name: PropTypes.string,
  pk: PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]),
  fields: PropTypes.array,
  remote: PropTypes.bool,
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
}

export default React.memo(GenericForm)
