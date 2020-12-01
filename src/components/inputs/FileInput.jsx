import {Upload, message} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import React from "react";

import {withFormItem} from "./utils";
import Logger from "../../utils/Logger";

const fileUploadUrl = process.env.REACT_APP_FILE_UPLOAD_PATH

const logger = Logger.getLogger('file')

const onChange = ({file, fileList, event}) => {
  // file 文件对象
  // {
  //    uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  //    name: 'xx.png'   // 文件名
  //    status: 'done', // 状态有：uploading done error removed
  //    response: '{"status": "success"}', // 服务端响应内容
  //    linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
  // }

  let msg;
  switch (file.status) {
    case "uploading":
      logger.debug(file, fileList);
      return
    case "error":
      msg = `${file.name} file upload failed.`
      logger.error(msg);
      message.error(msg);
      return
    case "done":
      msg = `${file.name} file uploaded successfully.`
      logger.info(msg);
      message.success(msg);
      return;
    default:
      return
  }
}

/**
 * 文件上传 input，可支持多文件上传
 * @param name {String} 作为 input 组件 key
 * @param multiple {Boolean} 是否支持多文件上传，默认 false
 * @param url {String} 文件上传目标地址，默认使用全局配置中的 fileUrl
 * @param inputOptions {{}} 其他要传给 Upload 组件的属性
 * @param restProps
 *
 */
function FileInput({
                     name,
                     multiple,
                     url,
                     inputOptions = {},
                     ...restProps
                   }) {
  url = url || fileUploadUrl
  return (
    <Upload.Dragger
      key={`${name}-input`}
      multiple={multiple}
      action={url}
      {...restProps}
      onChange={onChange}
      {...inputOptions}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined/>
      </p>
      <p className="ant-upload-text">拖拽或点击来上传文件</p>
      {!!(multiple) ?
        <p className="ant-upload-hint">
          支持单个或多个文件上传
        </p>
        : null
      }
    </Upload.Dragger>
  )
}

export default withFormItem(FileInput)
