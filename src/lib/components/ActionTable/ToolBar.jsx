import React from "react";
import PropTypes from "prop-types";
import { Space } from "antd";

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

  batchActions = batchActions.map((Action, index) => {
    if (React.isValidElement(Action)) return Action
    return <Action key={Action.name || index} records={batchKeys}/>
  })

  actionItems = actionItems.map((Action, index) => {
    if (React.isValidElement(Action)) return Action
    return <Action key={Action.name || index}/>
  })

  return (
    <div className={"M-table-tool-bar clearfix " + className} {...restProps}>
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
