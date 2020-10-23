import React from "react";

import { enumMapToArray } from "../../common/js/utils";
import { DBTable } from "../../components/DBTable";
import models from "../../models";

const genderMap = {
  unknown: '未知',
  male: '男',
  female: '女',
}

const srcMap = {
  wx: '微信小程序',
  web: 'PC',
  android: '安卓',
  ios: '苹果'
}

const config = {
  model: models.user,
  filter: [
    {
      name: 'nickname',
    },
    {
      name: 'gender',
      as: 'select',
      collection: enumMapToArray(genderMap)
    },
    {
      name: 'src',
      as: 'select',
      collection: enumMapToArray(srcMap)
    },
    {
      name: 'created_at',
    },
    {
      name: 'last_sign_in_at',
      type: 'datetime'
    }
  ],
  CRUD: [],
  index: [
    {
      name: 'src',
      width: 100,
      render: srcMap
    },
    {
      name: 'nickname',
      width: 150
    },
    {
      name: 'avatar'
    },
    {
      name: 'address'
    },
    {
      name: 'phone',
      width: 150
    },
    {
      name: 'email',
      width: 200
    },
    {
      name: 'gender',
      width: 80,
      render: genderMap,
    },
    {
      name: 'age',
      width: 80
    },
    {
      name: 'bio'
    },
    {
      name: 'birthday'
    },
    {
      name: 'last_sign_in_at',
      width: 240
    },
    {
      name: 'created_at',
      width: 240
    }
  ]
}

export default function (props){
  return (
    <DBTable {...props} {...config}/>
  )
}

