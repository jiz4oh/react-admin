import React, { useState } from "react";

import models from "../../models";
import { InnerFormList, HasManyRender, ImageRender } from "../../components/List";
import CRUD from "../../layouts/CRUD";
import { ImagePreviewModal } from "../../lib/components/ImagePreviewModal";

const filter = [
  {
    name: 'id',
  },
  {
    name: 'created_at',
    type: 'datetime'
  }
]

const form = [
  {
    name: 'username'
  },
  {
    name: 'remark',
  },
  {
    name: 'email',
    // label: '邮箱',
    rules: [{
      required: true,
      message: '必须填写邮箱'
    }]
  },
  {
    name: 'password',
    form: 'new',
  },
  {
    name: 'password_confirmation',
    placeholder: '请确认密码',
    form: 'new',
  },
  {
    name: 'phone',
  }
]

export default function (props) {
  const [hasExtraTable, showExtraTable] = useState(false)
  const [previewImages, setPreviewImages] = useState([])
  const columns = hasExtraTable ? 2 : 1

  return (
    <>
      <CRUD
        {...props}
        model={models.adminUser}
        filter={filter}
        index={[
          {
            name: 'username',
          },
          {
            name: 'avatar',
            render: ImageRender(data => {
              setPreviewImages(data)
            })
          },
          {
            name: 'email',
          },
          {
            name: 'roles',
            render: HasManyRender(() => showExtraTable(!hasExtraTable))
          },
          {
            name: 'last_sign_in_at',
          },
          {
            name: 'sign_in_count',
          },
          {
            name: 'created_at',
          }
        ]}
        remote={false}
        form={form}
        columns={columns}
      >
        {
          hasExtraTable && (
            <CRUD
              CRUD={[]}
              model={models.role}
              index={[
                {name: 'name',},
                {name: 'updated_at'},
              ]}
              components={{list: InnerFormList}}
            />
          )
        }
      </CRUD>
      <ImagePreviewModal value={previewImages} onChange={setPreviewImages}/>
    </>
  )
}
