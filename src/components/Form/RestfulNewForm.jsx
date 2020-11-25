import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Form } from "antd";

import Logger from "../../utils/Logger";
import formUtils from './utils'
import BasicForm from "./BasicForm";
import globalConfig from "../../config"
import { renderInputBy } from "../inputs";
import { FormItemBuilder } from "../FormItemBuilder";

const logger = Logger.getLogger('form')
const defaultIsRemote = globalConfig.DBTable.remote || false

/**
 *
 * @param model {Object} 需要具有 new，create 方法
 * @param model.new {Function}
 * @param model.create {Function}
 * @param form {Object} Antd 的 FormInstance
 * @param fields {Object[]} form 表单字段
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param onFinish {Function} 前后端同时验证成功回调
 * @param onFinishFailed {Function} 前端或后端验证失败回调
 * @param restProps
 */
function RestfulNewForm({
                          model,
                          form: antdFormInstance,
                          fields = [],
                          remote = defaultIsRemote,
                          onFinish,
                          onFinishFailed,
                          ...restProps
                        }) {

  const [form] = Form.useForm(antdFormInstance)
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(remote)

  useEffect(() => {
    if (!remote) return
    logger.debug('从后端获取新建表单数据。。。')

    model.new({
      showErrorMessage: true,
      onSuccess: data => {
        const res = formUtils.getInputsConfigFromRemote(data, inputsConfig, model.name)
        setInputsConfig(res)
        closeForm(false)
      },
      onFail: () => closeForm(false)
    })
    // eslint-disable-next-line
  }, [model])

  const handleFinishFailed = useCallback(data => {
    closeForm(false)
    if (_.isFunction(onFinishFailed)) return onFinishFailed()
    else return formUtils.notifyError('创建')
  }, [onFinishFailed])

  const handleFinish = useCallback(validatedValues => {
    const onSuccess = () => {
      closeForm(false)
      if (_.isFunction(onFinish)) return onFinish(validatedValues)
      else return formUtils.notifySuccess('创建')
    }

    const onFail = data => {
      handleFinishFailed(data)
      form.setFields(formUtils.renderAntdError(data.error))
    }

    return model.create({
      data: validatedValues,
      onSuccess,
      onFail,
    })
  }, [model, form, handleFinishFailed, onFinish])

  return (
    <BasicForm
      form={form}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      value={isCloseForm}
      onChange={closeForm}
      {...restProps}
    >
      <FormItemBuilder
        tableName={model.name}
        fields={fields}
        onTypecast={renderInputBy}
        formType={'new'}
      />
    </BasicForm>
  )
}

RestfulNewForm.propTypes = {
  model: PropTypes.shape({
    new: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
  }),
  fields: PropTypes.array,
  remote: PropTypes.bool,
}

export default React.memo(RestfulNewForm)
