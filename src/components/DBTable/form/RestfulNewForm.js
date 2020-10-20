import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Form } from "antd";

import Logger from "../../../common/js/Logger";
import BasicForm from './BasicForm'
import formUtils from './utils'
import PropTypes from "prop-types";
import { RestfulModel } from "../RestfulModel";

const logger = Logger.getLogger('form')

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param fields {Object[]} form 表单字段
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param restProps
 */
function RestfulNewForm({
                          model,
                          fields = [],
                          remote,
                          ...restProps
                        }) {

  const history = useHistory()
  const [form] = Form.useForm();
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
                }
              })
    // eslint-disable-next-line
  }, [model])

  const onFinish = useCallback(validatedValues => {
    const onSuccess = () => {
      closeForm(false)
      formUtils.notifySuccess('创建')

      history.goBack()
    }

    const onFail = data => {
      closeForm(false)
      formUtils.notifyError('创建')
      form.setFields(formUtils.renderAntdError(data.error))
    }

    model.create(validatedValues, {
      onSuccess,
      onFail
    })
  }, [model, form, history])

  return (
    <BasicForm
      type={'new'}
      model={model}
      form={form}
      fields={inputsConfig}
      onFinish={onFinish}
      onChange={closeForm}
      value={isCloseForm}
      {...restProps}
    >
    </BasicForm>
  )
}

RestfulNewForm.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  fields: PropTypes.array,
}

export default React.memo(RestfulNewForm)
