import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom'
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
function RestfulEditForm({
                           model,
                           fields = [],
                           remote,
                           ...restProps
                         }) {

  const history = useHistory()
  const [form] = Form.useForm()
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(true)
  const currentId = useParams()['id']

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

  const onFinish = useCallback(validatedValues => {
    const onSuccess = () => {
      formUtils.notifySuccess('更新')
      history.goBack()
    }

    const onFail = data => {
      formUtils.notifyError('更新')
      form.setFields(formUtils.renderAntdError(data.error))
    }

    model.update(currentId, validatedValues, {
      onSuccess,
      onFail,
    })
    // 前端校验不通过
  }, [model, currentId, form, history])

  return (
    <BasicForm
      type={'edit'}
      tableName={model.name}
      form={form}
      fields={inputsConfig}
      onFinish={onFinish}
      initialValues={initValues}
      isCloseForm={isCloseForm}
      {...restProps}
    >
    </BasicForm>
  )
}

RestfulEditForm.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  fields: PropTypes.array,
}

export default React.memo(RestfulEditForm)
