import React from "react";

import models from "../../models";
import {
  DBTable,
  InnerFormTable
} from "../../components/DBTable";

const config = {
  model: models.adminUser,
  components: {
    list: InnerFormTable
  },
  filter: [
    {
      name: 'id',
    },
    {
      name: 'created_at',
      type: 'datetime'
    }
  ],
  index: [
    {
      name: 'username',
    },
    {
      name: 'email',
    },
    {
      name: 'roles'
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
  ],
  remote: false,
  form: [
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
  ],
}

export default function (props){
  return (
    <DBTable {...props} {...config}/>
  )
}

