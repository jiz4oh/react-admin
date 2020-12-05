import React, { useCallback } from "react";
import { Form, Modal } from "antd";
import _ from "lodash"
import formUtils from "@/components/Form/utils";
import GenericForm from "@/components/Form/GenericForm";

const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false

function ModalForm({
                     model,
                     form,
                     fields,
                     pk,
                     remote = defaultIsRemote,
                     onFinish,
                     onChange,
                     value,
                   }) {
  const [formRef] = Form.useForm(form)

  // 隐藏 modal 并刷新列表
  const handleHideModal = useCallback(_e => {
    _.isFunction(onChange) && onChange(false)
  }, [onChange])

  const handleOkModal = useCallback(e => formRef.submit(), [formRef])

  onFinish = useCallback(validatedValues => {
    formUtils.notifySuccess(pk ? '编辑' : '创建')
    handleHideModal()
    _.isFunction(onFinish) && onFinish(validatedValues)
  }, [handleHideModal, pk, onFinish])

  return (
    <Modal
      visible={value}
      cancelText={'取消'}
      onCancel={handleHideModal}
      okText={'提交'}
      onOk={handleOkModal}
      destroyOnClose
    >
      <GenericForm
        model={model}
        form={formRef}
        fields={fields}
        remote={remote}
        pk={pk}
        footer={null}
        onFinish={onFinish}
        preserve={false}
      />
    </Modal>
  )
}

export default React.memo(ModalForm)
