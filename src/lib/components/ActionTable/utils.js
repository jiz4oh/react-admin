import React from "react";
import { Space } from "antd";

export function calTableWidth(length) {
  // 默认自动判断
  if (length < 8) {
    return 800
  } else if (length < 13) {
    return 1300
  } else if (length < 20) {
    return 2000
  } else {
    return 3000
  }
}

export function renderActionsColumn(actions) {
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
            actions.map((Action, index) =>
              React.isValidElement(Action)
                ? React.cloneElement(Action, { value: record })
                : <Action key={Action.name || index} value={record}/>
            )
          }
        </Space>
      )
    }
  }
}

export function renderIndexColumn(name) {
  return {
    title: '#',
    dataIndex: name,
    // 固定 # 列
    fixed: 'left',
    width: 130
  }
}
