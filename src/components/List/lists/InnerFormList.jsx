import React, { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Modal, Form } from "antd";

import RouteFormList from "./RouteFormList";
import { RestfulEditForm, RestfulNewForm } from "../../Form";
import formUtils from "../../Form/utils";
import { NewAction, EditAction } from "../index";

const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false
const modalFormMap = {
  new: RestfulNewForm,
  edit: RestfulEditForm
}

function InnerFormList(props) {
  let { model, form, formFields, remote = defaultIsRemote } = props
  const [recordId, setRecordId] = useState('')
  const [showForm, setShowForm] = useState('')
  const [listNeedReload, setListNeedReload] = useState(false)
  const [formRef] = Form.useForm(form)

  const actionMap = useMemo(() => {
    const handleClickEdit = record => e => {
      setRecordId(record.id)
      setShowForm('edit')
    }

    const handleClickNew = e => setShowForm('new')

    return {
      new: <NewAction key='NewBtn' onClick={handleClickNew}/>,
      edit: <EditAction className={'actions-option'} key='EditBtn' onClick={handleClickEdit}/>
    }
  }, [])

  // 隐藏 modal 并刷新列表
  const handleHideModal = useCallback(e => {
    setRecordId('')
    setShowForm('')
    setListNeedReload(true)
  }, [])

  const handleOkModal = useCallback(e => formRef.submit(), [formRef])

  const onNewFinish = useCallback(() => {
    formUtils.notifySuccess('创建')
    handleHideModal()
  }, [handleHideModal])

  const onEditFinish = useCallback(() => {
    formUtils.notifySuccess('编辑')
    handleHideModal()
  }, [handleHideModal])

  const finishMap = {
    new: onNewFinish,
    edit: onEditFinish
  }

  const onFinish = finishMap[showForm]
  const FormComponent = modalFormMap[showForm]

  return (
    <>
      <RouteFormList
        defaultActionMap={actionMap}
        listNeedReload={listNeedReload}
        {...props}
      />
      {
        FormComponent &&
        <Modal
          visible={FormComponent}
          cancelText={'取消'}
          onCancel={handleHideModal}
          okText={'提交'}
          onOk={handleOkModal}
          destroyOnClose
        >
          <FormComponent
            model={model}
            form={formRef}
            fields={formFields}
            remote={remote}
            pk={recordId}
            footer={null}
            onFinish={onFinish}
            preserve={false}
          />
        </Modal>
      }
    </>
  )
}

InnerFormList.propTypes = {
  form: PropTypes.array,
  remote: PropTypes.bool,
  pageSize: PropTypes.number,
};

export default React.memo(InnerFormList)
