import React from "react";

import CRUD from "../../layouts/CRUD";
import model from "../../models/role";

export default function(props) {
  return (
    <CRUD
      {...props}
      model={model}
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
