import React from "react";

import { InnerFormList } from "../../components/List";
import CRUD from "../../layouts/CRUD";
import models from "../../models";

export default function(props) {
  return (
    <CRUD
      {...props}
      model={models.role}
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
          name: 'permissions',
          as: 'checkbox',
          collection: (onSuccess) => {
            let result = []
            models.role.new(
              {
                onSuccess: data => {
                  const { permissions = [] } = data
                  const tmpCollection = permissions.map(permission => (
                    {
                      label: permission[0],
                      value: permission[1],
                    }
                  ))

                  result = result.concat(tmpCollection)
                  onSuccess && onSuccess(result)
                },
                onFail: data => console.log(data)
              }
            )

            return result
          }
        },
      ]}
    />
  )
}
