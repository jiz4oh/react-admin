import React from "react";
import PropTypes from "prop-types";
import { Space } from "antd";

import './index.scss'

/**
 *
 * @param actionItems {[]} 右侧按钮
 * @param batchActions {[]} 左侧批量操作按钮
 * @param value {Object[]} 批量操作的记录
 */
function ToolBar({
                   actionItems = [],
                   batchActions = [],
                   value,
                 }) {
  return (
    <>
      <div className="M-table-tool-bar clearfix">
        <Space
          key={'left'}
          className='M-table-tool-bar-batch-actions'
        >
          {
            batchActions.map(
              (Action, index) =>
                <Action key={Action.name || index} records={value}/>
            )
          }
        </Space>
        <Space
          key={'right'}
          className="M-table-tool-bar-action-items"
        >
          {
            actionItems.map(
              (Action, index) =>
                <Action key={Action.name || index}/>
            )
          }
        </Space>
      </div>
    </>
  )
}

ToolBar.propTypes = {
  actionItems: PropTypes.array,
  batchActions: PropTypes.array,
};

export default React.memo(ToolBar)
