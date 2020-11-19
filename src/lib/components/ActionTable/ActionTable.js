import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import _ from 'lodash'

import ToolBar from "./ToolBar";
import { calTableWidth, renderIndexColumn, renderActionsColumn } from './utils'

/**
 *
 * @param columns {Object[]} antd Table 组件的 columns
 * @param dataSource {Object[]} antd Table 组件的 dataSource
 * @param rowSelection {Object} antd Table 组件的 rowSelection
 * @param actionItems {[]} 列表页工具栏右侧按钮
 * @param batchActions {[]} 列表页工具栏左侧批量操作按钮
 * @param actions {[]} 列表页单条记录的操作按钮
 * @param tableWidth {Number} 表格宽度
 * @param indexColumn {string} 索引列名
 * @param restProps 其他传递给 antd Table 组件的参数
 */
function ActionTable({
                       columns,
                       dataSource,
                       actionItems = [],
                       batchActions = [],
                       actions = [],
                       tableWidth,
                       indexColumn = 'indexColumn',
                       rowSelection,
                       ...restProps
                     }) {
  const [selectedRowKeys, selectRow] = useState([])
  const selectedRow = useMemo(
    () => dataSource.filter(r => selectedRowKeys.includes(r.key)),
    [selectedRowKeys, dataSource]
  )

  columns = useMemo(() => {
    let c = _.cloneDeep(columns)
    c.unshift(renderIndexColumn(indexColumn))
    !_.isEmpty(actions) && c.push(renderActionsColumn(actions))
    return c
  }, [columns, actions, indexColumn])

  tableWidth = useMemo(
    () => tableWidth || calTableWidth(columns.length),
    [tableWidth, columns]
  )

  rowSelection = useMemo(
    () => !_.isEmpty(batchActions) && _.defaultsDeep(rowSelection, {
      selectedRowKeys: selectedRowKeys,
      onChange: selectRow,
    }),
    [rowSelection, batchActions, selectedRowKeys]
  )

  return (
    <div>
      <ToolBar
        actionItems={actionItems}
        batchActions={batchActions}
        batchKeys={selectedRow}
      />
      <Table
        onRow={record => {
          return {
            onDoubleClick: e => {
              if (selectedRowKeys.includes(record.key)) {
                selectRow(selectedRowKeys.filter(key => key !== record.key))
              } else {
                selectRow([record.key])
              }
            },
          }
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        scroll={{
          // 设置整个表格宽度，以固定列
          x: tableWidth,
          // // 设置整个表格高度，以固定表格行
          // y: 800
        }}
        {...restProps}
      />
    </div>
  );
}

ActionTable.propTypes = {
  columns: PropTypes.array,
  actionItems: PropTypes.array,
  batchActions: PropTypes.array,
  actions: PropTypes.array,
  tableWidth: PropTypes.number,
  indexColumn: PropTypes.string
};

export default React.memo(ActionTable)
