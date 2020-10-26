import React, { useCallback, useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { Form } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";

import Logger from "../../../common/js/Logger";
import BasicForm from './BasicForm'
import formUtils from './utils'
import globalConfig from "../../../config"
import { renderInputBy } from "../../inputs";
import FormBuilder from "../../FormBuilder";

const logger = Logger.getLogger('form')
const defaultIsRemote = globalConfig.DBTable.remote || false

/**
 *
 * @param model {Object} 需要具有 edit，update 方法
 * @param model.edit {Function}
 * @param model.update {Function}
 * @param form {Object} Antd 的 FormInstance
 * @param fields {Object[]} form 表单字段
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param recordId {Number} 发送给后端的 id
 * @param onFinish {Function} 前后端同时验证成功回调
 * @param onFinishFailed {Function} 前端或后端验证失败回调
 * @param restProps
 */
function RestfulEditForm({
                           model,
                           form: antdFormInstance,
                           fields = [],
                           remote = defaultIsRemote,
                           recordId,
                           onFinish,
                           onFinishFailed,
                           ...restProps
                         }) {
  const [form] = Form.useForm(antdFormInstance)
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(true)
  let currentId = useParams()['id']
  currentId = recordId || currentId

  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    logger.debug('从后端获取编辑表单数据。。。')

    model.edit(currentId, {
      showErrorMessage: true,
      onSuccess: data => {
        // 获取 edit form 所需要的 initValues
        setInitValues(data['resource'])
        closeForm(false)
        remote && setInputsConfig(formUtils.getInputsConfigFromRemote(data, inputsConfig, model.name))
      }
    })
    // eslint-disable-next-line
  }, [model, currentId])

  const handleFinishFailed = useCallback(data => {
    closeForm(false)
    if (_.isFunction(onFinishFailed)) return onFinishFailed()
    else return formUtils.notifyError('创建')
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

    return model.update(currentId, validatedValues, {
      onSuccess,
      onFail,
    })
    // 前端校验不通过
  }, [model, currentId, form, handleFinishFailed, onFinish])

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
      <FormBuilder
        model={model}
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
  fields: PropTypes.array,
  remote: PropTypes.bool,
}

export default React.memo(RestfulEditForm)
