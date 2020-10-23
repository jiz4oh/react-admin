import React, { useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Modal, Form } from "antd";

import RestfulTable from "./RestfulTable";
import { RestfulEditForm, RestfulNewForm } from "../form";
import { renderNewAction, renderEditAction } from "../actions";
import formUtils from "../form/utils";
import { RestfulModel } from "../RestfulModel";
import globalConfig from "../../../config"

const defaultIsRemote = globalConfig.DBTable.remote || false
const modalFormMap = {
  new: RestfulNewForm,
  edit: RestfulEditForm
}

function InnerFormTable(props) {
  let {model, formFields, remote = defaultIsRemote} = props
  const [recordId, setRecordId] = useState('')
  const [showForm, setShowForm] = useState('')
  const [listNeedReload, setListNeedReload] = useState(false)

  const handleClickEdit = useCallback(record => e => {
    setRecordId(record.id)
    setShowForm('edit')
  }, [])

  const handleClickNew = useCallback(e => setShowForm('new'), [])

  // 隐藏 modal 并刷新列表
  const handleHideModal = useCallback(e => {
    setRecordId('')
    setShowForm('')
    setListNeedReload(true)
  }, [])

  const [form] = Form.useForm()
  const handleOkModal = useCallback(e => form.submit(), [form])

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
      <RestfulTable
        defaultActionMap={{
          new: renderNewAction(handleClickNew),
          edit: renderEditAction(handleClickEdit)
        }}
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

InnerFormTable.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  form: PropTypes.array,
  remote: PropTypes.bool,
  pageSize: PropTypes.number,
  onFetchList: PropTypes.func.isRequired
};

export default React.memo(withRouter(InnerFormTable))
