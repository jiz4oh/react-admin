import React, { useState } from "react";

import { enumMapToArray } from "@/utils/utils";
import CRUD from "../../layouts/CRUD";
import model from "../../models/user";
import { ImageRender } from "../../components/List";
import { ImagePreviewModal } from "../../lib/components/ImagePreviewModal";

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

const filter = [
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
]

export default function (props) {
  const [previewImages, setPreviewImages] = useState([])

  return (
    <>
      <CRUD
        {...props}
        model={model}
        filter={filter}
        CRUD={[]}
        index={[
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
            name: 'avatar',
            render: ImageRender(data => {
              setPreviewImages(data)
            })
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
        ]}
      >
      </CRUD>
      <ImagePreviewModal value={previewImages} onChange={setPreviewImages}/>
    </>
  )
}

