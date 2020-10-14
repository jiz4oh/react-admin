import { message, notification, Space } from "antd";
import React from "react";
import _ from 'lodash'

import i18n from "../../../common/js/i18n";
import Logger from "../../../common/js/Logger";
import { ImageRender } from "../../ImagePreviewModal";

const logger = Logger.getLogger('tableUtils')

const deleting = () => message.loading('正在删除...', 5)
let successCount = 0
let failCount = 0
const notifyAfterDeleted = () => {
  if (successCount > 0) {
    if (failCount > 0) {
      notification.warning({
                             message: '部分删除成功',
                             description: `${successCount}条数据删除成功，${failCount}条数据删除失败`,
                             duration: 5,
                           })
    } else {
      notification.success({
                             message: '删除成功',
                             description: `成功删除${successCount}条数据`,
                             duration: 3,
                           })
    }
  } else {
    notification.error({
                         message: '删除失败',
                         description: '请尝试重新删除',
                         duration: 3,
                       })
  }
}

const textRender = fieldMap =>
  (rawText, record) => {
    // 默认为 0
    let num = rawText || 0
    // 这里的 num 应为 number
    if (num === true) {
      // 对于 true 值做处理, false 值已经为 0
      num = Number(num)
    }
    // fieldMap 可能有两种形式
    // [男，女]
    // {1: 男}, {2: 女}
    return fieldMap[num] || rawText
  }

const renderATag = url => (
  <a
    href={url}
    rel="noopener noreferrer"
    target="_blank">{_.last(url.split('/'))}
  </a>
)
const FileRender = (rawText, record) => {
  let result
  if (_.isString(rawText) && rawText.length > 0) {
    // 单个文件, 显示为超链接
    result = renderATag(rawText);
  } else if (!_.isEmpty(rawText)) {
    // 多个文件, 显示为一组超链接
    const urlArray = [];
    for (const i of rawText) {
      urlArray.push(renderATag(rawText[i]))
      urlArray.push(<br key={`br${i}`}/>)
    }
    result = <div>{urlArray}</div>;
  }

  return result;
}

export default {
  /**
   * 真正去删除数据
   * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
   * @param ids {Number[]} 数据的 id 数组
   * @param onSuccess {Function} 成功的回调函数
   * @param onFail {Function} 失败的回调函数
   */
  deleteFromDb(model,
               ids,
               onSuccess = (data, status) => logger.info(`删除成功:${status}，${data}`),
               onFail    = (data, status) => logger.info(`删除失败:${status}，${data}`)
  ) {
    logger.debug('准备后端删除数据。。。')
    deleting();
    // 重置计数器
    successCount = 0
    failCount = 0

    const successCallback = (response, status) => {
      successCount++
      if (successCount + failCount === ids.length) {
        notifyAfterDeleted()
        onSuccess(response, status)
      }
    }

    const failCallback = (data, status) => {
      logger.error('delete error, %o', JSON.parse(JSON.stringify(data)));
      failCount++
      if (successCount + failCount === ids.length) {
        notifyAfterDeleted()
        onFail(data, status)
      }
    }

    _.forEach(ids, id => {
      try {
        model.delete(id, {
          showErrorMessage: true,
          onSuccess: successCallback,
          onFail: failCallback
        })
      } catch (exception) {
        failCount++
        if (successCount + failCount === ids.length) {
          notifyAfterDeleted()
        }
        logger.error('delete error, %o', JSON.parse(JSON.stringify(exception)));
      }
    })
  },

  actionsColumn: actions => {
    const width = (70 * actions.length) + 20

    return {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // 固定操作列
      fixed: 'right',
      width: width,
      render: (___, record) => {
        // 控制显示单独 详情 和 编辑按钮
        return (
          <Space>
            {actions.map(
              action => _.isFunction(action) ? action(record) : action
            )}
          </Space>
        )
      }
    }
  },

  getColumns: (model, preColumns = []) => {
    let columns = [...preColumns]
    if (_.isEmpty(columns)) {
      logger.warn(`需要配置 columns`)
      return []
    }

    _.forEach(columns, column => {
      column.dataIndex = column.name || column.dataIndex
      delete column.name
      // 默认使用 i18n 翻译，可通过 columns 中的 title 设置覆盖
      column.title = column.title || i18n.t(`${model.i18nKey}.${model.name}.${column.dataIndex}`) || column.dataIndex

      switch (column.type) {
        case 'image':
          column.render = ImageRender
          break
        case 'file':
          column.render = FileRender
          break
        default:
          // render 为一个映射或者一个数组
          if (_.isObject(column.render) || _.isArray(column.render)) {
            column.render = textRender(column.render)
          }
      }
    })

    return columns
  },

  getTableWidth: (columnsLength, preTableWidth) => {
    let result = preTableWidth
    // 默认自动判断
    if (_.isNil(preTableWidth)) {
      if (columnsLength < 8) {
        result = 800
      } else if (columnsLength < 13) {
        result = 1300
      } else if (columnsLength < 20) {
        result = 2000
      } else {
        result = 3000
      }
    }
    return result
  }
}
