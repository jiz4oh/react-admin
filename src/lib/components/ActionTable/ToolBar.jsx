import React from "react";
import PropTypes from "prop-types";
import { Space } from "antd";
import _ from "lodash"

import './ToolBar.scss'

/**
 *
 * @param actionItems {[]} 右侧按钮
 * @param batchActions {[]} 左侧批量操作按钮
 * @param batchKeys {Object[]} 批量操作的记录
 * @param className {String} 样式类名
 * @param restProps {Object}
 */
function ToolBar({
                   actionItems = [],
                   batchActions = [],
                   batchKeys,
                   className,
                   restProps
                 }) {

  batchActions = batchActions.map((BatchAction, index) => {
    if (React.isValidElement(BatchAction)) {
      BatchAction.props = _.defaults(
        { value: batchKeys },
        BatchAction.props,
        { key: BatchAction.name || index }
      )
      return BatchAction
    }
    return <BatchAction key={BatchAction.name || index} value={batchKeys}/>
  })

  actionItems = actionItems.map((ActionItem, index) => {
    return React.isValidElement(ActionItem)
      ? ActionItem
      : <ActionItem key={ActionItem.name || index}/>
  })

  return (
    <div className={`M-table-tool-bar clearfix ${className || ''}`} {...restProps}>
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
      </Space>
    </div>
  )
}

ToolBar.propTypes = {
  actionItems: PropTypes.array,
  batchActions: PropTypes.array,
};

export default React.memo(ToolBar)
