import React, {useCallback} from "react";
import {Affix, Button, Modal, notification, Space} from "antd";
import {DeleteOutlined, PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import {useRouteMatch, useHistory} from 'react-router-dom'
import _ from 'lodash'

import './index.scss'
import globalConfig from "../../../config";
import utils from "../table/utils";

import Logger from "../../../common/js/Logger";
import PropTypes from "prop-types";
import { RestfulModel } from "../RestfulModel";
const logger = Logger.getLogger('resourceToolBar')

const newAction = onNew =>
  <Button
    key='newBtn'
    type="primary"
    onClick={onNew}
  >
    <PlusOutlined/>新建
  </Button>

const deleteAction = (onDelete, batchKeys) =>
  <Button
    key='deleteBtn'
    type="primary"
    danger
    disabled={_.isEmpty(batchKeys)}
    onClick={onDelete}
  >
    <DeleteOutlined/>
    {
      !_.isEmpty(batchKeys) && batchKeys.length > 1
        ? '批量删除'
        : '删除'
    }
  </Button>

const handleClickRefresh = onRefresh =>
  e => {
    logger.debug('刷新')
    onRefresh && onRefresh()
  }

/**
 *
 * @param model {Object} 模型类实例，对接后端 api 接口，需要继承 RestfulModel
 * @param canNew {Boolean} 是否显示新建按钮
 * @param canDelete {Boolean} 是否显示删除按钮
 * @param onNew {Function} 点击新建按钮的回调函数，参数为点击事件对象
 * @param onDelete {Function} 点击删除按钮的回调函数，参数为点击事件对象
 * @param onRefresh {Function} 点击刷新按钮的回调函数，参数为点击事件对象
 * @param actionItems {[]} 右侧按钮
 * @param batchActions {[]} 左侧批量操作按钮
 * @param batchKeys {Number[]} 当前批量操作选中项
 */
function RestfulToolBar({
                   model,
                   canNew = true,
                   canDelete = true,
                   onNew,
                   onDelete,
                   onRefresh,
                   actionItems = [],
                   batchActions = [],
                   batchKeys,
                 }) {
  const history = useHistory()
  const match = useRouteMatch()
  actionItems = _.cloneDeep(actionItems)
  batchActions = _.cloneDeep(batchActions)

  const handleClickNew = useCallback(e => {
    e.preventDefault()
    logger.debug('新建')
    history.push(`${match.url}/new`)
  }, [history, match])

  const handleClickDelete = useCallback(e => {
    e.preventDefault()
    logger.debug('删除')

    Modal.confirm({
      title: batchKeys.length > 1 ? '确认批量删除' : '确认删除',
      content: `当前被选中的行: ${batchKeys.join(', ')}`,
      onOk: () => {
        if (globalConfig.debug) {
          notification.success({
            message: '测试删除成功',
            description: `成功删除${batchKeys.length}条数据`,
            duration: 3,
          })
        } else {
          utils.deleteFromDb(model, batchKeys, onRefresh)
        }
      },
    });
  }, [model, batchKeys, onRefresh])

  canDelete && batchActions.unshift(deleteAction(onDelete || handleClickDelete, batchKeys))
  canNew && actionItems.push(newAction(onNew || handleClickNew))

  return (
    <Affix
      offsetTop={8}
      target={() => document.getElementsByClassName('G-app-content')[0]}
    >
      <div className="M-table-tool-bar clearfix">
        <Space
          key={'left'}
          className='M-table-tool-bar-batch-actions'
        >
          {batchActions}
        </Space>
        <Space
          key={'right'}
          className="M-table-tool-bar-action-items"
        >
          {actionItems}
          <Button
            key='refreshBtn'
            onClick={handleClickRefresh(onRefresh)}
          >
            <ReloadOutlined/>
          </Button>
        </Space>
      </div>
    </Affix>
  )
}

RestfulToolBar.propTypes = {
  model: PropTypes.instanceOf(RestfulModel).isRequired,
  actionItems: PropTypes.array,
  batchActions: PropTypes.array,
  batchKeys: PropTypes.array,
};

export default React.memo(RestfulToolBar)
