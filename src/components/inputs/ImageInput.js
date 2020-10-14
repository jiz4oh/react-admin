import {Upload, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useCallback, useState} from "react";
import _ from 'lodash'

import {withFormItem} from "./utils";
import globalConfig from '../../config'
import {asyncRequest} from "../../common/js/request";

const imageUploadUrl = globalConfig.imageUploadUrl

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const uploadButton = (max) => (
  <div>
    <PlusOutlined/>
    <div className="ant-upload-text">
      点击上传图片{max > 1 && `,最多可上传${max}张图片`}
    </div>
  </div>
)

const getPath = (url) => {
  let result = url.split('!')[0]
  // 以绝对路径开头，则需加上后端地址
  if (_.startsWith(url, '/')) {
    result = `${globalConfig.api.host}${result}`
  }
  return result
}

/**
 * 图片上传 input，可支持多张上传
 * @param name {String} 作为 input 组件 key
 * @param url {String} 图片上传目标地址，默认使用全局配置中的 imageUrl
 * @param files {Object[]} 已上传文件列表
 * @param max {Number} 最大上传数，默认为 9
 * @param value {any} 作为受控组件时，传递给父组件的值
 * @param onChange {Function} 作为受控组件时，上传时的回调函数
 * @param max {Number} 最大上传数，默认为 9
 * @param inputOptions {{}} 其他要传给 Upload 组件的属性
 * @param restProps
 *
 */
function ImageInput({
                      name,
                      url,
                      files = [],
                      max = 9,
                      value,
                      onChange,
                      inputOptions = {},
                      ...restProps
                    }) {
  url = url || imageUploadUrl
  const [previewVisible, setPreviewVisible] = useState(false)
  const [fileList, setFiles] = useState(files)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewVisible(true)
    setPreviewImage(file.thumbUrl || file.preview)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const handleChange = ({fileList, file, event}) => {
    fileList.forEach(imgItem => {
      // 替换所有图片的缩略图地址，不然有可能会造成浏览器解析 Base64 卡死
      if (imgItem && imgItem.status === 'done' && imgItem.response) {
        // 替换缩略图
        if (imgItem.response.thumb_url) {
          imgItem.preview = imgItem.thumbUrl = getPath(imgItem.response.thumb_url)
        }
        // 替换预览图
        imgItem.response.url && (imgItem.url = getPath(imgItem.response.url))
        imgItem.id = imgItem.response.id || imgItem.id
      }
    });
    setFiles(fileList)
    // 将所有 image id 返回
    // onChange({fileList: result, ids: result.map(imgItem => imgItem.id)})
    onChange(fileList.map(imgItem => imgItem.id))
    return fileList
  }

  const handleRemove = file => {
    if (file.response) {
      asyncRequest({
        method: file.response.delete_type || 'delete',
        url: file.response.delete_url,
        apiPath: '',
      })
    } else {
      console.warn('删除错误，未知问题，请联系管理员')
    }
  }

  return (
    <>
      <Upload
        key={`${name}-input`}
        name={'image'}
        isImageUrl={useCallback(() => true, [])}
        action={url}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        {...restProps}
        value={value}
        onChange={handleChange}
        onRemove={handleRemove}
        {...inputOptions}
      >
        {fileList.length >= max ? null : uploadButton(max)}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{width: '100%'}}
          src={previewImage}
        />
      </Modal>
    </>
  )
}

export default withFormItem(ImageInput)
