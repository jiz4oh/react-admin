import React, { useCallback, useEffect, useState } from "react";
import { Form } from "antd";
import _ from "lodash";
import PropTypes from "prop-types";

import Logger from "../../utils/Logger";
import formUtils from './utils'
import { renderInputBy } from "../inputs";
import { FormItemBuilder } from "../FormItemBuilder";
import BasicForm from "@/components/Form/BasicForm";

const logger = Logger.getLogger('form')
const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false

/**
 *
 * @param name {String} 表名，用于搜索 i18n
 * @param model {{}} 表单内容提交函数
 * @param remote {Boolean} 是否从远端更新表单字段，默认 true
 * @param form {Object} Antd 的 FormInstance
 * @param fields {Object[]} form 表单字段
 * @param pk {Number} 发送给后端的主键
 * @param onFinish {Function} 前后端同时验证成功回调
 * @param onFinishFailed {Function} 前端或后端验证失败回调
 * @param restProps
 */
function GenericForm({
                       form: antdFormInstance,
                       name = '',
                       model = {},
                       pk,
                       fields = [],
                       remote = defaultIsRemote,
                       onFinish,
                       onFinishFailed,
                       ...restProps
                     }) {
  const [form] = Form.useForm(antdFormInstance)
  const [inputsConfig, setInputsConfig] = useState(fields)
  const [isCloseForm, closeForm] = useState(!!pk && remote)
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    logger.debug(`从后端获取${pk ? '编辑' : '新建'}表单数据。。。`)

    const params = {
      pk,
      showErrorMessage: true,
      onSuccess: data => {
        pk && setInitValues(data['data'])
        pk && closeForm(false)
        remote && setInputsConfig(formUtils.mergeInputsConfig(data, inputsConfig, name))
      },
      onFail: () => pk && closeForm(false)
    }
    pk ? model.edit(params) : model.new(params)
    // eslint-disable-next-line
  }, [model, pk])

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

    const params = {
      pk,
      data: validatedValues,
      onSuccess,
      onFail,
    }
    return pk ? model.update(params) : model.create(params)
  }, [model, pk, form, handleFinishFailed, onFinish])

  return (
    <BasicForm
      form={form}
      onChange={closeForm}
      value={isCloseForm}
      initialValues={initValues}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      {...restProps}
    >
      <FormItemBuilder
        name={name}
        fields={fields}
        onTypecast={renderInputBy}
        formType={pk ? 'edit' : 'new'}
      />
    </BasicForm>
  )
}

GenericForm.propTypes = {
  name: PropTypes.string,
  pk: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  model: PropTypes.shape({
    edit: PropTypes.func,
    update: PropTypes.func,
    new: PropTypes.func,
    create: PropTypes.func,
  }),
  fields: PropTypes.array,
  remote: PropTypes.bool,
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
}

export default React.memo(GenericForm)
