import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Form } from "antd";

import RouteFormList from "./RouteFormList";
import { ModalForm } from "../../Form";
import { NewAction, EditAction } from "../index";

const defaultIsRemote = Number(process.env.REACT_APP_FORM_REMOTE_CONFIG) || false

function InnerFormList({
                         model,
                         form,
                         formFields,
                         remote = defaultIsRemote,
                         className,
                         ...restProps
                       }) {
  const [formRef] = Form.useForm(form)
  const [recordId, setRecordId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [listNeedReload, setListNeedReload] = useState(false)

  const actionMap = useMemo(() => {
    return {
      new: <NewAction
        key='NewBtn'
        onClick={_e => setShowForm(true)}
      />,
      edit: <EditAction
        key='EditBtn'
        className={'actions-option'}
        onClick={record => _e => {
          setRecordId(record.id)
          setShowForm(true)
        }}
      />
    }
  }, [])

  return (
    <div className={className}>
      <RouteFormList
        model={model}
        defaultActionMap={actionMap}
        listNeedReload={listNeedReload}
        {...restProps}
      />
      <ModalForm
        model={model}
        form={formRef}
        fields={formFields}
        remote={remote}
        pk={recordId}
        onFinish={() => setListNeedReload(true)}
        onChange={setShowForm}
        value={showForm}
      />
    </div>
  )
}

InnerFormList.propTypes = {
  form: PropTypes.array,
  remote: PropTypes.bool,
  pageSize: PropTypes.number,
};

export default React.memo(InnerFormList)
