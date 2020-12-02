import React, { useCallback, useEffect, useState } from "react";
import { Form } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";

import Logger from "../../utils/Logger";
import BasicForm from './BasicForm'
import formUtils from './utils'
import { renderInputBy } from "../inputs";
import { FormItemBuilder } from "../FormItemBuilder";

const logger = Logger.getLogger('form')
const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false

/**
 *
 * @param model {Object} 需要具有 edit，update 方法
 * @param model.edit {Function}
 * @param model.update {Function}
 * @param form {Object} Antd 的 FormInstance
 * @param fields {Object[]} form 表单字段
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param pk {Number} 发送给后端的主键
 * @param onFinish {Function} 前后端同时验证成功回调
 * @param onFinishFailed {Function} 前端或后端验证失败回调
 * @param restProps
 */
function RestfulEditForm({
                           model,
                           form: antdFormInstance,
                           pk,
                           fields = [],
                           remote = defaultIsRemote,
                           onFinish,
                           onFinishFailed,
                           ...restProps
                         }) {
  const [form] = Form.useForm(antdFormInstance)
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(true)
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    logger.debug('从后端获取编辑表单数据。。。')

    model.edit({
      pk,
      showErrorMessage: true,
      onSuccess: data => {
        // 获取 edit form 所需要的 initValues
        setInitValues(data['data'])
        closeForm(false)
        remote && setInputsConfig(formUtils.mergeInputsConfig(data, inputsConfig, model.name))
      }
    })
    // eslint-disable-next-line
  }, [model, pk])

  const handleFinishFailed = useCallback(data => {
    closeForm(false)
    if (_.isFunction(onFinishFailed)) return onFinishFailed()
    else return formUtils.notifyError('更新')
  }, [onFinishFailed])

  const handleFinish = useCallback(validatedValues => {
    const onSuccess = () => {
      closeForm(false)
      if (_.isFunction(onFinish)) return onFinish(validatedValues)
      else return formUtils.notifySuccess('更新')
    }

    const onFail = data => {
      handleFinishFailed(data)
      form.setFields(formUtils.renderAntdError(data.error))
    }

    return model.update({
      pk,
      data: validatedValues,
      onSuccess,
      onFail,
    })
    // 前端校验不通过
  }, [model, pk, form, handleFinishFailed, onFinish])

  return (
    <BasicForm
      form={form}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      onChange={closeForm}
      value={isCloseForm}
      initialValues={initValues}
      {...restProps}
    >
      <FormItemBuilder
        tableName={model.name}
        fields={fields}
        onTypecast={renderInputBy}
        formType={'edit'}
      />
    </BasicForm>
  )
}

RestfulEditForm.propTypes = {
  model: PropTypes.shape({
                           edit: PropTypes.func.isRequired,
                           update: PropTypes.func.isRequired,
                         }),
  pk: PropTypes.oneOfType([
                            PropTypes.string,
                            PropTypes.number
                          ]).isRequired,
  fields: PropTypes.array,
  remote: PropTypes.bool,
}

export default React.memo(RestfulEditForm)
