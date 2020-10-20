import React from "react";
import PropTypes from "prop-types";
import { Space } from "antd";

import './index.scss'

/**
 *
 * @param actionItems {[]} 右侧按钮
 * @param batchActions {[]} 左侧批量操作按钮
 */
function ToolBar({
                   actionItems = [],
                   batchActions = [],
                 }) {
  return (
    <>
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
