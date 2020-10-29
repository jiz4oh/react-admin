import React from "react";

import { DBTable, InnerFormTable } from "../../components/DBTable";
import models from "../../models";

const config = {
  model: models.role,
  components: {list: InnerFormTable},
  filter: [
    {
      name: 'name',
    },
  ],
  index: [
    {
      name: 'name',
    },
    {
      name: 'updated_at'
    }
  ],
  form: [
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
              const {permissions = []} = data
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
  ]
}

export default function (props) {
  return (
    <DBTable {...props} {...config}/>
  )
}
