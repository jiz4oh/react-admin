import React from "react";

import { InnerFormList } from "../../components/List";
import CRUD from "../../layouts/CRUD";
import model from "../../models/role";

export default function(props) {
  return (
    <CRUD
      {...props}
      model={model}
      components={{ list: InnerFormList }}
      filter={[
        {
          name: 'name',
        },
      ]}
      index={[
        {
          name: 'name',
        },
        {
          name: 'updated_at'
        }
      ]}
      form={[
        {
          name: 'name',
          rules: [{
            required: true,
            message: '必须填写名称'
          }],
        },
        {
          name: 'permissions_attributes',
          as: 'checkbox',
        },
      ]}
    />
  )
}
