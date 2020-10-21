import React, { useCallback, useState } from "react";
import { Modal, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";

import RestfulTable from "./RestfulTable";
import { RestfulEditForm, RestfulNewForm } from "../form";
import { renderNewAction, renderEditAction } from "../actions";
import formUtils from "../form/utils";
import { actionCreators } from "../store";

const modalFormMap = {
  new: RestfulNewForm,
  edit: RestfulEditForm
}

function InnerFormTable(props) {
  let {model, form: formFields, remote} = props
  const [recordId, setRecordId] = useState('')
  const [showForm, setShowForm] = useState('')

  const handleClickEdit = useCallback(record => e => {
    setRecordId(record.id)
    setShowForm('edit')
  }, [])

  const handleClickNew = useCallback(e => setShowForm('new'), [])

  const handleCancelModal = useCallback(e => {
    setRecordId('')
    setShowForm('')
  }, [])

  const [form] = Form.useForm()
  const handleOkModal = useCallback(e => form.submit(), [form])

  const FormComponent = modalFormMap[showForm]
  const dispatch = useDispatch()
  const pageSize = useSelector(state => state.table.pageSize)
  const onNewFinish = useCallback(() => {
    formUtils.notifySuccess('创建')
    setShowForm('')
    dispatch(actionCreators.fetchList(model, {
      page: 1,
      size: pageSize,
    }))
  }, [dispatch, model, pageSize])

  const onEditFinish = useCallback(() => {
    formUtils.notifySuccess('编辑')
    setShowForm('')
    dispatch(actionCreators.fetchList(model, {
      page: 1,
      size: pageSize,
    }))
  },[dispatch, model, pageSize])

  const finishMap = {
    new: onNewFinish,
    edit: onEditFinish
  }

  const onFinish = finishMap[showForm]

  return (
    <>
      <RestfulTable
        defaultActionMap={{
          new: renderNewAction(handleClickNew),
          edit: renderEditAction(handleClickEdit)
        }}
        {...props}
      />
      {
        FormComponent &&
        <Modal
          visible={FormComponent}
          cancelText={'取消'}
          onCancel={handleCancelModal}
          okText={'提交'}
          onOk={handleOkModal}
          destroyOnClose
        >
          <FormComponent
            model={model}
            form={form}
            fields={formFields}
            remote={remote}
            recordId={recordId}
            footer={null}
            onFinish={onFinish}
            preserve={false}
          />
        </Modal>
      }
    </>
  )
}

export default React.memo(InnerFormTable)
