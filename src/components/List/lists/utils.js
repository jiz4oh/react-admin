import { message, notification, Space } from "antd";
import React from "react";
import _ from 'lodash'

import i18n from "../../../utils/i18n";
import Logger from "../../../utils/Logger";
import { textRender } from "../index";

const logger = Logger.getLogger('tableUtils')
const i18nKey = process.env.REACT_APP_I18N_KEY

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

export default {
  /**
   * 真正去删除数据
   * @param model {Object} 需要具有 delete 方法
   * @param model.delete {Function}
   * @param ids {Number[]} 数据的 id 数组
   * @param onSuccess {Function} 成功的回调函数
   * @param onFail {Function} 失败的回调函数
   */
  deleteFromDb(model,
               ids,
               onSuccess = (data, status) => logger.info(`删除成功:${status}，${data}`),
               onFail = (data, status) => logger.info(`删除失败:${status}，${data}`)
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
        model.delete({
          pk: id,
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
            {
              actions.map(
                (Action, index) =>
                  <Action key={Action.name || index} record={record}/>
              )
            }
          </Space>
        )
      }
    }
  },

  transColumns: (columns = [], tableName = null) => {
    if (_.isEmpty(columns)) {
      logger.warn(`需要配置 columns`)
      return []
    }
    return columns.map(column => {
      // 使用 name 代替 antd 的 dataIndex 属性
      column.dataIndex = column.name || column.dataIndex
      delete column.name
      // 默认使用 i18n 翻译，可通过 columns 中的 title 设置覆盖
      const i18nName = [i18nKey, tableName, column.dataIndex].filter(Boolean).join('.')
      column.title = column.title || i18n.t(`${i18nName}`) || column.dataIndex

      // render 为一个对象或者一个数组
      if (_.isObjectLike(column.render)) {
        column.render = textRender(column.render)
      }

      return column
    })
  },

  getTableWidth: (columnsLength) => {
    // 默认自动判断
    if (columnsLength < 8) {
      return 800
    } else if (columnsLength < 13) {
      return 1300
    } else if (columnsLength < 20) {
      return 2000
    } else {
      return 3000
    }
  },

  //进入全屏
  requestFullScreen: element => {
    element = element || document.documentElement
    element.requestFullscreen && element.requestFullscreen()
    element.mozRequestFullScreen && element.mozRequestFullScreen()
    element.webkitRequestFullScreen && element.webkitRequestFullScreen()
  },

  //退出全屏
  exitFullscreen: () => {
    document.exitFullscreen && document.exitFullscreen()
    document.mozCancelFullScreen && document.mozCancelFullScreen()
    document.webkitCancelFullScreen && document.webkitCancelFullScreen()
  },
}
