import React, { useCallback, useState } from "react";
import { Modal } from "antd";

import RestfulTable from "./RestfulTable";
import { RestfulEditForm, RestfulNewForm } from "../form";
import { renderNewAction, renderEditAction } from "../actions";

const modalFormMap = {
  new: RestfulNewForm,
  edit: RestfulEditForm
}

function InnerFormTable(props) {
  let {model, form, remote} = props
  const [recordId, setRecordId] = useState('')
  const [showForm, setShowForm] = useState('')

  const handleClickEdit = useCallback(record => e => {
    setRecordId(record.id)
    setShowForm('edit')
  }, [])

  const handleClickNew = useCallback(e => setShowForm('new'),
                                     [])

  const handleCancelModal = useCallback(e => {
    setRecordId('')
    setShowForm('')
  }, [])

  const Form = modalFormMap[showForm]

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
        Form &&
        <Modal
          onCancel={handleCancelModal}
          visible={Form}
          okText={'提交'}
          cancelText={'取消'}
        >
          <Form
            model={model}
            fields={form}
            remote={remote}
            recordId={recordId}
            footer={null}
          />
        </Modal>
      }
    </>
  )
}

export default InnerFormTable
